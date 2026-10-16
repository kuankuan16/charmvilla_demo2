import { getCommerceProducts } from "@/lib/shopify/catalog";
import { handleError, json } from "@/lib/shopify/http";
export async function GET() {
  try {
    const products = await getCommerceProducts("en");
    return json({ products: Object.fromEntries(products.filter(p => p.shopifyData).map(p => [p.slug, {
      price: p.price, soldOut: p.soldOut, published: p.shopifyData!.published,
      preOrderRemaining: p.preOrderRemaining,
      mixAvailable: p.shopifyData!.mixAvailable,
      variants: p.shopifyData!.variants.map(v => ({ id: v.id, price: v.price, availableForSale: v.availableForSale, quantityAvailable: v.quantityAvailable })),
    }])) });
  } catch (e) { return handleError(e); }
}
