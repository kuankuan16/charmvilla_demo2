import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const code = readFileSync(new URL('./shopify-checkout-pixel.js', import.meta.url), 'utf8');
function pixel(allowed = true) {
  const subscriptions = {}, stored = new Map();
  const context = { init: { customerPrivacy: { analyticsProcessingAllowed: allowed } }, api: { customerPrivacy: { subscribe() {} } }, analytics: { subscribe(name, fn) { subscriptions[name] = fn; } }, browser: { localStorage: { async getItem(k) { return stored.get(k); }, async setItem(k, v) { stored.set(k, v); } } }, window: {}, document: { createElement() { return {}; }, head: { appendChild() {} } } };
  vm.runInNewContext(code, context);
  return { subscriptions, context, events: () => (context.window.dataLayer || []).filter(a => a[0] === 'event') };
}
function event() {
  return { id: 'fixture-event', data: { checkout: { attributes: [{ key: 'cv_analytics__', value: 'granted' }, { key: 'cv_ga_client_id__', value: '123.456' }, { key: 'cv_ga_session_id__', value: '789' }], order: { id: 'gid://shopify/Order/12345' }, currencyCode: 'USD', subtotalPrice: { amount: 110 }, totalPrice: { amount: 127 }, totalTax: { amount: 7 }, shippingLine: { title: 'Standard', price: { amount: 10 } }, email: 'must-not-send@example.test', shippingAddress: { address1: 'private' }, lineItems: [{ title: 'Kyoto', quantity: 2, finalLinePrice: { amount: 110 }, variant: { id: 'gid://shopify/ProductVariant/123', title: 'Rose', price: { amount: 60 }, product: { title: 'Kyoto' } } }] } } };
}
test('Purchase uses discounted merchandise value, separates shipping/tax, stable variant ID and no PII', async () => {
  const p = pixel(); await p.subscriptions.checkout_completed(event()); const e = p.events()[0];
  assert.equal(e[1], 'purchase'); assert.equal(e[2].value, 110); assert.equal(e[2].tax, 7); assert.equal(e[2].shipping, 10); assert.equal(e[2].transaction_id, '12345'); assert.equal(e[2].items[0].price, 55); assert.equal(e[2].items[0].item_id, '123'); assert.equal(e[2].session_id, '789');
  const payload = JSON.stringify(e); assert.ok(!payload.includes('must-not-send')); assert.ok(!payload.includes('private')); assert.ok(!payload.includes('token'));
});
test('Repeated purchase events and thank-you reloads are deduplicated', async () => {
  const p = pixel(); await p.subscriptions.checkout_completed(event()); await p.subscriptions.checkout_completed({ ...event(), id: 'replay' }); assert.equal(p.events().length, 1);
});
test('Checkout cannot report a purchase without a real Shopify order ID', async () => {
  const p = pixel(); const e = event(); e.data.checkout.order = null; await p.subscriptions.checkout_completed(e); assert.equal(p.events().length, 0);
});
test('Both explicit storefront consent and Shopify analytics permission are required', async () => {
  const denied = pixel(false); await denied.subscriptions.checkout_completed(event()); assert.equal(denied.events().length, 0);
  for (const choice of ['denied', '']) { const p = pixel(); const e = event(); e.data.checkout.attributes[0].value = choice; await p.subscriptions.checkout_started(e); assert.equal(p.events().length, 0); assert.equal(p.context.window.gtag, undefined); }
});
test('Shopify checkout stages map once to standard GA4 funnel events', async () => {
  const p = pixel(); for (const name of ['checkout_started', 'checkout_shipping_info_submitted', 'payment_info_submitted']) await p.subscriptions[name](event());
  assert.deepEqual(Array.from(p.events(), e => e[1]), ['begin_checkout', 'add_shipping_info', 'add_payment_info']);
});
const ga = await import('../../src/lib/analytics/ga4.ts');
test('URL sanitization removes checkout tokens and customer inputs', () => {
  assert.equal(ga.cleanUrl('https://www.charmvilla.com/products/kyoto-gift-box?email=private@example.test&token=secret&utm_source=newsletter', true), 'https://www.charmvilla.com/products/kyoto-gift-box?utm_source=newsletter');
  assert.equal(ga.cleanUrl('https://account.charmvilla.us/checkout?key=secret'), 'https://account.charmvilla.us/checkout');
});
test('Product and cart analytics use the same Shopify variant ID', () => {
  const p = { slug: 'kyoto', name: '京都', english: 'Kyoto', category: 'tea', shopifyData: { variants: [{ id: 'gid://shopify/ProductVariant/123', title: 'Rose', price: '60' }] } };
  const c = { lines: { edges: [{ node: { quantity: 2, cost: { totalAmount: { amount: '110' } }, merchandise: { id: 'gid://shopify/ProductVariant/123', title: 'Rose', product: { title: 'Kyoto' } } } }] } };
  assert.equal(ga.productItem(p).item_id, ga.cartItems(c)[0].item_id); assert.equal(ga.cartItems(c)[0].price, 55);
});

test("Checkout and payment returns do not replace acquisition referrals", () => {
  assert.equal(ga.commerceReferrer("https://account.charmvilla.us/checkout"), true);
  assert.equal(ga.commerceReferrer("https://www.paypal.com/checkout"), true);
  assert.equal(ga.commerceReferrer("https://shop.app/"), true);
  assert.equal(ga.commerceReferrer("https://notpaypal.com/"), false);
  assert.equal(ga.commerceReferrer("https://google.com/"), false);
});
