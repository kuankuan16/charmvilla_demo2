import { getCommerceProducts } from "./catalog";
import { preorderBatches, preorderPurchase } from "./preorder-batch";
import { productForVariant } from "./variants";
import { ShopifyError } from "./client";
import type { LineInput } from "./cart";
import { parseTeaMix, type TeaMix } from "./preorder-mix";

/** Resolve the chosen original variant to its shared batch SKU and native plan.
 * Prices and stock are still enforced by Shopify; client attributes never choose a price. */
export async function preparePreorderLines(lines: LineInput[]): Promise<LineInput[]> {
  const requests = lines.map(line => ({ line, purchase: preorderPurchase(line.merchandiseId, line.sellingPlanId) }));
  for (const { line, purchase } of requests) {
    const hasMix = Array.isArray(line.attributes) && line.attributes.some(a => a?.key === "_mix_variants" || a?.key === "_mix");
    if (hasMix && !purchase?.mixed) throw new ShopifyError("請重新選擇三盒茶款。", 400, "bad_tea_mix");
    if (purchase) continue;
    const original = productForVariant(line.merchandiseId);
    if ((original && preorderBatches[original.slug]) || Object.values(preorderBatches).some(p => p.variantId === line.merchandiseId))
      throw new ShopifyError("此預購選項目前未開放。", 400, "preorder_unavailable");
  }
  if (!requests.some(r => r.purchase)) return lines;
  const products = await getCommerceProducts("en");
  return requests.map(({ line, purchase }) => {
    if (!purchase) return line;
    const product = products.find(p => p.slug === purchase.slug);
    const variant = product?.shopifyData?.variants.find(v => v.id === purchase.sourceVariantId);
    let mix: TeaMix | undefined;
    if (purchase.mixed) {
      const attrs = Array.isArray(line.attributes) ? line.attributes.filter(a => a?.key === "_mix_variants") : [];
      try {
        if (attrs.length !== 1 || typeof attrs[0].value !== "string") throw new Error("Missing mix");
        mix = parseTeaMix(attrs[0].value, Object.keys(purchase.batch.options), purchase.batch.boxesPerUnit);
      } catch { throw new ShopifyError("請選滿三盒茶款，每盒一種口味，可重複選擇。", 400, "bad_tea_mix"); }
    }
    if (!product?.preOrder || product.soldOut || (mix
      ? !product.shopifyData?.mixAvailable || mix.some(m => !product.shopifyData?.variants.find(v => v.id === m.variantId)?.availableForSale)
      : !variant?.availableForSale))
      throw new ShopifyError("預購額度已滿或商品暫停接單。", 409, "preorder_unavailable");
    const extra = (Array.isArray(line.attributes) ? line.attributes : []).filter(a => typeof a?.key === "string" && typeof a.value === "string" && !a.key.startsWith("_") && !/^(Pre-order|Pre-order batch|Ships by|Option|Selling unit|Tea|Teas|Tea \/ Lid|Tea \/ Lid color|Packaging|Lid)$/.test(a.key));
    return { merchandiseId: purchase.batch.variantId, sellingPlanId: purchase.option.sellingPlanId, quantity: line.quantity,
      attributes: [
        ...extra,
        { key: "Pre-order", value: "Yes" },
        { key: "Pre-order batch", value: "November 2026" },
        { key: "Ships by", value: product.preOrderPolicy!.shipBy },
        ...(mix ? [
          { key: "Teas", value: mix.map(m => `${product.shopifyData!.variants.find(v => v.id === m.variantId)!.title} × ${m.quantity}`).join(", ") },
          { key: "_mix_variants", value: JSON.stringify(mix) },
        ] : variant?.title === "Default Title" ? [] : [{ key: "Option", value: variant!.title }]),
        ...(purchase.batch.unit === "set" ? [{ key: "Selling unit", value: `${purchase.batch.boxesPerUnit} boxes per set` }] : []),
        ...(purchase.sourceVariantId ? [{ key: "_source_variant", value: purchase.sourceVariantId }] : []),
      ],
    };
  });
}
