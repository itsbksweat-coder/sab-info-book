import assert from 'node:assert/strict';
import worker, {ExistRelay} from './worker-v23.js';
import infoBookWorker from './worker-v18.js';
import baseInfoBook from './worker-v17.js';

const data = new Map([
  ['latest', {chunks:1, savedAt:'2026-09-01T12:00:00.000Z', data:{player:'PRIVATE'}}],
  ['chunk:1', [
    {item:'Example', mutation:'Default', answer:0, raw:'PRIVATE'},
    {item:'Example', mutation:'Gold', answer:'1,200'},
    {item:'Example', mutation:'Diamond'}
  ]]
]);
const storage = {
  get: async key => data.get(key),
  put: async (key, value) => data.set(key, value),
  transaction: async callback => callback(storage)
};
const relay = new ExistRelay({storage});
const env = {
  EXIST_RELAY:{idFromName:name => name, get:() => relay},
  RIDDLER_CLIENT_TOKEN:'test-token',
  GEMINI_API_KEY:'test-key'
};
const request = (path, init) => new Request('https://example.com' + path, init);
const background = [];
const ctx = {waitUntil: promise => background.push(promise)};
const run = (path, init) => worker.fetch(request(path, init), env, ctx);
const ask = (path, question) => run(path, {
  method:'POST',
  headers:{'content-type':'application/json', 'x-riddler-token':'test-token'},
  body:JSON.stringify({question})
});

assert.equal((await run('/ws')).status, 404);
assert.equal((await run('/ws', {headers:{Upgrade:'websocket'}})).status, 404);
assert.equal((await relay.fetch(request('/ws', {headers:{Upgrade:'websocket'}}))).status, 404);
assert.equal((await run('/')).status, 405);
assert.equal((await run('/health')).status, 200);
assert.equal((await (await run('/exist/health')).json()).acceptsScans, false);
assert.equal((await run('/ask', {method:'POST'})).status, 401);
assert.equal((await (await ask('/', '0067')).json()).answer, '0067');

const counts = await (await run('/exist/counts')).json();
assert.deepEqual(counts.records.map(record => record.count), [0, 1200, null]);
assert.equal(counts.savedAt, '2026-09-01T12:00:00.000Z');
assert(!JSON.stringify(counts).includes('PRIVATE'));

const originalInfoBookFetch = baseInfoBook.fetch;
let infoBook;
try {
  baseInfoBook.fetch = async () => new Response('ORIGINAL INFO BOOK');
  infoBook = await infoBookWorker.fetch(request('/'), env, {});
} finally {
  baseInfoBook.fetch = originalInfoBookFetch;
}
assert.equal(infoBook.headers.get('cache-control'), 'no-store');
const text = await infoBook.text();
assert.match(text, /^ORIGINAL INFO BOOK/);
assert.match(text, /LIVE INDEX EXIST COUNTS/);
assert.match(text, /"count":1200/);
assert(!text.includes('PRIVATE'));

for (const ip of ['192.0.2.1', '192.0.2.2']) {
  const response = await run('/ai/shared', {
    method:'POST',
    headers:{'content-type':'application/json', 'cf-connecting-ip':ip},
    body:JSON.stringify({question:'Shared answer example', answer:'Test'})
  });
  assert.equal(response.status, 200);
}
assert.equal((await (await run('/ai/shared?q=Shared+answer+example')).json()).answer, 'test');

const originalFetch = globalThis.fetch;
try {
  globalThis.fetch = async (url, options) => {
    assert.match(url, /^https:\/\/generativelanguage\.googleapis\.com\//);
    const [{parts:[{text:prompt}]}] = JSON.parse(options.body).contents;
    assert.match(prompt, /^You are TRACED RIDDLER/);
    assert.match(prompt, /CURRENT DATE CONTEXT/);
    assert.match(prompt, /What is the speed of sound in air\?/);
    return Response.json({candidates:[{content:{parts:[{text:'343'}]}}]});
  };
  const answer = await ask('/ask', 'What is the speed of sound in air?');
  assert.equal(answer.status, 200);
  assert.equal((await answer.json()).answer, '343');
  await Promise.all(background);
} finally {
  globalThis.fetch = originalFetch;
}

console.log('PASS: socket route removed, saved scans and shared answers readable, Riddler routes working');
