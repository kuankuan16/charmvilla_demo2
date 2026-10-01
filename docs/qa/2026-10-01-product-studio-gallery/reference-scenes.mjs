// Scene layout of the reference page with many scenes (user 2026-10-01: 「若情境圖比較多，高度學習這一頁…像雜誌的版型」).
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const out = new URL("./reference/", import.meta.url).pathname;
const url = process.argv[2] || "https://jakobsencopenhagen.com/en/products/stina-corner-sitting-island-3-seater";
const name = url.split("/").pop();
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle" }); await page.waitForTimeout(1200);
// dismiss the cookie dialog if present
for (const label of ["DENY", "Deny", "ALLOW ALL"]) { const b = page.getByText(label, { exact: true }).first(); if (await b.count()) { await b.click().catch(() => {}); break; } }
await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); });
await page.waitForTimeout(800);
const data = await page.evaluate(() => {
  const col = (x) => +(((x - 30) / ((1380 + 20) / 12)) + 1).toFixed(2);
  const sections = [...document.querySelectorAll("main section, main > div > section")];
  const imgs = [...document.querySelectorAll("img")].map((i) => { const b = i.getBoundingClientRect(); const s = i.closest("section"); return { x: Math.round(b.left), y: Math.round(b.top + scrollY), w: Math.round(b.width), h: Math.round(b.height), colStart: col(b.left), colEnd: col(b.right + 20) - 1, ratio: +(b.width / b.height).toFixed(2), section: s ? (s.className.match(/s-[\w-]+/) || [""])[0] : "", cls: (i.parentElement.className || "").slice(0, 80) }; }).filter((i) => i.w > 60 && i.y > 800);
  const texts = [...document.querySelectorAll("main h2, main h3, main p")].map((e) => { const b = e.getBoundingClientRect(); return { tag: e.tagName, x: Math.round(b.left), y: Math.round(b.top + scrollY), w: Math.round(b.width), size: getComputedStyle(e).fontSize, text: e.innerText.trim().slice(0, 50) }; }).filter((t) => t.text && t.y > 800 && t.y < 9000).slice(0, 40);
  return { height: document.body.scrollHeight, sections: sections.map((s) => { const b = s.getBoundingClientRect(); return { cls: s.className.slice(0, 120), y: Math.round(b.top + scrollY), h: Math.round(b.height) }; }), imgs, texts };
});
await page.screenshot({ path: `${out}${name}-1440-full.jpg`, quality: 60, fullPage: true });
writeFileSync(`${out}${name}-scenes.json`, JSON.stringify(data, null, 1));
console.log("height", data.height); for (const s of data.sections) console.log("SECTION", s.y, s.h, s.cls);
for (const i of data.imgs) console.log("IMG", `y${i.y}`, `x${i.x}`, `${i.w}x${i.h}`, `cols ${i.colStart}–${i.colEnd}`, `r${i.ratio}`, i.section);
for (const t of data.texts) console.log("TXT", t.tag, `y${t.y}`, `x${t.x}`, `w${t.w}`, t.size, t.text);
await browser.close();
