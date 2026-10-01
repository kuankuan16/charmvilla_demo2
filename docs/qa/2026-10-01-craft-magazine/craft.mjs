// The homepage craft section as a magazine spread: screenshots along the scroll and the measured layout.
// Usage: node docs/qa/2026-10-01-craft-magazine/craft.mjs <base url> <suffix> [width,width,...]
// The homepage scrolls inside [data-page-scroller]; the section is brought into view by scrolling that element.
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const [base = "http://localhost:3160", suffix = "local", widths = "1440,1920,1100,390"] = process.argv.slice(2);
const out = new URL(".", import.meta.url).pathname;
const browser = await chromium.launch({ channel: "chrome" });
const report = [];
for (const lang of ["zh", "en"]) for (const width of widths.split(",").map(Number)) {
  const page = await browser.newPage({ viewport: { width, height: width < 768 ? 844 : 900 } });
  await page.goto(base + (lang === "en" ? "/en" : "/"), { waitUntil: "load" });
  await page.waitForFunction(() => document.documentElement.classList.contains("is-loaded"), null, { timeout: 20000 });
  await page.waitForTimeout(600);
  const measure = () => page.evaluate(() => {
    const sc = document.querySelector("[data-page-scroller]"); const scroller = sc && sc.scrollHeight > sc.clientHeight + 1 ? sc : document.scrollingElement;
    const box = (el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + scroller.scrollTop), w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top) }; };
    const q = (s) => [...document.querySelectorAll(s)].map(box);
    const section = document.querySelector(".craft-moments");
    return {
      scrollTop: Math.round(scroller.scrollTop), section: box(section), smalls: q(".craft-smalls .craft-fig"), smallsBox: q(".craft-smalls")[0], larges: q(".craft-large"),
      heading: q(".craft-heading")[0], list: q(".craft-list")[0], links: q(".craft-link").length, words: q(".craft-words")[0],
      opacity: [...document.querySelectorAll(".craft-spread, .craft-story")].map((el) => +getComputedStyle(el).opacity),
      images: [...section.querySelectorAll("img")].map((img) => ({ src: decodeURIComponent(img.currentSrc).replace(/.*url=|&.*/g, "").split("/").pop(), natural: img.naturalWidth, shown: Math.round(img.getBoundingClientRect().width) })),
      overflowX: document.documentElement.scrollWidth > innerWidth + 1,
    };
  });
  const scrollTo = async (y) => { await page.evaluate((y) => { const sc = document.querySelector("[data-page-scroller]"); (sc && sc.scrollHeight > sc.clientHeight + 1 ? sc : document.scrollingElement).scrollTo({ top: y }); }, y); await page.waitForTimeout(1100); };
  let m = await measure();
  // five stops: the first row entering, the small ones held, the text row entering, the second photograph held, the end of the section
  const s = m.section, stops = [s.y - 80, m.larges[0].y + m.larges[0].h - 620, m.words.y - 120, m.words.y + m.words.h - 700, s.y + s.h - 760];
  const entry = { lang, width, stops: [] };
  for (const [i, y] of stops.entries()) {
    await scrollTo(Math.max(0, y)); m = await measure();
    if (lang === "zh" || width === 1440) await page.screenshot({ path: `${out}${suffix}-${lang}-${width}-${i}.jpg`, type: "jpeg", quality: 72 });
    entry.stops.push({ y: Math.round(y), smallsTop: m.smallsBox.top, large0Top: m.larges[0].top, large1Top: m.larges[1].top, headingTop: m.heading.top, opacity: m.opacity });
  }
  Object.assign(entry, { section: m.section, smalls: m.smalls, larges: m.larges, heading: m.heading, list: m.list, words: m.words, links: m.links, images: m.images, overflowX: m.overflowX });
  report.push(entry);
  console.log(lang, width, "smalls", m.smalls.map((b) => `${b.x}+${b.w}x${b.h}`).join(" "), "| larges", m.larges.map((b) => `${b.x}+${b.w}x${b.h}`).join(" "), "| heading x", m.heading.x, "list x", m.list.x, "w", m.list.w, "| overflowX", m.overflowX,
    "| held: smalls", entry.stops[1].smallsTop, "photo", entry.stops[3].large1Top, "| opacity", entry.stops.map((t) => t.opacity.join("/")).join(" "));
  await page.close();
}
await browser.close();
writeFileSync(`${out}craft-${suffix}.json`, JSON.stringify({ base, report }, null, 1));
