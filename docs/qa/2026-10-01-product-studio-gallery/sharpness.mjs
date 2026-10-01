// What the tall product image is actually served at on a 2× screen, plus a 1:1 device-pixel crop of it for the eye.
// Usage: node docs/qa/2026-10-01-product-studio-gallery/sharpness.mjs <base url> [suffix]
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
const base = process.argv[2] || "http://localhost:3150"; const suffix = process.argv[3] || "";
const out = new URL("./shots/", import.meta.url).pathname; mkdirSync(out, { recursive: true });
const sitemap = await (await fetch(base + "/sitemap.xml")).text();
const slugs = [...new Set([...sitemap.matchAll(/<loc>[^<]*\/products\/([^<]+)<\/loc>/g)].map((m) => m[1]))];
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const rows = [];
for (const slug of slugs) {
  await page.goto(`${base}/products/${slug}`, { waitUntil: "load" }); await page.waitForTimeout(300);
  const m = await page.evaluate(async () => { const i = document.querySelector(".product-slide[data-active=true] img"), b = i.getBoundingClientRect(); const real = new Image(); real.src = i.currentSrc; await real.decode(); const r = real.naturalWidth / real.naturalHeight; return { natural: [real.naturalWidth, real.naturalHeight], css: [Math.round(b.width), Math.round(b.height)], need: Math.round(Math.max(b.width, b.height * r) * devicePixelRatio) }; });
  rows.push({ slug, ...m, ratio: +(m.natural[0] / m.need).toFixed(2) });
  if (["braided-leather-bag-white", "kyoto-gift-box", "reunion-paper-gift-box", "pearl-chain-goldfish-earrings"].includes(slug)) await page.locator(".product-main-image").screenshot({ path: `${out}2x-stage-${slug}${suffix}.jpg`, quality: 90 });
}
await browser.close();
writeFileSync(new URL(`./sharpness${suffix}.json`, import.meta.url).pathname, JSON.stringify(rows, null, 1));
console.log(rows.map((r) => `${r.slug.padEnd(34)} served ${r.natural.join("x")} needs ${r.need}px wide  ratio ${r.ratio}`).join("\n"));
