// HTTP-level QA for the bilingual site. Usage: node docs/qa/2026-10-01-bilingual/http-check.mjs <base_url> [production_url]
//   every route in both languages: status 200, <html lang>, title, canonical, reciprocal hreflang
//   English pages: every CJK string left in visible text or in alt / aria-label / title / placeholder / content attributes
//   /zh/* redirects to the unprefixed URL; retired product URLs redirect in both languages; unknown URLs answer 404
//   Chinese pages: visible text identical to production (when a production URL is given)
import { writeFileSync } from "node:fs";

const base = (process.argv[2] || "http://localhost:3120").replace(/\/$/, "");
const production = process.argv[3]?.replace(/\/$/, "");
const out = new URL("./http-report.json", import.meta.url);

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const neutral = [...new Set(locs.map((p) => p.replace(/^\/en(?=\/|$)/, "") || "/")), "/account"];
const en = (p) => (p === "/" ? "/en" : `/en${p}`);

// A run of Chinese characters (with any CJK punctuation inside it), or stray full-width punctuation on its own.
const cjk = /[\u3400-\u9fff][\u3400-\u9fff\u3000-\u303f\uff00-\uffef·・]*|[\u3000-\u303f\uff00-\uffef]+/g;
// CJK that is meant to be on English pages: the language switch names the other language in that language.
const allow = [/^中文$/, /^切換為中文$/];
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const visibleText = (html) => decode(html.replace(/<!--[\s\S]*?-->/g, "").replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<template[\s\S]*?<\/template>/g, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const attrValues = (html) => [...html.replace(/<script[\s\S]*?<\/script>/g, " ").matchAll(/\s(alt|aria-label|title|placeholder|content|aria-roledescription)="([^"]*)"/g)].map((m) => `${m[1]}=${decode(m[2])}`);
const jsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);

const pages = [], failures = [], cjkOnEnglish = {};
const fail = (path, what) => failures.push(`${path}: ${what}`);

for (const path of neutral) {
  for (const [lang, url, htmlLang] of [["zh", path, "zh-Hant"], ["en", en(path), "en"]]) {
    const res = await fetch(base + url, { redirect: "manual" });
    const html = await res.text();
    const got = html.match(/<html[^>]*\slang="([^"]+)"/)?.[1];
    const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    const alternates = Object.fromEntries([...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], new URL(m[2]).pathname]));
    if (res.status !== 200) fail(url, `status ${res.status}`);
    if (got !== htmlLang) fail(url, `<html lang> is ${got}, expected ${htmlLang}`);
    if (!title) fail(url, "no title");
    if (!canonical || new URL(canonical).pathname !== (url === "/" ? "/" : url)) fail(url, `canonical ${canonical}`);
    if (alternates["zh-Hant"] !== path || alternates.en !== en(path) || alternates["x-default"] !== path) fail(url, `hreflang ${JSON.stringify(alternates)}`);
    if (lang === "en") {
      const found = new Set();
      for (const chunk of [visibleText(html), title, ...attrValues(html), ...jsonLd(html)]) for (const m of chunk.match(cjk) ?? []) { const s = m.trim(); if (s && !allow.some((r) => r.test(s))) found.add(s); }
      if (found.size) { cjkOnEnglish[url] = [...found]; fail(url, `${found.size} CJK string(s) on an English page`); }
    }
    pages.push({ url, lang, status: res.status, htmlLang: got, title });
  }
}

const redirects = [];
for (const [from, to] of [["/zh", "/"], ["/zh/collections/tea", "/collections/tea"], ["/zh/products/reunion-paper-gift-box", "/products/reunion-paper-gift-box"],
  ["/products/goldfish-diamond-stud", "/products/diamond-goldfish-stud-earrings"], ["/en/products/goldfish-diamond-stud", "/en/products/diamond-goldfish-stud-earrings"],
  ["/products/goldfish-tea-rose-jinxuan", "/collections/tea"], ["/en/products/goldfish-tea-rose-jinxuan", "/en/collections/tea"]]) {
  const res = await fetch(base + from, { redirect: "manual" });
  const location = res.headers.get("location") ? new URL(res.headers.get("location"), base).pathname : null;
  redirects.push({ from, status: res.status, location });
  if (res.status !== 308 || location !== to) fail(from, `expected 308 → ${to}, got ${res.status} → ${location}`);
}
const notFound = [];
for (const path of ["/nope", "/en/nope", "/products/nope", "/en/products/nope", "/collections/nope", "/en/collections/nope"]) {
  const res = await fetch(base + path, { redirect: "manual" });
  notFound.push({ path, status: res.status });
  if (res.status !== 404) fail(path, `expected 404, got ${res.status}`);
}

// Chinese pages against production: same visible text, same title.
const parity = [];
if (production) {
  for (const path of neutral) {
    const [a, b] = await Promise.all([fetch(base + path).then((r) => r.text()), fetch(production + path).then((r) => r.text())]);
    // The only intended change on Chinese pages is the language switch itself; drop it before comparing.
    const [ta, tb] = [visibleText(a.replace(/<a [^>]*data-locale-switch[^>]*>[^<]*<\/a>/g, "")), visibleText(b)];
    const same = ta === tb;
    let firstDifference;
    if (!same) { let i = 0; while (i < ta.length && ta[i] === tb[i]) i++; firstDifference = { at: i, local: ta.slice(Math.max(0, i - 40), i + 80), production: tb.slice(Math.max(0, i - 40), i + 80) }; }
    parity.push({ path, same, ...(firstDifference ? { firstDifference } : {}) });
  }
}

const report = { base, production: production ?? null, checkedAt: new Date().toISOString(), routes: neutral.length, pagesChecked: pages.length, failures, cjkOnEnglish, allowedCjkOnEnglish: allow.map(String), redirects, notFound, parity: production ? { same: parity.filter((p) => p.same).length, different: parity.filter((p) => !p.same) } : null, pages };
writeFileSync(out, JSON.stringify(report, null, 1));
console.log(JSON.stringify({ routes: report.routes, pagesChecked: report.pagesChecked, failures: failures.length, englishPagesWithCjk: Object.keys(cjkOnEnglish).length, parity: report.parity && { same: report.parity.same, different: report.parity.different.length } }, null, 1));
if (failures.length) console.log(failures.slice(0, 40).join("\n"));
