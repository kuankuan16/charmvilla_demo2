// Compatibility endpoint: actual Shopify inventory, never local pre-order allowances.
import { getCommerceProducts } from "./catalog";
export async function preOrderLeft(): Promise<Record<string, number>> {
  const products = await getCommerceProducts("en");
  return Object.fromEntries(products.filter(p => p.shopifyData).map(p => [p.slug,
    p.preOrderRemaining ?? p.shopifyData!.variants.reduce((sum, v) => sum + Math.max(0, v.quantityAvailable ?? 0), 0),
  ]));
}
