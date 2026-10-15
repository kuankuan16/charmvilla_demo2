// Read-only test catalogue: published product identities and copy come from the approved snapshot.
// All network calls use loopback and test-only tokens. Stock overrides are synthetic test scenarios, never store writes.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const GENERATED = path.join(ROOT, "tests/.generated");
export const CATALOG_FILE = path.join(GENERATED, "catalog.json");
export async function makeFixture() {
  const snapshot = JSON.parse(readFileSync(path.join(ROOT, "src/data/shopify-products.json"), "utf8"));
  const { preOrderShipping } = await import("../../src/data/tea-gifts.ts");
  const variants = {}, products = {};
  for (const [slug, p] of Object.entries(snapshot.products)) {
    const policy = p.metafields.find(m => m.key === "preorder_details");
    const options = p.variants.map(v => {
      variants[v.id] = { handle: p.handle, productTitle: p.title, title: v.title, price: Number(v.price).toFixed(1), currency: p.currency, published: p.published, image: null };
      return { label: v.title, variantId: v.id, price: Number(v.price) };
    });
    products[slug] = { name: p.title, price: Math.min(...options.map(o => o.price)), currency: p.currency, preOrder: policy ? JSON.parse(policy.value).enabled : false, published: p.published, variantId: options[0].variantId, options };
  }
  return { variants, products, snapshot, preOrderShipping };
}
export async function writeFixture() {
  const fixture = await makeFixture(); mkdirSync(GENERATED, { recursive: true });
  writeFileSync(CATALOG_FILE, JSON.stringify(fixture, null, 2)); return fixture;
}
export const readFixture = () => JSON.parse(readFileSync(CATALOG_FILE, "utf8"));
