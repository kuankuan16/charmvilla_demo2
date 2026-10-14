import { ShopifyError } from "./client";
import { shopifyConfig, NOT_CONFIGURED } from "./config";

export const hasAdminCredentials = () => Boolean(shopifyConfig.domain && (process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || (process.env.SHOPIFY_CLIENT_ID && process.env.SHOPIFY_CLIENT_SECRET)));
let cached: { token: string; until: number } | undefined;
let pending: Promise<string> | undefined;
/** Dev Dashboard client-credentials tokens expire; exchange again before expiry. Never send secrets to the browser. */
export async function getAdminToken(): Promise<string> {
  if (process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) return process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (cached && Date.now() < cached.until) return cached.token;
  if (!hasAdminCredentials()) throw new ShopifyError("Shopify Admin API 尚未設定。", 503, NOT_CONFIGURED);
  pending ??= fetch(`https://${shopifyConfig.domain}/admin/oauth/access_token`, {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: process.env.SHOPIFY_CLIENT_ID!, client_secret: process.env.SHOPIFY_CLIENT_SECRET! }),
    cache: "no-store", signal: AbortSignal.timeout(15000),
  }).then(async res => {
    if (!res.ok) throw new ShopifyError(`Shopify authentication returned ${res.status}`, 502);
    const data = await res.json() as { access_token?: string; expires_in?: number };
    if (!data.access_token || !data.expires_in) throw new ShopifyError("Shopify authentication returned no token", 502);
    cached = { token: data.access_token, until: Date.now() + (data.expires_in - 60) * 1000 };
    return cached.token;
  }).finally(() => { pending = undefined; });
  return pending;
}
