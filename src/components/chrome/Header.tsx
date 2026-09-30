"use client";
// Fixed 50px header (reference: [data-header] fixed top-0 h-50 z-30) with the stepped full-screen menu.
// Menu panels reveal with clip-path (.5s cubic-bezier(.3,.86,.36,.95)) and staggered delays.
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { brand, sections } from "@/data/content";
import CartButton from "@/components/cart/CartButton";
import { getScroller } from "@/lib/motion/scroller";

export default function Header({ innerPage = false }: { innerPage?: boolean }) {
  const [open, setOpen] = useState(false);
  const sectionHref = (id: string) => id === "account" ? "/account" : id === "hero" || id === "visit" ? `${innerPage ? "/" : ""}#${id}` : `/collections/${id}`;
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

  // All navigation lives in the full-screen menu; "All Objects" leads, then the sections.
  const navItems = [{ id: "all", label: "All Objects", zh: "全部商品" } as const, ...sections.filter((s) => s.id !== "hero"), { id: "account", label: "Account", zh: "會員" } as const];

  return (
    <header data-header="" className={`fixed left-0 top-0 z-30 h-50 w-full ${open ? "menu--opened" : ""}`}>
      {/* Bang & Olufsen-style bar (user 2026-09-30): Menu on the left, the official wordmark centred, tools on the right. */}
      <div className="site-header-inner">
        <button ref={openerRef} data-menu-opener="" type="button" aria-expanded={open} aria-controls="site-menu" aria-label={open ? "關閉選單" : "開啟選單"} className={`header-menu-btn relative z-40 ${open ? "text-paper" : "text-ink"}`} onClick={() => setOpen((v) => !v)}>
          <span className="header-menu-lines" aria-hidden="true">
            <span className={`transition-transform duration-300 ${open ? "translate-y-[3.25px] rotate-45" : ""}`} />
            <span className={`transition-transform duration-300 ${open ? "-translate-y-[3.25px] -rotate-45" : ""}`} />
          </span>
          <span>{open ? "Close" : "Menu"}</span>
        </button>
        <a href={sectionHref("hero")} aria-label="CHARM VILLA — 回到首頁" className={`header-brand relative z-40 block transition-opacity duration-300 ${open ? "pointer-events-none opacity-0" : ""}`} onClick={() => setOpen(false)}>
          <img src={brand.logo.src} alt="" className="h-auto w-full" draggable={false} />
        </a>
        <div className={`header-tools relative z-40 text-ink transition-opacity duration-300 ${open ? "pointer-events-none opacity-0" : ""}`}>
          <a href={sectionHref("visit")} aria-label="門市資訊" title="門市資訊" onClick={() => setOpen(false)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.4" /></svg>
          </a>
          <Link href="/account" aria-label="會員" title="會員" onClick={() => setOpen(false)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
          </Link>
          <CartButton />
        </div>
      </div>

      <div id="site-menu" ref={panelRef} data-menu="" role="dialog" aria-modal="true" aria-label="選單" className={`menu-root absolute left-0 top-0 h-screen w-full bg-ink text-ink ${open ? "" : "pointer-events-none"}`} aria-hidden={!open} inert={!open}>
        {/* stepped panels (desktop): CLOSE strip, then three offset paper panels revealed right-to-left */}
        <div className="relative h-full w-full">
          <div className="menu-panel absolute right-0 top-0 hidden h-[77%] w-2/3 bg-white laptop:block" style={{ transitionDelay: open ? "0s" : ".2s" }}>
            <button type="button" onClick={close} className="menu-fade absolute left-30 top-40 text-19xl font-bold leading-xxs tracking-tightest text-ink" style={{ transitionDelay: open ? ".25s" : "0s" }}>CLOSE</button>
          </div>
          {navItems.map((s, i) => {
            const rows = navItems.length;
            // Reference geometry: panels step down-left (tops 30%→77%, lefts 78%→0.3% for 3 items).
            const top = 30 + (i / rows) * 60;
            const left = rows > 1 ? 70 - i * (64 / (rows - 1)) : 6;
            return (
              <div key={s.id} className="menu-panel absolute hidden bg-white laptop:block" style={{ top: `${top}%`, left: `${left}%`, right: 0, height: `${100 - top}%`, transitionDelay: open ? `${0.1 + i * 0.08}s` : `${(rows - i) * 0.05}s` }}>
                <a href={sectionHref(s.id)} onClick={close} className="menu-fade group absolute left-30 top-40 flex items-center gap-20 whitespace-nowrap text-4xl font-bold leading-none" style={{ transitionDelay: open ? `${0.3 + i * 0.08}s` : "0s" }}>
                  <span className="link-underline">{s.label}</span>
                  <span className="tc text-base font-medium opacity-60">{s.zh}</span>
                </a>
              </div>
            );
          })}
          {/* mobile list */}
          <ul className="menu-fade absolute left-[var(--page-gutter)] top-95 flex flex-col gap-24 laptop:hidden" style={{ transitionDelay: open ? ".2s" : "0s" }}>
            {navItems.map((s) => (
              <li key={s.id}><a href={sectionHref(s.id)} onClick={close} className="flex items-baseline gap-14 text-4xl font-bold leading-none text-paper"><span>{s.label}</span><span className="tc text-base font-medium opacity-70">{s.zh}</span></a></li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
