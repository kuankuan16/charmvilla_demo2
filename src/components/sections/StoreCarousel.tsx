"use client";
// Stores, after the "Our Beauty Journal" block of solena-template.webflow.io (user 2026-10-02: 「分店資訊我要參考…的呈現，分析後
// 高度模仿」): a tall photograph fills the left 45 % edge to edge; at the right the heading, then a slider of store cards
// (photograph, city and hours, store name, its line, address and phone) running off the right edge so the next card peeks
// in, a round arrow over the next card, and under the slider a square button to the current store's map beside a progress
// line. The screen keeps the dark ground the user chose for it (2026-10-02: 「這一屏想加入深色背景」).
import { useCallback, useEffect, useRef, useState } from "react";
import { getContent, site } from "@/data/content";
import { useT } from "@/i18n/LocaleProvider";
import { Picture } from "@/components/ui";

export default function StoreCarousel() {
  const { lang, t } = useT();
  const { visit } = getContent(lang);
  const shops = visit.tabs.find((tab) => tab.id === "shops")!.shops!;
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  const onScroll = useCallback(() => {
    const el = track.current; if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
    const cards = el.querySelectorAll<HTMLElement>(".stores-card");
    const step = cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : 1;
    // the last card cannot always scroll all the way to the start: at the end of the track it is the current one
    setActive(el.scrollLeft >= max - 2 ? shops.length - 1 : Math.max(0, Math.min(shops.length - 1, Math.round(el.scrollLeft / step))));
  }, [shops.length]);
  useEffect(() => { onScroll(); }, [onScroll]);

  const go = (index: number) => {
    const el = track.current; if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>(".stores-card");
    const target = cards[Math.max(0, Math.min(shops.length - 1, index))];
    if (!target) return;
    el.scrollTo({ left: Math.min(target.offsetLeft - cards[0].offsetLeft, el.scrollWidth - el.clientWidth), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  const current = shops[active];
  // the tall photograph at the left: an interior in the reference's mood (the brand has no further store photographs, and
  // repeating a card's photograph beside it would show the same picture twice)
  const mood = site("scene-coffee-table-tea-coasters.webp", t("陽光斜照的客廳一角，咖啡桌上一杯小金魚茶與雲朵杯墊", "Low sun across a living-room corner: a cup of goldfish tea and cloud coasters on a coffee table"), 1792, 2240);

  return (
    <div className="stores" aria-roledescription={t("輪播", "carousel")} aria-label={t("分店介紹", "Our stores")}>
      <div className="stores-media"><Picture img={mood} fill fit="cover" animate={false} sizes="(min-width:768px) 45vw, 100vw" /></div>
      <div className="stores-body">
        <header className="stores-heading"><h2>{visit.storesHeading}</h2>{visit.storesSub && <p className="tc">{visit.storesSub}</p>}</header>
        <div className="stores-slider">
          <div ref={track} className="stores-track" tabIndex={0} onScroll={onScroll} aria-label={t("門市卡片，可左右滑動", "Store cards, scroll left or right")}
            onKeyDown={(e) => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); go(active + (e.key === "ArrowRight" ? 1 : -1)); } }}>
            {shops.map((shop, i) => (
              <article key={shop.name} className="stores-card" aria-label={shop.name} aria-current={i === active ? "true" : undefined}>
                <div className="stores-card-image"><Picture img={shop.image} fill fit="cover" animate={false} sizes="(min-width:768px) 32vw, 86vw" /></div>
                <div className="stores-card-body">
                  <p className="stores-card-meta tc">{shop.intro.city} / {shop.hours}</p>
                  <h3 className="tc">{shop.name}</h3>
                  <p className="stores-card-desc tc">{shop.intro.body}</p>
                  <p className="stores-card-info tc">{shop.addr}{shop.phone && <> · <a href={`tel:${shop.phone.tel}`}>{shop.phone.label}</a></>}</p>
                </div>
              </article>
            ))}
          </div>
          {/* user 2026-10-02: 「往右滑之後想回來左邊回不來」 — a back arrow appears once the slider has moved; the forward one hides at the end */}
          {active > 0 && <button type="button" className="stores-arrow stores-arrow--prev" onClick={() => go(active - 1)} aria-label={t("上一家門市", "Previous store")}>
            <svg width="34" height="12" viewBox="0 0 34 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M34 6H2M7 1 2 6l5 5" /></svg>
          </button>}
          {active < shops.length - 1 && <button type="button" className="stores-arrow stores-arrow--next" onClick={() => go(active + 1)} aria-label={t("下一家門市", "Next store")}>
            <svg width="34" height="12" viewBox="0 0 34 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M0 6h32M27 1l5 5-5 5" /></svg>
          </button>}
        </div>
        <div className="stores-foot">
          <a href={current.href} target="_blank" rel="noreferrer" className="stores-button tc">{t(`查看地圖・${current.intro.city}`, `View map · ${current.intro.city}`)}</a>
          <div className="stores-progress" aria-hidden="true"><span style={{ transform: `scaleX(${Math.max(progress, 1 / shops.length)})` }} /></div>
        </div>
      </div>
    </div>
  );
}
