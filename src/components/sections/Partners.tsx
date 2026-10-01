// Partners screen — one viewport, split edge to edge: photograph left, statement right. Server component; content from @/data/content.
import { getContent } from "@/data/content";
import { Picture } from "@/components/ui";
import type { Locale } from "@/i18n/config";

export default function Partners({ lang }: { lang: Locale }) {
  const { partners } = getContent(lang);
  // One screen, edge to edge (user 2026-10-01: 「這一屏我想要左右滿版，並拿掉合作洽詢的按鈕」): the photograph fills the left
  // half from the left edge of the window, the statement sits in the right half. The photograph is shown whole (no cover
  // crop: the dancer's hand reaches its right edge).
  return (
    <section id="partners" className="partners-screen">
      <div className="partners-image" data-animation="clip">
        <Picture img={partners.image} sizes="(min-width:1280px) 50vw, 100vw" />
      </div>
      <div className="partners-copy">
        {/* Whole-block rise (not split lines): CJK subsets load after the preloader, so line splitting can reflow.
            In the Chinese statement, Latin brand names stay on one line; the English statement wraps as ordinary prose. */}
        <p className="partners-statement tc" data-animation="moveUp" data-delay="0.1">
          {lang === "en" ? partners.statement : partners.statement.split(/([A-Za-z][A-Za-z .]*[A-Za-z])/).map((run, i) =>
            /^[A-Za-z]/.test(run) ? <span key={i} className="md:whitespace-nowrap">{run}</span> : run,
          )}
        </p>
      </div>
    </section>
  );
}
