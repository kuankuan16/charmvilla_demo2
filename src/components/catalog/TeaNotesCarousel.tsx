"use client";
// 茶款介紹 in the stores screen's manner (user 2026-10-08: 「參考門市的設計手法，店面換成茶種資訊」「右邊最大的圖先幫我用影片試試看」):
// the heading and a slider of tea cards at the left — a photograph of the dry leaves (a grey 缺圖 block until each tea's photograph is
// approved), the kind of tea as the small line, the tea's name, its note — running off the column's edge so the next card peeks in, a round
// arrow over the next card, a progress line under the slider; the sunrise film fills the right half edge to edge, as the tall photograph
// does at the stores. Built after StoreCarousel.
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { Img } from "@/data/content";
import { useT } from "@/i18n/LocaleProvider";
import { Picture } from "@/components/ui";

export type TeaCard = { name: string; text: string; image?: Img };

const split = (name: string) => { const m = name.match(/^(.*?)\s*[（(]([^（）()]+)[）)]\s*(.*)$/); return m ? { main: `${m[1]}${m[3] ? ` ${m[3]}` : ""}`, small: m[2] } : { main: name, small: "" }; };

export default function TeaNotesCarousel({ title, items, children }: { title: string; items: TeaCard[]; children: ReactNode }) {
  const { t } = useT();
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  // the kind of tea and, for a competition tea, its grade, from the name on either language's page
  const kind = (name: string) => {
    const grade = /頭等獎|First Prize/.test(name) ? t("頭等獎", "First Prize") : /貳等獎|Second Prize/.test(name) ? t("貳等獎", "Second Prize") : /參等獎|Third Prize/.test(name) ? t("參等獎", "Third Prize") : "";
    const base = /紅茶|Black Tea/.test(name) ? t("紅茶", "Black tea") : /花果|Fruit/.test(name) ? t("花草茶", "Herbal infusion") : t("烏龍茶", "Oolong tea");
    return grade ? `${base} / ${grade}` : base;
  };
  const onScroll = useCallback(() => {
    const el = track.current; if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
    const cards = el.querySelectorAll<HTMLElement>(".teas-card");
    const step = cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : 1;
    setActive(el.scrollLeft >= max - 2 ? items.length - 1 : Math.max(0, Math.min(items.length - 1, Math.round(el.scrollLeft / step))));
  }, [items.length]);
  useEffect(() => { onScroll(); }, [onScroll]);
  const go = (index: number) => {
    const el = track.current; if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>(".teas-card");
    const target = cards[Math.max(0, Math.min(items.length - 1, index))];
    if (!target) return;
    el.scrollTo({ left: Math.min(target.offsetLeft - cards[0].offsetLeft, el.scrollWidth - el.clientWidth), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return (
    <section className="teas" aria-roledescription={t("輪播", "carousel")} aria-label={title}>
      <div className="teas-body">
        <header className="teas-heading"><h2 id="tea-notes-title" className="tc">{title}</h2></header>
        <div className="teas-slider">
          <div ref={track} className="teas-track" tabIndex={0} onScroll={onScroll} aria-label={t("茶款卡片，可左右滑動", "Tea cards, scroll left or right")}
            onKeyDown={(e) => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); go(active + (e.key === "ArrowRight" ? 1 : -1)); } }}>
            {items.map((tea, i) => { const n = split(tea.name); return (
              <article key={tea.name} className="teas-card" aria-label={tea.name} aria-current={i === active ? "true" : undefined}>
                <div className="teas-card-image">{tea.image ? <Picture img={tea.image} fill fit="cover" animate={false} sizes="(min-width:768px) 30vw, 86vw" /> : <div className="teas-card-missing" role="img" aria-label={t("缺圖", "No image yet")}><span className="tc">{t("缺圖", "No image yet")}</span></div>}</div>
                <div className="teas-card-body">
                  <p className="teas-card-meta tc">{kind(tea.name)}</p>
                  <h3 className="tc">{n.main}{n.small && <small>{n.small}</small>}</h3>
                  <p className="teas-card-info tc">{tea.text}</p>
                </div>
              </article>); })}
          </div>
          {active > 0 && <button type="button" className="teas-arrow teas-arrow--prev" onClick={() => go(active - 1)} aria-label={t("上一款茶", "Previous tea")}>
            <svg width="34" height="12" viewBox="0 0 34 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M34 6H2M7 1 2 6l5 5" /></svg>
          </button>}
          {active < items.length - 1 && <button type="button" className="teas-arrow teas-arrow--next" onClick={() => go(active + 1)} aria-label={t("下一款茶", "Next tea")}>
            <svg width="34" height="12" viewBox="0 0 34 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M0 6h32M27 1l5 5-5 5" /></svg>
          </button>}
        </div>
        {items.length > 1 && <div className="teas-foot"><div className="teas-progress" aria-hidden="true"><span style={{ transform: `scaleX(${Math.max(progress, 1 / items.length)})` }} /></div></div>}
      </div>
      <div className="teas-media">{children}</div>
    </section>
  );
}
