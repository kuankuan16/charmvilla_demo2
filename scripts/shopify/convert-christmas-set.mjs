// Convert only the unpublished small Christmas product to the owner-confirmed three-box selling unit.
// Default is read-only. --apply also requires an explicitly confirmed --price=AMOUNT.
import assert from 'node:assert/strict';
import { writeFile, mkdir } from 'node:fs/promises';
import { graphql, root } from './runtime.mjs';
export const OPERATIONS = {
  "query": "query InventoryAlignment($ids:[ID!]!){shop{myshopifyDomain currencyCode} nodes(ids:$ids){... on Product{id handle title status descriptionHtml options{name values} variants(first:100){nodes{id title sku price inventoryPolicy selectedOptions{name value} inventoryItem{id tracked measurement{weight{value unit}} inventoryLevels(first:20){nodes{location{id} quantities(names:[\"available\"]){name quantity}} pageInfo{hasNextPage}}}} pageInfo{hasNextPage}} metafields(first:100){nodes{namespace key type value compareDigest} pageInfo{hasNextPage}}}} translatableResourcesByIds(first:100,resourceIds:$ids){nodes{resourceId translations(locale:\"zh-TW\"){key value outdated}}}}",
  "publication": "query InventoryPublication($ids:[ID!]!) @inContext(country:US){nodes(ids:$ids){... on Product{id availableForSale variants(first:100){nodes{id quantityAvailable availableForSale}pageInfo{hasNextPage}}}}}",
  "metafields": "mutation InventoryTableAllocation($metafields:[MetafieldsSetInput!]!){metafieldsSet(metafields:$metafields){metafields{namespace key value} userErrors{field message code}}}",
  "productUpdate": "mutation ChristmasSetProduct($product:ProductUpdateInput!){productUpdate(product:$product){product{id title descriptionHtml}userErrors{field message}}}",
  "variantsUpdate": "mutation ChristmasSetPrices($productId:ID!,$variants:[ProductVariantsBulkInput!]!){productVariantsBulkUpdate(productId:$productId,variants:$variants){productVariants{id price}userErrors{field message code}}}",
  "resource": "query ChristmasSetTranslation($id:ID!){translatableResource(resourceId:$id){resourceId translatableContent{key value digest locale}}}",
  "translate": "mutation ChristmasSetTranslations($id:ID!,$translations:[TranslationInput!]!){translationsRegister(resourceId:$id,translations:$translations){translations{key value locale}userErrors{field message}}}"
};
const id='gid://shopify/Product/15406015512940';
const check=p=>{if(p.userErrors?.length)throw Error(JSON.stringify(p.userErrors));return p;};
async function main(){
 const priceArg=process.argv.find(x=>x.startsWith('--price='))?.split('=')[1];
 const price=priceArg===undefined?undefined:Number(priceArg);
 if(price!==undefined)assert.ok(Number.isFinite(price)&&price>0,'Invalid confirmed set price');
 if(process.argv.includes('--apply'))assert.ok(price!==undefined,'A confirmed set price is required before converting the selling unit');
 const read=async()=>({admin:await graphql('admin',OPERATIONS.query,{ids:[id]}),storefront:await graphql('storefront',OPERATIONS.publication,{ids:[id]})});
 const before=await read(),p=before.admin.nodes[0];assert.equal(p?.handle,'christmas-edition-2-count');assert.equal(before.storefront.nodes[0],null,'Keep this product unpublished');assert.equal(p.variants.pageInfo.hasNextPage,false);
 const field=key=>p.metafields.nodes.find(m=>m.namespace==='custom'&&m.key===key);
 const copy=JSON.parse(field('headless_copy_zh_tw').value);
 const allocation=JSON.parse(field('preorder_details').value).allocation;
 assert.deepEqual({limit:allocation.limit,unit:allocation.unit,boxes:allocation.boxesPerUnit},{limit:200,unit:'set',boxes:3});
 const title='Christmas Charming Gift (Limited Edition)';
 const intro='<p>CHARM VILLA Christmas Charming Gift (Limited Edition) is sold as a set of three boxes and contains 6 Goldfish Tea Bags in total, with 2 tea bags per box. Choose from the tea varieties below.</p>';
 const rest=p.descriptionHtml.slice(p.descriptionHtml.indexOf('<h3>'));
 assert.ok(rest.startsWith('<h3>'),'Missing existing tea and brewing sections');
 const descriptionHtml=intro+rest.replace('Christmas paper box containing two Goldfish Tea Bags of the selected tea.','Set of three Christmas paper boxes, each containing two Goldfish Tea Bags of the selected tea (6 tea bags per set).');
 copy.description='CHARM VILLA「聖誕心意禮（限量版）」三盒一組，每盒 2 包金魚茶包，共 6 包。白色紙盒飾以燙金雪花與壓紋小金魚，以透明貼紙封口，適合在佳節分送親友。';
 const unit=copy.facts.find(f=>f.label==='販售單位');assert.ok(unit);unit.value='3 盒一組，每盒 2 包，共 6 包';
 copy.choiceLabel='選擇茶款';
 const desiredFields=[{key:'headless_copy_zh_tw',type:'json',value:JSON.stringify(copy)},{key:'product_contents',type:'single_line_text_field',value:'Set of 3 boxes · 2 tea bags per box · 6 tea bags per set'},{key:'teabag_count',type:'number_integer',value:'6'}];
 const metafields=desiredFields.filter(m=>field(m.key)?.value!==m.value).map(m=>({...m,ownerId:id,namespace:'custom',compareDigest:field(m.key)?.compareDigest??null}));
 const plan={at:new Date().toISOString(),productId:id,title,descriptionHtml,chineseCopy:copy,boxesPerSet:3,preorderSets:200,confirmedSetPrice:price??null,requiresPrice:price===undefined,variants:p.variants.nodes.map(v=>({id:v.id,title:v.title,oldPrice:v.price,newPrice:price===undefined?null:price.toFixed(2)})),publication:'unchanged, unpublished',physicalStockWrites:0};
 const qa=root+'docs/qa/2026-10-15-inventory-alignment/';await mkdir(qa,{recursive:true});await writeFile(qa+'christmas-set-plan.json',JSON.stringify(plan,null,2)+'\n');
 if(!process.argv.includes('--apply')){console.log(JSON.stringify({dryRun:true,productId:id,boxesPerSet:3,preorderSets:200,confirmedSetPrice:price??null,requiresPrice:price===undefined,physicalStockWrites:0}));return;}
 await writeFile(qa+'christmas-set-before.json',JSON.stringify(before,null,2)+'\n',{flag:'wx'}).catch(e=>{if(e.code!=='EEXIST')throw e;});
 const variants=p.variants.nodes.filter(v=>Number(v.price)!==price).map(v=>({id:v.id,price:price.toFixed(2)}));
 if(variants.length)check((await graphql('admin',OPERATIONS.variantsUpdate,{productId:id,variants})).productVariantsBulkUpdate);
 if(p.title!==title||p.descriptionHtml!==descriptionHtml)check((await graphql('admin',OPERATIONS.productUpdate,{product:{id,title,descriptionHtml}})).productUpdate);
 if(metafields.length)check((await graphql('admin',OPERATIONS.metafields,{metafields})).metafieldsSet);
 const resource=(await graphql('admin',OPERATIONS.resource,{id})).translatableResource;
 const values={title:copy.title,body_html:'<p>'+copy.description+'</p>'};
 const translations=Object.entries(values).map(([key,value])=>({key,value,locale:'zh-TW',translatableContentDigest:resource.translatableContent.find(x=>x.key===key).digest}));
 check((await graphql('admin',OPERATIONS.translate,{id,translations})).translationsRegister);
 const after=await read(),updated=after.admin.nodes[0];assert.equal(updated.title,title);assert.equal(updated.descriptionHtml,descriptionHtml);assert.equal(updated.status,p.status);assert.deepEqual(after.storefront,before.storefront);
 for(const v of updated.variants.nodes){const old=p.variants.nodes.find(x=>x.id===v.id);assert.equal(Number(v.price),price);assert.equal(v.sku,old.sku);assert.equal(v.inventoryPolicy,old.inventoryPolicy);assert.deepEqual(v.selectedOptions,old.selectedOptions);assert.deepEqual(v.inventoryItem,old.inventoryItem);}
 for(const m of desiredFields)assert.equal(updated.metafields.nodes.find(x=>x.key===m.key)?.value,m.value);
 const zh=after.admin.translatableResourcesByIds.nodes[0].translations;for(const [key,value]of Object.entries(values))assert.ok(zh.some(t=>t.key===key&&t.value===value&&!t.outdated));
 await writeFile(qa+'christmas-set-after.json',JSON.stringify(after,null,2)+'\n');
 console.log(JSON.stringify({converted:true,boxesPerSet:3,price,preorderSets:200,published:false,stockUnchanged:true,variantCount:updated.variants.nodes.length}));
}
if(!process.argv.includes('--operations-only'))await main();
