// Viewport screenshots while scrolling one product page: the image on the left stays, the right column moves, then both leave together.
// Usage: node scroll.mjs <base> <suffix> <slug> [width] [height]
import { chromium } from "playwright";
const [base = "http://localhost:3140", suffix = "", slug = "braided-leather-bag-white", width = "1440", height = "900"] = process.argv.slice(2);
const out = new URL(".", import.meta.url).pathname;
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: +width, height: +height } });
await page.goto(`${base}/products/${slug}`, { waitUntil: "networkidle" });
await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } scrollTo(0, 0); });
const end = await page.evaluate(() => Math.round(document.querySelector(".product-more").getBoundingClientRect().bottom + scrollY));
const stops = [0, 450, 900, end - +height + 40, end - 420];
for (let i = 0; i < stops.length; i++) {
  await page.evaluate((y) => scrollTo(0, y), stops[i]); await page.waitForTimeout(350);
  await page.screenshot({ path: `${out}${suffix}-${slug}-${width}-scroll-${i}.jpg`, type: "jpeg", quality: 78 });
}
await browser.close();
