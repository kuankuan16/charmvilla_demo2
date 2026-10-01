// Scene count and shapes per product on the layout before the Karla change, plus one full-page screenshot.
import { chromium } from "playwright";
const base = process.argv[2] || "http://localhost:3140";
const out = new URL(".", import.meta.url).pathname;
const sitemap = await (await fetch(base + "/sitemap.xml")).text();
const slugs = [...new Set([...sitemap.matchAll(/<loc>[^<]*\/products\/([^<]+)<\/loc>/g)].map((m) => m[1]))];
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
for (const slug of slugs) {
  await page.goto(`${base}/products/${slug}`, { waitUntil: "load" });
  const m = await page.evaluate(() => ({ shapes: [...document.querySelectorAll(".story-fig")].map((f) => f.dataset.shape[0]).join(""), views: document.querySelectorAll(".product-slide").length, h: document.documentElement.scrollHeight }));
  console.log(slug.padEnd(38), String(m.views).padStart(2), m.shapes.padEnd(10), m.h);
}
await page.goto(`${base}/products/braided-leather-bag-white`, { waitUntil: "networkidle" });
await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } scrollTo(0, 0); });
await page.waitForTimeout(400);
await page.screenshot({ path: `${out}before-white-bag-full.jpg`, type: "jpeg", quality: 70, fullPage: true });
await browser.close();
