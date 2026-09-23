import fs from 'node:fs';
import crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { pipeline, env } from '@huggingface/transformers';
const source=process.argv[2];
if (!source) throw Error('Pass the local UTF-8 corpus path');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const raw=fs.readFileSync(source), text=raw.toString('utf8');
env.allowRemoteModels=false;
env.allowLocalModels=true;
const model='./models/bge-small-zh-v1.5';
const extractor=await pipeline('feature-extraction',model,{dtype:'q8'});
// Evidence anchors were checked against user-provided text. Labels are AI-reviewed,
// not independent human annotations, and may omit other relevant passages.
const queryFile=process.argv[3];
if(!queryFile)throw Error('Pass a local JSON query file as the second argument');
const cases=JSON.parse(fs.readFileSync(queryFile,'utf8'));
if(!Array.isArray(cases)||!cases.length||cases.some(row=>!Array.isArray(row)||row.length!==3||row.some(x=>typeof x!=='string'||!x.trim())))throw Error('Expected nonempty [id, query, evidenceAnchor] rows');
const docs=[];
const add=(start,end)=>{if(!docs.some(d=>d.start===start&&d.end===end))docs.push({id:docs.length,start,end,content:text.slice(start,end)});};
// Uniform deterministic background coverage; short windows avoid silent truncation.
for(let i=0;i<256;i++){const s=Math.floor(i*(text.length-360)/255);add(s,s+360);}
const queries=cases.map(([id,query,anchor])=>{
 const pos=text.indexOf(anchor); if(pos<0)throw Error(`Missing evidence ${id}`);
 const start=Math.max(0,pos-120),end=Math.min(text.length,pos+240);add(start,end);
 return {id,query,evidenceStart:pos,evidenceEnd:pos+anchor.length};
});
const tokenize=s=>{const a=s.match(/[\p{Script=Han}]|[a-zA-Z0-9]+/gu)||[];return a.flatMap((t,i)=>i+1<a.length?[t,t+a[i+1]]:[t]);};
const db=new DatabaseSync(':memory:');
db.exec('CREATE VIRTUAL TABLE docs USING fts5(terms)');
const insert=db.prepare('INSERT INTO docs(rowid,terms) VALUES (?,?)');
const ftsStart=performance.now();
for(const d of docs)insert.run(d.id+1,tokenize(d.content).join(' '));
const ftsBuildMs=performance.now()-ftsStart;
let maxTokens=0;
for(const d of docs){const n=extractor.tokenizer(d.content,{truncation:false}).input_ids.size;maxTokens=Math.max(maxTokens,n);if(n>512)throw Error(`Chunk ${d.id} exceeds token budget: ${n}`);}
const vectors=[],start=performance.now();
for(let i=0;i<docs.length;i+=8){
 const out=await extractor(docs.slice(i,i+8).map(d=>d.content),{pooling:'cls',normalize:true});
 vectors.push(...out.tolist());
 if(i%64===0)console.log(`embedded ${Math.min(i+8,docs.length)}/${docs.length}`);
}
const denseBuildMs=performance.now()-start;
const results=[];
for(const q of queries){
 const gold=docs.filter(d=>d.start<=q.evidenceStart&&d.end>=q.evidenceEnd).map(d=>d.id);
 const a=performance.now();
 const expr=[...new Set(tokenize(q.query))].map(t=>'"'+t+'"').join(' OR ');
 const lexical=db.prepare('SELECT rowid FROM docs WHERE docs MATCH ? ORDER BY bm25(docs), rowid LIMIT 64').all(expr).map(r=>Number(r.rowid)-1);
 const ftsMs=performance.now()-a;
 const b=performance.now();
 const [v]=(await extractor('为这个句子生成表示以用于检索相关文章：'+q.query,{pooling:'cls',normalize:true})).tolist();
 const dense=vectors.map((x,id)=>({id,score:x.reduce((s,y,j)=>s+y*v[j],0)})).sort((x,y)=>y.score-x.score||x.id-y.id).slice(0,64).map(x=>x.id);
 const denseMs=performance.now()-b;
 const c=performance.now(),scores=new Map();
 for(const list of [lexical,dense])list.forEach((id,i)=>scores.set(id,(scores.get(id)||0)+1/(60+i+1)));
 const hybrid=[...scores].sort((a,b)=>b[1]-a[1]||a[0]-b[0]).map(x=>x[0]);
 const metric=list=>({recall5:gold.filter(x=>list.slice(0,5).includes(x)).length/gold.length,recall10:gold.filter(x=>list.slice(0,10).includes(x)).length/gold.length,rr:1/(list.findIndex(x=>gold.includes(x))+1)||0,top10:list.slice(0,10)});
 const m={};for(const [name,list] of Object.entries({fts:lexical,dense,hybrid})){m[name]=metric(list);if(!Number.isFinite(m[name].rr))m[name].rr=0;}
 results.push({id:q.id,query:q.query,gold,metrics:m,latencyMs:{fts:ftsMs,dense:denseMs,hybrid:ftsMs+denseMs+performance.now()-c}});
}
const summary={};
for(const name of ['fts','dense','hybrid']){
 const latency=results.map(r=>r.latencyMs[name]).sort((a,b)=>a-b);
 summary[name]={recall5:results.reduce((s,r)=>s+r.metrics[name].recall5,0)/results.length,recall10:results.reduce((s,r)=>s+r.metrics[name].recall10,0)/results.length,mrr:results.reduce((s,r)=>s+r.metrics[name].rr,0)/results.length,p95Ms:latency[Math.ceil(latency.length*.95)-1]};
}
const result={schema:1,sourceSha256:sha(raw),model:{id:'Xenova/bge-small-zh-v1.5',revision:'75c43b069aac4d136ba6bc1122f995fedcfd2781',weightsSha256:sha(fs.readFileSync(model+'/onnx/model_quantized.onnx')),pooling:'cls',dimensions:512,dtype:'q8',maxObservedTokens:maxTokens},scope:'pilot; 256 uniform background windows + evidence windows; AI-reviewed incomplete relevance labels; no policy evaluation',fts:'SQLite FTS5 BM25 over Chinese unigram + bigram preprocessing; not upstream tokenizer',build:{ftsMs:ftsBuildMs,denseMs:denseBuildMs,rawVectorBytes:vectors.length*512*4},documents:docs.map(({id,start,end,content})=>({id,start,end,sha256:sha(content)})),summary,results};
fs.writeFileSync('planning/t007-pilot-results.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({documents:docs.length,build:result.build,summary},null,2));
db.close();await extractor.dispose();

