import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { itemList, pageNodes, ref } from "@/lib/seo/schema";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategories, getProducts, getCategory, getCategoryProducts, categoryHref } from "@/data/catalog";
import CollectionBrowser from "@/components/catalog/CollectionBrowser";
import { defaultLocale, isLocale, localeHref, translator } from "@/i18n/config";
import { getCommerceProducts } from "@/lib/shopify/catalog";
import { prioritizeProducts } from "@/data/merchandising";

type Props = { params: Promise<{ lang: string; category: string }> };
// No `dynamicParams = false`: an unknown category must reach the page so notFound() can answer with the localized 404.
export const generateStaticParams = () => ["all", ...categories.map((c) => c.id)].map((category) => ({ category }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw, category } = await params;
  const lang = isLocale(raw) ? raw : defaultLocale;
  const t = translator(lang);
  const info = getCategory(category, lang);
  if (category !== "all" && !info) notFound();
  const title = t(`${info?.name || "全部作品"}｜CHARM VILLA`, `${info?.name || "All Pieces"} | CHARM VILLA`);
  const description = info?.intro || t("走進 CHARM VILLA 的日常藝廊，欣賞小金魚茶包、香味是喜悅的記憶與柴燒鳥形筷架，從細節讀懂每件作品。",
    "Discover goldfish tea gifts, hinoki wood pieces and wood-fired chopstick rests. Look closely at their textures and forms, and find small ways to bring art into everyday life.");
  return pageMetadata({ lang, path: categoryHref(category), title, description, image: prioritizeProducts(getCategoryProducts(category, lang))[0]?.image });
}

export default async function CollectionPage({ params }: Props) {
  const { lang, category } = await params;
  if (!isLocale(lang)) notFound();
  const t = translator(lang);
  const info = getCategory(category, lang);
  if (category !== "all" && !info) notFound();
  const live = await getCommerceProducts(lang);
  const list = prioritizeProducts(category === "all" ? live : live.filter(p => p.category === category));
  const all = t("全部作品", "All Pieces");
  const path = categoryHref(category);
  const schemaList = itemList(lang, path, list.map(p => ({ path: `/products/${p.slug}`, name: p.name })));
  return (
    <div className="collection-page">
      <JsonLd nodes={[...pageNodes(lang, path, info?.name || all, info?.intro || t("探索 CHARM VILLA 的茶禮與工藝作品。", "Explore CHARM VILLA tea gifts and crafted pieces."), "CollectionPage", info ? [{ path: "/collections/all", name: all }] : [], { mainEntity: ref(String(schemaList["@id"])) }), schemaList]} />
      <nav className="catalog-breadcrumb tc" aria-label={t("麵包屑", "Breadcrumb")}><Link href={localeHref(lang, "/")}>{t("首頁", "Home")}</Link><span aria-hidden="true">/</span>{info && <><Link href={categoryHref("all", lang)}>{all}</Link><span aria-hidden="true">/</span></>}<span aria-current="page">{info?.name || all}</span></nav>
      {/* English pages: the display heading already is the category name, so the Chinese-name line is not repeated. */}
      <header className="collection-heading"><div><h1>{info?.en || "ALL PIECES"}<sup>{String(list.length).padStart(2, "0")}</sup></h1></div><div className="collection-heading-copy">{(lang === "zh" || !info) && <h2 className="tc">{info?.name || t("藝術即生活", "Art as Life")}</h2>}<p className="tc">{info?.intro || t("探索小金魚茶禮、檜木器物與柴燒筷架。細看它們的質地與造型，讓藝術以小小的方式走進日常。", "Discover goldfish tea gifts, hinoki wood pieces and wood-fired chopstick rests. Look closely at their textures and forms, and find small ways to bring art into everyday life.")}</p></div></header>
      <nav className="collection-categories" aria-label={t("商品分類", "Categories")}><Link href={categoryHref("all", lang)} aria-current={category === "all" ? "page" : undefined} className="tc">{t("全部", "All")} <span>{getProducts(lang).length}</span></Link>{getCategories(lang).map((c) => <Link key={c.id} href={categoryHref(c.id, lang)} aria-current={category === c.id ? "page" : undefined} className="tc">{c.name} <span>{getCategoryProducts(c.id, lang).length}</span></Link>)}</nav>
      <CollectionBrowser key={category} products={list} />
    </div>
  );
}
