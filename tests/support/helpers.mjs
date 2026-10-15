// Shared helpers for the checkout tests (started by tests/run.mjs, which sets the addresses below).
import { readFixture } from "./fixture.mjs";

export const BASE = process.env.TEST_BASE;            // shopify mode, pointed at the mock store
export const BARE_BASE = process.env.TEST_BARE_BASE;  // the same build with no Shopify variables
export const LOCAL_BASE = process.env.TEST_LOCAL_BASE; // local-mode build
export const MOCK = process.env.MOCK_ORIGIN;
if (!BASE || !MOCK) throw new Error("Run the checkout tests with npm run test:api / test:e2e (tests/run.mjs).");

export const fixture = readFixture();
/** Variant GID of a product (and option index) in the test fixture. */
export const variant = (slug, option) => {
  const p = fixture.products[slug]; if (!p) throw new Error(`no fixture product ${slug}`);
  return option === undefined ? p.variantId : p.options[option].variantId;
};

const post = (path, body) => fetch(`${MOCK}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body ?? {}) }).then((r) => r.json());
export const mock = {
  reset: () => post("/__mock/reset"),
  config: (c) => post("/__mock/config", c),
  orders: (orders) => post("/__mock/orders", { orders }),
  customer: (c) => post("/__mock/customers", c),
  removeLine: (cartId, lineId) => post("/__mock/cart/remove-line", { cartId, lineId }),
  deleteCart: (cartId) => post("/__mock/cart/delete", { cartId }),
  state: () => fetch(`${MOCK}/__mock/state`).then((r) => r.json()),
};

/** A tiny HTTP client with its own cookie jar (one per simulated browser). */
export class Client {
  constructor(base = BASE) { this.base = base; this.cookies = new Map(); this.lastSetCookies = []; }
  async req(method, path, body, headers = {}) {
    const cookie = [...this.cookies].map(([k, v]) => `${k}=${v}`).join("; ");
    const res = await fetch(`${this.base}${path}`, { method, headers: { ...(body !== undefined ? { "Content-Type": "application/json" } : {}), ...(cookie ? { Cookie: cookie } : {}), ...headers }, body: body === undefined ? undefined : JSON.stringify(body), redirect: "manual" });
    this.lastSetCookies = res.headers.getSetCookie();
    for (const sc of this.lastSetCookies) {
      const [pair, ...attrs] = sc.split(";"); const i = pair.indexOf("="); const k = pair.slice(0, i).trim(), v = pair.slice(i + 1).trim();
      const expired = !v || attrs.some((a) => /max-age=0/i.test(a.trim()) || (/^expires=/i.test(a.trim()) && new Date(a.trim().slice(8)) < new Date()));
      if (expired) this.cookies.delete(k); else this.cookies.set(k, v);
    }
    const text = await res.text(); let data; try { data = JSON.parse(text); } catch { data = text; }
    return { status: res.status, data, headers: res.headers };
  }
  get(p, h) { return this.req("GET", p, undefined, h); }
  post(p, b, h) { return this.req("POST", p, b, h); }
  patch(p, b, h) { return this.req("PATCH", p, b, h); }
  del(p, b, h) { return this.req("DELETE", p, b, h); }
}

export const line = (slug, option, quantity = 1, attributes) => ({ merchandiseId: variant(slug, option), quantity, ...(attributes ? { attributes } : {}) });
export const today = () => new Date().toISOString().slice(0, 10);
