import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { products, getProducts, findProduct, getCategory, getCategoryProducts, productHref, categoryHref, formatPrice } from "@/data/catalog";
import AddToCart from "@/components/cart/AddToCart";
import { getContent, type Img } from "@/data/content";
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
  // Scene rows: three images (one large, two small), then two (one large, one small), and so on.
  const storyRows: { kind: "a" | "b"; items: Img[] }[] = [];
  for (let i = 0, kind: "a" | "b" = "a"; i < scenes.length; kind = kind === "a" ? "b" : "a") { const n = kind === "a" ? 3 : 2; storyRows.push({ kind, items: scenes.slice(i, i + n) }); i += n; }
  // Portrait and square photographs are framed 4:5, landscape ones 3:2, very wide ones keep their own proportion.
  const shapeOf = (img: Img) => (img.w / img.h > 1.9 ? "banner" : img.w / img.h > 1.15 ? "wide" : "tall");
  const frameOf = (img: Img) => ({ banner: `${img.w} / ${img.h}`, wide: "3 / 2", tall: "4 / 5" })[shapeOf(img)];
  const storyText = <div className="product-story-text"><h2 id="story-title" className="tc">{product.story.title}</h2><p className="tc">{product.story.body}</p>{product.giftBox && <p className="product-image-note tc">{t("以禮盒販售；情境圖中的茶具、茶點與佈置物不包含在商品內。盒色與供應款式請以官方商店選項為準。", "Sold as a gift box. The teaware, sweets and props shown in scene photographs are not included. Box colour and available styles follow the options in the official store.")}</p>}{product.category === "tea" && <div className="product-awards">{tea.awards.map((a) => <Image key={a.image.src} src={a.image.src} alt={a.image.alt} width={a.image.w} height={a.image.h} />)}</div>}</div>;
  const related = [...siblings.filter((p) => p.slug !== slug), ...all.filter((p) => p.category !== product.category)].slice(0, 4);
  const schema = { "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.description, image: product.views.map((v) => new URL(v.image.src, siteUrl).href), brand: { "@type": "Brand", name: "CHARM VILLA" }, category: category.name, url: `${siteUrl}${productHref(product, lang)}` };
  return (
    <article className={`product-page product-page--${product.category}`} data-product={slug}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      {/* First screen after jakobsencopenhagen.com/en/products/holger-1-5-seater (user 2026-10-01: 「直接照這個一模一樣」): see ProductGallery
          and the product page block in globals.css. Name, text, every specification and the button all sit inside the first screen
          (user: 「所有資訊不需滑動才看到」); the right column ends with the button. */}
      <ProductGallery key={product.slug} name={product.name} views={product.views} intro={
        <div className="product-intro">
          {/* On Chinese pages the English name sits above the Chinese one; on English pages the name itself is English. */}
          {lang === "zh" && <p className="product-english">{product.english}</p>}
          <h1 className="tc" id="product-name">{product.name}</h1>
          {product.price && <p className="product-price">{formatPrice(product.price.amount, product.price.currency)}</p>}
          <p className="product-description tc">{product.description}</p>
          <dl className="product-keyfacts">{product.facts.map((f) => <div key={f.label}><dt className="tc">{f.label}</dt><dd className="tc">{f.value}</dd></div>)}</dl>
          <p className="product-summary tc">{product.summary}</p>
          {variants.length > 1 && <fieldset className="product-variants"><legend className="tc">{product.category === "bags" ? t("選擇顏色", "Choose a colour") : t("同系列盒型", "Boxes in this series")}</legend><div>{variants.map((v) => <Link key={v.slug} href={productHref(v, lang)} aria-current={v.slug === slug ? "page" : undefined} className="tc">{v.variant?.label}</Link>)}</div></fieldset>}
          {/* user 2026-10-01: every product page carries the ink add-to-bag button; a piece without a list price goes into the bag as "price on request" */}
          <AddToCart product={product} />
        </div>} />
      {/* Every scene photograph lives here, set like a magazine spread on the same 12 columns, after the reference page with many
          scenes (jakobsencopenhagen.com/en/products/stina-corner-sitting-island-3-seater; user 2026-10-01: 「圖片有大有小，不要都一樣大」):
          rows alternate — a large image on columns 7–12 with one or two small ones (2 columns each) at the far left, then a large
          image on columns 1–6 with a small one low on the right. No captions; the story is one short block of text in the first row. */}
      <section className={`product-story product-story--${Math.min(scenes.length, 3)}`} aria-labelledby="story-title">
        {storyRows.length === 0 && <div className="story-row story-row--text">{storyText}</div>}
        {storyRows.map((row, r) => <div key={r} className={`story-row story-row--${row.kind}`}>
          <figure className="story-fig story-fig--large" data-shape={shapeOf(row.items[0])} style={{ aspectRatio: frameOf(row.items[0]) }}><Picture img={row.items[0]} fill fit="cover" animate={false} sizes="(min-width:768px) 50vw, 100vw" /></figure>
          <div className="story-side">
            {row.items.length > 1 && <div className="story-smalls">{row.items.slice(1).map((img) => <figure key={img.src} className="story-fig story-fig--small" data-shape={shapeOf(img)} style={{ aspectRatio: frameOf(img) }}><Picture img={img} fill fit="cover" animate={false} sizes="(min-width:768px) 17vw, 50vw" /></figure>)}</div>}
            {r === 0 && storyText}
          </div>
        </div>)}
      </section>
      <section className="product-related" aria-labelledby="related-title"><div className="product-related-heading"><h2 id="related-title" className="tc">{t("繼續觀看", "Keep looking")}</h2></div><div className="catalog-grid">{related.map((p, i) => <ProductCard key={p.slug} product={p} index={i} lang={lang} />)}</div></section>
    </article>
  );
}
