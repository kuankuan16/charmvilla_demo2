// Header bar: no backdrop blur, page colour at 80% opacity (user 2026-10-01).
import { chromium } from "playwright";
import fs from "node:fs";
const base = process.argv[2] || "https://charmvilla-gallery-site.vercel.app";
const out = new URL(".", import.meta.url).pathname;
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const res = {};
for (const [name, path, y] of [["home", "/", 1500], ["bags", "/collections/bags", 700]]) {
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(name === "home" ? 3500 : 1200);
  await page.evaluate((y) => (document.querySelector("[data-page-scroller]") || document.scrollingElement).scrollTo(0, y), y);
  await page.waitForTimeout(1200);
  res[name] = await page.$eval("[data-header]", (h) => { const c = getComputedStyle(h); return { background: c.backgroundColor, backdropFilter: c.backdropFilter || c.webkitBackdropFilter }; });
  await page.screenshot({ path: out + `header-${name}.png`, clip: { x: 0, y: 0, width: 1440, height: 260 } });
}
fs.writeFileSync(out + "header-report.json", JSON.stringify(res, null, 2));
console.log(JSON.stringify(res));
await browser.close();
