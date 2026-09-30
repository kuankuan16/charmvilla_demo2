// Section 2 — Leather bag. E-commerce logic: one card per colour with a large image; the other angles
// are available on its product page (ProductGrid). White ground per the user's direction (2026-09-24).
import { bags } from "@/data/content";
import { Heading, Label, Btn } from "@/components/ui";
import ProductGrid from "@/components/sections/ProductGrid";

export default function Bags() {
  return (
    <section id="bags" className="relative bg-white pt-30 pb-100 laptop:pb-180">
      <div className="container-x grid grid-cols-12 items-start gap-x-16 lg:gap-x-20">
        <div className="col-span-12 lg:col-span-6">
          <Label><span className="tc">{bags.kicker}</span></Label>
        </div>
        <div className="col-span-12 mt-20 lg:col-span-6 lg:mt-0">
          <Heading className="text-3xl lg:text-4xl">{bags.heading}</Heading>
          <div className="tc mt-10 text-xl font-bold" data-animation="moveUp">{bags.product}</div>
          <div className="mt-15 flex flex-wrap gap-x-25 gap-y-6" data-animation="moveUp" data-delay="0.1">
            {bags.facts.map((f) => <Label key={f}><span className="tc">{f}</span></Label>)}
          </div>
          <div className="tc mt-10 text-xs font-bold text-ink/70" data-animation="moveUp" data-delay="0.15">{bags.patent}</div>
        </div>
      </div>

      <ProductGrid />

      <div className="container-x mt-50 flex justify-center">
        <Btn href={bags.cta.href}><span className="tc">{bags.cta.label}</span></Btn>
      </div>
    </section>
  );
}
