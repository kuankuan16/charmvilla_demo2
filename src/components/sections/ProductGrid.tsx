import Link from "next/link";
import { bagCatalog, productHref } from "@/data/catalog";
import { Arrow, Picture } from "@/components/ui";

// Every bag card opens its own shareable product page.
export default function ProductGrid() {
  return (
    <div className="container-x mt-40 grid grid-cols-1 gap-y-40 md:grid-cols-3 md:gap-x-20" data-product-grid="">
      {bagCatalog.map((product, i) => (
        <Link key={product.slug} href={productHref(product)} className="group block w-full text-left" aria-label={`瀏覽 ${product.name}`} data-animation="moveUp" data-delay={i * .1} data-product-card={product.slug}>
          <div className="relative aspect-[4/5] w-full bg-white"><Picture img={product.image} fill fit="contain" sizes="(min-width:768px) 30vw, 100vw" className="transition-transform duration-700 ease-out group-hover:scale-[1.03]" /></div>
          <div className="mt-20 flex items-baseline justify-between gap-15 border-t border-ink/20 pt-15"><h3 className="tc text-2xl font-bold leading-none lg:text-3xl">{product.variant?.label}</h3><span className="text-xs font-bold text-stone-deep">{product.english.split(" / ")[1]}</span></div>
          <div className="mt-10 flex items-center gap-8 text-xs font-bold"><Arrow /><span className="tc link-underline">探索商品</span><span className="ml-auto text-stone-deep">{product.views.length} VIEWS</span></div>
        </Link>
      ))}
    </div>
  );
}
