import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyPreorderBatch, preorderBatches, preorderPurchase } from '../../src/lib/shopify/preorder-batch.ts';
import { applyShopifyProduct } from '../../src/lib/shopify/catalog-data.ts';
const snapshot=JSON.parse(readFileSync(new URL('../../src/data/shopify-products.json',import.meta.url))).products;
function fixture(slug='spring-dawn-gift-box',left=1){
  const source=structuredClone(snapshot[slug]),batch=preorderBatches[slug];
  source.availableForSale=false;source.variants.forEach(v=>{v.quantityAvailable=0;v.availableForSale=false;});
  const allocations=Object.entries(batch.options).map(([id,o])=>{const price=source.variants.find(v=>v.id===id).price;return{sellingPlan:{id:o.sellingPlanId,recurringDeliveries:false},checkoutChargeAmount:{amount:price},remainingBalanceChargeAmount:{amount:'0'},priceAdjustments:[{price:{amount:price,currencyCode:'USD'}}]};});
  if(batch.mix) allocations.push({...structuredClone(allocations[0]),sellingPlan:{id:batch.mix.sellingPlanId,recurringDeliveries:false}});
  const pool={id:batch.productId,requiresSellingPlan:true,availableForSale:left>0,variants:{nodes:[{id:batch.variantId,availableForSale:left>0,quantityAvailable:left,currentlyNotInStock:false,sellingPlanAllocations:{nodes:allocations,pageInfo:{hasNextPage:false}}}],pageInfo:{hasNextPage:false}}};
  const inventory={status:'ACTIVE',requiresSellingPlan:true,variants:{nodes:[{id:batch.variantId,inventoryPolicy:'DENY'}]}};
  return{source,batch,pool,inventory};
}
test('Zero physical stock permits preorder from one shared remaining unit across all tea/lid choices without mutating stock',()=>{
  const f=fixture(),before=structuredClone(f.source),p=applyPreorderBatch(f.source,f.batch,f.pool,f.inventory);
  assert.equal(p.availableForSale,true);assert.equal(p.preorderBatch.remaining,1);
  assert.ok(p.variants.every(v=>v.availableForSale&&v.quantityAvailable===1));
  assert.deepEqual(f.source,before);
  assert.deepEqual(p.variants.map(v=>v.price),before.variants.map(v=>v.price));
  assert.equal(new Set(p.variants.map(v=>preorderPurchase(v.id).batch.variantId)).size,1);
  assert.equal(new Set(p.variants.map(v=>preorderPurchase(v.id).option.sellingPlanId)).size,4);
});
test('Exhausted, unknown, unpublished, untracked, paused and overselling pools all fail closed',()=>{
  for(const change of [f=>f.pool=null,f=>f.pool.variants.nodes[0].quantityAvailable=0,f=>f.pool.variants.nodes[0].quantityAvailable=null,f=>f.inventory.status='DRAFT',f=>f.inventory.variants.nodes[0].inventoryPolicy='CONTINUE',f=>f.pool.requiresSellingPlan=false,f=>f.source.metafields.find(m=>m.key==='preorder_details').value='{"version":1,"enabled":false}']){
    const f=fixture();change(f);const p=applyPreorderBatch(f.source,f.batch,f.pool,f.inventory);assert.ok(!p.availableForSale||p.variants.every(v=>!v.availableForSale));
  }
});
test('Wrong price, missing plan, recurring/deferred billing cannot enable an option',()=>{
  for(const change of [a=>a.priceAdjustments[0].price.amount='1',a=>a.checkoutChargeAmount.amount='1',a=>a.remainingBalanceChargeAmount.amount='20',a=>a.sellingPlan.recurringDeliveries=true,a=>a.sellingPlan.id='unknown']){
    const f=fixture();change(f.pool.variants.nodes[0].sellingPlanAllocations.nodes[0]);assert.equal(applyPreorderBatch(f.source,f.batch,f.pool,f.inventory).variants[0].availableForSale,false);
  }
});
test('An undiscounted full-payment selling plan uses the native variant price',()=>{
  const f=fixture('purple-butterfly-gift-box',10),v=f.pool.variants.nodes[0];
  v.price={amount:'425.0',currencyCode:'USD'};v.sellingPlanAllocations.nodes[0].priceAdjustments=[];
  assert.equal(applyPreorderBatch(f.source,f.batch,f.pool,f.inventory).variants[0].availableForSale,true);
});
test('The three-box Christmas set shares 200 sets, never 600 or five times 200',()=>{
  const f=fixture('snowflake-gift-box',200),p=applyPreorderBatch(f.source,f.batch,f.pool,f.inventory);
  const product=applyShopifyProduct({slug:'snowflake-gift-box',facts:[],giftBox:{pieces:6,contents:[]}},p,'en');
  assert.equal(product.preOrderRemaining,200);assert.equal(product.preOrderUnit,'set');assert.equal(f.batch.boxesPerUnit,3);assert.equal(product.giftBox.pieces,6);assert.equal(product.price.amount,60);
  assert.equal(product.giftBox.mixBoxes,3);assert.equal(product.shopifyData.mixAvailable,true);
});
test('Mixed set fails closed for missing/wrong-price/deferred plans without disabling legacy plans',()=>{
  for(const change of [a=>a.sellingPlan.id='missing',a=>a.priceAdjustments[0].price.amount='20',a=>a.checkoutChargeAmount.amount='20',a=>a.remainingBalanceChargeAmount.amount='40',a=>a.sellingPlan.recurringDeliveries=true]){
    const f=fixture('snowflake-gift-box',200);change(f.pool.variants.nodes[0].sellingPlanAllocations.nodes.at(-1));
    const p=applyPreorderBatch(f.source,f.batch,f.pool,f.inventory);
    assert.equal(p.preorderBatch.mixBoxes,3);assert.equal(p.preorderBatch.mixAvailable,false);
    assert.ok(p.variants.every(v=>v.availableForSale));
  }
  const f=fixture('snowflake-gift-box',200);f.source.variants[2].price='80';
  assert.equal(applyPreorderBatch(f.source,f.batch,f.pool,f.inventory).preorderBatch.mixAvailable,false);
});
test('All three Reunion colors share the existing pool and retain plan identity for the cart',()=>{
  const f=fixture('reunion-paper-gift-box',97),ids=Object.keys(f.batch.options);
  assert.deepEqual(ids.map(id=>f.batch.options[id].title),['Gold','Yellow','Red']);
  const before=structuredClone(f.source),p=applyPreorderBatch(f.source,f.batch,f.pool,f.inventory);
  assert.equal(p.preorderBatch.remaining,97);
  assert.ok(p.variants.every(v=>v.availableForSale&&v.quantityAvailable===97));
  assert.equal(preorderPurchase(f.batch.variantId),null);
  for(const id of ids){
    assert.equal(preorderPurchase(id).batch.variantId,f.batch.variantId);
    assert.equal(preorderPurchase(f.batch.variantId,f.batch.options[id].sellingPlanId).sourceVariantId,id);
  }
  assert.equal(new Set(ids.map(id=>f.batch.options[id].sellingPlanId)).size,3);
  assert.deepEqual(f.source,before);
});
