// Finds content that stays hidden by a scroll-reveal that never fired. For each scenario the page is brought to every
// section and the elements carrying data-animation that are on screen but still invisible are listed.
// Usage: node docs/qa/2026-10-01-reveal-fix/repro.mjs <base url> [suffix]
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const base = process.argv[2] || "https://charmvilla-gallery-site.vercel.app"; const suffix = process.argv[3] || "";
const out = new URL(".", import.meta.url).pathname;
const browser = await chromium.launch({ channel: "chrome" });
const hidden = () => {
  const vh = innerHeight, bad = [];
  for (const el of document.querySelectorAll("[data-animation]")) {
    const r = el.getBoundingClientRect(); if (r.bottom < 80 || r.top > vh - 80 || r.width < 2) continue;      // on screen only
    const cs = getComputedStyle(el); const type = el.getAttribute("data-animation");
    const clipped = cs.clipPath && cs.clipPath !== "none" && /polygon\(0(px|%)? 0(px|%)?, 0(px|%)? 0(px|%)?,/.test(cs.clipPath);
    const lineHidden = type === "split" && [...el.querySelectorAll(".line, .word > .char")].some((n) => { const m = new DOMMatrixReadOnly(getComputedStyle(n).transform); return Math.abs(m.m42) > n.getBoundingClientRect().height * 0.9; });
    if (+cs.opacity < 0.05 || clipped || lineHidden) bad.push(`${el.closest("section,[id]")?.id || el.closest("section")?.className.split(" ")[0] || "?"} · ${type} · ${(el.innerText || el.querySelector("img")?.alt || "").trim().slice(0, 30)}`);
  }
  return bad;
};
const scrollEl = () => { const s = document.querySelector("[data-page-scroller]"); return s && s.scrollHeight > s.clientHeight + 1 ? s : document.scrollingElement; };
const settle = (page) => page.waitForTimeout(1900);                                 // longest reveal: 1.25 s + .3 s delay
async function sweep(page, order) {                                                // visit every section, top-down or bottom-up
  const tops = await page.evaluate((fn) => { const el = (0, eval)(`(${fn})`)(); const base = el.scrollTop; return [...document.querySelectorAll("main section, footer")].map((s) => Math.max(0, Math.round(s.getBoundingClientRect().top + base - 120))); }, scrollEl.toString());
  const found = [];
  for (const y of order === "up" ? [...tops].reverse() : tops) {
    await page.mouse.move(700, 500);
    await page.evaluate(([fn, y]) => { (0, eval)(`(${fn})`)().scrollTo({ top: y }); }, [scrollEl.toString(), y]);
    await settle(page);
    for (const h of await page.evaluate(hidden)) found.push(`y=${y}: ${h}`);
  }
  return found;
}
const ready = (page) => page.waitForFunction(() => document.documentElement.classList.contains("is-loaded"), null, { timeout: 20000 });
const scenarios = {
  "scroll down from the top": async (page, path) => { await page.goto(base + path, { waitUntil: "load" }); await ready(page); return sweep(page, "down"); },
  "open with #visit, then scroll up": async (page, path) => { await page.goto(base + path + "#visit", { waitUntil: "load" }); await ready(page); await settle(page); return sweep(page, "up"); },
  "store icon in the header, then scroll up": async (page, path) => { await page.goto(base + path, { waitUntil: "load" }); await ready(page); await page.locator('[data-header] a[href$="#visit"]').first().click(); await settle(page); return sweep(page, "up"); },
  "language switch on the homepage, then scroll down": async (page, path) => { await page.goto(base + (path === "/en" ? "/" : "/en"), { waitUntil: "load" }); await ready(page); await page.locator("[data-header] a[data-locale-switch]").first().click(); await page.waitForURL((u) => (path === "/en") === u.pathname.startsWith("/en")); await page.waitForLoadState("load"); await ready(page); await settle(page); return sweep(page, "down"); },
  "wordmark from a product page back to home, then scroll down": async (page, path) => { await page.goto(base + (path === "/en" ? "/en" : "") + "/collections/tea", { waitUntil: "load" }); await page.locator("a.header-brand").first().click(); await page.waitForURL((u) => /^\/(en)?$/.test(u.pathname)); await ready(page); await settle(page); return sweep(page, "down"); },
  "jump to the bottom, resize the window, then scroll up": async (page, path) => { await page.goto(base + path, { waitUntil: "load" }); await ready(page); await page.evaluate((fn) => { const el = (0, eval)(`(${fn})`)(); el.scrollTo({ top: el.scrollHeight }); }, scrollEl.toString()); await settle(page); await page.setViewportSize({ width: 1500, height: 880 }); await settle(page); return sweep(page, "up"); },
};
const report = [];
for (const path of ["/en", "/"]) for (const [name, run] of Object.entries(scenarios)) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 912 } });
  const found = await run(page, path);
  if (found.some((f) => f.includes("partners")) && !report.some((r) => r.shot)) {
    const y = await page.evaluate((fn) => { const el = (0, eval)(`(${fn})`)(); const s = document.getElementById("partners"); return Math.round(s.getBoundingClientRect().top + el.scrollTop - 60); }, scrollEl.toString());
    await page.evaluate(([fn, y]) => { (0, eval)(`(${fn})`)().scrollTo({ top: y }); }, [scrollEl.toString(), y]); await settle(page);
    await page.screenshot({ path: `${out}partners-blank${suffix}.jpg`, type: "jpeg", quality: 80 });
    report.push({ path, scenario: name, stillHidden: found.length, items: found, shot: `partners-blank${suffix}.jpg` });
  } else report.push({ path, scenario: name, stillHidden: found.length, items: found });
  console.log(path.padEnd(4), name.padEnd(54), "still hidden:", found.length, found.slice(0, 3).join(" | "));
  await page.close();
}
await browser.close();
writeFileSync(`${out}report${suffix}.json`, JSON.stringify({ base, report }, null, 1));
