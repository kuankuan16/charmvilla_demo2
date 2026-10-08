// Under the scene photographs of a tea gift box, before 繼續觀看: 茶款介紹 after bramwel-service-template.webflow.io's "Expertise Behind Bramwel"
// screen (user 2026-10-08: 「Expertise Behind Bramwel 這一屏改介紹茶種」; TeaKinds, one card per tea), then 美好的沖泡方式 back on rooferplus.webflow.io's
// process timeline (BrewProcess + lib/motion/animations.ts brew-process; the same day: 「改回這個效果」 after one evening as bramwel's
// "Comprehensive capabilities…" card stack, with the reference's Step badge and bold title kept 「保留這個設計」 and the step's icon at the
// right of each row 「icon 在紅圈處」). The earlier forms of this sheet (2026-10-07 one sheet; 2026-10-08 the nexifye stack, the two-card
// panel, the stores-style carousel with the sunrise film, the bramwel stack) are in git history. The brewing icons are the ones redrawn in
// the manner of bramwel's capability icons (「icon 照這個風格…重新畫一遍像似的」): a 240 box, 3px strokes, a few plain geometric shapes
// repeated and overlapped — the goldfish is the brand's own vector, stroked the same way (「小金魚改為線稿，跟其他的風格一樣」, 2026-10-07).
import type { ReactNode } from "react";
import type { Product } from "@/data/catalog";
import { Picture } from "@/components/ui";
import TeaKinds from "./TeaKinds";
import BrewProcess from "./BrewProcess";
import { site, type Img } from "@/data/content";
import { GOLDFISH_D } from "./goldfish-path";

const icon = (d: ReactNode) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="180" height="180" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">{d}</svg>;
/** one icon per brewing step, in the steps' order: pour (a stream into four ripples), open (the sachet, its top torn up along the dashed
 *  notch line), add the goldfish (the brand's goldfish inside three rings), steep (the glass with four levels and the bag as a diamond),
 *  enjoy (the cup under three rings of steam) */
const brewIcons = [
  icon(<><ellipse cx="120" cy="150" rx="105" ry="48" /><ellipse cx="120" cy="150" rx="78" ry="36" /><ellipse cx="120" cy="150" rx="51" ry="24" /><ellipse cx="120" cy="150" rx="24" ry="11" /><path d="M120 12v138" /></>),
  icon(<><rect x="48" y="24" width="144" height="192" /><rect x="66" y="42" width="108" height="156" /><path d="M48 72h144" strokeDasharray="6 6" /><rect x="48" y="24" width="144" height="48" transform="rotate(-12 48 72)" /></>),
  icon(<><circle cx="120" cy="120" r="112" /><circle cx="120" cy="120" r="92" /><circle cx="120" cy="120" r="72" /><g transform="translate(40.5 53) scale(0.13)"><path d={GOLDFISH_D} strokeWidth="23" strokeLinejoin="round" /></g></>),
  icon(<><path d="M60 36h120v152a32 32 0 0 1-32 32H92a32 32 0 0 1-32-32z" /><path d="M60 90h120M60 120h120M60 150h120M60 180h120" /><rect x="104" y="124" width="32" height="32" transform="rotate(45 120 140)" /></>),
  icon(<><path d="M40 120h160v28a52 52 0 0 1-52 52h-56a52 52 0 0 1-52-52z" /><path d="M200 132h14a18 18 0 0 1 0 36h-14" /><circle cx="88" cy="74" r="26" /><circle cx="120" cy="60" r="26" /><circle cx="152" cy="74" r="26" /><path d="M40 212h160" /></>),
];

/** the dry-leaf photograph of a tea, one scene for all of them (Nano Banana 2.1 after the rose oolong's, what each tea's dry leaf looks like
 *  checked on the web first; user 2026-10-08: 「用 Google 搜尋該類別的茶葉樣子並放入裡面，要生成所有的風格是一致的」); the competition teas
 *  show their base tea. The name is matched on either language's page. */
const leafPhotos: [RegExp, string, string, string, number, number][] = [
  [/玫瑰烏龍|Rose Oolong/, "tea-leaf-rose-oolong.webp", "淺灰石板上一小堆玫瑰烏龍茶：緊實的深綠茶球混著粉紅玫瑰花瓣與幾顆玫瑰花苞", "A small heap of Rose Oolong on pale grey stone: tightly rolled dark-green tea pearls among pink rose petals and a few rosebuds", 2528, 1696],
  [/東方美人|Oriental Beauty/, "tea-leaf-oriental-beauty.webp", "淺灰石板上一小堆東方美人茶：白毫芽尖與紅褐、黃、綠、深褐五色交錯的鬆散條索", "A small heap of Oriental Beauty on pale grey stone: loosely twisted leaves in five colours, silvery downy tips among red-brown, amber, green and dark brown", 2528, 1696],
  [/紅玉|Ruby/, "tea-leaf-ruby-18.webp", "淺灰石板上一小堆紅玉紅茶：細長緊捲的烏黑條索，帶微微光澤", "A small heap of Ruby No. 18 on pale grey stone: long, slender, tightly twisted blackish-brown strips with a faint sheen", 2528, 1696],
  [/金萱|Jin Xuan/, "tea-leaf-jin-xuan.webp", "淺灰石板上一小堆金萱烏龍茶：緊實的墨綠半球形茶球，帶微焙的褐色與細梗", "A small heap of Jin Xuan oolong on pale grey stone: tightly rolled dark-green pearls with a touch of roast brown and small stems", 2528, 1696],
  [/蜜香|Honey/, "tea-leaf-rose-honey-black.webp", "淺灰石板上一小堆玫瑰蜜香紅茶：烏黑油潤的條索與銀白芽尖，混著粉紅玫瑰花瓣與花苞", "A small heap of Rose & Honey-Scented Black Tea on pale grey stone: glossy dark twisted strips with silvery tips among pink rose petals and rosebuds", 2528, 1696],
  [/花果|Fruit/, "tea-leaf-fruit-herbal.webp", "淺灰石板上一小堆花果茶：蘋果片、木瓜、芒果、鳳梨與蜜桃果乾丁、玫瑰果殼、藍色矢車菊花瓣與檸檬香茅段", "A small heap of Fruit & Herbal Tea on pale grey stone: dried apple, papaya, mango, pineapple and peach pieces, rosehip shells, blue cornflower petals and lemongrass", 2528, 1696],
  // the competition teas: not a leaf but the tea being poured, in the dark, steaming manner of the user's two references (2026-10-08:
  // 「比賽獲獎茶的情境照用專業的泡茶感呈現」; Nano Banana 2.1, portrait)
  [/比賽獲獎|Competition/, "tea-scene-competition-brewing-dark.webp", "深色茶室裡，一隻手把玻璃公道杯中的金黃茶湯倒進黑色錘紋托碟上的白瓷杯，蒸氣在暖光裡升起，後方是白瓷蓋碗", "In a dark tea room a hand pours golden tea from a glass fairness pitcher into a white porcelain cup on a black hammered saucer, steam rising in the warm light, a white gaiwan behind", 1856, 2304],
];
const leafPhoto = (name: string, t: (zh: string, en: string) => string): Img | undefined => {
  const hit = leafPhotos.find(([re]) => re.test(name));
  return hit && site(hit[1], t(hit[2], hit[3]), hit[4], hit[5]);
};

/** two short tags per brewing step, in the steps' order (the card's bottom right) */
const stepTags = (t: (zh: string, en: string) => string) => [[t("150 mL", "150 mL"), t("95°C", "95°C")], [t("沿缺口", "At the notch"), t("取出", "Lift out")], [t("輕壓", "Press gently"), t("浮起", "Let it float")], [t("5 分鐘", "5 minutes"), t("茶色漸深", "Colour deepens")], [t("茶香", "Fragrance"), t("留一段時間", "A little time")]];

export default function TeaPages({ product, t }: { product: Product; t: (zh: string, en: string) => string }) {
  const notes = product.teaNotes, brew = product.brew;
  if (!notes && !brew) return null;
  const title = [notes?.title, brew?.title].filter(Boolean).join(t("與", " and "));
  const tags = stepTags(t);
  return (
    <section className="tea-sheet" aria-label={title}>
      {notes && <TeaKinds label={t("茶款", "Our teas")} title={notes.title} items={notes.items.map((n) => ({ name: n.name, text: n.text, image: leafPhoto(n.name, t) }))} />}
      {brew && <BrewProcess>
        <h2 id="brew-title" className="tc" data-animation="split" data-split="chars" data-duration="0.9" data-stagger-interval="0.06" data-start="top 88%">{t("美好的沖泡方式", "A beautiful way to brew")}</h2>
        {brew.image && <figure className="brew-process-media" data-animation="moveUp" data-from="100" data-duration="1.2" data-ease="power2.out" data-start="top 90%"><Picture img={brew.image} fill fit="cover" animate={false} sizes="(min-width:768px) 31vw, 100vw" /></figure>}
        <ol className="brew-steps" data-brew-steps="">
          {brew.steps.map((s, i) => <li key={s.title} data-brew-step="">
            <span className="brew-rail" aria-hidden="true"><span className="brew-dot" />{i < brew.steps.length - 1 && <span className="brew-line"><span className="brew-line-fill" /></span>}</span>
            {/* the card is bramwel's (「這個動態效果加…卡片設計」): the badge and the title at the top left, the text at the top right, the icon at the bottom left, two tags at the bottom right */}
            <article className="brew-card">
              <div className="brew-card-top">
                <div className="brew-card-head"><span className="brew-step-badge tc">{t(`步驟 ${i + 1}`, `Step ${i + 1}`)}</span><h3 className="tc">{s.title}</h3></div>
                <p className="tc">{s.text}</p>
              </div>
              <div className="brew-card-bottom">
                <span className="brew-icon" aria-hidden="true">{brewIcons[i] ?? brewIcons[4]}</span>
                <div className="brew-tags">{(tags[i] ?? []).map((tag) => <span key={tag} className="brew-tag tc">{tag}</span>)}</div>
              </div>
            </article>
          </li>)}
        </ol>
      </BrewProcess>}
    </section>
  );
}
