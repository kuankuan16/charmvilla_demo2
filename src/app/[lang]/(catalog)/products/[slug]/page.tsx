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
  const variants = product.variant ? all.filter((p) => p.variant?.group === product.variant?.group) : [];
  const scenes = product.scenes ?? [];
  // First screen: the key facts sit with the name and the button; the rest of the specification follows below.
  const keyFacts = product.facts.slice(0, 4), moreFacts = product.facts.slice(4);
  const related = [...siblings.filter((p) => p.slug !== slug), ...all.filter((p) => p.category !== product.category)].slice(0, 4);
  const schema = { "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.description, image: product.views.map((v) => new URL(v.image.src, siteUrl).href), brand: { "@type": "Brand", name: "CHARM VILLA" }, category: category.name, url: `${siteUrl}${productHref(product, lang)}` };
  return (
    <article className={`product-page product-page--${product.category}`} data-product={slug}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      {/* First screen after jakobsencopenhagen.com/en/products/holger-1-5-seater (user 2026-10-01: 「直接照這個一模一樣」): see ProductGallery
          and the product page block in globals.css. Name, text, key facts and the button are all readable without scrolling. */}
      <ProductGallery key={product.slug} name={product.name} views={product.views} intro={
        <div className="product-intro">
          {/* On Chinese pages the English name sits above the Chinese one; on English pages the name itself is English. */}
          {lang === "zh" && <p className="product-english">{product.english}</p>}
          <h1 className="tc" id="product-name">{product.name}</h1>
          {product.price && <p className="product-price">{formatPrice(product.price.amount, product.price.currency)}</p>}
          <p className="product-description tc">{product.description}</p>
          <dl className="product-keyfacts">{keyFacts.map((f) => <div key={f.label}><dt className="tc">{f.label}</dt><dd className="tc">{f.value}</dd></div>)}</dl>
          <p className="product-summary tc">{product.summary}</p>
          {variants.length > 1 && <fieldset className="product-variants"><legend className="tc">{product.category === "bags" ? t("選擇顏色", "Choose a colour") : t("同系列盒型", "Boxes in this series")}</legend><div>{variants.map((v) => <Link key={v.slug} href={productHref(v, lang)} aria-current={v.slug === slug ? "page" : undefined} className="tc">{v.variant?.label}</Link>)}</div></fieldset>}
          {isSellable(product) && <AddToCart product={product} />}
        </div>}>
        {(moreFacts.length > 0 || product.giftBox) && <section id="product-details" className="product-details" aria-labelledby="details-title">
          <h2 id="details-title" className="tc">{product.giftBox ? t("禮盒內容與規格", "Box contents and specifications") : t("材質與構成", "Materials and construction")}</h2>
          {moreFacts.length > 0 && <dl className="product-specs">{moreFacts.map((f) => <div key={f.label}><dt className="tc">{f.label}</dt><dd className="tc">{f.value}</dd></div>)}</dl>}
          {product.giftBox && <p className="product-image-note tc">{t("以禮盒販售；情境圖中的茶具、茶點與佈置物不包含在商品內。盒色與供應款式請以官方商店選項為準。", "Sold as a gift box. The teaware, sweets and props shown in scene photographs are not included. Box colour and available styles follow the options in the official store.")}</p>}
        </section>}
      </ProductGallery>
      {/* Every scene photograph lives here, laid out like a magazine spread: different sizes on one column grid, no captions;
          the story is one short block of text among them (user 2026-10-01: 「其他情境照都用雜誌排版風格在下面 layout」). */}
      <section className={`product-story product-story--${Math.min(scenes.length, 3)}`} aria-labelledby="story-title">
        <div className="product-story-text"><h2 id="story-title" className="tc">{product.story.title}</h2><p className="tc">{product.story.body}</p>{product.category === "tea" && <div className="product-awards">{tea.awards.map((a) => <Image key={a.image.src} src={a.image.src} alt={a.image.alt} width={a.image.w} height={a.image.h} />)}</div>}</div>
        {scenes.map((img, i) => <figure key={img.src} className={`product-story-image ${i < 4 ? `product-story-image--${i}` : `product-story-image--more product-story-image--more${(i - 4) % 4}`}`}><Picture img={img} animate={false} sizes={i === 3 ? "(min-width:768px) 15vw, 100vw" : "(min-width:768px) 50vw, 100vw"} /></figure>)}
      </section>
      <section className="product-related" aria-labelledby="related-title"><div className="product-related-heading"><h2 id="related-title" className="tc">{t("繼續觀看", "Keep looking")}</h2></div><div className="catalog-grid">{related.map((p, i) => <ProductCard key={p.slug} product={p} index={i} lang={lang} />)}</div></section>
    </article>
  );
}
