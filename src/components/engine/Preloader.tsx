"use client";
// Preloader — official logo and two opening panels; no decorative year numerals.
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/motion/scroller";
import { brand } from "@/data/content";

export default function Preloader({ onReveal, onComplete }: { onReveal: () => void; onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = root.current!;
    const finish = () => { if (done.current) return; done.current = true; onReveal(); onComplete(); };
    if (prefersReducedMotion()) { finish(); return; }
    const left = el.querySelector<HTMLElement>("[data-preloader-part=left]")!;
    const right = el.querySelector<HTMLElement>("[data-preloader-part=right]")!;
    const logo = el.querySelector<HTMLElement>("[data-preloader-logo]")!;
    const tl = gsap.timeline({ onComplete: finish });
    tl.fromTo(logo, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: "expo.out" }, 0.55)
      .to(left, { xPercent: -200, duration: 1.8, ease: "expo.inOut" }, "-=0.2")
      .to(right, { xPercent: 200, duration: 1.8, ease: "expo.inOut" }, "<")
      .to(el, { opacity: 0, duration: 0.3 }, "-=0.3")
      // Reveal the headline while the curtains are opening, before static text can flash.
      .call(onReveal, [], 1.8);
    const safety = window.setTimeout(finish, 6000);
    return () => { window.clearTimeout(safety); tl.kill(); };
  }, [onReveal, onComplete]);

  return (
    <div ref={root} data-component="preloader" className="fixed inset-0 z-[200] grid h-screen w-full bg-gold md:grid-cols-2" aria-hidden="true">
      <div data-preloader-part="left" className="relative grid h-full bg-white">
        <div data-preloader-logo="" className="absolute left-25 top-1/2 w-[62%] -translate-y-1/2 lg:left-30" style={{ aspectRatio: String(brand.logo.ratio) }}>
          <img src={brand.logo.src} alt="" className="h-full w-full" draggable={false} />
        </div>
      </div>
      <div data-preloader-part="right" className="relative hidden h-full place-items-center bg-gold md:grid">
        <img src="/brand/goldfish-white.svg" alt="" className="absolute left-[38%] top-1/2 h-auto w-[28%] -translate-x-1/2 -translate-y-1/2" draggable={false} />
      </div>
    </div>
  );
}
