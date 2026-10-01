// Measure the reference product page first screen (jakobsencopenhagen.com/en/products/holger-1-5-seater; user 2026-10-01: 「直接照這個一模一樣」).
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const out = new URL("./reference/", import.meta.url).pathname;
const url = process.argv[2] || "https://jakobsencopenhagen.com/en/products/holger-1-5-seater";
const name = url.split("/").pop();
const browser = await chromium.launch({ channel: "chrome" });
const report = {};
for (const [w, h] of [[1440, 900], [1778, 1005], [1920, 1080], [1280, 720], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  report[`${w}x${h}`] = await page.evaluate(() => {
    const box = (e) => { const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)]; };
    const cs = (e, ...p) => Object.fromEntries(p.map((k) => [k, getComputedStyle(e)[k]]));
    const thumbs = [...document.querySelectorAll('button[aria-label^="View image"]')];
    const cont = thumbs[0]?.parentElement;
    const big = [...document.querySelectorAll("img")].filter((i) => i.getBoundingClientRect().width > 300 && i.getBoundingClientRect().top < innerHeight)[0];
    const frame = big?.closest("div");
    const h1 = document.querySelector("h1");
    const textEls = h1 ? [...h1.parentElement.parentElement.querySelectorAll("h1,p,li,a,button,dt,dd,span")].filter((e) => e.getBoundingClientRect().top < innerHeight && e.innerText?.trim() && e.children.length === 0).slice(0, 14).map((e) => ({ tag: e.tagName, text: e.innerText.trim().slice(0, 40), box: box(e), ...cs(e, "fontSize", "lineHeight", "fontWeight", "letterSpacing", "color", "backgroundColor", "borderTopColor", "borderTopWidth", "textTransform") })) : [];
    const pressed = thumbs.find((t) => t.getAttribute("aria-pressed") === "true");
    return {
      thumbs: thumbs.map(box), thumbGap: cont ? getComputedStyle(cont).gap : null,
      thumbImgFit: thumbs[0] ? cs(thumbs[0].querySelector("img"), "objectFit", "objectPosition") : null,
      big: big ? { box: box(big), natural: [big.naturalWidth, big.naturalHeight], src: (big.currentSrc || "").split("/").pop().slice(0, 90), fit: getComputedStyle(big).objectFit } : null,
      h1: h1 ? { box: box(h1), ...cs(h1, "fontSize", "lineHeight", "fontWeight", "fontFamily") } : null,
      body: cs(document.body, "backgroundColor", "color", "fontFamily"),
      textEls,
      activeIndicator: cont ? [...cont.parentElement.querySelectorAll("div")].filter((d) => d !== cont && d.className.includes("after:")).map((d) => ({ cls: d.className.slice(0, 400), box: box(d), after: (() => { const a = getComputedStyle(d, "::after"); return { w: a.width, h: a.height, border: a.border, outline: a.outline, inset: a.inset, transform: a.transform }; })() })) : null,
    };
  });
  await page.screenshot({ path: `${out}${name}-${w}x${h}-first.jpg`, quality: 85 });
  if (w === 1440) await page.screenshot({ path: `${out}${name}-${w}x${h}-full.jpg`, quality: 70, fullPage: true });
  await page.close();
}
writeFileSync(`${out}${name}.json`, JSON.stringify(report, null, 2));
await browser.close();
