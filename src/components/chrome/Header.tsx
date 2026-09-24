"use client";
// Fixed 50px header (reference: [data-header] fixed top-0 h-50 z-30) with the stepped full-screen menu.
// Menu panels reveal with clip-path (.5s cubic-bezier(.3,.86,.36,.95)) and staggered delays.
import { useCallback, useEffect, useRef, useState } from "react";
import { brand, sections } from "@/data/content";
import { getScroller } from "@/lib/motion/scroller";

export default function Header() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const s = getScroller();
    if (open) {
      s?.stop();
      const first = panelRef.current?.querySelector<HTMLElement>("a, button");
      window.setTimeout(() => first?.focus(), 350);
    } else {
      if (document.documentElement.classList.contains("is-loaded")) s?.start();
      openerRef.current?.focus({ preventScroll: true });
    }
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
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const navItems = sections.filter((s) => s.id !== "hero");

  return (
    <header data-header="" className={`fixed left-0 top-0 z-30 h-50 w-full ${open ? "menu--opened" : ""}`}>
      <div className="container-x flex h-full items-center justify-between">
        <a href="#hero" aria-label="CHARM VILLA — 回到頂端" className="relative z-40 block h-12 w-[136px]" onClick={() => setOpen(false)}>
          <img src={brand.logo.src} alt="" className="h-full w-full" draggable={false} />
        </a>
        <nav className={`relative z-40 hidden items-center gap-30 text-xs font-bold transition-opacity duration-300 laptop:flex ${open ? "pointer-events-none opacity-0" : ""}`} aria-label="主要">
          {navItems.slice(0, 4).map((s) => (
            <a key={s.id} href={`#${s.id}`} className={`group flex items-center gap-8 ${open ? "text-paper" : ""}`}>
              <span className="dot scale-75" /> <span className="link-underline">{s.label}</span>
            </a>
          ))}
          <a href="#visit" className={`group flex items-center gap-8 ${open ? "text-paper" : ""}`}>
            <span aria-hidden="true">↳</span> <span className="link-underline">GET IN TOUCH</span>
          </a>
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

      <div id="site-menu" ref={panelRef} data-menu="" role="dialog" aria-modal="true" aria-label="選單" className={`menu-root absolute left-0 top-0 h-screen w-full bg-ink text-ink ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
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
              <div key={s.id} className="menu-panel absolute hidden border-l border-t border-ink/15 bg-white laptop:block" style={{ top: `${top}%`, left: `${left}%`, right: 0, height: `${100 - top}%`, transitionDelay: open ? `${0.1 + i * 0.08}s` : `${(rows - i) * 0.05}s` }}>
                <a href={`#${s.id}`} onClick={close} className="menu-fade group absolute left-30 top-40 flex items-center gap-20 whitespace-nowrap text-4xl font-bold leading-none" style={{ transitionDelay: open ? `${0.3 + i * 0.08}s` : "0s" }}>
                  <span className="link-underline">{s.label}</span>
                  <span className="tc text-base font-medium opacity-60">{s.zh}</span>
                </a>
              </div>
            );
          })}
          {/* mobile list */}
          <ul className="menu-fade absolute left-25 top-95 flex flex-col gap-24 laptop:hidden" style={{ transitionDelay: open ? ".2s" : "0s" }}>
            {navItems.map((s) => (
              <li key={s.id}><a href={`#${s.id}`} onClick={close} className="flex items-baseline gap-14 text-4xl font-bold leading-none text-paper"><span>{s.label}</span><span className="tc text-base font-medium opacity-70">{s.zh}</span></a></li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
