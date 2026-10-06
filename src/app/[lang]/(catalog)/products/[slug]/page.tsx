import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { products, getProducts, findProduct, getCategory, getCategoryProducts, productHref, formatPrice } from "@/data/catalog";
import AddToCart from "@/components/cart/AddToCart";
import { getContent, type Img } from "@/data/content";
import { Picture } from "@/components/ui";
import ProductGallery from "@/components/catalog/ProductGallery";
import ProductCard from "@/components/catalog/ProductCard";
import { alternatesFor, defaultLocale, isLocale, siteUrl, translator } from "@/i18n/config";

// The other categories by closeness, for 繼續觀看 when a category has fewer than four other pieces.
const nearest: Record<string, string[]> = {
  tea: ["scents", "abundance", "wood-fired", "jewelry", "bags"],
  scents: ["wood-fired", "abundance", "tea", "jewelry", "bags"],
  "wood-fired": ["scents", "abundance", "tea", "jewelry", "bags"],
  abundance: ["tea", "scents", "wood-fired", "jewelry", "bags"],
  jewelry: ["bags", "tea", "scents", "abundance", "wood-fired"],
  bags: ["jewelry", "tea", "scents", "abundance", "wood-fired"],
};

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
  return { title, description: product.description, alternates: alternatesFor(lang, productHref(product)), openGraph: { title, description: product.description, images: [{ url: product.image.src, alt: product.image.alt }] } };
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
  // Exactly three scenes follow …/products/liam and …/products/joana-longchair-xl-2-seater instead (user 2026-10-01: 「版型參考 liam」,
  // 「情境照３張的版型」＋ the Joana page): one in the column, then a large one under the product image; beside it, from the left
  // edge of the information column, the story text and under that a small one, which stays in view while the large one passes.
  const pair = scenes.length === 3 ? scenes.slice(1) : null;
  const inColumn = pair ? 1 : scenes.length <= 3 ? scenes.length : [1, 2, 3].find((n) => fullRows(scenes.slice(n))) ?? 2;
  const columnScenes = scenes.slice(0, inColumn), rest = pair ? [] : scenes.slice(inColumn);
  // Portraits that close the page in threes make a spread like the homepage's craft section, after the jakobsencopenhagen.com/en/
  // homepage (user 2026-10-01: 「商品內頁如果有多圖的情況也是用相同的邏輯處理」): the first one large at the right, the other two
  // small at the left, where they stay under the header while the large one passes. Anything else keeps its rows.
  const inSpreads = rest.length > 0 && rest.length % 3 === 0 && rest.every((img) => shapeOf(img) === "tall");
  const spreads = inSpreads ? rest.flatMap((_, i) => (i % 3 ? [] : [rest.slice(i, i + 3)])) : [], rowScenes = inSpreads ? [] : rest;
  // 白包頁：故事文字放在第一組的兩張小圖正上方，不放在資訊欄（使用者 2026-10-06）
  const textAboveSmalls = product.slug === "braided-leather-bag-white" && spreads.length > 0;
  const storyText = <div className="product-story-text"><h2 id="story-title" className="tc">{product.story.title}</h2><p className="tc">{product.story.body}</p>{product.category === "tea" && <div className="product-awards">{tea.awards.map((a) => <Image key={a.image.src} src={a.image.src} alt={a.image.alt} width={a.image.w} height={a.image.h} />)}</div>}</div>;
  // Specifications under the button, in their own section (user 2026-10-05: the reference's spacing and type, 「按鈕移到規格上面」;
  // facts only — 「不寫形容文案，清楚呈現商品規格與內容物等消費者必須要第一時間知道的訊息」).
  const specTitle = product.category === "tea" ? t("禮盒內容與規格", "Gift box contents and details") : product.category === "bags" ? t("材質與做工", "Materials and construction") : t("商品規格", "Product details");
  const specs = <section className="product-specs" aria-labelledby="specs-title">
    <h2 id="specs-title" className="tc">{specTitle}</h2>
    <dl className="product-keyfacts">{product.facts.map((f) => <div key={f.label}><dt className="tc">{f.label}</dt><dd className="tc">{f.value}</dd></div>)}</dl>
    {product.giftBox && <p className="product-image-note tc">{t("情境圖中的茶具、茶點與佈置物僅作展示，禮盒內容請見上方規格；盒色與供應款式請以官方商店選項為準。", "Teaware, sweets and decorative props shown in the photos are not included. Please refer to the box contents listed above. Box color and available styles follow the options in the official store.")}</p>}
  </section>;
  // How to brew (tea gift boxes except the fruit & herbal tea box) and the Show more! concept (bags): their own sections after the specifications,
  // in the same row style (user 2026-10-06, guide §4 and §5).
  const brew = product.brew && <section className="product-specs product-brew" aria-labelledby="brew-title">
    <h2 id="brew-title" className="tc">{product.brew.title}</h2>
    <dl className="product-keyfacts">{product.brew.steps.map((s, i) => <div key={s.title}><dt className="tc">{i + 1}. {s.title}</dt><dd className="tc">{s.text}</dd></div>)}</dl>
  </section>;
  const concept = product.concept && <section className="product-specs product-concept" aria-labelledby="concept-title">
    <h2 id="concept-title" className="tc">{product.concept.title}</h2>
    <p className="product-slogan" lang="en">&ldquo;{product.concept.slogan}&rdquo;</p>
    <p className="tc">{product.concept.body}</p>
  </section>;
  // 繼續觀看 (user 2026-10-05: 「優先推薦同一類別的商品，不夠的話再推薦其他類別」): the pieces of this category that follow this one
  // (wrapping round), then the nearest categories, one piece from each in turn, so a short category is not followed by four bags.
  const at = siblings.findIndex((p) => p.slug === slug);
  const sameCategory = [...siblings.slice(at + 1), ...siblings.slice(0, Math.max(at, 0))];
  const others = (nearest[product.category] ?? []).map((id) => all.filter((p) => p.category === id));
  const fill = Array.from({ length: Math.max(0, ...others.map((l) => l.length)) }, (_, i) => others.flatMap((l) => l[i] ?? []));
  const related = [...sameCategory, ...fill.flat()].slice(0, 4);
  const schema = { "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.description, image: product.views.map((v) => new URL(v.image.src, siteUrl).href), brand: { "@type": "Brand", name: "CHARM VILLA" }, category: category.name, url: `${siteUrl}${productHref(product, lang)}`,
    // Offer only where the official list price is known; availability only where the official store says sold out (catalog.ts rule).
    ...(product.price && { offers: { "@type": "Offer", price: product.price.amount, priceCurrency: product.price.currency, url: `${siteUrl}${productHref(product, lang)}`, ...(product.soldOut && { availability: "https://schema.org/SoldOut" }) } }) };
  return (
    <article className={`product-page product-page--${product.category}`} data-product={slug}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      {/* First screen after jakobsencopenhagen.com/en/products/holger-1-5-seater (user 2026-10-01: 「直接照這個一模一樣」): see ProductGallery
          and the product page block in globals.css. Name, summary line, price, text and the button sit inside the first screen
          (user: 「所有資訊不需滑動才看到」); since 2026-10-05 the specifications follow the button in their own section, at the
          reference's spacing (user's choice). Under them the same column carries the story and the first scene photographs, at the
          width of the information above them, while the product image on the left stays in place (after …/products/karla;
          user 2026-10-01: 「右側的情境照應該要對齊上面資訊欄的欄位，左邊商品圖會暫時固定」). No captions. */}
      <ProductGallery key={product.slug} name={product.name} views={product.views} intro={
        <div className="product-intro">
          {/* On Chinese pages the English name sits above the Chinese one; on English pages the name itself is English. */}
          {lang === "zh" && <p className="product-english">{product.english}</p>}
          <h1 className="tc" id="product-name">{product.name}</h1>
          {/* the one-line descriptive copy under the name is gone site-wide (user 2026-10-05: 「刪除全站這層形容文案，並將重要的數字訊息整合到下面的 spec」) */}
          {product.price && <p className="product-price">{product.giftBox?.choices?.some((c) => c.price && c.price !== product.price?.amount) ? t(`${formatPrice(product.price.amount, product.price.currency)} 起`, `From ${formatPrice(product.price.amount, product.price.currency)}`) : formatPrice(product.price.amount, product.price.currency)}{product.soldOut && <span className="product-soldout tc">{t("售罄", "Sold out")}</span>}</p>}
          <p className="product-description tc">{product.description}</p>
          {variants.length > 1 && <fieldset className="product-variants"><legend className="tc">{product.category === "bags" ? t("選擇顏色", "Choose a color") : t("同系列盒型", "Boxes in this series")}</legend><div>{variants.map((v) => <Link key={v.slug} href={productHref(v, lang)} aria-current={v.slug === slug ? "page" : undefined} className="tc">{v.variant?.label}</Link>)}</div></fieldset>}
          {/* user 2026-10-01: every product page carries the ink add-to-bag button; a piece without a list price goes into the bag as "price on request" */}
          <AddToCart product={product} />
        </div>}>
        {specs}
        {brew}
        {concept}
        {!pair && !textAboveSmalls && storyText}
        {columnScenes.map((img) => <figure key={img.src} className="scene-fig" data-shape={shapeOf(img)} style={{ aspectRatio: frameOf(img) }}><Picture img={img} fill fit="cover" animate={false} sizes="(min-width:1280px) 31vw, (min-width:768px) 38vw, 100vw" /></figure>)}
      </ProductGallery>
      {pair && <section className="product-pair" data-large={shapeOf(pair[0])} aria-labelledby="story-title">
        <figure className="scene-fig product-pair-large" data-shape={shapeOf(pair[0])} style={{ aspectRatio: frameOf(pair[0]) }}><Picture img={pair[0]} fill fit="cover" animate={false} sizes="(min-width:768px) 46vw, 100vw" /></figure>
        <div className="product-pair-side">{storyText}<figure className="scene-fig" data-shape={shapeOf(pair[1])} style={{ aspectRatio: frameOf(pair[1]) }}><Picture img={pair[1]} fill fit="cover" animate={false} sizes="(min-width:768px) 16vw, 100vw" /></figure></div>
      </section>}
      {spreads.map(([large, ...small], si) => <section key={large.src} className="product-spread" aria-label={t("情境照", "In use")}>
        <div className={`product-spread-smalls${textAboveSmalls && si === 0 ? " is-centered" : ""}`}>{textAboveSmalls && si === 0 && <div className="product-spread-text">{storyText}</div>}{small.map((img) => <figure key={img.src} className="scene-fig" data-shape="tall" style={{ aspectRatio: frameOf(img) }}><Picture img={img} fill fit="cover" animate={false} sizes="(min-width:768px) 16vw, 100vw" /></figure>)}</div>
        <figure className="scene-fig product-spread-large" data-shape="tall" style={{ aspectRatio: frameOf(large) }}><Picture img={large} fill fit="cover" animate={false} sizes="(min-width:768px) 46vw, 100vw" /></figure>
      </section>)}
      {rowScenes.length > 0 && <section className="product-scenes" aria-label={t("情境照", "In use")}>
        {rowScenes.map((img) => <figure key={img.src} className="scene-fig" data-shape={shapeOf(img)} style={{ aspectRatio: frameOf(img) }}><Picture img={img} fill fit="cover" animate={false} sizes={shapeOf(img) === "tall" ? "(min-width:768px) 31vw, 100vw" : "(min-width:768px) 46vw, 100vw"} /></figure>)}
      </section>}
      <section className="product-related" aria-labelledby="related-title"><div className="product-related-heading"><h2 id="related-title" className="tc">{t("繼續觀看", "Explore more pieces")}</h2></div><div className="catalog-grid">{related.map((p, i) => <ProductCard key={p.slug} product={p} index={i} lang={lang} />)}</div></section>
    </article>
  );
}
