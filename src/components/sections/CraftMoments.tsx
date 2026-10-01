"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { getCraftMoments } from "@/data/craft-moments";
import { useT } from "@/i18n/LocaleProvider";
import { localeHref } from "@/i18n/config";
import { getScroller } from "@/lib/motion/scroller";

// "以手成形" — the artisans' moments, one card at a time: a tilted active card with side peeks, craft label, quote and
// outlined CTA at the right, dots below. The cards change with the scroll (user 2026-10-01: 「改成隨著滑鼠往下滑時會自動
// 換圖」「把拖曳功能刪除」): the panel is held in place while the page scrolls through a track behind it, and each
// card owns an equal share of that distance. No dragging, no autoplay, no arrow or pause buttons; a dot (or a side
// card, or the arrow keys) scrolls to its card.
export default function CraftMoments() {
  const { lang, t } = useT();
  const craftMoments = getCraftMoments(lang);
  const items = craftMoments.items;
  const count = items.length;
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Where the panel is held (0, or a negative offset when it is taller than the viewport, so that its foot stays in view),
  // and how far the page travels while it is held.
  const measure = useCallback(() => {
    const el = root.current, panel = pin.current;
    if (!el || !panel) return null;
    const top = Math.min(0, window.innerHeight - panel.offsetHeight);
    el.style.setProperty("--craft-top", `${top}px`);
    return { top, travel: el.offsetHeight - panel.offsetHeight, rect: el.getBoundingClientRect() };
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0, near = false, last = -1;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!near) return;
      const m = measure();
      if (!m || m.travel <= 0) return;
      const progress = Math.min(1, Math.max(0, (m.top - m.rect.top) / m.travel));
      const index = Math.min(count - 1, Math.floor(progress * count));
      if (index !== last) { last = index; setActive(index); }
    };
    const observer = new IntersectionObserver(([entry]) => { near = entry.isIntersecting; });
    observer.observe(el);
    measure();
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); observer.disconnect(); };
  }, [count, measure]);

  // Scroll to the middle of a card's share of the track.
  const go = useCallback((index: number) => {
    const m = measure();
    if (!m) return;
    const i = Math.min(count - 1, Math.max(0, index));
    const scroller = getScroller();
    const from = scroller ? scroller.wrapper.scrollTop : window.scrollY;
    const y = from + m.rect.top - m.top + ((i + .5) / count) * m.travel;
    if (scroller) scroller.scrollTo(y); else window.scrollTo({ top: y, behavior: "smooth" });
  }, [count, measure]);

  const current = items[active];

  return (
    <section id="craft" ref={root} className="craft-moments" aria-labelledby="craft-heading" style={{ "--craft-count": count } as CSSProperties}
      onKeyDown={e => { if (e.key === "ArrowRight") { e.preventDefault(); go(active + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(active - 1); } }}>
      <div ref={pin} className="craft-pin">
      <header className="craft-header">
        <h2 id="craft-heading" className="craft-heading tc">{craftMoments.heading[0]}<br />{craftMoments.heading[1]}</h2>
      </header>

      <div className="craft-body">
        <div className="craft-stage" aria-roledescription={t("輪播", "carousel")} aria-label={t("藝匠的四個片刻", "Four moments of the artisans")}>
          {items.map((item, i) => {
            let pos = (i - active + count) % count;
            if (pos > count / 2) pos -= count;
            return <figure key={item.id} className="craft-card" data-pos={pos} aria-hidden={pos !== 0}
              style={{ "--tilt": `${i % 2 ? 4 : -4}deg` } as CSSProperties}
              onClick={() => { if (pos !== 0) go(i); }}>
              <Image src={item.image.src} alt={item.image.alt} fill sizes="(min-width:768px) 36vw, 80vw" draggable={false} priority={i === 0} />
              <figcaption className="sr-only">{item.craft}</figcaption>
            </figure>;
          })}
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
        <div className="craft-dots" role="tablist" aria-label={t("片刻", "Moments")}>
          {items.map((item, i) => <button key={item.id} type="button" role="tab" className="craft-dot" aria-selected={i === active} aria-label={item.craft} onClick={() => go(i)} />)}
        </div>
      </div>
      </div>
      {/* the distance the page scrolls while the panel is held: one step per further card */}
      <div className="craft-track" aria-hidden="true" />
    </section>
  );
}
