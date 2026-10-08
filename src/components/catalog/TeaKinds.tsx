"use client";
// 茶款介紹 after the "Expertise Behind Bramwel" screen of bramwel-service-template.webflow.io (user 2026-10-08: 「Expertise Behind Bramwel 這一屏
// 改介紹茶種」, its type and motion to be copied exactly): a 500vh sticky run — the label and the centred 64px heading on the brand's ground,
// then a 100vh screen in which the row of 400 × 520 cards slides from 40vw to −70vw as the run scrolls (scrub 0.8), each card swelling from
// 0.8 to 1 and back as it passes; the cards' tops are staggered (130 / 0 / 120 / 50 / 90). Hovering a card (desktop) pulls five olive blocks
// up from its top to reveal the kind of tea in 32px, while the name and the note rise in through masks. Bramwel's Inter sizes are kept to the
// pixel; the colours are the brand's (its wine --primary becomes the leather brown shared with 美好的沖泡方式). Reduced motion: no scrub, the
// cards just sit in a row that scrolls sideways.
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Img } from "@/data/content";
import { useT } from "@/i18n/LocaleProvider";
import { Picture } from "@/components/ui";

gsap.registerPlugin(ScrollTrigger);

export type TeaKind = { name: string; text: string; kind: string; image?: Img };
const PAD = [130, 0, 120, 50, 90, 60];

export default function TeaKinds({ label, title, items }: { label: string; title: string; items: TeaKind[] }) {
  const { t } = useT();
  const sticky = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const run = sticky.current, row = main.current;
    if (!run || !row) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    ScrollTrigger.defaults({ scroller: window });
    if (process.env.NODE_ENV !== "production") (window as unknown as { __ST?: typeof ScrollTrigger }).__ST = ScrollTrigger;
    const w = window.innerWidth;
    const [from, to] = w <= 479 ? [50, -360] : w <= 767 ? [50, -240] : w <= 991 ? [50, -200] : [40, -70];
    const cards = Array.from(row.querySelectorAll<HTMLElement>(".teakind-pad"));
    const ctx = gsap.context(() => {
      // a paused timeline driven only by its scroll trigger (a free-running one would finish before the trigger takes it over)
      const tl = gsap.timeline({ paused: true, defaults: { ease: "sine.inOut" }, scrollTrigger: { trigger: run, start: "clamp(10% bottom)", end: "clamp(80% top)", scrub: 0.8 } });
      tl.fromTo(row, { x: `${from}vw` }, { x: `${to}vw`, duration: 1.29 }, 0);
      cards.forEach((c, n) => {
        tl.fromTo(c, { scale: 0.8 }, { scale: 1, duration: 0.2 }, 0.06 + 0.2 * n);
        tl.to(c, { scale: 0.8, duration: 0.2 }, 0.36 + 0.2 * n);
      });
    }, run);
    // the runs are tall sticky boxes: the triggers must be re-measured once fonts and images have settled (as CollectionBrowser does)
    let alive = true;
    const refresh = () => { if (alive) ScrollTrigger.refresh(); };
    document.fonts.ready.then(refresh); window.addEventListener("load", refresh); const tm = setTimeout(refresh, 800);
    return () => { alive = false; clearTimeout(tm); window.removeEventListener("load", refresh); ctx.revert(); };
  }, [items.length]);
  return (
    <div ref={sticky} className="teakind-sticky">
      <div className="teakind-head">
        <div className="bw-label"><span className="bw-label-dot" aria-hidden="true" /><span className="bw-bxs tc">{label}</span></div>
        <h2 id="tea-notes-title" className="teakind-h02 tc">{title}</h2>
      </div>
      <section className="teakind-section" aria-label={title}>
        <div className="teakind-wrap">
          <div ref={main} className="teakind-main">
            {items.map((tea, i) => (
              <div key={tea.name} className="teakind-pad" style={{ paddingTop: PAD[i % PAD.length] }}>
                <article className="teakind-card" aria-label={tea.name}>
                  <div className="teakind-img-para">
                    <div className="teakind-img">{tea.image ? <Picture img={tea.image} fill fit="cover" animate={false} sizes="400px" /> : <div className="teakind-missing"><span className="tc">{t("缺圖", "No image yet")}</span></div>}</div>
                    <div className="teakind-para">
                      <h3 className="teakind-h06 tc"><span className="bw-mask"><span className="bw-mask-in">{tea.name}</span></span></h3>
                      <p className="teakind-bs tc"><span className="bw-mask"><span className="bw-mask-in">{tea.text}</span></span></p>
                    </div>
                  </div>
                  <div className="teakind-hover" aria-hidden="true">
                    <div className="teakind-blocks">{[0, 1, 2, 3, 4].map((k) => <span key={k} className="teakind-block" style={{ transitionDelay: `${[0.1, 0.16, 0.21, 0.16, 0.1][k]}s` }} />)}</div>
                    <h3 className="teakind-h05 tc"><span className="bw-mask"><span className="bw-mask-in">{tea.kind}</span></span></h3>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
