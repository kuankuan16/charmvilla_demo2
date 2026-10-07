import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FaqAccordion from "@/components/catalog/FaqAccordion";
import { getCommerce, supportEmail } from "@/data/commerce";
import { alternatesFor, defaultLocale, isLocale, translator } from "@/i18n/config";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isLocale(raw) ? raw : defaultLocale;
  const t = translator(lang);
  return { title: t("服務條款｜CHARM VILLA", "Terms of Service | CHARM VILLA"), description: t("使用 CHARM VILLA 網站與購買商品的條款。", "The terms that govern the use of the CHARM VILLA website and the purchase of its products."), alternates: alternatesFor(lang, "/terms") };
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { terms: doc, labels } = getCommerce(lang);
  const t = translator(lang);
  // the same two-level accordion as the FAQ (user 2026-10-07: 「其他很多資訊的頁面也都用相同的邏輯設計」)
  return <FaqAccordion title={doc.title} intro={doc.intro} updated={doc.updated} sections={doc.sections} labels={labels} contact={{ label: t("聯絡我們", "Contact us"), href: `mailto:${supportEmail}` }} />;
}
