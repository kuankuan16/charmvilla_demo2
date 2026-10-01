import { chromium } from "playwright"; import { writeFileSync } from "node:fs";
const out = process.argv[2];
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://jakobsencopenhagen.com/en/products/liam", { waitUntil: "networkidle", timeout: 60000 });
await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); } scrollTo(0, 0); });
await page.waitForTimeout(800);
const data = await page.evaluate(() => {
  const box = (e) => { const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top + scrollY), Math.round(b.width), Math.round(b.height)]; };
  const seen = new Set();
  const media = [...document.querySelectorAll("img, video")].filter((e) => e.getBoundingClientRect().width > 60).map((e) => ({ tag: e.tagName, box: box(e), sticky: (() => { let p = e; while (p && p !== document.body) { const cs = getComputedStyle(p); if (cs.position === "sticky") return [cs.top, box(p.parentElement)[3]]; p = p.parentElement; } return null; })() })).filter((m) => { const k = m.box.join(); if (seen.has(k)) return false; seen.add(k); return true; });
  const texts = [...document.querySelectorAll("h1, h2, h3, p, a, button, li")].filter((e) => e.children.length === 0 && e.innerText?.trim() && e.getBoundingClientRect().width > 0).map((e) => ({ tag: e.tagName, text: e.innerText.trim().slice(0, 60), box: box(e), size: getComputedStyle(e).fontSize }));
  return { height: document.documentElement.scrollHeight, media, texts };
});
writeFileSync(out + "/structure.json", JSON.stringify(data));
await page.screenshot({ path: out + "/liam-full.jpg", type: "jpeg", quality: 60, fullPage: true });
for (const [i, y] of [0, 700, 1400, 2100].entries()) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(400); await page.screenshot({ path: `${out}/l-0${i}.jpg`, type: "jpeg", quality: 70 }); }
console.log(data.height); for (const m of data.media) console.log(m.tag, m.box.join(","), m.sticky ? "sticky " + m.sticky : "");
for (const t of data.texts.filter((t) => t.box[1] < 4500 && t.box[1] > 60)) console.log(t.tag, t.box.join(","), t.size, t.text);
await browser.close();
