import assert from 'node:assert/strict';
import worker, {ExistRelay} from './worker-v18.js';
import base from './worker-v17.js';

const data=new Map();
const storage={get:async k=>data.get(k),put:async(k,v)=>data.set(k,v),delete:async k=>data.delete(k),transaction:async f=>f(storage)};
const socket=()=>({meta:{},serializeAttachment(v){this.meta=v},deserializeAttachment(){return this.meta},send(){},close(){this.closed=true}});
const producer=socket();
const relay=new ExistRelay({storage,getWebSockets:()=>[producer]},{ETERNAL_TOKEN:'test-token'});
const send=m=>relay.webSocketMessage(producer,JSON.stringify(m));
const env={EXIST_RELAY:{idFromName:v=>v,get:()=>relay}};
base.fetch=async()=>new Response('ORIGINAL INFO BOOK',{headers:{'content-type':'text/plain'}});
const root=()=>worker.fetch(new Request('https://example.com/'),env,{});
assert.match(await (await root()).text(),/No completed scan/);
await send({type:'hello',role:'producer',room:'eternal',token:'test-token'});
await send({type:'snapshot_start',recordCount:3});
await send({type:'snapshot_chunk',chunkIndex:1,records:[
  {item:'Example',mutation:'Default',answer:0,raw:'PRIVATE'},
  {item:'Example',mutation:'Gold',answer:'1,200'},
  {item:'Example',mutation:'Diamond'}
]});
await send({type:'snapshot_end',chunks:1,data:{ready:true,scanning:false,player:'PRIVATE',jobId:'PRIVATE'}});
let response=await root(),text=await response.text();
assert(text.startsWith('ORIGINAL INFO BOOK'));
assert(text.includes('"count":0'));assert(text.includes('"count":1200'));assert(text.includes('"count":null'));
assert(!text.includes('PRIVATE'));assert.equal(response.headers.get('cache-control'),'no-store');
const counts=await (await worker.fetch(new Request('https://example.com/exist/counts'),env,{})).json();
assert.equal(counts.records.length,3);assert(counts.savedAt);
await send({type:'snapshot_start',recordCount:2});
await send({type:'snapshot_end',chunks:0,data:{ready:true}});
assert.equal((await relay.publicSnapshot()).records.length,3);
await send({type:'snapshot_start',recordCount:1});
await send({type:'snapshot_chunk',chunkIndex:1,records:[{item:'Example',mutation:'Default',answer:42}]});
await send({type:'snapshot_end',chunks:1,data:{ready:true,scanning:false}});
text=await (await root()).text();assert(text.includes('"count":42'));assert(!text.includes('"count":1200'));
console.log('PASS: base text preserved, automatic update, unknown/zero handling, privacy, interrupted scan preservation');
