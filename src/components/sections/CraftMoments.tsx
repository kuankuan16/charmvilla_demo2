// "以手成形" — the four crafts as a magazine spread, after the jakobsencopenhagen.com/en/ homepage (its "gallery" and
// "text-media" sections; user 2026-10-01: 「這一屏我要改成…這樣的 layout 與效果，像雜誌的排版，有左邊兩張小圖」). Two rows on the
// page's 12 columns: two small photographs at the left that stay under the header while a large one passes at the right;
// then the heading with the four artisans' lines set two columns in, beside a second large photograph that stays in place
// while the text passes. Each row fades in as it enters. Nothing moves on its own: no carousel, no dots, no pinned screen.
// Server component; copy from @/data/craft-moments. Measurements of the reference: docs/qa/2026-10-01-craft-magazine/.
import Image from "next/image";
import Link from "next/link";
import { getCraftMoments, type CraftMoment } from "@/data/craft-moments";
import { localeHref, type Locale } from "@/i18n/config";

// Which photograph goes where. The large places take the two widest files (tea 1200 px, then a 896 px one).
// The two small places hold the section's own photographs (`smalls`, user 2026-10-02), not the crafts' ones.
const LARGE = "tea", BESIDE_TEXT = "teaware";

export default function CraftMoments({ lang }: { lang: Locale }) {
  const { heading, items, smalls } = getCraftMoments(lang);
  const by = (id: string) => items.find((item) => item.id === id) as CraftMoment;
  const figure = (item: CraftMoment, className: string, sizes: string) => (
    <figure key={item.id} className={`craft-fig ${className}`}>
      <Image src={item.image.src} alt={item.image.alt} fill sizes={sizes} />
    </figure>
  );
  return (
    <section id="craft" className="craft-moments" aria-labelledby="craft-heading">
      <div className="craft-spread" data-animation="fade" data-duration="0.7">
        <div className="craft-smalls">{smalls.map((img) => (
          <figure key={img.src} className="craft-fig"><Image src={img.src} alt={img.alt} fill sizes="(min-width:768px) 15vw, 50vw" /></figure>
        ))}</div>
        {figure(by(LARGE), "craft-large", "(min-width:768px) 46vw, 100vw")}
      </div>
      <div className="craft-story" data-animation="fade" data-duration="0.7">
        <div className="craft-words">
          <h2 id="craft-heading" className="craft-heading tc">{heading[0]}<br />{heading[1]}</h2>
          <ul className="craft-list">
            {items.map((item) => (
              <li key={item.id}>
                <p className="craft-craft tc">{item.craft}</p>
                <p className="craft-quote tc">{item.quote[0]}<br />{item.quote[1]}</p>
                <Link href={localeHref(lang, item.cta.href)} className="craft-link tc">{item.cta.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        {figure(by(BESIDE_TEXT), "craft-large", "(min-width:768px) 46vw, 100vw")}
      </div>
    </section>
  );
}
