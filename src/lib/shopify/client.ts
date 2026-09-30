import { shopifyConfig, isShopifyConfigured, NOT_CONFIGURED, NOT_CONFIGURED_MESSAGE } from "./config";

export class ShopifyError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status = 500, code?: string) { super(message); this.status = status; this.code = code; }
}

type GraphQLResponse<T> = { data?: T; errors?: { message: string; extensions?: { code?: string } }[] };

/** Minimal Storefront API client. Every call fails fast with a 503 until the store credentials are configured. */
export async function storefront<T>(query: string, variables: Record<string, unknown> = {}, buyerIp?: string): Promise<T> {
  if (!isShopifyConfigured()) throw new ShopifyError(NOT_CONFIGURED_MESSAGE, 503, NOT_CONFIGURED);
  const res = await fetch(`https://${shopifyConfig.domain}/api/${shopifyConfig.version}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": shopifyConfig.token,
      ...(buyerIp ? { "Shopify-Storefront-Buyer-IP": buyerIp } : {}),
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as GraphQLResponse<T>;
  if (!res.ok) throw new ShopifyError(`Shopify 回應 ${res.status}`, res.status);
  if (json.errors?.length) throw new ShopifyError(json.errors[0].message, 502, json.errors[0].extensions?.code);
  if (!json.data) throw new ShopifyError("Shopify 沒有回傳資料", 502);
  return json.data;
}

/** Storefront "userErrors" arrays become one readable message. */
export function firstUserError(errors?: { message: string; code?: string | null; field?: string[] | null }[]) {
  if (!errors || errors.length === 0) return null;
  return errors[0].message;
}
