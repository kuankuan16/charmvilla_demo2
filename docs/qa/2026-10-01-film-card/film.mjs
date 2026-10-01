// Film card QA: scrolls the homepage in steps and records, per step, whether the hero stays pinned, where the card is,
// the progress variable and whether the film is playing. Screenshots at the key positions.
// Usage: node docs/qa/2026-10-01-film-card/film.mjs <base url> [suffix]
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const base = process.argv[2] || "http://localhost:3140"; const suffix = process.argv[3] || "";
const out = new URL(".", import.meta.url).pathname;
const browser = await chromium.launch({ channel: "chrome" });
const report = [];
for (const [name, path, w, h] of [["zh-desktop", "/", 1440, 900], ["en-desktop", "/en", 1440, 900], ["zh-mobile", "/", 390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errors = []; page.on("pageerror", (e) => errors.push(String(e))); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.documentElement.classList.contains("is-loaded"), null, { timeout: 15000 });
  await page.waitForTimeout(600);
  const steps = [];
  const probe = (y) => page.evaluate(async (y) => {
    const s = document.querySelector("[data-page-scroller]"); const el = s && s.scrollHeight > s.clientHeight + 1 ? s : document.scrollingElement;
    el.scrollTop = y; await new Promise((r) => setTimeout(r, 350));
    const hero = document.querySelector(".orbit-hero").getBoundingClientRect(); const card = document.querySelector("#brand-film > div").getBoundingClientRect();
    const frame = document.querySelector("#brand-film video").getBoundingClientRect(); const v = document.querySelector("#brand-film video");
    const next = document.querySelector(".film-stage").nextElementSibling.getBoundingClientRect();
    return { y: Math.round(el.scrollTop), heroTop: Math.round(hero.top), heroWidth: Math.round(hero.width), cardTop: Math.round(card.top), cardBottom: Math.round(card.bottom), cardWidth: Math.round(card.width),
      video: [Math.round(frame.width), Math.round(frame.height)], p: getComputedStyle(document.querySelector(".film-stage")).getPropertyValue("--film-p").trim(),
      paused: v.paused, t: +v.currentTime.toFixed(2), nextTop: Math.round(next.top), overflowX: document.documentElement.scrollWidth > innerWidth };
  }, y);
  const shots = { 0: "0-hero", [Math.round(h * 0.45)]: "1-rising", [Math.round(h * 0.95)]: "2-at-rest", [Math.round(h * 1.4)]: "3-holding", [Math.round(h * 1.95)]: "4-leaving" };
  for (let y = 0; y <= h * 2.4; y += Math.round(h * 0.15)) steps.push(await probe(y));
  for (const [y, label] of Object.entries(shots)) { steps.push({ shot: label, ...(await probe(+y)) }); await page.waitForTimeout(500); await page.screenshot({ path: `${out}${name}-${label}${suffix}.jpg`, type: "jpeg", quality: 85 }); }
  report.push({ name, errors, steps });
  await page.close();
}
await browser.close();
writeFileSync(`${out}report${suffix}.json`, JSON.stringify({ base, report }, null, 1));
for (const r of report) { console.log(r.name, "errors:", r.errors.length); for (const s of r.steps) console.log("  ", JSON.stringify(s)); }
