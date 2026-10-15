import { readFileSync } from 'node:fs';
import { z } from 'zod';

const mapping = JSON.parse(readFileSync(new URL('../../src/data/shopify-map.json', import.meta.url)));
const batches = JSON.parse(readFileSync(new URL('../../src/data/shopify-preorders.json', import.meta.url))).products;
const productIds = new Set([...Object.values(mapping), ...Object.values(batches)].map(p => p?.productId).filter(Boolean));
const gid = kind => z.string().regex(new RegExp(`^gid://shopify/${kind}/[0-9]+$`));
const integer = z.number().int().min(-2147483648).max(2147483647);
export const inventoryInput = z.object({
  variantId: gid('ProductVariant'), locationId: gid('Location'),
  quantity: integer.min(0), expectedQuantity: integer,
  idempotencyKey: z.string().uuid(),
}).strict();
export const metafieldInput = z.object({
  productId: gid('Product'), key: z.string().regex(/^[a-zA-Z0-9_-]{3,64}$/),
  type: z.enum(['json', 'single_line_text_field', 'multi_line_text_field', 'number_integer', 'number_decimal', 'boolean']),
  value: z.string().max(100000), compareDigest: z.string().min(1).nullable(),
}).strict();

const context = 'shop { myshopifyDomain } currentAppInstallation { accessScopes { handle } }';
export const INVENTORY_READ = `query InventoryBefore($variantId: ID!, $locationId: ID!) {
  ${context}
  productVariant(id: $variantId) { id title product { id title } inventoryItem {
    id tracked inventoryLevel(locationId: $locationId) {
      location { id name isActive } quantities(names: ["available"]) { name quantity }
    }
  } }
}`;
export const INVENTORY_SET = `mutation SetInventory($input: InventorySetQuantitiesInput!, $key: String!) {
  inventorySetQuantities(input: $input) @idempotent(key: $key) {
    inventoryAdjustmentGroup { createdAt reason referenceDocumentUri changes { name delta quantityAfterChange } }
    userErrors { field message code }
  }
}`;
export const METAFIELD_READ = `query MetafieldBefore($productId: ID!, $key: String!) {
  ${context}
  product(id: $productId) { id title metafield(namespace: "custom", key: $key) { key type value compareDigest } }
}`;
export const METAFIELD_SET = `mutation SetProductMetafield($metafields: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafields) {
    metafields { namespace key type value compareDigest updatedAt }
    userErrors { field message code }
  }
}`;

function checkContext(data, scope, productId) {
  if (data.shop?.myshopifyDomain !== 'zcs0bg-10.myshopify.com') throw new Error('Unexpected Shopify store; no changes sent.');
  if (!data.currentAppInstallation?.accessScopes.some(s => s.handle === scope)) throw new Error(`Missing ${scope}; no changes sent.`);
  if (!productIds.has(productId)) throw new Error('Product is outside the verified project catalog; no changes sent.');
}
function checkedPayload(payload) {
  if (!payload) throw new Error('No mutation receipt. Read the current state before deciding whether to retry.');
  if (payload.userErrors?.length) throw new Error(payload.userErrors.map(e => `${e.code}: ${e.message}`).join('; '));
  return payload;
}
// No automatic write retries. An uncertain response must not produce a second adjustment.
async function mutate(graphql, query, variables) {
  try { return await graphql('admin', query, variables); }
  catch (error) { throw new Error(`Write response uncertain: ${error.message} Read back first; any inventory retry must reuse the SAME idempotencyKey and arguments.`); }
}
export function createActions(graphql) {
  return {
    async setInventory(args) {
      const input = inventoryInput.parse(args);
      const before = await graphql('admin', INVENTORY_READ, input);
      const variant = before.productVariant;
      checkContext(before, 'write_inventory', variant?.product.id);
      const item = variant.inventoryItem;
      if (!item?.tracked || !item.inventoryLevel?.location.isActive) throw new Error('Inventory must be tracked at an active, already stocked location; no changes sent.');
      const variables = { key: input.idempotencyKey, input: {
        name: 'available', reason: 'correction',
        referenceDocumentUri: `charmvilla-mcp://inventory/${input.idempotencyKey}`,
        quantities: [{ inventoryItemId: item.id, locationId: input.locationId, quantity: input.quantity, changeFromQuantity: input.expectedQuantity }],
      } };
      // Shopify enforces the comparison atomically (2026-10 changeFromQuantity).
      // Do not pre-reject an identical idempotent replay based on a later read.
      const receipt = checkedPayload((await mutate(graphql, INVENTORY_SET, variables)).inventorySetQuantities);
      let current, readbackError;
      try { current = (await graphql('admin', INVENTORY_READ, input)).productVariant?.inventoryItem.inventoryLevel; }
      catch (error) { readbackError = error.message; }
      return { applied: true, product: variant.product, variantId: variant.id, locationId: input.locationId,
        expectedQuantity: input.expectedQuantity, requestedQuantity: input.quantity, idempotencyKey: input.idempotencyKey,
        receipt, current, readbackError };
    },
    async setProductMetafield(args) {
      const input = metafieldInput.parse(args);
      if (input.type === 'json') JSON.parse(input.value);
      const before = await graphql('admin', METAFIELD_READ, input);
      checkContext(before, 'write_products', before.product?.id);
      const metafield = { ownerId: input.productId, namespace: 'custom', key: input.key,
        type: input.type, value: input.value, compareDigest: input.compareDigest };
      const receipt = checkedPayload((await mutate(graphql, METAFIELD_SET, { metafields: [metafield] })).metafieldsSet);
      return { applied: true, productId: input.productId, before: before.product.metafield, receipt };
    },
  };
}
