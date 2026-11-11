import assert from 'node:assert/strict';
import {mock} from 'node:test';
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

const riddles = [
  ["what is Sammy's favorite mutation?", "yin yang"],
  ["what brainrot is scarino crowino a reskin of? and what day in may did sab release", "fishino clownino15"],
  ["What brainrot in sab is associated with john pork and how much $/s does he do in the game", "timcheese5"],
  ["scorpi is the second scorpion brainrot in the game. How was the first one obtained? and how old am i", "rngmachine24"],
  ["what was sammyni spyderini called before?", "chimpanzini spiderini"],
  ["hat was the name of the halloween event that gave brainrots a purple hat last year?", "witchinghour"],
  ["todays new mutation, best brainrot in the fuse, and day of the month today", "eclipsephoenix3"],
  ["what was the rarest DLC brainrot obtained from the first minifigures we released?", "pancakeandsyrup"],
  ["what brainrot was obtained from the trick or treating event last year?", "noomycandy"],
  ["what does medusa have on her head (pural) and what year are we on?", "snakes2026"],
  ["when i dont get tacos for tuesday what do i usually get? (singular)", "enchilada"],
  ["what new brainrot is a reskin of dug dug dug? and what day is halloween", "pumpumpum31"]
];

mock.timers.enable({apis:['Date'], now:new Date('2026-10-03T12:00:00Z')});
const previousCaches = globalThis.caches;
const cachedAnswers = new Map();
globalThis.caches = {default:{
  match: async key => cachedAnswers.get(key.url)?.clone(),
  put: async (key, value) => { cachedAnswers.set(key.url, value); }
}};
try {
  for (const [question, expected] of riddles) {
    const response = await ask('/ask', question);
    assert.equal(response.status, 200, question);
    assert.equal((await response.json()).answer, expected, question);
  }

  mock.timers.setTime(Date.parse('2026-10-10T12:00:00Z'));
  const series2 = "what is the most op minifigure toy in the new series 2 minifigures and the day today";
  assert.equal((await (await ask('/ask', series2)).json()).answer, 'griffin10');
  assert.equal((await (await ask('/ask', riddles[6][0])).json()).answer, 'eclipsephoenix10');

  mock.timers.setTime(Date.parse('2027-01-01T12:00:00Z'));
  assert.equal((await (await ask('/ask', riddles[9][0])).json()).answer, 'snakes2027');
} finally {
  globalThis.caches = previousCaches;
  mock.timers.reset();
}

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
