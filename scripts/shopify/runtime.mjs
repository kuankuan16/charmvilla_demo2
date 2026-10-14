import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('../../', import.meta.url));
if (existsSync(`${root}.env.local`)) process.loadEnvFile(`${root}.env.local`);
export const domain = process.env.SHOPIFY_STORE_DOMAIN;
export const version = process.env.SHOPIFY_API_VERSION || '2026-10';
let cached, pending;
export async function adminToken() {
  if (process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) return process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (cached && Date.now() < cached.until) return cached.token;
  if (!domain || !process.env.SHOPIFY_CLIENT_ID || !process.env.SHOPIFY_CLIENT_SECRET) throw new Error('Shopify Admin credentials are not configured.');
  pending ??= fetch(`https://${domain}/admin/oauth/access_token`, {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: process.env.SHOPIFY_CLIENT_ID, client_secret: process.env.SHOPIFY_CLIENT_SECRET }),
    signal: AbortSignal.timeout(15000),
  }).then(async r => {
    if (!r.ok) throw new Error(`Shopify authentication failed (${r.status}).`);
    const j = await r.json();
    if (!j.access_token || !j.expires_in) throw new Error('Invalid Shopify token response.');
    cached = { token: j.access_token, until: Date.now() + (j.expires_in - 60) * 1000 };
    return cached.token;
  }).finally(() => { pending = undefined; });
  return pending;
}
export async function graphql(api, query, variables = {}) {
  if (!domain || !/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(domain)) throw new Error('A verified myshopify.com domain is required.');
  const token = api === 'admin' ? await adminToken() : process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!token) throw new Error(`${api} credentials are not configured.`);
  const r = await fetch(`https://${domain}/${api === 'admin' ? 'admin/' : ''}api/${version}/graphql.json`, {
    method: 'POST', headers: { 'content-type': 'application/json', [api === 'admin' ? 'X-Shopify-Access-Token' : 'X-Shopify-Storefront-Access-Token']: token },
    body: JSON.stringify({ query, variables }), signal: AbortSignal.timeout(20000),
  });
  if (!r.ok) throw new Error(`Shopify ${api} returned ${r.status}.`);
  const j = await r.json();
  if (j.errors?.length) throw new Error(j.errors.map(e => e.message).join('; '));
  if (!j.data) throw new Error('Shopify returned no data.');
  return j.data;
}
