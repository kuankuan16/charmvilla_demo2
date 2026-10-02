// The one footer of the site (user 2026-10-01: 「footer 我想要用內頁的版型，首頁請跟進」): the statement, the category links and About,
// then the white wordmark, the copyright line and the social icons. The homepage and every inner page render this component.
import Image from "next/image";
import Link from "next/link";
import { brand } from "@/data/content";
import { getCommerce } from "@/data/commerce";
import { getCategories, categoryHref } from "@/data/catalog";
import SocialLinks from "@/components/ui/SocialLinks";
import { localeHref, translator, type Locale } from "@/i18n/config";

export default function SiteFooter({ lang }: { lang: Locale }) {
  const t = translator(lang);
  const { footer } = getCommerce(lang);
  return (
    <footer className="catalog-footer">
      <div className="catalog-footer-top"><p className="catalog-footer-statement tc">{t("藝術即生活", "Art as Life")}</p><div><nav aria-label={t("頁尾導覽", "Footer navigation")}><Link href={categoryHref("all", lang)} className="tc">{t("全部作品", "All Pieces")}</Link>{getCategories(lang).map((c) => <Link key={c.id} href={categoryHref(c.id, lang)} className="tc">{c.name}</Link>)}<Link href={localeHref(lang, "/about")} className="tc">{t("關於", "About")}</Link></nav></div></div>
      {/* The shopping rules on every page (2026-10-02). The seller's identity line was removed from the footer at the user's request
          (「刪」); it stays in full on the shopping guide's 賣家資訊 section (消保法 §18). */}
      <div className="catalog-footer-legal"><nav aria-label={t("購物說明", "Shopping information")}>{footer.links.map((l) => <Link key={l.href} href={localeHref(lang, l.href)} className="tc">{l.label}</Link>)}</nav></div>
      <div className="catalog-footer-bottom"><Link href={localeHref(lang, "/")} aria-label={t("CHARM VILLA 首頁", "CHARM VILLA home")}><Image src={brand.logo.src} alt="CHARM VILLA" width={brand.logo.w} height={brand.logo.h} className="brightness-0 invert" /></Link><span>© 2026 CHARM VILLA</span><SocialLinks lang={lang} /></div>
    </footer>
  );
}
