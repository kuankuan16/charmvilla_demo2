// Product page QA for the Karla layout: every product in both languages.
// Checks: the image stays under the header while the right column scrolls and lets go when the column ends (bottom edges meet);
// every scene in the column has the left edge and width of the information column; the button closes the first screen;
// the rows under the stage are full; no horizontal overflow. Usage: node pdp.mjs <base url> [suffix]
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const base = process.argv[2] || "http://localhost:3140"; const suffix = process.argv[3] || "";
const out = new URL(".", import.meta.url).pathname;
const sitemap = await (await fetch(base + "/sitemap.xml")).text();
const slugs = [...new Set([...sitemap.matchAll(/<loc>[^<]*\/products\/([^<]+)<\/loc>/g)].map((m) => m[1]))];
const browser = await chromium.launch({ channel: "chrome" });
const rows = [], errors = [];
for (const [w, h] of [[1440, 900], [1920, 1080], [1100, 760], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.on("pageerror", (e) => errors.push(String(e)));
  for (const lang of ["", "/en"]) for (const slug of slugs) {
    if (w !== 1440 && lang) continue;
    const res = await page.goto(`${base}${lang}/products/${slug}`, { waitUntil: "load" });
    await page.waitForTimeout(150);
    const m = await page.evaluate(async () => {
      const q = (s) => document.querySelector(s), all = (s) => [...document.querySelectorAll(s)];
      const r = (e) => { const b = e.getBoundingClientRect(); return { l: Math.round(b.left), t: Math.round(b.top + scrollY), w: Math.round(b.width), h: Math.round(b.height), b: Math.round(b.bottom + scrollY) }; };
      const wait = (ms) => new Promise((f) => setTimeout(f, ms));
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || q("[data-header]").getBoundingClientRect().height;
      const stage = q(".product-main-image"), column = q(".product-column"), more = q(".product-more"), button = q(".product-buy"), hero = q(".product-hero");
      const s = r(stage), c = r(column), mo = r(more), bu = r(button);
      const colScenes = all(".product-more .scene-fig").map(r), rowScenes = all(".product-scenes .scene-fig");
      const large = q(".product-pair-large"), small = q(".product-pair-side .scene-fig"), intro = r(q(".product-intro"));
      const pair = large ? { large: r(large), small: r(small) } : null;
      const out = { stage: [s.l, s.t, s.w, s.h], column: [c.l, c.w], buttonBottom: bu.b, stageBottom: s.b, inColumn: colScenes.length, inRows: rowScenes.length,
        shapes: all(".scene-fig").map((f) => f.dataset.shape[0]).join(""),
        pair: pair ? { largeOnStage: pair.large.l === s.l && pair.large.w === s.w, smallAtColumn: pair.small.l === intro.l, smallShare: +(pair.small.w / intro.w).toFixed(2), sameTop: pair.large.t === pair.small.t } : null,
        sceneAligned: colScenes.every((f) => f.l === r(q(".product-intro")).l && f.w === r(q(".product-intro")).w), moreBottom: mo.b, lastSceneBottom: colScenes.length ? colScenes[colScenes.length - 1].b : null,
        scenesTall: all(".scene-fig").every((f) => f.getBoundingClientRect().height > 100 && f.getBoundingClientRect().width > 200),
        overflowX: document.documentElement.scrollWidth > innerWidth, sticky: getComputedStyle(q(".product-stage")).position };
      // rows under the stage: each row must end on the right edge of the grid
      const tops = {}; for (const f of rowScenes) { const b = f.getBoundingClientRect(); (tops[Math.round(b.top + scrollY)] ||= []).push(Math.round(b.right)); }
      const right = Math.round(hero.getBoundingClientRect().right - parseFloat(getComputedStyle(hero).paddingRight));
      out.rowsFull = Object.values(tops).every((v) => Math.abs(Math.max(...v) - right) <= 1); out.rowCount = Object.keys(tops).length;
      if (out.sticky === "sticky") {
        // 1. in the middle of the column the image is under the header  2. past the column it has let go, bottoms equal
        const release = mo.b - s.h - header;   // the scroll position at which the image lets go
        const mid = Math.min(Math.round((mo.t + mo.b) / 2 - innerHeight / 2), release - 40); scrollTo(0, Math.max(0, mid)); await wait(60);
        out.stageTopMid = Math.round(stage.getBoundingClientRect().top - header);
        scrollTo(0, mo.b - 200); await wait(60);
        out.bottomGapAtEnd = Math.round(stage.getBoundingClientRect().bottom - more.getBoundingClientRect().bottom);
        out.stuckFor = mo.b - s.b;
        if (pair && pair.large.h > pair.small.h + 200) {   // the small photograph stays in view beside the large one and ends at its foot
          scrollTo(0, pair.large.t + Math.round((pair.large.h - pair.small.h) / 2)); await wait(60);
          out.pair.smallStuck = Math.round(small.getBoundingClientRect().top - header) > 0 && Math.round(small.getBoundingClientRect().top - header) < 40;
          scrollTo(0, pair.large.b - 100); await wait(60);
          out.pair.footGap = Math.round(small.getBoundingClientRect().bottom - large.getBoundingClientRect().bottom);
        }
        scrollTo(0, 0);
      }
      return out;
    });
    rows.push({ w, lang: lang ? "en" : "zh", slug, status: res.status(), ...m });
  }
  await page.close();
}
await browser.close();
writeFileSync(`${out}pdp${suffix}.json`, JSON.stringify({ base, errors, rows }, null, 1));
const desk = rows.filter((r) => r.w >= 768), mob = rows.filter((r) => r.w < 768);
const bad = (name, list) => console.log(name.padEnd(46), list.length ? "FAIL " + list.map((r) => `${r.w}/${r.lang}/${r.slug}`).join(", ") : "ok");
console.log(`${rows.length} pages (${slugs.length} products), page errors: ${errors.length}`);
bad("status 200", rows.filter((r) => r.status !== 200));
bad("no horizontal overflow", rows.filter((r) => r.overflowX));
bad("column scenes on the information column", rows.filter((r) => !r.sceneAligned));
bad("desktop: button inside the first screen", desk.filter((r) => r.buttonBottom > r.w * 0 + ({ 1440: 900, 1920: 1080, 1100: 760 })[r.w]));
const loose = desk.filter((r) => Math.abs(r.buttonBottom - r.stageBottom) > 2);
console.log("button below the foot of the image (long text):".padEnd(46), loose.map((r) => `${r.w}/${r.lang}/${r.slug} +${r.buttonBottom - r.stageBottom}px`).join(", ") || "none");
bad("mobile: every scene has a height", mob.filter((r) => !r.scenesTall));
bad("desktop: image under the header mid-column", desk.filter((r) => r.stageTopMid !== 0));
bad("desktop: image and column end together", desk.filter((r) => r.bottomGapAtEnd !== 0));
bad("desktop: rows under the stage are full", desk.filter((r) => !r.rowsFull));
bad("mobile: image not sticky", mob.filter((r) => r.sticky === "sticky"));
const pairs = desk.filter((r) => r.pair);
bad("pair: large photograph on the product image's columns", pairs.filter((r) => !r.pair.largeOnStage));
bad("pair: small photograph at the information column's left", pairs.filter((r) => !r.pair.smallAtColumn || !r.pair.sameTop));
bad("pair: small photograph stays, ends at the large one's foot", pairs.filter((r) => "smallStuck" in r.pair && (!r.pair.smallStuck || r.pair.footGap !== 0)));
console.log("pair pages:", [...new Set(pairs.map((r) => r.slug))].join(", "), "| small / column width:", [...new Set(pairs.map((r) => `${r.w}: ${r.pair.smallShare}`))].join(", "));
const d1440 = rows.filter((r) => r.w === 1440 && r.lang === "zh");
for (const r of d1440) console.log(r.slug.padEnd(36), r.shapes.padEnd(8), `column ${r.inColumn}  ${r.pair ? "pair (large + small)" : `rows ${r.inRows} (${r.rowCount})`}  image fixed for ${r.stuckFor}px`);
