// Client request, 2026-10-16: lead with both Christmas gifts, then the 15-count
// Joyful Reunion. Presentation only; product facts and stock stay in Shopify.
export const promotedProductSlugs: readonly string[] = [
  "christmas-gift-box",
  "snowflake-gift-box",
  "reunion-paper-gift-box",
];

/** Pin existing products without mutating the catalog or adding hidden items. */
export function prioritizeProducts<T extends { slug: string }>(products: readonly T[]): T[] {
  const rank = (slug: string) => {
    const index = promotedProductSlugs.indexOf(slug);
    return index < 0 ? promotedProductSlugs.length : index;
  };
  return [...products].sort((a, b) => rank(a.slug) - rank(b.slug));
}
