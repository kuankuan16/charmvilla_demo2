// Native Shopify option/value translations. Node 24; dry-run unless --apply is supplied.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { graphql, root } from './runtime.mjs';
import { variantLabel } from '../../src/lib/shopify/catalog-data.ts';
const manifest = JSON.parse(await readFile(`${root}docs/shopify/zh-TW-migration.json`, 'utf8'));
const query = `query CopyOptions($ids: [ID!]!) { nodes(ids: $ids) { ... on Product { id options { id name optionValues { id name linkedMetafieldValue } } } } }`;
const resourcesQuery = `query OptionTranslations($ids: [ID!]!) { translatableResourcesByIds(first: 100, resourceIds: $ids) { nodes { resourceId translatableContent { key digest } translations(locale: "zh-TW") { key value outdated } } pageInfo { hasNextPage } } }`;
const register = `mutation TranslateOption($id: ID!, $translations: [TranslationInput!]!) { translationsRegister(resourceId: $id, translations: $translations) { translations { key value } userErrors { field message } } }`;
const before = await graphql('admin', query, { ids: Object.values(manifest.products).map(p => p.productId) });
const labels = before.nodes.flatMap(p => p.options.filter(o => o.name !== 'Title').flatMap(o => {
  const name = { 'Choose Tea Flavor': '選擇茶款', Color: '盒色', 'Box Color': '盒色' }[o.name];
  assert.ok(name, `Unmapped option: ${o.name}`);
  return [{ id: o.id, key: 'name', value: name }, ...o.optionValues.map(v => {
    const value = variantLabel(v.name, 'zh'); assert.notEqual(value, v.name, `Unmapped value: ${v.name}`);
    // Shopify taxonomy color values translate their linked metaobject label, not the empty option-value resource.
    return { id: v.linkedMetafieldValue || v.id, key: v.linkedMetafieldValue ? 'label' : 'name', value };
  })];
}));
const unique = new Map();
for (const label of labels) {
  if (unique.has(label.id)) assert.equal(unique.get(label.id).value, label.value, 'Conflicting shared option translation');
  unique.set(label.id, label);
}
const desired = [...unique.values()];
assert.ok(desired.length <= 100, 'Add pagination before migrating more options.');
const ids = desired.map(d => d.id);
const resources = (await graphql('admin', resourcesQuery, { ids })).translatableResourcesByIds;
assert.equal(resources.pageInfo.hasNextPage, false);
if (!process.argv.includes('--apply')) console.log(JSON.stringify({ mode: 'dry-run', optionLabels: labels.length, translationResources: desired.length }));
else {
  await writeFile(`${root}temp/shopify/zh-options-before-${Date.now()}.json`, JSON.stringify({ before, resources }), { mode: 0o600 });
  for (const item of desired) {
    const resource = resources.nodes.find(r => r.resourceId === item.id);
    assert.ok(resource, `Resource unavailable: ${item.id}`);
    if (resource.translations.some(t => t.key === item.key && t.value === item.value && !t.outdated)) continue;
    const field = resource.translatableContent.find(c => c.key === item.key); assert.ok(field, `Missing translatable ${item.key}: ${item.id}`);
    const result = (await graphql('admin', register, { id: item.id, translations: [{ locale: 'zh-TW', key: item.key, value: item.value, translatableContentDigest: field.digest }] })).translationsRegister;
    assert.deepEqual(result.userErrors, []);
  }
  const actual = (await graphql('admin', resourcesQuery, { ids })).translatableResourcesByIds.nodes;
  for (const item of desired) assert.ok(actual.find(r => r.resourceId === item.id)?.translations.some(t => t.key === item.key && t.value === item.value && !t.outdated), `Translation missing: ${item.id}`);
  assert.deepEqual(await graphql('admin', query, { ids: before.nodes.map(p => p.id) }), before);
  await writeFile(`${root}docs/qa/2026-10-14-shopify-chinese/option-translations.json`, JSON.stringify({ verifiedAt: new Date().toISOString(), optionLabels: labels.length, translationResources: desired.length, translations: desired, originalOptionNamesUnchanged: true }, null, 2) + '\n');
  console.log(`Verified ${desired.length} native Chinese resources for ${labels.length} option labels; original option names unchanged.`);
}
