// Under the scene photographs of a tea gift box, before 繼續觀看: 茶款介紹 then 美好的沖泡方式, both after bramwel-service-template.webflow.io
// (user 2026-10-08: 「分析並高度學習與模仿…Comprehensive capabilities for enterprise growth 這一屏…背景色我要用皮革的咖啡色…右邊的 4 張卡片改為 5 張卡片介紹
// 目前官網的沖泡方式…icon 就用現在畫的沖泡 icon…文字的大小樣式我都要一模一樣去模仿」「Expertise Behind Bramwel 這一屏改介紹茶種」「最後將這兩屏順序顛倒」
// 「用『美好的沖泡方式』」): TeaKinds (the team screen, one card per tea) and BrewCapabilities (the service screen, one card per step). The
// earlier forms of this sheet (2026-10-07 one sheet; 2026-10-08 the rooferplus rail, the nexifye stack, the two-card panel, the stores-style
// carousel with the sunrise film) are in git history. The brewing icons are redrawn in the manner of bramwel's capability icons (user
// 2026-10-08: 「icon 照這個風格…重新畫一遍像似的」): a 240 box, 3px strokes, a few plain geometric shapes repeated and overlapped, shown at
// 60 % — the goldfish is the brand's own vector, stroked the same way (「小金魚改為線稿，跟其他的風格一樣」, 2026-10-07).
import type { ReactNode } from "react";
import type { Product } from "@/data/catalog";
import TeaKinds from "./TeaKinds";
import BrewCapabilities from "./BrewCapabilities";
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
const leafPhotos: [RegExp, string, string, string][] = [
  [/玫瑰烏龍|Rose Oolong/, "tea-leaf-rose-oolong.webp", "淺灰石板上一小堆玫瑰烏龍茶：緊實的深綠茶球混著粉紅玫瑰花瓣與幾顆玫瑰花苞", "A small heap of Rose Oolong on pale grey stone: tightly rolled dark-green tea pearls among pink rose petals and a few rosebuds"],
  [/東方美人|Oriental Beauty/, "tea-leaf-oriental-beauty.webp", "淺灰石板上一小堆東方美人茶：白毫芽尖與紅褐、黃、綠、深褐五色交錯的鬆散條索", "A small heap of Oriental Beauty on pale grey stone: loosely twisted leaves in five colours, silvery downy tips among red-brown, amber, green and dark brown"],
  [/紅玉|Ruby/, "tea-leaf-ruby-18.webp", "淺灰石板上一小堆紅玉紅茶：細長緊捲的烏黑條索，帶微微光澤", "A small heap of Ruby No. 18 on pale grey stone: long, slender, tightly twisted blackish-brown strips with a faint sheen"],
  [/金萱|Jin Xuan/, "tea-leaf-jin-xuan.webp", "淺灰石板上一小堆金萱烏龍茶：緊實的墨綠半球形茶球，帶微焙的褐色與細梗", "A small heap of Jin Xuan oolong on pale grey stone: tightly rolled dark-green pearls with a touch of roast brown and small stems"],
  [/蜜香|Honey/, "tea-leaf-rose-honey-black.webp", "淺灰石板上一小堆玫瑰蜜香紅茶：烏黑油潤的條索與銀白芽尖，混著粉紅玫瑰花瓣與花苞", "A small heap of Rose & Honey-Scented Black Tea on pale grey stone: glossy dark twisted strips with silvery tips among pink rose petals and rosebuds"],
  [/花果|Fruit/, "tea-leaf-fruit-herbal.webp", "淺灰石板上一小堆花果茶：蘋果片、木瓜、芒果、鳳梨與蜜桃果乾丁、玫瑰果殼、藍色矢車菊花瓣與檸檬香茅段", "A small heap of Fruit & Herbal Tea on pale grey stone: dried apple, papaya, mango, pineapple and peach pieces, rosehip shells, blue cornflower petals and lemongrass"],
];
const leafPhoto = (name: string, t: (zh: string, en: string) => string): Img | undefined => {
  const hit = leafPhotos.find(([re]) => re.test(name));
  return hit && site(hit[1], t(hit[2], hit[3]), 2528, 1696);
};
/** two short tags per brewing step, in the steps' order */
const stepTags = (t: (zh: string, en: string) => string) => [[t("150 mL", "150 mL"), t("95°C", "95°C")], [t("沿缺口", "At the notch"), t("取出", "Lift out")], [t("輕壓", "Press gently"), t("浮起", "Let it float")], [t("5 分鐘", "5 minutes"), t("茶色漸深", "Colour deepens")], [t("茶香", "Fragrance"), t("留一段時間", "A little time")]];

export default function TeaPages({ product, t }: { product: Product; t: (zh: string, en: string) => string }) {
  const notes = product.teaNotes, brew = product.brew;
  if (!notes && !brew) return null;
  const title = [notes?.title, brew?.title].filter(Boolean).join(t("與", " and "));
  const tags = stepTags(t);
  return (
    <section className="tea-sheet" aria-label={title}>
      {notes && <TeaKinds label={t("茶款", "Our teas")} title={notes.title} items={notes.items.map((n) => ({ name: n.name, text: n.text, image: leafPhoto(n.name, t) }))} />}
      {brew && <BrewCapabilities label={t("沖泡步驟", "How to brew")} title={t("美好的沖泡方式", "A beautiful way to brew")}
        intro={t("從注入熱水到啜飲第一口，五個步驟，讓小金魚在杯中慢慢舒展，也讓自己慢下來。", "From pouring the water to the first sip: five steps that let the goldfish unfurl in the cup, and let you slow down with it.")}
        cards={brew.steps.map((s, i) => ({ title: s.title, text: s.text, icon: brewIcons[i] ?? brewIcons[4], tags: tags[i] ?? [] }))} />}
    </section>
  );
}
