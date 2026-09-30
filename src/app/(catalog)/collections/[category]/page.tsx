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
  return { title, description: info?.intro || "走進 CHARM VILLA 的日常藝廊，欣賞真皮包、金飾、小金魚茶包與茶器，從細節讀懂每件作品。", alternates: { canonical: categoryHref(category) }, openGraph: { title, images: [getCategoryProducts(category)[0]?.image.src || "/media/gallery/CV-0398.webp"] } };
}

export default async function CollectionPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const info = getCategory(category);
  if (category !== "all" && !info) notFound();
  const list = getCategoryProducts(category);
  return (
    <div className="collection-page">
      <nav className="catalog-breadcrumb tc" aria-label="麵包屑"><Link href="/">首頁</Link><span aria-hidden="true">/</span>{info && <><Link href="/collections/all">全部商品</Link><span aria-hidden="true">/</span></>}<span aria-current="page">{info?.name || "全部商品"}</span></nav>
      <header className="collection-heading"><div><p className="catalog-eyebrow">ART IN EVERYDAY LIFE</p><h1>{info?.en || "ALL OBJECTS"}<sup>{String(list.length).padStart(2, "0")}</sup></h1></div><div className="collection-heading-copy"><h2 className="tc">{info?.name || "藝術即生活"}</h2><p className="tc">{info?.intro || "從皮革的編織到金飾的輪廓，沿著材質走進作品。每一次配戴、每一回取用，都讓觀看與生活靠得更近。"}</p></div></header>
      <nav className="collection-categories" aria-label="商品分類"><Link href="/collections/all" aria-current={category === "all" ? "page" : undefined} className="tc">全部 <span>{products.length}</span></Link>{categories.map((c) => <Link key={c.id} href={categoryHref(c.id)} aria-current={category === c.id ? "page" : undefined} className="tc">{c.name} <span>{getCategoryProducts(c.id).length}</span></Link>)}</nav>
      <Suspense fallback={<div className="collection-results"><div className="catalog-grid">{list.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}</div></div>}><CollectionBrowser key={category} products={list} /></Suspense>
      <div className="collection-visit"><p className="catalog-eyebrow">MEET THE OBJECTS</p><h2 className="tc">走近，細看。</h2><p className="tc">走進台北與京都門市，在不同角度的光線下，親自感受作品的比例與質地。</p><Link href="/#visit" className="catalog-button tc">尋找門市 ↗</Link></div>
    </div>
  );
}
