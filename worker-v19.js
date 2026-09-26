import baseWorker from "./worker-v18.js";
export { ExistRelay } from "./worker-v18.js";

const STORED_AI_PROMPT = `You are the SAB riddle/info solver.
Use the complete Info Book returned by this site as authoritative context.
Answer the submitted question as concisely as possible and follow all output rules in the Info Book.
For lookup questions that require only a mutation, Brainrot, count, code, or other direct value, return only that value with no explanation.`;

const json = (data, status=200) => Response.json(data, {
  status,
  headers: {
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "content-type",
    "access-control-allow-methods": "POST,OPTIONS"
  }
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // POST-only client endpoint. The prompt stays on the Worker instead of
    // being supplied by every client request.
    if (url.pathname === "/" && request.method === "GET") return json({ok:false,error:"POST only"}, 405);

    // The public root is also the POST API endpoint. The stored prompt and Info Book are never returned.
    if (url.pathname === "/" && request.method === "POST") {
      url.pathname = "/ask";
      request = new Request(url.toString(), request);
    }

    if (url.pathname === "/ask") {
      const clientToken = request.headers.get("x-riddler-token") || "";
      if (!env.RIDDLER_CLIENT_TOKEN || clientToken !== env.RIDDLER_CLIENT_TOKEN) return json({ok:false,error:"Unauthorized"}, 401);
      if (request.method === "OPTIONS") return new Response(null, {status:204, headers:{
        "access-control-allow-origin":"*",
        "access-control-allow-headers":"content-type",
        "access-control-allow-methods":"POST,OPTIONS"
      }});
      if (request.method !== "POST") return json({ok:false,error:"POST only"}, 405);

      let body;
      try { body = await request.json(); }
      catch { return json({ok:false,error:"Invalid JSON"}, 400); }

      const originalQuestion = String(body?.question ?? body?.q ?? "").trim();
      if (!originalQuestion) return json({ok:false,error:"Missing question"}, 400);
      if (originalQuestion.length > 2000) return json({ok:false,error:"Question too long"}, 413);

      // Preserve a trailing literal number as part of the final concatenated answer.
      // Examples:
      // "the color of sand, 67" -> solve "the color of sand", then append "67"
      // "favorite color 123" -> solve "favorite color", then append "123"
      // Bare numeric questions such as "67" still return "67" directly.
      let question = originalQuestion;
      let literalNumberSuffix = "";

      const suffixMatch = originalQuestion.match(
        /^(.*?)(?:\s*[,;|+]\s*|\s+)(-?\d+(?:\.\d+)?%?)\s*$/
      );

      if (suffixMatch && suffixMatch[1]?.trim()) {
        question = suffixMatch[1].trim().replace(/[\s,;|+]+$/g, "");
        literalNumberSuffix = suffixMatch[2];
      }

      const withLiteralNumber = value =>
        String(value ?? "") + literalNumberSuffix;

      // Fast deterministic answers for literal/common multipart pieces.
      // This prevents simple fragments (especially numbers) from being sent to Gemini.
      const normalizeDirect = value => String(value || "")
        .toLowerCase()
        .replace(/<[^>]*>/g, " ")
        .replace(/[’']/g, "'")
        .replace(/[^a-z0-9']+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const directAnswers = new Map([
        ["the color of grass", "green"],
        ["the color of the grass", "green"],
        ["what color is grass", "green"],
        ["what colour is grass", "green"],
        ["grass color", "green"],
        ["grass colour", "green"],

        ["the color of tree bark", "brown"],
        ["the color of the tree bark", "brown"],
        ["the colour of tree bark", "brown"],
        ["the colour of the tree bark", "brown"],
        ["what color is tree bark", "brown"],
        ["what colour is tree bark", "brown"],
        ["tree bark color", "brown"],
        ["tree bark colour", "brown"],
        ["bark color", "brown"],
        ["bark colour", "brown"],

        ["the color of sand", "yellow"],
        ["the color of the sand", "yellow"],
        ["the colour of sand", "yellow"],
        ["the colour of the sand", "yellow"],
        ["what color is sand", "yellow"],
        ["what colour is sand", "yellow"],
        ["sand color", "yellow"],
        ["sand colour", "yellow"]
      ]);

      const directKey = normalizeDirect(question);

      // Bare numeric clue fragments such as "67" are already the answer.
      if (/^\d+$/.test(directKey)) {
        return json({ok:true,answer:withLiteralNumber(directKey)});
      }

      const directAnswer = directAnswers.get(directKey);
      if (directAnswer) {
        return json({ok:true,answer:withLiteralNumber(directAnswer)});
      }

      // Also support fully-combined simple multipart questions directly on the proxy.
      // Example:
      // "the color of grass, the color of tree bark, the color of sand, 67"
      // -> "greenbrownyellow67"
      if (/[;,]/.test(question)) {
        const pieces = question
          .split(/[;,\n]+/)
          .map(v => v.trim())
          .filter(Boolean);

        const solved = [];
        let allDirect = pieces.length > 1;

        for (const piece of pieces) {
          const k = normalizeDirect(piece);

          if (/^\d+$/.test(k)) {
            solved.push(k);
            continue;
          }

          const a = directAnswers.get(k);
          if (a) {
            solved.push(a);
            continue;
          }

          allDirect = false;
          break;
        }

        if (allDirect) {
          return json({ok:true,answer:withLiteralNumber(solved.join(""))});
        }
      }

      // First check answers already shared/cached by the relay.
      if (env.EXIST_RELAY) {
        try {
          const shared = await env.EXIST_RELAY.get(env.EXIST_RELAY.idFromName("eternal")).fetch(
            new Request("https://internal/ai/shared?q=" + encodeURIComponent(question))
          );
          if (shared.ok) {
            const hit = await shared.json();
            if (hit?.hit && hit?.answer) return json({ok:true,answer:withLiteralNumber(hit.answer)});
          }
        } catch {}
      }

      // Build the final AI prompt on the server so clients only send a question.
      // The Info Book is fetched internally from the previous Worker layer.
      const infoResponse = await baseWorker.fetch(new Request(new URL("/", url), {method:"GET"}), env, ctx);
      if (!infoResponse.ok) return json({ok:false,error:"Info Book unavailable"}, 503);
      const infoBook = await infoResponse.text();
      const prompt = STORED_AI_PROMPT
        + "\n\n=== SAB INFO BOOK ===\n" + infoBook
        + "\n\n=== QUESTION ===\n" + question
        + "\n\nReturn only the final answer.";

      // If an AI provider is configured, send the server-built prompt there.
      // GEMINI_API_KEY is a Worker secret and is never returned to the client.
      if (env.GEMINI_API_KEY) {
        const model = env.GEMINI_MODEL || "gemini-3.5-flash-lite";
        const endpoint =
          "https://generativelanguage.googleapis.com/v1beta/models/" +
          encodeURIComponent(model) +
          ":generateContent?key=" +
          encodeURIComponent(env.GEMINI_API_KEY);

        const body = JSON.stringify({
          contents: [{parts: [{text: prompt}]}]
        });

        let upstream = null;
        let lastStatus = 0;
        let lastError = "";

        // Multipart riddles can send several requests back-to-back.
        // Retry transient Gemini/Google failures so one temporary 5xx/429
        // does not make the whole riddle fail on a later part.
        for (let attempt = 1; attempt <= 4; attempt++) {
          try {
            upstream = await fetch(endpoint, {
              method: "POST",
              headers: {"content-type": "application/json"},
              body
            });

            lastStatus = upstream.status;

            if (upstream.ok) break;

            lastError = (await upstream.text()).slice(0, 1200);
            console.error(
              "Gemini upstream error",
              JSON.stringify({attempt, status:lastStatus, body:lastError})
            );

            const transient =
              lastStatus === 408 ||
              lastStatus === 409 ||
              lastStatus === 429 ||
              lastStatus >= 500;

            if (!transient || attempt === 4) {
              upstream = null;
              break;
            }
          } catch (err) {
            lastError = String(err?.message || err || "fetch failed").slice(0, 1200);
            console.error(
              "Gemini fetch exception",
              JSON.stringify({attempt, error:lastError})
            );
            upstream = null;
            if (attempt === 4) break;
          }

          // Small exponential backoff: 250ms, 500ms, 1000ms.
          await new Promise(resolve => setTimeout(resolve, 250 * (2 ** (attempt - 1))));
        }

        if (!upstream || !upstream.ok) {
          return json({
            ok:false,
            error:"AI temporarily unavailable",
            upstreamStatus:lastStatus || null
          }, 502);
        }

        const data = await upstream.json();
        const answer = String(
          data?.candidates?.[0]?.content?.parts?.map(p => p?.text || "").join("") || ""
        ).trim();

        if (!answer) {
          console.error("Gemini returned an empty answer", JSON.stringify({status:upstream.status}));
          return json({ok:false,error:"Empty AI answer"}, 502);
        }

        // Feed the answer into the existing shared-answer cache when available.
        if (env.EXIST_RELAY) {
          ctx.waitUntil((async()=>{
            try {
              await env.EXIST_RELAY.get(env.EXIST_RELAY.idFromName("eternal")).fetch(new Request("https://internal/ai/shared", {
                method:"POST",
                headers:{"content-type":"application/json","x-eternal-client-ip":request.headers.get("CF-Connecting-IP")||""},
                body:JSON.stringify({question,answer})
              }));
            } catch {}
          })());
        }

        return json({ok:true,answer:withLiteralNumber(answer)});
      }

      // No AI key configured: expose the constructed prompt only when explicitly
      // requested for server-side debugging, never as the normal client answer.
      return json({ok:false,error:"AI provider not configured"}, 503);
    }

    return baseWorker.fetch(request, env, ctx);
  }
};
