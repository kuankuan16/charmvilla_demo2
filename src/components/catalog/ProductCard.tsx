import Link from "next/link";
import { Picture } from "@/components/ui";
import { productHref, formatPrice, type Product } from "@/data/catalog";
import { imageFit } from "@/data/content";
import { translator, type Locale } from "@/i18n/config";

// `lang` is a prop (not the locale context) because the card is rendered from server pages as well as from the client browser.
// The cover is the studio photograph on the light ground; the scene appears only while the card is hovered (user 2026-10-01).
// `caption`: a grey line under the name (the category, as under STINA's "Unsere Neuheiten" cards) with the price after it; without it the
// price stands alone, as on the collection pages.
export default function ProductCard({ product, index = 0, animated = false, lang, caption }: { product: Product; index?: number; animated?: boolean; lang: Locale; caption?: string }) {
  const t = translator(lang);
  const price = product.price && <>{formatPrice(product.price.amount, product.price.currency)}{product.soldOut && <span className="catalog-card-soldout tc">{t("售罄", "Sold out")}</span>}</>;
  return (
    <article className="catalog-card" data-catalog-card={product.slug} data-animation={animated ? "moveUp" : undefined} data-delay={animated ? (index % 3) * .1 : undefined}>
      <Link href={productHref(product, lang)} aria-label={t(`瀏覽 ${product.name}`, `View ${product.name}`)}>
        <div className={`catalog-card-image catalog-card-image--${product.category} catalog-card-image--${product.image.cutout ? "cutout" : "scene"}`}><Picture img={product.image} fill fit={imageFit(product.image)} animate={animated} sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw" />{product.hoverImage && <div className="catalog-card-hover" aria-hidden="true"><Picture img={product.hoverImage} fill fit="cover" animate={false} sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw" /></div>}</div>
        <h3 className="tc">{product.name}</h3>
        {caption ? <p className="catalog-card-caption"><span className="tc">{caption}</span>{price && <span className="catalog-card-caption-price"> · {price}</span>}</p> : product.price && <p className="catalog-card-price">{price}</p>}
      </Link>
    </article>
  );
}
