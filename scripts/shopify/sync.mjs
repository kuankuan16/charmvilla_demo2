// Read-only: refresh approved product mappings and public product data. Never imports Shopify images.
import { readFile, writeFile } from 'node:fs/promises';
import { graphql, root, domain, version } from './runtime.mjs';
const map = JSON.parse(await readFile(`${root}src/data/shopify-map.json`, 'utf8'));
const entries = Object.entries(map).filter(([, p]) => p?.productId);
const ids = entries.map(([, p]) => p.productId);
const admin = await graphql('admin', `query Catalog($ids: [ID!]!) { shop { id name myshopifyDomain currencyCode } nodes(ids: $ids) { ... on Product {
  id handle title status descriptionHtml tags options { name values }
  variants(first: 100) { nodes { id title sku price inventoryQuantity inventoryPolicy selectedOptions { name value } } pageInfo { hasNextPage } }
  metafields(first: 100) { nodes { namespace key type value } pageInfo { hasNextPage } }
  translations(locale: "zh-TW") { key value }
} } translatableResourcesByIds(first: 100, resourceIds: $ids) { nodes { resourceId translations(locale: "zh-TW") { key value outdated } } } }`, { ids });
const live = await graphql('storefront', `query CatalogAvailability($ids: [ID!]!) @inContext(country: US) { nodes(ids: $ids) { ... on Product {
  id availableForSale variants(first: 100) { nodes { id availableForSale quantityAvailable currentlyNotInStock price { amount currencyCode } } pageInfo { hasNextPage } }
} } }`, { ids });
const products = {};
for (const [slug, mapping] of entries) {
  const p = admin.nodes.find(p => p?.id === mapping.productId);
  if (!p) throw new Error(`Mapped product missing: ${slug}. Existing snapshot was not replaced.`);
  if (p.variants.pageInfo.hasNextPage || p.metafields.pageInfo.hasNextPage) throw new Error(`Pagination required for ${slug}.`);
  const sf = live.nodes.find(n => n?.id === p.id);
  if (sf?.variants.pageInfo.hasNextPage) throw new Error(`Storefront pagination required for ${slug}.`);
  products[slug] = { ...p, currency: admin.shop.currencyCode, published: Boolean(sf), availableForSale: Boolean(sf?.availableForSale),
    translations: admin.translatableResourcesByIds.nodes.find(r => r.resourceId === p.id)?.translations.filter(t => !t.outdated) ?? [],
    metafields: p.metafields.nodes.filter(m => m.namespace === 'custom'),
    variants: p.variants.nodes.map(v => {
      const sv = sf?.variants.nodes.find(s => s.id === v.id);
      return { ...v, price: sv?.price.amount ?? v.price, availableForSale: Boolean(sv?.availableForSale), quantityAvailable: sv?.quantityAvailable ?? null, currentlyNotInStock: Boolean(sv?.currentlyNotInStock) };
    }),
  };
  map[slug] = { productId: p.id, handle: p.handle, variantId: p.variants.nodes.length === 1 ? p.variants.nodes[0].id : '', variants: Object.fromEntries(p.variants.nodes.length > 1 ? p.variants.nodes.map(v => [v.title, v.id]) : []) };
}
await writeFile(`${root}src/data/shopify-products.json`, JSON.stringify({ syncedAt: new Date().toISOString(), domain, version, products }, null, 2) + '\n');
await writeFile(`${root}src/data/shopify-map.json`, JSON.stringify(map, null, 2) + '\n');
console.log(JSON.stringify({ shop: admin.shop, mapped: entries.length, storefrontAccessible: Object.values(products).filter(p => p.published).length, unavailable: Object.entries(products).filter(([, p]) => !p.published).map(([slug]) => slug) }, null, 2));
