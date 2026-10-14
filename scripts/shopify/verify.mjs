// Creates and empties a temporary Storefront cart. Never creates customers, sends email or places an order.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { graphql, root, domain } from './runtime.mjs';
const base = process.env.SHOPIFY_VERIFY_URL || 'http://localhost:3026';
const source = JSON.parse(await readFile(`${root}src/data/shopify-products.json`, 'utf8'));
const admin = await graphql('admin', 'query { shop { name myshopifyDomain } currentAppInstallation { accessScopes { handle } } pages(first: 1) { nodes { id } } metaobjectDefinitions(first: 1) { nodes { type } } }');
assert.equal(admin.shop.myshopifyDomain, domain);
for (const scope of ['read_products', 'read_inventory', 'read_content', 'read_metaobjects', 'write_customers']) assert.ok(admin.currentAppInstallation.accessScopes.some(s => s.handle === scope), `Missing scope: ${scope}`);
const api = async (path, method = 'GET', body) => {
  const r = await fetch(`${base}${path}`, { method, headers: { 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  return { status: r.status, data: await r.json() };
};
const stock = await api('/api/products'); assert.equal(stock.status, 200);
assert.equal(Object.keys(stock.data.products).length, 14);
const available = Object.entries(stock.data.products).find(([slug, p]) => source.products[slug].status === 'ACTIVE' && p.published && p.variants.some(v => v.availableForSale && v.quantityAvailable >= 2));
assert.ok(available, 'Need a real in-stock variant to verify cart operations.');
const variant = available[1].variants.find(v => v.availableForSale && v.quantityAvailable >= 2);
let cart;
try {
  const added = await api('/api/cart', 'POST', { lines: [{ merchandiseId: variant.id, quantity: 1 }] });
  assert.equal(added.status, 200); cart = added.data.cart;
  assert.equal(cart.totalQuantity, 1); assert.equal(cart.cost.subtotalAmount.currencyCode, 'USD');
  assert.equal(Number(cart.cost.subtotalAmount.amount), Number(variant.price));
  const checkout = new URL(cart.checkoutUrl); assert.equal(checkout.protocol, 'https:'); assert.equal(checkout.hostname, 'account.charmvilla.us');
  const updated = await api('/api/cart', 'PATCH', { id: cart.id, lines: [{ id: cart.lines.edges[0].node.id, quantity: 2 }] });
  assert.equal(updated.status, 200); cart = updated.data.cart; assert.equal(cart.totalQuantity, 2);
  assert.equal(Number(cart.cost.subtotalAmount.amount), Number(variant.price) * 2);
  const loaded = await api(`/api/cart?id=${encodeURIComponent(cart.id)}`); assert.equal(loaded.data.cart.totalQuantity, 2);
} finally {
  if (cart?.lines.edges.length) {
    const removed = await api('/api/cart', 'DELETE', { id: cart.id, lineIds: cart.lines.edges.map(l => l.node.id) });
    assert.equal(removed.status, 200); assert.equal(removed.data.cart.totalQuantity, 0);
  }
}
const bad = await api('/api/cart', 'POST', { lines: [] }); assert.equal(bad.status, 400);
const account = await fetch(`${base}/account`, { redirect: 'manual' });
assert.equal(account.status, 307); assert.equal(account.headers.get('location'), 'https://shopify.com/98570830188/account');
console.log(JSON.stringify({ shop: admin.shop.name, products: 14, admin: 'connected', cms: 'pages and metaobject definitions readable', storefront: 'connected', cart: 'create/read/update/remove passed; test cart emptied', checkout: 'correct HTTPS host', account: 'Shopify hosted redirect verified', invalidCart: '400', noOrderPlaced: true }, null, 2));
