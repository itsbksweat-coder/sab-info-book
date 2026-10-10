import baseWorker from "./worker-v18.js";
export { ExistRelay } from "./worker-v18.js";

const WORKER_CACHE_VERSION = "v30";

const STORED_AI_PROMPT = `You are TRACED RIDDLER, a deterministic solver for Steal a Brainrot (SAB) riddles and code clues.

PRIMARY GOAL
Return the exact answer fragment the game expects. Do not chat. Do not explain reasoning.

SOURCE PRIORITY
1. Rules and authoritative hardcoded game facts in this prompt.
2. RECENT CLIENT DATA supplied with the request. Treat live Animals/Traits/Mutations context from the client as newer than stored Info Book data.
3. The supplied SAB Info Book.
4. Obvious real-world/common-knowledge facts only when the clue is not SAB-specific.
Never invent an SAB-specific fact that is not supported by these sources.

INTERPRETATION
- Treat spelling, capitalization, punctuation, apostrophes, minor grammar mistakes, singular/plural forms, aliases, abbreviations, and partial canonical names flexibly.
- In Sammy/Eternal riddles, "my", "me", "I", "his", and "Sammy" refer to Sammy when context makes that clear.
- Prefer canonical Brainrot, mutation, rarity, trait, update, event, machine, and item names from the Info Book.
- A standalone number is literal. Never turn a bare number into a riddle. Preserve its digits exactly.
- If asked for a name, return the name only. If asked for a count/number, return the number only. If asked for a mutation, return the mutation only.
- "best", "highest", "most", "strongest" means the highest applicable numeric value unless the Info Book explicitly defines otherwise.
- "worst", "lowest", "least", "weakest", "rarest" means the lowest applicable numeric value/count unless wording or the Info Book says otherwise.
- For exist counts, use live/current count data when supplied and never fabricate a missing count.

OUTPUT CONTRACT
- Output ONLY the requested answer value or fragment.
- No explanations, markdown, labels, quotes, prefixes, suffixes, or commentary.
- Never write "Answer:", "Code:", "The answer is", or similar text.
- Use the exact delimiter requested by an outer multipart instruction.
- Do not add a delimiter to a single-part answer.

MULTIPART / CODE RIDDLES
- Solve each clue independently in the original order.
- Do not let one clue alter another clue's meaning.
- Bare numeric pieces remain unchanged.
- When the pieces form a code, concatenate final fragments in clue order with no spaces or punctuation unless the caller explicitly asks for a delimiter.
- Example: "favorite color, my cat, 67" => bluenova67
- Example: "the color of grass, the color of tree bark, the color of sand, 67" => greenbrownyellow67
- If the outer instruction requires ||| between fragments, return the independent fragments with exactly ||| instead of concatenating them.

WORD-ORDER RULES
- "spell X backwards" or a single answer "backwards" means reverse characters.
- "backwards order" or "reverse the order" for a list means reverse list elements, not letters inside the elements.

UPDATE / EVENT RULES
- When asked which update/event/theme something released in, return the update/event/theme NAME if the question asks for the name.
- Return an Update number only when the question explicitly asks for the number.
- Pot Pumpkin release theme/name => Halloween.

SAMMY / ETERNAL HARD FACTS
- Name: Sammy
- Favorite Brainrot: Meowl
- Least Favorite Brainrot: Raccooni Jandelini
- Favorite color: Blue
- Favorite Travis Scott album: Astro World
- Birth month: February
- Age: 24
- Weight: 250
- Place after Admin Abuse: Gym
- Cat name: Nova
- Favorite mutation: Galaxy
- Anti-cheat developer name: Adam

COMMON OBJECT COLORS
- grass/leaves/tree/frog => green
- sky/ocean/sea/water => blue
- sun/banana/lemon/cheese/sand => yellow
- snow/cloud/milk/paper => white
- blood/fire/tomato/strawberry/apple/rose => red
- night/coal => black
- orange/carrot/pumpkin => orange
- chocolate/dirt/mud/wood/tree bark => brown
- pig/flamingo => pink
- grape/lavender => purple

MUTATION MODIFIERS — AUTHORITATIVE LAST-WORKING GAME DATA
- Gold 0.25
- Diamond 0.5
- Bloodrot 1
- Candy 3
- Lava 5
- Galaxy 6
- Yin Yang 6.5
- Radioactive 7.5
- Cursed 8
- Rainbow 9
- Divine 9
- Cyber 10
- Phantom 11
- Crystal 12
- Eclipse 12.5
When comparing mutations, use these exact game-data Modifier values. Do not substitute older multiplier values.

BASE SKINS — LAST-WORKING DATA
1 OF 1
Bee Emperor
Bunny Basket
Headless
Honey Bee
John Pork
Meowl
Pot of Gold
Skibidi
Spyder
Strawberry

RANKED 1/1 RULE
For "best/highest 1/1 mutation", compare only that Brainrot's tracked 1/1 mutations and return the highest Modifier mutation from the authoritative mutation table above. For "worst/lowest", return the lowest Modifier mutation. Return only the mutation name.

DATE RULES
A CURRENT DATE CONTEXT is supplied by the Worker. Use it for "today", "current date", "date/day of the month", current month/year, and weekday-relative questions. For date/day of the month, return only the numeric day.

FINAL CHECK
Before answering: use the Info Book instead of guessing SAB facts; preserve literal numbers; preserve multipart order; return only the exact requested value.`;

const json = (data, status=200) => Response.json({...data, workerVersion:WORKER_CACHE_VERSION}, {
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
  ["my name","sammy"],
  ["what is my name","sammy"],
  ["whats my name","sammy"],
  ["what's my name","sammy"],
  ["sammy name","sammy"],
  ["the color of my avatar","red"],
  ["the colour of my avatar","red"],
  ["my avatar color","red"],
  ["my avatar colour","red"],
  ["my cats name","nova"],
  ["my cat name","nova"],
  ["my cat's name","nova"],
  ["name of my cat","nova"],
  ["my favorite brainrot","meowl"],
  ["my favourite brainrot","meowl"],
  ["favorite brainrot","meowl"],
  ["favourite brainrot","meowl"],
  ["my least favorite brainrot","raccooni jandelini"],
  ["my least favourite brainrot","raccooni jandelini"],
  ["my favorite color","blue"],
  ["my favourite colour","blue"],
  ["my favorite mutation","galaxy"],
  ["my favourite mutation","galaxy"],
  ["my birth month","february"],
  ["my birthday month","february"],
  ["my age","24"],
  ["my weight","250"],
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

const CAPITALS = new Map([
  ["france","paris"],["italy","rome"],["germany","berlin"],["spain","madrid"],
  ["portugal","lisbon"],["japan","tokyo"],["china","beijing"],["india","newdelhi"],
  ["canada","ottawa"],["mexico","mexicocity"],["brazil","brasilia"],["australia","canberra"],
  ["russia","moscow"],["egypt","cairo"],["england","london"],["britain","london"],
  ["united kingdom","london"],["south korea","seoul"],["north korea","pyongyang"],
  ["argentina","buenosaires"],["sweden","stockholm"],["norway","oslo"],["finland","helsinki"],
  ["denmark","copenhagen"],["ireland","dublin"],["greece","athens"],["turkey","ankara"],
  ["thailand","bangkok"],["vietnam","hanoi"],["philippines","manila"],["indonesia","jakarta"],
  ["singapore","singapore"],["switzerland","bern"],["austria","vienna"],["belgium","brussels"],
  ["netherlands","amsterdam"],["poland","warsaw"],["ukraine","kyiv"],["romania","bucharest"],
  ["hungary","budapest"],["czechia","prague"],["czech republic","prague"],["iceland","reykjavik"],
  ["cuba","havana"],["peru","lima"],["chile","santiago"],["colombia","bogota"],
  ["venezuela","caracas"],["morocco","rabat"],["kenya","nairobi"],["nigeria","abuja"],
  ["ethiopia","addisababa"],["new zealand","wellington"],["united states","washingtondc"],
  ["usa","washingtondc"],["america","washingtondc"]
]);

const CAPITAL_CITY_SELF = new Map([
  ["paris","paris"],["rome","rome"],["berlin","berlin"],["madrid","madrid"],["lisbon","lisbon"],
  ["tokyo","tokyo"],["beijing","beijing"],["ottawa","ottawa"],["brasilia","brasilia"],
  ["canberra","canberra"],["moscow","moscow"],["cairo","cairo"],["london","london"],
  ["seoul","seoul"],["oslo","oslo"],["helsinki","helsinki"],["copenhagen","copenhagen"],
  ["dublin","dublin"],["athens","athens"],["ankara","ankara"],["bangkok","bangkok"],
  ["hanoi","hanoi"],["manila","manila"],["jakarta","jakarta"],["bern","bern"],
  ["vienna","vienna"],["brussels","brussels"],["amsterdam","amsterdam"],["warsaw","warsaw"],
  ["kyiv","kyiv"],["prague","prague"],["reykjavik","reykjavik"],["havana","havana"],
  ["lima","lima"],["santiago","santiago"],["bogota","bogota"],["caracas","caracas"],
  ["rabat","rabat"],["nairobi","nairobi"],["abuja","abuja"],["wellington","wellington"]
]);

function directGenericAnswer(question) {
  const q = normalizeDirect(question);

  const literalWord =
    q.match(/^the word ([a-z0-9]+)$/) ||
    q.match(/^word ([a-z0-9]+)$/) ||
    q.match(/^the literal word ([a-z0-9]+)$/);
  if (literalWord) return literalWord[1];

  // Flexible Sammy/persona phrasing should never need an upstream AI call.
  if (q.includes("least favorite brainrot") || q.includes("least favourite brainrot")) {
    return "raccooni jandelini";
  }
  if (q.includes("favorite brainrot") || q.includes("favourite brainrot")) {
    return "meowl";
  }
  if (q.includes("favorite color") || q.includes("favourite colour")) {
    return "blue";
  }
  if (q.includes("favorite mutation") || q.includes("favourite mutation")) {
    return "galaxy";
  }
  if (q.includes("cat") && q.includes("name")) return "nova";
  if (q.includes("birth") && q.includes("month")) return "february";
  if (q.includes("travis") && q.includes("album")) return "astro world";
  if ((q.includes("my age") || q.includes("sammy age") || q.includes("how old is sammy"))) return "24";
  if ((q.includes("my weight") || q.includes("sammy weight") || q.includes("how much does sammy weigh"))) return "250";

  if (q.includes("capital")) {
    for (const [country, capital] of CAPITALS) {
      if (q.includes(country)) return capital;
    }
    for (const [city, answer] of CAPITAL_CITY_SELF) {
      if (q.includes(city)) return answer;
    }
  }

  return null;
}

function looksSabSpecific(question) {
  const q = normalizeDirect(question);
  return /\b(brainrot|mutation|rarity|fuse|craft|lucky block|admin abuse|sammy|meowl|jandelini|exist count|index|trait|base skin|red carpet|income per second|generation|og)\b/.test(q);
}

function centralDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).formatToParts(date);

  const out = {};
  for (const part of parts) {
    if (part.type !== "literal") out[part.type] = part.value;
  }
  return out;
}

function currentPromptContext() {
  const p = centralDateParts();
  return [
    "CURRENT DATE CONTEXT (America/Chicago):",
    "weekday=" + (p.weekday || ""),
    "month=" + (p.month || ""),
    "day=" + (p.day || ""),
    "year=" + (p.year || "")
  ].join("\n");
}

function directDateAnswer(question) {
  const q = normalizeDirect(question);

  let offsetDays = 0;

  if (q.includes("day after tomorrow")) {
    offsetDays = 2;
  } else if (q.includes("day before yesterday")) {
    offsetDays = -2;
  } else if (q.includes("tomorrow")) {
    offsetDays = 1;
  } else if (q.includes("yesterday")) {
    offsetDays = -1;
  } else {
    const future =
      q.match(/\bin\s+(\d+)\s+days?\b/) ||
      q.match(/\b(\d+)\s+days?\s+from\s+now\b/) ||
      q.match(/\b(\d+)\s+days?\s+later\b/);

    const past =
      q.match(/\b(\d+)\s+days?\s+ago\b/) ||
      q.match(/\b(\d+)\s+days?\s+before\s+today\b/);

    if (future) offsetDays = Number(future[1]) || 0;
    if (past) offsetDays = -(Number(past[1]) || 0);
  }

  const when = new Date(Date.now() + offsetDays * 86400000);
  const p = centralDateParts(when);

  const asksDay =
    q.includes("date of the month") ||
    q.includes("day of the month") ||
    q.includes("day of month") ||
    q.includes("todays date") ||
    q.includes("today's date") ||
    q.includes("today date") ||
    q.includes("yesterdays date") ||
    q.includes("yesterday's date") ||
    q.includes("tomorrows date") ||
    q.includes("tomorrow's date") ||
    q === "date" ||
    q === "day" ||
    q === "current date" ||
    q === "current day";

  if (asksDay && p.day) return String(p.day);
  if ((q === "month" || q === "current month" || q.includes("what month")) && p.month) {
    return String(p.month).toLowerCase();
  }
  if ((q === "year" || q === "current year" || q.includes("what year")) && p.year) {
    return String(p.year);
  }
  return null;
}

function directContextAnswer(question, context) {
  const q = normalizeDirect(question);
  const c = String(context || "").toLowerCase();

  const asksDevice =
    q.includes("device") &&
    (q.includes("using") || q.includes("on") || q.includes("right now"));

  if (asksDevice && c) {
    const lines = c.split(/\r?\n/).reverse();
    for (const line of lines) {
      if (/\biphone\b|\bphone\b|\bmobile\b/.test(line)) return "phone";
      if (/\blaptop\b/.test(line)) return "laptop";
      if (/\bipad\b/.test(line)) return "ipad";
      if (/\btablet\b/.test(line)) return "tablet";
      if (/\bdesktop\b|\bcomputer\b|\bpc\b/.test(line)) return "computer";
    }
  }

  return null;
}

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

  raw = raw.replace(/^\s*(?:riddle|question|clue)\s*(?:is)?\s*[:\-]\s*/i, "");

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


function selectInfoBookContext(question, infoBook, maxChars=28000) {
  const source = String(infoBook || "");
  if (!source || source.length <= maxChars) return source;

  const stop = new Set([
    "the","a","an","of","in","on","at","for","from","to","is","are","was","were",
    "what","which","who","when","where","how","my","me","i","his","her","their",
    "best","worst","highest","lowest","most","least","brainrot","brainrots"
  ]);

  const q = normalizeDirect(question);
  const tokens = [...new Set(
    q.split(/\s+/)
      .map(v => v.replace(/[^a-z0-9]/g, ""))
      .filter(v => v.length >= 3 && !stop.has(v))
  )];

  const lines = source.split(/\r?\n/);
  const scored = [];

  for (let i=0; i<lines.length; i++) {
    const normalized = normalizeDirect(lines[i]);
    if (!normalized) continue;

    let score = 0;
    for (const token of tokens) {
      if (normalized.includes(token)) {
        score += token.length >= 8 ? 7 : token.length >= 5 ? 4 : 2;
      }
    }

    if (q.includes("fuse") && normalized.includes("fuse")) score += 5;
    if (q.includes("mutation") && normalized.includes("mutation")) score += 5;
    if (q.includes("trait") && normalized.includes("trait")) score += 5;
    if (q.includes("lucky block") && normalized.includes("lucky block")) score += 6;
    if (q.includes("rarity") && normalized.includes("rarity")) score += 4;
    if ((q.includes("income") || q.includes("generation")) && normalized.includes("generation")) score += 5;
    if ((q.includes("price") || q.includes("cost")) &&
        (normalized.includes("price") || normalized.includes("cost"))) score += 5;

    if (score > 0) scored.push({i, score});
  }

  if (!scored.length) return source.slice(0, maxChars);

  scored.sort((a,b) => b.score - a.score || a.i - b.i);

  const selected = new Set();
  for (const row of scored.slice(0, 140)) {
    for (let j=Math.max(0,row.i-2); j<=Math.min(lines.length-1,row.i+2); j++) {
      selected.add(j);
    }
  }

  let out = "";
  for (const i of [...selected].sort((a,b)=>a-b)) {
    const next = lines[i] + "\n";
    if (out.length + next.length > maxChars) break;
    out += next;
  }

  return out || source.slice(0, maxChars);
}

function uniqueModels(env) {
  const values = [
    env.GEMINI_MODEL,
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash",
    "gemini-3.5-flash"
  ].filter(Boolean);

  return [...new Set(values.map(v => String(v).trim()).filter(Boolean))];
}

function generationConfigFor(model, maxOutputTokens) {
  const config = {
    temperature: 0,
    topP: 0.1,
    candidateCount: 1,
    // Gemini 3 thinking tokens count toward this budget too. Keep enough room
    // that a short answer is not accidentally cut off during reasoning.
    maxOutputTokens: Math.max(Number(maxOutputTokens) || 128, 768)
  };

  if (String(model).startsWith("gemini-3")) {
    config.thinkingConfig = {
      thinkingLevel: "low"
    };
  }

  return config;
}

async function callGemini(env, prompt, maxOutputTokens=128) {
  if (!env.GEMINI_API_KEY) {
    return {ok:false,status:503,error:"AI provider not configured"};
  }

  const models = uniqueModels(env);
  let lastStatus = 0;
  let lastError = "AI temporarily unavailable";

  for (const model of models) {
    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      encodeURIComponent(model) +
      ":generateContent";

    const requestBody = JSON.stringify({
      contents: [{
        role:"user",
        parts:[{text:String(prompt)}]
      }],
      generationConfig: generationConfigFor(model, maxOutputTokens)
    });

    for (let attempt=1; attempt<=2; attempt++) {
      try {
        const response = await fetch(endpoint, {
          method:"POST",
          headers:{
            "content-type":"application/json",
            "x-goog-api-key":String(env.GEMINI_API_KEY)
          },
          body:requestBody
        });

        lastStatus = response.status;

        if (response.ok) {
          const data = await response.json();

          const answer = String(
            data?.candidates?.[0]?.content?.parts
              ?.map(part => part?.text || "")
              .join("") || ""
          ).trim();

          if (answer) {
            return {
              ok:true,
              status:response.status,
              answer,
              model
            };
          }

          const finishReason =
            data?.candidates?.[0]?.finishReason ||
            data?.promptFeedback?.blockReason ||
            "empty";

          lastError = "Empty AI answer: " + finishReason;
          console.error("Gemini empty answer", JSON.stringify({
            model,
            finishReason
          }));

          // Empty output from one model should try the next model.
          break;
        }

        const errorText = (await response.text()).slice(0,1200);
        lastError = errorText || ("HTTP " + response.status);

        console.error("Gemini upstream error", JSON.stringify({
          model,
          attempt,
          status:response.status,
          body:errorText
        }));

        const modelProblem =
          response.status === 404 ||
          (response.status === 400 &&
            /model|not found|unsupported|unknown|thinking/i.test(errorText));

        if (modelProblem) break;

        const transient =
          response.status === 408 ||
          response.status === 409 ||
          response.status === 429 ||
          response.status >= 500;

        if (!transient || attempt === 2) break;
      } catch (err) {
        lastError = String(
          err?.message || err || "fetch failed"
        ).slice(0,1200);

        console.error("Gemini fetch exception", JSON.stringify({
          model,
          attempt,
          error:lastError
        }));

        if (attempt === 2) break;
      }

      await new Promise(resolve => setTimeout(resolve, 120));
    }
  }

  return {
    ok:false,
    status:502,
    error:"AI unavailable across model fallbacks",
    upstreamStatus:lastStatus || null,
    detail:lastError
  };
}

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

    if (url.pathname === "/health" && request.method === "GET") {
      return json({
        ok:true,
        worker:"riddler",
        version:WORKER_CACHE_VERSION,
        aiConfigured:Boolean(env.GEMINI_API_KEY),
        tokenConfigured:Boolean(env.RIDDLER_CLIENT_TOKEN),
        configuredModel:env.GEMINI_MODEL || null,
        fallbackModels:uniqueModels(env),
        mode:"ai-first"
      });
    }

    if (url.pathname === "/probe" && request.method === "POST") {
      const clientToken = request.headers.get("x-riddler-token") || "";
      if (!env.RIDDLER_CLIENT_TOKEN || clientToken !== env.RIDDLER_CLIENT_TOKEN) {
        return json({ok:false,error:"Unauthorized"}, 401);
      }

      const ai = await callGemini(
        env,
        "Return only the exact word OK",
        64
      );

      if (!ai.ok) {
        return json({
          ok:false,
          error:ai.error,
          upstreamStatus:ai.upstreamStatus ?? null,
          detail:ai.detail ?? null
        }, ai.status || 502);
      }

      modelUsed = ai.model || modelUsed;

      modelUsed = ai.model || modelUsed;

      return json({
        ok:true,
        answer:cleanFragment(ai.answer),
        model:ai.model || null
      });
    }

    if (url.pathname === "/" && request.method === "GET") {
      return json({ok:false,error:"POST only",health:"/health"}, 405);
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
    const recentContext = String(body?.context ?? "").trim().slice(0, 6000);
    if (!originalQuestion) return json({ok:false,error:"Missing question"}, 400);
    if (originalQuestion.length > 2000) return json({ok:false,error:"Question too long"}, 413);

    // Zero-cost literal path.
    if (NUMBER_ONLY.test(originalQuestion)) {
      return json({ok:true,answer:originalQuestion});
    }

    const pieces = splitMultipart(originalQuestion);
    const isMultipart = pieces.length > 1;

    if (!isMultipart) {
      const genericDirect = directGenericAnswer(originalQuestion);
      if (genericDirect) return json({ok:true,answer:genericDirect});

      const directDate = directDateAnswer(originalQuestion);
      if (directDate) return json({ok:true,answer:directDate});

      const contextDirect = directContextAnswer(originalQuestion, recentContext);
      if (contextDirect) return json({ok:true,answer:contextDirect});

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
    let modelUsed = null;

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

        const genericDirect = directGenericAnswer(piece);
        if (genericDirect) {
          slots[i] = genericDirect;
          continue;
        }

        const directDate = directDateAnswer(piece);
        if (directDate) {
          slots[i] = directDate;
          continue;
        }

        const contextDirect = directContextAnswer(piece, recentContext);
        if (contextDirect) {
          slots[i] = contextDirect;
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
        return json({ok:true,answer:finalAnswer,model:modelUsed});
      }

      // Check unresolved clue caches first. Avoid rebuilding the large SAB
      // Info Book for ordinary real-world trivia.
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

      const needsInfoBook = stillUnresolved.some(row => looksSabSpecific(row.clue));
      let infoBook = "No SAB Info Book needed for these general-knowledge clues.";

      if (needsInfoBook) {
        try {
          infoBook = await getInfoBook(
            url,
            env,
            ctx,
            isLiveIndexQuestion(originalQuestion)
          );
        } catch (err) {
          console.error("Info Book fetch failed; using fallback context", String(err?.message || err || "unknown"));
          infoBook = "SAB Info Book temporarily unavailable. Solve from the supplied clues and general knowledge. Return only the answers.";
        }
      }

      // ONE AI request for every clue that was not already literal/direct/cached.
      const clueList = stillUnresolved
        .map((row, i) => (i + 1) + ". " + row.clue)
        .join("\n");

      const infoContext = needsInfoBook
        ? selectInfoBookContext(clueList, infoBook)
        : infoBook;

      const prompt =
        STORED_AI_PROMPT +
        "\n\n=== CURRENT DATE CONTEXT ===\n" + currentPromptContext() +
        (recentContext ? "\n\n=== RECENT SAMMY CONTEXT ===\n" + recentContext : "") +
        "\n\n=== RELEVANT SAB INFO BOOK ===\n" + infoContext +
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
          upstreamStatus:ai.upstreamStatus ?? null,
          detail:ai.detail ?? null
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
      let infoBook = "No SAB Info Book needed for this general-knowledge question.";

      if (looksSabSpecific(originalQuestion)) {
        try {
          infoBook = await getInfoBook(
            url,
            env,
            ctx,
            isLiveIndexQuestion(originalQuestion)
          );
        } catch (err) {
          console.error("Info Book fetch failed; using fallback context", String(err?.message || err || "unknown"));
          infoBook = "SAB Info Book temporarily unavailable. Solve from the supplied question and general knowledge. Return only the answer.";
        }
      }

      const infoContext = looksSabSpecific(originalQuestion)
        ? selectInfoBookContext(originalQuestion, infoBook)
        : infoBook;

      const prompt =
        STORED_AI_PROMPT +
        "\n\n=== CURRENT DATE CONTEXT ===\n" + currentPromptContext() +
        (recentContext ? "\n\n=== RECENT SAMMY CONTEXT ===\n" + recentContext : "") +
        "\n\n=== RELEVANT SAB INFO BOOK ===\n" + infoContext +
        "\n\n=== QUESTION ===\n" + originalQuestion +
        "\n\nReturn only the final answer.";

      const ai = await callGemini(env, prompt, 96);

      if (!ai.ok) {
        return json({
          ok:false,
          error:ai.error,
          upstreamStatus:ai.upstreamStatus ?? null,
          detail:ai.detail ?? null
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
    } catch (err) {
      console.error("Unhandled /ask error", String(err?.stack || err?.message || err || "unknown").slice(0,1600));
      return json({ok:false,error:"Worker internal error"}, 502);
    }
  }
};
