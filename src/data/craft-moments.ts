import { site, type Img } from "./content";
import { translator, type Locale } from "../i18n/config";

// Homepage "以手成形" carousel (2026-10-01): four cards, one per category, each a portrait of the artisan behind it.
// Presentation after recruit.positive.co.jp (Interview): drag carousel, tilted card, side peeks, outlined CTA.
// 2026-10-01 (user): keep only the big headline and the matching craft; the words describe the artisan; no other copy.
// Bilingual (2026-10-01): t("中文", "English"); hrefs are locale-neutral and prefixed where they are rendered.
export type CraftMoment = {
  id: string;
  craft: string;
  quote: [string, string];
  ctas: { label: string; href: string }[];
  image: Img;
};

const build = (lang: Locale) => {
  const t = translator(lang);
  return {
    heading: [t("從一雙手，", "From a pair of hands"), t("到一日的風景。", "to the scenery of a day.")],
    items: [
      {
        id: "tea",
        craft: t("摺紙職人 · 小金魚茶包禮盒", "Paper-folding artisan · Goldfish Tea Gifts"),
        quote: [t("摺紙的手，", "The hands that fold"), t("把一張濾紙摺成會游的形。", "turn a sheet of filter paper into a form that swims.")],
        ctas: [{ label: t("選一盒茶", "Choose a box of tea"), href: "/collections/tea" }],
        image: site("craft-01-blossom-cup.webp", t("木桌上的玻璃杯裡泡開一尾小金魚茶包，棉線掛過杯緣、金色茶標落在桌面，背景是櫻花的散景",
          "A Goldfish Tea Bag unfurled in a glass cup on a wooden table, its cotton string over the rim and the gold tea tag resting on the table, cherry blossom out of focus behind")),
      },
      {
        id: "leather",
        craft: t("製革職人 · 編織提把皮革包", "Leather artisan · Braided Leather Bag"),
        quote: [t("裁皮的人，", "The one who cuts the leather"), t("落刀前先用手讀過整張皮。", "reads the whole hide by hand before the blade comes down.")],
        ctas: [{ label: t("看真皮包", "View leather bags"), href: "/collections/bags" }],
        image: site("craft-02-leather-cream-rolls.webp", t("俯視的皮件工坊平鋪：木槌、皮繩、半月裁皮刀、削薄刀與木尺在左，兩捲米白荔枝紋皮料在右，暖光斜掃深色木桌",
          "A leather workshop flat lay seen from above: mallet, leather cord, half-moon knife, skiving knife and wooden rule on the left, two rolls of cream lychee-grain leather on the right, warm light raking across a dark wooden table")),
      },
      {
        id: "jewelry",
        craft: t("金工職人 · 小金魚耳環", "Goldsmith · Goldfish Earrings"),
        quote: [t("金工的人，", "The goldsmith"), t("磨到只剩輪廓才肯停手。", "will not stop polishing until only the outline is left.")],
        ctas: [{ label: t("看金飾", "View jewelry"), href: "/collections/jewelry" }],
        image: site("craft-03-goldsmith-atelier.webp", t("晨光斜射進專業金工坊：半圓缺口的金工檯、皮兜與銼台上的小金魚，周圍是顯微鏡、吊鑽、壓延機與成排的鉗子",
          "Morning light slanting into a professional goldsmith's workshop: a bench with a half-round cut-out, a leather catch-skin and a small goldfish on the bench pin, surrounded by a microscope, a pendant drill, a rolling mill and rows of pliers")),
      },
      {
        id: "teaware",
        craft: t("木作職人 · 銀杏茶匙與杯墊", "Woodworker · Ginkgo Teaspoon and Coaster"),
        quote: [t("做木的人，", "The woodworker"), t("順著木紋把一片葉子鋸出來。", "saws a leaf out along the grain of the wood.")],
        ctas: [{ label: t("看茶器與工藝", "View teaware and craft"), href: "/collections/teaware" }],
        image: site("craft-04-breakfast-table.webp", t("逆光的早餐桌：花形木杯墊上的一杯茶、銀杏茶匙、鳥形筷架與木筷",
          "A backlit breakfast table: a cup of tea on a flower-shaped wooden coaster, a ginkgo teaspoon, a bird chopstick rest and wooden chopsticks")),
      },
    ] as CraftMoment[],
  };
};

const built: Partial<Record<Locale, ReturnType<typeof build>>> = {};
/** The carousel copy in one language (built once per language). */
export const getCraftMoments = (lang: Locale) => (built[lang] ??= build(lang));
