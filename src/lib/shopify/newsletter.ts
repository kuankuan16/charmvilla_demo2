// Newsletter sign-ups go to the Shopify customer list, marked as accepting email marketing (user 2026-10-14: 「電子報用 Shopify」),
// so the brand sends with Shopify Email and members and subscribers are one list. Marketing consent can only be written with the
// Admin API, so this uses a server-only Admin token (never NEXT_PUBLIC_):
//   SHOPIFY_ADMIN_ACCESS_TOKEN  custom app → Admin API access token, scopes read_customers + write_customers
// SHOPIFY_STORE_DOMAIN and SHOPIFY_API_VERSION are shared with the Storefront client (config.ts).
import { shopifyConfig, NOT_CONFIGURED } from "./config";
import { ShopifyError } from "./client";

const adminToken = () => process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ?? "";
export const isNewsletterConfigured = () => Boolean(shopifyConfig.domain && adminToken());

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };
type UserErrors = { userErrors: { field?: string[] | null; message: string }[] };

async function admin<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  if (!isNewsletterConfigured()) throw new ShopifyError("電子報尚未串接：請先填入 SHOPIFY_STORE_DOMAIN 與 SHOPIFY_ADMIN_ACCESS_TOKEN。", 503, NOT_CONFIGURED);
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

const FIND = `query FindCustomer($q: String!) { customers(first: 1, query: $q) { nodes { id emailMarketingConsent { marketingState } } } }`;
const CREATE = `mutation NewsletterCreate($input: CustomerInput!) { customerCreate(input: $input) { customer { id } userErrors { field message } } }`;
const CONSENT = `mutation NewsletterConsent($input: CustomerEmailMarketingConsentUpdateInput!) { customerEmailMarketingConsentUpdate(input: $input) { customer { id } userErrors { field message } } }`;
const TAG = `mutation NewsletterTag($id: ID!, $tags: [String!]!) { tagsAdd(id: $id, tags: $tags) { userErrors { field message } } }`;

// tag kept on every subscriber, so the list can be filtered in Shopify (Customers → tag "newsletter")
const TAGS = ["newsletter"];
const consent = () => ({ marketingState: "SUBSCRIBED", marketingOptInLevel: "SINGLE_OPT_IN", consentUpdatedAt: new Date().toISOString() });
const check = (r: UserErrors) => { if (r.userErrors.length) throw new ShopifyError(r.userErrors[0].message, 422, "user_error"); };

async function find(email: string) {
  const r = await admin<{ customers: { nodes: { id: string; emailMarketingConsent: { marketingState: string } | null }[] } }>(FIND, { q: `email:"${email.replace(/["\\]/g, "")}"` });
  return r.customers.nodes[0] ?? null;
}

async function optIn(id: string, state?: string) {
  if (state !== "SUBSCRIBED") check((await admin<{ customerEmailMarketingConsentUpdate: UserErrors }>(CONSENT, { input: { customerId: id, emailMarketingConsent: consent() } })).customerEmailMarketingConsentUpdate);
  check((await admin<{ tagsAdd: UserErrors }>(TAG, { id, tags: TAGS })).tagsAdd);
}

/** Subscribes an email: a new customer with marketing consent, or consent added to an existing customer (a member, or a past buyer). */
export async function subscribe(email: string) {
  const existing = await find(email);
  if (existing) return optIn(existing.id, existing.emailMarketingConsent?.marketingState);
  const created = (await admin<{ customerCreate: UserErrors & { customer: { id: string } | null } }>(CREATE, { input: { email, tags: TAGS, emailMarketingConsent: consent() } })).customerCreate;
  if (created.userErrors.length) {
    // the same email created a moment ago (a double submit, or the search index not caught up): add the consent to it instead
    const again = await find(email);
    if (again) return optIn(again.id, again.emailMarketingConsent?.marketingState);
    check(created);
  }
}
