import { chromium } from "/Users/kuan/Documents/Codex/09-23-charmvilla-gallery-site/node_modules/playwright/index.mjs";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("https://jakobsencopenhagen.com/en/", { waitUntil: "networkidle", timeout: 60000 }).catch(e => console.log("goto", e.message));
await p.waitForTimeout(1500);
// scroll through once so lazy images load and sections fade in
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 450) { await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(120); }
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(400);
const info = await p.evaluate(() => {
  const r = el => { const b = el.getBoundingClientRect(); return { x: Math.round(b.left), y: Math.round(b.top + scrollY), w: Math.round(b.width), h: Math.round(b.height) }; };
  const out = { vw: innerWidth, docH: document.documentElement.scrollHeight, sections: [] };
  for (const s of document.querySelectorAll("main section[data-type]")) {
    const o = { type: s.dataset.type, ...r(s), items: [] };
    if (["gallery", "text-media"].includes(s.dataset.type)) {
      for (const el of s.querySelectorAll("img, p, a, .lg\\:sticky, .grid")) {
        const cs = getComputedStyle(el);
        o.items.push({ tag: el.tagName, cls: (el.className || "").toString().slice(0, 70), ...r(el), pos: cs.position, top: cs.top, fs: cs.fontSize, lh: cs.lineHeight, ff: cs.fontFamily.slice(0, 30), fw: cs.fontWeight, pt: cs.paddingTop, pb: cs.paddingBottom, gap: cs.columnGap, text: el.tagName === "IMG" ? "" : el.textContent.trim().slice(0, 40) });
      }
      const inner = s.querySelector(".s-gallery, .s-text-media"); const cs = getComputedStyle(inner);
      o.pad = [cs.paddingTop, cs.paddingBottom];
      const g = s.querySelector(".grid"); const gs = getComputedStyle(g); o.grid = { cols: gs.gridTemplateColumns, gap: gs.columnGap, rowGap: gs.rowGap, pl: gs.paddingLeft, pr: gs.paddingRight, pt: gs.paddingTop, pb: gs.paddingBottom };
    }
    out.sections.push(o);
  }
  out.rootVars = ["--bleed", "--gap", "--cols-1", "--cols-2", "--cols-3", "--push-2", "--spacing"].map(v => [v, getComputedStyle(document.documentElement).getPropertyValue(v)]);
  out.bodyBg = getComputedStyle(document.querySelector("main")).backgroundColor;
  return out;
});
console.log(JSON.stringify(info, null, 1));
// screenshots of the gallery + text-media pair at several scroll positions
const gal = info.sections.filter(s => s.type === "gallery")[0];
const tm = info.sections.filter(s => s.type === "text-media");
let i = 0;
for (const y of [gal.y - 200, gal.y, gal.y + 300, gal.y + 600, gal.y + gal.h - 500, tm[1].y - 100, tm[1].y + 300, tm[1].y + 700]) {
  await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(700);
  await p.screenshot({ path: `${process.argv[2]}/ref-home-${String(i++).padStart(2, "0")}-y${Math.round(y)}.jpg`, quality: 70, type: "jpeg" });
}
await b.close();
