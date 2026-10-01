// Product pages: every scene photograph is drawn (no zero-size frame, image loaded), nothing overflows sideways, and where three
// portraits close the page they form the spread — two small ones at the left that stay under the header, the large one at the right.
// Usage: node docs/qa/2026-10-01-craft-magazine/spread.mjs <base url> <suffix>
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const [base = "http://localhost:3160", suffix = "local"] = process.argv.slice(2);
const out = new URL(".", import.meta.url).pathname;
const sitemap = await (await fetch(base + "/sitemap.xml")).text();
const slugs = [...new Set([...sitemap.matchAll(/<loc>[^<]*\/products\/([^<]+)<\/loc>/g)].map((m) => m[1]))];
const browser = await chromium.launch({ channel: "chrome" });
const rows = [], problems = [];
for (const [w, h] of [[1440, 900], [1100, 760], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  for (const lang of ["", "/en"]) for (const slug of slugs) {
    if (w !== 1440 && lang) continue;
    await page.goto(`${base}${lang}/products/${slug}`, { waitUntil: "load" });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
    await page.waitForTimeout(250);
    const m = await page.evaluate(async () => {
      scrollTo(0, 0); await new Promise((f) => setTimeout(f, 80));   // sticky photographs are measured at rest, not where the scroll left them
      const r = (e) => { const b = e.getBoundingClientRect(); return { l: Math.round(b.left), t: Math.round(b.top + scrollY), w: Math.round(b.width), h: Math.round(b.height) }; };
      const figs = [...document.querySelectorAll(".scene-fig")];
      const empty = figs.filter((f) => { const b = f.getBoundingClientRect(), img = f.querySelector("img"); return b.width < 40 || b.height < 40 || !img || !img.complete || img.naturalWidth === 0; }).length;
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 72;
      const spreads = [];
      for (const s of document.querySelectorAll(".product-spread")) {
        const smallsBox = s.querySelector(".product-spread-smalls"), small = [...s.querySelectorAll(".product-spread-smalls .scene-fig")].map(r), large = r(s.querySelector(".product-spread-large"));
        // while the foot of the large photograph is still below the small ones, they are held under the header
        scrollTo(0, large.t + large.h - small[0].h - header - 120); await new Promise((f) => setTimeout(f, 120));
        const held = Math.round(smallsBox.getBoundingClientRect().top), gap = parseFloat(getComputedStyle(s).columnGap) || 0;
        spreads.push({ small, large, held, expect: Math.round(header + gap) });
      }
      // three scenes (after …/products/joana-longchair-xl-2-seater): large photograph at the left; beside it the story text, then the small one, held under the header
      let pair = null; const ps = document.querySelector(".product-pair");
      if (ps) {
        const large = r(ps.querySelector(".product-pair-large")), sm = ps.querySelector(".product-pair-side .scene-fig"), small = r(sm), text = r(ps.querySelector(".product-pair-side .product-story-text")), intro = r(document.querySelector(".product-intro"));
        const gap = parseFloat(getComputedStyle(ps).columnGap) || 0;
        pair = { large, small, text, introLeft: intro.l, textInColumn: !!document.querySelector(".product-more .product-story-text"), expect: Math.round(header + gap), held: null };
        if (large.h > small.t - large.t + small.h + 60) { scrollTo(0, large.t + large.h - small.h - header - 40); await new Promise((f) => setTimeout(f, 120)); pair.held = Math.round(sm.getBoundingClientRect().top); }
      }
      return { scenes: figs.length, empty, spreads, pairBox: pair, pair: !!document.querySelector(".product-pair"), rows: document.querySelectorAll(".product-scenes .scene-fig").length, overflowX: document.documentElement.scrollWidth > innerWidth + 1 };
    });
    rows.push({ w, lang: lang || "/zh", slug, ...m });
    if (m.empty) problems.push(`${w} ${lang} ${slug}: ${m.empty} scene frame(s) empty`);
    if (m.overflowX) problems.push(`${w} ${lang} ${slug}: horizontal overflow`);
    if (m.pairBox && w >= 768) {
      const b = m.pairBox;
      if (b.textInColumn) problems.push(`${w} ${slug}: story text still in the information column`);
      if (!(b.text.l === b.introLeft && b.small.l === b.introLeft && b.text.t >= b.large.t && b.small.t > b.text.t + b.text.h)) problems.push(`${w} ${slug}: pair geometry ${JSON.stringify(b)}`);
      if (b.held !== null && Math.abs(b.held - b.expect) > 2) problems.push(`${w} ${slug}: small photograph not held (${b.held} vs ${b.expect})`);
    }
    for (const s of m.spreads) if (w >= 768) {
      const [a, b] = s.small;
      if (!(a.l < b.l && b.l + b.w < s.large.l && Math.abs(s.large.w / a.w - (s.large.w > 600 ? 3.2 : 3.2)) < 0.25)) problems.push(`${w} ${slug}: spread geometry ${JSON.stringify(s)}`);
      if (Math.abs(s.held - s.expect) > 2) problems.push(`${w} ${slug}: small photographs not held (${s.held} vs ${s.expect})`);
    }
  }
  await page.close();
}
await browser.close();
const withSpread = [...new Set(rows.filter((r) => r.spreads.length).map((r) => r.slug))];
console.log("pages checked", rows.length, "| products", slugs.length, "| with a spread:", withSpread.join(", ") || "none", "| problems", problems.length);
for (const p of problems.slice(0, 20)) console.log(" -", p);
for (const r of rows.filter((r) => r.spreads.length && r.lang === "/zh")) console.log(r.w, r.slug, r.spreads.map((s) => `small ${s.small.map((b) => `${b.l}+${b.w}x${b.h}`).join(" ")} large ${s.large.l}+${s.large.w}x${s.large.h} held ${s.held}/${s.expect}`).join(" | "));
for (const r of rows.filter((r) => r.pairBox && r.lang === "/zh" && r.w !== 390)) console.log(r.w, r.slug, `large ${r.pairBox.large.l}+${r.pairBox.large.w}x${r.pairBox.large.h}@${r.pairBox.large.t} text ${r.pairBox.text.l}+${r.pairBox.text.w}x${r.pairBox.text.h}@${r.pairBox.text.t} small ${r.pairBox.small.l}+${r.pairBox.small.w}x${r.pairBox.small.h}@${r.pairBox.small.t} held ${r.pairBox.held}/${r.pairBox.expect}`);
writeFileSync(`${out}spread-${suffix}.json`, JSON.stringify({ base, problems, rows }, null, 1));
