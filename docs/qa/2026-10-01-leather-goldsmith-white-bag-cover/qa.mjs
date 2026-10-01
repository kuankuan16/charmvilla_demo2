// QA against the live alias: craft carousel cards 2 and 3, bag listing cover, white bag product page.
import { chromium } from "playwright";
import fs from "node:fs";
const base = process.argv[2] || "https://charmvilla-gallery-site.vercel.app";
const out = new URL(".", import.meta.url).pathname;
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
const report = { base, errors, craft: [], listing: null, product: null };
const sweep = async () => { await page.evaluate(async () => { const s = document.querySelector("[data-page-scroller]") || document.scrollingElement; const max = s.scrollHeight; for (let y = 0; y <= max; y += 600) { s.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } s.scrollTo(0, 0); }); };
const loaded = (sel) => page.$$eval(sel, (imgs) => imgs.map((i) => ({ src: decodeURIComponent(i.currentSrc || i.src).match(/[\w-]+\.webp/)?.[0], ok: i.complete && i.naturalWidth > 0 })));

await page.goto(base + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(3500);
await sweep();
await page.evaluate(() => document.querySelector("#craft").scrollIntoView({ block: "center" }));
await page.waitForTimeout(800);
for (const [i, name] of [[1, "leather"], [2, "goldsmith"]]) {
  await page.locator(".craft-dot").nth(i).click();
  await page.waitForTimeout(1400);
  const active = await page.$eval('.craft-card[data-pos="0"] img', (im) => ({ src: decodeURIComponent(im.currentSrc || im.src).match(/[\w-]+\.webp/)?.[0], ok: im.complete && im.naturalWidth > 0 }));
  const text = await page.$eval(".craft-text", (e) => e.innerText.replace(/\n+/g, " | "));
  report.craft.push({ name, active, text });
  await page.locator("#craft").screenshot({ path: out + `craft-${name}.png` });
}
await page.goto(base + "/collections/bags", { waitUntil: "networkidle" });
await page.waitForTimeout(1500); await sweep(); await page.waitForTimeout(800);
report.listing = await loaded('a[href^="/products/braided-leather-bag"] img');
await page.screenshot({ path: out + "collections-bags.png" });
await page.goto(base + "/products/braided-leather-bag-white", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
report.product = (await loaded("main img")).slice(0, 8);
await page.screenshot({ path: out + "product-white-bag.png" });
fs.writeFileSync(out + "report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
