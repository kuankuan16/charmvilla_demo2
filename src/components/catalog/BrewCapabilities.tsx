"use client";
// 美好的沖泡方式 after the "Comprehensive capabilities for enterprise growth" screen of bramwel-service-template.webflow.io (user 2026-10-08:
// 「背景色我要用皮革的咖啡色」「右邊的的 4 張卡片改為 5 張卡片介紹目前官網的沖泡方式」「icon 就用現在畫的沖泡 icon 去取代」「文字的大小樣式我都要一模一樣去模仿」):
// five curtain blocks rise to 40 / 70 / 100 / 70 / 40 % as the screen arrives (scrub 0.8), then a 300vh sticky run of a 100vh leather-brown
// screen — the 64px heading, the label and the 14px paragraph at the left, the stack of 680 × 540 cards at the right sliding up −65% over
// the run; each card: the number and the 48px step name at the top left, the 14px text at the top right, the step's line icon at the bottom
// left, two tags at the bottom right; the card's tint deepens on hover (0.6s sine.inOut). Bramwel's Inter sizes are kept to the pixel; the
// screen's ground is the leather brown. Below 992px the screen stops being sticky and the cards stack in a column.
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type BrewCard = { title: string; text: string; icon: ReactNode; tags: string[] };

export default function BrewCapabilities({ label, title, intro, cards }: { label: string; title: string; intro: string; cards: BrewCard[] }) {
  const curtain = useRef<HTMLDivElement>(null);
  const run = useRef<HTMLDivElement>(null);
  const stack = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = curtain.current, r = run.current, s = stack.current;
    if (!c || !r || !s) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    ScrollTrigger.defaults({ scroller: window });
    const ctx = gsap.context(() => {
      const blocks = Array.from(c.querySelectorAll<HTMLElement>(".brewcap-block"));
      const heights = [40, 70, 100, 70, 40];
      // paused tweens driven only by their scroll triggers (free-running ones would finish before the trigger takes them over)
      gsap.timeline({ paused: true, scrollTrigger: { trigger: c, start: "clamp(top bottom)", end: "clamp(top top)", scrub: 0.8 } })
        .to(blocks, { height: (i) => `${heights[i]}%`, duration: 1, ease: "sine.inOut" }, 0);
      if (window.innerWidth > 991) gsap.fromTo(s, { yPercent: 0 }, { yPercent: -65, duration: 1, ease: "sine.inOut", paused: true,
        scrollTrigger: { trigger: r, start: "clamp(20% bottom)", end: "clamp(bottom 60%)", scrub: 0.8 } });
    }, r);
    // the runs are tall sticky boxes: the triggers must be re-measured once fonts and images have settled (as CollectionBrowser does)
    let alive = true;
    const refresh = () => { if (alive) ScrollTrigger.refresh(); };
    document.fonts.ready.then(refresh); window.addEventListener("load", refresh); const tm = setTimeout(refresh, 800);
    return () => { alive = false; clearTimeout(tm); window.removeEventListener("load", refresh); ctx.revert(); };
  }, [cards.length]);
  return (
    <>
      <div ref={curtain} className="brewcap-curtain" aria-hidden="true"><div className="brewcap-blocks">{[0, 1, 2, 3, 4].map((k) => <span key={k} className="brewcap-block" />)}</div></div>
      <div ref={run} className="brewcap-sticky" id="brew-title-anchor">
        <section className="brewcap-section" aria-labelledby="brew-title">
          <div className="brewcap-container">
            <div className="brewcap-content">
              <div className="brewcap-left">
                <h2 id="brew-title" className="brewcap-h02 tc">{title}</h2>
                <div className="brewcap-para-label">
                  <div className="bw-label"><span className="bw-label-dot" aria-hidden="true" /><span className="bw-bxs tc">{label}</span></div>
                  <p className="brewcap-bs tc">{intro}</p>
                </div>
              </div>
              <div ref={stack} className="brewcap-items">
                {cards.map((card, i) => (
                  <article key={card.title} className="brewcap-item">
                    <div className="brewcap-item-top">
                      <div className="brewcap-top-left"><span className="brewcap-bxs">{String(i + 1).padStart(2, "0")}</span><h3 className="brewcap-h04 tc">{card.title}</h3></div>
                      <div className="brewcap-top-right"><p className="brewcap-bs tc">{card.text}</p></div>
                    </div>
                    <div className="brewcap-item-bottom">
                      <div className="brewcap-icon" aria-hidden="true">{card.icon}</div>
                      <div className="brewcap-tags">{card.tags.map((tag) => <span key={tag} className="brewcap-tag"><span className="brewcap-bxs tc">{tag}</span></span>)}</div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
