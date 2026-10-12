"use client";
// The 美好的沖泡方式 screen (TeaPages) with its motion: product pages do not mount PageShell, so this boots the section's
// scroll-scrubbed row reveals against the window. The 2026-10-12 layout follows Agasis' "All you need to launch": a sticky title
// at the left and ruled rows that rise 32px while fading in at the right.
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
  return <section ref={root} className="brew-process" data-animation="brew-process" id="brew-title-anchor"><div className="brew-process-inner">{children}</div></section>;
}
