"use client";
// 8: VISIT US — giant heading on the grey band, SHOPS / ONLINE tab panel, NEWS band (reference: "IN TOUCH:" contact/career tabs).
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { visit } from "@/data/content";
import { SectionIndex, Arrow, Picture } from "@/components/ui";

type TabId = (typeof visit.tabs)[number]["id"];

export default function Visit() {
  const [active, setActive] = useState<TabId>(visit.tabs[0].id);
  const [fading, setFading] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = useCallback((id: TabId) => {
    setActive((prev) => {
      if (prev !== id) setFading(true);
      return id;
    });
  }, []);

  // Let the newly shown panel paint at opacity-0 once, then release it so the .3s fade runs.
  useEffect(() => {
    if (!fading) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setFading(false));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [fading, active]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = visit.tabs.length;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (i + 1) % n;
    else if (e.key === "ArrowLeft") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next === null) return;
    e.preventDefault();
    tabRefs.current[next]?.focus();
    select(visit.tabs[next].id);
  };

  return (
    <section id="visit" className="relative">
      <div className="container-x border-t border-ink/20 pt-30 pb-40">
        <SectionIndex n={visit.index} />
        <h2 className="text-[22vw] font-bold leading-xxs tracking-tightest laptop:text-19xl" data-animation="split" data-split="words, chars">
          VISIT
          <br />
          US:
        </h2>
      </div>

      <div className="container-x">
        <div role="tablist" aria-label="門市與線上" className="grid grid-cols-2">
          {visit.tabs.map((t, i) => {
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`tab-${t.id}`}
                type="button"
                aria-selected={isActive}
                aria-controls={`panel-${t.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(t.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`flex items-center gap-15 px-25 py-20 text-left text-2xl font-bold transition-colors duration-300 lg:px-30 lg:py-25 lg:text-4xl ${
                  isActive ? "border-b-2 border-ink text-ink" : "border-b border-ink/20 text-stone-deep"
                }`}
              >
                <span className={`inline-block h-16 w-16 shrink-0 rounded-full border-2 border-current ${isActive ? "bg-current" : ""}`} />
                {t.labelEn}
                <span className="tc text-base font-medium">{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="min-h-[420px] bg-white px-25 py-40 lg:px-30">
          {visit.tabs.map((t) => {
            const isActive = active === t.id;
            return (
              <div
                key={t.id}
                role="tabpanel"
                id={`panel-${t.id}`}
                aria-labelledby={`tab-${t.id}`}
                hidden={!isActive}
                className={`transition-opacity duration-300 ${isActive && !fading ? "opacity-100" : "opacity-0"}`}
              >
                {t.shops ? (
                  <div className="grid gap-30 md:grid-cols-2">
                    {t.shops.map((s) => (
                      <div key={s.name}>
                        <div className="relative aspect-[3/2]" data-animation="clip">
                          <Picture img={s.image} fill sizes="(min-width:768px) 45vw, 100vw" className="h-full w-full" />
                        </div>
                        <h3 className="tc mt-20 text-2xl font-bold">{s.name}</h3>
                        <p className="tc mt-8 text-base font-bold">{s.addr}</p>
                        {s.hours && <p className="tc mt-4 text-xs font-bold text-stone-deep">{s.hours}</p>}
                        <a href={s.href} target="_blank" rel="noreferrer" className="link-underline mt-15 inline-block text-xs font-bold">
                          OPEN MAP ↳
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-30 md:grid-cols-2">
                    <div className="relative aspect-[3/2]">
                      <Picture img={t.image} fill sizes="(min-width:768px) 45vw, 100vw" className="h-full w-full" />
                    </div>
                    <div>
                      <p className="tc text-base font-bold">{t.text}</p>
                      <a className="btn btn--outline mt-25" href={t.href} target="_blank" rel="noreferrer">
                        <span>ONLINE SHOP</span>
                        <Arrow />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-12 gap-x-20 border-t border-ink/20 bg-white px-25 py-40 lg:px-30">
          <div className="col-span-12 text-xs font-bold lg:col-span-5">{visit.news.label}</div>
          <ul className="col-span-12 mt-20 lg:col-span-7 lg:mt-0">
            {visit.news.items.map((n, i) => (
              <li
                key={n.text}
                data-animation="moveUp"
                data-delay={i * 0.1}
                className="grid grid-cols-[70px_80px_1fr] gap-x-15 border-t border-ink/30 py-15 last:border-b lg:grid-cols-[90px_90px_1fr]"
              >
                <span className="tc text-xs font-bold">{n.date}</span>
                <span className="tc text-xs font-bold text-ink/60">{n.tag}</span>
                <span className="tc text-base font-bold">{n.text}</span>
              </li>
            ))}
          </ul>
          <a href={visit.instagram} target="_blank" rel="noreferrer" className="link-underline col-span-12 mt-30 w-max text-xs font-bold">
            INSTAGRAM ↳
          </a>
        </div>
      </div>
    </section>
  );
}
