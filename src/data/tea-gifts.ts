import officialImages from "./gift-box-images.json";
import officialPrices from "./official-prices.json";
import { gallery, site, type Img } from "./content";
import type { Product } from "./catalog";
import type { Locale } from "../i18n/config";
import { sizeText } from "./measure";

// One listing per gift box; tea choices belong to that box, never a standalone SKU.
// US catalogue (user 2026-10-07, 「CHARM VILLA Products, Stories & Prices · English · 繁體中文.pdf」, Shopify pricing snapshot Oct 5, 2026):
// the eight Goldfish Tea Bag gift collections sold in the US, priced in USD per box, with that document's descriptions, stories,
// tea names, options and product notices in both languages. Boxes the US store does not sell stay in the list with `hidden: true`
// (their Taiwan data kept, so one flag brings a box back).
// Bilingual: Chinese is the source; `en` holds the English name, description and note of each box. Tea, series and box wording is
// translated through the dictionaries below (glossary: /.translation/glossary.csv).
export type TeaContents = { name: string; count: number }[];
type Bi = { zh: string; en: string };
export type TeaGift = {
  officialId: number;
  slug: string;
  name: string;
  english: string;
  series: "經典商品" | "珍稀商品" | "2026 中秋節限定商品" | "2026 聖誕節限定商品";
  pieces: number;
  box: string;
  dimensions: string;      // "" where the document gives none (團圓, 15 bags)
  // 保存期限不再逐盒手寫：由 shelfLifeOf() 依盒內實際茶款（contents／choices）計算（客戶答覆 B6，2026-10-12）
  contents: TeaContents;
  /** one tea per box; `price` is that option's price (USD on the US catalogue, TWD on hidden Taiwan boxes) */
  choices?: { label: string; contents: TeaContents; price?: number }[];
  /** lid colours sold with every tea choice (春曉 Blue/Pink, 蝴蝶蘭 Gold/Pink): each tea × lid is a Shopify variant */
  lid?: Bi[];
  /** Per-lid studio views: preserve existing covers; HD front is added in view 2 (user 2026-10-12); unboxed view is shared. */
  lidViews?: Record<number, { cover?: string; angle?: string; front?: string; scene?: string }>;
  /** packaging options with the same contents and price (團圓 Gold/Pink/Blue) */
  packaging?: { label: Bi; text: Bi; viewsFrom?: string; placeholderViews?: number; lidViews?: { cover?: string; angle?: string; front?: string; unboxed?: string } }[];
  /** the US list price in USD (the lowest option); a box without it is priced from the Taiwan store (official-prices.json, TWD) */
  usd?: number;
  setOf?: number;          // sold as a set of this many boxes (心有愛: NT$810 buys 3 boxes)
  weight: number;          // grams, box included (official product page, 「約 … 公克」); 0 where unknown
  ingredients?: Bi;
  scene?: string;          // AI scene from the asset gallery (CV-xxxx) used as the listing image
  journalScene?: number;   // tea-journal photo (people-free) showing this box, used as the listing image
  sceneFile?: string;      // generated listing scene in /media/site (output/tea-gift-listing-scenes-2026-09-30), used when no gallery scene exists
  journalStory?: number;   // tea-journal photo (people-free) for the product page "in everyday life" section
  storyFile?: { file: string; alt: Bi }; // generated photo in /media/site taking journalStory's place, with its own alt text
  description: string;
  note?: string;
  /** the document's Product Notice bullets */
  notice?: Bi[];
  /** the box's own story from the document; `more` is a second titled text (紫斑蝶: about Taiwan's purple crow butterflies) */
  story?: { title: Bi; body: Bi; more?: { title: Bi; body: Bi; source?: Bi } };
  /** marked sold out on the official store: the price stays, the bag button is disabled */
  soldOut?: boolean;
  /** made to order: a 預購 / Pre-order label beside the price and a 加入預購 / Pre-order button; ships by late November 2026 (客戶答覆 B7，2026-10-12) */
  preOrder?: boolean;
  /** 預購額度（盒）：所有茶款與盒蓋顏色共用一個額度，不分規格（客戶答覆 B7，2026-10-12）。沒有額度的預購商品（聖誕佳禮）不顯示剩餘數 */
  preOrderLimit?: number;
  /** 剩餘可預購數量的覆寫值；目前沒有庫存系統，未填時剩餘＝preOrderLimit。之後由 Shopify 庫存（共用額度）取代 */
  preOrderLeft?: number;
  /** no price yet: 價格待訂 / Price to be announced instead of a price, and no bag button (user 2026-10-13: 「US$130 幫我用價格代訂，不要自己亂寫」) */
  priceTbd?: boolean;
  /** the tea options are drafts: a red 茶款待確認 / Teas to be confirmed beside the choice label (user 2026-10-13) */
  teaTbd?: boolean;
  /** set sold as `setOf` boxes, each one tea from `choices`, mixed freely (雪花三盒組, user 2026-10-14) */
  mix?: boolean;
  /** not sold on the US store: kept out of every listing, menu, sitemap and product page (404), data kept */
  hidden?: boolean;
  variant?: { group: string; label: string };
  // summary: the count line on cards and the page; tea: Shopify's tea names for this box where they differ from the shared dictionary
  en: { name: string; description: string; note?: string; summary?: string; tea?: Record<string, string> };
};

// Tea names as the US document writes them (Chinese and English).
const rose = "玫瑰烏龍茶", honey = "玫瑰蜜香紅茶", ruby = "紅玉紅茶"; // display names without aliases (client tea-names review, 2026-10-13 §3; user 2026-10-14: 「依照客戶回覆修改」)
const beauty = "東方美人茶", jinxuan = "金萱烏龍茶", fruit = "花果茶";
const firstRose = "頭等獎玫瑰烏龍茶", secondBeauty = "貳等獎東方美人茶", thirdBeauty = "參等獎東方美人茶";
const count = (name: string, count: number) => ({ name, count });
const reunion = [rose, honey, ruby, beauty].map(name => count(name, 3));
const fifteen = [rose, beauty, ruby, jinxuan, honey].map(name => count(name, 3));
const eighteen = [count(rose, 9), ...[beauty, ruby, jinxuan].map(name => count(name, 3))];
// 蝴蝶蘭 (18 bags): one competition tea per box, the Oriental Beauty option priced higher; 春曉、暮雪 offer plain Rose Oolong or Oriental Beauty (user 2026-10-13)
const wood = "桐木盒、織布盒蓋";
const woodTieDye = "桐木盒搭配紮染布面盒蓋，飾以手工刺繡";
const woodEmbroidered = "桐木盒搭配手工刺繡布面盒蓋";
const paperKyoto = "高密度紙盒搭配連體盒蓋與封口封條";
const paperDrawerEmbroidered = "抽屜式紙盒搭配織布盒蓋，飾以刺繡"; // 聖誕佳禮：2026-10-13 agent 推理暫定，待客戶確認（確認表 F1–F8）
const paperSnowflake = "紙盒，燙金雪花與壓紋小金魚，透明封口貼紙"; // 雪花迷人禮：2026-10-13 agent 推理暫定，待客戶確認
const longBox = "28.6 × 11.7 × 9 cm";    // 11.3 × 4.6 × 3.5 in
const smallBox = "20.5 × 18.5 × 6.9 cm"; // 8.1 × 7.3 × 2.7 in
const squareBox = "28 × 19 × 9 cm";      // 11.0 × 7.5 × 3.5 in
const rareBox = "27.7 × 19.1 × 9.6 cm";
const blue: Bi = { zh: "藍色", en: "Blue" }, pink: Bi = { zh: "粉紅色", en: "Pink" }, gold: Bi = { zh: "金色", en: "Gold" };

// English wording for the shared vocabulary. Every Chinese value used above must have an entry (checked at build).
const english: Record<string, string> = {
  [rose]: "Rose Oolong Tea", [honey]: "Rose & Honey-Scented Black Tea", [ruby]: "Ruby Black Tea",
  [beauty]: "Oriental Beauty Tea", [jinxuan]: "Jin Xuan Oolong Tea", [fruit]: "Fruit & Herbal Tea",
  [firstRose]: "First-Prize Rose Oolong Tea", [secondBeauty]: "Second-Prize Oriental Beauty Tea", [thirdBeauty]: "Third-Prize Oriental Beauty Tea",
  "經典商品": "Classic Gift Boxes", "珍稀商品": "Rare Gift Boxes", "2026 中秋節限定商品": "2026 Mid-Autumn Gift Boxes", "2026 聖誕節限定商品": "2026 Christmas Gift Boxes",
  [wood]: "Paulownia wood box, woven-fabric lid", "織布盒蓋、繽紛紙盒（日本製）": "Woven-fabric lid, patterned paper box (made in Japan)",
  [woodTieDye]: "Paulownia wood box with a tie-dyed fabric lid featuring hand embroidery",
  [woodEmbroidered]: "Paulownia wood box with a hand-embroidered fabric lid",
  [paperKyoto]: "High-density paper box with an attached lid and closure seal",
  [paperDrawerEmbroidered]: "Paper drawer box with a woven-fabric lid featuring embroidery",
  [paperSnowflake]: "Paper box with rose-gold foil snowflakes, an embossed goldfish and a clear seal sticker",
  "紙盒": "Paper box", "繽紛紙紙盒、織布盒蓋": "Patterned paper box, woven-fabric lid", "繽紛紙盒、織布盒蓋": "Patterned paper box, woven-fabric lid",
  "繽紛紙盒・12 入": "Paper box · 12 tea bags", "桐木木盒・12 入": "Paulownia box · 12 tea bags",
};
const competitionPricing: Bi = { zh: "價格可能變動，並依每年舉辦兩次的茶葉競賽官方定價調整。", en: "Prices are subject to change based on the official pricing of the tea competitions held twice a year." };
const tieDyeColors: Bi = { zh: "紮染盒蓋的色彩依實品為準，可能與產品圖片略有差異。", en: "Actual tie-dyed lid colors may differ from the product images." };
// 預購出貨時間（客戶答覆 B7／D3，2026-10-12）：每個 preOrder 禮盒的產品須知第一條
const preOrderShipping: Bi = { zh: "預購商品預計最晚於 2026 年 11 月下旬出貨。", en: "Pre-orders are expected to ship by late November 2026." };
const embroideryNote: Bi = { zh: "盒蓋上的手工刺繡，為禮盒增添立體質感與細緻工藝。", en: "The lid features hand embroidery, adding texture and carefully worked detail to the gift presentation." };

export const teaGifts: TeaGift[] = [
  // 團圓 Joyful Reunion: one listing (the US store listed three packaging options; only the gold lid is on sale) (the Taiwan store's two 12-bag boxes were separate listings)
  { officialId: 891, slug: "reunion-paper-gift-box", preOrder: true, preOrderLimit: 100, journalStory: 301, name: "團圓", english: "JOYFUL REUNION", series: "經典商品", pieces: 15, box: woodEmbroidered /* user 2026-10-13: 「說明的部分改成桐木盒就好」 */, dimensions: "", weight: 0, contents: fifteen, usd: 170, scene: "CV-0348",
    // Pink and blue packaging are off sale (user 2026-10-13: 「粉紅色跟藍色目前都先下架，還沒有商品可以賣」, reversing 10-12); only the
    // gold-lid box is sold, so there is no packaging chooser. Approved option names if the colours return (客戶答覆 E4，2026-10-12):
    // "Gold Gift Box" / "Pink Gift Box" / "Blue Gift Box" — show only the colours actually on sale. The pink and blue options, with their grey placeholder views, are in git history.
    description: "CHARM VILLA「團圓」禮盒內含 15 包金魚茶包，五款茶各 3 包，適合與親友共享或贈禮。",
    story: { title: { zh: "故事", en: "Story" }, body: { zh: "不同茶款的小金魚在一方禮盒內團聚，象徵著團圓美好之意。", en: "Little goldfish filled with different teas gather in one gift box, celebrating reunion and the joy of being together." } },
    notice: [embroideryNote],
    en: { name: "Joyful Reunion", description: "Joyful Reunion is a CHARM VILLA gift set containing 15 Goldfish Tea Bags: three each of five tea varieties, a selection to enjoy together or give as a gift." } },
  { officialId: 64, slug: "reunion-paulownia-gift-box", hidden: true, journalStory: 308, name: "團圓｜桐木木盒", english: "REUNION / PAULOWNIA BOX", series: "經典商品", pieces: 12, box: wood, dimensions: longBox, weight: 407, contents: reunion, sceneFile: "CV-0350-tag2.webp" /* the brand's CV-0350 with the real gold foil tag (2026-10-05) */, description: "織布的經緯與桐木的紋理，在一只盒上相接。四款台灣茶各自成形，讓一份茶禮，也成為值得收藏的日常物件。",
    en: { name: "Reunion | Paulownia Box", description: "The weave of the fabric and the grain of paulownia meet on a single box. Four Taiwanese teas each take their own form, making a gift of tea an everyday object worth keeping." } },
  { officialId: 954, slug: "year-of-plenty-gift-box", preOrder: true, preOrderLimit: 20, /* journal-319 (the oak table, a bowl and a green cloth) and CV-0356-tag2 (the red box with its ribbon, a gold-rimmed cup) removed — user 2026-10-08: 「刪」 */ name: "年年有魚", english: "ABUNDANCE & PROSPERITY", series: "經典商品", pieces: 18, box: woodEmbroidered, dimensions: squareBox, weight: 400, contents: eighteen, usd: 220 /* the brand's CV-0356 with the real gold foil tag (2026-10-05) */,
    description: "CHARM VILLA「年年有魚」禮盒以桐木盒搭配手工刺繡布面盒蓋，內含 18 包金魚茶包。每盒集結四款茶，適合共享品茶時光，也為節慶送禮備妥一份心意。", notice: [embroideryNote],
    en: { name: "Abundance & Prosperity", description: "Abundance & Prosperity is a CHARM VILLA gift set containing 18 Goldfish Tea Bags in a Paulownia wood box with a hand-embroidered fabric lid. Four tea varieties are included in every box, making it a thoughtful assortment for shared tea moments and festive gifting.", summary: "18 Goldfish Tea Bags per box · Four-tea assortment" } },
  { officialId: 1053, slug: "blossoming-prosperity-gift-box", preOrder: true, preOrderLimit: 20, sceneFile: "scene-blossoming-prosperity-gift-box.webp", /* journalStory 329 (the white cup by a lamp) off the page (user 2026-10-08: 「刪」) */ name: "花開富貴", english: "PROSPERITY IN BLOOM", series: "經典商品", pieces: 18, box: woodEmbroidered, dimensions: squareBox, weight: 400, contents: eighteen, usd: 220,
    description: "CHARM VILLA「花開富貴」禮盒以桐木盒搭配手工刺繡布面盒蓋，內含 18 包金魚茶包。固定的四款茶組合匯集玫瑰烏龍茶、紅玉紅茶、金萱烏龍茶與東方美人茶，適合在慶祝與相聚時分享。", notice: [embroideryNote],
    en: { name: "Prosperity in Bloom", description: "Prosperity in Bloom is a CHARM VILLA gift set containing 18 Goldfish Tea Bags in a Paulownia wood box with a hand-embroidered fabric lid. Its assortment brings together Rose Oolong, Ruby Black, Jin Xuan Oolong, and Oriental Beauty for a gift to share at celebrations and gatherings.", summary: "18 Goldfish Tea Bags per box · Four-tea assortment" } },
  { officialId: 104, slug: "spring-blossoms-gift-box", hidden: true, sceneFile: "scene-spring-blossoms-gift-box.webp", journalStory: 325, name: "花滿富春", english: "SPRING BLOSSOMS", series: "經典商品", pieces: 18, box: wood, dimensions: rareBox, weight: 400, contents: eighteen, description: "金魚游過牡丹花間，花葉與魚形構成盒上的風景。四款茶盛入十八尾手作小金魚，從盒中的陳列走向杯裡的舒展。",
    en: { name: "Spring Blossoms", description: "Goldfish swim among peonies; blossom, leaf and fish form the scenery on the lid. Four teas fill eighteen handmade goldfish, moving from their arrangement in the box to their unfurling in the cup." } },
  { officialId: 692, slug: "kyoto-gift-box", preOrder: true, preOrderLimit: 100, /* journalScene 320 (the box on an oak desk by a pencil and an envelope) and journalStory 309 (on an oak bench by a tote and keys) both off the page (user 2026-10-08: 「刪」) */ name: "京都版", english: "KYOTO ARTISANAL RESERVE", series: "經典商品", pieces: 6, box: paperKyoto, dimensions: smallBox, weight: 99, contents: [], usd: 60,
    choices: [rose, honey, ruby, beauty].map(label => ({ label, contents: [count(label, 6)], price: 60 })),
    description: "CHARM VILLA「京都版」禮盒內含 6 包所選茶款的金魚茶包。精巧的高密度紙盒搭配連體盒蓋，盛裝單一茶款，適合日常品茶或作為用心挑選的禮物。",
    en: { name: "Kyoto Artisanal Reserve", description: "Kyoto Artisanal Reserve is a CHARM VILLA gift set containing six Goldfish Tea Bags of your selected tea. A compact high-density paper box with an attached lid holds a single-tea selection for everyday tea moments or a considered gift.", summary: "6 Goldfish Tea Bags per box · Choose one tea variety" } },
  { officialId: 970, slug: "heart-gift-box", hidden: true, sceneFile: "scene-heart-gift-box.webp", journalStory: 305, name: "心有愛禮盒", english: "WITH LOVE", series: "經典商品", pieces: 2, setOf: 3, box: "紙盒", dimensions: "10 × 6.5 × 7.5 cm", weight: 20, contents: [], choices: [rose, honey].map(label => ({ label, contents: [count(label, 2)] })), description: "把心意收進小小的紙盒。每盒兩尾同款小金魚茶包，可選玫瑰烏龍茶或玫瑰蜜香紅茶，為一次相逢留下一杯茶的邀請。",
    en: { name: "With Love Gift Box", description: "A gesture kept in a small paper box. Each box holds two goldfish tea bags of the same tea, Rose Oolong Tea or Rose & Honey-Scented Black Tea: an invitation to a cup of tea, left for one encounter." } },
  { officialId: 183, slug: "fruit-infusion-gift-box", hidden: true, sceneFile: "scene-fruit-infusion-gift-box.webp", journalStory: 330, name: "花果茶", english: "FRUIT & HERBAL TEA", series: "經典商品", pieces: 9, box: "繽紛紙盒、織布盒蓋", dimensions: longBox, weight: 340, contents: [count(fruit, 9)], ingredients: { zh: "蘋果、西洋梨、鳳梨、木瓜、蜜桃、芒果、檸檬草、玫瑰果、矢車菊、香料、糖", en: "Apple, pear, pineapple, papaya, peach, mango, lemongrass, rosehip, cornflower, flavoring, sugar" }, description: "九尾花果茶小金魚，在織布與紙盒之間安放。無咖啡因的花果配方，讓飲茶的片刻，多一種果香與花香交錯的選擇。",
    en: { name: "Fruit & Herbal Tea Gift Box", description: "Nine goldfish of Fruit & Herbal Tea rest between woven fabric and paper box. The caffeine-free blend of fruit and flowers adds another choice to the tea moment, where fruit and floral notes cross." } },
  { officialId: 343, slug: "rose-encounter-gift-box", hidden: true, sceneFile: "scene-rose-encounter-gift-box.webp", journalStory: 323, name: "玫好相遇", english: "A ROSE ENCOUNTER", series: "經典商品", pieces: 6, box: "紙盒", dimensions: smallBox, weight: 99, contents: [count(rose, 3), count(honey, 3)], description: "同是玫瑰，與不同茶款相遇便有不同表情。三尾玫瑰烏龍茶、三尾玫瑰蜜香紅茶，邀請兩個人從一只禮盒開始共飲。",
    en: { name: "A Rose Encounter", description: "The same rose takes on a different expression with each tea it meets. Three goldfish of Rose Oolong Tea and three of Rose & Honey-Scented Black Tea invite two people to begin drinking together from a single box." } },
  { officialId: 196, slug: "tea-to-share-gift-box", hidden: true, sceneFile: "scene-tea-to-share-gift-box.webp", journalStory: 311, name: "魚你分享｜茶繽紛", english: "TEA TO SHARE", series: "經典商品", pieces: 6, box: "紙盒", dimensions: "13 × 11.4 × 11.4 cm", weight: 100, contents: [rose, ruby, jinxuan, beauty, honey, fruit].map(name => count(name, 1)), description: "六款茶，各留一尾。從烏龍、紅茶到花果茶，讓同一只禮盒盛下不同的選擇，也為分享留下話題。",
    en: { name: "Tea to Share | Assorted Teas", description: "Six teas, one goldfish of each. From oolong and black tea to fruit and herbal tea, one box holds different choices and leaves something to talk about when it is shared." } },
  // journal-307 (a white cup on a rainy window sill) gave way to the two hands holding a speckled mug of goldfish tea in low warm light
  // (Nano Banana 2.1 after the user's reference photo, the string retouched to fall behind the far rim; user 2026-10-08: 「取代全站這張圖」)
  // 春曉粉紅盒蓋的商品圖（使用者 2026-10-08：「粉紅色版封面…根據目前官網的商品圖生成 2 張商品圖，第 3 張共用 12 入的圖」）：以藍色盒蓋的封面與斜角圖
  // 為底、只換布色（粉紅＋淡黃紮染）與緞帶色（淡粉），刺繡與金字不動（Nano Banana 2.1，照使用者的實拍）；選到粉紅盒蓋時商品圖切換成這組
  { officialId: 850, slug: "spring-dawn-gift-box", preOrder: true, preOrderLimit: 10, lidViews: { 1: { cover: "studio-spring-dawn-gift-box-pink-cover.webp", angle: "studio-spring-dawn-gift-box-pink-end-angle.webp", front: "official-gift-front-spring-dawn-gift-box-pink-cutout-v3.webp" } }, storyFile: { file: "scene-hands-speckled-mug-goldfish-tea-warm-light.webp", alt: { zh: "雙手捧著一杯泡開的小金魚茶", en: "Two hands holding a cup of brewed goldfish tea" } }, name: "春曉", english: "SPRING AWAKENING", series: "珍稀商品", pieces: 12, box: woodTieDye, dimensions: longBox, weight: 350, contents: [], /* rose option is the First-Prize Rose Oolong, the Oriental Beauty plain (user 2026-10-13: 「以上幾個的玫瑰烏龍茶都要改成頭等獎玫瑰烏龍茶」; earlier user 2026-10-13: 「春曉也是一樣的邏輯處理」, as 暮雪; client answer B5) */ choices: [{ label: firstRose, price: 230 }, { label: beauty, price: 260 }].map(c => ({ ...c, contents: [count(c.label, 12)] })), lid: [blue, pink], usd: 230,
    description: "CHARM VILLA「春曉」禮盒內含 12 包所選茶款的金魚茶包，以桐木盒搭配手工刺繡布面盒蓋呈現。以春日清晨為靈感，為品茶時光或一份心意帶來清新氣息。可選擇茶款，以及藍色或粉紅色盒蓋。",
    story: { title: { zh: "故事", en: "Story" }, body: { zh: "黎明破曉之際，晨陽將天空渲染為一匹朦朧的薄幕；黃山雀在風鈴木金黃的枝頭上唱著晨歌，交織出一幅醺人的春日風景。", en: "As dawn breaks, morning sunlight washes the sky into a soft, translucent veil. Yellow tits sing their morning song amid the golden blossoms of a trumpet tree, weaving a spring scene that invites you to linger." } },
    notice: [tieDyeColors],
    en: { name: "Spring Awakening", description: "Spring Awakening is a CHARM VILLA gift set containing 12 Goldfish Tea Bags of your selected tea, presented in a Paulownia wood box with a tie-dyed fabric lid featuring hand embroidery. Its spring-dawn inspiration brings a sense of renewal to a tea moment or a thoughtful gift. Choose your tea and a Blue or Pink lid.", summary: "12 Goldfish Tea Bags per box · First-Prize Rose Oolong Tea or Oriental Beauty Tea" } },
  { officialId: 582, slug: "winter-blossom-gift-box", preOrder: true, preOrderLimit: 10, /* journalStory 303 (the armchair by the window) off the page (user 2026-10-08: 「刪」) */ name: "暮雪", english: "SNOWY TWILIGHT", series: "珍稀商品", pieces: 12, box: woodTieDye, dimensions: longBox, weight: 350, contents: [], /* rose option is the First-Prize Rose Oolong, the Oriental Beauty plain (user 2026-10-13: 「以上幾個的玫瑰烏龍茶都要改成頭等獎玫瑰烏龍茶」; earlier user 2026-10-13: 「暮雪…沒有比賽獲獎茶」; client answer B5 lists 玫瑰烏龍款 $230／東方美人款 $260) */ choices: [{ label: firstRose, price: 230 }, { label: beauty, price: 260 }].map(c => ({ ...c, contents: [count(c.label, 12)] })), usd: 230,
    description: "CHARM VILLA「暮雪」禮盒內含 12 包所選茶款的金魚茶包，以桐木盒搭配手工刺繡布面盒蓋呈現。靈感來自櫻花與白雪相遇的景緻，為自己或珍視的人留下一段靜謐的品茶時光。",
    story: { title: { zh: "故事", en: "Story" }, body: { zh: "時至暮冬，即將迎來初春日子，總會令人聯想起櫻花遍土盛放的景色。在暮冬曉春之際，櫻雪互映的模樣，願能為您帶來初春新露時分清雅恬淡的美好。", en: "As the last days of winter give way to early spring, we picture cherry blossoms opening across the landscape. Where blossom meets snow, Snowy Twilight captures the quiet grace of that fleeting season. May it bring you the fresh, gentle beauty of spring's first light." } },
    notice: [tieDyeColors],
    en: { name: "Snowy Twilight", description: "Snowy Twilight is a CHARM VILLA gift set containing 12 Goldfish Tea Bags of your selected tea, presented in a Paulownia wood box with a tie-dyed fabric lid featuring hand embroidery. Inspired by the meeting of cherry blossoms and snow, the collection offers a quiet tea moment for yourself or someone special.", summary: "12 Goldfish Tea Bags per box · First-Prize Rose Oolong Tea or Oriental Beauty Tea" } },
  { officialId: 960, slug: "orchid-gift-box", preOrder: true, preOrderLimit: 10, lidViews: { 1: { front: "official-gift-front-orchid-gift-box-pink-cutout-v3.webp" /* the two-friends scene was briefly added here for 粉紅色, then removed from the gallery (user 2026-10-13: 「刪」) */ } }, sceneFile: "scene-orchid-gift-box.webp", name: "蝴蝶蘭", english: "ROYAL ORCHID", series: "珍稀商品", pieces: 18, box: woodEmbroidered, dimensions: squareBox, weight: 400, contents: [], lid: [gold, pink], usd: 300,
    /* rose option is the First-Prize Rose Oolong, the Oriental Beauty plain (user 2026-10-13: 「以上幾個的玫瑰烏龍茶都要改成頭等獎玫瑰烏龍茶」; earlier user 2026-10-13: 「蝴蝶蘭也是」, as 春曉、暮雪; client answer B5) */ choices: [{ label: firstRose, price: 300 }, { label: beauty, price: 340 }].map(c => ({ ...c, contents: [count(c.label, 18)] })),
    description: "CHARM VILLA「蝴蝶蘭」禮盒內含 18 包所選茶款的金魚茶包，以桐木盒搭配手工刺繡布面盒蓋呈現。以蘭花為靈感，適合在慶祝或值得紀念的時刻傳遞心意。可選擇茶款，以及金色或粉紅色盒蓋。",
    notice: [embroideryNote],
    en: { name: "Royal Orchid", description: "Royal Orchid is a CHARM VILLA gift set containing 18 Goldfish Tea Bags of your selected tea, presented in a Paulownia wood box with a hand-embroidered fabric lid. The orchid-inspired collection offers a gift for celebrations and meaningful occasions. Choose your tea and a Gold or Pink lid.", summary: "18 Goldfish Tea Bags per box · First-Prize Rose Oolong Tea or Oriental Beauty Tea" } },
  { officialId: 88, slug: "purple-butterfly-gift-box", preOrder: true /* user 2026-10-13: 「紫斑蝶先加預購標示」 */, preOrderLimit: 10, sceneFile: "scene-purple-butterfly-gift-box.webp", name: "紫斑蝶", english: "SAPPHIRE WINGS", series: "珍稀商品", pieces: 18, box: woodEmbroidered, dimensions: squareBox, weight: 400, contents: [count(secondBeauty, 18)], usd: 425,
    description: "CHARM VILLA「紫斑蝶」禮盒內含 18 包貳等獎東方美人茶金魚茶包。以蝴蝶為靈感，透過桐木盒與手工刺繡布面盒蓋，呈現此款單一茶款禮盒。",
    story: {
      title: { zh: "故事", en: "Story" },
      body: { zh: "紫斑蝶，每年越冬時便在臺灣上空織就出一道紫色長河的美麗生命。牠們一身黑紗綴著藍帶與白點，盤旋飄舞於半空時，蝶翅上忽紫倏藍的幻變鱗光，就好似夜空中閃爍的小小星河，頃刻便能傾城。CHARM VILLA 為您捕捉紫斑蝶的倩麗身影，裝點於茶評鑑會獲評貳等獎的頂級東方美人茶。願您潛心品茗溫潤好茶的同時，能靜賞於幽翳之中翩然起舞的群蝶，交織出美好的吉光片羽。",
        en: "Each winter, Taiwan's purple crow butterflies trace a violet river across the island's skies. Their dark wings, adorned with blue and white, shimmer between violet and sapphire as they turn in flight—like a constellation briefly brought within reach. CHARM VILLA captures their graceful silhouettes in a gift collection of fine Oriental Beauty Tea awarded Second Prize at a tea competition. As you settle into a quiet cup, imagine butterflies dancing through the shade, weaving a fleeting moment of beauty to keep." },
      more: {
        title: { zh: "關於臺灣的紫斑蝶", en: "About Taiwan's purple crow butterflies" },
        body: { zh: "在臺灣，許多溫暖的地方都有機會看見紫斑蝶。研究紀錄顯示，牠們會在初春北返、春末初夏及秋季南遷等時期形成大規模蝶道，並在南部溫暖、避風的山谷群聚越冬。這片緩緩流動的紫色蝶河，常與墨西哥帝王斑蝶的壯麗越冬景觀並提。\n\n臺灣目前常見四種紫斑蝶。另有曾棲息於臺灣的大紫斑蝶特有亞種，已多年未見，更提醒我們珍惜蝶群賴以生存的棲地。為協助紫斑蝶安全飛越林內一帶的國道，保育措施包括設置防護網，並在遷徙蝶量達到管制門檻時暫時封閉部分車道，為蝶群留出回家的路。\n\nCHARM VILLA 貳等獎東方美人茶禮盒上所繡的是名為「端紫斑蝶」（Euploea mulciber）的紫斑蝶種。在外觀特徵上，端紫斑蝶的前翅可見明亮的藍紫色光澤，後翅則綴著散落的白點與白色細紋。",
          en: "Purple crow butterflies thrive in Taiwan's warm landscapes. Recorded migration patterns include a northward journey in early spring, movement in late spring and early summer, and a southward journey in autumn to sheltered wintering valleys. Their great winter gatherings are often compared with those of monarch butterflies in Mexico.\n\nFour purple crow species are commonly found in Taiwan today. Another, the Great Crow's endemic Taiwanese subspecies, has not been seen for decades—a reminder of how much these delicate lives depend on their habitats. Along a migration route at Linnei, conservation measures include protective netting and temporary highway lane closures to help butterflies cross safely.\n\nThe butterfly embroidered on the Sapphire Wings gift box is the Striped Blue Crow (Euploea mulciber), known in Chinese as 端紫斑蝶. Its forewings catch the light in brilliant blue-violet, while white spots and fine pale markings decorate its hindwings." },
        // the sources as a small grey note under the text (user 2026-10-14: 「用備註灰色小字呈現」)
        source: { zh: "紫斑蝶背景資料參考：茂林國家風景區管理處；交通部高速公路局；國立自然科學博物館；美國自然史博物館", en: "Butterfly background references: Maolin National Scenic Area; National Freeway Bureau; National Museum of Natural Science; American Museum of Natural History" },
      },
    },
    notice: [competitionPricing, { zh: "限量供應，採預購製作。", en: "Limited availability; crafted upon pre-order." }, embroideryNote],
    en: { name: "Sapphire Wings", description: "Sapphire Wings is a CHARM VILLA gift set containing 18 Goldfish Tea Bags of Second-Prize Oriental Beauty Tea. A Paulownia wood box with a hand-embroidered fabric lid presents this single-tea selection in a butterfly-inspired gift collection.", summary: "18 Goldfish Tea Bags per box · Second-Prize Oriental Beauty Tea" } },
  // 聖誕佳禮 Christmas Delight（新品）：以下名稱、系列、內容、價格、盒型、尺寸、重量、保存期限、預購出貨時間、故事與 officialId 皆為
  // 2026-10-13 agent 推理暫定，待客戶確認（確認表 F1–F8）（使用者 2026-10-13：「F1–F8 你先根據目前的官網推理，我再請客戶修改，先上 demo2」）。
  // officialId 9001 只是暫定的唯一值，台灣官網沒有這個商品編號（沒有官方商品圖、也不連到台灣官網）。
  // 兩色盒蓋同內容同價，用 packaging（選色＝切換圖庫）：橘色是預設圖庫，藍綠色用自己的 4 張圖（含自己的紙盒開箱圖，不用 12 入木盒的開箱圖）。
  { officialId: 9001, slug: "christmas-gift-box", preOrder: true, sceneFile: "scene-christmas-gift-box-two-boxes-window-light.webp", /* names from the client (user 2026-10-14, reply to the 10/13 report item 1: 「原「聖誕佳禮」請改為 聖誕禮盒（限量版）」 / "Christmas Giftbox (Limited Edition)"); price, teas, box, size and pre-order count still to come */ name: "聖誕禮盒（限量版）", english: "CHRISTMAS GIFTBOX (LIMITED EDITION)", series: "2026 聖誕節限定商品", pieces: 12, box: paperDrawerEmbroidered, dimensions: longBox, weight: 300, contents: reunion, priceTbd: true, // 不在客戶答覆 B7 的額度清單內：預購但不設額度、不顯示剩餘數
    packaging: [
      { label: { zh: "拐杖糖", en: "Candy Cane" }, text: { zh: "橘色盒蓋，紅色小金魚刺繡搭配拐杖糖。", en: "Orange lid with a red embroidered goldfish and a candy cane." } },
      { label: { zh: "聖誕襪", en: "Stocking" }, text: { zh: "藍綠色盒蓋，綠色小金魚刺繡搭配聖誕襪。", en: "Teal lid with a green embroidered goldfish and a Christmas stocking." },
        lidViews: { cover: "studio-christmas-gift-box-teal-cover-v3.webp", front: "studio-christmas-gift-box-teal-front-v4.webp", angle: "studio-christmas-gift-box-teal-angle-v3.webp", unboxed: "studio-christmas-gift-box-teal-unboxed-v3.webp" } },
    ],
    description: "CHARM VILLA「聖誕禮盒（限量版）」禮盒內含 12 包金魚茶包，四款茶各 3 包，以抽屜式紙盒搭配刺繡織布盒蓋呈現。可選擇聖誕襪或拐杖糖盒蓋，為佳節送上一份溫暖的心意。",
    story: { title: { zh: "故事", en: "Story" }, body: { zh: "金色的吊飾與雪花垂落在盒蓋上，小金魚帶著拐杖糖與聖誕襪游進佳節。打開抽屜，十二尾小金魚茶包，陪你與重要的人共度溫暖的冬日時光。", en: "Gold baubles and snowflakes hang across the lid as a little goldfish swims into the season with a candy cane or a Christmas stocking. Slide open the drawer to find twelve Goldfish Tea Bags, ready for warm winter hours with the people who matter most." } },
    notice: [embroideryNote], // 出貨時間改用全部預購商品共用的 preOrderShipping（客戶答覆 B7，2026-10-12；取代原本暫定的「12 月上旬起陸續出貨」）
    en: { name: "Christmas Giftbox (Limited Edition)", description: "Christmas Giftbox (Limited Edition) is a CHARM VILLA gift set containing 12 Goldfish Tea Bags, three each of four tea varieties, presented in a paper drawer box with an embroidered woven-fabric lid. Choose the Stocking or Candy Cane lid for a warm holiday gift.", summary: "12 Goldfish Tea Bags per box · Four-tea assortment" } },
  // 雪花迷人禮（三盒組）：2026-10-13 agent 推理暫定，待客戶確認（使用者 2026-10-13：「先上架」）。名稱、盒型、尺寸、重量、茶款與文案皆為暫定值，
  // 價格與茶款已由使用者轉達（2026-10-14：「三件一組 $60」「茶款（5 選 1）」玫瑰烏龍、東方美人、紅玉、金萱、玫瑰蜜香）；預購、額度待客戶提供（2026-10-14）。officialId 9002 只是暫定的唯一值，台灣官網沒有這個商品。
  // 每盒 2 包同一種茶、三盒一組，寫法同已隱藏的心有愛（heart-gift-box）。圖庫只用自己的 3 張（catalog.ts），沒有專屬情境照。
  { officialId: 9002, slug: "snowflake-gift-box", /* pre-order (user 2026-10-14: 「根據客戶要求改成預購」; client: 「預購數量後續補上」), reversing 10-13 「不用預購」; no allowance yet, so no count shown */ preOrder: true, /* teas mixed freely across the three boxes, one tea per box (user 2026-10-14: 「可以自由混搭茶種（最多３種，每盒同一種口味）」) */ mix: true, /* names from the client (user 2026-10-14, reply item 2: 「原「雪花迷人禮」請改為 聖誕心意禮（限量版）」 / "Christmas Charming Gift (Limited Edition)"; sold only as a set of three, US$60) */ name: "聖誕心意禮（限量版）", english: "CHRISTMAS CHARMING GIFT (LIMITED EDITION)", series: "2026 聖誕節限定商品", pieces: 2, setOf: 3, box: paperSnowflake, dimensions: "10 × 6.5 × 7.5 cm", weight: 20, contents: [], usd: 60,
    choices: [rose, beauty, ruby, jinxuan, honey].map(label => ({ label, contents: [count(label, 2)], price: 60 })),
    description: "CHARM VILLA「聖誕心意禮（限量版）」每盒 2 包金魚茶包，三盒一組。白色紙盒飾以燙金雪花與壓紋小金魚，以透明貼紙封口，適合在佳節分送親友。",
    en: { name: "Christmas Charming Gift (Limited Edition)", description: "Christmas Charming Gift (Limited Edition) is a set of three CHARM VILLA boxes, each holding two Goldfish Tea Bags of your selected tea. The white boxes carry rose-gold foil snowflakes and an embossed goldfish, sealed with a clear sticker — easy to share with friends during the holidays.", summary: "Set of 3 boxes · 2 tea bags per box · Mix and match teas" } },
  { officialId: 1072, slug: "small-moon-tea-gift-box", hidden: true, sceneFile: "scene-small-moon-tea-gift-box.webp", name: "小鮮月禮盒｜純茶包", english: "SMALL MOON / TEA", series: "2026 中秋節限定商品", pieces: 6, box: "紙盒", dimensions: smallBox, weight: 99, contents: [count(rose, 3), count(honey, 3)], description: "中秋的心意，收在六尾小金魚之間。玫瑰烏龍茶與玫瑰蜜香紅茶各三入，讓相聚從打開禮盒、注入一杯熱水開始。",
    en: { name: "Small Moon Gift Box | Tea Only", description: "A Mid-Autumn gesture kept among six goldfish: three of Rose Oolong Tea and three of Rose & Honey-Scented Black Tea. The gathering begins with opening the box and pouring a cup of hot water." } },
  { officialId: 994, slug: "full-moon-tea-gift-box", hidden: true, journalStory: 301, name: "大盈月禮盒｜純茶包", english: "FULL MOON / TEA", series: "2026 中秋節限定商品", pieces: 18, box: wood, dimensions: squareBox, weight: 400, contents: eighteen, sceneFile: "CV-0357-tag2.webp" /* the brand's CV-0357 with the real gold foil tag (2026-10-05) */, description: "花鳥與枝葉鋪展在織布盒蓋上，桐木盒收藏十八尾小金魚。從盒上的一幅風景，到杯中的一段茶時，讓團聚與欣賞一同發生。", note: "本款為純茶包禮盒，不含茶點與茶具；緞帶顏色隨機出貨。",
    en: { name: "Full Moon Gift Box | Tea Only", description: "Flowers, birds and branches spread across the woven lid, and a paulownia box keeps eighteen goldfish. From the scenery on the box to the tea time in the cup, reunion and appreciation happen together.", note: "This is a tea-only gift box; sweets and teaware are not included. The ribbon color is chosen at random." } },
];

// How to brew (the US document and FAQ, 2026-10-07; guide §4 before). English is the document's wording; the Chinese is a faithful translation.
// Not shown on the fruit & herbal tea box (user 2026-10-06: 「花果茶禮盒先不放」).
const brewSteps = (t: (zh: string, en: string) => string) => [
  { title: t("注入熱水", "Pour the Hot Water"), text: t("將 150 mL（約 5 fl oz）、95°C（203°F）的熱水倒入杯中。建議使用透明玻璃杯，欣賞小金魚的姿態。", "Pour 150 mL (about 5 fl oz) of hot water at 95°C (203°F) into your cup. Use a clear glass cup to enjoy the goldfish's shape.") },
  { title: t("打開包裝", "Open the Package"), text: t("沿著缺口將包裝完整撕開，取出小金魚茶包。", "Tear the package fully open at the notch and lift out the goldfish tea bag.") },
  { title: t("放入小金魚", "Add Your Goldfish"), text: t("將茶包放入水中。可用茶匙或攪拌棒輕輕將茶包壓入水中，再讓它浮起。", "Add the tea bag to the water. Using a teaspoon or stirrer, gently submerge the tea bag, then let it float.") },
  { title: t("浸泡", "Steep"), text: t("浸泡約 5 分鐘，看茶色漸漸加深，小金魚慢慢成形。", "Steep for about 5 minutes as the tea's color deepens and the goldfish takes shape.") },
  { title: t("享用", "Enjoy"), text: t("聞一聞茶香，啜飲一口，為自己留一段時間。", "Enjoy the fragrance, take a sip, and make a little time for yourself.") },
];
// User 2026-10-12, after the kettle and light references (「熱水壺參考」「光影參考」「重生！我要看到不一樣的！令人讚歎的！」): a new photograph,
// not an edit — a dark room, one shaft of warm sun across a black-oak table, a matte black gooseneck kettle held by its back handle, the
// loop-handle glass teacup with the brewed goldfish, and the flat matte-gold tag (straight crimped ends, about the cup's width; 「茶標籤是扁的」).
// Nano Banana 2.1 at 4K, cropped to drop UI copied from the light reference. Earlier versions stay in docs/qa/2026-10-12-brew-photo-progress.
// 2026-10-14: same light and style, the kettle now stands beside the cup and the table is warm walnut (user: 「改成熱水壺放在茶杯旁邊，
// 其他不動只改桌面顏色」, then 「泡茶的圖可以換了」); Nano Banana 2.1 4K from the photo above. The pouring version stays in the repo.
const brewImage = (t: (zh: string, en: string) => string) => site("scene-brewing-gooseneck-beside-cup-walnut-sunbeam.webp",
  t("熱水壺放在玻璃茶杯旁，杯中的小金魚茶包已經泡開",
    "A gooseneck kettle beside a glass teacup with a brewed goldfish tea bag"), 2048, 3053);

// 茶款介紹 under the specifications, as on the official product pages (user 2026-10-07, with the wording for the four main teas);
// 金萱 and 花果茶 are condensed from the official store's descriptions. A competition tea describes its base tea, plus the note on the competitions.
const teaNotes: Record<string, Bi> = {
  [rose]: { zh: "取台灣南投新鮮有機玫瑰花瓣，搭配嚴選烏龍茶胚。金黃琥珀茶湯，蘊遞醇美玫瑰香氣，滋味甘醇，喉韻悠長。",
    en: "Carefully selected oolong leaves meet organic rose petals from Nantou, Taiwan. The tea brews to a golden amber, with a mellow rose fragrance, a smooth flavor and a lingering finish." },
  [honey]: { zh: "蜜香紅茶中加入有機玫瑰花瓣，玫瑰濃郁甜美，與天然甘醇的蜜香紅茶相伴。",
    en: "Organic rose petals bring a rich floral fragrance to honey-scented black tea, complementing its naturally mellow sweetness." },
  [ruby]: { zh: "紅玉是台灣特有的茶樹品種。茶湯明亮清澈、朱紅豔麗，滋味濃醇甘潤，帶有天然肉桂、薄荷與淡淡花香。",
    en: "Ruby is a Taiwanese tea cultivar. It brews to a clear, vivid red, with a rich, smooth flavor and natural notes of cinnamon, mint and delicate flowers." },
  [beauty]: { zh: "茶小綠葉蟬吸食嫩芽而形成「著涎」，茶香帶有天然花果蜜香，口感醇厚甘潤。",
    en: "Oriental Beauty develops its distinctive aroma as tea leafhoppers feed on the young buds. It has natural notes of honey, fruit and flowers, with a rich, smooth sweetness." },
  [jinxuan]: { zh: "茶湯金黃明亮、水色澄清，微焙醇和並帶天然乳香，口感甘醇生津，茶性溫潤柔和。",
    en: "Lightly roasted and mellow, Jin Xuan brews to a clear, golden hue with a naturally milky aroma. Its smooth, refreshing flavor makes for a gentle cup." },
  [fruit]: { zh: "無咖啡因。以蘋果、木瓜、蜜桃、西洋梨、鳳梨與芒果為甜蜜基底，佐以矢車菊與檸檬香茅的清雅香氣，再點綴玫瑰果的甘酸，入喉溫潤甜美。",
    en: "Caffeine-free. A sweet base of apple, papaya, peach, pear, pineapple and mango, with the light fragrance of cornflower and lemongrass and a touch of tart rosehip; warm and sweet on the palate." },
};
const teaNoteKey = (name: string) => name.includes("玫瑰烏龍") ? rose : name.includes("東方美人") ? beauty : name;
const isCompetitionTea = (name: string) => /等獎/.test(name);
const competitionNote: Bi = { zh: "每年由政府協辦冬夏兩季評鑑比賽，自茶乾與沖泡後的底葉外觀、乾茶與茶湯的香氣，以及茶湯水色，嚴謹評選出各級別的獲獎茶。",
  en: "At government-supported tea competitions held in summer and winter, judges carefully assess the dry and brewed leaves, the aroma of the leaves and tea, and the color of the infusion before awarding grades." };

// 保存期限（客戶答覆 B6，2026-10-12）：自茶葉生產日期起算；含玫瑰烏龍茶或玫瑰蜜香紅茶（含比賽獲獎的玫瑰烏龍茶）1 年，不含 2 年。
// 綜合盒只要含任一款即整盒 1 年；可選茶款的盒子依選項各自判定，選項之間不同時分開寫。依實際茶款判定，不看商品名稱。
const hasRoseTea = (contents: TeaContents) => contents.some(c => c.name.includes("玫瑰烏龍") || c.name.includes(honey));
const shelfYears = (contents: TeaContents) => (hasRoseTea(contents) ? 1 : 2);
const shelfLifeOf = (gift: TeaGift, en: boolean, teaName: (zh: string) => string) => {
  const years = (n: number) => (en ? `${n} year${n > 1 ? "s" : ""}` : `${n} 年`);
  const options = gift.choices ?? [{ label: "", contents: gift.contents }];
  const set = [...new Set(options.map(c => shelfYears(c.contents)))];
  if (set.length === 1) return years(set[0]);
  const short = (zh: string) => teaName(zh).replace(/\s*[（(][^（）()]+[）)]/g, "").trim();
  const roseNames = options.filter(c => shelfYears(c.contents) === 1).map(c => short(c.label));
  return en
    ? `1 year for ${roseNames.length > 1 ? `${roseNames.slice(0, -1).join(", ")} and ${roseNames.at(-1)}` : roseNames[0]}; 2 years for other teas`
    : `${roseNames.join("、")}款 1 年；其他茶款 2 年`;
};

export const teaGiftProductsFor = (lang: Locale): Product[] => {
  const en = lang === "en";
  const t = (zh: string, e: string) => (en ? e : zh);
  const lt = (x: Bi) => (en ? x.en : x.zh);
  // Shared vocabulary: a missing English entry is a build error rather than a silent Chinese fallback.
  const v = (zh: string) => { if (!en) return zh; const e = english[zh]; if (!e) throw new Error(`tea-gifts: no English wording for "${zh}"`); return e; };
  // CV-0040 (春曉, purple box with birds) and CV-0041 (暮雪, on black) were removed from their pages, journal-313 (the empty corner with a sideboard) from 蝴蝶蘭 journal-315 (mugs on a shelf) from 紫斑蝶 and journal-326 (the hallway) wherever it was used (user 2026-10-05: 「刪」)
  return teaGifts.map(gift => {
    const name = en ? gift.en.name : gift.name;
    const vt = (zh: string) => (en && gift.en.tea?.[zh]) || v(zh);
    const describeContents = (contents: TeaContents) => contents.map(c => en ? `${c.count} × ${vt(c.name)}` : `${c.name} ${c.count} 入`).join(t("、", ", "));
    const official = { ...officialImages[String(gift.officialId) as keyof typeof officialImages], alt: t(`${name}・官方禮盒商品圖`, `${name}, official gift box product image`), cutout: true } satisfies Img;
    const journalAlt = t(`${name}・日常茶時情境（tea journal）`, `${name}, an everyday tea moment (tea journal)`);
    const sceneAlt = t(`${name}・禮盒茶席情境`, `${name}, the gift box at a tea table`);
    const journalScene = gift.journalScene ? site(`journal-${gift.journalScene}.webp`, journalAlt) : undefined;
    const journalStory = gift.storyFile ? site(gift.storyFile.file, lt(gift.storyFile.alt)) : gift.journalStory ? site(`journal-${gift.journalStory}.webp`, journalAlt) : undefined;
    const generated = gift.sceneFile ? site(gift.sceneFile, sceneAlt) : undefined;
    const image = gift.scene ? gallery(gift.scene, sceneAlt) : generated ?? journalScene ?? official;
    const contents = gift.choices
      ? gift.choices.map(c => describeContents(c.contents)).join(t("；或 ", "; or "))
      : describeContents(gift.contents);
    const mix = gift.mix ? t("每盒一種茶，可混搭", "one tea per box, mix and match") : gift.choices ? t("單一茶款，整盒擇一", "one tea, chosen per box") : gift.contents.length > 1 ? t("綜合茶款", "assorted teas") : t("單一茶款", "single tea");
    const note = en ? gift.en.note : gift.note;
    const notices = [...(gift.preOrder ? [lt(preOrderShipping)] : []), ...(gift.notice?.map(lt) ?? []), ...(note ? [note] : [])];
    // shared pre-order allowance left (客戶答覆 B7): the data override, else the full allowance until Shopify inventory replaces it
    const preOrderRemaining = gift.preOrder && gift.preOrderLimit !== undefined ? Math.max(0, gift.preOrderLeft ?? gift.preOrderLimit) : undefined;
    // USD on the US catalogue; the Taiwan list price (TWD) only for the hidden boxes
    const price = gift.usd !== undefined
      ? { amount: gift.usd, currency: "USD" as const }
      : { amount: (officialPrices.prices as Record<string, number>)[String(gift.officialId)], currency: "TWD" as const };
    // What the bag button offers: each tea × lid colour (the Shopify variants), each packaging option, or each tea
    const bagChoices = gift.packaging
      ? gift.packaging.map(p => ({ label: lt(p.label), contents: gift.contents, price: price.amount, note: lt(p.text), viewsFrom: p.viewsFrom, placeholderViews: p.placeholderViews, lidViews: p.lidViews && { ...p.lidViews, lid: t(`${p.label.zh}款盒蓋`, `${p.label.en.toLowerCase()} lid`) } })) // the text shows under the chooser once chosen (user 2026-10-07: 「可以精簡呈現在這區」), no longer a specification row
      : gift.choices?.flatMap(c => (gift.lid ?? [undefined]).map((l, li) => ({ label: l ? `${vt(c.label)}${t("／", " / ")}${lt(l)}` : vt(c.label), contents: c.contents, price: c.price, lidViews: l ? gift.lidViews?.[li] : undefined })));
    // lid colours with the same contents and price (聖誕佳禮 Orange/Teal) are named as such, not as packaging
    const choiceLabel = gift.packaging?.some((o) => o.lidViews) ? t("選擇盒蓋", "Choose your lid") /* client §6: 「Choose your lid」 with Stocking / Candy Cane */ : gift.packaging ? t("選擇包裝", "Choose your packaging") : gift.lid ? t("選擇茶款與盒蓋顏色", "Choose your tea and lid color") : gift.mix ? t("選擇茶款", "Choose your teas") /* client §2 */ : t("選擇茶款（每盒擇一）", "Choose your tea");
    return {
      slug: gift.slug, category: "tea", name, english: gift.english,
      summary: (en && gift.en.summary) || t(`${gift.pieces} 入／盒${gift.setOf ? ` · ${gift.setOf} 盒一組` : ""} · ${mix}`, `${gift.pieces} Goldfish Tea Bags per box${gift.setOf ? ` · Set of ${gift.setOf} boxes` : ""} · ${mix}`) /* set size in the card line (2026-10-13, 雪花三盒組) */,
      description: en ? gift.en.description : gift.description, image,
      views: [...(gift.scene || generated || journalScene ? [{ label: t("禮盒情境", "Gift box scene"), image }] : []), { label: t("官方商品圖", "Official product image"), image: official }],
      facts: [
        { label: t("系列", "Series"), value: v(gift.series) },
        // Contents, then how the tea is chosen and which teas are available — names only, no repeated quantities, so a choice never reads
        // as an assortment (client tea-names review 2026-10-13 §1, §4; user 2026-10-14: 「依照客戶回覆修改」). Fixed assortments keep their quantities.
        { label: t("販售單位", "Contents"), value: gift.setOf
          ? t(`${gift.setOf} 盒一組，每盒 ${gift.pieces} 包，共 ${gift.setOf * gift.pieces} 包`, `${gift.setOf} gift boxes, with ${gift.pieces} goldfish-shaped tea bags per box (${gift.setOf * gift.pieces} tea bags total)`)
          : gift.choices ? t(`1 盒／所選茶款小金魚茶包 ${gift.pieces} 入`, `1 box / ${gift.pieces} Goldfish Tea Bags of your selected variety`)
          : t(`1 盒／小金魚茶包 ${gift.pieces} 入`, `1 box / ${gift.pieces} Goldfish Tea Bags`) },
        ...(gift.mix ? [{ label: t("選茶方式", "Tea selection"), value: t(`每盒選一種茶，${gift.setOf} 盒可以混搭。`, "Choose one tea variety for each box. Mix and match across the three boxes.") }] : []),
        gift.choices
          ? { label: t("可選茶款", "Available teas"), value: gift.choices.map(c => vt(c.label)).join(t("、", "; ")), items: gift.choices.map(c => vt(c.label)) }
          // one tea per line (user 2026-10-06: 「內容物用點列」)
          : { label: t("盒內茶款", "Tea selection"), value: contents, items: gift.contents.map(c => describeContents([c])) },
        ...(gift.lid ? [{ label: t("盒蓋顏色", "Lid options"), value: gift.lid.map(lt).join(t("或", " or ")) }] : []),
        { label: t("盒型與材質", "Packaging"), value: v(gift.box) },
        ...(gift.dimensions ? [{ label: t("外盒尺寸（長 × 寬 × 高）", "Box dimensions (L × W × H)"), value: sizeText(gift.dimensions.replace(" cm", "").split(" × ").map(Number), lang) }] : []),
        ...(gift.ingredients ? [{ label: t("成分", "Ingredients"), value: lt(gift.ingredients) }] : []),
        ...(gift.weight ? [{ label: t("重量（含盒）", "Weight (with box)"), value: t(`約 ${gift.weight} 公克${gift.setOf ? "／盒" : ""}`, `About ${gift.weight} g${gift.setOf ? " per box" : ""}`) }] : []),
        { label: t("保存期限", "Shelf life"), value: shelfLifeOf(gift, en, vt) },
        // the FAQ: the tea bag and the tea testing, true of every box
        { label: t("茶包材質", "Tea bag material"), value: t("食品等級不織布，製作過程不使用化學黏劑；茶葉通過 SGS 檢測", "Food-grade non-woven fabric, made without chemical adhesives; the teas are SGS-tested") },
        ...(notices.length ? [{ label: t("產品須知", "Please note"), value: notices.join(" "), items: notices }] : []),
      ],
      story: gift.story
        ? { title: lt(gift.story.title), body: lt(gift.story.body), image: journalStory, ...(gift.story.more ? { more: { title: lt(gift.story.more.title), body: lt(gift.story.more.body), ...(gift.story.more.source ? { source: lt(gift.story.more.source) } : {}) } } : {}) }
        : {
          title: t("一盒風景，一席茶時", "A little beauty, a moment for tea"),
          body: t("先看盒面的紋理，再看金魚的摺痕。從指尖的手作到水中的舒展，每一件小物都邀請人放慢觀看的步調。禮盒被打開之後，藝術也隨著共飲的時刻，走進生活。",
            "Look closely at the texture of the lid and the folds of each goldfish. From the care of the maker's hands to the way the tea bag unfurls in water, every detail invites you to slow down. Open the box, share a cup, and let art become part of the moment."),
          image: journalStory,
        },
      teaNotes: (() => {
        const names = gift.choices ? gift.choices.flatMap(c => c.contents.map(x => x.name)) : gift.contents.map(c => c.name);
        const keys = [...new Set(names.map(teaNoteKey))];
        const items: { name: string; text: string; term?: string }[] = keys.map(k => { const n = teaNotes[k]; if (!n) throw new Error(`tea-gifts: no 茶款介紹 for "${k}"`); return { name: v(names.find(x => teaNoteKey(x) === k) ?? k), text: lt(n) }; }); // the card names the tea as the box lists it (頭等獎玫瑰烏龍茶, 貳等獎東方美人茶…; user 2026-10-13: 茶款介紹與禮盒內容名稱要一致)
        if (names.some(isCompetitionTea)) items.push({ name: t("比賽獲獎茶", "Competition-winning teas"), text: lt(competitionNote), term: t("得獎茶", "Award-winning") });
        return { title: t("茶款介紹", "About the teas"), items };
      })(),
      ...(gift.slug !== "fruit-infusion-gift-box" ? { brew: { title: t("沖泡方式", "How to brew"), steps: brewSteps(t), image: brewImage(t) } } : {}),
      ...(gift.soldOut || preOrderRemaining === 0 ? { soldOut: true } : {}), // an allowance used up reads as sold out
      ...(gift.preOrder ? { preOrder: true } : {}),
      ...(preOrderRemaining !== undefined ? { preOrderRemaining } : {}),
      ...(gift.priceTbd ? { priceTbd: true } : {}),
      ...(gift.teaTbd ? { teaTbd: true } : {}),
      ...(gift.hidden ? { hidden: true } : {}),
      variant: gift.variant ? { group: gift.variant.group, label: v(gift.variant.label) } : undefined,
      officialUrl: `https://www.charmvilla.com.tw/product_d.php?lang=tw&tb=1&id=${gift.officialId}`,
      price: gift.priceTbd ? undefined : price,
      giftBox: { pieces: gift.pieces, series: v(gift.series), contents: gift.contents, choices: bagChoices, choiceLabel, ...(gift.mix && gift.setOf ? { mixBoxes: gift.setOf } : {}) },
    };
  });
};

export const teaGiftProducts: Product[] = teaGiftProductsFor("zh");
