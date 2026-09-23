# Teaware.spec — `src/components/sections/Teaware.tsx` (id="teaware")

Data: `teaware` (index "5:", kicker, heading, headingEn, left{label, items[], image (landscape)}, right{label, items[], image (landscape)}).

Reference (section "5: Do's & Don'ts", `bg-stone`, 1178px): index "5:" + a two-line intro heading on the left (`text-3xl font-bold`), right side two columns "DO'S" / "DON'TS": each column a label row then a stacked list of bold uppercase lines (`text-xl lg:text-2xl font-bold leading-tight`) separated by hairlines, staggered `moveUp`.

Ours:
```
<section id="teaware" class="relative bg-stone py-100 container-x">
  <div class="grid grid-cols-12 gap-x-16 lg:gap-x-20">
    <div class="col-span-12 lg:col-span-5">
      <SectionIndex n="5:" />
      <Label className="mt-20"><span class="tc">{kicker}</span></Label>
      <Heading className="tc mt-20 text-3xl lg:text-4xl max-w-350">{heading}</Heading>
      <div class="mt-10 text-xs font-bold text-ink/60">{headingEn}</div>
    </div>
    <div class="col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-30 gap-y-50 mt-40 lg:mt-0">
      {[left, right].map((col, ci) => (
        <div key={ci}>
          <div class="relative aspect-[3/2] w-full" data-animation="clip" data-delay={ci*0.2}><Picture img={col.image} fill sizes="(min-width:1024px) 40vw, 100vw" /></div>
          <Label className="mt-25 text-ink"><span class="tc">{col.label}</span></Label>
          <ul class="mt-15">{col.items.map((it, i) => <li class="tc border-t border-ink/30 py-12 text-xl lg:text-2xl font-bold leading-tight last:border-b" data-animation="moveUp" data-delay={0.1 + i*0.08}>{it}</li>)}</ul>
        </div>
      ))}
    </div>
  </div>
</section>
```

# Shown.spec — `src/components/sections/Shown.tsx` (id="shown")

Data: `shown` (index "6:", heading "SHOWN AT:", label, years, places[5]{name, sub}, awards[2]{src, alt, w, h}, regent{src, alt, w, h}).

Reference (section "6: Who we've done it for", 1363px): a full-width **colour band** (pink → ours `bg-gold`) 100px tall behind the first line of the giant heading (`text-15xl laptop:text-19xl font-bold leading-xxs tracking-tightest`, two lines "WHO WE'VE DONE / IT FOR:" in the reference; ours "SHOWN / AT:"); on the right (cols 7–12) a label row `CLIENTS:  2013-2023` (`text-xs font-bold`, two cells) and then a list of big names (`text-4xl font-bold leading-none`) each with a bottom hairline, staggered `moveUp` (.05 apart). Awards logos sit under the list.

Ours:
```
<section id="shown" class="relative bg-white mb-100 lg:mb-180 pt-30">
  <div class="relative">
    <div aria-hidden class="absolute inset-x-0 top-20 h-100 bg-gold" data-animation="scale" data-scale-variant="scaleLeft" data-from="0" data-to="1" />
    <div class="container-x relative">
      <div class="text-[24vw] laptop:text-19xl font-bold leading-xxs tracking-tightest" data-animation="split" data-split="words, chars">SHOWN<br/>AT:</div>
    </div>
  </div>
  <div class="container-x grid grid-cols-12 gap-x-16 lg:gap-x-20 mt-40">
    <div class="col-span-12 lg:col-start-7 lg:col-span-6">
      <div class="grid grid-cols-2 text-xs font-bold py-10"><span>{label}</span><span>{years}</span></div>
      <ul>{places.map((p, i) => <li class="group border-t border-ink/20 py-10 flex items-baseline justify-between gap-20 last:border-b" data-animation="moveUp" data-delay={i*0.05}><span class="tc text-2xl lg:text-4xl font-bold leading-none"><span class="link-underline">{p.name}</span></span><span class="text-xs font-bold text-stone-deep whitespace-nowrap">{p.sub}</span></li>)}</ul>
      <div class="mt-40 flex flex-wrap items-center gap-30" data-animation="moveUp" data-delay="0.3">
        {awards.map(a => <Image src={a.src} alt={a.alt} width={a.w} height={a.h} class="h-60 w-auto" />)}    // next/image import is fine here (SVG)
        <Image src={regent.src} alt={regent.alt} width={regent.w} height={regent.h} class="h-40 w-auto opacity-70" />
      </div>
    </div>
  </div>
</section>
```
(`import Image from "next/image"` is allowed for the SVG logos; the Regent SVG is white-on-transparent — put it on a `bg-ink px-15 py-10` chip so it is visible.)
