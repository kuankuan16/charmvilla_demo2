import { tea } from "@/data/content";
import { SectionIndex, Heading, Label, Picture } from "@/components/ui";

export default function Tea() {
  return (
    <section id="tea" className="relative bg-white pt-30 pb-100 laptop:pb-180">
      <div className="container-x grid grid-cols-12 gap-x-20">
        <div className="col-span-12 lg:col-span-6">
          <SectionIndex n={tea.index} />
          <Label className="mt-20"><span className="tc">{tea.kicker}</span></Label>
        </div>
        <div className="col-span-12 mt-25 lg:col-span-6 lg:mt-0">
          <Heading className="tc text-3xl lg:text-4xl">{tea.heading}</Heading>
          <div className="mt-10 text-xs font-bold text-stone-deep">{tea.headingEn}</div>
          <p className="tc mt-20 max-w-550 text-base leading-body">{tea.craft}</p>
        </div>
      </div>

      <ul aria-label="小金魚茶包商品清單" className="container-x mt-40 grid grid-cols-1 gap-x-20 gap-y-50 md:grid-cols-2 laptop:grid-cols-3" data-tea-products="">
        {tea.cards.map((product, i) => (
          <li key={product.code} data-tea-product={product.code}>
            <article>
              <Picture img={product.image} sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw" animate={false} />
              <div className="mt-20 flex items-baseline gap-15 border-t border-ink/20 pt-15">
                <span className="text-xs font-bold text-stone-deep">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="tc text-xl font-bold leading-small lg:text-2xl">{product.title}</h3>
              </div>
              <dl className="tc mt-15 grid grid-cols-2 gap-20 text-xs">
                <div><dt className="text-stone-deep">茶底</dt><dd className="mt-6 text-base font-medium">{product.tea}</dd></div>
                <div><dt className="text-stone-deep">風味</dt><dd className="mt-6 text-base font-medium">{product.flower}</dd></div>
              </dl>
            </article>
          </li>
        ))}
      </ul>

      <div className="container-x mt-60" data-tea-awards="">
        <div className="border-t border-ink/20 pt-30">
          <Label><span className="tc">{tea.honours[0]}</span></Label>
          <ul className="mt-30 grid gap-x-40 gap-y-30 md:grid-cols-2">
            {tea.awards.map((award) => (
              <li key={award.image.src} className="flex items-center gap-20">
                <div className="relative h-100 w-140 shrink-0 lg:h-120 lg:w-180">
                  <Picture img={award.image} fill fit="contain" animate={false} sizes="180px" />
                </div>
                <p className="tc text-xs font-medium leading-body lg:text-base">{award.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
