import type { Metadata } from "next";
import AccountClient from "@/components/account/AccountClient";
import { alternatesFor, defaultLocale, isLocale, translator } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isLocale(raw) ? raw : defaultLocale;
  const t = translator(lang);
  return {
    title: t("會員｜CHARM VILLA", "Account | CHARM VILLA"),
    description: t("登入或註冊 CHARM VILLA 會員，管理個人資料、地址與訂單。", "Sign in or create a CHARM VILLA account to manage your details, addresses and orders."),
    alternates: alternatesFor(lang, "/account"),
  };
}

export default function AccountPage() {
  return <main id="catalog-main" className="account-page" tabIndex={-1}><AccountClient /></main>;
}
