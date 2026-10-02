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
    heading: [t("從一雙手，", "From a pair of hands"), t("到一日的風景。", "to the scenery of a day.")],
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
        quote: [t("摺紙的手，", "The hands that fold"), t("把一張濾紙摺成會游的形。", "turn a sheet of filter paper into a form that swims.")],
        cta: { label: t("選一盒茶", "Choose a box of tea"), href: "/collections/tea" },
        image: site("craft-01-blossom-cup.webp", t("木桌上的玻璃杯裡泡開一尾小金魚茶包，棉線掛過杯緣、金色茶標落在桌面，背景是櫻花的散景",
          "A Goldfish Tea Bag unfurled in a glass cup on a wooden table, its cotton string over the rim and the gold tea tag resting on the table, cherry blossom out of focus behind")),
      },
      {
        id: "leather",
        craft: t("製革職人 · 編織提把皮革包", "Leather artisan · Braided Leather Bag"),
        quote: [t("裁皮的人，", "The one who cuts the leather"), t("落刀前先用手讀過整張皮。", "reads the whole hide by hand before the blade comes down.")],
        cta: { label: t("看真皮包", "View leather bags"), href: "/collections/bags" },
        image: site("craft-02-leather-cream-rolls.webp", t("俯視的皮件工坊平鋪：木槌、皮繩、半月裁皮刀、削薄刀與木尺在左，兩捲米白荔枝紋皮料在右，暖光斜掃深色木桌",
          "A leather workshop flat lay seen from above: mallet, leather cord, half-moon knife, skiving knife and wooden rule on the left, two rolls of cream lychee-grain leather on the right, warm light raking across a dark wooden table")),
      },
      {
        id: "jewelry",
        craft: t("金工職人 · 小金魚耳環", "Goldsmith · Goldfish Earrings"),
        quote: [t("金工的人，", "The goldsmith"), t("磨到只剩輪廓才肯停手。", "will not stop polishing until only the outline is left.")],
        cta: { label: t("看金飾", "View jewelry"), href: "/collections/jewelry" },
        image: site("craft-03-goldsmith-atelier.webp", t("晨光斜射進專業金工坊：半圓缺口的金工檯、皮兜與銼台上的小金魚，周圍是顯微鏡、吊鑽、壓延機與成排的鉗子",
          "Morning light slanting into a professional goldsmith's workshop: a bench with a half-round cut-out, a leather catch-skin and a small goldfish on the bench pin, surrounded by a microscope, a pendant drill, a rolling mill and rows of pliers")),
      },
      {
        id: "teaware",
        craft: t("木作職人 · 銀杏茶匙與杯墊", "Woodworker · Ginkgo Teaspoon and Coaster"),
        quote: [t("做木的人，", "The woodworker"), t("順著木紋把一片葉子鋸出來。", "saws a leaf out along the grain of the wood.")],
        cta: { label: t("看茶器與工藝", "View teaware and craft"), href: "/collections/teaware" },
        // user 2026-10-02: the breakfast table 換 the tray-table scene of the same pieces (also on the coaster and teaspoon pages)
        image: site("scene-wooden-tray-table-sofa.webp", t("梅花形木盒、雲朵杯墊與銀杏茶匙，放在沙發旁的黑色托盤邊几上",
          "A plum-blossom wooden box, a cloud-shaped coaster and a ginkgo teaspoon on a black tray table beside a sofa"), 1376, 2048),
      },
    ] as CraftMoment[],
  };
};

const built: Partial<Record<Locale, ReturnType<typeof build>>> = {};
/** The section's copy in one language (built once per language). */
export const getCraftMoments = (lang: Locale) => (built[lang] ??= build(lang));
