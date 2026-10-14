/* Shopify custom pixel: CHARM VILLA GA4 Checkout. Runs in Shopify's sandbox.
 * Checkout events only; Next.js owns storefront events. No customer PII is sent.
 * Deploy after substituting GA_MEASUREMENT_ID; analytics permission is required.
 */
/* global analytics, browser, init, api */
const GA_MEASUREMENT_ID = "G-D3YCFQMZ2W";
let privacy = init.customerPrivacy;
api.customerPrivacy.subscribe("visitorConsentCollected", event => {
  privacy = event.customerPrivacy;
  if (window.gtag) window.gtag("consent", "update", { analytics_storage: privacy.analyticsProcessingAllowed ? "granted" : "denied" });
});
let started = false;
const sent = new Set();
const numericId = id => String(id || "").split("/").pop();
const number = value => Number(value?.amount ?? 0);
const round = value => Math.round(value * 100) / 100;
function setup(attrs) {
  if (started) return;
  started = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
    ...(attrs.cv_ga_client_id__ ? { client_id: attrs.cv_ga_client_id__ } : {}),
    ...(attrs.cv_ga_session_id__ ? { session_id: attrs.cv_ga_session_id__ } : {}),
    ...(attrs.cv_ga_debug__ === "1" ? { debug_mode: true } : {}),
  });
  const script = document.createElement("script"); script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`; document.head.appendChild(script);
}
function payload(event) {
  const c = event.data.checkout;
  const items = c.lineItems.map(line => {
    const price = line.finalLinePrice ? number(line.finalLinePrice) / line.quantity : number(line.variant?.price);
    return { item_id: numericId(line.variant?.id || line.id), item_name: line.variant?.product?.title || line.title,
      item_brand: "CHARM VILLA", ...(line.variant?.title ? { item_variant: line.variant.title } : {}),
      price: round(price), quantity: line.quantity };
  });
  const currency = c.currencyCode || c.subtotalPrice?.currencyCode;
  // GA4 value excludes shipping/tax, and reflects Shopify's discounted subtotal.
  const value = c.subtotalPrice ? number(c.subtotalPrice) : round(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const coupon = (c.discountApplications || []).filter(d => d.type === "DISCOUNT_CODE").map(d => d.title).join(", ");
  // Never send checkout tokens, email-prefill query strings, address or payment details.
  return { currency, value, items, ...(coupon ? { coupon } : {}), page_location: "https://account.charmvilla.us/checkout", page_referrer: "https://www.charmvilla.com/", engagement_time_msec: 1 };
}
async function send(event, name) {
  const c = event.data?.checkout;
  if (!c || !privacy?.analyticsProcessingAllowed) return;
  const attrs = Object.fromEntries((c.attributes || []).map(a => [a.key, a.value]));
  // An explicit storefront choice is mandatory, even where Shopify defaults to allowed.
  if (attrs.cv_analytics__ !== "granted") return;
  const orderId = numericId(c.order?.id);
  if (name === "purchase" && !orderId) return;
  const key = name === "purchase" ? `cv-ga4-purchase-${orderId}` : `${name}-${event.id}`;
  if (sent.has(key)) return;
  if (name === "purchase") { try { if (await browser.localStorage.getItem(key)) return; } catch { /* in-memory + GA transaction dedup still apply */ } }
  sent.add(key);
  setup(attrs);
  const data = payload(event);
  if (name === "purchase") Object.assign(data, { transaction_id: orderId, tax: number(c.totalTax), shipping: number(c.shippingLine?.price) });
  if (name === "add_shipping_info" && c.shippingLine?.title) data.shipping_tier = c.shippingLine.title;
  window.gtag("event", name, { ...data, send_to: GA_MEASUREMENT_ID, ...(attrs.cv_ga_session_id__ ? { session_id: attrs.cv_ga_session_id__ } : {}), ...(attrs.cv_ga_debug__ === "1" ? { debug_mode: true } : {}) });
  if (name === "purchase") { try { await browser.localStorage.setItem(key, "1"); } catch { /* GA transaction_id also deduplicates */ } }
}
analytics.subscribe("checkout_started", event => send(event, "begin_checkout"));
analytics.subscribe("checkout_shipping_info_submitted", event => send(event, "add_shipping_info"));
analytics.subscribe("payment_info_submitted", event => send(event, "add_payment_info"));
analytics.subscribe("checkout_completed", event => send(event, "purchase"));
