const API_BASE = "https://api.github.com/repos/itsbksweat-coder/sab-info-book/contents/.seed/";

const PARTS = [
  "decoded-000.b64",
  "decoded-r-000.b64",
  "d2part0.txt",
  "decoded2-000.b64",
  "dec-000.b64",
  "dec8-000.b64",
  "dec8-001.b64",
  "dec8-002.b64",
  "dec8-003.b64",
  "dec8-004.b64"
];

let cachedInfoBook = null;
let cachedAt = 0;
const CACHE_MS = 5 * 60 * 1000;

function decodeGithubContent(content) {
  const cleaned = String(content || "").replace(/\s+/g, "");
  const binary = atob(cleaned);
  let out = "";
  const CHUNK = 8192;
  for (let i = 0; i < binary.length; i += CHUNK) {
    out += String.fromCharCode(...Uint8Array.from(binary.slice(i, i + CHUNK), c => c.charCodeAt(0)));
  }
  return out;
}

async function fetchSeedPart(part) {
  const response = await fetch(API_BASE + encodeURIComponent(part) + "?ref=main", {
    headers: {
      "Accept": "application/vnd.github+json",
      "User-Agent": "sab-info-book-worker"
    },
    cf: { cacheTtl: 300, cacheEverything: true }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${part}: HTTP ${response.status}`);
  }

  const body = await response.json();
  if (!body || body.encoding !== "base64" || !body.content) {
    throw new Error(`Invalid GitHub payload for ${part}`);
  }

  return decodeGithubContent(body.content).replace(/\s+/g, "");
}

async function rebuildInfoBook() {
  const chunks = await Promise.all(PARTS.map(fetchSeedPart));
  const packed = chunks.join("");

  const binary = atob(packed);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const stream = new Response(bytes).body.pipeThrough(new DecompressionStream("gzip"));
  return await new Response(stream).text();
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname !== "/") {
      return new Response("Not Found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=UTF-8" }
      });
    }

    try {
      const now = Date.now();
      if (!cachedInfoBook || now - cachedAt > CACHE_MS) {
        cachedInfoBook = await rebuildInfoBook();
        cachedAt = now;
      }

      return new Response(cachedInfoBook, {
        status: 200,
        headers: {
          "content-type": "text/plain; charset=UTF-8",
          "cache-control": "no-store",
          "x-content-type-options": "nosniff"
        }
      });
    } catch (error) {
      return new Response(`SAB Info Book failed to load: ${error?.message || error}`, {
        status: 500,
        headers: { "content-type": "text/plain; charset=UTF-8" }
      });
    }
  }
};
