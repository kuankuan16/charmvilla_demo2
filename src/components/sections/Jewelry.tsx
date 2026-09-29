import Link from "next/link";
import { jewelryCatalog, productHref } from "@/data/catalog";
import { jewelry } from "@/data/content";
import { SectionIndex, Heading, Label, Picture } from "@/components/ui";

export default function Jewelry() {
  return (
    <section id="jewelry" className="container-x relative bg-white pt-30 pb-100 laptop:pb-180">
      <div className="grid grid-cols-12 gap-x-20">
        <div className="col-span-12 lg:col-span-6">
          <SectionIndex n={jewelry.index} />
          <Label className="mt-20"><span className="tc">{jewelry.kicker}</span></Label>
        </div>
        <div className="col-span-12 mt-25 lg:col-span-6 lg:mt-0">
          <Heading className="tc text-3xl lg:text-4xl">{jewelry.heading}</Heading>
          <div className="mt-10 text-xs font-bold text-stone-deep">{jewelry.headingEn}</div>
        </div>
      </div>

      <ul aria-label="小金魚金飾商品清單" className="mt-40 grid grid-cols-1 gap-x-20 gap-y-50 md:grid-cols-2 laptop:grid-cols-3" data-jewelry-products="">
        {jewelry.items.map((product, i) => (
          <li key={product.n} data-jewelry-product={product.n}>
            <article><Link href={productHref(jewelryCatalog[i])} className="group block" aria-label={`瀏覽 ${product.title}`}>
              <Picture img={product.image} sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw" animate={false} />
              <div className="mt-20 flex items-baseline gap-15 border-t border-ink/20 pt-15">
                <span className="text-xs font-bold text-stone-deep">{product.n}</span>
                <h3 className="tc text-xl font-bold leading-small lg:text-2xl">{product.title}</h3>
              </div>
              <p className="tc mt-12 text-sm leading-body text-ink/70">{product.desc}</p>
            <span className="tc mt-15 inline-flex items-center gap-20 text-xs font-bold group-hover:underline">探索商品 ↗</span></Link></article>
          </li>
        ))}
      </ul>
      <div className="mt-35 text-right"><Link href="/collections/jewelry" className="tc text-xs font-bold link-underline">瀏覽全部金飾 ↗</Link></div>

      <div className="mt-60 border-t border-ink/20 pt-30">
        <div className="text-xs font-bold text-gold">{jewelry.craft.label}</div>
        <div className="tc mt-15 text-2xl font-bold">{jewelry.craft.heading}</div>
        <ul className="tc mt-20 flex flex-wrap gap-x-40 gap-y-10 text-sm">
          {jewelry.craft.points.map((point) => <li key={point}>{point}</li>)}
        </ul>
      </div>
    </section>
  );
}
