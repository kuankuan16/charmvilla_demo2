// Shared pre-order allowance: /api/preorder counts and the guard in /api/cart (src/lib/shopify/preorder.ts) against mock Admin orders.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { Client, BARE_BASE, mock, line, variant, fixture, today } from "../support/helpers.mjs";

beforeEach(() => mock.reset());
const BUTTERFLY = "purple-butterfly-gift-box", DAWN = "spring-dawn-gift-box";
const limit = (slug) => fixture.products[slug].limit;
const order = (lines, extra = {}) => ({ createdAt: today(), lines, ...extra });
const left = async () => (await new Client().get("/api/preorder")).data.left;

test("fixture sanity: the products under test have an allowance", () => {
  assert.ok(limit(BUTTERFLY) > 3); assert.ok(limit(DAWN) > 3);
});

test("no orders: every allowance is whole", async () => {
  const l = await left();
  for (const [slug, p] of Object.entries(fixture.products)) if (p.limit !== undefined) assert.equal(l[slug], p.limit, slug);
  assert.equal(l["snowflake-gift-box"], undefined, "a pre-order without an allowance has no count");
});

test("orders take boxes; cancelled, refunded and pre-launch orders give them back; options share one allowance", async () => {
  await mock.orders([
    order([{ variantId: variant(BUTTERFLY), handle: BUTTERFLY, quantity: 3 }]),
    order([{ variantId: variant(BUTTERFLY), handle: BUTTERFLY, quantity: 2 }], { cancelled: true }),
    order([{ variantId: variant(BUTTERFLY), handle: BUTTERFLY, quantity: 1, currentQuantity: 0 }]), // refunded / removed
    order([{ variantId: variant(BUTTERFLY), handle: BUTTERFLY, quantity: 4 }], { createdAt: "2025-12-31" }), // before PREORDER_COUNT_SINCE
    order([{ variantId: variant(DAWN, 0), handle: DAWN, quantity: 2 }, { variantId: variant(DAWN, 3), handle: DAWN, quantity: 1 }]),
    order([{ variantId: null, handle: DAWN, quantity: 1 }]), // variant deleted since: matched by the product handle
  ]);
  const l = await left();
  assert.equal(l[BUTTERFLY], limit(BUTTERFLY) - 3);
  assert.equal(l[DAWN], limit(DAWN) - 4);
});

test("never below zero", async () => {
  await mock.orders([order([{ variantId: variant(BUTTERFLY), handle: BUTTERFLY, quantity: limit(BUTTERFLY) + 5 }])]);
  assert.equal((await left())[BUTTERFLY], 0);
});

test("many orders are read page by page", async () => {
  await mock.orders(Array.from({ length: 205 }, () => order([{ variantId: variant(DAWN, 1), handle: DAWN, quantity: 0, currentQuantity: 0 }])).concat([order([{ variantId: variant(DAWN, 1), handle: DAWN, quantity: 2 }])]));
  assert.equal((await left())[DAWN], limit(DAWN) - 2);
  const pages = (await mock.state()).log.filter((x) => x.op === "PreOrderSold").length;
  assert.equal(pages, 3);
});

test("guard: more boxes than are left → 409 preorder_full; exactly what is left is fine", async () => {
  await mock.orders([order([{ variantId: variant(BUTTERFLY), handle: BUTTERFLY, quantity: limit(BUTTERFLY) - 2 }])]);
  const k = new Client();
  let r = await k.post("/api/cart", { lines: [line(BUTTERFLY, undefined, 3)] });
  assert.equal(r.status, 409); assert.equal(r.data.error, "preorder_full"); assert.match(r.data.message, /只剩 2 盒/);
  r = await k.post("/api/cart", { lines: [line(BUTTERFLY, undefined, 2)] });
  assert.equal(r.status, 200);
  const cart = r.data.cart;
  // the bag already holds the 2 left: one more is refused, raising the quantity is refused, lowering it is allowed
  r = await k.post("/api/cart", { id: cart.id, lines: [line(BUTTERFLY)] });
  assert.equal(r.status, 409);
  const lineId = cart.lines.edges[0].node.id;
  r = await k.patch("/api/cart", { id: cart.id, lines: [{ id: lineId, quantity: 3 }] });
  assert.equal(r.status, 409);
  r = await k.patch("/api/cart", { id: cart.id, lines: [{ id: lineId, quantity: 1 }] });
  assert.equal(r.status, 200); assert.equal(r.data.cart.totalQuantity, 1);
});

test("guard counts every option of a product together", async () => {
  const k = new Client();
  const max = limit(DAWN);
  let r = await k.post("/api/cart", { lines: [line(DAWN, 0, max - 4)] });
  assert.equal(r.status, 200);
  r = await k.post("/api/cart", { id: r.data.cart.id, lines: [line(DAWN, 2, 5)] });
  assert.equal(r.status, 409, "the second option takes the product past its allowance");
  r = await k.post("/api/cart", { id: r.data?.cart?.id ?? (await mock.state()).carts[0].id, lines: [line(DAWN, 2, 4)] });
  assert.equal(r.status, 200);
  assert.equal(r.data.cart.totalQuantity, max);
});

test("sold out: the message says so", async () => {
  await mock.orders([order([{ variantId: variant(BUTTERFLY), handle: BUTTERFLY, quantity: limit(BUTTERFLY) }])]);
  const r = await new Client().post("/api/cart", { lines: [line(BUTTERFLY)] });
  assert.equal(r.status, 409); assert.match(r.data.message, /額滿/);
});

test("products without an allowance are never held back", async () => {
  const r = await new Client().post("/api/cart", { lines: [line("snowflake-gift-box", undefined, 50)] });
  assert.equal(r.status, 200);
});

test("fail open: when the Admin API is down the bag still works", async () => {
  await mock.config({ adminDown: true });
  const r = await new Client().post("/api/cart", { lines: [line(BUTTERFLY, undefined, limit(BUTTERFLY) + 1)] });
  assert.equal(r.status, 200);
  const p = await new Client().get("/api/preorder");
  assert.equal(p.status, 502, "the count itself reports the outage so pages keep their static number");
});

test("not configured: 503, the pages keep the number in the data", async () => {
  const r = await new Client(BARE_BASE).get("/api/preorder");
  assert.equal(r.status, 503); assert.equal(r.data.error, "not_configured");
});
