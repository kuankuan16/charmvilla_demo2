// /api/account/* (classic customer accounts) against the mock Storefront API, including tying the bag to the customer.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { Client, BARE_BASE, mock, line } from "../support/helpers.mjs";

beforeEach(() => mock.reset());
const PASSWORD = "correct-horse-1";
const register = (k, extra = {}) => k.post("/api/account/register", { email: "ada@example.com", password: PASSWORD, firstName: "Ada", lastName: "Lovelace", ...extra });

test("register: checks, signs in with an httpOnly cookie, me returns the customer", async () => {
  const k = new Client();
  assert.equal((await k.post("/api/account/register", { email: "ada@example.com" })).status, 400);
  assert.equal((await k.post("/api/account/register", { email: "ada@example.com", password: "short" })).status, 400);
  const r = await register(k, { acceptsMarketing: true, phone: "+1 415 555 0100" });
  assert.equal(r.status, 200, JSON.stringify(r.data));
  const cookie = k.lastSetCookies.find((s) => s.startsWith("cv_customer="));
  assert.ok(cookie, "session cookie set"); assert.match(cookie, /HttpOnly/i); assert.match(cookie, /SameSite=lax/i); assert.match(cookie, /Path=\//);
  const me = await k.get("/api/account/me");
  assert.equal(me.status, 200);
  assert.equal(me.data.customer.email, "ada@example.com");
  assert.equal(me.data.customer.firstName, "Ada");
  assert.equal(me.data.customer.acceptsMarketing, true);
});

test("register: an email already taken, and a newsletter subscriber who registers (activation email)", async () => {
  await register(new Client());
  let r = await register(new Client());
  assert.equal(r.status, 400); assert.equal(r.data.error, "email_taken");
  await new Client().post("/api/newsletter", { email: "reader@example.com" });
  r = await new Client().post("/api/account/register", { email: "reader@example.com", password: PASSWORD });
  assert.equal(r.status, 409); assert.equal(r.data.error, "activation_sent");
  const mail = (await mock.state()).outbox.find((m) => m.type === "activate" && m.to === "reader@example.com");
  assert.ok(mail, "Shopify emails an activation link");
});

test("register: a phone Shopify will not take is reported", async () => {
  const r = await register(new Client(), { phone: "12" });
  assert.equal(r.status, 400); assert.equal(r.data.error, "invalid_phone");
});

test("login / logout / wrong password / me without a session", async () => {
  await register(new Client());
  const k = new Client();
  assert.equal((await k.get("/api/account/me")).status, 401);
  assert.equal((await k.post("/api/account/login", { email: "ada@example.com" })).status, 400);
  const bad = await k.post("/api/account/login", { email: "ada@example.com", password: "wrong-password" });
  assert.equal(bad.status, 400); assert.equal(bad.data.error, "bad_login");
  assert.equal((await k.post("/api/account/login", { email: "ADA@example.com", password: PASSWORD })).status, 200);
  assert.equal((await k.get("/api/account/me")).status, 200);
  const out = await k.post("/api/account/logout");
  assert.equal(out.status, 200);
  assert.equal((await k.get("/api/account/me")).status, 401);
  assert.equal((await mock.state()).log.filter((l) => l.op === "TokenDelete").length, 1, "the token is revoked at Shopify too");
});

test("a session Shopify no longer accepts is cleared", async () => {
  const k = new Client(); await register(k);
  await mock.reset(); // tokens forgotten, like an expired or revoked token
  const r = await k.get("/api/account/me");
  assert.equal(r.status, 401);
  assert.ok(k.lastSetCookies.some((s) => s.startsWith("cv_customer=;") || /cv_customer=;|Max-Age=0/i.test(s)), "cookie cleared");
});

test("profile: update name, marketing; refused without a session", async () => {
  const k = new Client(); await register(k);
  let r = await k.patch("/api/account/profile", { firstName: "Augusta", lastName: "King", phone: "", email: "ada@example.com", acceptsMarketing: true });
  assert.equal(r.status, 200, JSON.stringify(r.data)); assert.equal(r.data.customer.firstName, "Augusta"); assert.equal(r.data.customer.acceptsMarketing, true);
  r = await k.patch("/api/account/profile", { phone: "not a phone" });
  assert.equal(r.status, 400);
  assert.equal((await new Client().patch("/api/account/profile", { firstName: "x" })).status, 401);
});

test("addresses: add (first is default), add as default, edit, delete", async () => {
  const k = new Client(); await register(k);
  const a1 = await k.post("/api/account/addresses", { address: { firstName: "Ada", address1: "1 Main St", city: "Los Angeles", province: "CA", zip: "90012", country: "United States" } });
  assert.equal(a1.status, 200, JSON.stringify(a1.data));
  const a2 = await k.post("/api/account/addresses", { address: { address1: "2 Side St", city: "Irvine", province: "CA", zip: "92618", country: "United States" }, makeDefault: true });
  let me = (await k.get("/api/account/me")).data.customer;
  assert.equal(me.addresses.edges.length, 2);
  assert.equal(me.defaultAddress.id, a2.data.address.id);
  assert.ok(me.defaultAddress.formatted.join(" ").includes("Irvine"));
  assert.equal((await k.patch("/api/account/addresses", { id: a1.data.address.id, makeDefault: true })).status, 200);
  assert.equal((await k.patch("/api/account/addresses", { id: a2.data.address.id, address: { city: "Pasadena" } })).status, 200);
  me = (await k.get("/api/account/me")).data.customer;
  assert.equal(me.defaultAddress.id, a1.data.address.id);
  assert.equal(me.addresses.edges.find((e) => e.node.id === a2.data.address.id).node.city, "Pasadena");
  assert.equal((await k.del("/api/account/addresses", { id: a2.data.address.id })).status, 200);
  assert.equal((await k.get("/api/account/me")).data.customer.addresses.edges.length, 1);
  assert.equal((await k.del("/api/account/addresses", { id: "gid://shopify/MailingAddress/404" })).status, 400);
  assert.equal((await new Client().post("/api/account/addresses", { address: { address1: "x", country: "United States" } })).status, 401);
});

test("orders placed with the account are listed", async () => {
  await mock.customer({ email: "buyer@example.com", password: PASSWORD, orders: [{ total: 230, lines: [{ title: "Spring Dawn", quantity: 1 }], financialStatus: "PAID", fulfillmentStatus: "UNFULFILLED" }] });
  const k = new Client();
  await k.post("/api/account/login", { email: "buyer@example.com", password: PASSWORD });
  const me = (await k.get("/api/account/me")).data.customer;
  assert.equal(me.orders.edges.length, 1);
  assert.equal(me.orders.edges[0].node.totalPrice.amount, "230.0");
});

test("forgot password → emailed link → reset signs in with the new password", async () => {
  await register(new Client());
  const k = new Client();
  assert.equal((await k.post("/api/account/recover", {})).status, 400);
  const unknown = await k.post("/api/account/recover", { email: "nobody@example.com" });
  assert.equal(unknown.status, 200, "an unknown email gets the same answer, so the form does not reveal who has an account");
  assert.equal((await k.post("/api/account/recover", { email: "ada@example.com" })).status, 200);
  const mail = (await mock.state()).outbox.find((m) => m.type === "reset");
  assert.ok(mail?.url);
  assert.equal((await k.post("/api/account/reset", { url: mail.url.replace("https:", "http:"), password: "new-password-1" })).status, 400, "only https links of Shopify's shape");
  assert.equal((await k.post("/api/account/reset", { url: mail.url, password: "short" })).status, 400);
  const bad = await k.post("/api/account/reset", { url: mail.url.replace(/[^/]+$/, "wrongtoken"), password: "new-password-1" });
  assert.equal(bad.status, 400);
  const ok = await k.post("/api/account/reset", { url: mail.url, password: "new-password-1" });
  assert.equal(ok.status, 200, JSON.stringify(ok.data));
  assert.equal((await k.get("/api/account/me")).status, 200);
  assert.equal((await new Client().post("/api/account/login", { email: "ada@example.com", password: "new-password-1" })).status, 200);
  assert.equal((await new Client().post("/api/account/login", { email: "ada@example.com", password: PASSWORD })).status, 400);
});

test("an invited account is activated from the emailed link", async () => {
  const { activationUrl } = await mock.customer({ email: "invited@example.com", state: "INVITED" });
  const k = new Client();
  assert.equal((await k.post("/api/account/activate", { url: "https://example.com/nope", password: "new-password-1" })).status, 400);
  const r = await k.post("/api/account/activate", { url: activationUrl, password: "new-password-1" });
  assert.equal(r.status, 200, JSON.stringify(r.data));
  assert.equal((await k.get("/api/account/me")).data.customer.email, "invited@example.com");
  assert.equal((await new Client().post("/api/account/activate", { url: activationUrl, password: "new-password-1" })).status, 400, "a link works once");
});

test("signing in ties the bag to the customer (login, register, reset), and a bag made while signed in carries them", async () => {
  await register(new Client());
  const k = new Client();
  const cart = (await k.post("/api/cart", { lines: [line("reunion-paper-gift-box")] })).data.cart;
  assert.equal((await mock.state()).carts[0].buyerIdentity.customerId, undefined);
  await k.post("/api/account/login", { email: "ada@example.com", password: PASSWORD, cartId: cart.id });
  let bi = (await mock.state()).carts.find((x) => x.id === cart.id).buyerIdentity;
  assert.match(bi.customerId, /^gid:\/\/shopify\/Customer\//); assert.equal(bi.countryCode, "US"); assert.equal(bi.email, "ada@example.com");
  // a new bag while signed in
  const second = (await k.post("/api/cart", { lines: [line("kyoto-gift-box", 0)] })).data.cart;
  bi = (await mock.state()).carts.find((x) => x.id === second.id).buyerIdentity;
  assert.match(bi.customerId ?? "", /Customer/);
  // register with a bag
  const g = new Client();
  const gcart = (await g.post("/api/cart", { lines: [line("reunion-paper-gift-box")] })).data.cart;
  await g.post("/api/account/register", { email: "grace@example.com", password: PASSWORD, cartId: gcart.id });
  assert.match((await mock.state()).carts.find((x) => x.id === gcart.id).buyerIdentity.customerId ?? "", /Customer/);
  // a bag that no longer exists never blocks the sign-in
  assert.equal((await new Client().post("/api/account/login", { email: "ada@example.com", password: PASSWORD, cartId: "gid://shopify/Cart/c1-gone?key=x" })).status, 200);
});

test("not configured: me says so, reset / activate answer 503", async () => {
  const k = new Client(BARE_BASE);
  assert.deepEqual((await k.get("/api/account/me")).data, { configured: false, customer: null });
  assert.equal((await k.post("/api/account/reset", { url: "https://x.test/account/reset/1/abc", password: "long-enough" })).status, 503);
  assert.equal((await k.post("/api/account/activate", { url: "https://x.test/account/activate/1/abc", password: "long-enough" })).status, 503);
  const login = await k.post("/api/account/login", { email: "a@b.co", password: "long-enough" });
  assert.equal(login.status, 503); assert.equal(login.data.error, "not_configured");
});
