// The one footer of the site, after the footer of verin-template.webflow.io (user 2026-10-02: 「footer 也高度學習」): on an
// ink ground, four link columns under small spaced capitals at the left, the newsletter at the right; a rule, then the
// copyright line and the social icons; and across the full width at the foot, the CHARM VILLA wordmark (traced to SVG from the
// official PNG so it stays sharp at this size). The homepage and every inner page render this component.
import Link from "next/link";
import { getCategories, categoryHref } from "@/data/catalog";
import SocialLinks from "@/components/ui/SocialLinks";
import NewsletterForm from "./NewsletterForm";
import { localeHref, translator, type Locale } from "@/i18n/config";

export default function SiteFooter({ lang, home = false }: { lang: Locale; home?: boolean }) {
  const t = translator(lang);
  // On the homepage the page scrolls inside its own container, so links to the page itself must be in-page anchors that the
  // scroller handles (a link to "/" there did nothing — found 2026-10-05 when the user asked for the footer links to work).
  const homeHref = home ? "#hero" : localeHref(lang, "/");
  const storesHref = home ? "#visit" : localeHref(lang, "/#visit");
  const columns = [
    { label: t("作品", "Collections"), links: [{ href: categoryHref("all", lang), label: t("全部作品", "All Pieces") }, ...getCategories(lang).map((c) => ({ href: categoryHref(c.id, lang), label: c.name }))] },
    { label: t("品牌", "Company"), links: [
      { href: homeHref, label: t("首頁", "Home") }, { href: localeHref(lang, "/about"), label: t("關於", "About") },
      { href: localeHref(lang, "/news"), label: t("最新消息", "News") }, { href: storesHref, label: t("門市", "Our Stores") },
      { href: localeHref(lang, "/account"), label: t("會員", "Account") }] },
    { label: t("購物說明", "Help"), links: [
      { href: localeHref(lang, "/shopping-guide"), label: t("購物須知", "Shopping guide") }, { href: localeHref(lang, "/shopping-guide#shipping"), label: t("運送", "Delivery") },
      { href: localeHref(lang, "/shopping-guide#returns"), label: t("退換貨", "Returns") }, { href: localeHref(lang, "/shopping-guide#service"), label: t("客服", "Customer service") }] },
    { label: t("條款", "Legal"), links: [
      { href: localeHref(lang, "/privacy"), label: t("隱私權政策", "Privacy policy") }, { href: localeHref(lang, "/shopping-guide#payment"), label: t("服務條款", "Terms of sale") }] },
  ];
  return (
    <footer className="catalog-footer site-footer-v2">
      <div className="footer-top">
        <nav className="footer-columns" aria-label={t("頁尾導覽", "Footer navigation")}>
          {columns.map((col) => (
            <div key={col.label}>
              <p className="footer-label">{col.label}</p>
              <ul>{col.links.map((l) => <li key={l.href + l.label}><Link href={l.href} className="tc">{l.label}</Link></li>)}</ul>
            </div>
          ))}
        </nav>
        <div className="footer-news">
          <p className="footer-news-title tc">{t("訂閱電子報", "Stay in the loop")}</p>
          <p className="footer-news-text tc">{t("新品、限定禮盒與活動消息，第一時間寄給你。", "New pieces, limited gift boxes and events, straight to your inbox.")}</p>
          <NewsletterForm />
          <p className="footer-label footer-news-note">{t("不寄垃圾信，只有新品與活動消息。", "No spam. Only new pieces and events.")}</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="tc">© 2026 CHARM VILLA. {t("版權所有。", "All rights reserved.")}</p>
        <SocialLinks lang={lang} className="footer-social" />
      </div>
      <Link href={homeHref} className="footer-wordmark" aria-label={t("CHARM VILLA 首頁", "CHARM VILLA home")}>
        {/* eslint-disable-next-line @next/next/no-img-element -- an SVG wordmark, no optimisation needed */}
        <img src="/brand/charmvilla-wordmark.svg" alt="" width={3716} height={328} />
      </Link>
    </footer>
  );
}
