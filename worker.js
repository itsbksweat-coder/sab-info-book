const RAW_BASE = "https://raw.githubusercontent.com/itsbksweat-coder/sab-info-book/main/.seed/";

const PARTS = [
  "decoded-000.b64",
  "decoded-r-000.b64",
  "decoded2-000.b64",
  "dec-000.b64",
  "dec8-000.b64",
  "dec8-001.b64",
  "dec8-002.b64",
  "rdec-000.b64",
  "rdec-001.b64",
  "rdec-002.b64"
];

let cachedInfoBook = null;
let cachedAt = 0;
const CACHE_MS = 5 * 60 * 1000;

async function rebuildInfoBook() {
  const responses = await Promise.all(
    PARTS.map((part) => fetch(RAW_BASE + part, { cf: { cacheTtl: 300, cacheEverything: true } }))
  );

  for (let i = 0; i < responses.length; i++) {
    if (!responses[i].ok) {
      throw new Error(`Failed to fetch ${PARTS[i]}: HTTP ${responses[i].status}`);
    }
  }

  const packed = (await Promise.all(responses.map((r) => r.text())))
    .join("")
    .replace(/\s+/g, "");

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
