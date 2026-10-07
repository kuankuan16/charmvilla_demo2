import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategories, getProducts, getCategory, getCategoryProducts, categoryHref } from "@/data/catalog";
import CollectionBrowser from "@/components/catalog/CollectionBrowser";
import ProductCard from "@/components/catalog/ProductCard";
import { alternatesFor, defaultLocale, isLocale, localeHref, translator } from "@/i18n/config";

type Props = { params: Promise<{ lang: string; category: string }> };
// No `dynamicParams = false`: an unknown category must reach the page so notFound() can answer with the localized 404.
export const generateStaticParams = () => ["all", ...categories.map((c) => c.id)].map((category) => ({ category }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw, category } = await params;
  const lang = isLocale(raw) ? raw : defaultLocale;
  const t = translator(lang);
  const info = getCategory(category, lang);
  const title = t(`${info?.name || "全部作品"}｜CHARM VILLA`, `${info?.name || "All Pieces"} | CHARM VILLA`);
  const description = info?.intro || t("走進 CHARM VILLA 的日常藝廊，欣賞小金魚茶包、香味是喜悅的記憶與柴燒鳥形筷架，從細節讀懂每件作品。",
    "Explore goldfish tea gifts, hinoki pieces and wood-fired songbird rests. Each piece invites a closer look at the textures and forms that bring art into everyday life.");
  return { title, description, alternates: alternatesFor(lang, categoryHref(category)), openGraph: { title, images: [getCategoryProducts(category, lang)[0]?.image.src || "/media/site/scene-red-giftbox-tea-hinoki-bird.webp"] } };
}

export default async function CollectionPage({ params }: Props) {
  const { lang, category } = await params;
  if (!isLocale(lang)) notFound();
  const t = translator(lang);
  const info = getCategory(category, lang);
  if (category !== "all" && !info) notFound();
  const list = getCategoryProducts(category, lang);
  const all = t("全部作品", "All Pieces");
  return (
    <div className="collection-page">
      <nav className="catalog-breadcrumb tc" aria-label={t("麵包屑", "Breadcrumb")}><Link href={localeHref(lang, "/")}>{t("首頁", "Home")}</Link><span aria-hidden="true">/</span>{info && <><Link href={categoryHref("all", lang)}>{all}</Link><span aria-hidden="true">/</span></>}<span aria-current="page">{info?.name || all}</span></nav>
      {/* English pages: the display heading already is the category name, so the Chinese-name line is not repeated. */}
      <header className="collection-heading"><div><h1>{info?.en || "ALL PIECES"}<sup>{String(list.length).padStart(2, "0")}</sup></h1></div><div className="collection-heading-copy">{(lang === "zh" || !info) && <h2 className="tc">{info?.name || t("藝術即生活", "Art as Life")}</h2>}<p className="tc">{info?.intro || t("從皮革的編織到金飾的輪廓，沿著材質走進作品。每一次配戴、每一回取用，都讓觀看與生活靠得更近。", "Explore goldfish tea gifts, hinoki pieces and wood-fired songbird rests. Each piece invites a closer look at the textures and forms that bring art into everyday life.")}</p></div></header>
      <nav className="collection-categories" aria-label={t("商品分類", "Categories")}><Link href={categoryHref("all", lang)} aria-current={category === "all" ? "page" : undefined} className="tc">{t("全部", "All")} <span>{getProducts(lang).length}</span></Link>{getCategories(lang).map((c) => <Link key={c.id} href={categoryHref(c.id, lang)} aria-current={category === c.id ? "page" : undefined} className="tc">{c.name} <span>{getCategoryProducts(c.id, lang).length}</span></Link>)}</nav>
      <Suspense fallback={<div className="collection-results"><div className="catalog-grid">{list.map((p, i) => <ProductCard key={p.slug} product={p} index={i} lang={lang} />)}</div></div>}><CollectionBrowser key={category} products={list} /></Suspense>
    </div>
  );
}
