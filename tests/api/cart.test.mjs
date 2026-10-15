// /api/cart against the mock Storefront cart.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { Client, BARE_BASE, MOCK, mock, line, variant, fixture } from "../support/helpers.mjs";

beforeEach(() => mock.reset());
const c = () => new Client();

test("POST without lines is refused", async () => {
  const r = await c().post("/api/cart", {});
  assert.equal(r.status, 400); assert.equal(r.data.error, "bad_request");
});

test("create: one line, country US, Shopify prices, checkoutUrl on the store", async () => {
  const r = await c().post("/api/cart", { lines: [line("reunion-paper-gift-box", undefined, 1, [{ key: "Pre-order", value: "Yes" }])] });
  assert.equal(r.status, 200, JSON.stringify(r.data));
  const cart = r.data.cart;
  assert.match(cart.id, /^gid:\/\/shopify\/Cart\//);
  assert.ok(cart.checkoutUrl.startsWith(`${MOCK}/cart/c/`));
  assert.equal(cart.totalQuantity, 1);
  assert.equal(cart.cost.subtotalAmount.amount, `${fixture.products["reunion-paper-gift-box"].price}.0`);
  assert.equal(cart.cost.subtotalAmount.currencyCode, "USD");
  assert.deepEqual(cart.lines.edges[0].node.attributes, [{ key: "Pre-order", value: "Yes" }]);
  const s = await mock.state();
  assert.equal(s.carts[0].buyerIdentity.countryCode, "US");
  assert.equal(s.carts[0].buyerIdentity.customerId, undefined);
  assert.equal(r.data.warning, undefined);
});

test("add, merge, update, remove keep Shopify's totals", async () => {
  const k = c();
  const id = (await k.post("/api/cart", { lines: [line("kyoto-gift-box", 0, 1, [{ key: "Tea", value: "Rose Oolong Tea" }])] })).data.cart.id;
  // same variant + same attributes merge into one line
  let r = await k.post("/api/cart", { id, lines: [line("kyoto-gift-box", 0, 1, [{ key: "Tea", value: "Rose Oolong Tea" }])] });
  assert.equal(r.data.cart.lines.edges.length, 1); assert.equal(r.data.cart.lines.edges[0].node.quantity, 2);
  // an option with its own price is its own line
  r = await k.post("/api/cart", { id, lines: [line("spring-dawn-gift-box", 2, 1, [{ key: "Tea / Lid color", value: "Oriental Beauty Tea / Blue" }])] });
  assert.equal(r.data.cart.lines.edges.length, 2);
  const kyoto = fixture.products["kyoto-gift-box"].options[0].price, dawn = fixture.products["spring-dawn-gift-box"].options[2].price;
  assert.equal(Number(r.data.cart.cost.subtotalAmount.amount), kyoto * 2 + dawn);
  const dawnLine = r.data.cart.lines.edges.find((e) => e.node.merchandise.id === variant("spring-dawn-gift-box", 2)).node;
  assert.equal(dawnLine.merchandise.price.amount, `${dawn}.0`);
  r = await k.patch("/api/cart", { id, lines: [{ id: dawnLine.id, quantity: 3 }] });
  assert.equal(r.status, 200);
  assert.equal(Number(r.data.cart.cost.subtotalAmount.amount), kyoto * 2 + dawn * 3);
  assert.equal(r.data.cart.totalQuantity, 5);
  r = await k.del("/api/cart", { id, lineIds: [dawnLine.id] });
  assert.equal(r.status, 200); assert.equal(r.data.cart.lines.edges.length, 1);
  r = await k.get(`/api/cart?id=${encodeURIComponent(id)}`);
  assert.equal(r.data.configured, true); assert.equal(r.data.cart.totalQuantity, 2);
});

test("distinct attributes keep two lines of the same published variant separate", async () => {
  const attrs = [{ key: "Gift note", value: "First gift" }, { key: "Pre-order", value: "Yes" }];
  const r = await c().post("/api/cart", { lines: [line("kyoto-gift-box", 0, 1, attrs)] });
  assert.equal(r.status, 200); assert.deepEqual(r.data.cart.lines.edges[0].node.attributes, attrs);
  const r2 = await c().post("/api/cart", { id: r.data.cart.id, lines: [line("kyoto-gift-box", 0, 1, [{ key: "Gift note", value: "Second gift" }])] });
  assert.equal(r2.data.cart.lines.edges.length, 2);
});

test("PATCH and DELETE need a cart and lines", async () => {
  assert.equal((await c().patch("/api/cart", { lines: [{ id: "x", quantity: 1 }] })).status, 400);
  assert.equal((await c().del("/api/cart", { id: "gid://shopify/Cart/x" })).status, 400);
});

test("GET: no id, unknown cart, not configured", async () => {
  let r = await c().get("/api/cart");
  assert.deepEqual(r.data, { configured: true, cart: null });
  r = await c().get(`/api/cart?id=${encodeURIComponent("gid://shopify/Cart/c1-gone?key=1")}`);
  assert.equal(r.status, 200); assert.deepEqual(r.data, { configured: true, cart: null });
  r = await new Client(BARE_BASE).get("/api/cart?id=x");
  assert.deepEqual(r.data, { configured: false, cart: null });
  r = await new Client(BARE_BASE).post("/api/cart", { lines: [line("reunion-paper-gift-box")] });
  assert.equal(r.status, 503); assert.equal(r.data.error, "not_configured");
});

test("a variant Shopify does not know is an error, not a silent add", async () => {
  const r = await c().post("/api/cart", { lines: [{ merchandiseId: "gid://shopify/ProductVariant/does-not-exist", quantity: 1 }] });
  assert.equal(r.status, 400); assert.match(r.data.message, /does not exist/);
});

test("Shopify's stock warnings reach the bag", async () => {
  const v = variant("kyoto-gift-box", 1);
  await mock.config({ stock: { [v]: 2 } });
  const r = await c().post("/api/cart", { lines: [{ merchandiseId: v, quantity: 3 }] });
  assert.equal(r.status, 200);
  assert.equal(r.data.cart.lines.edges[0].node.quantity, 2);
  assert.match(r.data.warning, /Only 2 items/);
  const up = await c().patch("/api/cart", { id: r.data.cart.id, lines: [{ id: r.data.cart.lines.edges[0].node.id, quantity: 5 }] });
  assert.equal(up.status, 200); assert.match(up.data.warning, /Only 2/);
});

test("the shopper's IP is passed to Shopify", async () => {
  await c().post("/api/cart", { lines: [line("reunion-paper-gift-box")] }, { "X-Forwarded-For": "203.0.113.7, 10.0.0.1" });
  const s = await mock.state();
  assert.equal(s.log.find((l) => l.op === "CartCreate").buyerIp, "203.0.113.7");
});

test("a cart gone on Shopify's side (checkout completed, expired) starts a new one on the next add", async () => {
  const k = c();
  const first = (await k.post("/api/cart", { lines: [line("reunion-paper-gift-box")] })).data.cart;
  await mock.deleteCart(first.id);
  const r = await k.post("/api/cart", { id: first.id, lines: [line("kyoto-gift-box", 2)] });
  assert.equal(r.status, 200, JSON.stringify(r.data));
  assert.notEqual(r.data.cart.id, first.id);
  assert.equal(r.data.cart.lines.edges.length, 1);
  assert.equal((await mock.state()).carts.find((x) => x.id === r.data.cart.id).buyerIdentity.countryCode, "US");
});

test("a line removed on Shopify's side: changing it says so and returns the cart as Shopify has it", async () => {
  const k = c();
  const cart = (await k.post("/api/cart", { lines: [line("reunion-paper-gift-box"), line("kyoto-gift-box", 0)] })).data.cart;
  const gone = cart.lines.edges[0].node.id;
  await mock.removeLine(cart.id, gone);
  const r = await k.patch("/api/cart", { id: cart.id, lines: [{ id: gone, quantity: 2 }] });
  assert.equal(r.status, 400);
  assert.equal(r.data.cart?.lines.edges.length, 1, "the error carries the current cart so the bag can refresh");
  const d = await k.del("/api/cart", { id: cart.id, lineIds: [gone] });
  assert.equal(d.status, 200, "removing a line that is already gone is not an error");
  assert.equal(d.data.cart.lines.edges.length, 1);
});

test("quantities must be whole numbers from 1 to 99", async () => {
  assert.equal((await c().post("/api/cart", { lines: [line("reunion-paper-gift-box", undefined, 0)] })).status, 400);
  assert.equal((await c().post("/api/cart", { lines: [line("reunion-paper-gift-box", undefined, 1.5)] })).status, 400);
  assert.equal((await c().post("/api/cart", { lines: [line("reunion-paper-gift-box", undefined, 100)] })).status, 400);
  const k = c();
  const cart = (await k.post("/api/cart", { lines: [line("reunion-paper-gift-box")] })).data.cart;
  assert.equal((await k.patch("/api/cart", { id: cart.id, lines: [{ id: cart.lines.edges[0].node.id, quantity: 100 }] })).status, 400);
  assert.equal((await k.patch("/api/cart", { id: cart.id, lines: [{ id: cart.lines.edges[0].node.id, quantity: -1 }] })).status, 400);
});
