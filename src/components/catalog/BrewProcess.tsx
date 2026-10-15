"use client";
// The 美好的沖泡方式 screen (TeaPages) with its motion: product pages do not mount PageShell, so this boots the section's
// scroll-scrubbed content reveals against the window. The 2026-10-12 chosen layout combines a sticky photograph on the left
// with the title and steps on the right. Nodes remain stationary while their connecting rail fills point to point.
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initAnimations } from "@/lib/motion/animations";

export default function BrewProcess({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  // Remove the window ScrollTriggers before React detaches/hides this section. The incoming
  // homepage refreshes triggers in its layout effect; a passive cleanup would still measure
  // the removed steps as all zeroes and divide by zero when painting their progress.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    ScrollTrigger.defaults({ scroller: window });
    let dispose: (() => void) | undefined;
    const context = gsap.context(() => { dispose = initAnimations(el); }, el);
    let alive = true;
    document.fonts.ready.then(() => { if (alive && el.isConnected) ScrollTrigger.refresh(); });
    return () => { alive = false; dispose?.(); context.revert(); };
  }, []);
  return <section ref={root} className="brew-process" data-animation="brew-process" id="brew-title-anchor"><div className="brew-process-inner">{children}</div></section>;
}
