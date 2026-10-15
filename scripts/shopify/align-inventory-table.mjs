// Owner inventory table alignment. Default is read-only; no inferred variant allocations.
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { graphql, root, domain } from './runtime.mjs';
export const OPERATIONS = {
  "query": "query InventoryAlignment($ids:[ID!]!){shop{myshopifyDomain currencyCode} nodes(ids:$ids){... on Product{id handle title status descriptionHtml options{name values} variants(first:100){nodes{id title sku price inventoryPolicy selectedOptions{name value} inventoryItem{id tracked measurement{weight{value unit}} inventoryLevels(first:20){nodes{location{id} quantities(names:[\"available\"]){name quantity}} pageInfo{hasNextPage}}}} pageInfo{hasNextPage}} metafields(first:100){nodes{namespace key type value compareDigest} pageInfo{hasNextPage}}}} translatableResourcesByIds(first:100,resourceIds:$ids){nodes{resourceId translations(locale:\"zh-TW\"){key value outdated}}}}",
  "publication": "query InventoryPublication($ids:[ID!]!) @inContext(country:US){nodes(ids:$ids){... on Product{id availableForSale variants(first:100){nodes{id quantityAvailable availableForSale}pageInfo{hasNextPage}}}}}",
  "metafields": "mutation InventoryTableAllocation($metafields:[MetafieldsSetInput!]!){metafieldsSet(metafields:$metafields){metafields{namespace key value} userErrors{field message code}}}"
};
const check = payload => { if(payload.userErrors?.length) throw Error(JSON.stringify(payload.userErrors)); return payload; };
async function main() {
  const config=JSON.parse(await readFile(root+'docs/shopify/inventory-table-2026-10-15.json','utf8'));
  const mapping=JSON.parse(await readFile(root+'src/data/shopify-map.json','utf8'));
  const entries=Object.entries(config.products), ids=entries.map(([slug])=>mapping[slug].productId);
  const read=async()=>({admin:await graphql('admin',OPERATIONS.query,{ids}),storefront:await graphql('storefront',OPERATIONS.publication,{ids})});
  const before=await read(); assert.equal(before.admin.shop.myshopifyDomain,domain);
  const rows=[], changes=[];
  for(const [slug,target] of entries){
    const p=before.admin.nodes.find(p=>p?.id===mapping[slug].productId), sf=before.storefront.nodes.find(node=>node?.id===mapping[slug].productId);
    assert.ok(p); assert.equal(p.handle,mapping[slug].handle); assert.equal(p.variants.pageInfo.hasNextPage,false); assert.equal(p.metafields.pageInfo.hasNextPage,false);
    for(const v of p.variants.nodes)assert.equal(v.inventoryItem.inventoryLevels.pageInfo.hasNextPage,false);
    assert.equal(Boolean(sf),target.published,'Publication differs: '+slug);
    const available=p.variants.nodes.reduce((sum,v)=>sum+v.inventoryItem.inventoryLevels.nodes.filter(l=>l.location.id===config.locationId).reduce((s,l)=>s+l.quantities[0].quantity,0),0);
    const online=sf?sf.variants.nodes.reduce((sum,v)=>sum+(v.quantityAvailable??0),0):null;
    if(target.available!==null){assert.equal(available,target.available,'Hayward quantity changed; review before writing: '+slug);assert.equal(online,target.available,'Online quantity differs: '+slug);}
    const field=p.metafields.nodes.find(m=>m.namespace==='custom'&&m.key==='preorder_details');assert.equal(field?.type,'json');
    const current=JSON.parse(field.value); assert.equal(current.version,1);
    const allocation={limit:target.preorderLimit,scope:'product',unit:target.unit,boxesPerUnit:target.boxesPerUnit,sourceDate:'2026-10-15'};
    rows.push({slug,preorderLimit:target.preorderLimit,unit:target.unit,boxesPerUnit:target.boxesPerUnit,haywardAvailable:available,onlineAvailable:online,published:Boolean(sf)});
    if(JSON.stringify(current.allocation)!==JSON.stringify(allocation))changes.push({ownerId:p.id,namespace:'custom',key:'preorder_details',type:'json',compareDigest:field.compareDigest,value:JSON.stringify({...current,allocation})});
  }
  const qa=root+'docs/qa/2026-10-15-inventory-alignment/';await mkdir(qa,{recursive:true});
  const plan={at:new Date().toISOString(),rows,allocationWrites:changes.length,physicalQuantityWrites:0,priceWrites:0,publicationWrites:0};
  await writeFile(qa+'allocation-plan.json',JSON.stringify(plan,null,2)+'\n');
  if(!process.argv.includes('--apply')){console.log(JSON.stringify({dryRun:true,...plan},null,2));return;}
  await writeFile(qa+'allocation-before.json',JSON.stringify(before,null,2)+'\n',{flag:'wx'}).catch(e=>{if(e.code!=='EEXIST')throw e;});
  if(changes.length)check((await graphql('admin',OPERATIONS.metafields,{metafields:changes})).metafieldsSet);
  const after=await read();
  for(const p of after.admin.nodes){const old=before.admin.nodes.find(x=>x.id===p.id);assert.deepEqual(p.variants,old.variants,'Variant commerce changed');assert.equal(p.status,old.status);assert.equal(p.title,old.title);assert.equal(p.descriptionHtml,old.descriptionHtml);const change=changes.find(c=>c.ownerId===p.id);if(change)assert.equal(p.metafields.nodes.find(m=>m.key==='preorder_details').value,change.value);}
  assert.deepEqual(after.storefront,before.storefront,'Publication or online stock changed');
  await writeFile(qa+'allocation-after.json',JSON.stringify(after,null,2)+'\n');
  await writeFile(qa+'allocation-result.json',JSON.stringify({...plan,readback:true,commerceUnchanged:true},null,2)+'\n');
  console.log(JSON.stringify({writes:changes.length,readback:true,physicalQuantityWrites:0,commerceUnchanged:true}));
}
if(!process.argv.includes('--operations-only'))await main();
