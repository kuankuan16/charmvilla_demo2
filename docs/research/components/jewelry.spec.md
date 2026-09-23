# Jewelry.spec — `src/components/sections/Jewelry.tsx` (id="jewelry")

Data: `jewelry` (index "3:", kicker, heading, headingEn, items[4]{n, title, desc, image}, craft{label, heading, points[3]}).

Reference (section "3: How we get there", paper, `pt-30 pb-100`, 2085px): left column sticky title ("THE STRATEGIC NARRATIVE PROCESS", `md:sticky md:top-80`, `max-w-350`, `text-3xl font-bold leading-tight`), right column numbered rows `01.` … `04.`: each row = `grid grid-cols-[120px_1px_1fr] gap-x-30 py-30` → number `text-5xl font-bold leading-none`, a vertical hairline (`bg-ink/20 w-px`), then title `text-4xl font-bold leading-none` with a `dot` at the row's far right, and under it `↳ description` in `text-base font-bold` (max-w-320). Rows separated by `Rule`. Below the rows: "DELIVERABLES:" in **gold** (`text-gold text-5xl font-bold`, reference pink) followed by a two-column figures block (`COST: $15K` / `TIME: 30 DAYS` style): label row with dot + big `text-5xl font-bold` value.

Ours:
```
<section id="jewelry" class="relative bg-paper pt-30 pb-100 container-x">
  <div class="grid grid-cols-12 gap-x-16 lg:gap-x-20">
    <div class="col-span-12 md:col-span-5 md:sticky md:top-80 self-start">
      <SectionIndex n="3:" />
      <Label className="mt-20"><span class="tc">{kicker}</span></Label>
      <Heading className="tc mt-20 text-3xl lg:text-4xl max-w-350">{heading}</Heading>
      <div class="mt-10 text-xs font-bold text-stone-deep">{headingEn}</div>
    </div>
    <div class="col-span-12 md:col-span-7">
      {items.map((it, i) => (
        <div data-animation="moveUp" data-delay={i * 0.1} class="grid grid-cols-[90px_1px_1fr_auto] gap-x-20 lg:gap-x-30 py-30 border-t border-ink/20 last:border-b">
          <div class="text-4xl lg:text-5xl font-bold leading-none">{n}</div>
          <div class="bg-ink/20" />
          <div>
            <h3 class="tc text-2xl lg:text-4xl font-bold leading-none">{title}</h3>
            <p class="tc mt-25 flex items-start gap-10 text-base font-bold max-w-320"><Arrow className="mt-3 shrink-0" />{desc}</p>
          </div>
          <div class="relative h-[160px] w-[128px] lg:h-[200px] lg:w-[160px]"><Picture img fill sizes="160px" /></div>
        </div>
      ))}
      <div class="mt-60">
        <div class="text-4xl lg:text-5xl font-bold text-gold leading-none" data-animation="split" data-split="chars">{craft.label}</div>
        <div class="tc mt-20 text-3xl font-bold" data-animation="moveUp">{craft.heading}</div>
        <div class="mt-30 grid grid-cols-1 md:grid-cols-3 border-t border-ink/20">
          {craft.points.map((p, i) => (<div class="py-25 md:border-l first:border-l-0 border-ink/20 md:px-25 first:pl-0" data-animation="moveUp" data-delay={0.1 + i*0.1}><Label>{`0${i+1}`}</Label><div class="tc mt-15 text-2xl lg:text-3xl font-bold leading-none">{p}</div></div>))}
        </div>
      </div>
    </div>
  </div>
</section>
```
Mobile: sticky off (`md:` prefixes as above), thumbnails 128×160, numbers `text-4xl`.
