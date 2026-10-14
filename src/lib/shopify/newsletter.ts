// Newsletter sign-ups go to the Shopify customer list, marked as accepting email marketing (user 2026-10-14: 「電子報用 Shopify」),
// so the brand sends with Shopify Email and members and subscribers are one list. Marketing consent can only be written with the
// Admin API (admin.ts: the server-only SHOPIFY_ADMIN_ACCESS_TOKEN, scopes read_customers + write_customers).
import { admin } from "./admin";
import { ShopifyError } from "./client";

type UserErrors = { userErrors: { field?: string[] | null; message: string }[] };

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
