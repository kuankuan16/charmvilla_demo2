// Screenshots of the store cards with the gold information panel, plus the computed colours.
// Usage: node docs/qa/2026-10-01-store-gold/store.mjs <base url> [suffix]
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const base = process.argv[2] || "http://localhost:3140"; const suffix = process.argv[3] || "";
const out = new URL(".", import.meta.url).pathname;
const browser = await chromium.launch({ channel: "chrome" });
const report = [];
for (const [name, path, w, h] of [["zh-desktop", "/", 1440, 900], ["en-desktop", "/en", 1440, 900], ["zh-mobile", "/", 390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.documentElement.classList.contains("is-loaded"), null, { timeout: 15000 });
  await page.evaluate(async () => {                       // scroll the real scroll container once so entrance animations have run
    const s = document.querySelector("[data-page-scroller]"); const el = s && s.scrollHeight > s.clientHeight ? s : document.scrollingElement;
    for (let y = 0; y < el.scrollHeight; y += 500) { el.scrollTop = y; await new Promise(r => setTimeout(r, 60)); }
  });
  const card = page.locator(".store-card").first();
  await card.scrollIntoViewIfNeeded(); await page.waitForTimeout(900);
  report.push({ name, ...(await card.evaluate((el) => {
    const cs = (sel) => getComputedStyle(el.querySelector(sel));
    const copy = el.querySelector(".store-copy").getBoundingClientRect();
    return { panelBackground: cs(".store-copy").backgroundColor, storeName: cs(".store-name").color, information: cs(".store-information").color, heading: cs("h3").color,
      mapBorder: cs(".store-map").borderColor, panel: [Math.round(copy.width), Math.round(copy.height)], overflowX: document.documentElement.scrollWidth > innerWidth };
  })) });
  await card.screenshot({ path: `${out}${name}${suffix}.jpg`, quality: 88, type: "jpeg" });
  await page.close();
}
await browser.close();
writeFileSync(`${out}report${suffix}.json`, JSON.stringify({ base, report }, null, 1)); console.log(JSON.stringify(report, null, 1));
