import Link from "next/link";
import { teaCatalog, productHref } from "@/data/catalog";
import { tea } from "@/data/content";
import { Heading, Label, Picture } from "@/components/ui";

export default function Tea() {
  return (
    <section id="tea" className="relative bg-white pt-30 pb-100 laptop:pb-180">
      <div className="container-x grid grid-cols-12 gap-x-20">
        <div className="col-span-12 lg:col-span-6">
          <Label><span className="tc">{tea.kicker}</span></Label>
        </div>
        <div className="col-span-12 mt-25 lg:col-span-6 lg:mt-0">
          <Heading className="tc text-3xl lg:text-4xl">{tea.heading}</Heading>
          <div className="mt-10 text-xs font-bold text-stone-deep">{tea.headingEn}</div>
          <p className="tc mt-20 max-w-550 text-base leading-body">{tea.craft}</p>
        </div>
      </div>

      <ul aria-label="小金魚茶包禮盒清單" className="container-x mt-40 grid grid-cols-1 gap-x-20 gap-y-50 md:grid-cols-2 laptop:grid-cols-3" data-tea-products="">
        {teaCatalog.map((product, i) => (
          <li key={product.slug} data-tea-product={product.slug}>
            <article><Link href={productHref(product)} className="group block" aria-label={`瀏覽 ${product.name}`}>
              <Picture img={product.image} sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw" animate={false} />
              <div className="mt-20 flex items-baseline gap-15 pt-15">
                <span className="text-xs font-bold text-stone-deep">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="tc text-xl font-bold leading-small lg:text-2xl">{product.name}</h3>
              </div>
              <p className="tc mt-15 text-base">{product.summary}</p>
            <span className="tc mt-15 inline-flex items-center gap-20 text-xs font-bold group-hover:underline">欣賞作品</span></Link></article>
          </li>
        ))}
      </ul>
      <div className="container-x mt-35 text-right"><Link href="/collections/tea" className="tc text-xs font-bold link-underline">瀏覽全部茶包禮盒</Link></div>

    </section>
  );
}
