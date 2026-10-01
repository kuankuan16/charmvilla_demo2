// Product page QA for the studio gallery / first-screen layout: every product in both languages at several window sizes.
// Usage: node docs/qa/2026-10-01-product-studio-gallery/pdp.mjs <base url> [suffix]
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
const base = process.argv[2] || "http://localhost:3150"; const suffix = process.argv[3] || "";
const out = new URL("./shots/", import.meta.url).pathname; mkdirSync(out, { recursive: true });
const sitemap = await (await fetch(base + "/sitemap.xml")).text();
const slugs = [...new Set([...sitemap.matchAll(/<loc>[^<]*\/products\/([^<]+)<\/loc>/g)].map((m) => m[1]))];
const sample = ["braided-leather-bag-white", "reunion-paper-gift-box", "pearl-chain-goldfish-earrings", "bird-chopstick-rest", "christmas-edition-stocking", "diamond-goldfish-stud-earrings"].filter((s) => slugs.includes(s));
const browser = await chromium.launch({ channel: "chrome" });
const rows = []; const errors = [];
for (const [w, h] of [[1440, 900], [1280, 720], [1920, 1080]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.on("pageerror", (e) => errors.push(String(e)));
  for (const lang of ["", "/en"]) for (const slug of slugs) {
    if (w !== 1440 && lang) continue;
    const res = await page.goto(`${base}${lang}/products/${slug}`, { waitUntil: "load" });
    await page.waitForTimeout(350);
    const m = await page.evaluate(() => {
      const q = (s) => document.querySelector(s); const box = (e) => { const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)]; };
      const stage = q(".product-main-image"), img = q(".product-main-image img"), intro = q(".product-intro"), buy = q(".product-buy"), thumbs = [...document.querySelectorAll(".product-thumbnails button")];
      const last = intro.lastElementChild.getBoundingClientRect();
      return { stage: box(stage), natural: [img.naturalWidth, img.naturalHeight], src: decodeURIComponent((img.currentSrc.match(/url=([^&]+)/) || [, img.currentSrc])[1]).split("/").pop(), thumbs: thumbs.length, thumbSize: thumbs[0] ? box(thumbs[0]).slice(2) : null,
        column: box(q(".product-column")), introBottom: Math.round(last.bottom), buy: buy ? box(buy) : null, fits: last.bottom <= innerHeight + 1, overflowX: document.documentElement.scrollWidth > innerWidth, scenes: document.querySelectorAll(".product-story-image").length, dock: !!q(".product-dock"), qty: !!q(".product-intro .cart-qty") };
    });
    rows.push({ vp: `${w}x${h}`, lang: lang || "/zh", slug, status: res.status(), ...m });
    if (sample.includes(slug) && !lang) {
      await page.screenshot({ path: `${out}${w}-${slug}-first${suffix}.jpg`, quality: 82 });
      if (w === 1440) await page.screenshot({ path: `${out}${w}-${slug}-full${suffix}.jpg`, quality: 70, fullPage: true });
    }
  }
  await page.close();
}
// listing: cover and hover
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${base}/collections/all`, { waitUntil: "load" }); await page.waitForTimeout(1200);
const cards = await page.evaluate(() => [...document.querySelectorAll(".catalog-card")].map((c) => { const imgs = c.querySelectorAll(".catalog-card-image img"); const src = (i) => decodeURIComponent((i.currentSrc || i.src).match(/url=([^&]+)/)?.[1] || i.src).split("/").pop(); return { slug: c.dataset.catalogCard, cover: imgs[0] ? src(imgs[0]) : null, hover: imgs[1] ? src(imgs[1]) : null }; }));
await page.screenshot({ path: `${out}1440-collections-all${suffix}.jpg`, quality: 80 });
const first = page.locator(".catalog-card").first(); await first.hover(); await page.waitForTimeout(700);
await page.screenshot({ path: `${out}1440-collections-all-hover${suffix}.jpg`, quality: 80 });
await page.close();
// mobile
const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
for (const slug of sample.slice(0, 2)) { await mob.goto(`${base}/products/${slug}`, { waitUntil: "load" }); await mob.waitForTimeout(400); await mob.screenshot({ path: `${out}390-${slug}-first${suffix}.jpg`, quality: 80 }); rows.push({ vp: "390x844", lang: "/zh", slug, overflowX: await mob.evaluate(() => document.documentElement.scrollWidth > innerWidth) }); }
await browser.close();
const bad = rows.filter((r) => r.status && (r.status !== 200 || !r.fits || r.overflowX || r.dock || r.qty));
const stageSizes = {}; for (const r of rows) if (r.stage) (stageSizes[r.vp] ??= new Set()).add(`${r.stage[2]}x${r.stage[3]}@${r.stage[0]},${r.stage[1]}`);
const summary = { base, pages: rows.length, failures: bad.length, stageSizes: Object.fromEntries(Object.entries(stageSizes).map(([k, v]) => [k, [...v]])), thumbSizes: [...new Set(rows.filter((r) => r.thumbSize).map((r) => `${r.vp}:${r.thumbSize.join("x")}`))], errors, cards };
writeFileSync(new URL(`./report${suffix}.json`, import.meta.url).pathname, JSON.stringify({ summary, rows }, null, 1));
console.log(JSON.stringify({ ...summary, cards: cards.length, cardsWithoutHover: cards.filter((c) => !c.hover).map((c) => c.slug), nonStudioCovers: cards.filter((c) => !/^studio-/.test(c.cover || "")).map((c) => `${c.slug}:${c.cover}`) }, null, 1));
for (const r of bad) console.log("FAIL", r.vp, r.lang, r.slug, "introBottom", r.introBottom, "fits", r.fits, "overflowX", r.overflowX);
const lowres = rows.filter((r) => r.vp === "1440x900" && r.lang === "/zh").map((r) => `${r.slug}: ${r.src} ${r.natural?.join("x")} thumbs ${r.thumbs} scenes ${r.scenes}`); console.log(lowres.join("\n"));
