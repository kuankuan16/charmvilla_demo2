"use client";
// 404 body. not-found.tsx receives no route params, so the locale comes from the provider in app/[lang]/layout.tsx.
import Link from "next/link";
import CatalogShell from "./CatalogShell";
import { useT } from "@/i18n/LocaleProvider";
import { localeHref } from "@/i18n/config";

export default function NotFoundView() {
  const { lang, t } = useT();
  return <CatalogShell lang={lang}><title>{t("找不到這個頁面｜CHARM VILLA", "Page not found | CHARM VILLA")}</title><section className="collection-empty catalog-not-found"><p className="catalog-eyebrow">404 / OBJECT NOT FOUND</p><h1 className="tc">{t("找不到這個頁面。", "This page could not be found.")}</h1><p className="tc">{t("回到作品清單，繼續欣賞 CHARM VILLA 的材質與工藝。", "Go back to the list of pieces and keep exploring the materials and craft of CHARM VILLA.")}</p><Link href={localeHref(lang, "/collections/all")} className="catalog-button tc">{t("瀏覽全部商品", "Browse all pieces")}</Link></section></CatalogShell>;
}
