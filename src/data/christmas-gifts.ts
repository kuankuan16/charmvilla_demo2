import { site, type Img } from "./content";
import type { Product } from "./catalog";

// 2026 聖誕特別版（美國聖誕特別版）：兩款盒蓋設計，來源為圖庫 studio 系列 christmas-us-2026 與包裝原稿 PKG-41／PKG-42。
// 入數、售價與供應日期尚未由官方公布，因此不列販售單位、不連官方商店；CTA 走「商品洽詢」。
// 情境照使用 2026-09-16 依實拍桐木盒幾何生成、且沒有文字覆蓋的版本；studio 系列的 10 張 IG 稿含英文標題，不作商品圖。
type Edition = {
  key: "candycane" | "stocking";
  slug: string; name: string; english: string; label: string;
  motif: string; summary: string; description: string;
  scenes: { file: string; label: string; alt: string }[];
  storyFile: string; storyAlt: string;
};

const lid = (key: Edition["key"], kind: string, alt: string): Img => site(`xmas-lid-${key}-${kind}.webp`, alt);
const craft = "燙金：黑色裝飾線以微凹壓印／彩色圖案與 CHARM VILLA 字樣：刺繡";
const palette = "米金布底 × 燙金 × 金線 Logo × 紅綠白刺繡";

const editions: Edition[] = [
  {
    key: "stocking", slug: "christmas-edition-stocking", name: "聖誕特別版｜聖誕襪款", english: "CHRISTMAS EDITION / STOCKING", label: "聖誕襪款",
    motif: "紅色聖誕襪（綠色樹紋、白色襪口）、金色吊飾、小金魚與 CHARM VILLA 字樣",
    summary: "聖誕限定・桐木盒與刺繡織布盒蓋",
    description: "紅色聖誕襪上繡著一棵小小的樹，襪口留白，金色吊飾垂在一旁。靠近看得見燙金與繡線的兩種質感，一只桐木盒把節日留在盒蓋上。",
    scenes: [
      { file: "xmas-stocking-red.webp", label: "禮盒情境", alt: "聖誕特別版聖誕襪款：深紅桌布、暖白蠟燭與松枝之間的桐木禮盒" },
      { file: "xmas-stocking-green.webp", label: "燭光情境", alt: "聖誕特別版聖誕襪款：深綠絲絨、紅色蠟燭與古金色飾物旁的桐木禮盒" },
    ],
    storyFile: "xmas-stocking-green.webp", storyAlt: "聖誕特別版聖誕襪款：深綠絲絨與燭光中的桐木禮盒",
  },
  {
    key: "candycane", slug: "christmas-edition-candy-cane", name: "聖誕特別版｜拐杖糖款", english: "CHRISTMAS EDITION / CANDY CANE", label: "拐杖糖款",
    motif: "紅白拐杖糖與綠色緞結、金色吊飾、小金魚與 CHARM VILLA 字樣",
    summary: "聖誕限定・桐木盒與刺繡織布盒蓋",
    description: "紅白拐杖糖繫上綠色緞結，金色吊飾垂在米金布面上。燙金微微壓入布裡，繡線留著厚度，聖誕的顏色被一只桐木盒收得安靜。",
    scenes: [
      { file: "xmas-candycane-red.webp", label: "禮盒情境", alt: "聖誕特別版拐杖糖款：莓紅布景、暖金燈光與虛化聖誕樹前的桐木禮盒" },
    ],
    storyFile: "xmas-lid-candycane-mockup-detail.webp", storyAlt: "聖誕特別版拐杖糖款：盒蓋燙金與刺繡的近距離材質檢視",
  },
];

export const christmasGiftProducts: Product[] = editions.map((e) => {
  const scenes = e.scenes.map((s) => ({ label: s.label, image: site(s.file, s.alt) }));
  const lids = [
    { label: "盒蓋設計", image: lid(e.key, "mockup", `聖誕特別版${e.label}：盒蓋設計示意`) },
    { label: "正面視角", image: lid(e.key, "mockup-front", `聖誕特別版${e.label}：盒蓋正面視角`) },
    { label: "上方視角", image: lid(e.key, "mockup-top", `聖誕特別版${e.label}：盒蓋上方視角`) },
    { label: "材質特寫", image: lid(e.key, "mockup-detail", `聖誕特別版${e.label}：燙金與刺繡的近距離材質檢視`) },
    { label: "平面原稿", image: lid(e.key, "flat", `聖誕特別版${e.label}：盒蓋平面原稿`) },
  ];
  return {
    slug: e.slug, category: "tea", name: e.name, english: e.english,
    summary: e.summary, description: e.description,
    image: scenes[0].image, views: [...scenes, ...lids],
    facts: [
      { label: "系列", value: "2026 聖誕特別版" },
      { label: "盒蓋圖案", value: e.motif },
      { label: "工藝", value: craft },
      { label: "盒型與材質", value: "桐木盒、織布盒蓋" },
      { label: "配色", value: palette },
      { label: "上市資訊", value: "聖誕新品；入數、售價與供應日期以官方公告為準，歡迎洽詢。" },
    ],
    story: { title: "把聖誕留一點下來", body: "聖誕裝飾收起來的時候，總有一兩樣還想多留幾天。淺色木框配著刺繡布面，放在架上，旁邊擺幾本書，就算松枝收掉了，也還是喜歡。", image: site(e.storyFile, e.storyAlt) },
    variant: { group: "christmas-edition-2026", label: e.label },
  };
});
