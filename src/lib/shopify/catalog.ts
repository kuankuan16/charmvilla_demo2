import { cache } from "react";
import { getProducts, type Product } from "@/data/catalog";
import snapshot from "@/data/shopify-products.json";
import type { Locale } from "@/i18n/config";
import { admin, isAdminConfigured } from "./admin";
import { storefront, ShopifyError } from "./client";
import { isShopifyConfigured } from "./config";
import { applyShopifyProduct, type ShopifyProduct, type ShopifyVariant } from "./catalog-data";
import { preorderBatches, applyPreorderBatch, type PreorderPool } from "./preorder-batch";

const PREORDER_QUERY = `query PreorderPools($ids: [ID!]!) @inContext(country: US) {
  nodes(ids: $ids) { ... on Product { id availableForSale requiresSellingPlan
    variants(first: 1) { nodes { id price { amount currencyCode } availableForSale quantityAvailable currentlyNotInStock
      sellingPlanAllocations(first: 100) { nodes { sellingPlan { id recurringDeliveries }
        checkoutChargeAmount { amount } remainingBalanceChargeAmount { amount }
        priceAdjustments { price { amount currencyCode } }
      } pageInfo { hasNextPage } }
    } pageInfo { hasNextPage } }
  } }
}`;

export const CATALOG_QUERY = `query HeadlessCatalog($ids: [ID!]!) @inContext(country: US) {
  nodes(ids: $ids) { ... on Product {
    id title descriptionHtml availableForSale tags
    variants(first: 100) { nodes { id title sku availableForSale quantityAvailable currentlyNotInStock selectedOptions { name value } price { amount currencyCode } } pageInfo { hasNextPage } }
  } }
}`;
const CONTENT_QUERY = `query HeadlessContent($ids: [ID!]!) { shop { currencyCode } nodes(ids: $ids) { ... on Product {
  id handle title status requiresSellingPlan descriptionHtml tags metafields(first: 100) { nodes { namespace key type value } pageInfo { hasNextPage } }
  variants(first: 100) { nodes { id title sku price inventoryQuantity inventoryPolicy selectedOptions { name value } } pageInfo { hasNextPage } }
  translations(locale: "zh-TW") { key value }
} } translatableResourcesByIds(first: 100, resourceIds: $ids) { nodes { resourceId translations(locale: "zh-TW") { key value outdated } } } }`;
type LiveProduct = Pick<ShopifyProduct, "id" | "title" | "descriptionHtml" | "availableForSale" | "tags"> & { variants: { nodes: (Omit<ShopifyVariant, "price"> & { price: { amount: string; currencyCode: string } })[]; pageInfo: { hasNextPage: boolean } } };
type ContentProduct = Omit<ShopifyProduct, "metafields" | "variants"> & {
  requiresSellingPlan?: boolean;
  metafields: { nodes: ShopifyProduct["metafields"]; pageInfo: { hasNextPage: boolean } };
  variants: { nodes: Omit<ShopifyVariant, "availableForSale" | "quantityAvailable" | "currentlyNotInStock">[]; pageInfo: { hasNextPage: boolean } };
};
const rawProducts = cache(async (): Promise<Record<string, ShopifyProduct>> => {
  const source = snapshot.products as Record<string, ShopifyProduct>;
  const ids = Object.values(source).map(p => p.id);
  const batchIds = Object.values(preorderBatches).map(p => p.productId);
  if (!isAdminConfigured()) throw new ShopifyError("Shopify CMS 尚未設定。", 503, "not_configured");
  const [live, content, pools] = await Promise.all([
    storefront<{ nodes: (LiveProduct | null)[] }>(CATALOG_QUERY, { ids }),
    admin<{ shop: { currencyCode: string }; nodes: (ContentProduct | null)[]; translatableResourcesByIds: { nodes: { resourceId: string; translations: { key: string; value: string; outdated: boolean }[] }[] } }>(CONTENT_QUERY, { ids: [...ids, ...batchIds] }),
    storefront<{ nodes: (PreorderPool | null)[] }>(PREORDER_QUERY, { ids: batchIds }),
  ]);
  return Object.fromEntries(Object.entries(source).map(([slug, old]) => {
    const sf = live.nodes.find(p => p?.id === old.id);
    const cms = content.nodes.find(p => p?.id === old.id);
    if (!cms) throw new ShopifyError(`Mapped product unavailable: ${slug}`, 502);
    if (cms.variants.pageInfo.hasNextPage || cms.metafields.pageInfo.hasNextPage || sf?.variants.pageInfo.hasNextPage) throw new ShopifyError(`Catalog pagination required: ${slug}`, 502);
    const product = { ...cms, metafields: cms.metafields.nodes.filter(m => m.namespace === "custom"),
      translations: content.translatableResourcesByIds.nodes.find(r => r.resourceId === old.id)?.translations.filter(t => !t.outdated) ?? [],
      currency: sf?.variants.nodes[0]?.price.currencyCode ?? content.shop.currencyCode,
      published: Boolean(sf), availableForSale: Boolean(sf?.availableForSale),
      variants: cms.variants.nodes.map(v => {
        const sale = sf?.variants.nodes.find(s => s.id === v.id);
        return { ...v, price: sale?.price.amount ?? v.price, availableForSale: Boolean(sale?.availableForSale), quantityAvailable: sale?.quantityAvailable ?? null, currentlyNotInStock: Boolean(sale?.currentlyNotInStock) };
      }),
    };
    const batch = preorderBatches[slug];
    return [slug, batch ? applyPreorderBatch(product, batch, pools.nodes.find(p => p?.id === batch.productId), content.nodes.find(p => p?.id === batch.productId)) : product];
  }));
});

/** Live prices, stock and CMS text for SSR. An API failure never falls back to pretend in-stock data. */
export const getCommerceProducts = cache(async (lang: Locale): Promise<Product[]> => {
  const local = getProducts(lang);
  if (process.env.NEXT_PUBLIC_COMMERCE_MODE !== "shopify") return local;
  if (!isShopifyConfigured()) throw new ShopifyError("Shopify 尚未設定。", 503, "not_configured");
  const data = await rawProducts();
  return local.map(p => data[p.slug] ? applyShopifyProduct(p, data[p.slug], lang) : p);
});
export async function getCommerceProduct(slug: string, lang: Locale) {
  return (await getCommerceProducts(lang)).find(p => p.slug === slug);
}
