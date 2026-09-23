# Tea.spec — `src/components/sections/Tea.tsx` (id="tea")

Data: `tea` (index "4:", kicker, heading, headingEn, scrollHint, cards[5]{code, title, tea, flower, image(landscape 2048×1360)}, craft, honours[3]).

Reference (section "4: Other things we offer", white, 4234px = 4.7 × viewport): index "4:" + heading row; then a **sticky left panel** (`laptop:sticky laptop:top-150`, 531px tall, cols 1–5) with the big title "ADDITIONAL SERVICES" (`text-4xl font-bold`) and at its bottom `↳ SCROLL TO EXPLORE` (`text-xs font-bold text-stone-deep`); to the right a horizontal row of cards (A: / B: / C:) that scroll sideways with the page (stack mechanism). Each card: top index letter above the card box (`text-3xl font-bold`), a bordered box (`border-l border-ink/20`, `min-h-[410px]`): title `text-4xl font-bold`, `↳ description` `text-base font-bold`, `INCLUDES: …` row, and a bottom two-cell figures row (`COST: $10K` | `TIME: 30 DAYS` → for us `TEA:` | `FLOWER:`) with `Label` + `text-4xl font-bold` values, cells separated by a vertical rule.

Ours:
```
<section id="tea" data-animation="stack" data-start="top top" data-end="bottom bottom" class="relative bg-white pt-30 pb-100 lg:pb-180 laptop:h-[470vh]">
  <div class="laptop:sticky laptop:top-50 laptop:h-[calc(100vh-50px)] overflow-hidden">
    <div class="container-x grid grid-cols-12 gap-x-16 lg:gap-x-20">
      <div class="col-span-12 laptop:col-span-5 laptop:h-[531px] flex flex-col">
        <SectionIndex n="4:" />
        <Label className="mt-20"><span class="tc">{kicker}</span></Label>
        <Heading className="tc mt-20 text-4xl">{heading}</Heading>
        <div class="text-xs font-bold text-stone-deep mt-10">{headingEn}</div>
        <p class="tc mt-30 max-w-350 text-base font-bold leading-body" data-animation="moveUp" data-delay="0.2">{craft}</p>
        <div class="mt-auto hidden laptop:flex items-center gap-10 text-xs font-bold text-stone-deep"><Arrow/> {scrollHint}</div>
      </div>
      <div class="col-span-12 laptop:col-span-7 laptop:overflow-visible">
        <div data-stack-cards class="grid gap-y-40 laptop:flex laptop:w-max">
          {cards.map((c, i) => (
            <div data-stack-card class="laptop:w-690 laptop:pr-30" data-animation="moveUp" data-delay={i*0.1}>
              <div class="text-3xl font-bold leading-none mb-15">{c.code}:</div>
              <div class="border-l border-t border-ink/20 bg-white pl-25 lg:pl-30 pt-25 min-h-[410px] flex flex-col [.is-active_&]:bg-paper transition-colors duration-300">
                <div class="relative h-[220px] w-full mr-30"><Picture img fill sizes="(min-width:1280px) 660px, 100vw" /></div>
                <h3 class="tc mt-25 text-3xl lg:text-4xl font-bold leading-none">{c.title}</h3>
                <div class="mt-auto grid grid-cols-2 border-t border-ink/20 pt-15 mt-25">
                  <div><Label>TEA:</Label><div class="tc text-3xl lg:text-4xl font-bold mt-10">{c.tea}</div></div>
                  <div class="border-l border-ink/20 pl-25"><Label>FLOWER:</Label><div class="tc text-3xl lg:text-4xl font-bold mt-10">{c.flower}</div></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <ul class="container-x mt-40 flex flex-wrap gap-x-40 gap-y-10 text-xs font-bold text-stone-deep" data-animation="moveUp" data-delay="0.3">
      {honours.map(h => <li class="tc flex items-center gap-10"><span class="dot scale-75"/>{h}</li>)}
    </ul>
  </div>
</section>
```
Mobile: sticky off, cards stacked full width (image `h-[240px]`), honours list wraps.
