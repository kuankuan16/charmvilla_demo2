// Section 3 — Jewelry. Numbered rows (reference: laxer "process" screen) with a sticky left title,
// followed by a CRAFT block of three points. Server component; content only from @/data/content.
import { jewelry } from "@/data/content";
import { SectionIndex, Heading, Label, Arrow, Picture } from "@/components/ui";

export default function Jewelry() {
  return (
    <section id="jewelry" className="container-x relative bg-white pt-30 pb-100">
      <div className="grid grid-cols-12 gap-x-16 lg:gap-x-20">
        <div className="col-span-12 self-start md:sticky md:top-80 md:col-span-5">
          <SectionIndex n={jewelry.index} />
          <Label className="mt-20">
            <span className="tc">{jewelry.kicker}</span>
          </Label>
          <Heading className="tc mt-20 max-w-350 text-3xl lg:text-4xl">{jewelry.heading}</Heading>
          <div className="mt-10 text-xs font-bold text-stone-deep">{jewelry.headingEn}</div>
        </div>

        <div className="col-span-12 mt-40 md:col-span-7 md:mt-0">
          {jewelry.items.map((it, i) => (
            <div
              key={it.n}
              data-animation="moveUp"
              data-delay={i * 0.1}
              className="grid grid-cols-[56px_1px_1fr] gap-x-15 border-t border-ink/20 py-30 last:border-b md:grid-cols-[70px_1px_1fr_auto] lg:grid-cols-[110px_1px_1fr_auto] lg:gap-x-30"
            >
              <div className="text-4xl font-bold leading-none lg:text-5xl">{it.n}</div>
              <div className="bg-ink/20" />
              <div className="relative min-w-0 pr-20">
                <h3 className="tc text-2xl font-bold leading-none lg:text-4xl">{it.title}</h3>
                <p className="tc mt-25 flex max-w-320 items-start gap-10 text-base font-bold">
                  <Arrow className="mt-3 shrink-0" />
                  {it.desc}
                </p>
              </div>
              <div className="relative col-span-3 mt-20 h-[220px] w-full md:col-span-1 md:mt-0 md:h-[160px] md:w-[128px] lg:h-[200px] lg:w-[160px]">
                <Picture img={it.image} fill sizes="160px" />
              </div>
            </div>
          ))}

          <div className="mt-60">
            <div className="text-4xl font-bold leading-none text-gold lg:text-5xl" data-animation="split" data-split="chars">
              {jewelry.craft.label}
            </div>
            <div className="tc mt-20 text-3xl font-bold" data-animation="moveUp">
              {jewelry.craft.heading}
            </div>
            <div className="mt-30 grid grid-cols-1 border-t border-ink/20 md:grid-cols-3">
              {jewelry.craft.points.map((p, i) => (
                <div
                  key={p}
                  data-animation="moveUp"
                  data-delay={0.1 + i * 0.1}
                  className="py-25 md:border-l md:border-ink/20 md:px-25 md:first:border-l-0 md:first:pl-0"
                >
                  <Label>{`0${i + 1}`}</Label>
                  <div className="tc mt-15 text-2xl font-bold leading-none lg:text-3xl">{p}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
