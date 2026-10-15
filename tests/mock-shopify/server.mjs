// In-memory Shopify for isolated checkout tests. No real orders, customers, emails or stock are written.
// Plain Node http, no dependencies. It answers the GraphQL operations the site sends (src/lib/shopify/queries.ts, newsletter.ts,
// preorder.ts), picked by operation name, with the response shapes and the error / warning behaviour of the real APIs:
//   Storefront  POST /api/<version>/graphql.json        header X-Shopify-Storefront-Access-Token
//   Admin       POST /admin/api/<version>/graphql.json  header X-Shopify-Access-Token
//   Checkout    GET  /cart/c/<token>?key=…              a plain page standing in for Shopify's hosted checkout
// Test controls (JSON):
//   POST /__mock/reset                      forget every cart, customer, order, email and setting
//   POST /__mock/config                     { stock: { <variant gid>: n }, adminDown, storefrontDown, failNext: { op, message, code } }
//   POST /__mock/orders                     { orders: [{ createdAt, cancelled?, lines: [{ variantId, handle, quantity, currentQuantity? }] }] }
//   POST /__mock/customers                  { email, password?, state?: "ENABLED"|"DISABLED"|"INVITED", firstName?, lastName?, orders? } → { id, activationUrl? }
//   POST /__mock/cart/remove-line           { cartId, lineId }   a line taken out on Shopify's side (e.g. the variant deleted)
//   POST /__mock/cart/delete                { cartId }           the cart gone (checkout completed, or expired)
//   GET  /__mock/state                      carts, customers (no passwords), outbox (emails with their links), request log
// Nothing here is a real store fact: the variants and prices come from tests/.generated/catalog.json (built from the site's own
// catalogue by tests/support/fixture.mjs), tokens are random, and emailed links use the reserved test domain mock-shop.test.
import http from "node:http";
import { randomBytes, randomUUID } from "node:crypto";

export const STOREFRONT_TOKEN = "test-storefront-token";
export const ADMIN_TOKEN = "test-admin-token";
const EMAIL_HOST = "https://mock-shop.test";

const hex = (n = 16) => randomBytes(n).toString("hex");
const money = (amount, currencyCode = "USD") => ({ amount: Number(amount).toFixed(1), currencyCode });
const err = (message, code = "INVALID", field = null) => ({ message, code, field });

export function createMockShopify({ catalog }) {
  let state;
  const reset = () => {
    state = { carts: new Map(), customers: new Map(), tokens: new Map(), orders: [], outbox: [], log: [], stock: {}, adminDown: false, storefrontDown: false, failNext: null, seq: 1000 };
  };
  reset();
  const variants = catalog.variants;
  const nextId = () => ++state.seq;
  let origin = "";

  const sourceProducts = Object.values(catalog.snapshot.products);
  const stockOf = v => state.stock[v.id] ?? 99;
  const liveProduct = p => p.published ? { ...p, availableForSale: p.variants.some(v => stockOf(v) > 0), variants: { nodes: p.variants.map(v => ({ ...v, quantityAvailable: stockOf(v), availableForSale: stockOf(v) > 0, currentlyNotInStock: false, price: money(v.price, p.currency) })), pageInfo: { hasNextPage: false } } } : null;

  // ---------- cart ----------
  const cartToken = (id) => /^gid:\/\/shopify\/Cart\/([^?]+)/.exec(id)?.[1];
  const findCart = (id) => {
    if (typeof id !== "string" || !id.startsWith("gid://shopify/Cart/")) throw Object.assign(new Error(`Variable $id of type ID! was provided invalid value`), { graphql: true });
    return state.carts.get(cartToken(id)) ?? null;
  };
  const renderCart = (c) => {
    const lines = c.lines.map((l) => {
      const v = variants[l.merchandiseId];
      return { node: {
        id: l.id, quantity: l.quantity, attributes: l.attributes,
        cost: { totalAmount: money(Number(v.price) * l.quantity, v.currency) },
        merchandise: { id: l.merchandiseId, title: v.title, price: money(v.price, v.currency), image: v.image ? { url: `${origin}${v.image}`, altText: null } : null, product: { handle: v.handle, title: v.productTitle } },
      } };
    });
    const subtotal = c.lines.reduce((n, l) => n + Number(variants[l.merchandiseId].price) * l.quantity, 0);
    return {
      id: c.id, checkoutUrl: `${origin}/cart/c/${c.token}?key=${c.key}`, totalQuantity: c.lines.reduce((n, l) => n + l.quantity, 0),
      cost: { subtotalAmount: money(subtotal), totalAmount: money(subtotal) },
      lines: { edges: lines },
    };
  };
  const sameAttrs = (a = [], b = []) => JSON.stringify([...a].sort((x, y) => x.key.localeCompare(y.key))) === JSON.stringify([...b].sort((x, y) => x.key.localeCompare(y.key)));
  // Adds lines the way Shopify does: an unknown variant is a user error; the same variant with the same attributes merges into
  // one line; more than the configured stock is cut down to what is left (warning MERCHANDISE_NOT_ENOUGH_STOCK), none left
  // drops the line (warning MERCHANDISE_OUT_OF_STOCK).
  const addTo = (cart, lines) => {
    const userErrors = [], warnings = [];
    lines.forEach((input, i) => {
      if (!variants[input.merchandiseId] || !variants[input.merchandiseId].published) { userErrors.push(err(`The merchandise with id ${input.merchandiseId} does not exist.`, "INVALID", ["lines", String(i), "merchandiseId"])); return; }
      const quantity = input.quantity ?? 1;
      if (!Number.isInteger(quantity) || quantity < 1) { userErrors.push(err("The quantity must be greater than 0.", "INVALID", ["lines", String(i), "quantity"])); return; }
      for (const a of input.attributes ?? []) if (typeof a.key !== "string" || typeof a.value !== "string") { userErrors.push(err("Attribute key and value must be strings.", "INVALID", ["lines", String(i), "attributes"])); return; }
    });
    if (userErrors.length) return { userErrors, warnings };
    for (const input of lines) {
      const attributes = (input.attributes ?? []).map(({ key, value }) => ({ key, value }));
      let line = cart.lines.find((l) => l.merchandiseId === input.merchandiseId && sameAttrs(l.attributes, attributes));
      const want = (line?.quantity ?? 0) + (input.quantity ?? 1);
      const stock = state.stock[input.merchandiseId];
      const otherLines = cart.lines.filter((l) => l !== line && l.merchandiseId === input.merchandiseId).reduce((n, l) => n + l.quantity, 0);
      const room = stock === undefined ? Infinity : Math.max(0, stock - otherLines);
      if (room === 0) { warnings.push({ code: "MERCHANDISE_OUT_OF_STOCK", message: `The product '${variants[input.merchandiseId].productTitle}' is already sold out.`, target: input.merchandiseId }); continue; }
      if (!line) { line = { id: `gid://shopify/CartLine/${randomUUID()}?cart=${cart.token}`, merchandiseId: input.merchandiseId, quantity: 0, attributes }; cart.lines.push(line); }
      line.quantity = Math.min(want, room);
      if (want > room) warnings.push({ code: "MERCHANDISE_NOT_ENOUGH_STOCK", message: `Only ${room} items were added to your cart due to availability.`, target: line.id });
    }
    return { userErrors, warnings };
  };
  const identify = (cart, identity = {}) => {
    if (identity.customerAccessToken !== undefined) {
      const customer = customerForToken(identity.customerAccessToken);
      if (!customer) return [err("Customer access token is invalid.", "INVALID", ["buyerIdentity", "customerAccessToken"])];
      cart.buyerIdentity.customerId = customer.id; cart.buyerIdentity.email = customer.email;
    }
    if (identity.countryCode !== undefined) {
      if (!/^[A-Z]{2}$/.test(identity.countryCode)) return [err("Country code is invalid.", "INVALID", ["buyerIdentity", "countryCode"])];
      cart.buyerIdentity.countryCode = identity.countryCode;
    }
    if (identity.email !== undefined) cart.buyerIdentity.email = identity.email;
    return [];
  };
  const missingCart = () => ({ cart: null, userErrors: [err("The specified cart does not exist.", "INVALID", ["cartId"])], warnings: [] });

  // ---------- customers ----------
  const customerForToken = (token) => { const t = state.tokens.get(token); if (!t || t.expiresAt < Date.now()) return null; return state.customers.get(t.customerId) ?? null; };
  const byEmail = (email) => [...state.customers.values()].find((c) => c.email === String(email).toLowerCase()) ?? null;
  const newCustomer = (input) => {
    const n = nextId();
    const c = { id: `gid://shopify/Customer/${n}`, n, email: String(input.email).toLowerCase(), password: input.password ?? null, firstName: input.firstName ?? null, lastName: input.lastName ?? null, phone: input.phone ?? null,
      acceptsMarketing: Boolean(input.acceptsMarketing), state: input.state ?? "ENABLED", tags: [...(input.tags ?? [])], emailMarketingConsent: input.emailMarketingConsent ? { marketingState: input.emailMarketingConsent.marketingState } : null,
      addresses: [], defaultAddressId: null, orders: input.orders ?? [], resetToken: null, activationToken: null };
    state.customers.set(c.id, c);
    return c;
  };
  const issueToken = (c) => { const accessToken = hex(16); const expiresAt = Date.now() + 14 * 24 * 3600 * 1000; state.tokens.set(accessToken, { customerId: c.id, expiresAt }); return { accessToken, expiresAt: new Date(expiresAt).toISOString() }; };
  const formatted = (a) => [[a.firstName, a.lastName].filter(Boolean).join(" "), a.company, a.address1, a.address2, [a.city, [a.province, a.zip].filter(Boolean).join(" ")].filter(Boolean).join(", "), a.country].filter(Boolean);
  const renderAddress = (a) => ({ id: a.id, firstName: a.firstName ?? null, lastName: a.lastName ?? null, company: a.company ?? null, address1: a.address1 ?? null, address2: a.address2 ?? null, city: a.city ?? null, province: a.province ?? null, zip: a.zip ?? null, country: a.country ?? null, phone: a.phone ?? null, formatted: formatted(a) });
  const renderCustomer = (c) => ({
    id: c.id, firstName: c.firstName, lastName: c.lastName, email: c.email, phone: c.phone, acceptsMarketing: c.acceptsMarketing,
    defaultAddress: c.addresses.find((a) => a.id === c.defaultAddressId) ? renderAddress(c.addresses.find((a) => a.id === c.defaultAddressId)) : null,
    addresses: { edges: c.addresses.slice(0, 10).map((a) => ({ node: renderAddress(a) })) },
    orders: { edges: c.orders.map((o, i) => ({ node: { id: `gid://shopify/Order/${c.n}${i}`, orderNumber: 1001 + i, processedAt: o.processedAt ?? new Date().toISOString(), financialStatus: o.financialStatus ?? "PAID", fulfillmentStatus: o.fulfillmentStatus ?? "UNFULFILLED", statusUrl: `${EMAIL_HOST}/orders/${hex(8)}`, totalPrice: money(o.total ?? 0), lineItems: { edges: (o.lines ?? []).map((l) => ({ node: { title: l.title, quantity: l.quantity, variant: null } })) } } })) },
  });
  const validEmail = (e) => typeof e === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validPhone = (p) => p === undefined || p === null || p === "" || /^\+[1-9]\d{6,14}$/.test(String(p).replace(/[\s()-]/g, ""));
  const linkParts = (url, kind) => { try { const m = new RegExp(`/account/${kind}/(\\d+)/([^/?#]+)$`).exec(new URL(url).pathname); return m ? { n: Number(m[1]), token: m[2] } : null; } catch { return null; } };

  // ---------- Storefront operations ----------
  const storefrontOps = {
    HeadlessCatalog: ({ ids }) => ({ nodes: ids.map(id => liveProduct(sourceProducts.find(p => p.id === id))) }),
    CheckoutAnalytics: ({ id, attributes }) => { const c = findCart(id); if (!c) return { cartAttributesUpdate: missingCart() }; c.attributes = attributes; return { cartAttributesUpdate: { cart: renderCart(c), userErrors: [] } }; },
    GetCart: ({ id }) => { const c = findCart(id); return { cart: c ? renderCart(c) : null }; },
    CartCreate: ({ input = {} }) => {
      const token = `c1-${hex(12)}`, key = hex(8);
      const cart = { id: `gid://shopify/Cart/${token}?key=${key}`, token, key, lines: [], buyerIdentity: {}, createdAt: Date.now() };
      const idErrors = identify(cart, input.buyerIdentity);
      if (idErrors.length) return { cartCreate: { cart: null, userErrors: idErrors, warnings: [] } };
      const { userErrors, warnings } = addTo(cart, input.lines ?? []);
      if (userErrors.length) return { cartCreate: { cart: null, userErrors, warnings } };
      state.carts.set(token, cart);
      return { cartCreate: { cart: renderCart(cart), userErrors: [], warnings } };
    },
    CartLinesAdd: ({ cartId, lines }) => {
      const cart = findCart(cartId); if (!cart) return { cartLinesAdd: missingCart() };
      const { userErrors, warnings } = addTo(cart, lines ?? []);
      return { cartLinesAdd: { cart: renderCart(cart), userErrors, warnings } };
    },
    CartLinesUpdate: ({ cartId, lines }) => {
      const cart = findCart(cartId); if (!cart) return { cartLinesUpdate: missingCart() };
      const userErrors = [], warnings = [];
      lines.forEach((u, i) => { if (!cart.lines.some((l) => l.id === u.id)) userErrors.push(err(`The merchandise line with id ${u.id} does not exist.`, "INVALID", ["lines", String(i), "id"])); else if (!Number.isInteger(u.quantity) || u.quantity < 0) userErrors.push(err("The quantity must be a positive integer.", "INVALID", ["lines", String(i), "quantity"])); });
      if (!userErrors.length) for (const u of lines) {
        const line = cart.lines.find((l) => l.id === u.id);
        if (u.quantity === 0) { cart.lines = cart.lines.filter((l) => l !== line); continue; }
        const stock = state.stock[line.merchandiseId];
        const others = cart.lines.filter((l) => l !== line && l.merchandiseId === line.merchandiseId).reduce((n, l) => n + l.quantity, 0);
        const room = stock === undefined ? Infinity : Math.max(0, stock - others);
        line.quantity = Math.min(u.quantity, room);
        if (u.quantity > room) warnings.push({ code: "MERCHANDISE_NOT_ENOUGH_STOCK", message: `Only ${room} items were added to your cart due to availability.`, target: line.id });
      }
      return { cartLinesUpdate: { cart: renderCart(cart), userErrors, warnings } };
    },
    CartLinesRemove: ({ cartId, lineIds }) => {
      const cart = findCart(cartId); if (!cart) return { cartLinesRemove: missingCart() };
      const unknown = lineIds.filter((id) => !cart.lines.some((l) => l.id === id));
      if (unknown.length) return { cartLinesRemove: { cart: renderCart(cart), userErrors: [err(`The merchandise line with id ${unknown[0]} does not exist.`, "INVALID", ["lineIds", "0"])] } };
      cart.lines = cart.lines.filter((l) => !lineIds.includes(l.id));
      return { cartLinesRemove: { cart: renderCart(cart), userErrors: [] } };
    },
    CartBuyerIdentityUpdate: ({ cartId, buyerIdentity }) => {
      const cart = findCart(cartId); if (!cart) return { cartBuyerIdentityUpdate: missingCart() };
      const userErrors = identify(cart, buyerIdentity);
      return { cartBuyerIdentityUpdate: { cart: renderCart(cart), userErrors } };
    },
    GetCustomer: ({ token }) => { const c = customerForToken(token); return { customer: c ? renderCustomer(c) : null }; },
    CustomerCreate: ({ input }) => {
      const out = (errors) => ({ customerCreate: { customer: null, customerUserErrors: errors } });
      if (!validEmail(input.email)) return out([err("Email is invalid", "INVALID", ["input", "email"])]);
      if (!input.password || input.password.length < 5) return out([err("Password is too short (minimum is 5 characters)", "TOO_SHORT", ["input", "password"])]);
      if (!validPhone(input.phone)) return out([err("Phone is invalid", "INVALID", ["input", "phone"])]);
      const existing = byEmail(input.email);
      if (existing && existing.state !== "ENABLED") {
        // a customer without a login yet (a newsletter subscriber, a past guest buyer): Shopify emails an activation link instead
        existing.activationToken = hex(12);
        state.outbox.push({ type: "activate", to: existing.email, url: `${EMAIL_HOST}/account/activate/${existing.n}/${existing.activationToken}` });
        return out([err(`We have sent an email to ${existing.email}, please click the link included to verify your email address.`, "CUSTOMER_DISABLED", ["input"])]);
      }
      if (existing) return out([err("Email has already been taken", "TAKEN", ["input", "email"])]);
      const c = newCustomer({ ...input, state: "ENABLED" });
      return { customerCreate: { customer: { id: c.id, email: c.email }, customerUserErrors: [] } };
    },
    TokenCreate: ({ input }) => {
      const c = byEmail(input.email ?? "");
      if (!c || c.state !== "ENABLED" || c.password !== input.password) return { customerAccessTokenCreate: { customerAccessToken: null, customerUserErrors: [err("Unidentified customer", "UNIDENTIFIED_CUSTOMER", ["input"])] } };
      return { customerAccessTokenCreate: { customerAccessToken: issueToken(c), customerUserErrors: [] } };
    },
    TokenDelete: ({ token }) => { const had = state.tokens.delete(token); return { customerAccessTokenDelete: { deletedAccessToken: had ? token : null, userErrors: had ? [] : [err("access token does not exist", "INVALID")] } }; },
    Recover: ({ email }) => {
      const c = byEmail(email ?? "");
      if (!c) return { customerRecover: { customerUserErrors: [err("Could not find customer", "UNIDENTIFIED_CUSTOMER", ["email"])] } };
      c.resetToken = hex(12);
      state.outbox.push({ type: "reset", to: c.email, url: `${EMAIL_HOST}/account/reset/${c.n}/${c.resetToken}` });
      return { customerRecover: { customerUserErrors: [] } };
    },
    ResetByUrl: ({ resetUrl, password }) => {
      const out = (errors) => ({ customerResetByUrl: { customerAccessToken: null, customerUserErrors: errors } });
      const p = linkParts(resetUrl, "reset"); const c = p && [...state.customers.values()].find((x) => x.n === p.n);
      if (!c || !c.resetToken || c.resetToken !== p.token) return out([err("Url is invalid", "INVALID", ["resetUrl"])]);
      if (!password || password.length < 5) return out([err("Password is too short (minimum is 5 characters)", "TOO_SHORT", ["password"])]);
      c.password = password; c.resetToken = null; c.state = "ENABLED";
      return { customerResetByUrl: { customerAccessToken: issueToken(c), customerUserErrors: [] } };
    },
    ActivateByUrl: ({ activationUrl, password }) => {
      const out = (errors) => ({ customerActivateByUrl: { customerAccessToken: null, customerUserErrors: errors } });
      const p = linkParts(activationUrl, "activate"); const c = p && [...state.customers.values()].find((x) => x.n === p.n);
      if (!c || !c.activationToken || c.activationToken !== p.token) return out([err("Url is invalid", "INVALID", ["activationUrl"])]);
      if (c.state === "ENABLED") return out([err("Account already enabled", "ALREADY_ENABLED", ["activationUrl"])]);
      if (!password || password.length < 5) return out([err("Password is too short (minimum is 5 characters)", "TOO_SHORT", ["password"])]);
      c.password = password; c.activationToken = null; c.state = "ENABLED";
      return { customerActivateByUrl: { customerAccessToken: issueToken(c), customerUserErrors: [] } };
    },
    CustomerUpdate: ({ token, customer: input }) => {
      const out = (errors) => ({ customerUpdate: { customer: null, customerUserErrors: errors } });
      const c = customerForToken(token); if (!c) return out([err("Customer access token is invalid", "TOKEN_INVALID", ["customerAccessToken"])]);
      if (input.email !== undefined && !validEmail(input.email)) return out([err("Email is invalid", "INVALID", ["customer", "email"])]);
      if (input.email !== undefined && byEmail(input.email) && byEmail(input.email) !== c) return out([err("Email has already been taken", "TAKEN", ["customer", "email"])]);
      if (!validPhone(input.phone)) return out([err("Phone is invalid", "INVALID", ["customer", "phone"])]);
      for (const k of ["firstName", "lastName", "acceptsMarketing"]) if (input[k] !== undefined) c[k] = input[k];
      if (input.email !== undefined) c.email = input.email.toLowerCase();
      if (input.phone !== undefined) c.phone = input.phone === "" ? null : input.phone;
      if (input.password !== undefined) { c.password = input.password; for (const [t, v] of state.tokens) if (v.customerId === c.id) state.tokens.delete(t); }
      return { customerUpdate: { customer: renderCustomer(c), customerUserErrors: [] } };
    },
    AddressCreate: ({ token, address }) => {
      const c = customerForToken(token); if (!c) return { customerAddressCreate: { customerAddress: null, customerUserErrors: [err("Customer access token is invalid", "TOKEN_INVALID", ["customerAccessToken"])] } };
      if (!address.country) return { customerAddressCreate: { customerAddress: null, customerUserErrors: [err("Country can't be blank", "BLANK", ["address", "country"])] } };
      const a = { ...address, id: `gid://shopify/MailingAddress/${nextId()}?model_name=CustomerAddress` };
      c.addresses.push(a); if (!c.defaultAddressId) c.defaultAddressId = a.id; // Shopify makes the first address the default
      return { customerAddressCreate: { customerAddress: renderAddress(a), customerUserErrors: [] } };
    },
    AddressUpdate: ({ token, id, address }) => {
      const c = customerForToken(token); const a = c?.addresses.find((x) => x.id === id);
      if (!a) return { customerAddressUpdate: { customerAddress: null, customerUserErrors: [err("Address does not exist", "NOT_FOUND", ["id"])] } };
      Object.assign(a, address);
      return { customerAddressUpdate: { customerAddress: renderAddress(a), customerUserErrors: [] } };
    },
    AddressDelete: ({ token, id }) => {
      const c = customerForToken(token); const a = c?.addresses.find((x) => x.id === id);
      if (!a) return { customerAddressDelete: { deletedCustomerAddressId: null, customerUserErrors: [err("Address does not exist", "NOT_FOUND", ["id"])] } };
      c.addresses = c.addresses.filter((x) => x !== a); if (c.defaultAddressId === id) c.defaultAddressId = c.addresses[0]?.id ?? null;
      return { customerAddressDelete: { deletedCustomerAddressId: id, customerUserErrors: [] } };
    },
    AddressDefault: ({ token, id }) => {
      const c = customerForToken(token); const a = c?.addresses.find((x) => x.id === id);
      if (!a) return { customerDefaultAddressUpdate: { customer: null, customerUserErrors: [err("Address does not exist", "NOT_FOUND", ["addressId"])] } };
      c.defaultAddressId = id;
      return { customerDefaultAddressUpdate: { customer: { id: c.id }, customerUserErrors: [] } };
    },
  };

  // ---------- Admin operations ----------
  const parseOrderQuery = (q = "") => ({ since: /created_at:>=(\S+)/.exec(q)?.[1] ?? null, notCancelled: /-status:cancelled/.test(q) });
  const adminOps = {
    HeadlessContent: ({ ids }) => ({ shop: { currencyCode: "USD" }, nodes: ids.map(id => { const p = sourceProducts.find(p => p.id === id); return { ...p, variants: { nodes: p.variants, pageInfo: { hasNextPage: false } }, metafields: { nodes: p.metafields, pageInfo: { hasNextPage: false } } }; }), translatableResourcesByIds: { nodes: ids.map(id => ({ resourceId: id, translations: sourceProducts.find(p => p.id === id).translations })) } }),
    FindCustomer: ({ q }) => { const email = /email:"([^"]*)"/.exec(q ?? "")?.[1]; const c = email ? byEmail(email) : null; return { customers: { nodes: c ? [{ id: c.id, emailMarketingConsent: c.emailMarketingConsent }] : [] } }; },
    NewsletterCreate: ({ input }) => {
      if (!validEmail(input.email)) return { customerCreate: { customer: null, userErrors: [{ field: ["email"], message: "Email is invalid" }] } };
      if (byEmail(input.email)) return { customerCreate: { customer: null, userErrors: [{ field: ["email"], message: "Email has already been taken" }] } };
      const c = newCustomer({ email: input.email, tags: input.tags, emailMarketingConsent: input.emailMarketingConsent, state: "DISABLED" });
      return { customerCreate: { customer: { id: c.id }, userErrors: [] } };
    },
    NewsletterConsent: ({ input }) => {
      const c = state.customers.get(input.customerId); if (!c) return { customerEmailMarketingConsentUpdate: { customer: null, userErrors: [{ field: ["customerId"], message: "Customer does not exist" }] } };
      c.emailMarketingConsent = { marketingState: input.emailMarketingConsent.marketingState, optInLevel: input.emailMarketingConsent.marketingOptInLevel };
      return { customerEmailMarketingConsentUpdate: { customer: { id: c.id }, userErrors: [] } };
    },
    NewsletterTag: ({ id, tags }) => {
      const c = state.customers.get(id); if (!c) return { tagsAdd: { userErrors: [{ field: ["id"], message: "Resource does not exist" }] } };
      for (const t of tags) if (!c.tags.includes(t)) c.tags.push(t);
      return { tagsAdd: { userErrors: [] } };
    },
    PreOrderSold: ({ q, after }) => {
      const { since, notCancelled } = parseOrderQuery(q);
      const all = state.orders.filter((o) => (!since || o.createdAt >= since) && (!notCancelled || !o.cancelled));
      const start = after ? Number(after) : 0;
      const page = all.slice(start, start + 100);
      return { orders: {
        nodes: page.map((o) => ({ lineItems: { nodes: o.lines.map((l) => ({ currentQuantity: l.currentQuantity ?? l.quantity, variant: l.variantId ? { id: l.variantId } : null, product: l.handle ? { handle: l.handle } : null })) } })),
        pageInfo: { hasNextPage: start + 100 < all.length, endCursor: start + 100 < all.length ? String(start + 100) : null },
      } };
    },
  };

  // ---------- HTTP ----------
  const send = (res, status, body, type = "application/json") => { res.writeHead(status, { "Content-Type": type }); res.end(type === "application/json" ? JSON.stringify(body) : body); };
  const readBody = (req) => new Promise((resolve) => { let s = ""; req.on("data", (d) => (s += d)); req.on("end", () => { try { resolve(s ? JSON.parse(s) : {}); } catch { resolve(null); } }); });
  const opName = (query) => /\b(?:query|mutation)\s+([A-Za-z_]\w*)/.exec(query ?? "")?.[1];

  async function graphql(req, res, api) {
    const body = await readBody(req);
    if (!body || typeof body.query !== "string") return send(res, 400, { errors: [{ message: "Bad request: body must be JSON with a query" }] });
    const op = opName(body.query);
    state.log.push({ api, op, variables: body.variables ?? {}, buyerIp: req.headers["shopify-storefront-buyer-ip"] ?? null, version: req.url.split("/").filter(Boolean)[api === "admin" ? 2 : 1] });
    if (api === "storefront") {
      if (state.storefrontDown) return send(res, 503, { errors: [{ message: "Service unavailable" }] });
      if (req.headers["x-shopify-storefront-access-token"] !== STOREFRONT_TOKEN) return send(res, 401, { errors: [{ message: "Unauthorized", extensions: { code: "UNAUTHORIZED" } }] });
    } else {
      if (state.adminDown) return send(res, 503, { errors: [{ message: "Service unavailable" }] });
      if (req.headers["x-shopify-access-token"] !== ADMIN_TOKEN) return send(res, 401, { errors: "[API] Invalid API key or access token (unrecognized login or wrong password)" });
    }
    const ops = api === "storefront" ? storefrontOps : adminOps;
    if (!op || !ops[op]) return send(res, 200, { errors: [{ message: `mock-shopify: operation ${op ?? "(unnamed)"} is not implemented for the ${api} API` }] });
    if (state.failNext && state.failNext.op === op) {
      const f = state.failNext; state.failNext = null;
      if (f.status) return send(res, f.status, { errors: [{ message: f.message ?? "Internal error" }] });
      const root = /\b(?:query|mutation)\s+\w+\s*(?:\([^)]*\))?\s*\{\s*(\w+)/.exec(body.query)?.[1];
      return send(res, 200, { data: { [root]: { cart: null, customer: null, userErrors: [err(f.message ?? "Mock failure", f.code ?? "INVALID")], customerUserErrors: [err(f.message ?? "Mock failure", f.code ?? "INVALID")], warnings: [] } } });
    }
    try { return send(res, 200, { data: ops[op](body.variables ?? {}) }); }
    catch (e) { if (e.graphql) return send(res, 200, { errors: [{ message: e.message }] }); console.error(e); return send(res, 500, { errors: [{ message: String(e) }] }); }
  }

  const controls = {
    "/__mock/reset": () => { reset(); return { ok: true }; },
    "/__mock/config": (b) => { for (const k of ["stock", "adminDown", "storefrontDown", "failNext"]) if (k in b) state[k] = b[k]; return { ok: true }; },
    "/__mock/orders": (b) => { state.orders.push(...(b.orders ?? []).map((o) => ({ createdAt: o.createdAt ?? new Date().toISOString().slice(0, 10), cancelled: Boolean(o.cancelled), lines: o.lines ?? [] }))); return { ok: true, count: state.orders.length }; },
    "/__mock/customers": (b) => {
      const c = newCustomer({ ...b, state: b.state ?? "ENABLED" });
      if (c.state !== "ENABLED") { c.activationToken = hex(12); return { id: c.id, activationUrl: `${EMAIL_HOST}/account/activate/${c.n}/${c.activationToken}` }; }
      return { id: c.id };
    },
    "/__mock/cart/remove-line": (b) => { const c = state.carts.get(cartToken(b.cartId)); if (!c) return { ok: false }; c.lines = c.lines.filter((l) => l.id !== b.lineId); return { ok: true }; },
    "/__mock/cart/delete": (b) => ({ ok: state.carts.delete(cartToken(b.cartId)) }),
  };
  const snapshot = () => ({
    carts: [...state.carts.values()].map((c) => ({ id: c.id, buyerIdentity: c.buyerIdentity, lines: c.lines })),
    customers: [...state.customers.values()].map(({ password, ...c }) => ({ ...c, hasPassword: Boolean(password) })),
    outbox: state.outbox, log: state.log, orders: state.orders,
  });

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://x");
    if (req.method === "POST" && /^\/api\/[^/]+\/graphql\.json$/.test(url.pathname)) return graphql(req, res, "storefront");
    if (req.method === "POST" && /^\/admin\/api\/[^/]+\/graphql\.json$/.test(url.pathname)) return graphql(req, res, "admin");
    if (req.method === "POST" && controls[url.pathname]) return send(res, 200, controls[url.pathname]((await readBody(req)) ?? {}));
    if (req.method === "GET" && url.pathname === "/__mock/state") return send(res, 200, snapshot());
    if (req.method === "GET" && url.pathname === "/favicon.ico") { res.writeHead(204); return res.end(); }
    if (req.method === "GET" && url.pathname.startsWith("/cart/c/")) {
      const cart = state.carts.get(url.pathname.slice("/cart/c/".length));
      if (!cart || cart.key !== url.searchParams.get("key")) return send(res, 404, "<!doctype html><title>Not found</title><h1>Cart not found</h1>", "text/html");
      const v = renderCart(cart);
      return send(res, 200, `<!doctype html><meta charset="utf-8"><title>Mock checkout</title><h1>Mock Shopify checkout</h1><p id="country">${cart.buyerIdentity.countryCode ?? ""}</p><p id="customer">${cart.buyerIdentity.email ?? ""}</p><ul>${v.lines.edges.map(({ node }) => `<li>${node.merchandise.product.title} × ${node.quantity}</li>`).join("")}</ul><p id="subtotal">${v.cost.subtotalAmount.amount}</p>`, "text/html");
    }
    send(res, 404, { errors: [{ message: `mock-shopify: no route ${req.method} ${url.pathname}` }] });
  });

  return {
    server,
    listen: (port = 0) => new Promise((resolve) => server.listen(port, "127.0.0.1", () => { origin = `http://127.0.0.1:${server.address().port}`; resolve(origin); })),
    close: () => new Promise((resolve) => { server.closeAllConnections?.(); server.close(() => resolve()); }),
    get origin() { return origin; },
  };
}
