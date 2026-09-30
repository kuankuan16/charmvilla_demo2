"use client";
// Preloader — closely modelled on davidlaxer.com/about (user 2026-09-30):
//   desktop  the official CHARM VILLA wordmark rises through the bottom-left corner letter by letter (yPercent 150 → -150,
//            power4.out, 1.5 s, stagger .05). Letters are slices of the official PNG (a sprite), never typed text,
//            then the whole overlay wipes to its left edge with a clip-path (power3.inOut, 1.1 s). The page becomes
//            visible and the hero headline's split characters start at the same instant the wipe begins.
//   mobile   no digits (below 768 px), only the wipe.
// Scrolling stays locked until the wipe has finished. Reduced motion skips everything.
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/motion/scroller";
import { brand } from "@/data/content";

// Column boundaries (px, in the 929×82 official PNG) at the midpoints of the gaps between the ten letters C H A R M V I L L A.
const LOGO_W = 929;
const LETTER_BOUNDS = [0, 114, 206, 323, 406, 548, 663, 692, 762, 823, LOGO_W];
const FULL = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
const COLLAPSED = "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)";

export default function Preloader({ onReveal, onComplete }: { onReveal: () => void; onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const revealed = useRef(false);
  const done = useRef(false);

  useEffect(() => {
    const el = root.current!;
    const reveal = () => { if (revealed.current) return; revealed.current = true; onReveal(); };
    const finish = () => { if (done.current) return; done.current = true; reveal(); onComplete(); };
    if (prefersReducedMotion()) { finish(); return; }
    const chars = el.querySelectorAll<HTMLElement>("[data-mark] .ch");
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
        <div className="site-header-inner"><span /><span className="header-brand block"><img src={brand.logo.src} alt="" className="h-auto w-full" draggable={false} /></span><span /></div>
      </div>
      <div data-mark="" className="preloader-mark">
        {LETTER_BOUNDS.slice(0, -1).map((x0, i) => {
          const x1 = LETTER_BOUNDS[i + 1];
          return <span key={x0} className="ch" style={{ width: `calc(var(--lw) * ${((x1 - x0) / LOGO_W).toFixed(5)})`, backgroundPosition: `calc(var(--lw) * ${(-x0 / LOGO_W).toFixed(5)}) 0` }} />;
        })}
      </div>
      <div data-preloader-part="left" className="relative grid h-full bg-page" />
      <div data-preloader-part="right" className="relative hidden h-full bg-gold md:grid" />
    </div>
  );
}
