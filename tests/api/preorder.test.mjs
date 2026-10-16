// Shared batch inventory is authoritative; original physical stock stays separate.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { Client, BARE_BASE, mock, line, variant, preorderVariant, fixture } from "../support/helpers.mjs";
beforeEach(() => mock.reset());
const left = async () => (await new Client().get("/api/preorder")).data.left;
test("each product reports one batch pool, including 200 three-box sets", async () => {
  const l = await left();
  for (const [slug, b] of Object.entries(fixture.batches)) assert.equal(l[slug], b.limit, slug);
  assert.equal(l["snowflake-gift-box"], 200);
});
test("physical stock and historical orders do not replace remaining preorder capacity", async () => {
  const slug = "spring-dawn-gift-box", options = fixture.products[slug].options;
  await mock.config({ stock: { ...Object.fromEntries(options.map(o => [o.variantId, 0])), [preorderVariant(slug)]: 4 } });
  await mock.orders([{ createdAt: "2026-10-15", lines: [{ variantId: options[0].variantId, quantity: 200 }] }]);
  assert.equal((await left())[slug], 4);
  assert.equal((await mock.state()).log.filter(x => x.op === "PreOrderSold").length, 0);
  const r = await new Client().post("/api/cart", { lines: [line(slug, 0)] });
  assert.equal(r.status, 200); assert.equal(r.data.cart.totalQuantity, 1);
});
test("different tea/lid plans share the last unit and cannot each add another one", async () => {
  const slug = "spring-dawn-gift-box"; await mock.config({ stock: { [preorderVariant(slug)]: 1 } });
  const r = await new Client().post("/api/cart", { lines: [line(slug, 0), line(slug, 2)] });
  assert.equal(r.status, 200); assert.equal(r.data.cart.totalQuantity, 1); assert.ok(r.data.warning);
  assert.ok(fixture.products[slug].options.some(o => o.price === Number(r.data.cart.cost.totalAmount.amount)));
  const changed = await new Client().patch("/api/cart", { id: r.data.cart.id, lines: [{ id: r.data.cart.lines.edges[0].node.id, quantity: 2 }] });
  assert.equal(changed.data.cart.totalQuantity, 1); assert.ok(changed.data.warning);
});
test("exhausted batch rejects new purchases even if physical stock exists", async () => {
  const slug = "purple-butterfly-gift-box"; await mock.config({ stock: { [preorderVariant(slug)]: 0, [variant(slug)]: 20 } });
  assert.equal((await left())[slug], 0);
  const r = await new Client().post("/api/cart", { lines: [line(slug)] });
  assert.equal(r.status, 409); assert.equal(r.data.error, "preorder_unavailable");
});
test("Christmas three-box set costs US$60 and quantity two uses two sets", async () => {
  const slug = "snowflake-gift-box";
  const r = await new Client().post("/api/cart", { lines: [line(slug, 0, 2)] });
  assert.equal(r.status, 200); assert.equal(r.data.cart.totalQuantity, 2); assert.equal(Number(r.data.cart.cost.totalAmount.amount), 120);
  assert.ok(r.data.cart.lines.edges[0].node.attributes.some(a => a.key === "Selling unit" && a.value === "3 boxes per set"));
});
const SNOW = 'snowflake-gift-box';
const mixLine = (mix, quantity = 1) => ({ merchandiseId: preorderVariant(SNOW), sellingPlanId: fixture.batches[SNOW].mix.sellingPlanId, quantity,
  attributes: [{key:'_mix_variants',value:JSON.stringify(mix)}] });
const tea = (index, quantity = 1) => ({variantId:variant(SNOW,index),quantity});
test('Mixed Christmas teas retain stable IDs and server-authored packing details at US$60 per set',async()=>{
  for(const mix of [[tea(0),tea(1),tea(2)],[tea(0,2),tea(2)],[tea(4,3)]]){
    const c=new Client();
    const input=mixLine(mix); input.attributes.push({key:'Teas',value:'FORGED'},{key:'Option',value:'FORGED'});
    const r=await c.post('/api/cart',{lines:[input]});assert.equal(r.status,200);
    const cart=r.data.cart,node=cart.lines.edges[0].node;
    assert.equal(cart.totalQuantity,1);assert.equal(Number(cart.cost.totalAmount.amount),60);
    assert.equal(node.merchandise.id,preorderVariant(SNOW));assert.equal(node.sellingPlanAllocation.sellingPlan.id,fixture.batches[SNOW].mix.sellingPlanId);
    assert.deepEqual(JSON.parse(node.attributes.find(a=>a.key==='_mix_variants').value),mix);
    assert.equal(node.attributes.find(a=>a.key==='Teas').value,mix.map(m=>`${fixture.batches[SNOW].options[m.variantId].title} × ${m.quantity}`).join(', '));
    assert.ok(!node.attributes.some(a=>a.value==='FORGED'||a.key==='Option'));
    const updated=await c.patch('/api/cart',{id:cart.id,lines:[{id:node.id,quantity:2}]});
    assert.equal(Number(updated.data.cart.cost.totalAmount.amount),120);assert.equal(updated.data.cart.totalQuantity,2);
    assert.deepEqual(updated.data.cart.lines.edges[0].node.attributes,node.attributes);
  }
});
test('Invalid or missing mix cannot enter Shopify, and mixed and legacy plans share the last set',async()=>{
  const c=new Client();
  for(const mix of [[],[tea(0)],[tea(0,4)],[tea(0,1.5),tea(1,1.5)],[tea(0,-1),tea(1,4)],[tea(0,2),tea(0)], [{variantId:variant('spring-dawn-gift-box'),quantity:3}],null]){
    const r=await c.post('/api/cart',{lines:[mixLine(mix)]});assert.equal(r.status,400,JSON.stringify(mix));assert.equal(r.data.error,'bad_tea_mix');
  }
  const invalids=[{...mixLine([tea(0,3)]),attributes:[]},{...mixLine([tea(0,3)]),attributes:[{key:'_mix_variants',value:'bad JSON'}]},
    {...mixLine([tea(0,3)]),sellingPlanId:fixture.batches[SNOW].options[variant(SNOW)].sellingPlanId}];
  for(const input of invalids){const r=await c.post('/api/cart',{lines:[input]});assert.equal(r.status,400);}
  await mock.config({stock:{[preorderVariant(SNOW)]:1}});
  const r=await c.post('/api/cart',{lines:[mixLine([tea(0),tea(1),tea(2)]),line(SNOW,4)]});
  assert.equal(r.data.cart.totalQuantity,1);assert.ok(r.data.warning);assert.equal(Number(r.data.cart.cost.totalAmount.amount),60);
  await mock.config({stock:{[preorderVariant(SNOW)]:0}});
  const unavailable=await c.post('/api/cart',{lines:[mixLine([tea(0,3)])]});assert.equal(unavailable.status,409);
});
test("missing/foreign plans cannot bypass the purchase mapping", async () => {
  const slug = "reunion-paper-gift-box", c = new Client();
  for (const l of [{ merchandiseId: preorderVariant(slug), quantity: 1 }, { merchandiseId: preorderVariant(slug), quantity: 1, sellingPlanId: "invalid" }]) {
    const r = await c.post("/api/cart", { lines: [l] }); assert.equal(r.status, 400); assert.equal(r.data.error, "preorder_unavailable");
  }
});
test("Reunion Gold/Yellow/Red retain distinct plans and share one remaining pool", async () => {
  const slug = "reunion-paper-gift-box", c = new Client();
  await mock.config({ stock: { [preorderVariant(slug)]: 2 } });
  const r = await c.post("/api/cart", { lines: [line(slug, 0), line(slug, 1), line(slug, 2)] });
  assert.equal(r.status, 200); assert.equal(r.data.cart.totalQuantity, 2); assert.ok(r.data.warning);
  for (const { node } of r.data.cart.lines.edges) {
    const color = node.attributes.find(a => a.key === "Option").value;
    const option = Object.values(fixture.batches[slug].options).find(o => o.title === color);
    assert.ok(option); assert.equal(node.merchandise.id, preorderVariant(slug));
    assert.equal(node.sellingPlanAllocation.sellingPlan.id, option.sellingPlanId);
  }
});
test("missing configuration and Admin outages fail explicitly instead of returning old allowances", async () => {
  const bare = await new Client(BARE_BASE).get("/api/preorder");
  assert.equal(bare.status, 503); assert.equal(bare.data.error, "not_configured");
  await mock.config({ adminDown: true });
  const down = await new Client().get("/api/preorder"); assert.equal(down.status, 502); assert.equal(down.data.left, undefined);
});
