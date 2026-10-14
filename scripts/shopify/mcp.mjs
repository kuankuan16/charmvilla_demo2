import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { parse, Kind } from 'graphql';
import { z } from 'zod';
import { graphql } from './runtime.mjs';

const server = new McpServer({ name: 'charmvilla-shopify', version: '1.0.0' });
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
await server.connect(new StdioServerTransport());
