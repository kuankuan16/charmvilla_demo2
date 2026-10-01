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
  // Portrait and square photographs are framed 4:5, landscape ones 3:2, very wide ones keep their own proportion.
  const shapeOf = (img: Img) => (img.w / img.h > 1.9 ? "banner" : img.w / img.h > 1.15 ? "wide" : "tall");
  const frameOf = (img: Img) => ({ banner: `${img.w} / ${img.h}`, wide: "3 / 2", tall: "4 / 5" })[shapeOf(img)];
  // After jakobsencopenhagen.com/en/products/karla: the first scenes run down the information column; the others close the page
  // in rows on the same 12 columns (a portrait takes 4 columns, a landscape 6). The column takes one to three, as few as leave full rows.
  const spanOf = (img: Img) => (shapeOf(img) === "tall" ? 4 : 6);
  const fullRows = (list: Img[]) => { let row = 0; for (const img of list) { row += spanOf(img); if (row > 12) return false; if (row === 12) row = 0; } return row === 0; };
  const inColumn = scenes.length <= 3 ? scenes.length : [1, 2, 3].find((n) => fullRows(scenes.slice(n))) ?? 2;
  const columnScenes = scenes.slice(0, inColumn), rowScenes = scenes.slice(inColumn);
  const storyText = <div className="product-story-text"><h2 id="story-title" className="tc">{product.story.title}</h2><p className="tc">{product.story.body}</p>{product.giftBox && <p className="product-image-note tc">{t("以禮盒販售；情境圖中的茶具、茶點與佈置物不包含在商品內。盒色與供應款式請以官方商店選項為準。", "Sold as a gift box. The teaware, sweets and props shown in scene photographs are not included. Box colour and available styles follow the options in the official store.")}</p>}{product.category === "tea" && <div className="product-awards">{tea.awards.map((a) => <Image key={a.image.src} src={a.image.src} alt={a.image.alt} width={a.image.w} height={a.image.h} />)}</div>}</div>;
  const related = [...siblings.filter((p) => p.slug !== slug), ...all.filter((p) => p.category !== product.category)].slice(0, 4);
  const schema = { "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.description, image: product.views.map((v) => new URL(v.image.src, siteUrl).href), brand: { "@type": "Brand", name: "CHARM VILLA" }, category: category.name, url: `${siteUrl}${productHref(product, lang)}` };
  return (
    <article className={`product-page product-page--${product.category}`} data-product={slug}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      {/* First screen after jakobsencopenhagen.com/en/products/holger-1-5-seater (user 2026-10-01: 「直接照這個一模一樣」): see ProductGallery
          and the product page block in globals.css. Name, text, every specification and the button all sit inside the first screen
          (user: 「所有資訊不需滑動才看到」). Under the button the same column carries the story and the first scene photographs, at the
          width of the information above them, while the product image on the left stays in place (after …/products/karla;
          user 2026-10-01: 「右側的情境照應該要對齊上面資訊欄的欄位，左邊商品圖會暫時固定」). No captions. */}
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
        </div>}>
        {storyText}
        {columnScenes.map((img) => <figure key={img.src} className="scene-fig" data-shape={shapeOf(img)} style={{ aspectRatio: frameOf(img) }}><Picture img={img} fill fit="cover" animate={false} sizes="(min-width:1280px) 31vw, (min-width:768px) 38vw, 100vw" /></figure>)}
      </ProductGallery>
      {rowScenes.length > 0 && <section className="product-scenes" aria-label={t("情境照", "In use")}>
        {rowScenes.map((img) => <figure key={img.src} className="scene-fig" data-shape={shapeOf(img)} style={{ aspectRatio: frameOf(img) }}><Picture img={img} fill fit="cover" animate={false} sizes={shapeOf(img) === "tall" ? "(min-width:768px) 31vw, 100vw" : "(min-width:768px) 46vw, 100vw"} /></figure>)}
      </section>}
      <section className="product-related" aria-labelledby="related-title"><div className="product-related-heading"><h2 id="related-title" className="tc">{t("繼續觀看", "Keep looking")}</h2></div><div className="catalog-grid">{related.map((p, i) => <ProductCard key={p.slug} product={p} index={i} lang={lang} />)}</div></section>
    </article>
  );
}
