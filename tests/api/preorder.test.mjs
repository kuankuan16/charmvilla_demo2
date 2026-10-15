// The compatibility endpoint reports live variant stock; campaign allocation never grants extra stock.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { Client, BARE_BASE, mock, line, variant, fixture } from "../support/helpers.mjs";
beforeEach(() => mock.reset());
const left = async () => (await new Client().get("/api/preorder")).data.left;
test("live quantities add across variants; unpublished Christmas products have zero saleable stock", async () => {
  const l = await left();
  for (const [slug, p] of Object.entries(fixture.products)) assert.equal(l[slug], p.published ? p.options.length * 99 : 0, slug);
});
test("stock changes are read immediately and historical orders do not replace current inventory", async () => {
  const slug = "spring-dawn-gift-box", options = fixture.products[slug].options;
  await mock.config({ stock: Object.fromEntries(options.map((o, i) => [o.variantId, i])) });
  await mock.orders([{ createdAt: "2026-10-15", lines: [{ variantId: options[0].variantId, quantity: 200 }] }]);
  assert.equal((await left())[slug], options.reduce((n, _, i) => n + i, 0));
  assert.equal((await mock.state()).log.filter(x => x.op === "PreOrderSold").length, 0);
});
test("Shopify bounds cart quantity by variant stock, independently of campaign allocation", async () => {
  const id = variant("kyoto-gift-box", 0); await mock.config({ stock: { [id]: 2 } });
  const r = await new Client().post("/api/cart", { lines: [{ merchandiseId: id, quantity: 3 }] });
  assert.equal(r.status, 200); assert.equal(r.data.cart.totalQuantity, 2); assert.match(r.data.warning, /Only 2 items/);
});
test("sold-out variants cannot add a purchasable line", async () => {
  const id = variant("purple-butterfly-gift-box"); await mock.config({ stock: { [id]: 0 } });
  assert.equal((await left())["purple-butterfly-gift-box"], 0);
  const r = await new Client().post("/api/cart", { lines: [{ merchandiseId: id, quantity: 1 }] });
  assert.equal(r.data.cart.totalQuantity, 0); assert.ok(r.data.warning);
});
test("Christmas three-box set is US$60 but unpublished; allocation200 cannot make it purchasable", async () => {
  const p = fixture.products["snowflake-gift-box"];
  assert.equal(p.price, 60); assert.equal(p.options.length, 5); assert.equal(p.published, false);
  assert.equal((await left())["snowflake-gift-box"], 0);
  const r = await new Client().post("/api/cart", { lines: [line("snowflake-gift-box", 0)] });
  assert.equal(r.status, 400); assert.equal(r.data.cart, undefined);
});
test("missing configuration and Admin outages fail explicitly instead of returning old allowances", async () => {
  const bare = await new Client(BARE_BASE).get("/api/preorder");
  assert.equal(bare.status, 503); assert.equal(bare.data.error, "not_configured");
  await mock.config({ adminDown: true });
  const down = await new Client().get("/api/preorder"); assert.equal(down.status, 502); assert.equal(down.data.left, undefined);
});
