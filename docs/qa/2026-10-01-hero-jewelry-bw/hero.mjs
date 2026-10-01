// Homepage hero with the jewellery slide in front. Usage: node hero.mjs <base> [suffix]
import { chromium } from "playwright";
const base = process.argv[2] || "http://localhost:3140"; const suffix = process.argv[3] || "";
const out = new URL(".", import.meta.url).pathname;
const browser = await chromium.launch({ channel: "chrome" });
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(() => { try { sessionStorage.setItem("cv-skip-preloader", "1"); } catch {} });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  let info = null;
  for (let i = 0; i < 40; i++) {
    info = await page.evaluate(() => { const c = document.querySelector('.orbit-card--jewelry'); const img = c?.querySelector("img"); return c ? { active: c.dataset.active, src: img?.currentSrc, natural: [img?.naturalWidth, img?.naturalHeight], filter: getComputedStyle(img).filter } : null; });
    if (info?.active === "true") break; await page.waitForTimeout(500);
  }
  await page.waitForTimeout(1600);
  console.log(w, JSON.stringify(info));
  await page.screenshot({ path: `${out}hero-jewelry-${w}${suffix}.jpg`, type: "jpeg", quality: 82 });
  await ctx.close();
}
await browser.close();
