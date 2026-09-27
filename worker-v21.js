import baseWorker from "./worker-v18.js";
export { ExistRelay } from "./worker-v18.js";

const WORKER_CACHE_VERSION = "v21";

const STORED_AI_PROMPT = `You are the SAB riddle/info solver.
Use the supplied SAB Info Book as authoritative context when needed.
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

  raw = raw.replace(/\s*\d+\s*\/\s*\d+\s*[:\-]\s*/g, "\n");

  let pieces = raw
    .split(/[;,\n]+/)
    .map(v => v.trim())
    .filter(Boolean);

  if (pieces.length === 1) {
    const m = raw.match(/^(.*\D)\s+(-?\d+(?:\.\d+)?%?)\s*$/);
    if (m && m[1].trim()) pieces = [m[1].trim(), m[2]];
  }

  return pieces;
}

function isLiveIndexQuestion(question) {
  const q = normalizeDirect(question);
  return (
    q.includes("exist count") ||
    q.includes("copies") ||
    q.includes("cached exist") ||
    q.includes("exist cache") ||
    q.includes("index total") ||
    q.includes("brainrots in the index") ||
    q.includes("mutations scanned") ||
    q.includes("mutation scan count") ||
    /how many .* exist/.test(q)
  );
}

function edgeCacheKey(url, question) {
  const u = new URL(url);
  u.pathname = "/__answer_cache/" + WORKER_CACHE_VERSION + "/" + encodeURIComponent(normalizeDirect(question));
  u.search = "";
  return new Request(u.toString(), {method:"GET"});
}

async function getEdgeAnswer(url, question) {
  if (isLiveIndexQuestion(question) || typeof caches === "undefined") return null;

  try {
    const hit = await caches.default.match(edgeCacheKey(url, question));
    if (!hit) return null;

    const data = await hit.json();
    const answer = cleanFragment(data?.answer);
    return answer || null;
  } catch {
    return null;
  }
}

async function putEdgeAnswer(ctx, url, question, answer) {
  if (isLiveIndexQuestion(question) || typeof caches === "undefined") return;

  const clean = cleanFragment(answer);
  if (!clean) return;

  ctx.waitUntil((async()=>{
    try {
      await caches.default.put(
        edgeCacheKey(url, question),
        new Response(JSON.stringify({answer:clean}), {
          headers:{
            "content-type":"application/json",
            "cache-control":"public, max-age=21600"
          }
        })
      );
    } catch {}
  })());
}

let infoBookCacheText = "";
let infoBookCacheUntil = 0;

async function getInfoBook(url, env, ctx, forceFresh=false) {
  const now = Date.now();

  // Static/general riddles can reuse the already-built Info Book briefly.
  // Live exist-count questions bypass this cache.
  if (!forceFresh && infoBookCacheText && now < infoBookCacheUntil) {
    return infoBookCacheText;
  }

  const response = await baseWorker.fetch(
    new Request(new URL("/", url), {method:"GET"}),
    env,
    ctx
  );

  if (!response.ok) throw new Error("Info Book unavailable");

  const text = await response.text();

  if (!forceFresh) {
    infoBookCacheText = text;
    infoBookCacheUntil = now + 60000;
  }

  return text;
}

async function callGemini(env, prompt, maxOutputTokens=128) {
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
    generationConfig: {
      temperature: 0,
      candidateCount: 1,
      maxOutputTokens
    }
  });

  let lastStatus = 0;

  // Keep retries short: fast normal path, but still recover from a brief 429/5xx.
  for (let attempt=1; attempt<=3; attempt++) {
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

      const errorText = (await response.text()).slice(0,800);
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

      if (!transient || attempt === 3) break;
    } catch (err) {
      console.error("Gemini fetch exception", JSON.stringify({
        attempt,
        error:String(err?.message || err || "fetch failed").slice(0,800)
      }));
      if (attempt === 3) break;
    }

    await new Promise(resolve => setTimeout(resolve, attempt === 1 ? 100 : 250));
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

    // Zero-cost literal path.
    if (NUMBER_ONLY.test(originalQuestion)) {
      return json({ok:true,answer:originalQuestion});
    }

    const pieces = splitMultipart(originalQuestion);
    const isMultipart = pieces.length > 1;

    if (!isMultipart) {
      const direct = directAnswers.get(normalizeDirect(originalQuestion));
      if (direct) return json({ok:true,answer:direct});

      // Fast edge cache first.
      const edgeHit = await getEdgeAnswer(url, originalQuestion);
      if (edgeHit) return json({ok:true,answer:edgeHit});

      // Then the existing shared answer store.
      if (env.EXIST_RELAY) {
        try {
          const shared = await env.EXIST_RELAY.get(env.EXIST_RELAY.idFromName("eternal")).fetch(
            new Request("https://internal/ai/shared?q=" + encodeURIComponent(originalQuestion))
          );
          if (shared.ok) {
            const hit = await shared.json();
            if (hit?.hit && hit?.answer) {
              const answer = String(hit.answer);
              putEdgeAnswer(ctx, url, originalQuestion, answer);
              return json({ok:true,answer});
            }
          }
        } catch {}
      }
    } else {
      // Exact repeated multipart riddles can be returned immediately too.
      const edgeHit = await getEdgeAnswer(url, originalQuestion);
      if (edgeHit) return json({ok:true,answer:edgeHit});
    }

    let finalAnswer = "";

    if (isMultipart) {
      const slots = new Array(pieces.length);
      const unresolved = [];

      // Resolve literal/direct pieces immediately.
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

      if (unresolved.length === 0) {
        finalAnswer = slots.join("");
        putEdgeAnswer(ctx, url, originalQuestion, finalAnswer);
        return json({ok:true,answer:finalAnswer});
      }

      // Check all unresolved clue caches in parallel while the Info Book is being prepared.
      const infoPromise = getInfoBook(url, env, ctx, isLiveIndexQuestion(originalQuestion));
      const cachedPieces = await Promise.all(
        unresolved.map(row => getEdgeAnswer(url, row.clue))
      );

      const stillUnresolved = [];
      for (let i=0; i<unresolved.length; i++) {
        const row = unresolved[i];
        const cached = cachedPieces[i];

        if (cached) {
          slots[row.index] = cached;
        } else {
          stillUnresolved.push(row);
        }
      }

      if (stillUnresolved.length === 0) {
        finalAnswer = slots.join("");
        putEdgeAnswer(ctx, url, originalQuestion, finalAnswer);
        return json({ok:true,answer:finalAnswer});
      }

      const infoBook = await infoPromise;

      // ONE AI request for every clue that was not already literal/direct/cached.
      const clueList = stillUnresolved
        .map((row, i) => (i + 1) + ". " + row.clue)
        .join("\n");

      const prompt =
        STORED_AI_PROMPT +
        "\n\n=== SAB INFO BOOK ===\n" + infoBook +
        "\n\n=== MULTIPART MODE ===\n" +
        "Solve every clue below in order in ONE response.\n" +
        "Return exactly one short answer per clue.\n" +
        "Separate answers ONLY with |||.\n" +
        "No numbering, labels, explanations, markdown, or extra text.\n" +
        "Return exactly " + stillUnresolved.length + " fragments.\n\n" +
        clueList;

      const ai = await callGemini(
        env,
        prompt,
        Math.max(64, Math.min(256, stillUnresolved.length * 48))
      );

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

      if (stillUnresolved.length === 1 && answers.length !== 1) {
        answers = [cleanFragment(ai.answer)];
      }

      if (answers.length !== stillUnresolved.length) {
        console.error("Multipart answer count mismatch", JSON.stringify({
          expected:stillUnresolved.length,
          got:answers.length,
          raw:String(ai.answer).slice(0,800)
        }));
        return json({ok:false,error:"Multipart answer format error"}, 502);
      }

      for (let i=0; i<stillUnresolved.length; i++) {
        const row = stillUnresolved[i];
        const answer = answers[i];
        slots[row.index] = answer;
        putEdgeAnswer(ctx, url, row.clue, answer);
      }

      finalAnswer = slots.join("");
    } else {
      const infoBook = await getInfoBook(
        url,
        env,
        ctx,
        isLiveIndexQuestion(originalQuestion)
      );

      const prompt =
        STORED_AI_PROMPT +
        "\n\n=== SAB INFO BOOK ===\n" + infoBook +
        "\n\n=== QUESTION ===\n" + originalQuestion +
        "\n\nReturn only the final answer.";

      const ai = await callGemini(env, prompt, 96);

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

    // Make the next identical request nearly instant and free.
    putEdgeAnswer(ctx, url, originalQuestion, finalAnswer);

    // Keep the existing shared-answer store in the background.
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
