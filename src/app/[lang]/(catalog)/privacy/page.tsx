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
  return { title: t("隱私權政策｜CHARM VILLA", "Privacy policy | CHARM VILLA"), description: t("CHARM VILLA 如何蒐集、使用與保護您的個人資料。", "How CHARM VILLA collects, uses and protects your personal data."), alternates: alternatesFor(lang, "/privacy") };
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { privacy, labels, updated } = getCommerce(lang);
  return <PolicyPage title={privacy.title} intro={privacy.intro} updated={updated} sections={privacy.sections} labels={labels} />;
}
