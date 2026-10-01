// The homepage footer must be the inner-page footer: same boxes (relative to the footer) and same computed text styles.
// Usage: node footer.mjs <base url> [suffix]
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const base = process.argv[2] || "http://localhost:3140"; const suffix = process.argv[3] || "";
const out = new URL(".", import.meta.url).pathname;
const browser = await chromium.launch({ channel: "chrome" });
const measure = () => {
  const f = document.querySelector("footer.catalog-footer"); if (!f) return null;
  const fb = f.getBoundingClientRect();
  const items = [...f.querySelectorAll(".catalog-footer-statement, nav a, .catalog-footer-bottom > *, .social-links a")].map((e) => {
    const b = e.getBoundingClientRect(), cs = getComputedStyle(e);
    return { text: (e.innerText || e.getAttribute("aria-label") || "").trim(), href: e.getAttribute("href"), box: [Math.round(b.left - fb.left), Math.round(b.top - fb.top), Math.round(b.width), Math.round(b.height)],
      font: [cs.fontFamily.slice(0, 30), cs.fontSize, cs.fontWeight, cs.lineHeight, cs.letterSpacing, cs.textTransform, cs.color].join(" | ") };
  });
  return { footers: document.querySelectorAll("footer").length, size: [Math.round(fb.width), Math.round(fb.height)], bg: getComputedStyle(f).backgroundColor, items };
};
let fail = 0; const report = [];
for (const [w, h] of [[1440, 900], [390, 844]]) for (const lang of ["", "/en"]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(() => { try { sessionStorage.setItem("cv-skip-preloader", "1"); } catch {} });
  const got = {};
  for (const [name, path] of [["home", "/"], ["collection", "/collections/all"], ["product", "/products/braided-leather-bag-white"], ["about", "/about"]]) {
    const page = await ctx.newPage();
    await page.goto(`${base}${lang}${path === "/" && lang ? "" : path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(name === "home" ? 2500 : 300);
    await page.evaluate(async () => { const s = document.querySelector("[data-page-scroller]"); const el = s && s.scrollHeight > s.clientHeight ? s : document.scrollingElement; for (let y = 0; y <= el.scrollHeight; y += 700) { el.scrollTop = y; await new Promise((r) => setTimeout(r, 60)); } el.scrollTop = el.scrollHeight; });
    await page.waitForTimeout(900);
    got[name] = await page.evaluate(measure);
    if (name === "home" || name === "collection") await page.screenshot({ path: `${out}${name}-${lang ? "en" : "zh"}-${w}${suffix}.jpg`, type: "jpeg", quality: 80 });
    await page.close();
  }
  const ref = JSON.stringify(got.collection);
  for (const name of ["home", "product", "about"]) { const same = JSON.stringify(got[name]) === ref; if (!same) fail++; console.log(`${w} ${lang ? "en" : "zh"} ${name.padEnd(8)} ${same ? "identical to the collection page footer" : "DIFFERENT"}`); if (!same) console.log(JSON.stringify(got[name]), "\n", ref); }
  report.push({ w, lang: lang ? "en" : "zh", footer: got.collection, homeIdentical: JSON.stringify(got.home) === ref });
  await ctx.close();
}
await browser.close();
writeFileSync(`${out}footer${suffix}.json`, JSON.stringify({ base, report }, null, 1));
console.log(fail ? `${fail} differences` : "all footers identical");
