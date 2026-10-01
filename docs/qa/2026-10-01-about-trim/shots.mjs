// Screenshots for the 2026-10-01 round: hero with the new male photograph, store cards on sand, the About page, trimmed labels.
// Usage: node docs/qa/2026-10-01-about-trim/shots.mjs <base url> [suffix]
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const base = process.argv[2] || "http://localhost:3140"; const suffix = process.argv[3] || "";
const out = new URL(".", import.meta.url).pathname;
const browser = await chromium.launch({ channel: "chrome" });
const report = {};
const home = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = []; home.on("pageerror", (e) => errors.push(String(e)));
await home.goto(base + "/", { waitUntil: "load" });
await home.waitForFunction(() => document.documentElement.classList.contains("is-loaded"), null, { timeout: 20000 });
await home.waitForTimeout(1800);
await home.screenshot({ path: `${out}home-hero${suffix}.jpg`, type: "jpeg", quality: 82 });
report.home = await home.evaluate(() => ({ heroImage: document.querySelector(".orbit-card--male img").getAttribute("src"), heroFooter: !!document.querySelector(".orbit-footer"), film: !!document.querySelector("#brand-film"),
  eyebrows: [...document.querySelectorAll(".catalog-eyebrow")].map((e) => e.innerText), kickerVisible: getComputedStyle(document.querySelector("#story-heading")).position !== "absolute" && document.querySelector("#story-heading").offsetWidth > 2 }));
for (const [id, name] of [["featured", "home-featured"], ["shown", "home-shown"], ["partners", "home-partners"], ["visit", "home-stores"]]) {
  await home.evaluate((id) => { const s = document.querySelector("[data-page-scroller]"); const el = document.getElementById(id); s.scrollTo({ top: el.getBoundingClientRect().top + s.scrollTop - 72 }); }, id);
  await home.waitForTimeout(1900); await home.screenshot({ path: `${out}${name}${suffix}.jpg`, type: "jpeg", quality: 80 });
}
report.storePanel = await home.evaluate(() => getComputedStyle(document.querySelector(".store-copy")).backgroundColor);
for (const [path, name, w, h] of [["/about", "about-zh", 1440, 900], ["/en/about", "about-en", 1440, 900], ["/about", "about-zh-mobile", 390, 844], ["/collections/tea", "collection-tea", 1440, 900], ["/", "home-hero-mobile", 390, 844]]) {
  const p = await browser.newPage({ viewport: { width: w, height: h } }); p.on("pageerror", (e) => errors.push(String(e)));
  const res = await p.goto(base + path, { waitUntil: "load" });
  if (path === "/") await p.waitForFunction(() => document.documentElement.classList.contains("is-loaded"), null, { timeout: 20000 });
  await p.waitForTimeout(2200);
  if (name.startsWith("about")) report[name] = await p.evaluate(() => { const v = document.querySelector("#brand-film video"); const r = v.getBoundingClientRect(); return { status: 200, h1: document.querySelector("h1").innerText, paused: v.paused, t: +v.currentTime.toFixed(2), film: [Math.round(r.width), Math.round(r.height)], lang: document.documentElement.lang, overflowX: document.documentElement.scrollWidth > innerWidth }; });
  if (name === "collection-tea") report.collection = await p.evaluate(() => ({ eyebrows: [...document.querySelectorAll(".catalog-eyebrow")].length, cardLinks: document.querySelectorAll(".catalog-card-link, .catalog-card-meta").length, promo: !!document.querySelector(".collection-visit"), cards: document.querySelectorAll(".catalog-card").length }));
  report[name + "Status"] = res.status();
  await p.screenshot({ path: `${out}${name}${suffix}.jpg`, type: "jpeg", quality: 80, fullPage: name === "about-zh-mobile" });
  await p.close();
}
await browser.close(); report.errors = errors;
writeFileSync(`${out}report${suffix}.json`, JSON.stringify({ base, ...report }, null, 1)); console.log(JSON.stringify(report, null, 1));
