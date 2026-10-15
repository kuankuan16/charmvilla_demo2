import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
const dir = new URL('./', import.meta.url);
const read = async name => JSON.parse(await fs.readFile(new URL(name,dir),'utf8'));
const base = 'https://www.charmvilla.com';
const before = await read('merged-shopify-public-before.json');
const response = await fetch(`${base}/api/products`); assert.equal(response.status,200);
const {products} = await response.json(); assert.deepEqual(products,before.products);
const protectedFiles = await read('merged-protected-files.json');
const assets = await Promise.all(protectedFiles.assets.map(async a => {
 const r = await fetch(`${base}/media/site/${a.file}`); assert.equal(r.status,200);
 const bytes=Buffer.from(await r.arrayBuffer()),sha256=createHash('sha256').update(bytes).digest('hex');assert.equal(sha256,a.sha256);
 return {...a,bytes:bytes.length,verified:true};
}));
const previous = await read('merged-preorder-before.json');
const notices = await Promise.all(previous.map(async p=>{
 const r=await fetch(`${base}/products/${p.slug}`); assert.equal(r.status,200); const html=await r.text();
 const notice=html.match(/<aside[^>]*class="product-preorder-notice[^>]*>[\s\S]*?<\/aside>/)?.[0].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();assert.equal(notice,p.notice);
 return {slug:p.slug,unchanged:true};
}));
const policyHtml=await (await fetch(`${base}/policy`)).text();
const policy=policyHtml.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
const copy=[
'Pre-orders are charged in full when you place your order.',
'Pre-orders are expected to ship by the end of November 2026.',
'You may cancel a pre-order for a full refund before it ships. Please email us at us@charmvilla.com with your order number.',
'Once your order has shipped, our',
'Teas &amp; Consumable Items',
'At launch, we do not ship to APO/FPO/DPO addresses.',
'We do not ship to Alaska or Hawaii.'
].map(text=>({text,present:policy.includes(text)}));
assert.ok(copy.every(c=>c.present),JSON.stringify(copy));
const result={checkedAt:new Date().toISOString(),base,shopifyProductsUnchanged:Object.keys(products).length,shopifyVariantsUnchanged:Object.values(products).flatMap(p=>p.variants).length,assets,preorderNotices:notices,copy};
await fs.writeFile(new URL('production-readback.json',dir),JSON.stringify(result,null,2)+'\n');
console.log({products:14,variants:35,assets:5,notices:10,copy:copy.length});
