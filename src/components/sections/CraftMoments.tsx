"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { gsap } from "gsap";
import { getCraftMoments } from "@/data/craft-moments";
import { useT } from "@/i18n/LocaleProvider";
import { localeHref } from "@/i18n/config";

const AUTOPLAY_MS = 6000;
const DRAG_THRESHOLD = 60;

// "以手成形" — five lifestyle moments, one drag carousel. Presentation after recruit.positive.co.jp (Interview):
// a tilted active card with side peeks, quote + outlined CTA at the right, prev/next/pause bottom-left, dots bottom-right,
// a "drag" pill that follows the pointer over the stage. Autoplay 6 s; pauses on hover, focus, drag, hidden tab or reduced motion.
export default function CraftMoments() {
  const { lang, t } = useT();
  const craftMoments = getCraftMoments(lang);
  const items = craftMoments.items;
  const count = items.length;
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [drag, setDrag] = useState(0);
  const hover = useRef(false);
  const focus = useRef(false);
  const visible = useRef(false);
  const pointer = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const elapsed = useRef(0);

  const go = useCallback((index: number) => {
    elapsed.current = 0;
    setActive(((index % count) + count) % count);
  }, [count]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; }, { threshold: .3 });
    observer.observe(el);
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const delta = Math.min(now - last, 100);
      last = now;
      if (!visible.current || document.hidden || paused || hover.current || focus.current || pointer.current || motion.matches) return;
      elapsed.current += delta;
      if (elapsed.current >= AUTOPLAY_MS) { elapsed.current = 0; setActive(a => (a + 1) % count); }
    };
    gsap.ticker.add(tick);
    return () => { observer.disconnect(); gsap.ticker.remove(tick); };
  }, [count, paused]);

  const movePill = (e: ReactPointerEvent) => {
    const box = stage.current?.getBoundingClientRect();
    if (!box || !pill.current) return;
    pill.current.style.transform = `translate(${e.clientX - box.left + 22}px, ${e.clientY - box.top + 26}px)`;
  };
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pointer.current = { x: e.clientX, y: e.clientY, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    movePill(e);
    const p = pointer.current;
    if (!p) return;
    const dx = e.clientX - p.x;
    if (Math.abs(dx) > 4) p.moved = true;
    setDrag(dx);
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const p = pointer.current;
    pointer.current = null;
    setDrag(0);
    if (!p) return;
    const dx = e.clientX - p.x;
    if (Math.abs(dx) > DRAG_THRESHOLD) go(active + (dx < 0 ? 1 : -1));
  };

  const current = items[active];

  return (
    <section id="craft" ref={root} className="craft-moments" aria-labelledby="craft-heading"
      onKeyDown={e => { if (e.key === "ArrowRight") { e.preventDefault(); go(active + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(active - 1); } }}
      onFocusCapture={() => { focus.current = true; }}
      onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) focus.current = false; }}>
      {/* 2026-10-01 (user): no brush texture in this section */}

      <header className="craft-header">
        <h2 id="craft-heading" className="craft-heading tc">{craftMoments.heading[0]}<br />{craftMoments.heading[1]}</h2>
      </header>

      <div className="craft-body">
        <div ref={stage} className={`craft-stage${drag ? " is-dragging" : ""}`} aria-roledescription={t("輪播", "carousel")} aria-label={t("藝匠的四個片刻", "Four moments of the artisans")}
          onMouseEnter={() => { hover.current = true; }} onMouseLeave={() => { hover.current = false; }}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
          style={{ "--drag": `${drag * .6}px` } as CSSProperties}>
          {items.map((item, i) => {
            let pos = (i - active + count) % count;
            if (pos > count / 2) pos -= count;
            return <figure key={item.id} className="craft-card" data-pos={pos} aria-hidden={pos !== 0}
              style={{ "--tilt": `${i % 2 ? 4 : -4}deg` } as CSSProperties}
              onClick={() => { if (pos !== 0 && !pointer.current?.moved) go(i); }}>
              <Image src={item.image.src} alt={item.image.alt} fill sizes="(min-width:768px) 36vw, 80vw" draggable={false} priority={i === 0} />
              <figcaption className="sr-only">{item.craft}</figcaption>
            </figure>;
          })}
          <div ref={pill} className="craft-drag-pill" aria-hidden="true"><span>←</span>{t("拖曳", "Drag")}<span>→</span></div>
        </div>

        <div className="craft-text" key={current.id} aria-live="polite">
          <p className="craft-craft tc">{current.craft}</p>
          <p className="craft-quote tc">{current.quote[0]}<br />{current.quote[1]}</p>
          <div className="craft-ctas">
            {current.ctas.map((cta, i) => <Link key={cta.href + cta.label} href={localeHref(lang, cta.href)} className={`catalog-button craft-cta${i ? " craft-cta--quiet" : ""}`}>{cta.label}<span aria-hidden="true">→</span></Link>)}
          </div>
        </div>
      </div>

      <div className="craft-controls">
        <div className="craft-buttons" role="group" aria-label={t("輪播控制", "Carousel controls")}>
          <button type="button" className="craft-btn" aria-label={t("上一張", "Previous")} onClick={() => go(active - 1)}>←</button>
          <button type="button" className="craft-btn" aria-label={t("下一張", "Next")} onClick={() => go(active + 1)}>→</button>
          <button type="button" className="craft-btn craft-btn--pause" aria-label={paused ? t("播放", "Play") : t("暫停", "Pause")} aria-pressed={paused} onClick={() => setPaused(p => !p)}>
            {paused ? <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true"><path d="M1 1l8 5-8 5z" fill="currentColor" /></svg>
              : <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true"><path d="M1 1h2.6v10H1zM6.4 1H9v10H6.4z" fill="currentColor" /></svg>}
          </button>
        </div>
        <div className="craft-dots" role="tablist" aria-label={t("片刻", "Moments")}>
          {items.map((item, i) => <button key={item.id} type="button" role="tab" className="craft-dot" aria-selected={i === active} aria-label={item.craft} onClick={() => go(i)} />)}
        </div>
      </div>
    </section>
  );
}
