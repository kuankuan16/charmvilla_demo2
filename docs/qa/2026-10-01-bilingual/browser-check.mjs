// Browser QA for the bilingual site (Playwright + local Chrome). Usage: node docs/qa/2026-10-01-bilingual/browser-check.mjs <base_url>
//   sample pages in both languages: status, <html lang>, console errors, horizontal overflow, CJK left in the rendered English DOM
//   the language switch round-trips to the same page; 404 pages answer in the page language
//   screenshots: header with the switch (desktop + mobile menu), English home sections, English collection / product / account
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const base = (process.argv[2] || "http://localhost:3120").replace(/\/$/, "");
const dir = new URL("./", import.meta.url).pathname;
const sample = ["/", "/collections/all", "/collections/bags", "/collections/jewelry", "/collections/tea", "/collections/teaware",
  "/products/reunion-paper-gift-box", "/products/braided-leather-bag-white", "/products/diamond-goldfish-earrings", "/products/ginkgo-teaspoon-gift-box", "/products/christmas-edition-stocking", "/account"];
const en = (p) => (p === "/" ? "/en" : `/en${p}`);
const allow = ["中文", "切換為中文"]; // the switch names the other language in that language

const browser = await chromium.launch({ channel: "chrome" });
const failures = [], pages = [], cjkOnEnglish = {};
const fail = (where, what) => failures.push(`${where}: ${what}`);

async function open(context, url) {
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 200)); });
  page.on("pageerror", (e) => errors.push(`pageerror: ${String(e).slice(0, 200)}`));
  const res = await page.goto(base + url, { waitUntil: "load" });
  await page.waitForTimeout(url === "/" || url === "/en" ? 4200 : 900); // homepage: preloader + reveal
  return { page, res, errors };
}
// Scroll the whole page once so scroll-triggered content has entered (homepage scrolls [data-page-scroller], catalogue pages the window).
async function scrollThrough(page) {
  await page.evaluate(async () => {
    const el = document.querySelector("[data-page-scroller]");
    const target = el && getComputedStyle(el).overflowY !== "visible" ? el : document.scrollingElement;
    const step = innerHeight * 0.8;
    for (let y = 0; y <= target.scrollHeight; y += step) { target.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    target.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 300));
  });
}
const domReport = (page) => page.evaluate(() => {
  const cjk = /[㐀-鿿][㐀-鿿　-〿＀-￯·・]*|[　-〿＀-￯]+/g;
  const found = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) { if (n.parentElement?.closest("script,style,template")) continue; for (const m of n.textContent.match(cjk) ?? []) found.add(m); }
  for (const el of document.querySelectorAll("[alt],[aria-label],[title],[placeholder],[aria-roledescription]")) for (const a of ["alt", "aria-label", "title", "placeholder", "aria-roledescription"]) for (const m of (el.getAttribute(a) ?? "").match(cjk) ?? []) found.add(`${a}=${m}`);
  for (const m of document.title.match(cjk) ?? []) found.add(`title=${m}`);
  return { lang: document.documentElement.lang, title: document.title, cjk: [...found], overflowX: document.documentElement.scrollWidth - innerWidth };
});

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
for (const path of sample) {
  for (const [lang, url, htmlLang] of [["zh", path, "zh-Hant"], ["en", en(path), "en"]]) {
    const { page, res, errors } = await open(desktop, url);
    await scrollThrough(page);
    const dom = await domReport(page);
    if (res.status() !== 200) fail(url, `status ${res.status()}`);
    if (dom.lang !== htmlLang) fail(url, `<html lang> ${dom.lang}`);
    if (dom.overflowX > 1) fail(url, `horizontal overflow ${dom.overflowX}px`);
    const realErrors = errors.filter((e) => !/api\/account\/me|401/.test(e));
    if (realErrors.length) fail(url, `console: ${realErrors.join(" | ")}`);
    if (lang === "en") { const left = dom.cjk.filter((s) => !allow.includes(s.replace(/^[a-z-]+=/, ""))); if (left.length) { cjkOnEnglish[url] = left; fail(url, `CJK on English page: ${left.join(" / ")}`); } }
    // Round trip: switch language, land on the same page in the other language, switch back.
    const there = lang === "zh" ? en(path) : path, back = url;
    await page.locator(".header-tools [data-locale-switch]").click();
    await page.waitForURL((u) => u.pathname === there, { timeout: 8000 }).catch(() => {});
    const landed = new URL(page.url()).pathname;
    await page.waitForLoadState("load");
    await page.waitForTimeout(600);
    const langThere = await page.evaluate(() => document.documentElement.lang);
    await page.locator(".header-tools [data-locale-switch]").click();
    await page.waitForURL((u) => u.pathname === back, { timeout: 8000 }).catch(() => {});
    const returned = new URL(page.url()).pathname;
    if (landed !== there || returned !== back) fail(url, `switch went ${url} → ${landed} → ${returned}`);
    if (langThere !== (lang === "zh" ? "en" : "zh-Hant")) fail(url, `after switching, <html lang> ${langThere}`);
    pages.push({ url, lang, status: res.status(), htmlLang: dom.lang, title: dom.title, switch: { landed, returned } });
    await page.close();
  }
}

// 404 in both languages (rendered on the client from the localized not-found boundary).
const notFound = [];
for (const [url, htmlLang, heading] of [["/nope", "zh-Hant", "找不到這個頁面。"], ["/en/nope", "en", "This page could not be found."], ["/products/nope", "zh-Hant", "找不到這個頁面。"], ["/en/products/nope", "en", "This page could not be found."]]) {
  const { page, res } = await open(desktop, url);
  await page.waitForTimeout(1200);
  const got = await page.evaluate(() => ({ lang: document.documentElement.lang, h1: document.querySelector("h1")?.textContent ?? "", title: document.title }));
  notFound.push({ url, status: res.status(), ...got });
  if (res.status() !== 404 || got.lang !== htmlLang || got.h1 !== heading) fail(url, `404 page: status ${res.status()}, lang ${got.lang}, h1 ${got.h1}`);
  if (url === "/en/nope") await page.screenshot({ path: `${dir}en-404.jpg`, type: "jpeg", quality: 82 });
  await page.close();
}

// Screenshots.
const shots = [];
const shoot = async (page, name, options = {}) => { await page.screenshot({ path: `${dir}${name}.jpg`, type: "jpeg", quality: 82, ...options }); shots.push(`${name}.jpg`); };
{
  const { page } = await open(desktop, "/");
  await shoot(page, "zh-home-header-desktop", { clip: { x: 0, y: 0, width: 1440, height: 110 } });
  await page.close();
}
{
  const { page } = await open(desktop, "/en");
  await shoot(page, "en-home-header-desktop", { clip: { x: 0, y: 0, width: 1440, height: 110 } });
  await shoot(page, "en-home-hero");
  for (const [id, name] of [["manifesto", "en-home-story"], ["craft", "en-home-craft"], ["featured", "en-home-featured"], ["partners", "en-home-partners"], ["visit", "en-home-stores"], ["news", "en-home-news"]]) {
    await page.evaluate((id) => { const el = document.getElementById(id); const s = document.querySelector("[data-page-scroller]"); s.scrollTo(0, el.getBoundingClientRect().top + s.scrollTop - 72); }, id);
    await page.waitForTimeout(1500);
    await shoot(page, name);
  }
  await page.close();
}
for (const [url, name] of [["/en/collections/tea", "en-collection-tea"], ["/en/products/reunion-paper-gift-box", "en-product-tea-gift"], ["/en/account", "en-account"], ["/products/reunion-paper-gift-box", "zh-product-tea-gift"]]) {
  const { page } = await open(desktop, url);
  await scrollThrough(page);
  await shoot(page, name);
  if (name === "en-product-tea-gift") { await page.evaluate(() => document.getElementById("product-details").scrollIntoView()); await page.waitForTimeout(500); await shoot(page, `${name}-details`); }
  await page.close();
}
{
  // The bag drawer in English.
  const { page } = await open(desktop, "/en/products/reunion-paper-gift-box");
  await page.locator(".product-intro .add-to-cart .catalog-button").click();
  await page.waitForTimeout(900);
  await shoot(page, "en-bag-drawer");
  await page.close();
}
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
for (const [url, name] of [["/", "zh-mobile"], ["/en", "en-mobile"], ["/en/products/reunion-paper-gift-box", "en-mobile-product"]]) {
  const { page } = await open(mobile, url);
  const dom = await domReport(page);
  if (dom.overflowX > 1) fail(`${url} (390px)`, `horizontal overflow ${dom.overflowX}px`);
  if (name !== "zh-mobile") await shoot(page, `${name}-top`);
  await page.locator("[data-menu-opener]").click();
  await page.waitForTimeout(900);
  if (name !== "en-mobile-product") await shoot(page, `${name}-menu`);
  if (name === "zh-mobile") {
    await page.locator("#site-menu [data-locale-switch]:visible").click();
    await page.waitForURL((u) => u.pathname === "/en", { timeout: 8000 }).catch(() => {});
    const landed = new URL(page.url()).pathname;
    if (landed !== "/en") fail("mobile menu switch", `landed on ${landed}`);
  }
  await page.close();
}
await browser.close();

const report = { base, checkedAt: new Date().toISOString(), samplePages: pages.length, failures, cjkOnEnglish, allowedCjkOnEnglish: allow, notFound, screenshots: shots, pages };
writeFileSync(`${dir}browser-report.json`, JSON.stringify(report, null, 1));
console.log(JSON.stringify({ samplePages: pages.length, failures: failures.length, notFound: notFound.map((n) => `${n.url} ${n.status} ${n.lang}`), screenshots: shots.length }, null, 1));
if (failures.length) console.log(failures.join("\n"));
