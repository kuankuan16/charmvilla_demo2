// Preloader with the white goldfish on the gold half, and the partners statement at the craft-quote level.
// Usage: node docs/qa/2026-10-01-preloader-fish-partners-type/shots.mjs <base url> [suffix]
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const base = process.argv[2] || "http://localhost:3140"; const suffix = process.argv[3] || "";
const out = new URL(".", import.meta.url).pathname;
const browser = await chromium.launch({ channel: "chrome" });
const report = {};
for (const [name, path] of [["zh", "/"], ["en", "/en"]]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base + path, { waitUntil: "commit" });
  await page.waitForSelector("[data-component=preloader] img", { timeout: 15000 });
  await page.waitForTimeout(500);
  if (name === "zh") await page.screenshot({ path: `${out}preloader${suffix}.jpg`, type: "jpeg", quality: 82 });
  report[name + "Preloader"] = await page.evaluate(() => { const i = document.querySelector("[data-component=preloader] img"); const r = i.getBoundingClientRect(); return { src: i.getAttribute("src"), box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], loaded: i.complete && i.naturalWidth > 0 }; });
  await page.waitForFunction(() => document.documentElement.classList.contains("is-loaded"), null, { timeout: 20000 });
  await page.evaluate(() => { const s = document.querySelector("[data-page-scroller]"); s.scrollTo({ top: document.getElementById("partners").getBoundingClientRect().top + s.scrollTop - 72 }); });
  await page.waitForTimeout(1900);
  await page.screenshot({ path: `${out}partners-${name}${suffix}.jpg`, type: "jpeg", quality: 82 });
  report[name] = await page.evaluate(() => { const f = (sel) => { const c = getComputedStyle(document.querySelector(sel)); return `${c.fontSize} / ${c.fontWeight} / ${c.lineHeight} / ${c.letterSpacing}`; }; return { statement: f(".partners-statement"), craftQuote: f(".craft-quote"), preloaderGone: !document.querySelector("[data-component=preloader]"), overflowX: document.documentElement.scrollWidth > innerWidth }; });
  await page.close();
}
await browser.close();
writeFileSync(`${out}report${suffix}.json`, JSON.stringify({ base, ...report }, null, 1)); console.log(JSON.stringify(report, null, 1));
