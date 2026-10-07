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
  return { title: t("加州 65 號提案警語｜CHARM VILLA", "California Proposition 65 Warning | CHARM VILLA"), description: t("CHARM VILLA 商品的加州 65 號提案警語。", "The California Proposition 65 warning for CHARM VILLA products."), alternates: alternatesFor(lang, "/prop65") };
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { prop65: doc, labels } = getCommerce(lang);
  return <PolicyPage title={doc.title} intro={doc.intro} updated={doc.updated} sections={doc.sections} labels={labels} />;
}
