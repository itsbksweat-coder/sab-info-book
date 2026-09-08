import infoBook from './worker-v17.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/exist/health') return Response.json({version:18, websocket:'/ws', configured:!!env.ETERNAL_TOKEN});
    if (url.pathname !== '/ws') return infoBook.fetch(request, env, ctx);
    if (!env.ETERNAL_TOKEN) return new Response('Set ETERNAL_TOKEN in Worker secrets first', {status:503});
    if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') return new Response('WebSocket required', {status:426});
    return env.EXIST_RELAY.get(env.EXIST_RELAY.idFromName('eternal')).fetch(request);
  }
};

export class ExistRelay {
  constructor(ctx, env) { this.ctx=ctx; this.env=env; this.pending=new Map(); this.queue=Promise.resolve(); }
  async fetch() {
    if (this.ctx.getWebSockets().length >= 30) return new Response('Connection limit', {status:429});
    const pair=new WebSocketPair();
    this.ctx.acceptWebSocket(pair[1]);
    pair[1].serializeAttachment({authenticated:false});
    return new Response(null,{status:101,webSocket:pair[0]});
  }
  webSocketMessage(ws, raw) {
    this.queue=this.queue.then(()=>this.handle(ws,raw)).catch(()=>{try{ws.close(1011,'Relay error');}catch{}});
    return this.queue;
  }
  send(ws, message) { try { ws.send(JSON.stringify({...message,room:'eternal'})); } catch {} }
  broadcast(role,message) {
    for(const ws of this.ctx.getWebSockets()) {
      const client=ws.deserializeAttachment();
      if(client?.authenticated && client.role===role) this.send(ws,message);
    }
  }
  async replay(ws) {
    const meta=await this.ctx.storage.get('latest');
    if(!meta) return this.send(ws,{type:'status',data:{ready:false,error:'No completed scan saved yet'}});
    this.send(ws,{type:'snapshot_start',data:meta.data,recordCount:meta.count});
    for(let i=1;i<=meta.chunks;i++) this.send(ws,{type:'snapshot_chunk',chunkIndex:i,records:await this.ctx.storage.get('chunk:'+i)});
    this.send(ws,{type:'snapshot_end',data:meta.data,chunks:meta.chunks});
  }
  async handle(ws,raw) {
    if(typeof raw!=='string' || raw.length>64000) return ws.close(1009,'Message too large');
    let m; try{m=JSON.parse(raw);}catch{return ws.close(1008,'Invalid JSON');}
    if(!m || typeof m!=='object') return ws.close(1008,'Invalid message');
    let client=ws.deserializeAttachment();
    if(!client?.authenticated) {
      if(m.type!=='hello' || m.token!==this.env.ETERNAL_TOKEN || m.room!=='eternal' || !['producer','viewer'].includes(m.role)) return ws.close(1008,'Authentication required');
      client={authenticated:true,role:m.role}; ws.serializeAttachment(client);
      this.send(ws,{type:'hello_ack'}); return;
    }
    if(m.type==='get_snapshot') return this.replay(ws);
    if(client.role==='viewer') {
      if(m.type==='refresh') {
        const now=Date.now(), last=await this.ctx.storage.get('refreshAt')||0;
        if(now-last>15000) {await this.ctx.storage.put('refreshAt',now);this.broadcast('producer',{type:'refresh'});}
      }
      return;
    }
    if(m.type==='status') {this.broadcast('viewer',{type:'status',data:m.data});return;}
    if(m.type==='snapshot_start') {
      if(!Number.isInteger(m.recordCount)||m.recordCount<0||m.recordCount>20000) return;
      this.pending.set(ws,{data:m.data,count:m.recordCount,chunks:[],received:0}); return;
    }
    const scan=this.pending.get(ws);
    if(!scan) return;
    if(m.type==='snapshot_chunk') {
      if(m.chunkIndex!==scan.chunks.length+1 || !Array.isArray(m.records)||m.records.length>50||scan.received+m.records.length>scan.count) {this.pending.delete(ws);return;}
      scan.chunks.push(m.records);scan.received+=m.records.length;return;
    }
    if(m.type==='snapshot_end') {
      this.pending.delete(ws);
      if(scan.received!==scan.count||m.chunks!==scan.chunks.length||!m.data?.ready||m.data.scanning) return;
      await this.ctx.storage.transaction(async tx=>{
        const old=await tx.get('latest');
        for(let i=0;i<scan.chunks.length;i++) await tx.put('chunk:'+(i+1),scan.chunks[i]);
        for(let i=scan.chunks.length+1;i<=(old?.chunks||0);i++) await tx.delete('chunk:'+i);
        await tx.put('latest',{data:m.data,count:scan.count,chunks:scan.chunks.length});
      });
      for(const peer of this.ctx.getWebSockets()) if(peer.deserializeAttachment()?.role==='viewer') await this.replay(peer);
    }
  }
  webSocketClose(ws) {this.pending.delete(ws);try{ws.close();}catch{}}
  webSocketError(ws) {this.pending.delete(ws);}
}
