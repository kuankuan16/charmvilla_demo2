"use client";
// Preloader — closely modelled on davidlaxer.com/about (user 2026-09-30):
//   desktop  ©2026 digits rise through the bottom-left corner (yPercent 150 → -150, power4.out, 1.5 s, stagger .05),
//            then the whole overlay wipes to its left edge with a clip-path (power3.inOut, 1.1 s). The page becomes
//            visible and the hero headline's split characters start at the same instant the wipe begins.
//   mobile   no digits (below 768 px), only the wipe.
// Scrolling stays locked until the wipe has finished. Reduced motion skips everything.
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/motion/scroller";
import { brand, sections } from "@/data/content";

const YEAR = ["©", "2", "0", "2", "6"];
const FULL = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
const COLLAPSED = "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)";

export default function Preloader({ onReveal, onComplete }: { onReveal: () => void; onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const revealed = useRef(false);
  const done = useRef(false);
  const collections = sections.filter((s) => s.id !== "hero" && s.id !== "visit").slice(0, 4);

  useEffect(() => {
    const el = root.current!;
    const reveal = () => { if (revealed.current) return; revealed.current = true; onReveal(); };
    const finish = () => { if (done.current) return; done.current = true; reveal(); onComplete(); };
    if (prefersReducedMotion()) { finish(); return; }
    const chars = el.querySelectorAll<HTMLElement>("[data-year] .ch");
    const aboveTablet = window.matchMedia("(min-width: 768px)").matches;
    const tl = gsap.timeline({ paused: true, onComplete: finish });
    if (aboveTablet) tl.fromTo(chars, { yPercent: 150 }, { yPercent: -150, duration: 1.5, ease: "power4.out", stagger: 0.05 });
    else tl.to(el, { opacity: 1, duration: 0 });
    tl.add(reveal)
      .fromTo(el, { clipPath: FULL, webkitClipPath: FULL }, { clipPath: COLLAPSED, webkitClipPath: COLLAPSED, duration: 1.1, ease: "power3.inOut" });
    tl.play();
    const safety = window.setTimeout(finish, 6000);
    return () => { window.clearTimeout(safety); tl.kill(); };
  }, [onReveal, onComplete]);

  return (
    <div ref={root} data-component="preloader" className="preloader fixed inset-0 z-[200] grid h-screen w-full overflow-hidden bg-stone-deep md:grid-cols-2" aria-hidden="true">
      <div className="absolute left-0 top-0 z-30 h-50 w-full">
        <div className="site-header-inner"><span className="block h-12 w-[136px]"><img src={brand.logo.src} alt="" className="h-full w-full" draggable={false} /></span></div>
      </div>
      <div data-year="" className="preloader-year">{YEAR.map((c, i) => <span key={i} className="ch">{c}</span>)}</div>
      <div data-preloader-part="left" className="relative grid h-full bg-white">
        <div className="preloader-list">
          <p className="preloader-list-title"><span>Collections:</span></p>
          <div>{collections.map((s) => <p key={s.id}><span>{s.label}</span><span className="preloader-dot" /></p>)}</div>
        </div>
      </div>
      <div data-preloader-part="right" className="relative hidden h-full bg-gold md:grid" />
    </div>
  );
}
