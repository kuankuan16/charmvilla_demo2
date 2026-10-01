import { notFound } from "next/navigation";
import CatalogShell from "@/components/catalog/CatalogShell";
import { isLocale } from "@/i18n/config";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <CatalogShell lang={lang}>{children}</CatalogShell>;
}
