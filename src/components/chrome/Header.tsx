"use client";
// Fixed header bar with the menu after solena-template.webflow.io (user 2026-10-02: 「漢堡選單…高度模仿並推理成我們適合用的」):
// the bar stays in place; a page-coloured panel drops down from under it (clip-path, ~0.4 s), the rest of the page dims and
// closes the menu on click. Panel: large category links in a row with secondary links under them, two cards at the right
// (the Goldfish Tea Gifts with their awards, and the brand story), then a ruled row of the two stores, customer service and
// the social icons. The button is a thin circle with two offset lines that cross into an X, its label rolling Menu → Close.
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { brand, sections, getContent, site } from "@/data/content";
import { getCommerce } from "@/data/commerce";
import SocialLinks from "@/components/ui/SocialLinks";
import { useT } from "@/i18n/LocaleProvider";
import { localeHref, switchLocalePath, htmlLang, type Locale } from "@/i18n/config";
import CartButton from "@/components/cart/CartButton";
import { getScroller } from "@/lib/motion/scroller";

export default function Header({ innerPage = false }: { innerPage?: boolean }) {
  const [open, setOpen] = useState(false);
  const { lang, t } = useT();
  const zh = lang === "zh";
  const sectionHref = (id: string) => id === "account" ? localeHref(lang, "/account") : id === "about" ? localeHref(lang, "/about") : id === "hero" || id === "visit" ? (innerPage ? localeHref(lang, `/#${id}`) : `#${id}`) : localeHref(lang, `/collections/${id}`);
  // Language switch: the same page in the other language. A plain link (full load) so <html lang> and the page copy change together;
  // on the homepage the one-shot flag keeps the preloader from replaying.
  const other: Locale = zh ? "en" : "zh";
  const switchHref = switchLocalePath(usePathname(), other);
  const switchProps = { href: switchHref, hrefLang: htmlLang[other], lang: htmlLang[other], "data-locale-switch": other, onClick: () => { if (!innerPage) { try { sessionStorage.setItem("cv-skip-preloader", "1"); } catch { /* ignore */ } } } };
  const switchName = zh ? "English" : "中文";
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const previouslyOpen = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const s = getScroller();
    const previousOverflow = document.body.style.overflow;
    if (innerPage && open) document.body.style.overflow = "hidden";
    if (open) {
      s?.stop();
      const first = panelRef.current?.querySelector<HTMLElement>("a, button");
      window.setTimeout(() => first?.focus(), 350);
    } else {
      if (document.documentElement.classList.contains("is-loaded")) s?.start();
      if (previouslyOpen.current) openerRef.current?.focus({ preventScroll: true });
    }
    previouslyOpen.current = open;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) close();
      if (e.key === "Tab" && open && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("a, button");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = previousOverflow; };
  }, [open, close, innerPage]);

  // Primary: every product category; secondary: about, stores, account, the shopping guide and the language.
  const primary = [{ id: "all", label: "All Objects", zh: "全部商品" } as const, ...sections.filter((s) => s.id !== "hero" && s.id !== "visit")];
  const secondary = [
    { href: sectionHref("about"), label: t("關於 CHARM VILLA", "About CHARM VILLA") },
    { href: sectionHref("visit"), label: t("門市資訊", "Our stores") },
    { href: sectionHref("account"), label: t("會員", "Account") },
    { href: localeHref(lang, "/shopping-guide"), label: t("購物須知", "Shopping guide") },
  ];
  const { visit } = getContent(lang);
  const shops = visit.tabs.find((tab) => tab.id === "shops")?.shops ?? [];
  const { company } = getCommerce(lang);
  const teaCard = site("ottoman-tray-tea-cup-v4.webp", t("木托盤上一杯小金魚茶，金色茶標寫著 CHARM VILLA", "A cup of goldfish tea on a wooden tray, its gold tag reading CHARM VILLA"), 1792, 2240);

  return (
    <header data-header="" className={`site-header fixed left-0 top-0 z-30 w-full ${open ? "menu--opened" : ""}`}>
      {/* Bang & Olufsen-style bar (user 2026-09-30): Menu on the left, the official wordmark centred, tools on the right. It stays in place while the menu is open. */}
      <div className="site-header-inner">
        <button ref={openerRef} data-menu-opener="" type="button" aria-expanded={open} aria-controls="site-menu" aria-label={open ? t("關閉選單", "Close menu") : t("開啟選單", "Open menu")} className="header-menu-btn relative z-40 text-ink" onClick={() => setOpen((v) => !v)}>
          <span className="menu-icon" aria-hidden="true"><span /><span /></span>
          <span className="menu-label" aria-hidden="true"><span>Menu</span><span>Close</span></span>
        </button>
        <Link href={innerPage ? localeHref(lang, "/") : "#hero"} aria-label={t("CHARM VILLA — 回到首頁", "CHARM VILLA, back to home")} className="header-brand relative z-40 block" onClick={() => setOpen(false)}>
          <img src={brand.logo.src} alt="" className="h-auto w-full" draggable={false} />
        </Link>
        <div className="header-tools relative z-40 text-ink">
          <a {...switchProps} className="header-lang tc" aria-label={zh ? "Switch to English" : "切換為中文"}>{zh ? "EN" : "中文"}</a>
          <a href={sectionHref("visit")} aria-label={t("門市資訊", "Store information")} title={t("門市資訊", "Store information")} onClick={() => setOpen(false)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
          </a>
          <Link href={localeHref(lang, "/account")} aria-label={t("會員", "Account")} title={t("會員", "Account")} onClick={() => setOpen(false)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
          </Link>
          <CartButton />
        </div>
      </div>

      {/* the page under the panel dims; a click there closes the menu */}
      <button type="button" className="menu-scrim" aria-hidden="true" tabIndex={-1} onClick={close} />
      <div id="site-menu" ref={panelRef} data-menu="" role="dialog" aria-modal="true" aria-label={t("選單", "Menu")} className="menu-root" aria-hidden={!open} inert={!open}>
        <div className="menu-top">
          <nav className="menu-nav" aria-label={t("商品分類", "Categories")}>
            <ul className="menu-primary">
              {primary.map((s) => <li key={s.id}><a href={sectionHref(s.id)} onClick={close} className="menu-link tc">{zh ? s.zh : s.label}</a></li>)}
            </ul>
            <ul className="menu-secondary">
              {secondary.map((l) => <li key={l.href}><a href={l.href} onClick={close} className="tc">{l.label}</a></li>)}
              <li><a {...switchProps} className="tc">{switchName}</a></li>
            </ul>
          </nav>
          <a href={sectionHref("tea")} onClick={close} className="menu-card menu-card--feature">
            <span className="menu-card-image"><Image src={teaCard.src} alt={teaCard.alt} fill sizes="(min-width:1024px) 24vw, 90vw" /></span>
            <span className="menu-card-body">
              <span className="menu-card-title tc">{t("小金魚茶包禮盒", "Goldfish Tea Gifts")}</span>
              <span className="menu-card-meta"><span className="tc">{t("德國 iF・紅點設計獎", "iF and Red Dot awards")}</span><span className="menu-card-arrow" aria-hidden="true" /></span>
            </span>
          </a>
          <Link href={localeHref(lang, "/about")} onClick={close} className="menu-card menu-card--story">
            <span className="menu-card-circle" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M7 17 17 7M9 7h8v8" /></svg></span>
            <span className="menu-card-big tc">{zh ? <>品牌<br />故事</> : <>Our<br />story</>}</span>
          </Link>
        </div>
        <div className="menu-info">
          {shops.map((shop) => (
            <div key={shop.name}>
              <p className="menu-info-heading tc">{shop.name}</p>
              <p className="tc">{shop.addr}</p>
              <p className="tc">{shop.hours}{shop.phone && <> · <a href={`tel:${shop.phone.tel}`}>{shop.phone.label}</a></>}</p>
            </div>
          ))}
          <div>
            <p className="menu-info-heading tc">{t("客服", "Customer service")}</p>
            <p><a href={`mailto:${company.email}`}>{company.email}</a></p>
            <p className="tc">{company.phone}（{company.hours}）</p>
          </div>
          <SocialLinks lang={lang} className="menu-social" />
        </div>
      </div>
    </header>
  );
}
