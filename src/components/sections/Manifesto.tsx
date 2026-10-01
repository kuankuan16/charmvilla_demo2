"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getContent } from "@/data/content";
import { useLocale } from "@/i18n/LocaleProvider";
import InkBloom from "@/components/ui/InkBloom";
import { SCROLLER_SELECTOR } from "@/lib/motion/scroller";

// Brand story text screen. The image gallery that used to follow it became the "以手成形" carousel (CraftMoments, 2026-10-01).
export default function Manifesto() {
  const { manifesto, tea } = getContent(useLocale());
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const scroller = document.querySelector<HTMLElement>(SCROLLER_SELECTOR);
      if (!scroller) return;
      const chars = el.querySelectorAll<HTMLElement>(".story-char");
      gsap.set(chars, { opacity: .2 });
      gsap.to(chars, {
        opacity: 1, stagger: .035, duration: .15, ease: "none",
        scrollTrigger: { scroller, trigger: el.querySelector(".story-copy"), start: "top 80%", end: "bottom 80%", scrub: true, invalidateOnRefresh: true },
      });
      const brush = el.querySelector(".story-brush");
      if (brush) gsap.fromTo(brush, { yPercent: 12 }, { yPercent: -18, ease: "none", scrollTrigger: { scroller, trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    }, el);
    document.fonts.ready.then(() => { if (el.isConnected) ScrollTrigger.refresh(); });
    return () => { media.revert(); };
  }, []);

  return (
    <section id="manifesto" ref={root} className="brand-story" aria-labelledby="story-heading">
      <div className="story-message">
        <div className="story-brush story-brush--message" aria-hidden="true"><InkBloom observe seed={11} /></div>
        <div className="story-text-column">
          <h2 id="story-heading" className="sr-only">The Gallery</h2>
          <div className="story-copy tc">
            {manifesto.paragraphs.map((text, i) => <p key={text} className={i === 0 ? "story-lead" : undefined}>
              <span className="sr-only">{text}</span>
              <span aria-hidden="true">{Array.from(text).map((char, j) => <span key={j} className="story-char">{char}</span>)}</span>
            </p>)}
          </div>
          <div className="story-honours" aria-label={tea.honoursAria} data-brand-awards="">
            <p className="story-honours-label tc">{tea.honoursLabel} · {tea.honours[0]}</p>
            <ul className="story-honours-list">
              {tea.awards.map(award => <li key={award.image.src}>
                <Image src={award.image.src} alt={award.image.alt} width={award.image.w} height={award.image.h} sizes="120px" />
                <p className="tc">{award.text}</p>
              </li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
