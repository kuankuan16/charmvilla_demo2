// "以手成形" — the four crafts as a magazine spread, after the jakobsencopenhagen.com/en/ homepage (its "gallery" and
// "text-media" sections; user 2026-10-01: 「這一屏我要改成…這樣的 layout 與效果，像雜誌的排版，有左邊兩張小圖」). Two rows on the
// page's 12 columns: two small photographs at the left that stay under the header while a large one passes at the right;
// then the heading with the four artisans' lines set two columns in, beside a second large photograph that stays in place
// while the text passes. Each row fades in as it enters. Nothing moves on its own: no carousel, no dots, no pinned screen.
// Server component; copy from @/data/craft-moments. Measurements of the reference: docs/qa/2026-10-01-craft-magazine/.
import Image from "next/image";
import type { ReactNode } from "react";
import { getCraftMoments, type CraftMoment } from "@/data/craft-moments";
import { getContent } from "@/data/content";
import type { Locale } from "@/i18n/config";

// Which photograph goes where. The large places take the two widest files (tea 1200 px, then a 896 px one).
// The two small places hold the section's own photographs (`smalls`, user 2026-10-02), not the crafts' ones.
const LARGE = "tea", BESIDE_TEXT = "teaware";

export default function CraftMoments({ lang }: { lang: Locale }) {
  const { heading, body, items, smalls } = getCraftMoments(lang);
  const by = (id: string) => items.find((item) => item.id === id) as CraftMoment;
  const { tea } = getContent(lang);
  const figure = (item: CraftMoment, className: string, sizes: string, overlay?: ReactNode) => (
    <figure key={item.id} className={`craft-fig ${className}`}>
      <Image src={item.image.src} alt={item.image.alt} fill sizes={sizes} />
      {overlay}
    </figure>
  );
  // The Goldfish Tea Bag's two award marks, laid over the tea photograph as ONE group (user 2026-10-02: 「當作一個群組，如果下次有
  // 調整版面要可以一起移動」) — move or restyle .award-badges, never the marks one by one. On the dark photograph the Red Dot mark
  // uses its light version (white lettering).
  const awardBadges = (
    <div className="award-badges" role="group" aria-label={tea.honoursAria} data-brand-awards="">
      {tea.awards.map((award) => {
        const src = award.image.src.replace("reddot-winner-2014-transparent.svg", "reddot-winner-2014-light.svg");
        return <Image key={src} src={src} alt={award.image.alt} width={award.image.w} height={award.image.h} sizes="96px" />;
      })}
    </div>
  );
  return (
    <section id="craft" className="craft-moments" aria-labelledby="craft-heading">
      <div className="craft-spread" data-animation="fade" data-duration="0.7">
        <div className="craft-smalls">{smalls.map((img) => (
          <figure key={img.src} className="craft-fig"><Image src={img.src} alt={img.alt} fill sizes="(min-width:768px) 15vw, 50vw" /></figure>
        ))}</div>
        {figure(by(LARGE), "craft-large", "(min-width:768px) 46vw, 100vw", awardBadges)}
      </div>
      <div className="craft-story" data-animation="fade" data-duration="0.7">
        <div className="craft-words">
          <h2 id="craft-heading" className="craft-heading tc">{heading[0]}<br />{heading[1]}</h2>
          <div className="craft-body tc">{body.map((text) => <p key={text}>{text}</p>)}</div>
        </div>
        {figure(by(BESIDE_TEXT), "craft-large", "(min-width:768px) 46vw, 100vw")}
      </div>
    </section>
  );
}
