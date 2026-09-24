// Section 5 — Teaware & craft. Two landscape photos over stacked bold lists on a stone ground
// (reference: "5: Do's & Don'ts" two-column lists). Server component; content from @/data/content only.
import { teaware } from "@/data/content";
import { SectionIndex, Heading, Label, Picture } from "@/components/ui";

export default function Teaware() {
  return (
    <section id="teaware" className="container-x relative border-t border-ink/20 bg-white py-100">
      <div className="grid grid-cols-12 gap-x-16 lg:gap-x-20">
        <div className="col-span-12 lg:col-span-5">
          <SectionIndex n={teaware.index} />
          {/* `text-ink!`: Label defaults to text-stone-deep, which Tailwind emits later in the sheet, so a plain
              `text-ink` would lose; the important modifier makes the ink label win on the stone ground. */}
          <Label className="mt-20 text-ink!">
            <span className="tc">{teaware.kicker}</span>
          </Label>
          <Heading className="tc mt-20 max-w-350 text-3xl lg:text-4xl">{teaware.heading}</Heading>
          <div className="mt-10 text-xs font-bold text-ink/60">{teaware.headingEn}</div>
        </div>

        <div className="col-span-12 mt-40 grid grid-cols-1 gap-x-30 gap-y-50 md:grid-cols-2 lg:col-span-7 lg:mt-0">
          {[teaware.left, teaware.right].map((col, ci) => (
            <div key={col.label}>
              <div className="relative aspect-[3/2] w-full" data-animation="clip" data-delay={ci * 0.2}>
                <Picture img={col.image} fill className="h-full w-full" sizes="(min-width:1024px) 30vw, 100vw" />
              </div>
              <Label className="mt-25 text-ink!">
                <span className="tc">{col.label}</span>
              </Label>
              <ul className="mt-15">
                {col.items.map((it, i) => (
                  <li
                    key={it}
                    data-animation="moveUp"
                    data-delay={0.1 + i * 0.08}
                    className="tc border-t border-ink/30 py-12 text-xl font-bold leading-tight last:border-b lg:text-2xl"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
