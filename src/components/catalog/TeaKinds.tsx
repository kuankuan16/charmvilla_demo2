"use client";
// 茶款介紹：依 vizooli.webflow.io/home-b 的 Working Process 轉譯為 CHARM VILLA 的茶款閱讀路徑
// （使用者 2026-10-12）。桌機保留參考頁的三欄錯落白卡、大量留白、小圖、序號與進度方塊；手機改為
// 可左右滑動且露出下一張卡片。參考站的品牌文字、抽象圖與紅色識別不沿用，改放既有茶款名稱、核准文案與茶葉照片。
import type { Img } from "@/data/content";
import { useT } from "@/i18n/LocaleProvider";
import { Picture } from "@/components/ui";

export type TeaKind = { name: string; text: string; image?: Img };

/** 「紅玉紅茶（Red Jade／Ruby No.18）」→ 主名稱＋較小的第二行；全形、半形括號皆適用。 */
const splitName = (name: string): [string, string | undefined] => {
  const m = name.match(/^(.*?)\s*[（(]\s*(.+?)\s*[）)]\s*$/);
  return m ? [m[1], m[2]] : [name, undefined];
};

export default function TeaKinds({ title, items }: { title: string; items: TeaKind[] }) {
  const { t } = useT();
  const countClass = `teakind-main--${Math.min(items.length, 6)}`;

  return (
    <section className="teakind-sticky" aria-labelledby="tea-notes-title">
      <header className="teakind-head">
        <p className="teakind-kicker tc"><span aria-hidden="true" />{t("小金魚茶包", "GOLDFISH TEA BAGS")}</p>
        <h2 id="tea-notes-title" className="teakind-h02 tc" data-animation="split" data-split="lines" data-duration="0.9" data-start="top 88%">{title}</h2>
      </header>

      <div className="teakind-section">
        <ol className={`teakind-main ${countClass}`} aria-label={title} tabIndex={0}>
          {items.map((tea, i) => {
            const [name, sub] = splitName(tea.name);
            const step = String(i + 1).padStart(3, "0");
            const index = String(i + 1).padStart(2, "0");
            return (
              <li key={tea.name} className="teakind-pad" data-animation="moveUp" data-from="56" data-duration="1" data-delay={Math.min(i * 0.08, 0.32)} data-start="top 92%">
                <article className="teakind-card" aria-label={tea.name}>
                  <div className="teakind-card-top">
                    <div className="teakind-img">
                      {tea.image
                        ? <Picture img={tea.image} fill fit="cover" animate={false} sizes="(max-width: 767px) 124px, 136px" />
                        : <div className="teakind-missing" aria-hidden="true"><span>{index}</span></div>}
                    </div>
                    <span className="teakind-step" aria-hidden="true">TEA // {step}</span>
                  </div>

                  <div className="teakind-progress" aria-hidden="true">
                    {items.map((_, dot) => <span key={dot} className={dot <= i ? "is-active" : ""} />)}
                  </div>

                  <div className="teakind-card-copy">
                    <span className="teakind-index" aria-hidden="true">{index}</span>
                    <span className="teakind-rule" aria-hidden="true" />
                    <h3 className="teakind-h05 tc">{name}{sub && <small className="teakind-h05-sub">{sub}</small>}</h3>
                    <p className="teakind-cover-text tc">{tea.text}</p>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
