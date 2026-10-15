import test from 'node:test';
import assert from 'node:assert/strict';
import { createActions, inventoryInput, metafieldInput } from './mcp-actions.mjs';
const productId='gid://shopify/Product/15402073194860';
const input={variantId:'gid://shopify/ProductVariant/67632284598636',locationId:'gid://shopify/Location/114803605868',quantity:4,expectedQuantity:0,idempotencyKey:'b8a383b4-645c-4f54-bd75-08eaf41e7305'};
const context=()=>({shop:{myshopifyDomain:'zcs0bg-10.myshopify.com'},currentAppInstallation:{accessScopes:[{handle:'write_inventory'},{handle:'write_products'}]},productVariant:{id:input.variantId,product:{id:productId,title:'Joyful Reunion'},inventoryItem:{id:'gid://shopify/InventoryItem/69616076521836',tracked:true,inventoryLevel:{location:{id:input.locationId,isActive:true},quantities:[{name:'available',quantity:0}]}}},product:{id:productId,metafield:{value:'old',compareDigest:'old-digest'}}});
const meta={productId,key:'short_product_desc',type:'single_line_text_field',value:'new',compareDigest:'old-digest'};
test('inventory requires explicit old quantity, valid IDs and idempotency; CMS requires explicit digest',()=>{
  for(const patch of [{expectedQuantity:undefined},{expectedQuantity:null},{quantity:1.5},{quantity:-1},{idempotencyKey:undefined},{locationId:'123'},{quantity:2147483648}]) assert.equal(inventoryInput.safeParse({...input,...patch}).success,false);
  assert.equal(metafieldInput.safeParse({...meta,compareDigest:undefined}).success,false);
  assert.equal(metafieldInput.safeParse({...meta,compareDigest:null}).success,true);
});
test('wrong store, missing scope, unmapped product, untracked or inactive location cannot send writes',async()=>{
  for(const edit of [d=>d.shop.myshopifyDomain='other.myshopify.com',d=>d.currentAppInstallation.accessScopes=[],d=>d.productVariant.product.id='gid://shopify/Product/1',d=>d.productVariant.inventoryItem.tracked=false,d=>d.productVariant.inventoryItem.inventoryLevel.location.isActive=false,d=>d.productVariant.inventoryItem.inventoryLevel=null]){
    let writes=0; const d=context();edit(d);
    const actions=createActions(async(_api,q)=>{if(q.startsWith('mutation'))writes++;return d;});
    await assert.rejects(actions.setInventory(input));assert.equal(writes,0);
  }
});
test('inventory adjustment uses atomic old-value comparison and stable idempotency key',async()=>{
  let quantity=0;const receipts=new Map();let mutations=0;
  const actions=createActions(async(_api,q,v)=>{
    if(!q.startsWith('mutation')){const d=context();d.productVariant.inventoryItem.inventoryLevel.quantities[0].quantity=quantity;return d;}
    mutations++;assert.match(q,/@idempotent\(key: \$key\)/);assert.equal(v.input.name,'available');
    assert.equal(v.input.quantities[0].inventoryItemId,context().productVariant.inventoryItem.id);
    if(receipts.has(v.key))return receipts.get(v.key);
    const change=v.input.quantities[0];
    if(change.changeFromQuantity!==quantity)return {inventorySetQuantities:{userErrors:[{code:'CHANGE_FROM_QUANTITY_STALE',message:'Changed concurrently'}]}};
    quantity=change.quantity;const r={inventorySetQuantities:{inventoryAdjustmentGroup:{changes:[{quantityAfterChange:quantity}]},userErrors:[]}};receipts.set(v.key,r);return r;
  });
  assert.equal((await actions.setInventory(input)).current.quantities[0].quantity,4);
  assert.equal((await actions.setInventory(input)).applied,true); // idempotent replay with original CAS
  await assert.rejects(actions.setInventory({...input,idempotencyKey:'027160af-b3db-4893-a31e-efc62433f842'}),/STALE/);
  assert.equal(quantity,4);assert.equal(mutations,3);
});
test('uncertain writes never automatically retry; successful writes retain receipt when readback fails',async()=>{
  let calls=0;const actions=createActions(async(_api,q)=>{calls++;if(q.startsWith('mutation'))throw new Error('timeout');return context();});
  await assert.rejects(actions.setInventory(input),/uncertain.*SAME/);assert.equal(calls,2);
  calls=0;const applied=createActions(async()=>{calls++;if(calls===1)return context();if(calls===2)return {inventorySetQuantities:{userErrors:[],inventoryAdjustmentGroup:{createdAt:'now'}}};throw new Error('read timeout');});
  const r=await applied.setInventory(input);assert.equal(r.applied,true);assert.equal(r.readbackError,'read timeout');assert.ok(r.receipt);
});
test('metafield changes use custom namespace, observed digest and atomic error propagation',async()=>{
  const actions=createActions(async(_api,q,v)=>{
    if(!q.startsWith('mutation'))return context();
    assert.deepEqual(v.metafields,[{ownerId:productId,namespace:'custom',key:meta.key,type:meta.type,value:meta.value,compareDigest:meta.compareDigest}]);
    return {metafieldsSet:{userErrors:[{code:'INVALID_COMPARE_DIGEST',message:'Changed by colleague'}]}};
  });
  await assert.rejects(actions.setProductMetafield(meta),/INVALID_COMPARE_DIGEST/);
  const noop=createActions(async()=>assert.fail('invalid JSON must not call the API'));
  await assert.rejects(noop.setProductMetafield({...meta,type:'json',value:'{broken'}));
});
