import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { parse, Kind } from 'graphql';
import { z } from 'zod';
import { graphql } from './runtime.mjs';
import { createActions, inventoryInput, metafieldInput } from './mcp-actions.mjs';

const server = new McpServer({ name: 'charmvilla-shopify', version: '1.1.0' });
server.registerTool('shopify_admin_query', {
  description: 'Read the connected Charmvilla Shopify store: products, inventory, pages, blogs, metafields and metaobjects. Queries only; does not publish or mutate the store. Photos are managed by the Next.js project, not imported from Shopify.',
  inputSchema: { query: z.string(), variables: z.record(z.string(), z.unknown()).optional() },
  annotations: { readOnlyHint: true, destructiveHint: false },
}, async ({ query, variables }) => {
  try {
    const operations = parse(query).definitions.filter(d => d.kind === Kind.OPERATION_DEFINITION);
    if (operations.length !== 1 || operations[0].operation !== 'query') throw new Error('Exactly one read-only query is allowed.');
    return { content: [{ type: 'text', text: JSON.stringify(await graphql('admin', query, variables)) }] };
  } catch (e) { return { isError: true, content: [{ type: 'text', text: e.message }] }; }
});
const actions = createActions(graphql);
const result = fn => async args => {
  try { return { content: [{ type: 'text', text: JSON.stringify(await fn(args)) }] }; }
  catch (error) { return { isError: true, content: [{ type: 'text', text: error.message }] }; }
};
server.registerTool('shopify_set_inventory', {
  description: 'Set a verified catalog variant available quantity at one existing location, only for a user-requested stock correction. Read inventory first; provide the observed expectedQuantity and a new UUID idempotencyKey. Shopify atomically rejects concurrent changes. Never infer quantities or move stock between colors. Retry uncertain writes only with the identical key and arguments. Does not change inventory policy, publication, prices or fulfillment settings.',
  inputSchema: inventoryInput.shape,
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true },
}, result(actions.setInventory));
server.registerTool('shopify_set_product_metafield', {
  description: 'Edit one merchant-owned custom metafield of a verified catalog product for a user-requested CMS change. Query its current type/value/compareDigest first, then pass that digest (explicit null only for creation). Shopify atomically rejects stale edits. Does not edit images, variants, prices, publication or native product translations.',
  inputSchema: metafieldInput.shape,
  annotations: { readOnlyHint: false, destructiveHint: true },
}, result(actions.setProductMetafield));
await server.connect(new StdioServerTransport());
