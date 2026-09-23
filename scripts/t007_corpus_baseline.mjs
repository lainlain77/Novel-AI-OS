import fs from 'node:fs';
import crypto from 'node:crypto';

const source = process.argv[2];
if (!source) throw new Error('usage: node scripts/t007_corpus_baseline.mjs <source>');
const raw = fs.readFileSync(source);
const text = raw.toString('utf8');
const paragraphs = text.split(/\r?\n\s*\r?\n/).map(x=>x.trim()).filter(Boolean);
const pieces=[];
for (const p of paragraphs) {
  if (p.length<=900) pieces.push(p);
  else { let s=0; while(s<p.length){ const e=Math.min(p.length,s+900); pieces.push(p.slice(s,e)); if(e===p.length) break; s=Math.max(s+1,e-120); } }
}
const tokenRe=/[\u3400-\u9fff]|[a-zA-Z0-9_]+/g;
const index=new Map(); let occurrences=0;
for(let i=0;i<pieces.length;i++){const ts=new Set(pieces[i].toLowerCase().match(tokenRe)||[]);for(const t of ts){occurrences++;if(!index.has(t))index.set(t,new Set());index.get(t).add(i);}}
const queries=process.argv.slice(3);
const q=queries.map(x=>{const hits=new Set();for(const t of x.match(tokenRe)||[])for(const i of index.get(t)||[])hits.add(i);return {queryHash:crypto.createHash('sha256').update(x).digest('hex').slice(0,16),hits:hits.size};});
const lens=pieces.map(x=>x.length).sort((a,b)=>a-b); const median=lens[Math.floor(lens.length/2)];
const result={sourceSha256:crypto.createHash('sha256').update(raw).digest('hex'),sourceBytes:raw.length,sourceCharacters:text.length,chunking:{targetCharacters:900,overlapCharacters:120,chunks:pieces.length},lexicalIndex:{uniqueTerms:index.size,totalTermOccurrences:occurrences},chunkLength:{min:lens[0],median,max:lens.at(-1)},queries:q,privacy:{sourceTextWritten:false,queryTextWritten:false}};
fs.mkdirSync('planning',{recursive:true});fs.writeFileSync('planning/t007-baseline-result.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));

