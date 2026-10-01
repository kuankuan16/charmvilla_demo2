import sharp from 'sharp'; import fs from 'node:fs';
const [,, out, cols, cell, listFile] = process.argv; const files = fs.readFileSync(listFile,'utf8').trim().split('\n').filter(Boolean);
const C=+cols, S=+cell, rows=Math.ceil(files.length/C); const comps=[];
for (let i=0;i<files.length;i++){ const f=files[i]; let m; try { m=await sharp(f).metadata(); } catch(e){ console.log('skip',f); continue; } const buf=await sharp(f).resize(S-10,S-10,{fit:'inside'}).png().toBuffer(); const mm=await sharp(buf).metadata();
  comps.push({input:buf,left:(i%C)*S+5+Math.floor((S-10-mm.width)/2),top:Math.floor(i/C)*S+5+Math.floor((S-10-mm.height)/2)});
  comps.push({input:Buffer.from(`<svg width="${S}" height="22"><rect width="${S}" height="22" fill="#000a"/><text x="6" y="16" font-size="12" fill="#fff" font-family="Helvetica">${i+1} ${f.split('/').pop().slice(0,36)} ${m.width}x${m.height}</text></svg>`),left:(i%C)*S,top:Math.floor(i/C)*S}); }
await sharp({create:{width:C*S,height:rows*S,channels:3,background:'#8a8a8a'}}).composite(comps).png().toFile(out); console.log('wrote',out);
