// Shopify Storefront API configuration. Fill these in Vercel (Project → Settings → Environment Variables):
//   SHOPIFY_STORE_DOMAIN             e.g. charm-villa.myshopify.com   (no protocol). Tests only: a full origin with the protocol,
//                                    e.g. http://127.0.0.1:4010, points every call at the mock store (tests/mock-shopify)
//   SHOPIFY_STOREFRONT_ACCESS_TOKEN  public Storefront API token from the "Headless" sales channel
//   SHOPIFY_API_VERSION              optional, defaults below (quarterly versions, e.g. 2026-07)
//   NEXT_PUBLIC_COMMERCE_MODE        "shopify" once the three values above are set; otherwise the cart runs in
//                                    "local" mode (items kept in the browser with the site's USD list prices, no checkout).
//   NEXT_PUBLIC_ACCOUNTS_OPEN        "true" shows the Account links (header, menu, footer) once sign-in really works (E6);
//                                    separate from the mode so checkout can open first.
export const shopifyConfig = {
  domain: process.env.SHOPIFY_STORE_DOMAIN ?? "",
  token: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "",
  version: process.env.SHOPIFY_API_VERSION ?? "2026-07",
};

/** https://<domain>, or the value as given when it already starts with http:// or https:// (the checkout tests' mock store). */
export const shopifyOrigin = () => (/^https?:\/\//.test(shopifyConfig.domain) ? shopifyConfig.domain.replace(/\/+$/, "") : `https://${shopifyConfig.domain}`);

export const isShopifyConfigured = () => Boolean(shopifyConfig.domain && shopifyConfig.token);
export const NOT_CONFIGURED = "not_configured";
export const NOT_CONFIGURED_MESSAGE = "Shopify 尚未串接：請先填入 SHOPIFY_STORE_DOMAIN 與 SHOPIFY_STOREFRONT_ACCESS_TOKEN。";
