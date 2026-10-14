// Explicit, resumable migration. Default is read-only; --apply writes only zh-TW translations and one CMS metafield.
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { graphql, root, domain } from './runtime.mjs';

export const OPERATIONS = {
  locales: `query CopyLocales { shop { myshopifyDomain } shopLocales { locale primary published } }`,
  enable: `mutation CopyLocaleEnable($locale: String!) { shopLocaleEnable(locale: $locale) { shopLocale { locale published } userErrors { field message } } }`,
  products: `query CopyProducts($ids: [ID!]!) { nodes(ids: $ids) { ... on Product { id title descriptionHtml handle status
    translations(locale: "zh-TW") { key value }
    variants(first: 100) { nodes { id title sku price inventoryQuantity selectedOptions { name value } } pageInfo { hasNextPage } }
    metafield(namespace: "custom", key: "headless_copy_zh_tw") { id value compareDigest }
  } } translatableResourcesByIds(first: 100, resourceIds: $ids) { nodes { resourceId translations(locale: "zh-TW") { key value outdated } } } }`,
  resource: `query CopyResource($id: ID!) { translatableResource(resourceId: $id) { resourceId translatableContent { key value digest locale } } }`,
  register: `mutation CopyTranslations($id: ID!, $translations: [TranslationInput!]!) { translationsRegister(resourceId: $id, translations: $translations) { translations { key value locale } userErrors { field message } } }`,
  definitions: `query CopyDefinitions { metafieldDefinitions(first: 100, ownerType: PRODUCT, namespace: "custom", key: "headless_copy_zh_tw") { nodes { id key type { name } } } }`,
  definition: `mutation CopyDefinition($definition: MetafieldDefinitionInput!) { metafieldDefinitionCreate(definition: $definition) { createdDefinition { id key } userErrors { field message } } }`,
  metafield: `mutation CopyMetafields($metafields: [MetafieldsSetInput!]!) { metafieldsSet(metafields: $metafields) { metafields { id key } userErrors { field message } } }`,
};
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const check = payload => { if (payload.userErrors?.length) throw new Error(JSON.stringify(payload.userErrors)); return payload; };
const readProducts = async ids => {
  const data = await graphql('admin', OPERATIONS.products, { ids });
  return { nodes: data.nodes.map(p => ({ ...p, translations: data.translatableResourcesByIds.nodes.find(r => r.resourceId === p.id)?.translations ?? [] })) };
};
async function main() {
  const manifest = JSON.parse(await readFile(`${root}docs/shopify/zh-TW-migration.json`, 'utf8'));
  const entries = Object.entries(manifest.products);
  const ids = entries.map(([, p]) => p.productId);
  const config = await graphql('admin', OPERATIONS.locales);
  assert.equal(config.shop.myshopifyDomain, domain);
  const before = await readProducts(ids);
  for (const [, p] of entries) {
    const node = before.nodes.find(n => n?.id === p.productId);
    assert.ok(node, `Missing product: ${p.productId}`);
    assert.equal(node.variants.pageInfo.hasNextPage, false, 'Pagination required');
    assert.equal(p.copy.locale, 'zh-TW');
  }
  if (!process.argv.includes('--apply')) {
    console.log(JSON.stringify({ mode: 'dry-run', products: ids.length, locales: config.shopLocales, mutations: ['zh-TW title/body_html translations', 'custom.headless_copy_zh_tw JSON'], commerceWrites: false }, null, 2));
    return;
  }
  const stamp = new Date().toISOString().replaceAll(':', '-');
  await mkdir(`${root}temp/shopify`, { recursive: true });
  const backup = `${root}temp/shopify/zh-copy-before-${stamp}.json`;
  await writeFile(backup, JSON.stringify({ config, before }, null, 2), { mode: 0o600 });
  if (!config.shopLocales.some(l => l.locale === 'zh-TW')) check((await graphql('admin', OPERATIONS.enable, { locale: 'zh-TW' })).shopLocaleEnable);
  const definitions = (await graphql('admin', OPERATIONS.definitions)).metafieldDefinitions.nodes;
  if (definitions.length) assert.equal(definitions[0].type.name, 'json', 'Existing CMS definition has incompatible type');
  else check((await graphql('admin', OPERATIONS.definition, { definition: { name: '繁體中文商品頁文案', namespace: 'custom', key: 'headless_copy_zh_tw', description: 'Approved Traditional Chinese Headless storefront copy: specifications, story, tea notes and brewing steps. Product title and introduction use Shopify translations.', type: 'json', ownerType: 'PRODUCT', pin: true } })).metafieldDefinitionCreate);
  const completed = [];
  for (const [slug, product] of entries) {
    const id = product.productId;
    const current = before.nodes.find(n => n.id === id);
    const resource = (await graphql('admin', OPERATIONS.resource, { id })).translatableResource;
    const values = { title: product.copy.title, body_html: `<p>${escape(product.copy.description)}</p>` };
    const translations = Object.entries(values).filter(([key, value]) => !current.translations.some(t => t.key === key && t.value === value)).map(([key, value]) => {
      const field = resource.translatableContent.find(c => c.key === key);
      assert.ok(field, `Missing translatable key: ${key}`);
      return { key, value, locale: 'zh-TW', translatableContentDigest: field.digest };
    });
    if (translations.length) check((await graphql('admin', OPERATIONS.register, { id, translations })).translationsRegister);
    const value = JSON.stringify(product.copy);
    if (current.metafield?.value !== value) check((await graphql('admin', OPERATIONS.metafield, { metafields: [{ ownerId: id, namespace: 'custom', key: 'headless_copy_zh_tw', type: 'json', value, compareDigest: current.metafield?.compareDigest ?? null }] })).metafieldsSet);
    completed.push(slug);
    console.log(`Migrated ${slug}`);
  }
  const after = await readProducts(ids);
  for (const [slug, p] of entries) {
    const old = before.nodes.find(n => n.id === p.productId), node = after.nodes.find(n => n.id === p.productId);
    assert.equal(node.title, old.title); assert.equal(node.descriptionHtml, old.descriptionHtml);
    assert.equal(node.handle, old.handle); assert.equal(node.status, old.status);
    assert.deepEqual(node.variants, old.variants, `Commerce changed during migration: ${slug}`);
    assert.equal(node.translations.find(t => t.key === 'title')?.value, p.copy.title);
    assert.equal(node.translations.find(t => t.key === 'body_html')?.value, `<p>${escape(p.copy.description)}</p>`);
    assert.deepEqual(JSON.parse(node.metafield.value), p.copy);
  }
  await mkdir(`${root}docs/qa/2026-10-14-shopify-chinese`, { recursive: true });
  await writeFile(`${root}docs/qa/2026-10-14-shopify-chinese/migration-result.json`, JSON.stringify({ verifiedAt: new Date().toISOString(), locale: 'zh-TW', completed, productTranslations: entries.length * 2, cmsFields: entries.length, englishAndCommerceUnchanged: true, noOrdersOrEmails: true }, null, 2) + '\n');
  console.log('Verified all translations and CMS fields; English, variants, prices and inventory unchanged.');
}
if (!process.argv.includes('--operations-only')) await main();
