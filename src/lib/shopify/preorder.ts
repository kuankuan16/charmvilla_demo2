// Pre-order allowance left, once Shopify is connected (客戶答覆 B7: one allowance per product, shared by every tea and lid option;
// the page shows what is left). Shopify keeps stock per variant and cannot share one pool across variants, so the count is
// worked out here: allowance (preOrderLimit in src/data/tea-gifts.ts) minus the boxes already ordered, read with the Admin API
// (read_orders). currentQuantity is used, so cancelled orders and removed or refunded items give their boxes back.
//   PREORDER_COUNT_SINCE  optional, default 2026-10-17 (launch): orders before it (store tests) are not counted
import { admin, isAdminConfigured } from "./admin";
import { ShopifyError } from "./client";
import type { Cart } from "./types";
import { productForVariant } from "./variants";
import { teaGifts } from "@/data/tea-gifts";
import shopifyMap from "@/data/shopify-map.json";

/** slug → shared allowance, for the pre-order products that have one (the two Christmas boxes have none yet). */
export const preOrderLimits: Record<string, number> = Object.fromEntries(teaGifts.filter((g) => g.preOrder && g.preOrderLimit !== undefined).map((g) => [g.slug, g.preOrderLimit as number]));

const since = () => process.env.PREORDER_COUNT_SINCE || "2026-10-17";
const handleToSlug = () => Object.fromEntries(Object.entries(shopifyMap as Record<string, { handle?: string }>).filter(([, e]) => e && typeof e === "object" && e.handle).map(([slug, e]) => [e.handle as string, slug]));

const ORDERS = `query PreOrderSold($q: String!, $after: String) {
  orders(first: 100, after: $after, query: $q) {
    nodes { lineItems(first: 50) { nodes { currentQuantity variant { id } product { handle } } } }
    pageInfo { hasNextPage endCursor }
  }
}`;
type OrdersPage = { orders: { nodes: { lineItems: { nodes: { currentQuantity: number; variant: { id: string } | null; product: { handle: string } | null }[] } }[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } };

async function soldBySlug() {
  const sold: Record<string, number> = {};
  const byHandle = handleToSlug();
  let after: string | null = null;
  for (let page = 0; page < 50; page++) {
    const r: OrdersPage = await admin<OrdersPage>(ORDERS, { q: `created_at:>=${since()} -status:cancelled`, after });
    for (const order of r.orders.nodes) for (const li of order.lineItems.nodes) {
      const slug = (li.variant && productForVariant(li.variant.id)?.slug) || (li.product && byHandle[li.product.handle]);
      if (slug && slug in preOrderLimits) sold[slug] = (sold[slug] ?? 0) + li.currentQuantity;
    }
    if (!r.orders.pageInfo.hasNextPage) break;
    after = r.orders.pageInfo.endCursor;
  }
  return sold;
}

// Counted at most every 30 s per server instance; a new order shows within that time.
let cached: { at: number; left: Record<string, number> } | null = null;
let pending: Promise<Record<string, number>> | null = null;
const TTL = 30_000;

/** slug → boxes left (never below 0). Throws not_configured until the Admin token is set. `fresh` skips the cache (adding to the bag). */
export async function preOrderLeft(fresh = false): Promise<Record<string, number>> {
  if (!fresh && cached && Date.now() - cached.at < TTL) return cached.left;
  pending ??= soldBySlug().then((sold) => {
    const left = Object.fromEntries(Object.entries(preOrderLimits).map(([slug, limit]) => [slug, Math.max(0, limit - (sold[slug] ?? 0))]));
    cached = { at: Date.now(), left };
    return left;
  }).finally(() => { pending = null; });
  return pending;
}

/**
 * Refuses a bag change that would take a pre-order product past the boxes left (409 preorder_full). Counts the whole bag after the
 * change: the lines already in it, `set` quantities by line id, plus `add`. Only a product whose quantity grows is checked. If the
 * count cannot be read (no Admin token, Shopify down) the change goes through: the cap is a guard, not a reason to stop selling.
 */
export async function assertPreOrderRoom(cart: Cart | null, add: { merchandiseId: string; quantity: number }[] = [], set: { id: string; quantity: number }[] = []) {
  if (!isAdminConfigured()) return;
  const slugOf = (variantId: string) => productForVariant(variantId)?.slug;
  const before: Record<string, number> = {};
  const after: Record<string, number> = {};
  for (const { node } of cart?.lines.edges ?? []) {
    const slug = slugOf(node.merchandise.id); if (!slug) continue;
    before[slug] = (before[slug] ?? 0) + node.quantity;
    after[slug] = (after[slug] ?? 0) + (set.find((l) => l.id === node.id)?.quantity ?? node.quantity);
  }
  for (const l of add) { const slug = slugOf(l.merchandiseId); if (slug) after[slug] = (after[slug] ?? 0) + l.quantity; }
  const grown = Object.keys(after).filter((slug) => slug in preOrderLimits && after[slug] > (before[slug] ?? 0));
  if (grown.length === 0) return;
  let left: Record<string, number>;
  try { left = await preOrderLeft(true); } catch { return; }
  for (const slug of grown) {
    if (after[slug] > left[slug]) throw new ShopifyError(left[slug] === 0 ? "這款預購已經額滿。" : `這款預購只剩 ${left[slug]} 盒，請減少數量。`, 409, "preorder_full");
  }
}
