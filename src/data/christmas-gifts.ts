import { site, type Img } from "./content";
import type { Product } from "./catalog";
import type { Locale } from "../i18n/config";

// 2026 聖誕特別版（美國聖誕特別版）：兩款盒蓋設計，來源為圖庫 studio 系列 christmas-us-2026 與包裝原稿 PKG-41／PKG-42。
// 入數、售價與供應日期尚未由官方公布，因此不列販售單位、不連官方商店；CTA 走「商品洽詢」。
// 情境照使用 2026-09-16 依實拍桐木盒幾何生成、且沒有文字覆蓋的版本；studio 系列的 10 張 IG 稿含英文標題，不作商品圖。
// Bilingual (2026-10-01): each string is a [中文, English] pair; the English adds no fact the Chinese does not state.
type Pair = [zh: string, en: string];
type Edition = {
  key: "candycane" | "stocking";
  slug: string; name: Pair; english: string; label: Pair;
  motif: Pair; description: Pair;
  scenes: { file: string; label: Pair; alt: Pair }[];
  storyFile: string; storyAlt: Pair;
};

const summary: Pair = ["聖誕限定・桐木盒與刺繡織布盒蓋", "Christmas limited · paulownia box with an embroidered fabric lid"];
const craft: Pair = ["燙金：黑色裝飾線以微凹壓印／彩色圖案與 CHARM VILLA 字樣：刺繡", "Foil stamping: black decorative lines lightly debossed / Colored motifs and the CHARM VILLA wordmark: embroidery"];
// the lid motif and palette rows left the specifications on 2026-10-05 (facts only); each edition keeps its `motif` text as a record

const editions: Edition[] = [
  {
    key: "stocking", slug: "christmas-edition-stocking", name: ["聖誕特別版｜聖誕襪款", "Christmas Edition | Stocking"], english: "CHRISTMAS EDITION / STOCKING", label: ["聖誕襪款", "Stocking"],
    motif: ["紅色聖誕襪（綠色樹紋、白色襪口）、金色吊飾、小金魚與 CHARM VILLA 字樣", "A red Christmas stocking (green tree motif, white cuff), a gold ornament, the goldfish and the CHARM VILLA wordmark"],
    description: ["紅色聖誕襪上繡著一棵小小的樹，襪口留白，金色吊飾垂在一旁。靠近看得見燙金與繡線的兩種質感，一只桐木盒把節日留在盒蓋上。",
      "A small tree is embroidered on a red Christmas stocking, its cuff left white, a gold ornament hanging beside it. Up close you can see two textures, foil stamping and embroidery thread, and a paulownia box keeps the season on its lid."],
    scenes: [
      { file: "xmas-stocking-red.webp", label: ["禮盒情境", "Gift box scene"], alt: ["聖誕特別版聖誕襪款：深紅桌布、暖白蠟燭與松枝之間的桐木禮盒", "Christmas Edition, Stocking: the paulownia gift box on a deep red tablecloth among warm white candles and pine branches"] },
      { file: "xmas-stocking-green.webp", label: ["燭光情境", "Candlelight scene"], alt: ["聖誕特別版聖誕襪款：深綠絲絨、紅色蠟燭與古金色飾物旁的桐木禮盒", "Christmas Edition, Stocking: the paulownia gift box on deep green velvet beside red candles and antique-gold ornaments"] },
    ],
    storyFile: "xmas-stocking-green.webp", storyAlt: ["聖誕特別版聖誕襪款：深綠絲絨與燭光中的桐木禮盒", "Christmas Edition, Stocking: the paulownia gift box on deep green velvet in candlelight"],
  },
  {
    key: "candycane", slug: "christmas-edition-candy-cane", name: ["聖誕特別版｜拐杖糖款", "Christmas Edition | Candy Cane"], english: "CHRISTMAS EDITION / CANDY CANE", label: ["拐杖糖款", "Candy Cane"],
    motif: ["紅白拐杖糖與綠色緞結、金色吊飾、小金魚與 CHARM VILLA 字樣", "A red-and-white candy cane with a green satin bow, a gold ornament, the goldfish and the CHARM VILLA wordmark"],
    description: ["紅白拐杖糖繫上綠色緞結，金色吊飾垂在米金布面上。燙金微微壓入布裡，繡線留著厚度，聖誕的顏色被一只桐木盒收得安靜。",
      "A red-and-white candy cane is tied with a green satin bow, and a gold ornament hangs on the pale-gold fabric. The foil is pressed slightly into the cloth while the embroidery keeps its thickness; a paulownia box holds the colours of Christmas quietly."],
    scenes: [
      { file: "xmas-candycane-red.webp", label: ["禮盒情境", "Gift box scene"], alt: ["聖誕特別版拐杖糖款：莓紅布景、暖金燈光與虛化聖誕樹前的桐木禮盒", "Christmas Edition, Candy Cane: the paulownia gift box against a berry-red backdrop, warm gold lights and a blurred Christmas tree"] },
    ],
    storyFile: "xmas-lid-candycane-mockup-detail.webp", storyAlt: ["聖誕特別版拐杖糖款：盒蓋燙金與刺繡的近距離材質檢視", "Christmas Edition, Candy Cane: close view of the foil stamping and embroidery on the lid"],
  },
];

export const christmasGiftProductsFor = (lang: Locale): Product[] => {
  const p = (pair: Pair) => pair[lang === "en" ? 1 : 0];
  const t = (zh: string, en: string) => p([zh, en]);
  const lid = (key: Edition["key"], kind: string, alt: string): Img => site(`xmas-lid-${key}-${kind}.webp`, alt);
  return editions.map((e) => {
    const scenes = e.scenes.map((s) => ({ label: p(s.label), image: site(s.file, p(s.alt)) }));
    const label = p(e.label);
    const lidAlt = (zh: string, en: string) => t(`聖誕特別版${label}：${zh}`, `Christmas Edition, ${label}: ${en}`);
    const lids = [
      { label: t("盒蓋設計", "Lid design"), image: lid(e.key, "mockup", lidAlt("盒蓋設計示意", "lid design mock-up")) },
      { label: t("正面視角", "Front view"), image: lid(e.key, "mockup-front", lidAlt("盒蓋正面視角", "front view of the lid")) },
      { label: t("上方視角", "Top view"), image: lid(e.key, "mockup-top", lidAlt("盒蓋上方視角", "top view of the lid")) },
      { label: t("材質特寫", "Material close-up"), image: lid(e.key, "mockup-detail", lidAlt("燙金與刺繡的近距離材質檢視", "close view of the foil stamping and embroidery")) },
      { label: t("平面原稿", "Flat artwork"), image: lid(e.key, "flat", lidAlt("盒蓋平面原稿", "flat artwork of the lid")) },
    ];
    return {
      slug: e.slug, category: "tea", name: p(e.name), english: e.english,
      summary: p(summary), description: p(e.description),
      image: scenes[0].image, views: [...scenes, ...lids],
      facts: [
        { label: t("系列", "Series"), value: t("2026 聖誕特別版", "2026 Christmas Edition") },
        { label: t("工藝", "Craft"), value: p(craft) },
        { label: t("盒型與材質", "Packaging"), value: t("桐木盒、織布盒蓋", "Paulownia wood box, woven-fabric lid") },
        { label: t("上市資訊", "Release"), value: t("聖誕新品；入數、售價與供應日期以官方公告為準，歡迎洽詢。", "New for Christmas. Count, price and availability dates follow the official announcement; enquiries are welcome.") },
      ],
      story: {
        title: t("把聖誕留一點下來", "Keeping a little of Christmas"),
        body: t("聖誕裝飾收起來的時候，總有一兩樣還想多留幾天。淺色木框配著刺繡布面，放在架上，旁邊擺幾本書，就算松枝收掉了，也還是喜歡。",
          "When the Christmas decorations are put away, there are always one or two things you want to keep out a few days longer. A pale wooden frame around embroidered fabric, set on a shelf beside a few books: even after the pine branches are gone, it is still a pleasure to see."),
        image: site(e.storyFile, p(e.storyAlt)),
      },
      variant: { group: "christmas-edition-2026", label },
    };
  });
};

export const christmasGiftProducts: Product[] = christmasGiftProductsFor("zh");
