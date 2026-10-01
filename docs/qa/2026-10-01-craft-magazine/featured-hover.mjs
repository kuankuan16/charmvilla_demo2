// Homepage featured cards: the scene photograph appears while a card is hovered (user 2026-10-01: 「首頁清單 hover 時也要換情境照」).
// Usage: node docs/qa/2026-10-01-craft-magazine/featured-hover.mjs <base url> <suffix>
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const [base = "http://localhost:3160", suffix = "local"] = process.argv.slice(2);
const out = new URL(".", import.meta.url).pathname;
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base + "/", { waitUntil: "load" });
await page.waitForFunction(() => document.documentElement.classList.contains("is-loaded"), null, { timeout: 20000 });
await page.evaluate(() => { const sc = document.querySelector("[data-page-scroller]"); const el = sc && sc.scrollHeight > sc.clientHeight + 1 ? sc : document.scrollingElement; const s = document.getElementById("featured"); el.scrollTo({ top: s.getBoundingClientRect().top + el.scrollTop - 60 }); });
await page.waitForTimeout(1800);
const rows = [];
const cards = await page.locator("[data-featured-product]").all();
for (const card of cards) {
  await card.scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
  const before = await card.evaluate((c) => +getComputedStyle(c.querySelector(".catalog-card-hover") ?? c).opacity);
  await card.locator(".featured-image").hover(); await page.waitForTimeout(900);
  const m = await card.evaluate((c) => { const h = c.querySelector(".catalog-card-hover"), img = h?.querySelector("img"); return { slug: c.dataset.featuredProduct, has: !!h, opacity: h ? +getComputedStyle(h).opacity : null, loaded: !!img && img.complete && img.naturalWidth > 0, cover: decodeURIComponent(c.querySelector(".featured-image img").currentSrc).replace(/.*url=|&.*/g, "").split("/").pop(), scene: img ? decodeURIComponent(img.currentSrc).replace(/.*url=|&.*/g, "").split("/").pop() : null }; });
  rows.push({ ...m, opacityBefore: before });
  if (rows.length === 1) await page.screenshot({ path: `${out}${suffix}-featured-hover.jpg`, type: "jpeg", quality: 75 });
  await page.mouse.move(5, 400); await page.waitForTimeout(300);
}
await browser.close();
for (const r of rows) console.log(r.slug.padEnd(34), "cover", r.cover, "→ hover", r.scene, "| opacity", r.opacityBefore, "→", r.opacity, "| loaded", r.loaded);
writeFileSync(`${out}featured-hover-${suffix}.json`, JSON.stringify({ base, rows }, null, 1));
