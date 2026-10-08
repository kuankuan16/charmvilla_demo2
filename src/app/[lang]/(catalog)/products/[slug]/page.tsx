import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { products, getProducts, findProduct, getCategory, getCategoryProducts, productHref, categoryHref, formatPrice } from "@/data/catalog";
import AddToCart from "@/components/cart/AddToCart";
import { getContent, site, type Img } from "@/data/content";
import { getAbout } from "@/data/about";
import { Picture } from "@/components/ui";
import ProductGallery from "@/components/catalog/ProductGallery";
import { ProductOptionProvider } from "@/components/catalog/ProductOption";
import ProductCard from "@/components/catalog/ProductCard";
import TeaPages from "@/components/catalog/TeaPages";
import { alternatesFor, defaultLocale, isLocale, localeHref, siteUrl, translator } from "@/i18n/config";

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
  const allScenes = product.scenes ?? [];
  // Tea gift boxes close with the two photographs every box shares — two people at the black oak table, the hands and the mug — as the
  // two small images of a spread of their own (user 2026-10-08: 「我想要每一個茶葉禮盒這２張共用，而且都是小圖呈現」); the box's own last
  // scene is that spread's large image when the box has more than one, so the pair never shows large. They leave the automatic split below.
  const SHARED = ["/media/site/scene-two-people-tea-black-oak-table.webp", "/media/site/scene-hands-speckled-mug-goldfish-tea-warm-light.webp"];
  const sharedSmalls = product.category === "tea" ? SHARED.map((src) => allScenes.find((img) => img.src === src)).filter((x): x is Img => Boolean(x)) : [];
  const own = sharedSmalls.length === 2 ? allScenes.filter((img) => !SHARED.includes(img.src)) : allScenes;
  const sharedLarge = sharedSmalls.length === 2 && own.length >= 2 ? own[own.length - 1] : undefined;
  const scenes = sharedLarge ? own.slice(0, -1) : own;
  // Portrait and square photographs are framed 4:5, landscape ones 3:2, very wide ones keep their own proportion.
  const shapeOf = (img: Img) => (img.w / img.h > 1.9 ? "banner" : img.w / img.h > 1.15 ? "wide" : "tall");
  const frameOf = (img: Img) => ({ banner: `${img.w} / ${img.h}`, wide: "3 / 2", tall: "4 / 5" })[shapeOf(img)];
  // After jakobsencopenhagen.com/en/products/karla: the first scenes run down the information column; the others close the page
  // in rows on the same 12 columns (a portrait takes 4 columns, a landscape 6). The column takes one to three, as few as leave full rows.
  const spanOf = (img: Img) => (shapeOf(img) === "tall" ? 4 : 6);
  const fullRows = (list: Img[]) => { let row = 0; for (const img of list) { row += spanOf(img); if (row > 12) return false; if (row === 12) row = 0; } return row === 0; };
  // Exactly three scenes follow the STINA page's "STINA / Hocker A — Teil derselben Kollektion" block instead (user 2026-10-01: 「版型參考
  // liam」, 「情境照３張的版型」; user 2026-10-08, with that block: 「這屏我想要像[STINA]設計」): the first and the third in the column, the
  // second large under the product image with the piece's name and category beside it and, from column 9, 「同系列作品」 — a line about
  // the next piece of the category, a link to it and its photograph two columns wide (the small scene used to sit there).
  const pair = scenes.length === 3 ? scenes.slice(1) : null;
  const inColumn = pair ? 1 : scenes.length <= 3 ? scenes.length : [1, 2, 3].find((n) => fullRows(scenes.slice(n))) ?? 2;
  const columnScenes = pair ? [scenes[0], pair[1]] : scenes.slice(0, inColumn), rest = pair ? [] : scenes.slice(inColumn);
  // Portraits that close the page in threes make a spread like the homepage's craft section, after the jakobsencopenhagen.com/en/
  // homepage (user 2026-10-01: 「商品內頁如果有多圖的情況也是用相同的邏輯處理」): the first one large at the right, the other two
  // small at the left, where they stay under the header while the large one passes. Anything else keeps its rows.
  const inSpreads = rest.length > 0 && rest.length % 3 === 0 && rest.every((img) => shapeOf(img) === "tall");
  const spreads = inSpreads ? rest.flatMap((_, i) => (i % 3 ? [] : [rest.slice(i, i + 3)])) : [], rowScenes = inSpreads ? [] : rest;
  // 白包頁：故事文字放在第一組的兩張小圖正上方，不放在資訊欄（使用者 2026-10-06）
  const textAboveSmalls = (product.slug === "braided-leather-bag-white" || product.slug === "braided-leather-bag-blue") && spreads.length > 0;
  // a story body may hold several paragraphs (blank-line separated); `more` is a second titled text (紫斑蝶: about the butterflies, 2026-10-07)
  const paragraphs = (text: string, prefix: string) => text.split(/\n\s*\n/).map((p, i) => <p key={`${prefix}${i}`} className="tc">{p}</p>);
  // The story is no longer its own block anywhere (user 2026-10-07: 「刪除 故事…改在商品規格裡」, 「刪」 on the magazine page): its text,
  // its second titled text (紫斑蝶) and the tea awards are rows of the specifications below. How to brew (tea gift boxes except the fruit &
  // herbal tea box; guide §4) sits where the story used to — beside the large photograph, or in the column — in the story's type
  // (user 2026-10-07: 「沖泡方式改放在故事的位置」).
  const storyInColumn = product.category === "tea";
  const storyRows = storyInColumn ? [] : [{ label: product.story.title, body: paragraphs(product.story.body, "s") }, ...(product.story.more ? [{ label: product.story.more.title, body: paragraphs(product.story.more.body, "m") }] : [])];
  // 茶款介紹 and 沖泡方式 are neither in the column nor beside the photographs: one sheet after the scene photographs, before 繼續觀看
  // (TeaPages; user 2026-10-07: 「把茶款介紹跟沖泡方式獨立出來」, then 「整合成一屏…放在目前商品的情境之下，推薦商品之上」).
  const sideText = null;
  // Tea gift boxes (user 2026-10-08, with the STINA page's "Teil derselben Kollektion" block: 「都放下面一點的排序」「像這樣呈現」): the story
  // leaves the specifications and sits at the foot of the column as that block — the title in ink and the text in grey at one size, a
  // blank line between — with the column's first scene photograph 80px under it; its second titled text (紫斑蝶) follows in the same type.
  // The two photographs every tea box shares (two people at the black oak table, the hands and the mug) close the page as the two small
  // images of a spread (「這２張共用，而且都是小圖呈現」).
  const storyBlock = storyInColumn && <div className="product-story-block">
    <div className="product-story-text">
      <h2 className="tc">{product.story.title}</h2>
      {paragraphs(product.story.body, "s")}
      {product.story.more && <><h3 className="product-story-more tc">{product.story.more.title}</h3>{paragraphs(product.story.more.body, "m")}</>}
    </div>
  </div>;
  const teaPages = product.category === "tea" && <TeaPages product={product} t={t} />;
  // Specifications under the button, in their own section (user 2026-10-05: the reference's spacing and type, 「按鈕移到規格上面」;
  // facts only — 「不寫形容文案，清楚呈現商品規格與內容物等消費者必須要第一時間知道的訊息」).
  const specTitle = product.category === "tea" ? t("禮盒內容與規格", "Gift box contents and details") : product.category === "bags" ? t("材質與做工", "Materials and construction") : t("商品規格", "Product details");
  // First screen after jakobsencopenhagen.com/de/produkte/stina-ecksitzinsel-3-sitzer (user 2026-10-07: 「高度學習並推理模仿這一屏的呈現」):
  // the image fills the window's height at the left with two short facts in its bottom-left corner; the column at the right opens with
  // the thumbnails and closes, at the foot of the image, with the name, the text, three thin feature rows between hairlines, an origin
  // line where the product has one, the options, and two full-width buttons — the ink add-to-bag and an outlined second one.
  // A bracketed part of a name or label — 東方美人茶（白毫烏龍茶）, 紅玉紅茶（Red Jade／Ruby No.18）3 入, 重量（含盒） — goes on its own
  // small line under the rest (user 2026-10-07: 「括號內的文字都換行用小字呈現」).
  const smallParen = (text: string) => { const m = text.match(/^(.*?)\s*[（(]([^（）()]+)[）)]\s*(.*)$/); return m ? <>{m[1]}{m[3] && ` ${m[3]}`}<small className="product-paren">{m[2]}</small></> : text; };
  // Each fact appears once (user 2026-10-07: 「不要一直重複一樣的資訊」, 「規格內的系列可以刪」): the series and one short fact in the
  // image's corner, three facts in the thin rows, and the specifications carry only what is left.
  const byLabel = (labels: string[]) => labels.map((l) => product.facts.find((f) => f.label === l)).filter((f): f is NonNullable<typeof f> => Boolean(f));
  const plainFacts = product.facts.filter((f) => !(f.items && f.items.length > 1));
  // no caption in the image's corner any more (user 2026-10-07: 「刪除產品圖左下角的字」); its two facts are not repeated elsewhere, so they return to the specifications
  const caption = null;
  const keyRows = product.category === "tea" ? byLabel([t("販售單位", "Sold as"), t("盒型與材質", "Packaging"), t("保存期限", "Shelf life")]) : plainFacts.filter((f) => f.label !== t("系列", "Series")).slice(0, 3);
  const keyLines = keyRows.length > 0 && <ul className="product-keylines">{keyRows.map((f) => <li key={f.label}><span className="tc">{f.label}</span><span className="tc">{f.value}</span></li>)}</ul>;
  const shownAbove = new Set(keyRows.map((f) => f.label).concat(t("系列", "Series")));
  const specFacts = product.facts.filter((f) => !shownAbove.has(f.label));
  const origin = product.facts.find((f) => f.label === t("產地", "Made in"));
  const originNote = origin && <p className="product-origin tc">{t(`${origin.value}製作。`, `Made in ${origin.value}.`)}</p>;
  // the second, outlined button leads to the brewing steps; other products have none (user 2026-10-07: 「移除常見問題」)
  const secondAction = product.brew ? { href: "#brew-title", label: t("查看沖泡方式", "How to brew") } : null;
  // Back in the column, after the button, as before 2026-10-07 (user 2026-10-07: 「商品規格我喜歡放在原本的位置」; the three thin key rows and
  // the magazine-page specifications of that morning are gone again).
  const specs = <section className="product-specs" aria-labelledby="specs-title">
    <h2 id="specs-title" className="tc">{specTitle}</h2>
    <dl className="product-keyfacts">
      {specFacts.map((f) => <div key={f.label}><dt className="tc">{smallParen(f.label)}</dt><dd className="tc">{f.items && f.items.length > 1 ? <ul className="product-fact-list">{f.items.map((item) => <li key={item}>{smallParen(item)}</li>)}</ul> : f.value}</dd></div>)}
      {storyRows.map((r) => <div key={r.label} className="product-story-row"><dt className="tc">{r.label}</dt><dd className="tc">{r.body}</dd></div>)}
      {product.category === "tea" && <div className="product-story-row"><dt className="tc">{t("獲獎", "Awards")}</dt><dd><div className="product-awards">{tea.awards.map((a) => <Image key={a.image.src} src={a.image.src} alt={a.image.alt} width={a.image.w} height={a.image.h} />)}</div></dd></div>}
    </dl>
    {product.giftBox && <p className="product-image-note tc">{t("情境圖中的茶具、茶點與佈置物僅作展示，禮盒內容請見上方規格；盒色與供應款式請以官方商店選項為準。", "Teaware, sweets and decorative props shown in the photos are not included. Please refer to the box contents listed above. Box color and available styles follow the options in the official store.")}</p>}
  </section>;
  // 茶款介紹 (tea gift boxes): each tea in the box with its note, in the same row style right after the specifications — it counts as
  // part of them (user 2026-10-07: 「加入目前官網的商品介紹頁」, then 「茶款也算在規格裡好了」).
  // Below the first screen, a magazine inner page after jakobsencopenhagen.com/de/produkte/stina-ecksitzinsel-3-sitzer (user 2026-10-07:
  // 「沖泡另外用像雜誌的版型」): a rule across the width, the title at the left, the text in a column at the right. Only a bag's Show more!
  // concept uses it now (the tea story left it on 2026-10-07: 「刪」). No eyebrow above the title (「刪除商品細節的字眼」).
  const concept = product.concept ? { id: "concept", title: product.concept.title, body: <div className="product-concept"><p className="product-slogan" lang="en">&ldquo;{product.concept.slogan}&rdquo;</p><p className="tc">{product.concept.body}</p></div> } : null;
  const [first, ...more] = [concept].filter((b): b is NonNullable<typeof b> => Boolean(b));
  const editorial = first && <section className="product-editorial" aria-labelledby={`${first.id}-title`}>
    <div className="product-editorial-head"><h2 id={`${first.id}-title`} className="tc">{first.title}</h2></div>
    <div className="product-editorial-body">
      <div className="product-editorial-col">{first.body}</div>
      {more.length > 0 && <div className="product-editorial-col">{more.map((b) => <div key={b.id} className="product-editorial-block"><h3 id={`${b.id}-title`} className="tc">{b.title}</h3>{b.body}</div>)}</div>}
    </div>
  </section>;
  // 繼續觀看 (user 2026-10-05: 「優先推薦同一類別的商品，不夠的話再推薦其他類別」): the pieces of this category that follow this one
  // (wrapping round), then the nearest categories, one piece from each in turn, so a short category is not followed by four bags.
  const at = siblings.findIndex((p) => p.slug === slug);
  const sameCategory = [...siblings.slice(at + 1), ...siblings.slice(0, Math.max(at, 0))];
  const others = (nearest[product.category] ?? []).map((id) => all.filter((p) => p.category === id));
  const fill = Array.from({ length: Math.max(0, ...others.map((l) => l.length)) }, (_, i) => others.flatMap((l) => l[i] ?? []));
  // three, as STINA's "Unsere Neuheiten" row (user 2026-10-08: 「全站商品頁的版型都參考這個」); the first is also the companion in the pair block
  const related = [...sameCategory, ...fill.flat()].slice(0, 3);
  // the brand band before the footer, after STINA's: the slogan, the introduction from the About page and a link to it, over the brand's
  // installation photograph (CV-0215) darkened
  const about = getAbout(lang);
  const band = site("about-installation-2k.webp", t("展場裡，白色紙摺的金魚與花在枝條上懸著，背景是橘紅墨染的長幅", "In an exhibition, white paper goldfish and blossoms hang from a branch before a long panel of orange ink wash"), 2400, 1604);
  const schema = { "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.description, image: product.views.filter((v) => !v.placeholder).map((v) => new URL(v.image.src, siteUrl).href), brand: { "@type": "Brand", name: "CHARM VILLA" }, category: category.name, url: `${siteUrl}${productHref(product, lang)}`,
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
      <ProductOptionProvider><ProductGallery key={product.slug} name={product.name} views={product.views} optionViews={product.giftBox?.choices?.map((c) => c.views)} intro={
        <div className="product-intro">
          {/* On Chinese pages the English name sits above the Chinese one; on English pages the name itself is English. */}
          {lang === "zh" && <p className="product-english">{product.english}</p>}
          <h1 className="tc" id="product-name">{product.name}</h1>
          {/* the one-line descriptive copy under the name is gone site-wide (user 2026-10-05: 「刪除全站這層形容文案，並將重要的數字訊息整合到下面的 spec」) */}
          {product.price && <p className="product-price">{product.giftBox?.choices?.some((c) => c.price && c.price !== product.price?.amount) ? t(`${formatPrice(product.price.amount, product.price.currency)} 起`, `From ${formatPrice(product.price.amount, product.price.currency)}`) : formatPrice(product.price.amount, product.price.currency)}{product.soldOut && <span className="product-soldout tc">{t("售罄", "Sold out")}</span>}</p>}
          <p className="product-description tc">{product.description}</p>
          {keyLines}
          {originNote}
          {variants.length > 1 && <fieldset className="product-variants"><legend className="tc">{product.category === "bags" ? t("選擇顏色", "Choose a color") : t("同系列盒型", "Boxes in this series")}</legend><div>{variants.map((v) => <Link key={v.slug} href={productHref(v, lang)} aria-current={v.slug === slug ? "page" : undefined} className="tc">{v.variant?.label}</Link>)}</div></fieldset>}
          {/* user 2026-10-01: every product page carries the ink add-to-bag button; a piece without a list price goes into the bag as "price on request" */}
          <div className="product-actions"><AddToCart product={product} />{secondAction && <a className="product-buy product-buy--secondary tc" href={secondAction.href}>{secondAction.label}</a>}</div>
        </div>} caption={caption}>
        {specs}
        {!pair && !textAboveSmalls && sideText}
        {storyBlock}
        {columnScenes.map((img) => <figure key={img.src} className="scene-fig" data-shape={shapeOf(img)} style={{ aspectRatio: frameOf(img) }}><Picture img={img} fill fit="cover" animate={false} sizes="(min-width:1280px) 31vw, (min-width:768px) 38vw, 100vw" /></figure>)}
      </ProductGallery></ProductOptionProvider>
      {editorial}
      {pair && <section className="product-pair" aria-label={t("情境照", "In use")}>
        <figure className="scene-fig product-pair-large" data-shape={shapeOf(pair[0])} style={{ aspectRatio: frameOf(pair[0]) }}><Picture img={pair[0]} fill fit="cover" animate={false} sizes="(min-width:768px) 46vw, 100vw" /></figure>
        {/* the reference's name/category lines and its 「同系列作品」 text went the same night (user 2026-10-08: 「刪」): the companion's small
            photograph alone, linking to it */}
        {related[0] && <div className="product-pair-side">
          <Link href={productHref(related[0], lang)} className="product-pair-small-link" aria-label={t(`瀏覽 ${related[0].name}`, `View ${related[0].name}`)}><figure className="scene-fig product-pair-small" style={{ aspectRatio: "3 / 4" }}><Picture img={related[0].image} fill fit="cover" animate={false} sizes="(min-width:768px) 16vw, 50vw" /></figure></Link>
        </div>}
      </section>}
      {spreads.map(([large, ...small], si) => <section key={large.src} className="product-spread" aria-label={t("情境照", "In use")}>
        <div className={`product-spread-smalls${textAboveSmalls && si === 0 ? " is-centered" : ""}`}>{textAboveSmalls && si === 0 && <div className="product-spread-text">{sideText}</div>}{small.map((img) => <figure key={img.src} className="scene-fig" data-shape="tall" style={{ aspectRatio: frameOf(img) }}><Picture img={img} fill fit="cover" animate={false} sizes="(min-width:768px) 16vw, 100vw" /></figure>)}</div>
        <figure className="scene-fig product-spread-large" data-shape="tall" style={{ aspectRatio: frameOf(large) }}><Picture img={large} fill fit="cover" animate={false} sizes="(min-width:768px) 46vw, 100vw" /></figure>
      </section>)}
      {rowScenes.length > 0 && <section className="product-scenes" aria-label={t("情境照", "In use")}>
        {rowScenes.map((img) => <figure key={img.src} className="scene-fig" data-shape={shapeOf(img)} style={{ aspectRatio: frameOf(img) }}><Picture img={img} fill fit="cover" animate={false} sizes={shapeOf(img) === "tall" ? "(min-width:768px) 31vw, 100vw" : "(min-width:768px) 46vw, 100vw"} /></figure>)}
      </section>}
      {sharedSmalls.length === 2 && <section className={`product-spread product-spread--shared${sharedLarge ? "" : " is-smalls-only"}`} aria-label={t("情境照", "In use")}>
        <div className="product-spread-smalls">{sharedSmalls.map((img) => <figure key={img.src} className="scene-fig" data-shape="tall" style={{ aspectRatio: frameOf(img) }}><Picture img={img} fill fit="cover" animate={false} sizes="(min-width:768px) 16vw, 100vw" /></figure>)}</div>
        {sharedLarge && <figure className="scene-fig product-spread-large" data-shape={shapeOf(sharedLarge)} style={{ aspectRatio: frameOf(sharedLarge) }}><Picture img={sharedLarge} fill fit="cover" animate={false} sizes="(min-width:768px) 46vw, 100vw" /></figure>}
      </section>}
      {teaPages}
      <section className="product-related" aria-labelledby="related-title">
        <div className="product-related-heading"><h2 id="related-title" className="tc">{t("繼續觀看", "Explore more pieces")}</h2><Link href={categoryHref(product.category, lang)} className="product-related-all tc">{t("所有商品", "All products")}</Link></div>
        <div className="catalog-grid">{related.map((p, i) => <ProductCard key={p.slug} product={p} index={i} lang={lang} caption={getCategory(p.category, lang)?.name} />)}</div>
      </section>
      <section className="product-band" aria-label={t("關於 CHARM VILLA", "About CHARM VILLA")}>
        <div className="product-band-image" aria-hidden="true"><Picture img={band} fill fit="cover" animate={false} sizes="100vw" /></div>
        <div className="product-band-copy">
          <p className="product-band-line">{about.slogan}</p>
          <div className="product-band-text"><p className="tc">{about.intro}</p><Link href={localeHref(lang, "/about")} className="tc">{t("了解更多", "Learn more")}</Link></div>
        </div>
      </section>
    </article>
  );
}
