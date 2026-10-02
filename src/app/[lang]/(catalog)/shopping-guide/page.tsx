import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PolicyPage from "@/components/catalog/PolicyPage";
import { getCommerce } from "@/data/commerce";
import { alternatesFor, defaultLocale, isLocale, translator } from "@/i18n/config";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isLocale(raw) ? raw : defaultLocale;
  const t = translator(lang);
  return { title: t("購物須知｜CHARM VILLA", "Shopping guide | CHARM VILLA"), description: t("CHARM VILLA 線上購物的付款、運送、退換貨、發票與客服說明。", "Payment, delivery, returns, invoices and customer service for CHARM VILLA online orders."), alternates: alternatesFor(lang, "/shopping-guide") };
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { guide, labels, updated } = getCommerce(lang);
  return <PolicyPage title={guide.title} intro={guide.intro} updated={updated} sections={guide.sections} labels={labels} />;
}
