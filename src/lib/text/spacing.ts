// Spacing in mixed Chinese/English text (user 2026-10-02): 「中文字與半形英文字母/數字之間，必須自動插入一個半形空格」
// (React教學 → React 教學, 10個項目 → 10 個項目); full-width punctuation such as ，。「」（） gets no space.
// The same rule pangu.js applies, kept to letters and digits so it stays predictable; no dependency, so it runs the same
// on the server and in the browser (no hydration differences).

// CJK ideographs, kana, bopomofo and enclosed CJK. Not included: full-width punctuation (U+3000–303F, U+FF00–FFEF) and the
// katakana middle dot ・ (U+30FB) the site uses as a separator, so no space is added next to them.
const CJK = "⺀-⻿⼀-⿟぀-ゟ゠-ヺー-ヿ㄀-ㄯ㈀-㋿㐀-䶿一-鿿豈-﫿";
const LETTER_OR_DIGIT = "A-Za-z0-9";
const cjkThenLatin = new RegExp(`([${CJK}])([${LETTER_OR_DIGIT}])`, "g");
const latinThenCjk = new RegExp(`([${LETTER_OR_DIGIT}])([${CJK}])`, "g");

/** Inserts one half-width space wherever a Chinese (or Japanese) character meets a half-width letter or digit. */
export const spaceCjk = (text: string): string => text.replace(cjkThenLatin, "$1 $2").replace(latinThenCjk, "$1 $2");
