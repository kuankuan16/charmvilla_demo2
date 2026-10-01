// Homepage ground colour audit (user 2026-10-01: one background colour, no white next to light grey).
// Reports the computed background of every homepage section and of the store cards on the live alias.
import { chromium } from "playwright";
import fs from "node:fs";
const base = process.argv[2] || "https://charmvilla-gallery-site.vercel.app";
const out = new URL(".", import.meta.url).pathname;
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(3500);
await page.evaluate(async () => { const s = document.querySelector("[data-page-scroller]"); for (let y = 0; y <= s.scrollHeight; y += 700) { s.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); } });
const report = await page.evaluate(() => {
  const bg = (el) => { let e = el; while (e) { const c = getComputedStyle(e).backgroundColor; if (c !== "rgba(0, 0, 0, 0)" && c !== "transparent") return c; e = e.parentElement; } return "none"; };
  const pick = (sel) => [...document.querySelectorAll(sel)].map((el) => ({ sel, id: el.id || el.className.toString().split(" ")[0], background: bg(el) }));
  return [...pick("main.site-main section[id]"), ...pick(".store-card"), ...pick("body")];
});
fs.writeFileSync(out + "report.json", JSON.stringify(report, null, 2));
for (const id of ["shown", "partners", "visit"]) { await page.evaluate((id) => document.getElementById(id).scrollIntoView({ block: "start" }), id); await page.waitForTimeout(900); await page.screenshot({ path: out + `home-${id}.png` }); }
console.log([...new Set(report.map(r => r.background))], report.filter(r => r.background !== "rgb(246, 248, 250)").map(r => r.id));
await browser.close();
