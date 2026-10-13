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

// Redrawn 2026-10-13 (user: 「這幾個插畫實在太粗糙」, pointing at two instruction-diagram references): real objects with depth instead
// of flat outlines, one steady 1.9 stroke in a 64 box, round caps, a few small parts (lid knob, crimped seals, a glint on the glass),
// motion cues (the stream, a tear arrow, a falling arrow, ripples), and solid gold used only where the eye should land. The same glass
// teacup — wide mouth, narrow foot, C-loop handle — carries the story: clear water, the goldfish going in, the tea deepening while the
// timer runs, then the full cup steaming on the cloud coaster (never a saucer). The goldfish is still the brand's own vector.
const icon = (d: ReactNode) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
/** the brand goldfish centred on (x, y), `size` wide, stroked at the icons' weight or filled solid */
const fish = (x: number, y: number, size: number, solid = false) => {
  const k = size / 838;
  return <path d={GOLDFISH_D} transform={`translate(${x - 564 * k} ${y - 538.5 * k}) scale(${k})`} strokeWidth={1.9 / k} fill={solid ? "currentColor" : "none"} />;
};
/** the glass teacup; `tea` is the liquid's opacity (omit for an empty cup) */
const cup = (x: number, y: number, tea?: number) => <g transform={`translate(${x} ${y})`}>
  {tea !== undefined && <path d="M18.05 36A11.95 2.6 0 0 1 41.95 36L39.5 50Q39 53 36 53H24Q21 53 20.5 50Z" fill="currentColor" fillOpacity={tea} stroke="none" />}
  {tea !== undefined && <ellipse cx="30" cy="36" rx="11.95" ry="2.6" strokeWidth="1" />}
  <ellipse cx="30" cy="30" rx="13" ry="3.2" />
  <path d="M17 30L20.5 50Q21 53 24 53H36Q39 53 39.5 50L43 30" />
  <path d="M42.2 34.5C49.5 33.5 50 44.5 40.4 45" />
  <path d="M21 34.5l1.8 12" strokeWidth="1" strokeOpacity=".55" />
</g>;
/** one icon per brewing step, in the steps' order: pour (a gooseneck kettle's stream into clear water), open (the sachet torn at the notch,
 *  the goldfish showing), add the goldfish (falling into the cup, ripples), steep (the tea deepening, a timer at five minutes), enjoy */
const brewIcons = [
  icon(<>
    <g transform="rotate(18 15 21)">
      <path d="M6 28L8 14Q8.5 12 10.5 12H19.5Q21.5 12 22 14L24 28Q24 30 22 30H8Q6 30 6 28Z" />
      <path d="M7 24h16" strokeWidth="1" />
      <path d="M10.5 12Q15 8.5 19.5 12" /><circle cx="15" cy="8.6" r="1" fill="currentColor" />
      <path d="M7.3 15.5C1.5 15.5 1.5 25.5 6.6 25.5" />
      <path d="M23.4 25.5C29.5 26.5 28 14 33 12.2L35 11.6" />
    </g>
    <path d="M37 19.5C38 26 38.6 33 38.6 41" strokeWidth="1.2" />
    {cup(8, 6, 0.14)}
    <path d="M35.5 42.6q3 1.2 6.2 0" strokeWidth="1" />
  </>),
  icon(<>
    <clipPath id="brew-icon-pouch-mouth"><rect x="0" y="0" width="64" height="22" /></clipPath>
    <g clipPath="url(#brew-icon-pouch-mouth)" stroke="none">{fish(31, 18, 15, true)}</g>
    <path d="M17 22V53Q17 55 19 55H45Q47 55 47 53V22" />
    <path d="M17 22l3-1.4 3 1.4 3-1.4 3 1.4 3-1.4 3 1.4 3-1.4 3 1.4 3-1.4 3 1.4" strokeWidth="1.2" />
    <path d="M17 49.5h30" strokeWidth="1" /><path d="M21 49.5v5.5M25 49.5v5.5M29 49.5v5.5M33 49.5v5.5M37 49.5v5.5M41 49.5v5.5" strokeWidth=".9" />
    <path d="M23 31h18M23 35h12" strokeWidth="1" strokeOpacity=".6" />
    <g transform="rotate(-26 17 15)"><path d="M17 15.6l3-1.4 3 1.4 3-1.4 3 1.4 3-1.4 3 1.4 3-1.4 3 1.4 3-1.4 3 1.4V10H17Z" strokeWidth="1.4" /></g>
    <path d="M53 21c2.4-3 2.4-7 .4-10" strokeWidth="1.2" /><path d="M51.2 12.5l2.2-1.6.6 2.7" strokeWidth="1.2" />
  </>),
  icon(<>
    <g stroke="none">{fish(30, 15, 18, true)}</g>
    <path d="M49 6v15" strokeWidth="1.2" strokeDasharray="2 2.4" /><path d="M46.4 18.6l2.6 3.4 2.6-3.4" strokeWidth="1.2" />
    {cup(0, 8, 0.14)}
    <path d="M24 44.2q6 2.4 12 0M27.5 42.4q2.5.9 5 0" strokeWidth="1" />
  </>),
  icon(<>
    {cup(-6, 4, 0.5)}
    <g stroke="none" fillOpacity=".9">{fish(24, 45.5, 12, true)}</g>
    <circle cx="50" cy="15" r="10" />
    <path d="M50 15V5A10 10 0 0 1 55 6.34Z" fill="currentColor" stroke="none" />
    <path d="M50 15V8.5M50 15l3.6 2.2" strokeWidth="1.4" />
    <path d="M50 3.2V5M61.8 15H60M50 26.8V25M38.2 15H40" strokeWidth="1.2" />
  </>),
  icon(<>
    <path d="M24 13c0-3 2.4-3.6 2.4-6.6M30 12c0-3 2.4-3.6 2.4-6.6M36 13c0-3 2.4-3.6 2.4-6.6" strokeWidth="1.4" />
    {cup(0, 1, 0.9)}
    <path d="M14 60.5c-3.4 0-3.6-4.2-.2-4.6 1-2.8 5-3 6.6-1h19.2c1.6-2 5.6-1.8 6.6 1 3.4.4 3.2 4.6-.2 4.6Z" />
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
      {notes && <TeaKinds title={notes.title} productName={product.name} items={notes.items.map((n) => ({ name: n.name, text: n.text, image: leafPhoto(n.name, t) }))} />}
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
