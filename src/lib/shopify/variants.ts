// Which Shopify variant a bag line is. Read straight from src/data/shopify-map.json (client-safe, no server imports).
//   current shape: { handle, variantId, variants?: { "<English option label>": "gid://shopify/ProductVariant/…" } }
//   older shapes still read: { handle, variantId } or a bare GID string (one variant for the whole product).
// An optioned product (product.giftBox.choices) needs one GID per option, because options differ in price and stock;
// its single `variantId` is used only when the entry has no `variants` table at all (the older shape).
import shopifyMap from "@/data/shopify-map.json";
import { getProducts, findProduct } from "@/data/catalog";

type Entry = { handle?: string; variantId?: string; variants?: Record<string, string> };
const entry = (slug: string): Entry | undefined => {
  const raw = (shopifyMap as unknown as Record<string, unknown>)[slug];
  if (typeof raw === "string") return { variantId: raw };
  return raw && typeof raw === "object" ? (raw as Entry) : undefined;
};
/** The option's English label: the key used in shopify-map.json (labels are per language, the map is not). */
const optionLabel = (slug: string, option: number) => findProduct(slug, "en")?.giftBox?.choices?.[option]?.label;

/** Variant GID for a product (and the chosen option), or null when it is not mapped yet. */
export function variantFor(slug: string, option?: number): string | null {
  const e = entry(slug); if (!e) return null;
  if (option !== undefined && e.variants) { const label = optionLabel(slug, option); return (label && e.variants[label]) || null; }
  return e.variantId || null;
}

/** Reverse lookup for the bag: which product (and option) a Shopify line's variant GID belongs to. */
export function productForVariant(variantId: string): { slug: string; option?: number } | null {
  for (const p of getProducts("en")) {
    const e = entry(p.slug); if (!e) continue;
    if (e.variants) { const i = (p.giftBox?.choices ?? []).findIndex((c) => e.variants?.[c.label] === variantId); if (i >= 0) return { slug: p.slug, option: i }; }
    if (e.variantId && e.variantId === variantId) return { slug: p.slug };
  }
  return null;
}
