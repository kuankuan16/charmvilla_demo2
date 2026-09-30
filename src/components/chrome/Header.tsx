"use client";
// Fixed 50px header (reference: [data-header] fixed top-0 h-50 z-30) with the stepped full-screen menu.
// Menu panels reveal with clip-path (.5s cubic-bezier(.3,.86,.36,.95)) and staggered delays.
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { brand, sections } from "@/data/content";
import { getScroller } from "@/lib/motion/scroller";

export default function Header({ innerPage = false }: { innerPage?: boolean }) {
  const [open, setOpen] = useState(false);
  const sectionHref = (id: string) => id === "hero" || id === "visit" ? `${innerPage ? "/" : ""}#${id}` : `/collections/${id}`;
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

  const navItems = sections.filter((s) => s.id !== "hero");

  return (
    <header data-header="" className={`fixed left-0 top-0 z-30 h-50 w-full ${open ? "menu--opened" : ""}`}>
      <div className="site-header-inner">
        <a href={sectionHref("hero")} aria-label="CHARM VILLA — 回到首頁" className="relative z-40 block h-12 w-[136px] shrink-0" onClick={() => setOpen(false)}>
          <img src={brand.logo.src} alt="" className="h-full w-full" draggable={false} />
        </a>
        <nav className={`hero-nav relative z-40 hidden items-center transition-opacity duration-300 laptop:flex ${open ? "pointer-events-none opacity-0" : ""}`} aria-label="主要">
          <Link href="/collections/all" className="link-underline">All Objects</Link>
          {navItems.slice(0, 4).map((s) => (
            <a key={s.id} href={sectionHref(s.id)} className="link-underline">{s.label === "Leather bag" ? "Leather Bag" : s.label}</a>
          ))}
          <span className="hero-nav-divider" aria-hidden="true" />
          <a href={sectionHref("visit")} className="link-underline">Get in Touch</a>
        </nav>
        <button ref={openerRef} data-menu-opener="" type="button" aria-expanded={open} aria-controls="site-menu" aria-label={open ? "關閉選單" : "開啟選單"} className="relative z-40 flex h-24 w-26 flex-col justify-between py-3 laptop:hidden" onClick={() => setOpen((v) => !v)}>
          <span className={`block h-3 w-full transition-transform duration-300 ${open ? "translate-y-[8.5px] rotate-45 bg-paper" : "bg-ink"}`} />
          <span className={`block h-3 w-full transition-opacity duration-200 ${open ? "opacity-0" : "bg-ink"}`} />
          <span className={`block h-3 w-full transition-transform duration-300 ${open ? "-translate-y-[8.5px] -rotate-45 bg-paper" : "bg-ink"}`} />
        </button>
        <button type="button" aria-expanded={open} aria-controls="site-menu" className="relative z-40 ml-30 hidden h-24 w-26 flex-col justify-between py-3 laptop:flex" aria-label={open ? "關閉選單" : "開啟選單"} onClick={() => setOpen((v) => !v)}>
          <span className={`block h-3 w-full transition-transform duration-300 ${open ? "translate-y-[8.5px] rotate-45 bg-paper" : "bg-ink"}`} />
          <span className={`block h-3 w-full transition-opacity duration-200 ${open ? "opacity-0" : "bg-ink"}`} />
          <span className={`block h-3 w-full transition-transform duration-300 ${open ? "-translate-y-[8.5px] -rotate-45 bg-paper" : "bg-ink"}`} />
        </button>
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
            <li><Link href="/collections/all" onClick={close} className="tc text-2xl text-paper">全部商品</Link></li>
            {navItems.map((s) => (
              <li key={s.id}><a href={sectionHref(s.id)} onClick={close} className="flex items-baseline gap-14 text-4xl font-bold leading-none text-paper"><span>{s.label}</span><span className="tc text-base font-medium opacity-70">{s.zh}</span></a></li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
