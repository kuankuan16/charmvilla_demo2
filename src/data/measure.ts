// Metric sizes with their US equivalents side by side (copy decision 2026-10-06: 「兩者都要，並幫我換算好可以直接對照」).
// Inches are the centimetres divided by 2.54, rounded to one decimal place.
const inch = (cm: number) => (cm / 2.54).toFixed(1);

/** [29.5, 22, 3.5] → { cm: "29.5 × 22 × 3.5 cm", inch: "11.6 × 8.7 × 1.4 in" } */
export const sizeIn = (cm: number[]) => ({ cm: `${cm.join(" × ")} cm`, inch: `${cm.map(inch).join(" × ")} in` });

/** The one-line form used in every specification row. Chinese uses full-width brackets and 約; `note` is an extra remark such as ±5%. */
export const sizeText = (cm: number[], lang: "zh" | "en", note?: string) => {
  const s = sizeIn(cm);
  return lang === "zh"
    ? `${s.cm}（約 ${s.inch}${note ? `，${note}` : ""}）`
    : `${s.cm} (about ${s.inch}${note ? `; ${note}` : ""})`;
};
