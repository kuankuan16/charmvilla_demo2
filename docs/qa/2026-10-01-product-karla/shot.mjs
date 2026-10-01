// Full-page and first-screen screenshots of chosen product pages. Usage: node shot.mjs <base> <suffix> <slug,slug,...> [width]
import { chromium } from "playwright";
const [base = "http://localhost:3140", suffix = "", list = "braided-leather-bag-white", width = "1440"] = process.argv.slice(2);
const out = new URL(".", import.meta.url).pathname;
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: +width, height: +width < 768 ? 844 : 900 } });
for (const item of list.split(",")) {
  const [lang, slug] = item.includes("/") ? item.split("/") : ["", item];
  await page.goto(`${base}${lang ? "/" + lang : ""}/products/${slug}`, { waitUntil: "networkidle" });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } scrollTo(0, 0); });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}${suffix}-${lang || "zh"}-${slug}-${width}-full.jpg`, type: "jpeg", quality: 70, fullPage: true });
}
await browser.close();
