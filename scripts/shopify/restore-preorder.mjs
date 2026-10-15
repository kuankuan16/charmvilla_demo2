// Owner-authorized restoration of the pre-migration preorder UI, 2026-10-15.
// Dry run by default. Only custom.preorder_details is written; no inventory, pricing or channel changes.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { graphql, root } from './runtime.mjs';

const config = JSON.parse(await readFile(`${root}docs/shopify/preorder-policy-2026.json`, 'utf8'));
const snapshot = JSON.parse(await readFile(`${root}src/data/shopify-products.json`, 'utf8'));
const apply = process.argv.includes('--apply');
const targets = config.slugs.map(slug => ({ slug, id: snapshot.products[slug].id, handle: snapshot.products[slug].handle }));
const value = JSON.stringify(config.policy);
const query = `query PreorderRestore($ids: [ID!]!) {
  nodes(ids: $ids) { ... on Product {
    id handle status
    preorder: metafield(namespace: "custom", key: "preorder_details") { id type value compareDigest }
    variants(first: 100) { nodes { id price inventoryQuantity inventoryPolicy } pageInfo { hasNextPage } }
  } }
}`;
const read = async () => (await graphql('admin', query, { ids: targets.map(t => t.id) })).nodes;
const before = await read();
for (const target of targets) {
  const product = before.find(p => p?.id === target.id);
  if (!product || product.handle !== target.handle || product.variants.pageInfo.hasNextPage) throw new Error(`Product identity/pagination mismatch: ${target.slug}`);
  if (product.preorder && (product.preorder.type !== 'json' || product.preorder.value !== value)) throw new Error(`Existing preorder setting differs: ${target.slug}. Review before replacing.`);
}
const qa = `${root}docs/qa/2026-10-15-preorder-ui`;
await mkdir(qa, { recursive: true });
const record = { at: new Date().toISOString(), source: config.source, targets, products: before };
// Never replace the first backup with already-migrated values.
await writeFile(`${qa}/shopify-before.json`, JSON.stringify(record, null, 2) + '\n', { flag: 'wx' }).catch(e => { if (e.code !== 'EEXIST') throw e; });
if (!apply) {
  console.log(JSON.stringify({ dryRun: true, productCount: targets.length, slugs: config.slugs, policy: config.policy }, null, 2));
} else {
  const definitions = await graphql('admin', `query PreorderDefinition {
    metafieldDefinitions(first: 10, ownerType: PRODUCT, namespace: "custom", key: "preorder_details") { nodes { id namespace key type { name } } }
  }`);
  const definition = definitions.metafieldDefinitions.nodes[0];
  if (definition && definition.type.name !== 'json') throw new Error('Existing preorder definition has a different type.');
  if (!definition) {
    // Merchant-owned because the store and other installed apps must be able to maintain these terms.
    const created = await graphql('admin', `mutation PreorderDefinition($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition) { createdDefinition { id namespace key } userErrors { field message code } }
    }`, { definition: { name: 'Pre-order details', namespace: 'custom', key: 'preorder_details', type: 'json', ownerType: 'PRODUCT', description: 'Approved bilingual preorder terms. Does not change inventory, prices or publication.' } });
    if (created.metafieldDefinitionCreate.userErrors.length) throw new Error(JSON.stringify(created.metafieldDefinitionCreate.userErrors));
  }
  const pending = before.filter(p => p.preorder?.value !== value);
  if (pending.length) {
    const result = await graphql('admin', `mutation PreorderDetails($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) { metafields { id ownerType namespace key value compareDigest } userErrors { field message code } }
    }`, { metafields: pending.map(p => ({ ownerId: p.id, namespace: 'custom', key: 'preorder_details', type: 'json', value, compareDigest: p.preorder?.compareDigest ?? null })) });
    if (result.metafieldsSet.userErrors.length) throw new Error(JSON.stringify(result.metafieldsSet.userErrors));
  }
  const after = await read();
  for (const product of after) {
    if (product?.preorder?.value !== value) throw new Error(`Preorder readback mismatch: ${product?.handle}`);
    const original = before.find(p => p.id === product.id);
    if (JSON.stringify(product.variants) !== JSON.stringify(original.variants) || product.status !== original.status) throw new Error(`Commerce changed during restoration: ${product.handle}. Inspect without overwriting.`);
  }
  await writeFile(`${qa}/shopify-after.json`, JSON.stringify({ at: new Date().toISOString(), products: after }, null, 2) + '\n');
  console.log(JSON.stringify({ restored: targets.length, writes: pending.length, readback: true, commerceUnchanged: true }));
}
