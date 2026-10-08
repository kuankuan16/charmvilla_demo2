"use client";
// The 美好的沖泡方式 screen (TeaPages) with its motion: no PageShell runs on a product page, so this boots the declarative animations
// (lib/motion/animations.ts: brew-process on this element, the title's split and the photograph's moveUp inside it) against the window,
// which is what scrolls there — as CollectionBrowser does. Back after one evening as bramwel's card stack (user 2026-10-08: 「改回這個效果」).
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initAnimations } from "@/lib/motion/animations";

export default function BrewProcess({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    ScrollTrigger.defaults({ scroller: window });
    let dispose: (() => void) | undefined;
    const context = gsap.context(() => { dispose = initAnimations(el); }, el);
    let alive = true;
    document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
    return () => { alive = false; dispose?.(); context.revert(); };
  }, []);
  return <div ref={root} className="brew-process" data-animation="brew-process" id="brew-title-anchor">{children}</div>;
}
