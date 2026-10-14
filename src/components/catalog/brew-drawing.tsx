// The brewing drawings' shared vocabulary: the step icons beside each row (TeaPages) and the pinned cup that builds up as the
// steps are read (BrewCup) are made of the same strokes, so one set of parts lives here. Redrawn 2026-10-14 (「我要重畫」) after
// four tea and kitchen icon sets: front view, one even stroke with round ends, simple outlines, almost no inner detail (one
// highlight in the glass), motion told by small marks — the stream, steam waves, an arrow — and lots of air. No thermometer; the
// gooseneck kettle is bigger than the cup and steam rises while it pours (「不用溫度計」「熱水壺要比茶杯大」「倒熱水的時候可以有煙」).
// Then 「線條太粗了，改細」 (2.2 → 1.5 on the 64 box), the sachet drawn after the real one (flat, nearly square, a seal strip across
// the top torn off at the notch, the gold top / white bottom split as a line 40% down, a soft bowed bottom), the goldfish the
// logo's own vector (「小金魚茶包用 logo 的向量金魚圖」) and a plain stopwatch (「時鐘再簡化」). The cup is the brand's glass teacup
// (wide mouth, narrow foot, C-loop handle, a short line under it, no saucer).
import type { ReactNode } from "react";
import { GOLDFISH_D } from "./goldfish-path";

export const SW = 1.5;
export const icon = (d: ReactNode) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
/** the logo goldfish centred on (x, y), `w` wide, outlined at the icons' weight (the width is divided by the scale rather than using
 *  non-scaling-stroke, which would also ignore the icon's own viewBox scaling and draw the fish thinner than everything else) */
export const fish = (x: number, y: number, w: number, sw = SW) => {
  const k = w / 838;
  return <path d={GOLDFISH_D} transform={`translate(${x - 564 * k} ${y - 538.5 * k}) scale(${k})`} strokeWidth={sw / k} />;
};
/** the glass teacup slightly reduced so the kettle can be the bigger object */
export const CS = .86;
/** `big`: steps 4 and 5 have nothing above the cup, so the cup is drawn larger there (bottom kept on the same line) and the icons
 *  fill the box as fully as steps 1–3 (user 2026-10-14: 「04 跟 05 比例都可以放大，整體的視覺上跟前三張圖一樣滿」); `tx` places it */
export const cupScale = (big = false) => big ? CS * 1.3 : CS;
export const cupTransform = (big = false, tx?: number) => { const k = cupScale(big); return `translate(${tx ?? (big ? -6 : 1.26)} ${big ? 60 - 59.6 * k : 8.4}) scale(${k})`; };
/** the cup's inside, in its own coordinates (used to clip what is poured into it) */
export const CUP_INNER = "M9.4 37C9.4 47 13.4 55 20.6 56H25.4C32.6 55 36.6 47 36.6 37Z";
/** `inside` is drawn in the cup's own coordinates (the water line, the goldfish); the highlight is left out when the goldfish sits behind it */
export const cup = (inside: ReactNode, highlight = true, big = false, tx?: number) => { const k = cupScale(big); return <g transform={cupTransform(big, tx)} strokeWidth={SW / k}>
  <path d="M9 37H37" /><path d="M9.4 37C9.4 47 13.4 55 20.6 56H25.4C32.6 55 36.6 47 36.6 37" />
  <path d="M36 40.6C44.4 39.4 46 51.6 33.4 52" /><path d="M16 59.6H30" />
  {highlight && <path d="M13.4 40.4C13.5 42 13.9 43.6 14.6 45" />}
  {inside}
</g>; };
export const HOT_WATER_D = "M10.6 45Q23 47.4 35.4 45";
export const hotWater = <path d={HOT_WATER_D} />;
export const brewed = (big = false) => <><path d="M9.8 40.2Q23 42.4 36.2 40.2" />{fish(23.4, 47.6, 13.5, SW / cupScale(big))}</>;
/** a steam wave rising from (x, y), `h` tall */
export const steam = (x: number, y: number, h: number) => <path d={`M${x} ${y}c-2.4-${h / 6}-2.4-${h / 3} 0-${h / 2}s2.4-${h / 3} 0-${h / 2}`} />;
/** the gooseneck kettle about its own centre, the spout to the left; callers place and tilt it */
export const kettleBody = <>
  <path d="M-11 11Q-12.6 11 -12.3 9.4L-9 -9.4Q-8.7 -11 -7 -11H7Q8.7 -11 9 -9.4L12.3 9.4Q12.6 11 11 11Z" />
  <path d="M-6.6 -11Q0 -17 6.6 -11" /><path d="M-1.4 -15.4V-16.8H1.4V-15.4" />
  <path d="M9.6 -6.6C18.4 -7.4 19.4 6.4 11.6 7.4" />
  <path d="M-12 7.4C-17.6 6.6 -16.4 -9.6 -19 -13.6Q-21 -16.6 -24 -13.4" />
</>;
/** the sachet on the icon's own grid (x 19–43, y 35–57): the body first (BrewCup fills it to hide the goldfish still inside), the
 *  gold / white line, the notch, the seal strip torn off, its path, and the arrow lifting the goldfish out */
export const sachetBody = <>
  <path d="M19 35V54.6Q19 56.4 21 56.6Q31 57.6 41 56.6Q43 56.4 43 54.6V37.2L41.4 36.2L43 35.2M19 35H43" />
  <path d="M19 42.4H43" /><path d="M19 36.4l1.2.8-1.2.8" />
  <g transform="rotate(-14 51 12)"><path d="M41 8.4H62.4V12.8H41Z" /><path d="M41 10.6H62.4" /></g>
  <path d="M44.6 33.4Q47.6 26 50.4 20.6" strokeDasharray="1.6 2.4" />
  <path d="M10 30V18M6.8 21.2L10 18l3.2 3.2" />
</>;
