import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { pageNodes } from "@/lib/seo/schema";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FaqAccordion from "@/components/catalog/FaqAccordion";
import { getCommerce } from "@/data/commerce";
import { defaultLocale, isLocale, translator } from "@/i18n/config";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isLocale(raw) ? raw : defaultLocale;
  const t = translator(lang);
  return pageMetadata({ lang, path: "/prop65", title: t("加州 65 號提案警語｜CHARM VILLA", "California Proposition 65 Warning | CHARM VILLA"), description: t("CHARM VILLA 商品的加州 65 號提案警語。", "The California Proposition 65 warning for CHARM VILLA products.") });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { prop65: doc, labels } = getCommerce(lang);
  // the same two-level accordion as the FAQ (user 2026-10-07: 「其他很多資訊的頁面也都用相同的邏輯設計」), without the contact button (「這幾頁的聯絡我們的按鈕可以刪」)
  return <><JsonLd nodes={pageNodes(lang, "/prop65", doc.title, doc.intro ?? doc.title)} /><FaqAccordion title={doc.title} intro={doc.intro} updated={doc.updated} sections={doc.sections} labels={labels} /></>;
}
