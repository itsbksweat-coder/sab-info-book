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
const ask = (path, question, context) => run(path, {
  method:'POST',
  headers:{'content-type':'application/json', 'x-riddler-token':'test-token'},
  body:JSON.stringify({question, context})
});

assert.equal((await run('/ws')).status, 404);
assert.equal((await run('/ws', {headers:{Upgrade:'websocket'}})).status, 404);
assert.equal((await relay.fetch(request('/ws', {headers:{Upgrade:'websocket'}}))).status, 404);
assert.equal((await run('/')).status, 405);
const infoBookResponse = await run('/info-book');
assert.equal(infoBookResponse.status, 200);
const infoBookText = await infoBookResponse.text();
assert.match(infoBookText, /^Los Dragons \| 425m\/s \| 2026-09-12 \| OG Craft$/m);
assert.match(infoBookText, /^67 \| 7\.5m\/s \| 2025-09-13 \| unknown$/m);
assert.doesNotMatch(infoBookText, /^El Gato \|/m);
assert.doesNotMatch(infoBookText, /^Extinct Cannelloni \|/m);
assert.match(infoBookText, /^Yin Yang \| 7\.5x \| 2025-09-27$/m);
assert.match(infoBookText, /^TRAITS — Name \| multiplier \| release evidence$/m);
assert.doesNotMatch(infoBookText, /PRIVATE/);
assert.ok(infoBookText.split("\n").length >= 2000);
assert.match(infoBookText, /^Brainrot God Lucky Block \| Tigroligre Frutonni \| 54% \| \$60K\/s$/m);
assert.match(infoBookText, /^74 \| 2026-11-07$/m);
const fullPrompt = await (await run('/info-book/prompt')).text();
assert.match(fullPrompt, /^You are TRACED RIDDLER/);
assert.ok(fullPrompt.endsWith(infoBookText));
assert.match(fullPrompt, /Favorite mutation: Yin Yang/);
assert.match(fullPrompt, /Car color: Red/);
assert.equal((await (await ask('/ask', 'the avatar color', 'rbxthumb://type=AvatarHeadShot&id=2678001507&w=420&h=420')).json()).answer, 'red');
assert.equal((await (await ask('/ask', 'the avatar color', 'rbxthumb://type=AvatarHeadShot&id=2678001507&w=420&h=420\nAvatar color: purple')).json()).answer, 'purple');
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

mock.timers.enable({apis:['Date'], now:new Date('2026-11-11T18:00:00Z')});
for (const [question, expected] of [
  ['what is the next mutation?', 'hacker'],
  ['what is the next upcoming mutation', 'hacker'],
  ['what is the mutation that comes next', 'hacker'],
  ['which mutation is coming out next?', 'hacker'],
  ['what mutation will be released next, 67', 'hacker67'],
  ['what is the next upcoming mutation, 67', 'hacker67'],
  ['when does the hacker mutation release?', 'november 21 2026'],
  ['what is the eclipse mutation multiplier?', '14'],
  ['mutation multiplier of yin yang', '7.5'],
  ['multiplier of the witch hat trait', '3'],
  ['trait multiplier for Bull', 'unknown'],
  ['when did witch hat trait come out?', 'october 11 2025'],
  ['release date of the Halo trait', 'february 21 2026'],
  ['the month and the day the yin yang mutation released', 'september27'],
  ['month and day that Lava mutation came out, 67', 'july2567'],
  ['the month and the day the Strawberry Elephant came out', 'august30'],
  ['how much per second does los dragons do', '425m'],
  ['how much p/s does los dragons do', '425m'],
  ['how much $/s does Los Dragons do', '425m'],
  ['how much p/s does Los Dragons do in the game?', '425m'],
  ['Los Dragons p/s', '425m'],
  ['what is the p/s of Los Dragons?', '425m'],
  ['how much mps does Los Dragons make?', '425m'],
  ['what rarity is Los Dragons?', 'Secret'],
  ['the rarity and income of Los Dragons', 'Secret425m'],
  ['the income and rarity of Los Dragons', '425mSecret'],
  ['my car color and my favorite color', 'redblue'],
  ['how much does Los Dragons cost?', '425b'],
  ['cash needed for rebirth 1', '500k'],
  ['when did update 74 come out?', 'november 7 2026'],
  ['what was update 2 called?', 'Bloodmoon Event'],
  ['what does the Rainbow Machine require?', '25 Gold brainrots'],
  ['what does the Las Vaquitas Saturnitas ritual spawn?', 'Las Vaquitas Saturnitas'],
  ['chance of Tigroligre Frutonni from Brainrot God Lucky Block', '54%'],
  ['what is the best new brainrot added to the game', 'Balloon Baboon'],
  ['the worst brainrot added to the game', 'Bling Luming'],
  ['what was the first added og brainrot added to sab', 'Strawberry Elephant'],
  ['what was the first added og brainrot', 'Strawberry Elephant'],
  ['what was the first og rarity brainrot', 'Strawberry Elephant'],
  ['what was the second og rarity brainrot', 'Meowl'],
  ['what was the 3rd og added', 'Headless Horseman'],
  ['which OG was released fourth?', 'Skibidi Toilet'],
  ['what is the second best OG?', 'Strawberry Elephant'],
  ['what is the top 3 best og', 'spyderelephantstrawberryelephantheadlesshorseman'],
  ['what are the two weakest OG Brainrots?', 'skibiditoiletjohnpork'],
  ['bottom 2 og', 'skibiditoiletjohnpork'],
  ['how many OG Brainrots are there?', '6'],
  ['what number OG was Meowl?', '2'],
  ['which update introduced OG rarity?', '14'],
  ['how you obtain skibidi toilet', 'The Red Carpet'],
  ['where can I get Skibidi Toilet?', 'The Red Carpet'],
  ['where was Los Dragons obtained from?', "OG Craft"],
  ['which brainrot makes more per second, Los Dragons or Balloon Baboon?', 'Los Dragons'],
  ['which brainrot came out first, Los Dragons or Balloon Baboon?', 'Los Dragons'],
  ['how much does Los Dragons make in one minute?', '25.5b'],
  ['what is the release date of Los Dragons?', 'september 12 2026'],
  ['when did the Yin Yang mutation come out?', 'september 27 2025'],
  ['which mutation has the highest multiplier?', 'Eclipse'],
  ['how many brainrots are from the Red Carpet?', String(infoBookText.split('\n').filter(line => line.endsWith(' | The Red Carpet')).length)],
  ['how much does Strawberry Elephant cost?', '750b'],
  ['what is the cheapest OG?', 'Skibidi Toilet'],
  ['how many OG Brainrots came before John Pork?', '4'],
  ['which OGs came after John Pork?', 'spyderelephant'],
  ['list OGs by base income', 'spyderelephantstrawberryelephantheadlesshorsemanmeowljohnporkskibiditoilet'],
  ['which makes more per second, Meowl or John Pork?', 'Meowl'],
  ['list all OGs in release order', 'strawberryelephantmeowlheadlesshorsemanskibiditoiletjohnporkspyderelephant'],
  ['what is the worst og brainrot', 'Skibidi Toilet'],
  ['what is the best og brainrot', 'Spyder Elephant'],
  ['what is the second weakest og', 'John Pork'],
  ['what is the newest og brainrot', 'Spyder Elephant'],
]) {
  const response = await ask('/ask', question);
  assert.equal(response.status, 200, question);
  assert.equal((await response.json()).answer, expected, question);
}

mock.timers.reset();
const originalFetch = globalThis.fetch;
try {
  globalThis.fetch = async (url, options) => {
    assert.match(url, /^https:\/\/generativelanguage\.googleapis\.com\//);
    const [{parts:[{text:prompt}]}] = JSON.parse(options.body).contents;
    assert.match(prompt, /^You are TRACED RIDDLER/);
    assert.doesNotMatch(prompt, /CURRENT DATE CONTEXT|MUTATION MODIFIERS|KNOWN SAB RIDDLE FACTS/);
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

assert.equal((await run('/updates/ws')).status, 426);
const updateData = new Map();
const notifications = [];
const updateSocket = {send(value) { notifications.push(JSON.parse(value)); }};
let subscribers = [updateSocket];
let alarms = 0;
const updateFeed = new ExistRelay({
  getWebSockets(tag) { assert.equal(tag, 'sab-updates'); return subscribers; },
  storage: {
    get: async key => updateData.get(key),
    put: async (key, value) => updateData.set(key, value),
    setAlarm: async () => { alarms++; }
  }
});
const realFetch = globalThis.fetch;
let updated = '2026-11-11T00:00:00Z';
try {
  globalThis.fetch = async url => {
    assert.match(url, /games\.roblox\.com.*7709344486/);
    return Response.json({data:[{id:7709344486, updated}]});
  };
  await updateFeed.alarm();
  await updateFeed.alarm();
  updated = '2026-11-12T00:00:00Z';
  await updateFeed.alarm();
  updated = '2026-11-11T00:00:00Z';
  await updateFeed.alarm();
  subscribers = [];
  await updateFeed.alarm();
  assert.deepEqual(notifications.map(event => event.type), ['snapshot','update']);
  assert.equal(alarms, 4);
} finally {
  globalThis.fetch = realFetch;
}
console.log('PASS: update feed sends one baseline, one newer timestamp, and stops polling without clients');
