import Link from "next/link";
import { Picture } from "@/components/ui";
import { productHref, formatPrice, type Product } from "@/data/catalog";
import { imageFit } from "@/data/content";
import { translator, type Locale } from "@/i18n/config";

// `lang` is a prop (not the locale context) because the card is rendered from server pages as well as from the client browser.
export default function ProductCard({ product, index = 0, animated = false, lang }: { product: Product; index?: number; animated?: boolean; lang: Locale }) {
  const t = translator(lang);
  return (
    <article className="catalog-card" data-catalog-card={product.slug} data-animation={animated ? "moveUp" : undefined} data-delay={animated ? (index % 3) * .1 : undefined}>
      <Link href={productHref(product, lang)} aria-label={t(`瀏覽 ${product.name}`, `View ${product.name}`)}>
        <div className={`catalog-card-image catalog-card-image--${product.category} catalog-card-image--${product.image.cutout ? "cutout" : "scene"}`}><Picture img={product.image} fill fit={imageFit(product.image)} animate={animated} sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw" /></div>
        <h3 className="tc">{product.name}</h3>
        <p className="tc">{product.summary}</p>
        {product.price && <p className="catalog-card-price">{formatPrice(product.price.amount, product.price.currency)}</p>}
      </Link>
    </article>
  );
}
