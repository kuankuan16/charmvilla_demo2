import Link from "next/link";
import { findProduct, productHref } from "@/data/catalog";
import { Heading, Picture } from "@/components/ui";
import { imageFit } from "@/data/content";
import { localeHref, translator, type Locale } from "@/i18n/config";

// A single cross-category selection; full collections live on their own pages.
const slugs = [
  "braided-leather-bag-white",
  "pearl-chain-goldfish-earrings",
  "ginkgo-teaspoon-gift-box",
  "reunion-paulownia-gift-box",
  "bird-chopstick-rest",
  "diamond-goldfish-earrings",
];

export default function FeaturedProducts({ lang }: { lang: Locale }) {
  const t = translator(lang);
  const selected = slugs.map(slug => findProduct(slug, lang)!);
  return <section id="featured" className="featured-products" aria-labelledby="featured-heading">
    <header className="featured-heading">
      <div><p className="catalog-eyebrow">SELECTED OBJECTS</p><Heading className="tc" as="h2"><span id="featured-heading">{t("推薦商品精選", "Featured pieces")}</span></Heading></div>
      <p className="tc">{t("循著材質與線條，選出值得細看的作品。從肩上、耳畔到餐桌，讓藝術走進每天的片刻。", "Chosen by material and line: pieces worth a closer look. From the shoulder and the ear to the table, art enters the moments of each day.")}</p>
    </header>
    <div className="featured-grid">
      {selected.map((product) => <article key={product.slug} data-featured-product={product.slug}>
        <Link href={productHref(product, lang)} aria-label={t(`欣賞 ${product.name}`, `View ${product.name}`)}>
          <div className={`featured-image featured-image--${(product.featuredImage ?? product.image).cutout ? "cutout" : "scene"}`}><Picture img={product.featuredImage ?? product.image} fill fit={imageFit(product.featuredImage ?? product.image)} animate={false} sizes="(min-width:768px) 30vw, 90vw" /></div>
          <div className="featured-caption"><h3 className="tc">{product.name}</h3></div>
          <p className="tc">{product.summary}</p>
        </Link>
      </article>)}
    </div>
    <div className="featured-more"><Link href={localeHref(lang, "/collections/all")} className="tc link-underline">{t("欣賞全部作品", "View all pieces")}</Link></div>
  </section>;
}
