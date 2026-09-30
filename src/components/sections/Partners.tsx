// Partners screen — one viewport, split layout (reference: LAXER "PARTNERS:" block — image left,
// label top-right, statement centred, outline pill bottom). Server component; content from @/data/content.
import { partners } from "@/data/content";
import { Picture } from "@/components/ui";

export default function Partners() {
  // One screen below the fixed 50px header (so the CTA row is on-screen when the section is anchored).
  return (
    <section id="partners" className="container-x relative grid bg-white laptop:h-[calc(100vh-50px)] laptop:grid-cols-2">
      <div className="partners-image relative p-10 pt-30 laptop:pb-40 laptop:pt-40">
        <div className="relative aspect-[4/5] w-full laptop:aspect-auto laptop:h-full" data-animation="clip">
          <Picture img={partners.image} fill sizes="(min-width:1280px) 48vw, 100vw" className="h-full w-full" />
        </div>
      </div>

      <div className="partners-copy flex min-w-0 flex-col px-25 pb-40 pt-30 laptop:px-40 laptop:pt-45">
        <div className="text-xs font-bold" data-animation="moveUp">{partners.label}</div>

        <div className="my-auto py-40">
          {/* Whole-block rise (not split lines): CJK subsets load after the preloader, so line splitting can reflow.
              Latin brand names stay on one line. */}
          <p className="tc text-3xl font-bold leading-tight lg:text-4xl" data-animation="moveUp" data-delay="0.1">
            {partners.statement.split(/([A-Za-z][A-Za-z .]*[A-Za-z])/).map((run, i) =>
              /^[A-Za-z]/.test(run) ? <span key={i} className="md:whitespace-nowrap">{run}</span> : run,
            )}
          </p>
          <div className="mt-25 text-xs font-bold text-stone-deep" data-animation="moveUp" data-delay="0.2">{partners.statementEn}</div>
        </div>

        <div data-animation="moveUp" data-delay="0.3">
          <a className="btn btn--outline" href={partners.cta.href} target="_blank" rel="noreferrer">
            <span>{partners.cta.label}<span className="tc ml-10 font-medium">{partners.cta.zh}</span></span>
          </a>
        </div>
      </div>
    </section>
  );
}
