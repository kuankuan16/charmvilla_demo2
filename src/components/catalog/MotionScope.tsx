"use client";
// Boots the declarative animations (lib/motion/animations.ts) for one block of a product page, which has no PageShell and scrolls the
// window — the same set-up as BrewProcess and CollectionBrowser, for blocks whose own element needs no animation type.
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initAnimations } from "@/lib/motion/animations";

export default function MotionScope({ className, children }: { className?: string; children: ReactNode }) {
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
  return <div ref={root} className={className}>{children}</div>;
}
