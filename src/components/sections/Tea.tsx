// Section 4 — Tea. Sticky "SCROLL TO EXPLORE" panel with a horizontal A:–E: card stack (desktop ≥1280px);
// below that the engine is inert and the cards fall into a vertical grid. Server component; content from
// @/data/content only.
import { tea } from "@/data/content";
import { SectionIndex, Heading, Label, Arrow, Picture } from "@/components/ui";

export default function Tea() {
  return (
    <section id="tea" data-animation="stack" data-start="top top" data-end="bottom bottom" className="relative bg-white pt-30 pb-100 lg:pb-180 laptop:h-[470vh]">
      <div className="laptop:sticky laptop:top-50 laptop:h-[calc(100vh-50px)] laptop:overflow-hidden">
        <div className="container-x grid grid-cols-12 gap-x-16 lg:gap-x-20">
          <div className="col-span-12 flex flex-col laptop:col-span-5 laptop:h-[531px]">
            <SectionIndex n={tea.index} />
            <Label className="mt-20"><span className="tc">{tea.kicker}</span></Label>
            <Heading className="tc mt-20 text-3xl lg:text-4xl">{tea.heading}</Heading>
            <div className="mt-10 text-xs font-bold text-stone-deep">{tea.headingEn}</div>
            <p className="tc mt-30 max-w-350 text-base font-bold leading-body" data-animation="moveUp" data-delay="0.2">{tea.craft}</p>
            <div className="mt-auto hidden items-center gap-10 text-xs font-bold text-stone-deep laptop:flex"><Arrow />{tea.scrollHint}</div>
          </div>
          <div className="col-span-12 mt-40 laptop:col-span-7 laptop:mt-0">
            <div data-stack-cards="" className="grid gap-y-40 laptop:flex laptop:w-max">
              {tea.cards.map((c, i) => (
                <div key={c.code} data-stack-card="" data-animation="moveUp" data-delay={i * 0.1} className="laptop:w-690 laptop:pr-30">
                  <div className="mb-15 text-3xl font-bold leading-none">{c.code}:</div>
                  <div className="flex min-h-[410px] flex-col border-t border-l border-ink/20 bg-white pl-25 pt-25 pb-25 transition-colors duration-300 lg:pl-30 [.is-active_&]:border-ink">
                    <div className="relative mr-25 h-[240px] laptop:h-[220px]"><Picture img={c.image} fill sizes="(min-width:1280px) 660px, 100vw" /></div>
                    <h3 className="tc mt-25 text-3xl font-bold leading-none lg:text-4xl">{c.title}</h3>
                    <div className="mt-25 mr-25 grid grid-cols-2 border-t border-ink/20 pt-15 laptop:mt-auto">
                      <div><Label>TEA:</Label><div className="tc mt-10 text-3xl font-bold leading-tight lg:text-4xl">{c.tea}</div></div>
                      <div className="border-l border-ink/20 pl-25"><Label>FLOWER:</Label><div className="tc mt-10 text-3xl font-bold leading-tight lg:text-4xl">{c.flower}</div></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ul className="container-x mt-40 flex flex-wrap gap-x-40 gap-y-10 text-xs font-bold text-stone-deep" data-animation="moveUp" data-delay="0.3">
          {tea.honours.map((h) => <li key={h} className="tc flex items-center gap-10"><span className="dot scale-75" />{h}</li>)}
        </ul>
      </div>
    </section>
  );
}
