// Landing page for the link in Shopify's reset email: /account/reset?url=<Shopify link> or /account/reset/<customer id>/<token>.
import type { Metadata } from "next";
import AccountLinkForm from "@/components/account/AccountLinkForm";
import { defaultLocale, isLocale, translator } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: raw } = await params;
  const t = translator(isLocale(raw) ? raw : defaultLocale);
  return {
    title: t("設定新密碼｜CHARM VILLA", "Set a new password | CHARM VILLA"),
    description: t("從重設密碼信件的連結設定新的 CHARM VILLA 會員密碼。", "Set a new password for your CHARM VILLA account from the link in the reset email."),
    robots: { index: false, follow: false }, // one-time personal link: kept out of search results
  };
}

export default async function Page({ params, searchParams }: { params: Promise<{ lang: string; token?: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ token }, query] = await Promise.all([params, searchParams]);
  const url = typeof query.url === "string" ? query.url : undefined;
  return <main id="catalog-main" className="account-page" tabIndex={-1}><AccountLinkForm kind="reset" segments={token ?? []} linkUrl={url} /></main>;
}
