"use client";
// 美好的沖泡方式 after the "Comprehensive capabilities for enterprise growth" screen of bramwel-service-template.webflow.io (user 2026-10-08:
// 「右邊的的 4 張卡片改為 5 張卡片介紹目前官網的沖泡方式」「文字的大小樣式我都要一模一樣去模仿」「icon 照這個風格…重新畫一遍像似的」): a 300vh
// sticky run of a 100vh screen on the stores' cream ground (first bramwel's wine as the leather brown 「皮革的咖啡色」, then 「都用門市一樣的奶黃
// 背景色」) — the 64px heading, the label and the paragraph at the left, the stack of 680 × 540 white cards at the right sliding up −65% over
// the run; each card: the number and the 48px step name at the top left, the text at the top right, the step's geometric line icon at the
// bottom left, two tags at the bottom right; the card's tint deepens on hover (0.6s sine.inOut). The sides are the site's gutter. Bramwel's
// curtain now stands above 茶款介紹 (TeaKinds), which comes first. Below 992px the screen stops being sticky and the cards stack in a column.
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type BrewCard = { title: string; text: string; icon: ReactNode; tags: string[] };

export default function BrewCapabilities({ label, title, intro, cards }: { label: string; title: string; intro: string; cards: BrewCard[] }) {
  const run = useRef<HTMLDivElement>(null);
  const stack = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const r = run.current, s = stack.current;
    if (!r || !s) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    ScrollTrigger.defaults({ scroller: window });
    const ctx = gsap.context(() => {
      // a paused tween driven only by its scroll trigger (a free-running one would finish before the trigger takes it over)
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
