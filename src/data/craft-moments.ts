import { site, type Img } from "./content";
import { translator, type Locale } from "../i18n/config";

// Homepage "以手成形" (2026-10-01): four crafts, one per category, each a portrait of the artisan behind it.
// Presentation after the jakobsencopenhagen.com/en/ homepage (user 2026-10-01: 「像雜誌的排版，有左邊兩張小圖」): see CraftMoments.tsx.
// 2026-10-01 (user): keep only the headline and the matching craft; the words describe the artisan; no other copy.
// Bilingual (2026-10-01): t("中文", "English"); hrefs are locale-neutral and prefixed where they are rendered.
export type CraftMoment = {
  id: string;
  craft: string;
  quote: [string, string];
  cta: { label: string; href: string };
  image: Img;
};

const build = (lang: Locale) => {
  const t = translator(lang);
  return {
    // user 2026-10-02: the heading and the four artisans' lines 換 the user's title and two paragraphs (the category links go too;
    // the last sentence was cut off in the paste and ends 「本質。」 as the user confirmed). The items below keep only their photographs' role.
    heading: [t("始於手溫", "Begun in the warmth of the hand"), t("形於日常", "Shaped in the everyday")],
    body: [
      t("物質本無言語，直到職人的手與時間在此重逢。從一折紙的流動、落刀前對皮革紋理的叩問，到金屬與木石在磨礪中的減法，我們在反覆琢磨的細節裡，將生命的溫度悄然刻入形體。",
        "Material has no words of its own until the artisan's hands and time meet in it. From the flow of a single fold of paper and the question put to the grain of leather before the blade comes down, to what metal, wood and stone lose as they are honed, we press the warmth of life quietly into form through details worked over again and again."),
      t("當作品走出展台，躍上肩頭、掠過耳畔、躍入茶湯，藝術便不再遙遠，而是轉化為一種可被觸摸的棲居姿態，凝練為生活最純粹的本質。",
        "When a piece leaves the display for the shoulder, the ear and the tea, art is no longer far away. It becomes a way of living you can touch, distilled into the purest substance of life."),
    ],
    // The two small photographs at the left of the first row (user 2026-10-02: the leather and goldsmith photographs
    // 換 these two). Cut from the user's side-by-side image to 4:5; 100 px of the plain studio ground continued above
    // the heads, since the supplied crop left none.
    smalls: [
      site("craft-small-bag-dancer-hands.webp", t("黑白照片：穿黑色長袖洋裝的女子雙手抬到臉旁，白色編織提把皮革包掛在手腕上",
        "Black-and-white photograph of a woman in a long-sleeved black dress, hands raised beside her face, the white Braided Leather Bag hanging from her wrist"), 876, 1095),
      site("craft-small-bag-dancer-reach.webp", t("黑白照片：穿黑色長袖洋裝的女子仰頭後傾，伸長的手臂提著白色編織提把皮革包",
        "Black-and-white photograph of a woman in a long-sleeved black dress leaning back with her head raised, the white Braided Leather Bag held at the end of her outstretched arm"), 876, 1095),
    ] as Img[],
    items: [
      {
        id: "tea",
        craft: t("摺紙職人 · 小金魚茶包禮盒", "Paper-folding artisan · Goldfish Tea Gifts"),
        quote: [t("摺紙的手，", "A sheet of filter paper,"), t("把一張濾紙摺成會游的形。", "folded by hand into a goldfish that comes to life in your cup.")],
        cta: { label: t("選一盒茶", "Explore tea gifts"), href: "/collections/tea" },
        // user 2026-10-02: the blossom glass cup 換 a Goldfish Tea Bag on the ottoman tray; second round (「靠近玻璃杯一點」, a round clear
        // cup like a coffee cup, a painting unlike the example, the ottoman in another colour): a new generated interior;
        // v3 (「右圖那張，後面角落的畫布要跟左圖一樣」「只變畫布的部分，其他不變」): the no-handle variant's painting composited in, every other pixel unchanged;
        // v4 (「這裡不自然」): the canvas continues down behind the ottoman instead of ending on a hard edge left of the tray
        image: site("ottoman-tray-tea-cup-v4-tagfix.webp", t("墨綠色毛圈布方凳上的木托盤裡，一只圓弧透明玻璃杯泡開一尾小金魚茶包，金色茶標寫著 CHARM VILLA；牆邊靠著一幅赭色圓形筆觸的抽象畫",
          "On a wooden tray on a moss-green bouclé ottoman, a Goldfish Tea Bag unfurls in a round clear glass cup, its gold tag reading CHARM VILLA; an abstract painting with a burnt-sienna circle leans against the wall"), 1792, 2240),
      },
      {
        id: "leather",
        craft: t("製革職人 · 編織提把皮革包", "Leather artisan · Braided Leather Bag"),
        quote: [t("裁皮的人，", "Before the first cut,"), t("落刀前先用手讀過整張皮。", "the artisan feels the grain and character of the leather.")],
        cta: { label: t("看交織系列", "Explore the Interwoven Collection"), href: "/collections/bags" },
        image: site("craft-02-leather-cream-rolls.webp", t("俯視的皮件工坊平鋪：木槌、皮繩、半月裁皮刀、削薄刀與木尺在左，兩捲米白荔枝紋皮料在右，暖光斜掃深色木桌",
          "A leather workshop flat lay seen from above: mallet, leather cord, half-moon knife, skiving knife and wooden rule on the left, two rolls of cream lychee-grain leather on the right, warm light raking across a dark wooden table")),
      },
      {
        id: "jewelry",
        craft: t("金工職人 · 小金魚耳環", "Goldsmith · Goldfish Earrings"),
        quote: [t("金工的人，", "The goldsmith refines each curve,"), t("磨到只剩輪廓才肯停手。", "bringing the goldfish's form into focus.")],
        cta: { label: t("看如魚得水", "Explore jewelry"), href: "/collections/jewelry" },
        image: site("craft-03-goldsmith-atelier.webp", t("晨光斜射進專業金工坊：半圓缺口的金工檯、皮兜與銼台上的小金魚，周圍是顯微鏡、吊鑽、壓延機與成排的鉗子",
          "Morning light slanting into a professional goldsmith's workshop: a bench with a half-round cut-out, a leather catch-skin and a small goldfish on the bench pin, surrounded by a microscope, a pendant drill, a rolling mill and rows of pliers")),
      },
      {
        id: "teaware",
        craft: t("木作職人 · 銀杏茶匙與杯墊", "Woodworker · Ginkgo Style Tea Spoon and Cloud Coaster"),
        quote: [t("做木的人，", "Following the grain,"), t("順著木紋把一片葉子鋸出來。", "the woodworker shapes a leaf from wood.")],
        cta: { label: t("看香味是喜悅的記憶", "Explore scents"), href: "/collections/scents" },
        // user 2026-10-02: the breakfast table 換 the tray-table scene, then that scene 換 a sunlit interior of the same pieces
        // with their engraved logos (also on the coaster and teaspoon pages)
        image: site("scene-wooden-interior-sunlit.webp", t("陽光從窗邊斜射在米白色圓形石灰桌面上，雲朵杯墊、梅花形木盒與銀杏茶匙各自刻著 CHARM VILLA，旁邊是毛圈布沙發與橡木長凳",
          "Low sun through a window across a round off-white plaster table: a cloud coaster, a plum-blossom wooden box and a ginkgo teaspoon, each engraved CHARM VILLA, beside a bouclé sofa and an oak bench"), 1792, 2240),
      },
    ] as CraftMoment[],
  };
};

const built: Partial<Record<Locale, ReturnType<typeof build>>> = {};
/** The section's copy in one language (built once per language). */
export const getCraftMoments = (lang: Locale) => (built[lang] ??= build(lang));
