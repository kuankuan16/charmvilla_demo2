# ShowMore.spec — `src/components/sections/ShowMore.tsx` (id="show-more")

Data: `showMore` (index "7:", heading "SHOW MORE!", sub, events[3]{date, city, venue}, cta{label, href}, invitation image (portrait 1280×1920)).

Reference (section "7: Enough about us", paper, 598px, `pt-30 mb-100 laptop:mb-180`): index "7:", giant two-line heading (`text-5xl lg:text-8xl font-bold leading-none`), a right-aligned short line and a pill `Btn`.

Ours:
```
<section id="show-more" class="relative bg-paper pt-30 mb-100 laptop:mb-180 container-x">
  <div class="grid grid-cols-12 gap-x-16 lg:gap-x-20">
    <div class="col-span-12 lg:col-span-7">
      <SectionIndex n="7:" />
      <Heading className="mt-20 text-5xl lg:text-8xl leading-none">{heading}</Heading>
      <div class="tc mt-15 text-2xl font-bold" data-animation="moveUp" data-delay="0.1">{sub}</div>
      <ul class="mt-40 border-t border-ink/20">{events.map((e, i) => <li class="grid grid-cols-[110px_120px_1fr] items-baseline gap-x-20 py-15 border-b border-ink/20" data-animation="moveUp" data-delay={0.15 + i*0.1}><span class="text-4xl lg:text-5xl font-bold leading-none">{e.date}</span><span class="text-xs font-bold">{e.city}</span><span class="tc text-base font-bold">{e.venue}</span></li>)}</ul>
      <div class="mt-30"><Btn href={cta.href} outline><span class="tc">{cta.label}</span></Btn></div>   // target="_blank" rel="noreferrer" is not supported by Btn; wrap: use <a class="btn btn--outline" href target="_blank" rel="noreferrer"><span class="tc">…</span><Arrow/></a>
    </div>
    <div class="col-span-12 lg:col-span-4 lg:col-start-9 mt-40 lg:mt-0"><div class="relative aspect-[2/3] w-full max-w-[320px]" data-animation="clip" data-delay="0.2"><Picture img={invitation} fill sizes="320px" /></div></div>
  </div>
</section>
```

# Visit.spec — `src/components/sections/Visit.tsx` (id="visit") — `"use client"`

Data: `visit` (index "8:", heading "VISIT US:", tabs[2] — {id:"shops", label, labelEn, shops[2]{name, addr, hours?, href, image}} and {id:"online", label, labelEn, text, href, image} — news{label, items[3]{date, tag, text}}, instagram).

Reference (section "8: Get in touch", 1454px): `bg-stone` top with a giant heading (`text-15xl laptop:text-19xl leading-xxs tracking-tightest`, "GET / IN TOUCH:"), then a `bg-paper` panel with **tabs**: tab buttons are large (`text-4xl font-bold`) with a filled dot for the active tab and an outlined dot for the inactive one, the inactive tab has a darker background strip; tab content fades (`.3s`); below, a `bg-stone` "newsletter" band with a label on the left (`text-xs font-bold`) and a big two-line title on the right (cols 7–12) with hairlines.

Ours:
```
<section id="visit" class="relative">
  <div class="bg-stone pt-30 pb-40 container-x">
    <SectionIndex n="8:" />
    <div class="text-[22vw] laptop:text-19xl font-bold leading-xxs tracking-tightest" data-animation="split" data-split="words, chars">VISIT<br/>US:</div>
  </div>
  <div class="container-x -mt-1">
    <div role="tablist" class="grid grid-cols-2">
      {tabs.map(t => <button role="tab" aria-selected aria-controls class={`flex items-center gap-15 px-30 py-25 text-2xl lg:text-4xl font-bold text-left ${active ? "bg-paper text-ink" : "bg-field text-stone-deep"}`}><span class={`inline-block h-20 w-20 rounded-full border-2 border-current ${active ? "bg-current" : ""}`}/>{t.labelEn}<span class="tc text-base font-medium">{t.label}</span></button>)}
    </div>
    <div class="bg-paper px-30 py-40 min-h-[420px]">
      {/* panel content fades in over .3s: use a keyed wrapper with `animate-[fadeIn_.3s_ease]`? Tailwind has no fadeIn keyframe here — instead toggle classes `opacity-100 transition-opacity duration-300` and a mounted flag */}
      shops panel: grid md:grid-cols-2 gap-30 → each shop: relative aspect-[3/2] Picture fill (clip animation), name (tc text-2xl font-bold), addr (tc text-base), hours (tc text-xs text-stone-deep), <a href target=_blank rel=noreferrer class="link-underline text-xs font-bold">OPEN MAP ↳</a>
      online panel: Picture + text (tc) + <a href class="btn btn--outline">ONLINE SHOP <Arrow/></a>
    </div>
    <div class="bg-stone grid grid-cols-12 gap-x-20 px-30 py-40">
      <div class="col-span-12 lg:col-span-5 text-xs font-bold">{news.label}</div>
      <ul class="col-span-12 lg:col-span-7">{news.items.map((n, i) => <li class="border-t border-ink/30 py-15 grid grid-cols-[90px_90px_1fr] gap-x-15 last:border-b" data-animation="moveUp" data-delay={i*0.1}><span class="tc text-xs font-bold">{n.date}</span><span class="tc text-xs font-bold text-ink/60">{n.tag}</span><span class="tc text-base font-bold">{n.text}</span></li>)}</ul>
      <a href={instagram} target="_blank" rel="noreferrer" class="col-span-12 mt-30 link-underline text-xs font-bold w-max">INSTAGRAM ↳</a>
    </div>
  </div>
</section>
```
Keyboard: tabs respond to ArrowLeft/ArrowRight; `aria-controls`/`id` pairs on panels; inactive panel `hidden`.

# Footer.spec — `src/components/sections/Footer.tsx`

Data: `brand.logo.white` (ratio 400:77), `sections`, `visit.instagram`.

Reference footer: `bg-stone`, 606px, big-type. Ours: `<footer class="bg-ink text-paper px-25 lg:px-30 pt-60 pb-40">`: top row logo (`next/image`, `src={brand.logo.white}` width 400 height 77, class `w-[220px] h-auto`) and a nav `<ul class="flex flex-wrap gap-x-30 gap-y-10 text-xs font-bold">` of `sections` anchors (skip "hero"; use `label` + `tc` `zh`); bottom row `border-t border-paper/20 mt-50 pt-20 flex justify-between text-xs font-bold`: `© 2026 CHARM VILLA` and `<a href={visit.instagram} target="_blank" rel="noreferrer" class="link-underline">INSTAGRAM</a>`. No animations needed except `data-animation="moveUp"` on the logo row.
