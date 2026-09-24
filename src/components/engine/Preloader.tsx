"use client";
// Preloader — two panels (white left, stone right), year characters rise through, then the panels
// slide away (reference timings: chars yPercent 150→-150 1.5s power4.out stagger .05; exits expo.inOut 1.8s).
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/motion/scroller";
import { brand } from "@/data/content";

const YEAR = "2026";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = root.current!;
    const finish = () => { if (done.current) return; done.current = true; onComplete(); };
    if (prefersReducedMotion()) { finish(); return; }
    const chars = el.querySelectorAll<HTMLElement>(".ch");
    const left = el.querySelector<HTMLElement>("[data-preloader-part=left]")!;
    const right = el.querySelector<HTMLElement>("[data-preloader-part=right]")!;
    const logo = el.querySelector<HTMLElement>("[data-preloader-logo]")!;
    const tl = gsap.timeline({ onComplete: finish });
    tl.fromTo(chars, { yPercent: 150 }, { yPercent: -150, duration: 1.5, ease: "power4.out", stagger: 0.05 })
      .fromTo(logo, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: "expo.out" }, "-=1.1")
      .to(left, { xPercent: -200, duration: 1.8, ease: "expo.inOut" }, "-=0.2")
      .to(right, { xPercent: 200, duration: 1.8, ease: "expo.inOut" }, "<")
      .to(el, { opacity: 0, duration: 0.3 }, "-=0.3");
    const safety = window.setTimeout(finish, 6000);
    return () => { window.clearTimeout(safety); tl.kill(); };
  }, [onComplete]);

  return (
    <div ref={root} data-component="preloader" className="fixed inset-0 z-[200] grid h-screen w-full bg-stone-deep md:grid-cols-2" aria-hidden="true">
      <div data-preloader-part="left" className="relative grid h-full bg-white">
        <div data-preloader-logo="" className="absolute left-25 top-1/2 w-[62%] -translate-y-1/2 lg:left-30" style={{ aspectRatio: String(brand.logo.ratio) }}>
          <img src={brand.logo.src} alt="" className="h-full w-full" draggable={false} />
        </div>
      </div>
      <div data-preloader-part="right" className="relative hidden h-full bg-stone md:grid">
        <div data-year="" className="absolute bottom-30 left-30 overflow-hidden text-15xl font-medium leading-none text-ink">
          {YEAR.split("").map((c, i) => (
            <span key={i} className="ch inline-block will-change-transform">{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
