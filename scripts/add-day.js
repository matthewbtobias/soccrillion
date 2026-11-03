// Validate a day file and add it to the site.
// Usage: node scripts/add-day.js path/to/day.json
// The file must be {"date":"YYYY-MM-DD","questions":[7 questions]}.
const fs=require('fs'),path=require('path');
const src=process.argv[2];if(!src){console.error('usage: node scripts/add-day.js day.json');process.exit(2);}
const d=JSON.parse(fs.readFileSync(src,'utf8'));const qs=d.questions||[];
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]+/g,' ').trim();
let ok=/^\d{4}-\d{2}-\d{2}$/.test(d.date||'')&&qs.length===7;if(!ok)console.log('FAIL need a YYYY-MM-DD date and exactly 7 questions');
const ids=new Set();
for(const q of qs){
  const all=[];(q.t||[]).forEach((str,i)=>String(str).split(';').map(x=>x.trim()).filter(Boolean).forEach(e=>all.push({n:norm(e.split('|')[0]),tier:i+1})));
  const tc=[1,2,3,4,5].map(t=>all.filter(a=>a.tier===t).length);
  const dup=all.length-new Set(all.map(a=>a.n)).size;const need=all.length>1000?2:1;
  const bad=ids.has(q.id)||!Array.isArray(q.t)||q.t.length!==5||all.length<50||tc[4]!==need||tc.slice(0,4).includes(0)||dup>0||!['eu','nat','mls'].includes(q.cat)||!q.prompt||!q.scope;
  ids.add(q.id);if(bad)ok=false;
  console.log((bad?'FAIL ':'ok   ')+q.id,q.cat,all.length,tc.join('/'),dup?'duplicates:'+dup:'');
}
if(qs.filter(q=>q.cat==='mls').length>1){ok=false;console.log('FAIL more than one MLS prompt');}
if(!ok){console.log('FIX ERRORS — nothing written');process.exit(1);}
const root=path.join(__dirname,'..'),out=path.join(root,'days',d.date+'.json');
if(fs.existsSync(out)){console.log('FAIL days/'+d.date+'.json already exists — nothing written');process.exit(1);}
fs.writeFileSync(out,JSON.stringify(d));
const idxPath=path.join(root,'days','index.json');const idx=JSON.parse(fs.readFileSync(idxPath,'utf8'));
idx.days=[...new Set([...(idx.days||[]),d.date])].sort().reverse();
fs.writeFileSync(idxPath,JSON.stringify(idx));
console.log('ALL OK — wrote days/'+d.date+'.json and updated days/index.json');
