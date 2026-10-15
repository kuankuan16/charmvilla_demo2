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
  return pageMetadata({ lang, path: "/privacy", title: t("隱私權政策｜CHARM VILLA", "Privacy Policy | CHARM VILLA"), description: t("CHARM VILLA 如何蒐集、使用與揭露您的個人資料。", "How CHARM VILLA collects, uses and discloses your personal information.") });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { privacy: doc, labels } = getCommerce(lang);
  // the same two-level accordion as the FAQ (user 2026-10-07: 「其他很多資訊的頁面也都用相同的邏輯設計」), without the contact button (「這幾頁的聯絡我們的按鈕可以刪」)
  return <><JsonLd nodes={pageNodes(lang, "/privacy", doc.title, doc.intro ?? doc.title)} /><FaqAccordion title={doc.title} intro={doc.intro} updated={doc.updated} sections={doc.sections} labels={labels} /></>;
}
