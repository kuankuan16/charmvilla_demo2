import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { products, findProduct, getCategory, getCategoryProducts, productHref, categoryHref } from "@/data/catalog";
import { tea, visit } from "@/data/content";
import { Picture } from "@/components/ui";
import ProductGallery from "@/components/catalog/ProductGallery";
import ProductCard from "@/components/catalog/ProductCard";

export const dynamicParams = false;
export const generateStaticParams = () => products.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) return { title: "找不到商品｜CHARM VILLA" };
  const title = `${product.name}｜CHARM VILLA`;
  return { title, description: product.description, alternates: { canonical: productHref(product) }, openGraph: { title, description: product.summary, images: [{ url: product.image.src, alt: product.image.alt }] } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.category)!;
  const siblings = getCategoryProducts(product.category);
  const position = siblings.findIndex((p) => p.slug === slug);
  const previous = siblings[(position - 1 + siblings.length) % siblings.length];
  const next = siblings[(position + 1) % siblings.length];
  const variants = product.variant ? products.filter((p) => p.variant?.group === product.variant?.group) : [];
  const related = [...siblings.filter((p) => p.slug !== slug), ...products.filter((p) => p.category !== product.category)].slice(0, 4);
  const schema = { "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.description, image: product.views.map((v) => `https://charmvilla-gallery-site.vercel.app${v.image.src}`), brand: { "@type": "Brand", name: "CHARM VILLA" }, category: category.name, url: `https://charmvilla-gallery-site.vercel.app${productHref(product)}` };
  return (
    <article className={`product-page product-page--${product.category}`} data-product={slug}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <nav className="catalog-breadcrumb tc" aria-label="麵包屑"><Link href="/collections/all">全部商品</Link><span aria-hidden="true">/</span><Link href={categoryHref(category.id)}>{category.name}</Link><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span></nav>
      <section className="product-hero" aria-labelledby="product-name">
        <div className="product-intro"><p className="catalog-eyebrow">{category.en} <span className="product-edition">{String(position + 1).padStart(2, "0")} / {String(siblings.length).padStart(2, "0")}</span></p><p className="product-english">{product.english}</p><h1 className="tc" id="product-name">{product.name}</h1><p className="product-summary tc">{product.summary}</p><div className="product-intro-rule" /><p className="product-description tc">{product.description}</p>
          {variants.length > 1 && <fieldset className="product-variants"><legend className="tc">{product.category === "bags" ? "選擇顏色" : "探索其他風味"}</legend><div>{variants.map((v) => <Link key={v.slug} href={productHref(v)} aria-current={v.slug === slug ? "page" : undefined} className="tc">{v.variant?.label}</Link>)}</div></fieldset>}
          <a href="#product-details" className="product-detail-link tc">往下閱讀商品細節 <span aria-hidden="true">↓</span></a>
        </div>
        <ProductGallery key={product.slug} name={product.name} views={product.views} />
      </section>
      <section id="product-details" className="product-details" aria-labelledby="details-title"><div className="product-section-heading"><p className="catalog-eyebrow">01 / THE DETAILS</p><h2 id="details-title" className="tc">材質與構成</h2><p className="tc">{product.summary}</p></div><dl className="product-specs">{product.facts.map((f) => <div key={f.label}><dt className="tc">{f.label}</dt><dd className="tc">{f.value}</dd></div>)}</dl></section>
      <section className={`product-story ${product.story.image ? "product-story--image" : ""}`} aria-labelledby="story-title"><div><p className="catalog-eyebrow">02 / IN EVERYDAY LIFE</p><h2 id="story-title" className="tc">{product.story.title}</h2><p className="tc">{product.story.body}</p>{product.category === "tea" && <div className="product-awards">{tea.awards.map((a) => <Image key={a.image.src} src={a.image.src} alt={a.image.alt} width={a.image.w} height={a.image.h} />)}</div>}</div>{product.story.image && <figure><Picture img={product.story.image} animate={false} sizes="(min-width:1024px) 60vw, 100vw" /><figcaption className="tc">{product.name} · 作品情境</figcaption></figure>}</section>
      <section className="product-visit" id="product-visit"><div><p className="catalog-eyebrow">03 / MEET IN PERSON</p><h2 className="tc">走近，細看。</h2><p className="tc">近看表面的紋理，退一步看完整的輪廓。歡迎到門市欣賞作品，也可洽詢款式、包裝與選購資訊。</p><a href={visit.instagram} target="_blank" rel="noreferrer" className="catalog-button tc">商品洽詢 ↗</a></div><div className="product-faq"><details><summary className="tc">在哪裡可以欣賞與選購？</summary><div className="tc"><p>歡迎至 CHARM VILLA 台北晶華與京都門市，實際觀看商品細節。到訪前可透過 Instagram 洽詢欲看的款式。</p><Link href="/#visit">查看門市地址與營業時間 ↗</Link></div></details><details><summary className="tc">想了解包裝、規格與售價？</summary><div className="tc"><p>洽詢時請提供商品名稱，門市夥伴將協助確認款式、包裝與選購資訊。</p><a href={visit.instagram} target="_blank" rel="noreferrer">前往 CHARM VILLA Instagram ↗</a></div></details><details><summary className="tc">如何繼續瀏覽同系列？</summary><div className="tc"><p>您可以從本頁下方探索其他物件，或回到{category.name}的完整商品清單。</p><Link href={categoryHref(category.id)}>瀏覽{category.name} ↗</Link></div></details></div></section>
      <section className="product-related" aria-labelledby="related-title"><div className="product-related-heading"><div><p className="catalog-eyebrow">KEEP EXPLORING</p><h2 id="related-title" className="tc">繼續觀看</h2></div><Link href={categoryHref(category.id)} className="tc">回到{category.name}清單 ↗</Link></div><div className="catalog-grid">{related.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}</div></section>
      <nav className="product-next-prev" aria-label="上一款與下一款商品"><Link href={productHref(previous)}><span>← PREVIOUS</span><strong className="tc">{previous.name}</strong></Link><Link href={productHref(next)}><span>NEXT →</span><strong className="tc">{next.name}</strong></Link></nav>
      <div className="product-dock"><Link href={categoryHref(category.id)} className="product-dock-back tc">← <span>返回{category.name}</span></Link><span className="product-dock-name tc">{product.name}</span><a href="#product-visit" className="catalog-button tc">欣賞與選購 <span aria-hidden="true">↗</span></a></div>
    </article>
  );
}
