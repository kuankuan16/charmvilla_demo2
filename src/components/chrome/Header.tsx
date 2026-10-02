"use client";
// Fixed header bar with the menu after solena-template.webflow.io (user 2026-10-02: 「漢堡選單…高度模仿並推理成我們適合用的」):
// the bar stays in place; a page-coloured panel drops down from under it (clip-path, ~0.4 s), the rest of the page dims and
// closes the menu on click. The button is two thin lines that cross into an X, its label rolling Menu → Close.
// Panel (user 2026-10-02: 「選單想要分幾欄呈現，用 UI 設計師的角度給我優化主要與次要的群組關係，並通通改成全黑，hover 才變成金色加底線」,
// and after loewe.com: 「hover 每一類別時會換右邊的圖」): the shop links are the primary group, set large in two labelled
// columns (product types, then collections); the brand and service links are the secondary group, small, in a third column;
// a tall photograph at the right changes to the hovered (or focused) category. All text is black; hover/focus turns gold
// with a gold underline.
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { brand, sections } from "@/data/content";
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
  const pathname = usePathname();
  const switchHref = switchLocalePath(pathname, other);
  const switchProps = { href: switchHref, hrefLang: htmlLang[other], lang: htmlLang[other], "data-locale-switch": other, onClick: () => { if (!innerPage) { try { sessionStorage.setItem("cv-skip-preloader", "1"); } catch { /* ignore */ } } } };
  // Language: a globe among the header icons that opens a short list (user 2026-10-02: 「應該是坐在最上面 icon 選單旁邊，用地球的
  // icon 呈現，選了可以切換語系」; it replaced the EN link and the drop-down in the menu). Each language is named in itself.
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!langOpen) return;
    const onPointer = (e: PointerEvent) => { if (!langRef.current?.contains(e.target as Node)) setLangOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setLangOpen(false); globeRef.current?.focus(); } };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onPointer); document.removeEventListener("keydown", onKey); };
  }, [langOpen]);
  const thisLanguage = { code: lang, name: zh ? "繁體中文" : "English", href: pathname, current: true };
  const otherLanguage = { code: other, name: zh ? "English" : "繁體中文", href: switchHref, current: false };
  const languages = zh ? [thisLanguage, otherLanguage] : [otherLanguage, thisLanguage]; // always 繁體中文, then English
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

  // Primary: the shop, split into product types and collections. Secondary: the brand pages, then service (account, guide, language).
  type ShopId = "all" | (typeof sections)[number]["id"];
  const label = (id: ShopId) => id === "all" ? t("全部作品", "All Pieces") : (zh ? sections.find((s) => s.id === id)!.zh : sections.find((s) => s.id === id)!.label);
  const shopGroups: { title: string; ids: ShopId[] }[] = [
    { title: t("品項", "Shop"), ids: ["all", "tea", "scents", "jewelry"] },
    { title: t("系列", "Collections"), ids: ["bags", "abundance", "wood-fired"] },
  ];
  const brandLinks = [
    { href: sectionHref("about"), label: t("關於 CHARM VILLA", "About CHARM VILLA") },
    { href: localeHref(lang, "/news"), label: t("最新消息", "News") },
    { href: sectionHref("visit"), label: t("門市資訊", "Our stores") },
  ];
  const serviceLinks = [
    { href: sectionHref("account"), label: t("會員", "Account") },
    { href: localeHref(lang, "/shopping-guide"), label: t("購物須知", "Shopping guide") },
  ];
  // one photograph per category (all ≥ 1376 px wide); decorative, the link text names the category
  const previews: Record<ShopId, string> = {
    all: "/media/site/scene-pink-bag-armchair-2k-v2.webp", // the pink bag on the leather armchair (user 2026-10-02: 「全部作品用剛剛皮革在沙發上的圖」)
    tea: "/media/site/scene-leather-chair-goldfish-tea.webp", // the cup on the leather chair, foil tag with the CHARM VILLA lettering (user 2026-10-02)
    scents: "/media/site/scene-coffee-table-tea-coasters-tag.webp",
    jewelry: "/media/site/scene-diamond-goldfish-earring-profile-bw.webp",
    bags: "/media/hero/male-embracing-white-bag-v2-hd.webp", // the homepage slide (user 2026-10-02: 「換」), cropped to face, hand and bag
    abundance: "/media/site/studio-prosperity-dessert-stand-hd.webp",
    "wood-fired": "/media/gallery/CV-0242.webp", // the brand's own photograph of the bird rests (asset library, 2026-10-02)
    hero: "", visit: "",
  };
  // where a landscape photograph sits in the portrait frame
  const previewPosition: Partial<Record<ShopId, string>> = { bags: "65% 50%" };
  const [preview, setPreview] = useState<ShopId>("all");

  return (
    <header data-header="" className={`site-header fixed left-0 top-0 z-30 w-full ${open ? "menu--opened" : ""}`}>
      {/* Bang & Olufsen-style bar (user 2026-09-30): Menu on the left, the official wordmark centred, tools on the right. It stays in place while the menu is open. */}
      <div className="site-header-inner">
        <button ref={openerRef} data-menu-opener="" type="button" aria-expanded={open} aria-controls="site-menu" aria-label={open ? t("關閉選單", "Close menu") : t("開啟選單", "Open menu")} className="header-menu-btn relative z-40 text-ink" onClick={() => { setPreview("all"); setLangOpen(false); setOpen((v) => !v); }}>
          <span className="menu-icon" aria-hidden="true"><span /><span /></span>
          <span className="menu-label" aria-hidden="true"><span>Menu</span><span>Close</span></span>
        </button>
        <Link href={innerPage ? localeHref(lang, "/") : "#hero"} aria-label={t("CHARM VILLA — 回到首頁", "CHARM VILLA, back to home")} className="header-brand relative z-40 block" onClick={() => setOpen(false)}>
          <img src={brand.logo.src} alt="" className="h-auto w-full" draggable={false} />
        </Link>
        <div className="header-tools relative z-40 text-ink">
          <div ref={langRef} className={`header-lang-menu${langOpen ? " is-open" : ""}`}>
            <button ref={globeRef} type="button" className="header-globe" aria-label={t("切換語言", "Change language")} title={t("語言", "Language")} aria-expanded={langOpen} aria-controls="header-lang-list" onClick={() => setLangOpen((v) => !v)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" /></svg>
            </button>
            <ul id="header-lang-list" className="header-lang-list" hidden={!langOpen}>
              {languages.map((l) => (
                <li key={l.code}>
                  {l.current
                    ? <a href={l.href} aria-current="true" lang={htmlLang[l.code]} className="tc" onClick={(e) => { e.preventDefault(); setLangOpen(false); }}>{l.name}</a>
                    : <a {...switchProps} className="tc">{l.name}</a>}
                </li>
              ))}
            </ul>
          </div>
          <a href={sectionHref("visit")} className="header-stores" aria-label={t("門市資訊", "Store information")} title={t("門市資訊", "Store information")} onClick={() => setOpen(false)}>
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
          <nav className="menu-nav" aria-label={t("選單", "Menu")}>
            {shopGroups.map((group) => (
              <div key={group.title} className="menu-group menu-group--primary">
                <p className="menu-group-title tc">{group.title}</p>
                <ul>
                  {group.ids.map((id) => (
                    <li key={id}><a href={sectionHref(id)} onClick={close} onMouseEnter={() => setPreview(id)} onFocus={() => setPreview(id)} className="menu-link tc">
                      {/* English Copy Review 2026-10-02 (S03): the jewelry entry reads 「like a fish in water」 (如魚得水), with Jewelry beside the arrow */}
                      {id === "jewelry" && !zh ? <>like a fish in water<span className="menu-link-tag">Jewelry<span className="menu-link-arrow" aria-hidden="true" /></span></> : label(id)}
                    </a></li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="menu-group menu-group--secondary">
              <p className="menu-group-title tc">{t("品牌", "Brand")}</p>
              <ul>{brandLinks.map((l) => <li key={l.href}><a href={l.href} onClick={close} className="menu-sublink tc">{l.label}</a></li>)}</ul>
              <p className="menu-group-title menu-group-title--next tc">{t("服務", "Service")}</p>
              <ul>
                {serviceLinks.map((l) => <li key={l.href}><a href={l.href} onClick={close} className="menu-sublink tc">{l.label}</a></li>)}
              </ul>
            </div>
          </nav>
          <a href={sectionHref(preview)} onClick={close} className="menu-preview" tabIndex={-1} aria-hidden="true">
            {(Object.keys(previews) as ShopId[]).filter((id) => previews[id]).map((id) => (
              <span key={id} className={`menu-preview-image${id === preview ? " is-active" : ""}`}>
                <Image src={previews[id]} alt="" fill sizes="(min-width:1024px) 30vw, 1px" style={previewPosition[id] ? { objectPosition: previewPosition[id] } : undefined} />
              </span>
            ))}
            <span className="menu-preview-caption tc">{label(preview)}<span className="menu-card-arrow" /></span>
          </a>
        </div>
      </div>
    </header>
  );
}
