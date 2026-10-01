// Partners screen — one viewport, split layout (reference: LAXER "PARTNERS:" block — image left,
// label top-right, statement centred, outline pill bottom). Server component; content from @/data/content.
import { getContent } from "@/data/content";
import { Picture } from "@/components/ui";
import type { Locale } from "@/i18n/config";

export default function Partners({ lang }: { lang: Locale }) {
  const { partners } = getContent(lang);
  // One screen below the fixed 50px header (so the CTA row is on-screen when the section is anchored).
  return (
    <section id="partners" className="container-x relative grid bg-page laptop:h-[calc(100vh-50px)] laptop:grid-cols-2">
      {/* The photograph is shown whole (no cover crop: the dancer's hand reaches the right edge) and centred in its column. */}
      <div className="partners-image relative flex items-center p-10 pt-30 laptop:pb-40 laptop:pt-40">
        <div className="relative w-full" data-animation="clip">
          <Picture img={partners.image} sizes="(min-width:1280px) 48vw, 100vw" />
        </div>
      </div>

      <div className="partners-copy flex min-w-0 flex-col px-25 pb-40 pt-30 laptop:px-40 laptop:pt-45">

        <div className="my-auto py-40">
          {/* Whole-block rise (not split lines): CJK subsets load after the preloader, so line splitting can reflow.
              In the Chinese statement, Latin brand names stay on one line; the English statement wraps as ordinary prose. */}
          <p className="partners-statement tc" data-animation="moveUp" data-delay="0.1">
            {lang === "en" ? partners.statement : partners.statement.split(/([A-Za-z][A-Za-z .]*[A-Za-z])/).map((run, i) =>
              /^[A-Za-z]/.test(run) ? <span key={i} className="md:whitespace-nowrap">{run}</span> : run,
            )}
          </p>
        </div>

        <div data-animation="moveUp" data-delay="0.3">
          <a className="btn btn--outline" href={partners.cta.href} target="_blank" rel="noreferrer">
            <span>{partners.cta.label}{partners.cta.zh && <span className="tc ml-10 font-medium">{partners.cta.zh}</span>}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
