"use client";
// Cursor mark (gold vector goldfish, see .cursor-dot) — its position lerps toward the pointer at 0.2 per frame.
// The transform is written on the mark itself and only while it is still catching up. (Until 2026-10-01 the position
// was written every frame as two CSS variables on <html>, which made the browser recalculate the style of the whole
// document 60 times a second, forever; that cost showed as a heavy, held-back feeling when moving and scrolling.)
// Hidden on touch devices via CSS.
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = dot.current;
    if (!el || window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    const target = { x: 0, y: 0 }; const cur = { x: 0, y: 0 }; let moving = false, placed = false;
    const onMove = (e: MouseEvent) => {
      target.x = e.clientX; target.y = e.clientY;
      if (!placed) { placed = true; cur.x = target.x; cur.y = target.y; }   // first move: appear under the pointer, do not fly in
      moving = true;
    };
    const tick = () => {
      if (!moving) return;
      cur.x += (target.x - cur.x) * 0.2; cur.y += (target.y - cur.y) * 0.2;
      if (Math.abs(target.x - cur.x) < 0.1 && Math.abs(target.y - cur.y) < 0.1) { cur.x = target.x; cur.y = target.y; moving = false; }
      el.style.transform = `translate3d(${(cur.x - 15).toFixed(1)}px, ${(cur.y - 12).toFixed(1)}px, 0)`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    gsap.ticker.add(tick);
    return () => { window.removeEventListener("mousemove", onMove); gsap.ticker.remove(tick); };
  }, []);
  return <div ref={dot} data-page-cursor="" className="cursor-dot" aria-hidden="true" />;
}
