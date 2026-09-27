import baseWorker from "./worker-v18.js";
export { ExistRelay } from "./worker-v18.js";

const STORED_AI_PROMPT = `You are the SAB riddle/info solver.
Use the complete Info Book returned by this site as authoritative context.
Answer submitted clues concisely and follow all output rules in the Info Book.
For direct lookups, return only the requested value with no explanation.`;

const json = (data, status=200) => Response.json(data, {
  status,
  headers: {
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "content-type,x-riddler-token",
    "access-control-allow-methods": "POST,OPTIONS"
  }
});

const normalizeDirect = value => String(value || "")
  .toLowerCase()
  .replace(/<[^>]*>/g, " ")
  .replace(/[’']/g, "'")
  .replace(/[^a-z0-9']+/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const directAnswers = new Map([
  ["the color of grass","green"],
  ["the color of the grass","green"],
  ["what color is grass","green"],
  ["what colour is grass","green"],
  ["grass color","green"],
  ["grass colour","green"],

  ["the color of tree bark","brown"],
  ["the color of the tree bark","brown"],
  ["the colour of tree bark","brown"],
  ["the colour of the tree bark","brown"],
  ["what color is tree bark","brown"],
  ["what colour is tree bark","brown"],
  ["tree bark color","brown"],
  ["tree bark colour","brown"],
  ["bark color","brown"],
  ["bark colour","brown"],

  ["the color of sand","yellow"],
  ["the color of the sand","yellow"],
  ["the colour of sand","yellow"],
  ["the colour of the sand","yellow"],
  ["what color is sand","yellow"],
  ["what colour is sand","yellow"],
  ["sand color","yellow"],
  ["sand colour","yellow"]
]);

const NUMBER_ONLY = /^-?\d+(?:\.\d+)?%?$/;

const cleanFragment = value => String(value ?? "")
  .replace(/\r/g, "")
  .trim()
  .split(/\n+/)[0]
  .replace(/^(?:ANSWER|CODE)\s*:\s*/i, "")
  .split(/\s*\|\|\s*ALT\s*:/i)[0]
  .replace(/^['"`]+|['"`]+$/g, "")
  .trim();

function splitMultipart(question) {
  let raw = String(question || "").trim();

  // Turn numbered clue markers like 1/3:, 2/3: into separators.
  raw = raw.replace(/\s*\d+\s*\/\s*\d+\s*[:\-]\s*/g, "\n");

  let pieces = raw
    .split(/[;,\n]+/)
    .map(v => v.trim())
    .filter(Boolean);

  // Also treat a final standalone numeric token as a literal piece even
  // when the sender forgot the comma: "favorite color 67".
  if (pieces.length === 1) {
    const m = raw.match(/^(.*\D)\s+(-?\d+(?:\.\d+)?%?)\s*$/);
    if (m && m[1].trim()) pieces = [m[1].trim(), m[2]];
  }

  return pieces;
}

async function callGemini(env, prompt) {
  if (!env.GEMINI_API_KEY) {
    return {ok:false,status:503,error:"AI provider not configured"};
  }

  const model = env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  const endpoint =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    encodeURIComponent(model) +
    ":generateContent?key=" +
    encodeURIComponent(env.GEMINI_API_KEY);

  const requestBody = JSON.stringify({
    contents: [{parts: [{text: prompt}]}],
    generationConfig: {temperature: 0}
  });

  let lastStatus = 0;

  for (let attempt=1; attempt<=4; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method:"POST",
        headers:{"content-type":"application/json"},
        body:requestBody
      });

      lastStatus = response.status;

      if (response.ok) {
        const data = await response.json();
        const answer = String(
          data?.candidates?.[0]?.content?.parts?.map(p => p?.text || "").join("") || ""
        ).trim();

        if (!answer) return {ok:false,status:502,error:"Empty AI answer"};
        return {ok:true,status:response.status,answer};
      }

      const errorText = (await response.text()).slice(0,1200);
      console.error("Gemini upstream error", JSON.stringify({
        attempt,
        status:response.status,
        body:errorText
      }));

      const transient =
        response.status === 408 ||
        response.status === 409 ||
        response.status === 429 ||
        response.status >= 500;

      if (!transient || attempt === 4) break;
    } catch (err) {
      console.error("Gemini fetch exception", JSON.stringify({
        attempt,
        error:String(err?.message || err || "fetch failed").slice(0,1200)
      }));
      if (attempt === 4) break;
    }

    await new Promise(resolve => setTimeout(resolve, 250 * (2 ** (attempt - 1))));
  }

  return {
    ok:false,
    status:502,
    error:"AI temporarily unavailable",
    upstreamStatus:lastStatus || null
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/" && request.method === "GET") {
      return json({ok:false,error:"POST only"}, 405);
    }

    if (url.pathname === "/" && request.method === "POST") {
      url.pathname = "/ask";
      request = new Request(url.toString(), request);
    }

    if (url.pathname !== "/ask") {
      return baseWorker.fetch(request, env, ctx);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status:204,
        headers:{
          "access-control-allow-origin":"*",
          "access-control-allow-headers":"content-type,x-riddler-token",
          "access-control-allow-methods":"POST,OPTIONS"
        }
      });
    }

    if (request.method !== "POST") return json({ok:false,error:"POST only"}, 405);

    const clientToken = request.headers.get("x-riddler-token") || "";
    if (!env.RIDDLER_CLIENT_TOKEN || clientToken !== env.RIDDLER_CLIENT_TOKEN) {
      return json({ok:false,error:"Unauthorized"}, 401);
    }

    let body;
    try { body = await request.json(); }
    catch { return json({ok:false,error:"Invalid JSON"}, 400); }

    const originalQuestion = String(body?.question ?? body?.q ?? "").trim();
    if (!originalQuestion) return json({ok:false,error:"Missing question"}, 400);
    if (originalQuestion.length > 2000) return json({ok:false,error:"Question too long"}, 413);

    // A number by itself is already the final answer. Never spend an AI call on it.
    if (NUMBER_ONLY.test(originalQuestion)) {
      return json({ok:true,answer:originalQuestion});
    }

    const pieces = splitMultipart(originalQuestion);
    const isMultipart = pieces.length > 1;

    // Single direct fact can also bypass Gemini.
    if (!isMultipart) {
      const direct = directAnswers.get(normalizeDirect(originalQuestion));
      if (direct) return json({ok:true,answer:direct});

      // Shared answer cache is useful for ordinary one-part questions.
      if (env.EXIST_RELAY) {
        try {
          const shared = await env.EXIST_RELAY.get(env.EXIST_RELAY.idFromName("eternal")).fetch(
            new Request("https://internal/ai/shared?q=" + encodeURIComponent(originalQuestion))
          );
          if (shared.ok) {
            const hit = await shared.json();
            if (hit?.hit && hit?.answer) {
              return json({ok:true,answer:String(hit.answer)});
            }
          }
        } catch {}
      }
    }

    const infoResponse = await baseWorker.fetch(
      new Request(new URL("/", url), {method:"GET"}),
      env,
      ctx
    );

    if (!infoResponse.ok) {
      return json({ok:false,error:"Info Book unavailable"}, 503);
    }

    const infoBook = await infoResponse.text();

    let finalAnswer = "";

    if (isMultipart) {
      // Build the result slots first. Numeric pieces and known direct facts are
      // solved locally. Only unresolved text clues are sent to Gemini.
      const slots = new Array(pieces.length);
      const unresolved = [];

      for (let i=0; i<pieces.length; i++) {
        const piece = pieces[i];

        if (NUMBER_ONLY.test(piece)) {
          slots[i] = piece;
          continue;
        }

        const direct = directAnswers.get(normalizeDirect(piece));
        if (direct) {
          slots[i] = direct;
          continue;
        }

        unresolved.push({index:i, clue:piece});
      }

      // If every piece was a number/direct local fact, this costs zero AI credits.
      if (unresolved.length === 0) {
        return json({ok:true,answer:slots.join("")});
      }

      // ONE Gemini request solves every unresolved clue at once.
      // Numeric pieces are deliberately omitted so they cannot be interpreted
      // as riddles or changed by the model.
      const clueList = unresolved
        .map((row, i) => (i + 1) + ". " + row.clue)
        .join("\n");

      const prompt =
        STORED_AI_PROMPT +
        "\n\n=== SAB INFO BOOK ===\n" + infoBook +
        "\n\n=== MULTIPART MODE ===\n" +
        "Solve every clue below in order in ONE response.\n" +
        "Return exactly one answer per clue.\n" +
        "Separate answers ONLY with the exact delimiter |||.\n" +
        "Do not include numbering, labels, explanations, markdown, or extra text.\n" +
        "There are exactly " + unresolved.length + " clues, so return exactly " +
        unresolved.length + " answer fragments.\n\n" +
        clueList;

      const ai = await callGemini(env, prompt);
      if (!ai.ok) {
        return json({
          ok:false,
          error:ai.error,
          upstreamStatus:ai.upstreamStatus ?? null
        }, ai.status || 502);
      }

      let answers = String(ai.answer)
        .split("|||")
        .map(cleanFragment)
        .filter(v => v !== "");

      // For one unresolved clue, a delimiter is unnecessary.
      if (unresolved.length === 1 && answers.length !== 1) {
        answers = [cleanFragment(ai.answer)];
      }

      if (answers.length !== unresolved.length) {
        console.error("Multipart answer count mismatch", JSON.stringify({
          expected:unresolved.length,
          got:answers.length,
          raw:String(ai.answer).slice(0,1200)
        }));
        return json({ok:false,error:"Multipart answer format error"}, 502);
      }

      for (let i=0; i<unresolved.length; i++) {
        slots[unresolved[i].index] = answers[i];
      }

      finalAnswer = slots.join("");
    } else {
      const prompt =
        STORED_AI_PROMPT +
        "\n\n=== SAB INFO BOOK ===\n" + infoBook +
        "\n\n=== QUESTION ===\n" + originalQuestion +
        "\n\nReturn only the final answer.";

      const ai = await callGemini(env, prompt);
      if (!ai.ok) {
        return json({
          ok:false,
          error:ai.error,
          upstreamStatus:ai.upstreamStatus ?? null
        }, ai.status || 502);
      }

      finalAnswer = cleanFragment(ai.answer);
    }

    if (!finalAnswer) return json({ok:false,error:"Empty AI answer"}, 502);

    // Store only the final combined answer. This does not create extra Gemini calls.
    if (env.EXIST_RELAY) {
      ctx.waitUntil((async()=>{
        try {
          await env.EXIST_RELAY.get(env.EXIST_RELAY.idFromName("eternal")).fetch(
            new Request("https://internal/ai/shared", {
              method:"POST",
              headers:{
                "content-type":"application/json",
                "x-eternal-client-ip":request.headers.get("CF-Connecting-IP") || ""
              },
              body:JSON.stringify({
                question:originalQuestion,
                answer:finalAnswer
              })
            })
          );
        } catch {}
      })());
    }

    return json({ok:true,answer:finalAnswer});
  }
};
