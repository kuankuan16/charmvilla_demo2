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
  return { title: t("常見問題｜CHARM VILLA", "FAQ | CHARM VILLA"), description: t("關於小金魚茶包、沖泡、產品保養與訂單的常見問題。", "Answers to common questions about Goldfish Tea Bags, brewing, product care, and orders."), alternates: alternatesFor(lang, "/faq") };
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { faq: doc } = getCommerce(lang);
  const t = translator(lang);
  // an accordion since 2026-10-07 (user: 「可以點開才回答的形式，不要一下就看這麼多字」); the other policy pages keep PolicyPage
  return <FaqAccordion title={doc.title} intro={doc.intro} sections={doc.sections} contact={{ label: t("聯絡我們", "Contact us"), href: `mailto:${supportEmail}` }} />;
}
