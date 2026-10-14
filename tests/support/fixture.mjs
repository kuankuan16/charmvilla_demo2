// Test fixture for the checkout tests: a copy of src/data/shopify-map.json with a FAKE variant GID for every product the US site
// sells (gid://shopify/ProductVariant/test-…), plus the price list the mock Shopify serves for those GIDs. Prices and option
// labels are read from the site's own catalogue (src/data/catalog.ts, English), so the mock store matches the product pages
// the way the real store must. Written to tests/.generated/ (git-ignored) and used only by the test build (next.config.ts):
// the fake GIDs never enter src/data/shopify-map.json or a deployed build.
// Needs the TypeScript hooks: node --import ./tests/support/register-ts.mjs …
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const GENERATED = path.join(ROOT, "tests/.generated");
export const MAP_FILE = path.join(GENERATED, "shopify-map.json");
export const CATALOG_FILE = path.join(GENERATED, "catalog.json");

const gid = (slug, i) => `gid://shopify/ProductVariant/test-${slug}${i === undefined ? "" : `-${i}`}`;
const money = (n) => `${Number(n).toFixed(1)}`;

export async function makeFixture() {
  const { getProducts } = await import("../../src/data/catalog.ts");
  const realMap = JSON.parse(readFileSync(path.join(ROOT, "src/data/shopify-map.json"), "utf8"));
  const map = { _test: "GENERATED FOR TESTS ONLY (tests/support/fixture.mjs). Fake GIDs. Never copy into src/data/shopify-map.json." };
  const variants = {}; // gid → what the mock store sells
  const products = {}; // slug → { variantId?, options?: [{ label, variantId, price }], price, preOrder, limit, mixBoxes }
  for (const [slug, entry] of Object.entries(realMap)) if (!slug.startsWith("_")) map[slug] = entry;
  for (const p of getProducts("en")) {
    // the pieces the US store sells: priced and not display-only (the Christmas Giftbox has no price yet, so it stays unmapped)
    if (p.displayOnly || !p.price) continue;
    const choices = p.giftBox?.choices;
    const base = { handle: p.slug, productTitle: p.name, image: p.image?.src ?? null };
    const info = { price: p.price.amount, currency: p.price.currency, preOrder: Boolean(p.preOrder), limit: p.preOrderRemaining, mixBoxes: p.giftBox?.mixBoxes, choiceLabel: p.giftBox?.choiceLabel, name: p.name };
    if (choices?.length && !p.giftBox?.mixBoxes) {
      const table = {};
      info.options = choices.map((c, i) => {
        const id = gid(p.slug, i); table[c.label] = id;
        variants[id] = { ...base, title: c.label, price: money(c.price ?? p.price.amount), currency: p.price.currency };
        return { label: c.label, variantId: id, price: c.price ?? p.price.amount };
      });
      map[p.slug] = { handle: p.slug, variantId: "", variants: table };
    } else {
      // no options, or a mix-and-match set sold as one variant (the teas travel as line attributes)
      const id = gid(p.slug);
      variants[id] = { ...base, title: "Default Title", price: money(p.price.amount), currency: p.price.currency };
      info.variantId = id;
      map[p.slug] = { handle: p.slug, variantId: id };
    }
    products[p.slug] = info;
  }
  return { map, variants, products };
}

export async function writeFixture() {
  const fixture = await makeFixture();
  mkdirSync(GENERATED, { recursive: true });
  writeFileSync(MAP_FILE, JSON.stringify(fixture.map, null, 2));
  writeFileSync(CATALOG_FILE, JSON.stringify({ variants: fixture.variants, products: fixture.products }, null, 2));
  return fixture;
}

export const readFixture = () => JSON.parse(readFileSync(CATALOG_FILE, "utf8"));
