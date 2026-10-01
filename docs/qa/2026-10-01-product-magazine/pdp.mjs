// Product page QA for the magazine layout: every product in both languages (layout numbers), full-page screenshots of a sample.
// Usage: node docs/qa/2026-10-01-product-magazine/pdp.mjs <base url> [suffix]
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const base = process.argv[2] || "http://localhost:3140"; const suffix = process.argv[3] || "";
const out = new URL(".", import.meta.url).pathname;
const sitemap = await (await fetch(base + "/sitemap.xml")).text();
const slugs = [...new Set([...sitemap.matchAll(/<loc>[^<]*\/products\/([^<]+)<\/loc>/g)].map((m) => m[1]))];
const sample = ["reunion-paper-gift-box", "braided-leather-bag-white", "pearl-goldfish-earrings", "bird-chopstick-rest", "afternoon-tea-stand"].filter((s) => slugs.includes(s));
const browser = await chromium.launch({ channel: "chrome" });
const rows = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
for (const lang of ["", "/en"]) for (const slug of slugs) {
  const res = await page.goto(`${base}${lang}/products/${slug}`, { waitUntil: "load" });
  await page.waitForTimeout(250);
  const m = await page.evaluate(async () => {
    const q = (s) => document.querySelector(s); const box = (e) => { const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top + scrollY), Math.round(b.width), Math.round(b.height)]; };
    const stage = q(".product-main-image"), intro = q(".product-intro"), button = q(".product-intro .catalog-button"), thumbs = [...document.querySelectorAll(".product-thumbnails button")];
    const out = { thumbs: thumbs.length, thumbSizes: [...new Set(thumbs.map((t) => `${Math.round(t.getBoundingClientRect().width)}x${Math.round(t.getBoundingClientRect().height)}`))], thumbText: thumbs.map((t) => t.innerText.trim()).join(""),
      fit: stage.dataset.fit, stage: box(stage), intro: box(intro), buttonBottom: button ? Math.round(button.getBoundingClientRect().bottom) : null, specs: document.querySelectorAll(".product-specs > div").length,
      story: q(".product-story").className.replace("product-story ", ""), scenes: document.querySelectorAll(".product-story-image").length, h1: q("h1").innerText, dockHiddenAtTop: q(".product-dock").hasAttribute("data-hidden"), overflowX: document.documentElement.scrollWidth > innerWidth };
    scrollTo(0, 500); await new Promise((r) => setTimeout(r, 120)); out.stageTopAfterScroll = Math.round(stage.getBoundingClientRect().top); scrollTo(0, 0);
    return out;
  });
  rows.push({ lang: lang ? "en" : "zh", slug, status: res.status(), ...m });
}
for (const slug of sample) for (const lang of ["", "/en"]) {
  if (lang && slug !== sample[0]) continue;
  await page.goto(`${base}${lang}/products/${slug}`, { waitUntil: "networkidle" });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } scrollTo(0, 0); });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}${lang ? "en" : "zh"}-${slug}-first${suffix}.jpg`, type: "jpeg", quality: 82 });
  await page.screenshot({ path: `${out}${lang ? "en" : "zh"}-${slug}-full${suffix}.jpg`, type: "jpeg", quality: 70, fullPage: true });
}
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
const mrows = [];
for (const slug of sample.slice(0, 3)) {
  await mobile.goto(`${base}/products/${slug}`, { waitUntil: "networkidle" });
  await mobile.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } scrollTo(0, 0); });
  await mobile.waitForTimeout(400);
  mrows.push({ slug, overflowX: await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
  await mobile.screenshot({ path: `${out}zh-mobile-${slug}-full${suffix}.jpg`, type: "jpeg", quality: 68, fullPage: true });
}
await browser.close();
const bad = rows.filter((r) => r.status !== 200 || r.overflowX || r.thumbText || r.thumbSizes.length > 1 || !r.dockHiddenAtTop);
writeFileSync(`${out}report${suffix}.json`, JSON.stringify({ base, products: slugs.length, pages: rows.length, failures: bad.length, errors, mobile: mrows, rows }, null, 1));
console.log(JSON.stringify({ products: slugs.length, pages: rows.length, failures: bad.length, errors: errors.length, mobile: mrows }));
for (const r of rows.filter((r) => r.lang === "zh")) console.log(r.slug.padEnd(42), "thumbs", r.thumbs, r.thumbSizes.join(","), "fit", r.fit, "scenes", r.scenes, r.story, "specs", r.specs, "introBottom", r.intro[1] + r.intro[3], "btn", r.buttonBottom, "stage top after 500px", r.stageTopAfterScroll);
for (const r of bad) console.log("FAIL", r.lang, r.slug, r.status, r.overflowX, r.thumbText, r.thumbSizes, r.dockHiddenAtTop);
