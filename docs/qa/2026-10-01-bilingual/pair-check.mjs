// Mechanical check of every Chinese/English string pair in the source (run from the repo root):
//   node docs/qa/2026-10-01-bilingual/pair-check.mjs
// Pairs are t("中文", "English") calls, [中文, English] tuples in christmas-gifts.ts and the `en: { … }` records in tea-gifts.ts.
// Per pair: protected terms and ${placeholders} survive unchanged, digits match, the English side has no CJK, no word from the
// style guide's avoid list, no exclamation mark outside a protected term and no em dash; nothing anywhere says 子村莊園.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const walk = (dir) => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(p) ? [p] : []; });
const files = walk("src");
const protectedTerms = readFileSync(".translation/protected-terms.txt", "utf8").split("\n").map((s) => s.trim()).filter(Boolean);
const avoid = ["luxurious", "exquisite", "stunning", "perfect", "premium", "must-have", "elevate", "indulge", "curated", "timeless", "you deserve"];
const str = String.raw`("(?:[^"\\]|\\.)*"|` + "`(?:[^`\\\\]|\\\\.)*`" + ")";
const tCall = new RegExp(String.raw`\bt\(\s*${str}\s*,\s*${str}\s*\)`, "g");
const tuple = new RegExp(String.raw`\[\s*${str}\s*,\s*${str}\s*\]`, "g");
const unquote = (s) => s.slice(1, -1).replace(/\\(.)/g, "$1");
const cjk = /[㐀-鿿]/;
const count = (text, term) => text.split(term).length - 1;
const digits = (s) => (s.replace(/\$\{[^}]*\}/g, "").match(/\d+(?:[.,]\d+)*/g) ?? []).sort().join(" ");
// Dates are written differently on purpose (8月11日 → Aug 11, 10/3 → Oct 3); Chinese numerals may become digits or words.
const dateLike = (zh) => /\d+月\d+日|^\d+\/\d+$/.test(zh);

const pairs = [];
for (const file of files) {
  const src = readFileSync(file, "utf8");
  if (src.includes("子村莊園")) pairs.push({ file, zh: "子村莊園", en: "", issues: ["forbidden brand name in source"] });
  for (const m of src.matchAll(tCall)) pairs.push({ file, zh: unquote(m[1]), en: unquote(m[2]) });
  if (file.endsWith("christmas-gifts.ts")) for (const m of src.matchAll(tuple)) if (cjk.test(m[1])) pairs.push({ file, zh: unquote(m[1]), en: unquote(m[2]) });
  if (file.endsWith("tea-gifts.ts")) {
    for (const line of src.split("\n")) {
      const zhName = line.match(/\bname: "([^"]+)", english:/)?.[1], zhDesc = line.match(/\bdescription: "([^"]+)"/)?.[1];
      if (zhName) pairs.pending = { zhName, zhDesc };
      const en = line.match(/^\s*en: \{ name: "([^"]+)", description: "((?:[^"\\]|\\.)*)"/);
      if (en && pairs.pending) { pairs.push({ file, zh: pairs.pending.zhName, en: en[1] }, { file, zh: pairs.pending.zhDesc, en: en[2] }); pairs.pending = null; }
    }
    for (const m of src.matchAll(/"([^"]*[㐀-鿿][^"]*)": "([^"]+)"/g)) pairs.push({ file, zh: m[1], en: m[2] });
  }
}

// Reviewed differences that are correct as written (keyed on the Chinese string).
const accepted = {
  '${info?.name || "全部商品"}｜CHARM VILLA': "the fallback inside the placeholder is itself translated",
  "地址（第二行）": "二 is written as the digit 2",
  "購物車，${cart.count} 件": "English needs a singular/plural noun",
  "聖誕特別版${label}：${zh}": "the placeholder is the description in the page language",
  "台北市中山區中山北路二段39巷3號 B1（麗晶精品）": "二段 is written as Sec. 2",
};
const findings = [], acceptedFindings = [];
for (const p of pairs) {
  const issues = p.issues ?? [];
  if (!p.en && p.zh) { p.note = "English intentionally empty (Chinese-only sub-label)"; continue; }
  if (cjk.test(p.en)) issues.push("CJK in the English string");
  for (const term of protectedTerms) if (count(p.zh, term) && count(p.zh, term) !== count(p.en, term)) issues.push(`protected term "${term}": ${count(p.zh, term)} in Chinese, ${count(p.en, term)} in English`);
  const ph = (s) => (s.match(/\$\{[^}]*\}/g) ?? []).sort().join(" ");
  if (ph(p.zh) !== ph(p.en)) issues.push(`placeholders differ: ${ph(p.zh)} / ${ph(p.en)}`);
  if (!dateLike(p.zh) && digits(p.zh) !== digits(p.en)) issues.push(`digits differ: [${digits(p.zh)}] / [${digits(p.en)}]`);
  const lower = p.en.toLowerCase();
  for (const w of avoid) if (lower.includes(w)) issues.push(`avoid-list word "${w}"`);
  if (/!/.test(protectedTerms.reduce((s, term) => s.split(term).join(""), p.en))) issues.push("exclamation mark");
  if (p.en.includes("—")) issues.push("em dash");
  if (issues.length) (accepted[p.zh] ? acceptedFindings : findings).push({ file: p.file, zh: p.zh, en: p.en, issues, ...(accepted[p.zh] ? { accepted: accepted[p.zh] } : {}) });
}
const report = { checkedAt: new Date().toISOString(), files: files.length, pairs: pairs.length, intentionallyEmptyEnglish: pairs.filter((p) => p.note).map((p) => ({ file: p.file, zh: p.zh })), acceptedFindings, findings };
writeFileSync("docs/qa/2026-10-01-bilingual/pair-report.json", JSON.stringify(report, null, 1));
console.log(JSON.stringify({ files: report.files, pairs: report.pairs, intentionallyEmptyEnglish: report.intentionallyEmptyEnglish.length, accepted: acceptedFindings.length, findings: findings.length }, null, 1));
for (const f of findings) console.log(`${f.file}\n  zh: ${f.zh}\n  en: ${f.en}\n  → ${f.issues.join("; ")}`);
