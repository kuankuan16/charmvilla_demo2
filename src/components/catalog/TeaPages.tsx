// Under the scene photographs of a tea gift box, before 繼續觀看: 茶款介紹 follows Vizooli's sticky card process, then 美好的沖泡方式
// combines proposal 02's left photograph/right guide with proposal 01's point-to-point progress (user 2026-10-12).
// Rules begin at the copy column; stationary nodes connect only as far as the final node. The brewing icons are
// described where they are drawn below (the goldfish is the logo's vector, outlined like the rest, 「小金魚改為線稿，跟其他的風格一樣」, 2026-10-07).
import type { ReactNode } from "react";
import type { Product } from "@/data/catalog";
import TeaKinds from "./TeaKinds";
import BrewProcess from "./BrewProcess";
import { site, type Img } from "@/data/content";
import { GOLDFISH_D } from "./goldfish-path";
import { Picture } from "@/components/ui";

// Redrawn 2026-10-14 (「我要重畫」) after four tea and kitchen icon sets: front view, one even stroke with round ends, simple outlines,
// almost no inner detail (one highlight in the glass), motion told by small marks — the stream, steam waves, an arrow — and lots of
// air. No thermometer; the gooseneck kettle is bigger than the cup and steam rises while it pours (「不用溫度計」「熱水壺要比茶杯大」
// 「倒熱水的時候可以有煙」). Then 「線條太粗了，改細」 (2.2 → 1.5 on the 64 box), the sachet drawn after the real one (flat, nearly square,
// a seal strip across the top torn off at the notch, the gold top / white bottom split as a line 40% down, a soft bowed bottom), the
// goldfish the logo's own vector (「小金魚茶包用 logo 的向量金魚圖」) and a plain stopwatch (「時鐘再簡化」). The cup is the brand's glass
// teacup (wide mouth, narrow foot, C-loop handle, a short line under it, no saucer) at the same place and size in steps 1, 3, 4 and 5.
const SW = 1.5;
const icon = (d: ReactNode) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
/** the logo goldfish centred on (x, y), `w` wide, outlined at the icons' weight (the width is divided by the scale rather than using
 *  non-scaling-stroke, which would also ignore the icon's own viewBox scaling and draw the fish thinner than everything else) */
const fish = (x: number, y: number, w: number, sw = SW) => {
  const k = w / 838;
  return <path d={GOLDFISH_D} transform={`translate(${x - 564 * k} ${y - 538.5 * k}) scale(${k})`} strokeWidth={sw / k} />;
};
/** the same glass teacup in steps 1, 3, 4 and 5, slightly reduced so the kettle can be the bigger object; `inside` is drawn in the cup's
 *  own coordinates (the water line, the goldfish); the highlight is left out when the goldfish sits behind it */
const CS = .86;
/** `big`: steps 4 and 5 have nothing above the cup, so the cup is drawn larger there (bottom kept on the same line) and the icons
 *  fill the box as fully as steps 1–3 (user 2026-10-14: 「04 跟 05 比例都可以放大，整體的視覺上跟前三張圖一樣滿」); `tx` places it */
const cup = (inside: ReactNode, highlight = true, big = false, tx?: number) => { const k = big ? CS * 1.3 : CS; return <g transform={`translate(${tx ?? (big ? -6 : 1.26)} ${big ? 60 - 59.6 * k : 8.4}) scale(${k})`} strokeWidth={SW / k}>
  <path d="M9 37H37" /><path d="M9.4 37C9.4 47 13.4 55 20.6 56H25.4C32.6 55 36.6 47 36.6 37" />
  <path d="M36 40.6C44.4 39.4 46 51.6 33.4 52" /><path d="M16 59.6H30" />
  {highlight && <path d="M13.4 40.4C13.5 42 13.9 43.6 14.6 45" />}
  {inside}
</g>; };
const hotWater = <path d="M10.6 45Q23 47.4 35.4 45" />;
const brewed = (big = false) => <><path d="M9.8 40.2Q23 42.4 36.2 40.2" />{fish(23.4, 47.6, 13.5, SW / (big ? CS * 1.3 : CS))}</>;
/** a steam wave rising from (x, y), `h` tall */
const steam = (x: number, y: number, h: number) => <path d={`M${x} ${y}c-2.4-${h / 6}-2.4-${h / 3} 0-${h / 2}s2.4-${h / 3} 0-${h / 2}`} />;
/** one icon per brewing step, in the steps' order: pour (a tilted gooseneck kettle, the stream, steam), open (the seal strip torn off at
 *  the notch, the goldfish lifted out), add the goldfish (dropping into the hot water), steep (a stopwatch at five minutes, the goldfish
 *  in the tea), enjoy (steam) */
const brewIcons = [
  icon(<>
    {cup(hotWater)}
    <g transform="translate(44.6 19.4) rotate(-34)">
      <path d="M-11 11Q-12.6 11 -12.3 9.4L-9 -9.4Q-8.7 -11 -7 -11H7Q8.7 -11 9 -9.4L12.3 9.4Q12.6 11 11 11Z" />
      <path d="M-6.6 -11Q0 -17 6.6 -11" /><path d="M-1.4 -15.4V-16.8H1.4V-15.4" />
      <path d="M9.6 -6.6C18.4 -7.4 19.4 6.4 11.6 7.4" />
      <path d="M-12 7.4C-17.6 6.6 -16.4 -9.6 -19 -13.6Q-21 -16.6 -24 -13.4" />
    </g>
    <path d="M16.8 24.1C16.2 27.7 19.6 38 19.6 46.6" />
    {steam(11, 38.4, 8)}{steam(27.4, 38.4, 8)}
  </>),
  icon(<>
    <mask id="brew-open" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64"><rect width="64" height="35" fill="#fff" /></mask>
    <g mask="url(#brew-open)">{fish(29, 25, 24)}</g>
    <path d="M19 35V54.6Q19 56.4 21 56.6Q31 57.6 41 56.6Q43 56.4 43 54.6V37.2L41.4 36.2L43 35.2M19 35H43" />
    <path d="M19 42.4H43" /><path d="M19 36.4l1.2.8-1.2.8" />
    <g transform="rotate(-14 51 12)"><path d="M41 8.4H62.4V12.8H41Z" /><path d="M41 10.6H62.4" /></g>
    <path d="M44.6 33.4Q47.6 26 50.4 20.6" strokeDasharray="1.6 2.4" />
    <path d="M10 30V18M6.8 21.2L10 18l3.2 3.2" />
  </>),
  icon(<>
    {cup(hotWater)}
    {fish(23, 21, 21) /* smaller over the cup (user 2026-10-14: 「03 的小金魚比例要縮小」) */}
    <path d="M52 9V24M48.8 20.8L52 24l3.2-3.2" />
  </>),
  icon(<>
    {cup(brewed(true), false, true)}
    <circle cx="51" cy="17" r="8.5" /><path d="M51 17L54.2 11.9M49.3 6.2h3.4M51 6.2V8.5" />
  </>),
  icon(<>
    {cup(brewed(true), false, true, 1.2)}
    {steam(20, 30, 14)}{steam(27, 27, 17)}{steam(34, 30, 14)}
  </>),
];

/** the dry-leaf photograph of a tea, one scene for all of them (Nano Banana 2.1 after the rose oolong's, what each tea's dry leaf looks like
 *  checked on the web first; user 2026-10-08: 「用 Google 搜尋該類別的茶葉樣子並放入裡面，要生成所有的風格是一致的」); the competition teas
 *  show their base tea. The name is matched on either language's page. */
const leafPhotos: [RegExp, string, string, string, number, number][] = [
  [/玫瑰烏龍|Rose Oolong/, "tea-leaf-rose-oolong.webp", "玫瑰烏龍茶的茶葉與玫瑰花瓣", "Rose Oolong Tea leaves with rose petals", 2528, 1696],
  [/東方美人|Oriental Beauty/, "tea-leaf-oriental-beauty.webp", "東方美人茶的茶葉", "Oriental Beauty Tea leaves", 2528, 1696],
  [/紅玉|Ruby/, "tea-leaf-ruby-18.webp", "紅玉紅茶的茶葉", "Ruby Black Tea leaves", 2528, 1696],
  [/金萱|Jin Xuan/, "tea-leaf-jin-xuan.webp", "金萱烏龍茶的茶葉", "Jin Xuan Oolong Tea leaves", 2528, 1696],
  [/蜜香|Honey/, "tea-leaf-rose-honey-black.webp", "玫瑰蜜香紅茶的茶葉與玫瑰花瓣", "Rose & Honey-Scented Black Tea leaves with rose petals", 2528, 1696],
  [/花果|Fruit/, "tea-leaf-fruit-herbal.webp", "花果茶的果乾與花草", "Fruit & Herbal Tea, dried fruit and herbs", 2528, 1696],
  // the competition teas: not a leaf but the tea being poured, in the dark, steaming manner of the user's two references (2026-10-08:
  // 「比賽獲獎茶的情境照用專業的泡茶感呈現」; Nano Banana 2.1, portrait)
  [/比賽獲獎|Competition/, "tea-scene-competition-brewing-dark.webp", "把金黃茶湯倒進白瓷杯", "Golden tea poured into a white porcelain cup", 1856, 2304],
];
const leafPhoto = (name: string, t: (zh: string, en: string) => string): Img | undefined => {
  const hit = leafPhotos.find(([re]) => re.test(name));
  return hit && site(hit[1], t(hit[2], hit[3]), hit[4], hit[5]);
};

export default function TeaPages({ product, t }: { product: Product; t: (zh: string, en: string) => string }) {
  const notes = product.teaNotes, brew = product.brew;
  if (!notes && !brew) return null;
  const title = [notes?.title, brew?.title].filter(Boolean).join(t("與", " and "));
  return (
    <section className="tea-sheet" aria-label={title}>
      {/* 京都版 holds one tea chosen from four (user 2026-10-13: 「京都版後面備註 4 選 1」) */}
      {notes && <TeaKinds title={notes.title} productName={product.slug === "kyoto-gift-box" ? `${product.name}${t("（4 選 1）", " (choose 1 of 4)")}` : product.giftBox?.mixBoxes /* 雪花三盒組：每盒 5 選 1、三盒可混搭（2026-10-14） */ ? `${product.name}${t(`（${product.giftBox.choices?.length ?? 0} 款可混搭）`, ` (mix and match from ${product.giftBox.choices?.length ?? 0})`)}` : ["winter-blossom-gift-box", "spring-dawn-gift-box", "orchid-gift-box"].includes(product.slug) /* 「暮雪也要備註2選1」「春曉也是一樣的邏輯處理」 */ ? `${product.name}${t("（2 選 1）", " (choose 1 of 2)")}` : product.name} items={notes.items.map((n) => ({ name: n.name, text: n.text, term: n.term, image: leafPhoto(n.name, t) }))} />}
      {brew && <BrewProcess>
        {brew.image && <figure className="brew-visual">
          <Picture img={brew.image} fill animate={false} sizes="(max-width: 767px) 100vw, (max-width: 1279px) 40vw, 530px" />
        </figure>}
        <div className="brew-guide">
          <header className="brew-intro">
            <p className="brew-kicker tc"><span aria-hidden="true" />{t("美好的", "A beautiful")}</p>
            <h2 id="brew-title" className="brew-title tc">{t("沖泡方式", "way to brew")}</h2>
          </header>
          <ol className="brew-steps" data-brew-steps="">
            {brew.steps.map((s, i) => <li key={s.title} data-brew-step="">
              <span className="brew-node" data-brew-node="" aria-hidden="true" />
              <div className="brew-step-content" data-brew-reveal="">
                <span className="brew-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div className="brew-copy"><h3 className="tc">{s.title}</h3><p className="tc">{s.text}</p></div>
                <span className="brew-icon" aria-hidden="true">{brewIcons[i] ?? brewIcons[4]}</span>
              </div>
            </li>)}
          </ol>
        </div>
      </BrewProcess>}
    </section>
  );
}
