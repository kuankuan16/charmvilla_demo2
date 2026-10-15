// A batch has one tracked Shopify SKU. Every tea/lid is a native selling plan
// on that SKU, so Shopify checks and commits one shared inventory pool at checkout.
// Original product/variant IDs remain the identities for copy, images and options.
import mapping from "../../data/shopify-preorders.json" with { type: "json" };
import type { ShopifyProduct } from "./catalog-data";

export type PreorderBatch = { sourceProductId: string; productId: string; variantId: string; unit: string; boxesPerUnit: number; options: Record<string, { sellingPlanId: string; title: string }> };
export const preorderBatches = mapping.products as Record<string, PreorderBatch>;
export type PreorderPool = {
  id: string; availableForSale: boolean; requiresSellingPlan: boolean;
  variants: { nodes: { id: string; price: { amount: string; currencyCode: string }; availableForSale: boolean; quantityAvailable: number | null; currentlyNotInStock: boolean;
    sellingPlanAllocations: { nodes: { sellingPlan: { id: string; recurringDeliveries: boolean }; checkoutChargeAmount: { amount: string }; remainingBalanceChargeAmount: { amount: string }; priceAdjustments: { price: { amount: string; currencyCode: string } }[] }[]; pageInfo: { hasNextPage: boolean } };
  }[]; pageInfo: { hasNextPage: boolean } };
};

export function applyPreorderBatch(source: ShopifyProduct, batch: PreorderBatch, pool: PreorderPool | null | undefined, inventory: { status: string; requiresSellingPlan?: boolean; variants: { nodes: { id: string; inventoryPolicy: string }[] } } | null | undefined): ShopifyProduct {
  if (source.id !== batch.sourceProductId) throw new Error("Preorder source identity mismatch");
  const policy = JSON.parse(source.metafields.find(m => m.namespace === "custom" && m.key === "preorder_details")?.value ?? "null");
  const variant = pool?.variants.nodes.find(v => v.id === batch.variantId);
  if (pool?.variants.pageInfo.hasNextPage || variant?.sellingPlanAllocations.pageInfo.hasNextPage) throw new Error("Preorder pagination required");
  const ready = Boolean(mapping.enabled && policy?.enabled === true && inventory?.status === "ACTIVE" && inventory.requiresSellingPlan && pool?.requiresSellingPlan && inventory.variants.nodes.find(v => v.id === batch.variantId)?.inventoryPolicy === "DENY");
  const left = ready && Number.isInteger(variant?.quantityAvailable) ? Math.max(0, variant!.quantityAvailable!) : 0;
  return {
    ...source, published: Boolean(pool),
    preorderBatch: { remaining: left, unit: batch.unit === "set" ? "set" : "box" },
    availableForSale: ready && Boolean(pool?.availableForSale && variant?.availableForSale && !variant.currentlyNotInStock) && left > 0,
    variants: source.variants.map(v => {
      const option = batch.options[v.id];
      const allocation = variant?.sellingPlanAllocations.nodes.find(a => a.sellingPlan.id === option?.sellingPlanId);
      const price = allocation ? allocation.priceAdjustments[0]?.price ?? variant?.price : undefined;
      // Merchant price edits must be reflected in the plan before accepting orders.
      // Never charge a stale price or accidentally fall back to physical inventory.
      const validPlan = Boolean(allocation && price?.currencyCode === source.currency && Number(price.amount) === Number(v.price)
        && Number(allocation.checkoutChargeAmount.amount) === Number(price?.amount)
        && Number(allocation.remainingBalanceChargeAmount.amount) === 0 && !allocation.sellingPlan.recurringDeliveries);
      return { ...v, availableForSale: ready && left > 0 && Boolean(variant?.availableForSale) && validPlan,
        quantityAvailable: option ? left : 0, currentlyNotInStock: false };
    }),
  };
}

export function preorderPurchase(variantId: string, sellingPlanId?: string) {
  for (const [slug, batch] of Object.entries(preorderBatches)) {
    const pair = sellingPlanId && variantId === batch.variantId
      ? Object.entries(batch.options).find(([, option]) => option.sellingPlanId === sellingPlanId)
      : batch.options[variantId] ? [variantId, batch.options[variantId]] as const : undefined;
    if (pair) return { slug, batch, sourceVariantId: pair[0], option: pair[1] };
  }
  return null;
}
