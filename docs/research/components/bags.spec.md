# Bags.spec — `src/components/sections/Bags.tsx` (id="bags")

Data: `bags` (index "2:", kicker, heading "LEATHER BAG", product, facts[3], patent, exhibits[7]{code, title, meta, image}, cta{label, href}).

Reference (section "2: How we think", `bg-stone`, 7853px tall at 1440 = 8.7 × viewport; the panel is `laptop:sticky laptop:top-50` and the 7 cards scroll horizontally; passed cards pile up at the left as 125px strips; the current card is lighter; bottom pill button "FOR MORE WORK…").

Structure:
```
<section id="bags" data-animation="stack" data-start="top top" data-end="bottom bottom"
         class="relative bg-stone laptop:h-[870vh]">
  {/* three colour bands entering at the top (reference parallax layers -2 / -1.5 / -1) */}
  <div aria-hidden class="pointer-events-none absolute inset-x-0 top-0 hidden laptop:block">
    <div data-animation="parallax" data-scroll-speed="-2" data-end="top +=100" data-stop-at="0" class="h-180 bg-paper" />
    <div data-animation="parallax" data-scroll-speed="-1.5" data-end="top +=100" data-stop-at="0" class="-mt-45 h-135 bg-gold" />
    <div data-animation="parallax" data-scroll-speed="-1" data-end="top +=100" data-stop-at="0" class="-mt-45 h-90 bg-stone" />
  </div>
  <div class="laptop:sticky laptop:top-50 laptop:h-[calc(100vh-50px)] overflow-hidden">
    header row: container-x pt-30 flex justify-between items-start → left: SectionIndex "2:" + (tc) kicker Label; right (cols 7-12): Heading "LEATHER BAG" text-4xl + product (tc) + facts as three `Label`s in a row + patent text-xs (tc)
    <div data-stack-cards class="mt-40 grid gap-y-40 container-x laptop:mt-30 laptop:flex laptop:w-max laptop:px-0">
      {exhibits.map((ex, i) => (
        <article data-stack-card class="relative flex flex-col bg-stone laptop:w-690 laptop:h-[520px] border-l border-ink/30 px-25 lg:px-30 pt-20 pb-25 [&.is-active]:bg-[#b3b6b8] transition-colors duration-300">
          <div class="text-3xl font-bold leading-none">{code}:</div>          // "A:" row like the reference index
          <div class="mt-15 relative h-[280px] w-[210px]"> <Picture img fill sizes="220px" /> </div>   // product image, left-aligned
          <h3 class="tc mt-20 text-3xl font-bold leading-tight"><span class="link-underline">{title}</span></h3>
          <div class="text-xs font-bold text-ink/60 mt-6">{meta}</div>
          <div class="mt-auto flex items-center justify-between text-xs font-bold pt-20">
            <div class="flex items-center gap-40"><span>MATERIAL:</span><span class="flex items-center gap-8"><Arrow/> <span class="tc">{bags.facts[0]} · {bags.facts[1]}</span></span></div>
            <span>{i + 1} - {exhibits.length}</span>
          </div>
        </article>
      ))}
    </div>
    <div class="container-x mt-40 flex justify-center laptop:mt-30"><Btn href={cta.href}>{cta.label}</Btn></div>
  </div>
</section>
```
Each card gets `data-animation="moveUp" data-delay={i*0.1}` only below laptop (the stack handles desktop) — simplest: put moveUp on the cards; on desktop it still just fades them in once, fine. Mobile: section height auto (`laptop:h-[870vh]` only), cards full width, image `h-[360px] w-full`, no borders on the left, `bg-white/20` separators via `Rule`.

Notes: the dot marker in the reference's active card top-right = add `<span class="dot absolute right-25 top-25 opacity-0 [.is-active_&]:opacity-100 transition-opacity" />`. Keep all copy from data; the `cta.label` already includes Chinese — wrap the Chinese part: render as `<span class="tc">{cta.label}</span>`.
