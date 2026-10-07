// Below the first screen of a tea gift box: 茶款介紹 and 沖泡方式 as two brochure-like pages (user 2026-10-07: 「把茶款介紹跟沖泡方式獨立出來…
// 在商品介紹頁下面，生成一個新的版型」, with references of interior-design decks — a rule with small labels across the top, a large
// title at the left, a numbered list with hairlines at the right, a photograph in the free column). The brewing steps carry line
// icons (「看能不能加入 icon 呈現」) and each page a tea photograph in the site's own light and colours.
import type { ReactNode } from "react";
import type { Product } from "@/data/catalog";
import type { Img } from "@/data/content";
import { Picture } from "@/components/ui";

const icon = (d: ReactNode) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
/** one line icon per brewing step, in the steps' order (pour, open, add the goldfish, steep, enjoy) */
const brewIcons = [
  icon(<><path d="M13 22h22l-2.2 15.2a2 2 0 0 1-2 1.8H17.2a2 2 0 0 1-2-1.8z" /><path d="M35 25h2.5a3.5 3.5 0 0 1 0 7H34" /><path d="M9 7c5 0 7 3 7 7 0 3-2 4-2 8" /><path d="M20 10c0 2-1.5 3-1.5 5" /><circle cx="25" cy="13" r=".6" fill="currentColor" /></>),
  icon(<><path d="M15 12h18v26H15z" /><path d="M15 12v-2h18v2" /><path d="M16 8.5h16M16 10.5h16" strokeWidth=".8" /><path d="M13 19h22" strokeDasharray="2 2.5" /><path d="M33 19l2.5-1.5v3z" fill="currentColor" stroke="none" /><path d="M20 27h8M20 31h8" strokeWidth=".9" /></>),
  icon(<><path d="M21 24.5c0-4 3.6-7 8-7s8 3 8 7-3.6 7-8 7-8-3-8-7z" /><path d="M21 24.5l-5-6 1.2 5.2-5.6-1.4 4.2 3.6-4.6 2.6 5.6-.2-2.6 4.8z" /><circle cx="33.5" cy="23.5" r=".9" fill="currentColor" /><path d="M8 38.5c2.7-2 5.3-2 8 0s5.3 2 8 0 5.3-2 8-0 5.3 2 8 0" /></>),
  icon(<><circle cx="24" cy="24" r="15" /><path d="M24 13v11l6 4" /><path d="M24 9v2M39 24h-2M24 39v-2M9 24h2" /></>),
  icon(<><path d="M12 22h22v6a9 9 0 0 1-9 9h-4a9 9 0 0 1-9-9z" /><path d="M34 25h2.5a3.5 3.5 0 0 1 0 7H34" /><path d="M9 41h30" /><path d="M18 8c0 2.5-2 3.5-2 6s2 3 2 5M24 6c0 2.5-2 3.5-2 6s2 3 2 5M30 8c0 2.5-2 3.5-2 6s2 3 2 5" /></>),
];

const paren = (text: string) => { const m = text.match(/^(.*?)\s*[（(]([^（）()]+)[）)]\s*(.*)$/); return m ? <>{m[1]}{m[3] && ` ${m[3]}`}<small>{m[2]}</small></> : text; };
const two = (n: number) => String(n).padStart(2, "0");

export default function TeaPages({ product, photos, t }: { product: Product; photos: { notes: Img; brew: Img }; t: (zh: string, en: string) => string }) {
  const notes = product.teaNotes, brew = product.brew;
  if (!notes && !brew) return null;
  let page = 0;
  const rule = (title: string) => <div className="tea-page-rule" aria-hidden="true"><span>CHARM VILLA</span><span>{product.name}{t("・", " · ")}{title}</span><span>{two(++page)}</span></div>;
  return (
    <section className="tea-pages" aria-label={t("茶款介紹與沖泡方式", "The teas and how to brew")}>
      {notes && <article className="tea-page tea-page--notes" aria-labelledby="tea-notes-title">
        {rule(notes.title)}
        <div className="tea-page-grid">
          <div className="tea-page-lead">
            <p className="tea-page-eyebrow">{t("茶款", "Tea selection")}</p>
            <h2 id="tea-notes-title" className="tc">{notes.title}</h2>
            <p className="tea-page-intro tc">{product.summary}</p>
            <figure className="tea-page-photo"><Picture img={photos.notes} fill fit="cover" animate={false} sizes="(min-width:768px) 40vw, 100vw" /></figure>
          </div>
          <ol className="tea-notes-list">
            {notes.items.map((n, i) => <li key={n.name}><span className="tea-num">({two(i + 1)})</span><div><h3 className="tc">{paren(n.name)}</h3><p className="tc">{n.text}</p></div></li>)}
          </ol>
        </div>
      </article>}
      {brew && <article className="tea-page tea-page--brew" aria-labelledby="brew-title">
        {rule(brew.title)}
        <div className="tea-page-grid tea-page-grid--brew">
          <figure className="tea-page-photo tea-page-photo--side"><Picture img={photos.brew} fill fit="cover" animate={false} sizes="(min-width:768px) 40vw, 100vw" /></figure>
          <div className="tea-page-lead">
            <p className="tea-page-eyebrow">{t("沖泡", "How to brew")}</p>
            <h2 id="brew-title" className="tc">{brew.title}</h2>
            <p className="tea-page-intro tc">{t("150 mL 熱水、95°C，浸泡約 5 分鐘。", "150 mL of water at 95°C, about 5 minutes.")}</p>
            <ol className="brew-steps">
              {brew.steps.map((s, i) => <li key={s.title}><span className="brew-icon">{brewIcons[i] ?? brewIcons[4]}</span><div><h3 className="tc"><span className="tea-num">{two(i + 1)}</span>{s.title}</h3><p className="tc">{s.text}</p></div></li>)}
            </ol>
          </div>
        </div>
      </article>}
    </section>
  );
}
