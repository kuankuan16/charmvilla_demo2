// Craft moments driven by the scroll: the panel must stay in place while the cards change one by one, then release.
// Also screenshots the hero (corrected male photograph) and the partners block (male dancer).
// Usage: node docs/qa/2026-10-01-craft-scroll/craft.mjs <base url> [suffix]
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const base = process.argv[2] || "http://localhost:3140"; const suffix = process.argv[3] || "";
const out = new URL(".", import.meta.url).pathname;
const browser = await chromium.launch({ channel: "chrome" });
const report = [];
for (const [name, path, w, h] of [["zh-desktop", "/", 1440, 900], ["en-desktop", "/en", 1440, 900], ["zh-mobile", "/", 390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(base + path, { waitUntil: "load" });
  await page.waitForFunction(() => document.documentElement.classList.contains("is-loaded"), null, { timeout: 20000 });
  await page.waitForTimeout(800);
  const probe = (y) => page.evaluate(async (y) => {
    const s = document.querySelector("[data-page-scroller]"); const el = s && s.scrollHeight > s.clientHeight + 1 ? s : document.scrollingElement;
    if (y !== null) { el.scrollTop = y; await new Promise((r) => setTimeout(r, 450)); }
    const sec = document.getElementById("craft").getBoundingClientRect(); const pin = document.querySelector(".craft-pin").getBoundingClientRect();
    return { y: Math.round(el.scrollTop), sectionTop: Math.round(sec.top + el.scrollTop), sectionHeight: Math.round(sec.height), pinTop: Math.round(pin.top), pinHeight: Math.round(pin.height),
      active: [...document.querySelectorAll(".craft-dot")].findIndex((d) => d.getAttribute("aria-selected") === "true"), quote: document.querySelector(".craft-quote").innerText.replace(/\s+/g, " ").slice(0, 24),
      buttons: document.querySelectorAll(".craft-btn").length, overflowX: document.documentElement.scrollWidth > innerWidth };
  }, y);
  const first = await probe(0); const start = first.sectionTop, travel = first.sectionHeight - first.pinHeight; const steps = [];
  for (let k = -1; k <= 11; k++) steps.push(await probe(Math.round(start + (k / 10) * travel)));
  // a dot scrolls to its card
  await page.locator(".craft-dot").nth(2).click(); await page.waitForTimeout(1600); const afterDot = await probe(null);
  // dragging the stage must do nothing
  const stage = await page.locator(".craft-stage").boundingBox(); await page.mouse.move(stage.x + stage.width * .4, stage.y + stage.height * .5); await page.mouse.down(); await page.mouse.move(stage.x + stage.width * .1, stage.y + stage.height * .5, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(700);
  const afterDrag = await probe(null);
  await page.screenshot({ path: `${out}${name}-craft${suffix}.jpg`, type: "jpeg", quality: 80 });
  report.push({ name, travel, errors, steps, afterDot, afterDrag });
  if (name === "zh-desktop") {
    await page.evaluate(() => document.querySelector("[data-page-scroller]").scrollTo({ top: 0 })); await page.waitForTimeout(1600); await page.screenshot({ path: `${out}hero${suffix}.jpg`, type: "jpeg", quality: 82 });
    await page.evaluate(() => { const s = document.querySelector("[data-page-scroller]"); s.scrollTo({ top: document.getElementById("partners").getBoundingClientRect().top + s.scrollTop - 72 }); }); await page.waitForTimeout(1900); await page.screenshot({ path: `${out}partners${suffix}.jpg`, type: "jpeg", quality: 82 });
  }
  if (name === "zh-mobile") { await page.evaluate(() => { const s = document.querySelector("[data-page-scroller]"); const el = s.scrollHeight > s.clientHeight + 1 ? s : document.scrollingElement; el.scrollTop += document.getElementById("partners").getBoundingClientRect().top - 72; }); await page.waitForTimeout(1900); await page.screenshot({ path: `${out}partners-mobile${suffix}.jpg`, type: "jpeg", quality: 80 }); }
  await page.close();
}
await browser.close();
writeFileSync(`${out}report${suffix}.json`, JSON.stringify({ base, report }, null, 1));
for (const r of report) { console.log(r.name, "travel", r.travel, "errors", r.errors.length, "| active by tenth of travel:", r.steps.map((s) => s.active).join(" "), "| pinTop:", r.steps.map((s) => s.pinTop).join(" "), "| after dot 3:", r.afterDot.active, "| after drag:", r.afterDrag.active, "| buttons", r.afterDrag.buttons, "| overflowX", r.afterDrag.overflowX); }
