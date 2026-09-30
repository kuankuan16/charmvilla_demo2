// Shopify Storefront API configuration. Fill these in Vercel (Project → Settings → Environment Variables):
//   SHOPIFY_STORE_DOMAIN             e.g. charm-villa.myshopify.com   (no protocol)
//   SHOPIFY_STOREFRONT_ACCESS_TOKEN  public Storefront API token from the "Headless" sales channel
//   SHOPIFY_API_VERSION              optional, defaults below (quarterly versions, e.g. 2026-07)
//   NEXT_PUBLIC_COMMERCE_MODE        "shopify" once the three values above are set; otherwise the cart runs in
//                                    "local" mode (items kept in the browser with the site's TWD list prices, no checkout).
export const shopifyConfig = {
  domain: process.env.SHOPIFY_STORE_DOMAIN ?? "",
  token: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "",
  version: process.env.SHOPIFY_API_VERSION ?? "2026-07",
};

export const isShopifyConfigured = () => Boolean(shopifyConfig.domain && shopifyConfig.token);
export const NOT_CONFIGURED = "not_configured";
export const NOT_CONFIGURED_MESSAGE = "Shopify 尚未串接：請先填入 SHOPIFY_STORE_DOMAIN 與 SHOPIFY_STOREFRONT_ACCESS_TOKEN。";
