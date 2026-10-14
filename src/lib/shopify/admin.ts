// Minimal Shopify Admin API client, server only. The token is secret (never NEXT_PUBLIC_):
//   SHOPIFY_ADMIN_ACCESS_TOKEN  custom app → Admin API access token, scopes read_customers, write_customers (newsletter.ts)
//                               and read_orders (preorder.ts, the pre-order allowance left)
// SHOPIFY_STORE_DOMAIN and SHOPIFY_API_VERSION are shared with the Storefront client (config.ts).
import { shopifyConfig, NOT_CONFIGURED } from "./config";
import { ShopifyError } from "./client";

const adminToken = () => process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ?? "";
export const isAdminConfigured = () => Boolean(shopifyConfig.domain && adminToken());

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };

export async function admin<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!isAdminConfigured()) throw new ShopifyError("Shopify Admin API 尚未串接：請先填入 SHOPIFY_STORE_DOMAIN 與 SHOPIFY_ADMIN_ACCESS_TOKEN。", 503, NOT_CONFIGURED);
  const res = await fetch(`https://${shopifyConfig.domain}/admin/api/${shopifyConfig.version}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": adminToken() },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as GraphQLResponse<T>;
  if (!res.ok) throw new ShopifyError(`Shopify 回應 ${res.status}`, res.status === 429 ? 429 : 502);
  if (json.errors?.length) throw new ShopifyError(json.errors[0].message, 502);
  if (!json.data) throw new ShopifyError("Shopify 沒有回傳資料", 502);
  return json.data;
}
