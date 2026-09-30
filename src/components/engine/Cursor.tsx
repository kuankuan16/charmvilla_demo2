"use client";
// Cursor mark (gold vector goldfish, see .cursor-dot) — position lerps toward the pointer at 0.2 per frame and is
// written to CSS variables (--cursor-x / --cursor-y in 0..1), the reference's mechanism. Hidden on touch devices via CSS.
import { useEffect } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    const target = { x: -0.5, y: -0.5 }; const cur = { x: -0.5, y: -0.5 }; let animate = false;
    const root = document.documentElement;
    const onMove = (e: MouseEvent) => { animate = true; target.x = e.clientX / window.innerWidth; target.y = e.clientY / window.innerHeight; };
    const tick = () => {
      if (!animate) return;
      cur.x += (target.x - cur.x) * 0.2; cur.y += (target.y - cur.y) * 0.2;
      root.style.setProperty("--cursor-x", cur.x.toFixed(4)); root.style.setProperty("--cursor-y", cur.y.toFixed(4));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    gsap.ticker.add(tick);
    return () => { window.removeEventListener("mousemove", onMove); gsap.ticker.remove(tick); };
  }, []);
  return <div data-page-cursor="" className="cursor-dot" aria-hidden="true" />;
}
