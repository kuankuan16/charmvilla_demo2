// Full-bleed partners screen, store panel colour, header during loading, brand-story brush running on behind the craft block.
// Usage: node docs/qa/2026-10-01-partners-fullbleed/shots.mjs <base url> [suffix]
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const base = process.argv[2] || "http://localhost:3140"; const suffix = process.argv[3] || "";
const out = new URL(".", import.meta.url).pathname;
const browser = await chromium.launch({ channel: "chrome" });
const report = {};
for (const [name, w, h] of [["desktop", 1440, 900], ["wide", 2000, 1141], ["mobile", 390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(base + "/", { waitUntil: "commit" });
  await page.waitForSelector("[data-component=preloader]", { timeout: 15000 }); await page.waitForTimeout(700);
  report[name + "HeaderWhileLoading"] = await page.evaluate(() => getComputedStyle(document.querySelector("[data-header]")).backgroundColor);
  await page.waitForFunction(() => document.documentElement.classList.contains("is-loaded"), null, { timeout: 20000 });
  const to = async (id, offset = 72) => { await page.evaluate(([id, offset]) => { const s = document.querySelector("[data-page-scroller]"); const el = s.scrollHeight > s.clientHeight + 1 ? s : document.scrollingElement; el.scrollTop += document.getElementById(id).getBoundingClientRect().top - offset; }, [id, offset]); await page.waitForTimeout(1900); };
  await to("partners"); await page.screenshot({ path: `${out}partners-${name}${suffix}.jpg`, type: "jpeg", quality: 82 });
  report[name] = await page.evaluate(() => { const s = document.getElementById("partners").getBoundingClientRect(); const i = document.querySelector("#partners img").getBoundingClientRect(); return { section: [Math.round(s.left), Math.round(s.width), Math.round(s.height)], image: [Math.round(i.left), Math.round(i.top), Math.round(i.width), Math.round(i.height)], button: !!document.querySelector("#partners a"), store: getComputedStyle(document.querySelector(".store-copy")).backgroundColor, headerLoaded: getComputedStyle(document.querySelector("[data-header]")).backgroundColor, overflowX: document.documentElement.scrollWidth > innerWidth }; });
  if (name !== "mobile") { await to("visit"); await page.screenshot({ path: `${out}stores-${name}${suffix}.jpg`, type: "jpeg", quality: 80 }); await to("craft", h * 0.55); await page.screenshot({ path: `${out}brush-${name}${suffix}.jpg`, type: "jpeg", quality: 80 }); }
  await page.close();
}
await browser.close();
writeFileSync(`${out}report${suffix}.json`, JSON.stringify({ base, ...report }, null, 1)); console.log(JSON.stringify(report));
