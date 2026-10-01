import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { products, getProducts, findProduct, getCategory, getCategoryProducts, productHref, categoryHref, isSellable, formatPrice } from "@/data/catalog";
import AddToCart from "@/components/cart/AddToCart";
import { getContent } from "@/data/content";
import { Picture } from "@/components/ui";
import ProductGallery from "@/components/catalog/ProductGallery";
import ProductCard from "@/components/catalog/ProductCard";
import { alternatesFor, defaultLocale, isLocale, siteUrl, translator } from "@/i18n/config";

type Props = { params: Promise<{ lang: string; slug: string }> };
// No `dynamicParams = false`: an unknown slug must reach the page so notFound() can answer with the localized 404.
export const generateStaticParams = () => products.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = isLocale(raw) ? raw : defaultLocale;
  const t = translator(lang);
  const product = findProduct(slug, lang);
  if (!product) return { title: t("找不到商品｜CHARM VILLA", "Piece not found | CHARM VILLA") };
  const title = t(`${product.name}｜CHARM VILLA`, `${product.name} | CHARM VILLA`);
  return { title, description: product.description, alternates: alternatesFor(lang, productHref(product)), openGraph: { title, description: product.summary, images: [{ url: product.image.src, alt: product.image.alt }] } };
}

export default async function ProductPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const t = translator(lang);
  const product = findProduct(slug, lang);
  if (!product) notFound();
  const all = getProducts(lang);
  const { tea } = getContent(lang);
  const category = getCategory(product.category, lang)!;
  const siblings = getCategoryProducts(product.category, lang);
  const position = siblings.findIndex((p) => p.slug === slug);
  const previous = siblings[(position - 1 + siblings.length) % siblings.length];
  const next = siblings[(position + 1) % siblings.length];
  const variants = product.variant ? all.filter((p) => p.variant?.group === product.variant?.group) : [];
  const related = [...siblings.filter((p) => p.slug !== slug), ...all.filter((p) => p.category !== product.category)].slice(0, 4);
  const schema = { "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.description, image: product.views.map((v) => new URL(v.image.src, siteUrl).href), brand: { "@type": "Brand", name: "CHARM VILLA" }, category: category.name, url: `${siteUrl}${productHref(product, lang)}` };
  return (
    <article className={`product-page product-page--${product.category}`} data-product={slug}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <nav className="catalog-breadcrumb tc" aria-label={t("麵包屑", "Breadcrumb")}><Link href={categoryHref("all", lang)}>{t("全部商品", "All pieces")}</Link><span aria-hidden="true">/</span><Link href={categoryHref(category.id, lang)}>{category.name}</Link><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span></nav>
      <section className="product-hero" aria-labelledby="product-name">
        {/* The uppercase English label accompanies the Chinese name; on English pages the name itself is English, so it is not repeated. */}
        <div className="product-intro"><p className="catalog-eyebrow">{category.en}</p>{lang === "zh" && <p className="product-english">{product.english}</p>}<h1 className="tc" id="product-name">{product.name}</h1>{product.price && <p className="product-price">{formatPrice(product.price.amount, product.price.currency)}</p>}<p className="product-summary tc">{product.summary}</p><div className="product-intro-rule" /><p className="product-description tc">{product.description}</p>
          {variants.length > 1 && <fieldset className="product-variants"><legend className="tc">{product.category === "bags" ? t("選擇顏色", "Choose a colour") : t("同系列盒型", "Boxes in this series")}</legend><div>{variants.map((v) => <Link key={v.slug} href={productHref(v, lang)} aria-current={v.slug === slug ? "page" : undefined} className="tc">{v.variant?.label}</Link>)}</div></fieldset>}
          {isSellable(product) && <AddToCart product={product} />}
          <a href="#product-details" className="product-detail-link tc">{t("往下閱讀商品細節", "Read the details below")} <span aria-hidden="true">↓</span></a>
        </div>
        <ProductGallery key={product.slug} name={product.name} views={product.views} note={product.giftBox ? t("以禮盒販售；情境圖中的茶具、茶點與佈置物不包含在商品內。盒內內容請見下方規格，盒色與供應款式請以官方商店選項為準。", "Sold as a gift box. The teaware, sweets and props shown in scene photographs are not included. See the specifications below for what is in the box; box colour and available styles follow the options in the official store.") : undefined} />
      </section>
      <section id="product-details" className="product-details" aria-labelledby="details-title"><div className="product-section-heading"><p className="catalog-eyebrow">01 / THE DETAILS</p><h2 id="details-title" className="tc">{product.giftBox ? t("禮盒內容與規格", "Box contents and specifications") : t("材質與構成", "Materials and construction")}</h2><p className="tc">{product.summary}</p></div><dl className="product-specs">{product.facts.map((f) => <div key={f.label}><dt className="tc">{f.label}</dt><dd className="tc">{f.value}</dd></div>)}</dl></section>
      <section className={`product-story ${product.story.image ? "product-story--image" : ""}`} aria-labelledby="story-title"><div><p className="catalog-eyebrow">02 / IN EVERYDAY LIFE</p><h2 id="story-title" className="tc">{product.story.title}</h2><p className="tc">{product.story.body}</p>{product.category === "tea" && <div className="product-awards">{tea.awards.map((a) => <Image key={a.image.src} src={a.image.src} alt={a.image.alt} width={a.image.w} height={a.image.h} />)}</div>}</div>{product.story.image && <figure><Picture img={product.story.image} animate={false} sizes="(min-width:1024px) 60vw, 100vw" /><figcaption className="tc">{product.name} · {t("作品情境", "in context")}</figcaption></figure>}</section>
      <section className="product-related" aria-labelledby="related-title"><div className="product-related-heading"><div><p className="catalog-eyebrow">KEEP EXPLORING</p><h2 id="related-title" className="tc">{t("繼續觀看", "Keep looking")}</h2></div><Link href={categoryHref(category.id, lang)} className="tc">{t(`回到${category.name}清單`, `Back to ${category.name}`)}</Link></div><div className="catalog-grid">{related.map((p, i) => <ProductCard key={p.slug} product={p} index={i} lang={lang} />)}</div></section>
      <nav className="product-next-prev" aria-label={t("上一款與下一款商品", "Previous and next piece")}><Link href={productHref(previous, lang)}><span>← PREVIOUS</span><strong className="tc">{previous.name}</strong></Link><Link href={productHref(next, lang)}><span>NEXT →</span><strong className="tc">{next.name}</strong></Link></nav>
      <div className="product-dock"><Link href={categoryHref(category.id, lang)} className="product-dock-back tc">← <span>{t(`返回${category.name}`, `Back to ${category.name}`)}</span></Link><span className="product-dock-name tc">{product.name}</span>{isSellable(product) && <AddToCart product={product} compact />}</div>
    </article>
  );
}
