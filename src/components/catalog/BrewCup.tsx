// The pinned cup beside the brewing steps (user 2026-10-14, after the Daily Harvest "What's in the cup" reference chosen from
// reports/brew-section-design-directions.html in 10-14-charmv-landing-try): one drawing stays put while the steps scroll past,
// and each step adds something to it rather than swapping the picture — the kettle pours and the water rises (01), the sachet
// opens and the goldfish lifts out (02), the goldfish drops into the cup (03), the tea turns amber on the stopwatch (04), and
// the drawing gives way to the approved photograph of the brewed cup (05). Labels point into the cup with the numbers the copy
// already states (150 mL, 95°C, about 5 minutes); nothing is added. Everything is driven by --brew-stage (0–4, continuous),
// which src/lib/motion/animations.ts sets on the section from the same scroll progress that fills the rail; the CSS lives in
// globals.css under .brew-cup. Hidden from assistive tech: the steps carry the information.
import { CUP_INNER, HOT_WATER_D, cup, cupTransform, fish, kettleBody, sachetBody, steam } from "./brew-drawing";

export default function BrewCup({ t }: { t: (zh: string, en: string) => string }) {
  return (
    <div className="brew-cup" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -24 76 114" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <defs><clipPath id="brew-cup-inner"><path d={CUP_INNER} /></clipPath></defs>
        {/* 01 the kettle, mirrored to pour from the top left; its stream; steam off the hot water */}
        <g className="bc-kettle" transform="translate(8.5 12) scale(-1.15 1.15) rotate(-34)">{kettleBody}</g>
        <path className="bc-stream" d="M40 15C37.5 24 31 32 30.5 43.5" />
        <g className="bc-steam">{steam(24, 33, 8)}{steam(40, 33, 8)}</g>
        {/* the water, rising inside the cup; the fill warms from clear to amber in 04 */}
        <g transform={cupTransform(true, 6.3)}>
          <g clipPath="url(#brew-cup-inner)">
            <g className="bc-water">
              <rect className="bc-water-fill" x="9" y="45" width="28" height="12" stroke="none" />
              <path className="bc-surface" d={HOT_WATER_D} />
            </g>
          </g>
        </g>
        {/* 02 → 03 the goldfish: inside the sachet, lifted out, then dropped into the cup, where it turns gold as it steeps */}
        <g className="bc-fish">{fish(0, 0, 20)}</g>
        {/* 02 the sachet, where the kettle was */}
        <g className="bc-sachet" transform="translate(-12 -26)">{sachetBody}</g>
        {/* the cup itself, drawn last so the goldfish reads as behind the glass */}
        {cup(null, true, true, 6.3)}
        {/* 04 the stopwatch, where the kettle was: the hand and a gold arc move to the five-minute mark */}
        <g className="bc-watch" transform="translate(12 10)">
          <circle r="9" /><path d="M-1.8 -11.5h3.6M0 -11.5V-9" />
          <circle className="bc-watch-arc" r="9" transform="rotate(-90)" pathLength="1" />
          <path className="bc-hand" d="M0 0V-6.5" />
        </g>
      </svg>
      <span className="bc-label bc-label-ml"><b>{t("150 mL", "150 mL · 5 fl oz")}</b><i /></span>
      <span className="bc-label bc-label-temp"><i /><b>{t("95°C", "95°C · 203°F")}</b></span>
      <span className="bc-label bc-label-time"><i /><b>{t("約 5 分鐘", "About 5 minutes")}</b></span>
      <span className="bc-progress"><i /><i /><i /><i /><i /></span>
    </div>
  );
}
