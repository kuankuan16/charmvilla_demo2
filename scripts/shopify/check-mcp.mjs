// Verify transport and real store access separately. Never writes Shopify data.
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const client = new Client({ name: 'charmvilla-connection-check', version: '1.0.0' });
const transport = new StdioClientTransport({
  command: 'npx', args: ['-y', '-p', 'node@24', '-c', 'node scripts/shopify/mcp.mjs'], cwd: root, stderr: 'pipe',
});
const report = { transportConnected: false, storeConnected: false, writes: 0 };
try {
  await client.connect(transport);
  report.transportConnected = true;
  report.tools = (await client.listTools()).tools.map(tool => ({ name: tool.name, readOnly: tool.annotations?.readOnlyHint === true }));
  const response = await client.callTool({ name: 'shopify_admin_query', arguments: {
    query: 'query ConnectionCheck { shop { name myshopifyDomain currencyCode } currentAppInstallation { accessScopes { handle } } }',
  } });
  if (response.isError) {
    report.error = response.content.filter(c => c.type === 'text').map(c => c.text).join('\n');
    process.exitCode = 1;
  } else {
    const data = JSON.parse(response.content.find(c => c.type === 'text').text);
    report.store = data.shop;
    report.storeConnected = data.shop.myshopifyDomain === 'zcs0bg-10.myshopify.com';
    report.scopes = data.currentAppInstallation.accessScopes.map(scope => scope.handle).sort();
    report.inventoryWriteScope = report.scopes.includes('write_inventory');
    report.mcpWritesEnabled = false;
    if (!report.storeConnected) { report.error = 'Unexpected Shopify store.'; process.exitCode = 1; }
  }
} catch (error) {
  report.error = error.message;
  process.exitCode = 1;
} finally {
  await client.close();
  console.log(JSON.stringify(report, null, 2));
}
