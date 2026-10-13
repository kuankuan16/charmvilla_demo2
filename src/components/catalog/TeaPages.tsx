// Under the scene photographs of a tea gift box, before 繼續觀看: 茶款介紹 follows Vizooli's sticky card process, then 美好的沖泡方式
// combines proposal 02's left photograph/right guide with proposal 01's point-to-point progress (user 2026-10-12).
// Rules begin at the copy column; stationary nodes connect only as far as the final node. The brewing icons are
// the ones redrawn in
// the manner of bramwel's capability icons (「icon 照這個風格…重新畫一遍像似的」): a 240 box, 3px strokes, a few plain geometric shapes
// repeated and overlapped — the goldfish is the brand's own vector, stroked the same way (「小金魚改為線稿，跟其他的風格一樣」, 2026-10-07).
import type { ReactNode } from "react";
import type { Product } from "@/data/catalog";
import TeaKinds from "./TeaKinds";
import BrewProcess from "./BrewProcess";
import { site, type Img } from "@/data/content";
import { GOLDFISH_D } from "./goldfish-path";
import { Picture } from "@/components/ui";

// Redrawn again 2026-10-13 after six instruction-sheet references (「在分析並學習重新畫一次泡茶的插畫」). What they share and these keep:
// one cup that never moves — bottom centre, same size in every step — with only the action above it changing; thin even
// lines and no filled shapes; plain cues (the stream, a ↓ arrow, a dashed tear line, steam); heat and time drawn as a
// thermometer and a stopwatch (a number in the badge would be unreadable at 64px; the copy gives 95°C and 5 minutes); lots of air. The cup is the brand's glass teacup (wide mouth, narrow foot, C-loop handle) standing
// on a line, not a saucer; the goldfish is the brand's own vector, stroked at the same weight.
const icon = (d: ReactNode) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
/** the brand goldfish centred on (x, y), `size` wide, outlined at the icons' weight */
const fish = (x: number, y: number, size: number) => {
  const k = size / 838;
  return <path d={GOLDFISH_D} transform={`translate(${x - 564 * k} ${y - 538.5 * k}) scale(${k})`} strokeWidth={1.3 / k} />;
};
/** the same glass teacup in every step; `tea` draws the surface of the liquid */
const cup = (tea = false) => <>
  <ellipse cx="32" cy="35" rx="14" ry="2.2" />
  <path d="M18 35L21.2 52.4Q21.6 55 24.2 55H39.8Q42.4 55 42.8 52.4L46 35" />
  <path d="M45.3 39.2C52.5 38.6 52.6 49.4 43.4 49.6" />
  <path d="M15 58H49" />
  <path d="M22.4 39.5l1.4 9.5" strokeOpacity=".5" />
  {tea && <path d="M19.2 41.5Q32 44.2 44.8 41.5" />}
</>;
/** a stopwatch at the top right, its hand at five minutes (the copy beside it gives the number) */
const stopwatch = <g>
  <circle cx="51" cy="14" r="8.5" /><path d="M51 3.4v2.1M49 3.4h4M57.4 7.6l1.2-1.2" />
  <path d="M51 14l2.7-4.7" /><path d="M51 14V5.5A8.5 8.5 0 0 1 55.25 6.64Z" strokeWidth=".9" />
</g>;
/** one icon per brewing step, in the steps' order: pour (gooseneck kettle, a thermometer), open (the sachet torn at the notch), add the
 *  goldfish (falling in), steep (the goldfish in the tea, a stopwatch), enjoy (steam) */
const brewIcons = [
  icon(<>
    {cup()}
    <g transform="rotate(-26 45 16)">
      <path d="M37 24l1.7-12.5Q39.1 10.5 40.6 10.5h9.8Q51.9 10.5 52.3 12L54 24Q54 26 52 26H39Q37 26 37 24Z" />
      <path d="M41.2 10.5Q45.5 7 49.8 10.5" /><circle cx="45.5" cy="7.4" r=".9" />
      <path d="M53.3 14.2C58.6 14.2 58.8 22.8 53.6 22.8" />
      <path d="M37.7 22.6C32 23 33.6 13 28.4 12.6L27 12.8" />
    </g>
    <path d="M27.6 20.6C28.6 25 29.6 29.5 30.2 34.6" />
    <rect x="8" y="5" width="4" height="13" rx="2" /><circle cx="10" cy="20.6" r="3" /><path d="M10 11v7M13.6 8h1.8M13.6 11h1.8M13.6 14h1.8" />
  </>),
  icon(<>
    <path d="M34 12H19V56H45V20" />
    <path d="M19 20H34" strokeDasharray="2.4 2" />
    <path d="M34 20L35.5 11L45.5 7.8L45 20" />
    {fish(32, 38, 15)}
  </>),
  icon(<>
    {cup()}
    {fish(32, 15, 17)}
    <path d="M51 8v13M47.8 18l3.2 3.6 3.2-3.6" />
  </>),
  icon(<>
    {cup(true)}
    {fish(31, 47.5, 12)}
    {stopwatch}
  </>),
  icon(<>
    {cup(true)}
    <path d="M26 28c-2-2.4-2-4.6 0-7s2-4.6 0-7M32 26c-2-2.4-2-4.6 0-7s2-4.6 0-7M38 28c-2-2.4-2-4.6 0-7s2-4.6 0-7" />
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
      {notes && <TeaKinds title={notes.title} productName={product.slug === "kyoto-gift-box" ? `${product.name}${t("（4 選 1）", " (choose 1 of 4)")}` : (product.slug === "winter-blossom-gift-box" || product.slug === "spring-dawn-gift-box") /* 「暮雪也要備註2選1」「春曉也是一樣的邏輯處理」 */ ? `${product.name}${t("（2 選 1）", " (choose 1 of 2)")}` : product.name} items={notes.items.map((n) => ({ name: n.name, text: n.text, image: leafPhoto(n.name, t) }))} />}
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
