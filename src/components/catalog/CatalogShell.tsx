import Header from "@/components/chrome/Header";
import SiteFooter from "@/components/chrome/SiteFooter";
import { translator, type Locale } from "@/i18n/config";

export default function CatalogShell({ children, lang }: { children: React.ReactNode; lang: Locale }) {
  const t = translator(lang);
  return (
    <div className="catalog-shell">
      <a href="#catalog-main" className="catalog-skip">{t("跳至商品內容", "Skip to content")}</a>
      <Header innerPage />
      <main id="catalog-main" tabIndex={-1}>{children}</main>
      <SiteFooter lang={lang} />
    </div>
  );
}
