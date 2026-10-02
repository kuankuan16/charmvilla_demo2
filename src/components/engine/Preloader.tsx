"use client";
// Preloader — closely modelled on davidlaxer.com/about (user 2026-09-30):
//   desktop  the official CHARM VILLA wordmark rises through the bottom-left corner letter by letter (yPercent 150 → -150,
//            power4.out, 1.5 s, stagger .05). Letters are slices of the official PNG (a sprite), never typed text,
//            then the whole overlay wipes to its left edge with a clip-path (power3.inOut, 1.1 s). The page becomes
//            visible and the hero headline's split characters start at the same instant the wipe begins.
//   mobile   no digits (below 768 px), only the wipe.
// No header/logo replica at the top (user 2026-09-30); the wordmark only appears as the rising letters.
// The gold half carries the white vector goldfish (user 2026-10-01).
// Scrolling stays locked until the wipe has finished. Reduced motion skips everything.
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/motion/scroller";

// Column boundaries (px, in the 929×82 official PNG) at the midpoints of the gaps between the ten letters C H A R M V I L L A.
const LOGO_W = 929;
const LETTER_BOUNDS = [0, 114, 206, 323, 406, 548, 663, 692, 762, 823, LOGO_W];
const FULL = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
const COLLAPSED = "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)";
// sessionStorage key; the same name is read by the inline script in src/app/[lang]/layout.tsx
export const INTRO_SEEN = "cv-intro-seen";

export default function Preloader({ onReveal, onComplete }: { onReveal: () => void; onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const revealed = useRef(false);
  const done = useRef(false);
  const skipped = useRef(false);
  const reveal = useCallback(() => { if (revealed.current) return; revealed.current = true; onReveal(); }, [onReveal]);
  const finish = useCallback(() => {
    if (done.current) return; done.current = true;
    try { sessionStorage.setItem(INTRO_SEEN, "1"); } catch { /* storage unavailable */ }
    reveal(); onComplete();
  }, [reveal, onComplete]);

  // The sequence plays once per visit (browser tab session): coming back to the homepage, or reloading it, hides the overlay
  // before first paint and finishes at once (user 2026-10-02: 「每一次點進來，不要一直重新出現…只要一開始 loading 有出現就好」;
  // earlier, 2026-09-30, only the wordmark link skipped it). On a full page load the inline script in the layout has already
  // hidden the overlay through html.intro-seen, so the server-rendered overlay never flashes.
  useLayoutEffect(() => {
    let skip = false;
    try {
      skip = !!sessionStorage.getItem(INTRO_SEEN) || !!sessionStorage.getItem("cv-skip-preloader");
      sessionStorage.removeItem("cv-skip-preloader");
    } catch { /* storage unavailable: play it */ }
    if (!skip) return;
    skipped.current = true;
    if (root.current) root.current.style.display = "none";
    finish();
  }, [finish]);

  useEffect(() => {
    const el = root.current!;
    if (skipped.current) return;
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
  }, [reveal, finish]);

  return (
    <div ref={root} data-component="preloader" className="preloader fixed inset-0 z-[200] grid h-screen w-full overflow-hidden bg-stone-deep md:grid-cols-2" aria-hidden="true">
      <div data-mark="" className="preloader-mark">
        {LETTER_BOUNDS.slice(0, -1).map((x0, i) => {
          const x1 = LETTER_BOUNDS[i + 1];
          return <span key={x0} className="ch" style={{ width: `calc(var(--lw) * ${((x1 - x0) / LOGO_W).toFixed(5)})`, backgroundPosition: `calc(var(--lw) * ${(-x0 / LOGO_W).toFixed(5)}) 0` }} />;
        })}
      </div>
      <div data-preloader-part="left" className="relative grid h-full bg-page" />
      <div data-preloader-part="right" className="relative hidden h-full bg-gold md:grid">
        {/* the vector goldfish, white on the gold half (user 2026-10-01: 「右邊加回向量的小金魚」; it was here until 09-30) */}
        <img src="/brand/goldfish-white.svg" alt="" className="absolute left-[38%] top-1/2 h-auto w-[28%] -translate-x-1/2 -translate-y-1/2" draggable={false} />
      </div>
    </div>
  );
}
