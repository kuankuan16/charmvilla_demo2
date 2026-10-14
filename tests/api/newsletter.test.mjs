// /api/newsletter → Shopify customers with email marketing consent and the "newsletter" tag (mock Admin API).
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { Client, BARE_BASE, mock } from "../support/helpers.mjs";

beforeEach(() => mock.reset());
const sub = (body, base) => new Client(base).post("/api/newsletter", body);
const customers = async () => (await mock.state()).customers;

test("a new email becomes a subscribed customer tagged newsletter", async () => {
  const r = await sub({ email: "  New.Reader@Example.com " });
  assert.equal(r.status, 200); assert.deepEqual(r.data, { ok: true });
  const [c, ...rest] = await customers();
  assert.equal(rest.length, 0);
  assert.equal(c.email, "new.reader@example.com");
  assert.equal(c.emailMarketingConsent.marketingState, "SUBSCRIBED");
  assert.deepEqual(c.tags, ["newsletter"]);
  assert.equal(c.state, "DISABLED", "a subscriber is not a member: no login is created");
});

test("an existing customer (a member) gets consent and the tag, no duplicate", async () => {
  await mock.customer({ email: "member@example.com", password: "secret-pass" });
  const r = await sub({ email: "member@example.com" });
  assert.equal(r.status, 200);
  const list = await customers();
  assert.equal(list.length, 1);
  assert.equal(list[0].emailMarketingConsent.marketingState, "SUBSCRIBED");
  assert.deepEqual(list[0].tags, ["newsletter"]);
  assert.equal(list[0].state, "ENABLED");
});

test("subscribing twice (and two clicks at once) leaves one customer", async () => {
  const [a, b] = await Promise.all([sub({ email: "twice@example.com" }), sub({ email: "twice@example.com" })]);
  assert.equal(a.status, 200); assert.equal(b.status, 200);
  assert.equal((await sub({ email: "twice@example.com" })).status, 200);
  const list = await customers();
  assert.equal(list.length, 1); assert.deepEqual(list[0].tags, ["newsletter"]);
  // already subscribed: no second consent write
  const consents = (await mock.state()).log.filter((l) => l.op === "NewsletterConsent").length;
  assert.ok(consents <= 1, `consent written ${consents} times`);
});

test("a bad email is refused before Shopify is asked", async () => {
  for (const email of ["", "no-at-sign", "a@b", "x@y.z w", `${"a".repeat(250)}@example.com`]) {
    const r = await sub({ email });
    assert.equal(r.status, 400, email); assert.equal(r.data.error, "bad_request");
  }
  assert.equal((await mock.state()).log.length, 0);
});

test("the hidden bot field answers ok and stores nothing", async () => {
  const r = await sub({ email: "bot@example.com", company: "Acme" });
  assert.equal(r.status, 200);
  assert.equal((await customers()).length, 0);
});

test("not configured: 503 not_configured, nothing stored", async () => {
  const r = await sub({ email: "early@example.com" }, BARE_BASE);
  assert.equal(r.status, 503); assert.equal(r.data.error, "not_configured");
});

test("Admin API down: an error, not a fake success", async () => {
  await mock.config({ adminDown: true });
  const r = await sub({ email: "down@example.com" });
  assert.ok(r.status >= 500, String(r.status));
});
