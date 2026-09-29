import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, products, getCategory, getCategoryProducts, categoryHref } from "@/data/catalog";
import CollectionBrowser from "@/components/catalog/CollectionBrowser";
import ProductCard from "@/components/catalog/ProductCard";

export const dynamicParams = false;
export const generateStaticParams = () => ["all", ...categories.map((c) => c.id)].map((category) => ({ category }));

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const info = getCategory(category);
  const title = `${info?.name || "全部商品"}｜CHARM VILLA`;
  return { title, description: info?.intro || "瀏覽 CHARM VILLA 真皮包、金飾、小金魚茶包與茶器，從材質、細節到日常的使用風景。", alternates: { canonical: categoryHref(category) }, openGraph: { title, images: [getCategoryProducts(category)[0]?.image.src || "/media/gallery/CV-0398.webp"] } };
}

export default async function CollectionPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const info = getCategory(category);
  if (category !== "all" && !info) notFound();
  const list = getCategoryProducts(category);
  return (
    <div className="collection-page">
      <nav className="catalog-breadcrumb tc" aria-label="麵包屑"><Link href="/">首頁</Link><span aria-hidden="true">/</span>{info && <><Link href="/collections/all">全部商品</Link><span aria-hidden="true">/</span></>}<span aria-current="page">{info?.name || "全部商品"}</span></nav>
      <header className="collection-heading"><div><p className="catalog-eyebrow">OBJECTS FOR EVERYDAY LIFE</p><h1>{info?.en || "ALL OBJECTS"}<sup>{String(list.length).padStart(2, "0")}</sup></h1></div><div className="collection-heading-copy"><h2 className="tc">{info?.name || "日常，值得細看。"}</h2><p className="tc">{info?.intro || "從一尾小金魚，到一件隨身物件。以不同的材質與工藝，為每一天留下可觸摸的風景。"}</p></div></header>
      <nav className="collection-categories" aria-label="商品分類"><Link href="/collections/all" aria-current={category === "all" ? "page" : undefined} className="tc">全部 <span>{products.length}</span></Link>{categories.map((c) => <Link key={c.id} href={categoryHref(c.id)} aria-current={category === c.id ? "page" : undefined} className="tc">{c.name} <span>{getCategoryProducts(c.id).length}</span></Link>)}</nav>
      <Suspense fallback={<div className="collection-results"><div className="catalog-grid">{list.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}</div></div>}><CollectionBrowser key={category} products={list} /></Suspense>
      <div className="collection-visit"><p className="catalog-eyebrow">MEET THE OBJECTS</p><h2 className="tc">從畫面，到手心。</h2><p className="tc">歡迎走進台北與京都門市，親自觀看材質、比例與細節。</p><Link href="/#visit" className="catalog-button tc">尋找門市 ↗</Link></div>
    </div>
  );
}
