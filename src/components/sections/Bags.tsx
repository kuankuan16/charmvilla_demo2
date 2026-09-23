// Section 2: — LEATHER BAG. Horizontal card stack (reference: docs/research/laxer/screens/04 + 07).
// Server component: markup + data-animation attributes only; the scroll engine drives the stack ≥1280px,
// below that the cards fall back to a vertical grid.
import { bags } from "@/data/content";
import { SectionIndex, Heading, Label, Arrow, Btn, Picture } from "@/components/ui";

export default function Bags() {
  return (
    <section id="bags" data-animation="stack" data-start="top top" data-end="bottom bottom" className="relative bg-stone laptop:h-[870vh]">
      {/* Colour bands that drift at different speeds as the section enters (desktop only). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 hidden laptop:block">
        <div data-animation="parallax" data-scroll-speed="-2" data-end="top +=100" data-stop-at="0" className="h-180 bg-paper" />
        <div data-animation="parallax" data-scroll-speed="-1.5" data-end="top +=100" data-stop-at="0" className="-mt-45 h-135 bg-gold" />
        <div data-animation="parallax" data-scroll-speed="-1" data-end="top +=100" data-stop-at="0" className="-mt-45 h-90 bg-stone" />
      </div>

      {/* Sticky panel: pinned under the 50px header while the tall section scrolls the card row left. */}
      <div className="relative pt-30 pb-60 laptop:sticky laptop:top-50 laptop:h-[calc(100vh-50px)] laptop:overflow-hidden laptop:pb-0">
        <div className="container-x grid grid-cols-12 items-start gap-x-16 lg:gap-x-20">
          <div className="col-span-12 lg:col-span-6">
            <SectionIndex n={bags.index} />
            <Label className="mt-15">
              <span className="tc">{bags.kicker}</span>
            </Label>
          </div>
          <div className="col-span-12 lg:col-span-6 mt-20 lg:mt-0">
            <Heading className="text-3xl lg:text-4xl">{bags.heading}</Heading>
            <div className="tc mt-10 text-xl font-bold" data-animation="moveUp">
              {bags.product}
            </div>
            <div className="mt-15 flex flex-wrap gap-x-25 gap-y-6" data-animation="moveUp" data-delay="0.1">
              {bags.facts.map((f) => (
                <Label key={f}>
                  <span className="tc">{f}</span>
                </Label>
              ))}
            </div>
            <div className="tc mt-10 text-xs font-bold text-ink/70" data-animation="moveUp" data-delay="0.15">
              {bags.patent}
            </div>
          </div>
        </div>

        {/* Card row: vertical grid below 1280px; a w-max flex strip the engine translates on desktop. */}
        <div data-stack-cards="" className="container-x mt-40 grid gap-y-40 laptop:mt-25 laptop:flex laptop:w-max laptop:gap-0 laptop:px-0">
          {bags.exhibits.map((ex, i) => (
            <article
              key={ex.code}
              data-stack-card=""
              data-animation="moveUp"
              data-delay={i * 0.08}
              className="group relative flex flex-col border-t border-ink/30 bg-stone pt-20 pb-25 transition-colors duration-300 laptop:h-[480px] laptop:w-690 laptop:border-t-0 laptop:border-l laptop:px-30 [&.is-active]:bg-[#b3b6b8]"
            >
              <span className="dot absolute right-25 top-25 opacity-0 transition-opacity [.is-active_&]:opacity-100" />
              <div className="text-3xl font-bold leading-none">{ex.code}:</div>
              <div className="relative mt-15 h-[360px] w-full laptop:h-[250px] laptop:w-[190px]">
                <Picture img={ex.image} fill className="h-full w-full" sizes="(min-width:1280px) 190px, 100vw" />
              </div>
              <h3 className="tc mt-20 text-3xl font-bold leading-tight">
                <span className="link-underline">{ex.title}</span>
              </h3>
              <div className="mt-6 text-xs font-bold text-ink/60">{ex.meta}</div>
              <div className="mt-auto flex items-center justify-between pt-20 text-xs font-bold">
                <div className="flex items-center gap-30">
                  <span>MATERIAL:</span>
                  <span className="flex items-center gap-8">
                    <Arrow />
                    <span className="tc">
                      {bags.facts[0]} · {bags.facts[1]}
                    </span>
                  </span>
                </div>
                <span>
                  {i + 1} - {bags.exhibits.length}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="container-x mt-40 flex justify-center laptop:mt-30">
          <Btn href={bags.cta.href}>
            <span className="tc">{bags.cta.label}</span>
          </Btn>
        </div>
      </div>
    </section>
  );
}
