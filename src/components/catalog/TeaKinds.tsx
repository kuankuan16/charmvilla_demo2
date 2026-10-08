"use client";
// 茶款介紹 after the "Expertise Behind Bramwel" screen of bramwel-service-template.webflow.io (user 2026-10-08: 「Expertise Behind Bramwel 這一屏
// 改介紹茶種」, its type and motion to be copied exactly; bramwel's rising curtain and the screen's own ground were dropped the same night —
// 「背景效果都刪掉」「也不用另外套不一樣的背景色」 — so it sits on the page's ground): a 500vh sticky run — the 64px heading at the left, then a 100vh screen in
// which the row of 400 × 520 cards slides from 40vw to −70vw as the run scrolls (scrub 0.8), each card swelling from 0.8 to 1 and back as it
// passes; the cards' tops are staggered (130 / 0 / 120 / 50 / 90). A card at rest is text alone on its olive cover — the tea's name in 32px
// and its note (「一開始是文字而已，hover 的時候才會出現圖」「標題要跟裡面的茶種名稱一樣」「詳細的文字介紹放在一開始的列表上面」); hovering it
// (desktop) lifts the cover's five blocks to show the dry-leaf photograph bare, with nothing written over it (「刪掉圖片上的文字與漸層黑」);
// where there is no hover a tap (or Enter) toggles the cover. Reduced motion: no scrub, the cards just sit in a row that scrolls
// sideways.
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Img } from "@/data/content";
import { useT } from "@/i18n/LocaleProvider";
import { Picture } from "@/components/ui";

gsap.registerPlugin(ScrollTrigger);

export type TeaKind = { name: string; text: string; image?: Img };
const PAD = [130, 0, 120, 50, 90, 60];
/** 「紅玉紅茶（Red Jade／Ruby No.18）」→ the name, then what the brackets held as a second, smaller line, the brackets gone (user 2026-10-08:
 *  「（）內的字都換行變小字，並刪除（）」); full-width or ASCII brackets on either language's page */
const splitName = (name: string): [string, string | undefined] => {
  const m = name.match(/^(.*?)\s*[（(]\s*(.+?)\s*[）)]\s*$/);
  return m ? [m[1], m[2]] : [name, undefined];
};

// (bramwel's small label with a square dot above the heading — 「■ 茶款」 — is gone: user 2026-10-08 「刪」)
export default function TeaKinds({ title, items }: { title: string; items: TeaKind[] }) {
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
      cards.forEach((card, n) => {
        tl.fromTo(card, { scale: 0.8 }, { scale: 1, duration: 0.2 }, 0.06 + 0.2 * n);
        tl.to(card, { scale: 0.8, duration: 0.2 }, 0.36 + 0.2 * n);
      });
    }, run);
    // the runs are tall sticky boxes: the triggers must be re-measured once fonts and images have settled (as CollectionBrowser does)
    let alive = true;
    const refresh = () => { if (alive) ScrollTrigger.refresh(); };
    document.fonts.ready.then(refresh); window.addEventListener("load", refresh); const tm = setTimeout(refresh, 800);
    return () => { alive = false; clearTimeout(tm); window.removeEventListener("load", refresh); ctx.revert(); };
  }, [items.length]);
  return (
    <>
      <div ref={sticky} className="teakind-sticky">
        <div className="teakind-head">
          <h2 id="tea-notes-title" className="teakind-h02 tc">{title}</h2>
        </div>
        <section className="teakind-section" aria-label={title}>
          <div className="teakind-wrap">
            <div ref={main} className="teakind-main">
              {items.map((tea, i) => {
                const [name, sub] = splitName(tea.name);
                return (
                <div key={tea.name} className="teakind-pad" style={{ paddingTop: PAD[i % PAD.length] }}>
                  <article className="teakind-card" aria-label={tea.name} tabIndex={0}
                    onClick={(e) => e.currentTarget.classList.toggle("is-open")}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.classList.toggle("is-open"); } }}>
                    {/* the photograph, bare — no text and no gradient over it (「刪掉圖片上的文字與漸層黑」) */}
                    <div className="teakind-img">{tea.image ? <Picture img={tea.image} fill fit="cover" animate={false} sizes="400px" /> : <div className="teakind-missing"><span className="tc">{t("缺圖", "No image yet")}</span></div>}</div>
                    {/* the olive cover at rest: the name and the note, the card's only text */}
                    <div className="teakind-cover">
                      <div className="teakind-blocks">{[0, 1, 2, 3, 4].map((k) => <span key={k} className="teakind-block" style={{ transitionDelay: `${[0.1, 0.16, 0.21, 0.16, 0.1][k]}s` }} />)}</div>
                      <h3 className="teakind-h05 tc"><span className="bw-mask"><span className="bw-mask-in">{name}{sub && <small className="teakind-h05-sub">{sub}</small>}</span></span></h3>
                      <p className="teakind-cover-text tc"><span className="bw-mask"><span className="bw-mask-in">{tea.text}</span></span></p>
                    </div>
                  </article>
                </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
