// Under the scene photographs of a tea gift box, before 繼續觀看: 茶款介紹 then 美好的沖泡方式, both after bramwel-service-template.webflow.io
// (user 2026-10-08: 「分析並高度學習與模仿…Comprehensive capabilities for enterprise growth 這一屏…背景色我要用皮革的咖啡色…右邊的 4 張卡片改為 5 張卡片介紹
// 目前官網的沖泡方式…icon 就用現在畫的沖泡 icon…文字的大小樣式我都要一模一樣去模仿」「Expertise Behind Bramwel 這一屏改介紹茶種」「最後將這兩屏順序顛倒」
// 「用『美好的沖泡方式』」): TeaKinds (the team screen, one card per tea) and BrewCapabilities (the service screen, one card per step). The
// earlier forms of this sheet (2026-10-07 one sheet; 2026-10-08 the rooferplus rail, the nexifye stack, the two-card panel, the stores-style
// carousel with the sunrise film) are in git history. The brewing icons are the line drawings drawn for the rail (the goldfish is the
// brand's own vector).
import type { ReactNode } from "react";
import type { Product } from "@/data/catalog";
import TeaKinds from "./TeaKinds";
import BrewCapabilities from "./BrewCapabilities";
import { site, type Img } from "@/data/content";
import { GOLDFISH_D } from "./goldfish-path";

const icon = (d: ReactNode) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="200" height="200" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
/** one icon per brewing step, in the steps' order (pour, open, add the goldfish — the brand's vector goldfish, steep, enjoy) */
// the brand's goldfish as a line drawing like the other icons (user 2026-10-07: 「小金魚改為線稿，跟其他的風格一樣」): stroke only, ~1.3/48 of the box
const goldfish = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 1224 1028" width="200" height="200" aria-hidden="true" className="brew-icon-goldfish"><path d={GOLDFISH_D} fill="none" stroke="currentColor" strokeWidth="32" strokeLinejoin="round" /></svg>;
const brewIcons = [
  icon(<><path d="M13 22h22l-2.2 15.2a2 2 0 0 1-2 1.8H17.2a2 2 0 0 1-2-1.8z" /><path d="M35 25h2.5a3.5 3.5 0 0 1 0 7H34" /><path d="M9 7c5 0 7 3 7 7 0 3-2 4-2 8" /><path d="M20 10c0 2-1.5 3-1.5 5" /><circle cx="25" cy="13" r=".6" fill="currentColor" /></>),
  icon(<><path d="M15 12h18v26H15z" /><path d="M15 12v-2h18v2" /><path d="M16 8.5h16M16 10.5h16" strokeWidth=".8" /><path d="M13 19h22" strokeDasharray="2 2.5" /><path d="M33 19l2.5-1.5v3z" fill="currentColor" stroke="none" /><path d="M20 27h8M20 31h8" strokeWidth=".9" /></>),
  goldfish(),
  icon(<><circle cx="24" cy="24" r="15" /><path d="M24 13v11l6 4" /><path d="M24 9v2M39 24h-2M24 39v-2M9 24h2" /></>),
  icon(<><path d="M12 22h22v6a9 9 0 0 1-9 9h-4a9 9 0 0 1-9-9z" /><path d="M34 25h2.5a3.5 3.5 0 0 1 0 7H34" /><path d="M9 41h30" /><path d="M18 8c0 2.5-2 3.5-2 6s2 3 2 5M24 6c0 2.5-2 3.5-2 6s2 3 2 5M30 8c0 2.5-2 3.5-2 6s2 3 2 5" /></>),
];

/** the dry-leaf photograph of a tea, in the manner of small Taiwanese tea houses' product photographs (Nano Banana 2.1; user 2026-10-08) */
const leafPhoto = (name: string, t: (zh: string, en: string) => string): Img | undefined =>
  /玫瑰烏龍|Rose Oolong/.test(name) ? site("tea-leaf-rose-oolong.webp", t("淺灰石板上一小堆玫瑰烏龍茶：緊實的深綠茶球混著粉紅玫瑰花瓣與幾顆玫瑰花苞", "A small heap of Rose Oolong on pale grey stone: tightly rolled dark-green tea pearls among pink rose petals and a few rosebuds"), 2528, 1696) : undefined;

/** the kind of tea for a card's hover reveal, from the name on either language's page */
const kindOf = (name: string, t: (zh: string, en: string) => string) => {
  const grade = /頭等獎|First Prize/.test(name) ? t("頭等獎", "First Prize") : /貳等獎|Second Prize/.test(name) ? t("貳等獎", "Second Prize") : /參等獎|Third Prize/.test(name) ? t("參等獎", "Third Prize") : "";
  const base = /紅茶|Black Tea/.test(name) ? t("紅茶", "Black tea") : /花果|Fruit/.test(name) ? t("花草茶", "Herbal infusion") : t("烏龍茶", "Oolong tea");
  return grade ? `${grade} · ${base}` : base;
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
      {notes && <TeaKinds label={t("茶款", "Our teas")} title={notes.title} items={notes.items.map((n) => ({ name: n.name, text: n.text, kind: kindOf(n.name, t), image: leafPhoto(n.name, t) }))} />}
      {brew && <BrewCapabilities label={t("沖泡步驟", "How to brew")} title={t("美好的沖泡方式", "A beautiful way to brew")}
        intro={t("從注入熱水到啜飲第一口，五個步驟，讓小金魚在杯中慢慢舒展，也讓自己慢下來。", "From pouring the water to the first sip: five steps that let the goldfish unfurl in the cup, and let you slow down with it.")}
        cards={brew.steps.map((s, i) => ({ title: s.title, text: s.text, icon: brewIcons[i] ?? brewIcons[4], tags: tags[i] ?? [] }))} />}
    </section>
  );
}
