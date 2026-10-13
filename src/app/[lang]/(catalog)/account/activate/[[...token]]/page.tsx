// Landing page for the link in Shopify's activate email: /account/activate?url=<Shopify link> or /account/activate/<customer id>/<token>.
import type { Metadata } from "next";
import AccountLinkForm from "@/components/account/AccountLinkForm";
import { defaultLocale, isLocale, translator } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: raw } = await params;
  const t = translator(isLocale(raw) ? raw : defaultLocale);
  return {
    title: t("啟用帳號｜CHARM VILLA", "Activate your account | CHARM VILLA"),
    description: t("從啟用信件的連結設定密碼，啟用 CHARM VILLA 會員帳號。", "Choose a password to activate your CHARM VILLA account from the link in the activation email."),
    robots: { index: false, follow: false }, // one-time personal link: kept out of search results
  };
}

export default async function Page({ params, searchParams }: { params: Promise<{ lang: string; token?: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ token }, query] = await Promise.all([params, searchParams]);
  const url = typeof query.url === "string" ? query.url : undefined;
  return <main id="catalog-main" className="account-page" tabIndex={-1}><AccountLinkForm kind="activate" segments={token ?? []} linkUrl={url} /></main>;
}
