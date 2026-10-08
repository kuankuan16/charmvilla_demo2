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
  series: "經典商品" | "珍稀商品" | "2026 中秋節限定商品";
  pieces: number;
  box: string;
  dimensions: string;      // "" where the document gives none (團圓, 15 bags)
  shelfLife?: string;
  contents: TeaContents;
  /** one tea per box; `price` is that option's price (USD on the US catalogue, TWD on hidden Taiwan boxes) */
  choices?: { label: string; contents: TeaContents; price?: number }[];
  /** lid colours sold with every tea choice (春曉 Blue/Pink, 蝴蝶蘭 Gold/Pink): each tea × lid is a Shopify variant */
  lid?: Bi[];
  /** packaging options with the same contents and price (團圓 Gold/Pink/Blue) */
  packaging?: { label: Bi; text: Bi; viewsFrom?: string; placeholderViews?: number }[];
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
  story?: { title: Bi; body: Bi; more?: { title: Bi; body: Bi } };
  /** marked sold out on the official store: the price stays, the bag button is disabled */
  soldOut?: boolean;
  /** not sold on the US store: kept out of every listing, menu, sitemap and product page (404), data kept */
  hidden?: boolean;
  variant?: { group: string; label: string };
  // summary: the count line on cards and the page; tea: Shopify's tea names for this box where they differ from the shared dictionary
  en: { name: string; description: string; note?: string; summary?: string; tea?: Record<string, string> };
};

// Tea names as the US document writes them (Chinese and English).
const rose = "玫瑰烏龍茶", honey = "玫瑰蜜香紅茶", ruby = "紅玉紅茶（Red Jade／Ruby No.18）";
const beauty = "東方美人茶（白毫烏龍茶）", jinxuan = "金萱烏龍茶（Golden Lily）", fruit = "花果茶";
const firstRose = "頭等獎玫瑰烏龍茶", secondBeauty = "貳等獎東方美人茶", thirdBeauty = "參等獎東方美人茶";
const count = (name: string, count: number) => ({ name, count });
const reunion = [rose, honey, ruby, beauty].map(name => count(name, 3));
const fifteen = [rose, beauty, ruby, jinxuan, honey].map(name => count(name, 3));
const eighteen = [count(rose, 9), ...[beauty, ruby, jinxuan].map(name => count(name, 3))];
// 春曉、暮雪 (12 bags) and 蝴蝶蘭 (18 bags): one competition tea per box, the Oriental Beauty option priced higher
const twelve = (first: number, third: number) => [{ label: firstRose, price: first }, { label: thirdBeauty, price: third }].map(c => ({ ...c, contents: [count(c.label, 12)] }));
const wood = "桐木盒、織布盒蓋";
const woodTieDye = "桐木盒搭配紮染布面盒蓋，飾以手工刺繡";
const woodEmbroidered = "桐木盒搭配手工刺繡布面盒蓋";
const paperKyoto = "高密度紙盒搭配連體盒蓋與封口封條";
const reunionBoxes = "依包裝選項：橘色紙盒、桐木盒或藍色紙盒，皆搭配手工刺繡盒蓋";
const longBox = "28.6 × 11.7 × 9 cm";    // 11.3 × 4.6 × 3.5 in
const smallBox = "20.5 × 18.5 × 6.9 cm"; // 8.1 × 7.3 × 2.7 in
const squareBox = "28 × 19 × 9 cm";      // 11.0 × 7.5 × 3.5 in
const rareBox = "27.7 × 19.1 × 9.6 cm";
const blue: Bi = { zh: "藍色", en: "Blue" }, pink: Bi = { zh: "粉紅色", en: "Pink" }, gold: Bi = { zh: "金色", en: "Gold" };

// English wording for the shared vocabulary. Every Chinese value used above must have an entry (checked at build).
const english: Record<string, string> = {
  [rose]: "Rose Oolong Tea", [honey]: "Rose & Honey-Scented Black Tea", [ruby]: "Ruby Black Tea (Red Jade / Ruby No.18)",
  [beauty]: "Oriental Beauty Tea (White Tip Oolong)", [jinxuan]: "Jin Xuan Oolong Tea (Golden Lily)", [fruit]: "Fruit & Herbal Tea",
  [firstRose]: "First Prize Rose Oolong Tea", [secondBeauty]: "Second Prize Oriental Beauty Tea", [thirdBeauty]: "Third Prize Oriental Beauty Tea",
  "經典商品": "Classic Gift Boxes", "珍稀商品": "Rare Gift Boxes", "2026 中秋節限定商品": "2026 Mid-Autumn Gift Boxes",
  [wood]: "Paulownia wood box, woven-fabric lid", "織布盒蓋、繽紛紙盒（日本製）": "Woven-fabric lid, patterned paper box (made in Japan)",
  [woodTieDye]: "Paulownia wood box with a tie-dyed fabric lid featuring hand embroidery",
  [woodEmbroidered]: "Paulownia wood box with a hand-embroidered fabric lid",
  [paperKyoto]: "High-density paper box with an attached lid and closure seal",
  [reunionBoxes]: "By packaging option: orange paper box, paulownia wood box or blue paper box, each with a hand-embroidered lid",
  "紙盒": "Paper box", "繽紛紙紙盒、織布盒蓋": "Patterned paper box, woven-fabric lid", "繽紛紙盒、織布盒蓋": "Patterned paper box, woven-fabric lid",
  "2 年": "2 years", "1 年": "1 year",
  "繽紛紙盒・12 入": "Paper box · 12 tea bags", "桐木木盒・12 入": "Paulownia box · 12 tea bags",
};
const competitionPricing: Bi = { zh: "價格可能變動，並依每年舉辦兩次的茶葉競賽官方定價調整。", en: "Prices are subject to change and will be adjusted based on the official pricing from the tea competitions (held twice a year)." };
const tieDyeColors: Bi = { zh: "紮染盒蓋的色彩依實品為準，可能與產品圖片略有差異。", en: "Actual tie-dyed lid colors may differ from the product images." };
const embroideryNote: Bi = { zh: "盒蓋上的手工刺繡，為禮盒增添立體質感與細緻工藝。", en: "The lid features hand embroidery, adding texture and carefully worked detail to the gift presentation." };

export const teaGifts: TeaGift[] = [
  // 團圓 Joyful Reunion: one listing with the three packaging options of the US store (the Taiwan store's two 12-bag boxes were separate listings)
  { officialId: 891, slug: "reunion-paper-gift-box", journalStory: 301, name: "團圓", english: "JOYFUL REUNION", series: "經典商品", pieces: 15, box: reunionBoxes, dimensions: "", weight: 0, contents: fifteen, usd: 170, scene: "CV-0348",
    packaging: [
      { label: gold, text: { zh: "橘色紙盒搭配金色手工刺繡盒蓋。", en: "Orange paper box with a hand-embroidered gold lid." } },
      { label: pink, text: { zh: "桐木盒搭配粉紅色手工刺繡盒蓋。", en: "Paulownia wood box with a hand-embroidered pink lid." }, placeholderViews: 2 /* off sale: grey blocks instead of the paulownia box's photographs (user 2026-10-07: 「粉紅色商品下架改成灰色塊」) */ },
      { label: blue, text: { zh: "藍色紙盒搭配黃色手工刺繡盒蓋。", en: "Blue paper box with a hand-embroidered yellow lid." }, placeholderViews: 2 /* off sale too (user 2026-10-07: 「藍色也是」) */ },
    ],
    description: "CHARM VILLA「團圓」禮盒內含 15 包金魚茶包，五款茶各 3 包。所有包裝選項均含相同茶款組合，適合與親友共享或贈禮。",
    story: { title: { zh: "故事", en: "Story" }, body: { zh: "不同茶款的小金魚在一方紙盒內團聚，象徵著團圓美好之意。", en: "Little goldfish carrying different teas gather in one paper box, a symbol of reunion and the joy of togetherness." } },
    notice: [{ zh: "三款包裝均含相同的 15 包茶款組合。" + embroideryNote.zh, en: "All three options contain the same 15-bag tea assortment. " + embroideryNote.en }],
    en: { name: "Joyful Reunion", description: "Joyful Reunion is a CHARM VILLA gift set containing 15 Goldfish Tea Bags: three each of five tea varieties. Every packaging option contains the same assortment, offering a selection to enjoy together or give as a gift." } },
  { officialId: 64, slug: "reunion-paulownia-gift-box", hidden: true, journalStory: 308, name: "團圓｜桐木木盒", english: "REUNION / PAULOWNIA BOX", series: "經典商品", pieces: 12, box: wood, dimensions: longBox, weight: 407, contents: reunion, sceneFile: "CV-0350-tag2.webp" /* the brand's CV-0350 with the real gold foil tag (2026-10-05) */, description: "織布的經緯與桐木的紋理，在一只盒上相接。四款台灣茶各自成形，讓一份茶禮，也成為值得收藏的日常物件。",
    en: { name: "Reunion | Paulownia Box", description: "The weave of the fabric and the grain of paulownia meet on a single box. Four Taiwanese teas each take their own form, making a gift of tea an everyday object worth keeping." } },
  { officialId: 954, slug: "year-of-plenty-gift-box", journalStory: 319, name: "年年有魚", english: "ABUNDANCE & PROSPERITY", series: "經典商品", pieces: 18, box: woodEmbroidered, dimensions: squareBox, weight: 400, contents: eighteen, usd: 220, sceneFile: "CV-0356-tag2.webp" /* the brand's CV-0356 with the real gold foil tag (2026-10-05) */,
    description: "CHARM VILLA「年年有魚」禮盒以桐木盒搭配手工刺繡布面盒蓋，內含 18 包金魚茶包。每盒集結四款茶，適合共享品茶時光，也為節慶送禮備妥一份心意。", notice: [embroideryNote],
    en: { name: "Abundance & Prosperity", description: "Abundance & Prosperity is a CHARM VILLA gift set containing 18 Goldfish Tea Bags in a Paulownia wood box with a hand-embroidered fabric lid. Four tea varieties are included in every box, making it a thoughtful assortment for shared tea moments and festive gifting.", summary: "18 Goldfish Tea Bags per box · Four-tea assortment" } },
  { officialId: 1053, slug: "blossoming-prosperity-gift-box", sceneFile: "scene-blossoming-prosperity-gift-box.webp", journalStory: 329, name: "花開富貴", english: "PROSPERITY IN BLOOM", series: "經典商品", pieces: 18, box: woodEmbroidered, dimensions: squareBox, weight: 400, contents: eighteen, usd: 220,
    description: "CHARM VILLA「花開富貴」禮盒以桐木盒搭配手工刺繡布面盒蓋，內含 18 包金魚茶包。固定的四款茶組合匯集玫瑰烏龍茶、紅玉紅茶、金萱烏龍茶與東方美人茶，適合在慶祝與相聚時分享。", notice: [embroideryNote],
    en: { name: "Prosperity in Bloom", description: "Prosperity in Bloom is a CHARM VILLA gift set containing 18 Goldfish Tea Bags in a Paulownia wood box with a hand-embroidered fabric lid. Its fixed four-tea assortment brings together Rose Oolong, Ruby Black, Jin Xuan Oolong, and Oriental Beauty for a gift to share at celebrations and gatherings.", summary: "18 Goldfish Tea Bags per box · Four-tea assortment" } },
  { officialId: 104, slug: "spring-blossoms-gift-box", hidden: true, sceneFile: "scene-spring-blossoms-gift-box.webp", journalStory: 325, name: "花滿富春", english: "SPRING BLOSSOMS", series: "經典商品", pieces: 18, box: wood, dimensions: rareBox, weight: 400, contents: eighteen, description: "金魚游過牡丹花間，花葉與魚形構成盒上的風景。四款茶盛入十八尾手作小金魚，從盒中的陳列走向杯裡的舒展。",
    en: { name: "Spring Blossoms", description: "Goldfish swim among peonies; blossom, leaf and fish form the scenery on the lid. Four teas fill eighteen handmade goldfish, moving from their arrangement in the box to their unfurling in the cup." } },
  { officialId: 692, slug: "kyoto-gift-box", journalScene: 320, journalStory: 309, name: "京都版", english: "KYOTO ARTISANAL RESERVE", series: "經典商品", pieces: 6, box: paperKyoto, dimensions: smallBox, weight: 99, contents: [], usd: 60,
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
  { officialId: 850, slug: "spring-dawn-gift-box", storyFile: { file: "scene-hands-speckled-mug-goldfish-tea-warm-light.webp", alt: { zh: "暖陽斜照下，雙手捧著米白斑點陶杯，杯中泡開的小金魚茶包透出粉紅玫瑰花瓣與深色茶葉", en: "In low warm sunlight, two hands hold a cream speckled stoneware mug; the brewed goldfish tea bag inside shows its pink rose petals and dark tea leaves" } }, name: "春曉", english: "SPRING AWAKENING", series: "珍稀商品", pieces: 12, box: woodTieDye, dimensions: longBox, weight: 350, contents: [], choices: twelve(230, 260), lid: [blue, pink], usd: 230,
    description: "CHARM VILLA「春曉」禮盒內含 12 包所選茶款的金魚茶包，以桐木盒搭配手工刺繡布面盒蓋呈現。以春日清晨為靈感，為品茶時光或一份心意帶來清新氣息。可選擇茶款，以及藍色或粉紅色盒蓋。",
    story: { title: { zh: "故事", en: "Story" }, body: { zh: "黎明破曉之際，晨陽將天空渲染為一匹朦朧的薄幕；黃山雀在風鈴木金黃的枝頭上唱著晨歌，交織出一幅醺人的春日風景。", en: "As dawn breaks, morning sunlight washes the sky into a soft, translucent veil. Yellow tits sing their morning song amid the golden blossoms of a trumpet tree, weaving a spring scene that invites you to linger." } },
    notice: [competitionPricing, tieDyeColors],
    en: { name: "Spring Awakening", description: "Spring Awakening is a CHARM VILLA gift set containing 12 Goldfish Tea Bags of your selected tea, presented in a Paulownia wood box with a tie-dyed fabric lid featuring hand embroidery. Its spring-dawn inspiration brings a sense of renewal to a tea moment or a thoughtful gift. Choose your tea and a Blue or Pink lid.", summary: "12 Goldfish Tea Bags per box · First Prize Rose Oolong Tea or Third Prize Oriental Beauty Tea" } },
  { officialId: 582, slug: "winter-blossom-gift-box", journalStory: 303, name: "暮雪", english: "SNOWY TWILIGHT", series: "珍稀商品", pieces: 12, box: woodTieDye, dimensions: longBox, weight: 350, contents: [], choices: twelve(230, 260), usd: 230,
    description: "CHARM VILLA「暮雪」禮盒內含 12 包所選茶款的金魚茶包，以桐木盒搭配手工刺繡布面盒蓋呈現。靈感來自櫻花與白雪相遇的景緻，為自己或珍視的人留下一段靜謐的品茶時光。",
    story: { title: { zh: "故事", en: "Story" }, body: { zh: "時至暮冬，即將迎來初春日子，總會令人聯想起櫻花遍土盛放的景色。在暮冬曉春之際，櫻雪互映的模樣，願能為您帶來初春新露時分清雅恬淡的美好。", en: "As the last days of winter give way to early spring, we picture cherry blossoms opening across the landscape. Where blossom meets snow, Snowy Twilight captures the quiet grace of that fleeting season. May it bring you the fresh, gentle beauty of spring's first light." } },
    notice: [competitionPricing, tieDyeColors],
    en: { name: "Snowy Twilight", description: "Snowy Twilight is a CHARM VILLA gift set containing 12 Goldfish Tea Bags of your selected tea, presented in a Paulownia wood box with a tie-dyed fabric lid featuring hand embroidery. Inspired by the meeting of cherry blossoms and snow, the collection offers a quiet tea moment for yourself or someone special.", summary: "12 Goldfish Tea Bags per box · First Prize Rose Oolong Tea or Third Prize Oriental Beauty Tea" } },
  { officialId: 960, slug: "orchid-gift-box", sceneFile: "scene-orchid-gift-box.webp", name: "蝴蝶蘭", english: "ROYAL ORCHID", series: "珍稀商品", pieces: 18, box: woodEmbroidered, dimensions: squareBox, weight: 400, shelfLife: "2 年", contents: [], lid: [gold, pink], usd: 300,
    choices: [{ label: firstRose, price: 300 }, { label: thirdBeauty, price: 340 }].map(c => ({ ...c, contents: [count(c.label, 18)] })),
    description: "CHARM VILLA「蝴蝶蘭」禮盒內含 18 包所選茶款的金魚茶包，以桐木盒搭配手工刺繡布面盒蓋呈現。以蘭花為靈感，適合在慶祝或值得紀念的時刻傳遞心意。可選擇茶款，以及金色或粉紅色盒蓋。",
    notice: [competitionPricing, embroideryNote],
    en: { name: "Royal Orchid", description: "Royal Orchid is a CHARM VILLA gift set containing 18 Goldfish Tea Bags of your selected tea, presented in a Paulownia wood box with a hand-embroidered fabric lid. The orchid-inspired collection offers a gift for celebrations and meaningful occasions. Choose your tea and a Gold or Pink lid.", summary: "18 Goldfish Tea Bags per box · First Prize Rose Oolong Tea or Third Prize Oriental Beauty Tea" } },
  { officialId: 88, slug: "purple-butterfly-gift-box", sceneFile: "scene-purple-butterfly-gift-box.webp", name: "紫斑蝶", english: "SAPPHIRE WINGS", series: "珍稀商品", pieces: 18, box: woodEmbroidered, dimensions: squareBox, weight: 400, shelfLife: "2 年", contents: [count(secondBeauty, 18)], usd: 425,
    description: "CHARM VILLA「紫斑蝶」禮盒內含 18 包貳等獎東方美人茶金魚茶包。以蝴蝶為靈感，透過桐木盒與手工刺繡布面盒蓋，呈現此款單一茶款禮盒。",
    story: {
      title: { zh: "故事", en: "Story" },
      body: { zh: "紫斑蝶，每年越冬時便在臺灣上空織就出一道紫色長河的美麗生命。牠們一身黑紗綴著藍帶與白點，盤旋飄舞於半空時，蝶翅上忽紫倏藍的幻變鱗光，就好似夜空中閃爍的小小星河，頃刻便能傾城。CHARM VILLA 為您捕捉紫斑蝶的倩麗身影，裝點於茶評鑑會獲評貳等獎的頂級東方美人茶。願您潛心品茗溫潤好茶的同時，能靜賞於幽翳之中翩然起舞的群蝶，交織出美好的吉光片羽。",
        en: "Each winter, Taiwan's purple crow butterflies trace a violet river across the island's skies. Their dark wings, adorned with blue and white, shimmer between violet and sapphire as they turn in flight—like a constellation briefly brought within reach. CHARM VILLA captures their graceful silhouettes in a gift collection of fine Oriental Beauty Tea awarded Second Prize at a tea competition. As you settle into a quiet cup, imagine butterflies dancing through the shade, weaving a fleeting moment of beauty to keep." },
      more: {
        title: { zh: "關於臺灣的紫斑蝶", en: "About Taiwan's purple crow butterflies" },
        body: { zh: "在臺灣，許多溫暖的地方都有機會看見紫斑蝶。研究紀錄顯示，牠們會在初春北返、春末初夏及秋季南遷等時期形成大規模蝶道，並在南部溫暖、避風的山谷群聚越冬。這片緩緩流動的紫色蝶河，常與墨西哥帝王斑蝶的壯麗越冬景觀並提。\n\n臺灣目前常見四種紫斑蝶。另有曾棲息於臺灣的大紫斑蝶特有亞種，已多年未見，更提醒我們珍惜蝶群賴以生存的棲地。為協助紫斑蝶安全飛越林內一帶的國道，保育措施包括設置防護網，並在遷徙蝶量達到管制門檻時暫時封閉部分車道，為蝶群留出回家的路。\n\nCHARM VILLA 貳等獎東方美人茶禮盒上所繡的是名為「端紫斑蝶」（Euploea mulciber）的紫斑蝶種。在外觀特徵上，端紫斑蝶的前翅可見明亮的藍紫色光澤，後翅則綴著散落的白點與白色細紋。\n\n紫斑蝶背景資料參考：茂林國家風景區管理處；交通部高速公路局；國立自然科學博物館；美國自然史博物館",
          en: "Purple crow butterflies thrive in Taiwan's warm landscapes. Recorded migration patterns include a northward journey in early spring, movement in late spring and early summer, and a southward journey in autumn to sheltered wintering valleys. Their great winter gatherings are often compared with those of monarch butterflies in Mexico.\n\nFour purple crow species are commonly found in Taiwan today. Another, the Great Crow's endemic Taiwanese subspecies, has not been seen for decades—a reminder of how much these delicate lives depend on their habitats. Along a migration route at Linnei, conservation measures include protective netting and temporary motorway lane closures to help butterflies cross safely.\n\nThe butterfly embroidered on the Sapphire Wings gift box is the Striped Blue Crow (Euploea mulciber), known in Chinese as 端紫斑蝶. Its forewings catch the light in brilliant blue-violet, while white spots and fine pale markings decorate its hindwings.\n\nButterfly background references: Maolin National Scenic Area; National Freeway Bureau; National Museum of Natural Science; American Museum of Natural History" },
      },
    },
    notice: [competitionPricing, { zh: "限量供應，採預購製作。", en: "Limited availability; crafted upon pre-order." }, embroideryNote],
    en: { name: "Sapphire Wings", description: "Sapphire Wings is a CHARM VILLA gift set containing 18 Goldfish Tea Bags of Second Prize Oriental Beauty Tea. A Paulownia wood box with a hand-embroidered fabric lid presents this single-tea selection in a butterfly-inspired gift collection.", summary: "18 Goldfish Tea Bags per box · Second Prize Oriental Beauty Tea" } },
  { officialId: 1072, slug: "small-moon-tea-gift-box", hidden: true, sceneFile: "scene-small-moon-tea-gift-box.webp", name: "小鮮月禮盒｜純茶包", english: "SMALL MOON / TEA", series: "2026 中秋節限定商品", pieces: 6, box: "紙盒", dimensions: smallBox, weight: 99, contents: [count(rose, 3), count(honey, 3)], description: "中秋的心意，收在六尾小金魚之間。玫瑰烏龍茶與玫瑰蜜香紅茶各三入，讓相聚從打開禮盒、注入一杯熱水開始。",
    en: { name: "Small Moon Gift Box | Tea Only", description: "A Mid-Autumn gesture kept among six goldfish: three of Rose Oolong Tea and three of Rose & Honey-Scented Black Tea. The gathering begins with opening the box and pouring a cup of hot water." } },
  { officialId: 994, slug: "full-moon-tea-gift-box", hidden: true, journalStory: 301, name: "大盈月禮盒｜純茶包", english: "FULL MOON / TEA", series: "2026 中秋節限定商品", pieces: 18, box: wood, dimensions: squareBox, weight: 400, contents: eighteen, sceneFile: "CV-0357-tag2.webp" /* the brand's CV-0357 with the real gold foil tag (2026-10-05) */, description: "花鳥與枝葉鋪展在織布盒蓋上，桐木盒收藏十八尾小金魚。從盒上的一幅風景，到杯中的一段茶時，讓團聚與欣賞一同發生。", note: "本款為純茶包禮盒，不含茶點與茶具；緞帶顏色隨機出貨。",
    en: { name: "Full Moon Gift Box | Tea Only", description: "Flowers, birds and branches spread across the woven lid, and a paulownia box keeps eighteen goldfish. From the scenery on the box to the tea time in the cup, reunion and appreciation happen together.", note: "This is a tea-only gift box; sweets and teaware are not included. The ribbon color is chosen at random." } },
];

// How to brew (the US document and FAQ, 2026-10-07; guide §4 before). English is the document's wording; the Chinese is a faithful translation.
// Not shown on the fruit & herbal tea box (user 2026-10-06: 「花果茶禮盒先不放」).
const brewSteps = (t: (zh: string, en: string) => string) => [
  { title: t("注入熱水", "Pour the Water"), text: t("將 150 mL（約 5 fl oz）、95°C（203°F）的熱水倒入杯中。建議使用透明玻璃杯，欣賞小金魚的姿態。", "Pour 150 mL (about 5 fl oz) of hot water at 95°C (203°F) into your cup. Use a clear glass cup to enjoy the goldfish's shape.") },
  { title: t("打開包裝", "Open the Package"), text: t("沿著缺口將包裝完整撕開，取出小金魚茶包。", "Tear the package fully open at the notch and lift out the goldfish tea bag.") },
  { title: t("放入小金魚", "Add Your Goldfish"), text: t("將茶包放入水中。可用茶匙或攪拌棒輕輕將茶包壓入水中，再讓它浮起。", "Add the tea bag to the water. Using a teaspoon or stirrer, gently submerge the tea bag, then let it float.") },
  { title: t("浸泡", "Steep"), text: t("浸泡約 5 分鐘，看茶色漸漸加深，小金魚慢慢成形。", "Steep for about 5 minutes as the tea's color deepens and the goldfish takes shape.") },
  { title: t("享用", "Enjoy"), text: t("聞一聞茶香，啜飲一口，為自己留一段時間。", "Enjoy the fragrance, take a sip, and make a little time for yourself.") },
];
// The photograph at the bottom left of the steps, in the site's light (Nano Banana 2.1 after the brewed-goldfish, glass cup, cloud coaster and
// walnut-table references; the string retouched to fall behind the cup, no tag in view; user 2026-10-08: 「參考目前官網的攝影風格…產出一個適合的配圖」).
const brewImage = (t: (zh: string, en: string) => string) => site("scene-brewing-glass-cup-cloud-coaster-walnut.webp",
  t("午後斜陽下的胡桃木桌，雲朵檜木杯墊上一只圓肚玻璃杯，琥珀色茶湯裡泡開的小金魚茶包透出粉紅玫瑰花瓣與茶葉；後方是橄欖綠沙發",
    "A walnut table in low afternoon sun: on a cloud-shaped hinoki coaster, a round glass cup of amber tea in which the goldfish tea bag has opened to show its pink rose petals and tea leaves; an olive sofa behind"), 1856, 2304);

// 茶款介紹 under the specifications, as on the official product pages (user 2026-10-07, with the wording for the four main teas);
// 金萱 and 花果茶 are condensed from the official store's descriptions. A competition tea describes its base tea, plus the note on the competitions.
const teaNotes: Record<string, Bi> = {
  [rose]: { zh: "取台灣南投新鮮有機玫瑰花瓣，搭配嚴選烏龍茶胚。金黃琥珀茶湯，蘊遞醇美玫瑰香氣，滋味甘醇，喉韻悠長。",
    en: "Fresh organic rose petals from Nantou, Taiwan, paired with carefully selected oolong leaves. A golden amber liquor carrying a mellow rose fragrance, smooth on the palate with a long finish." },
  [honey]: { zh: "蜜香紅茶中加入有機玫瑰花瓣，玫瑰濃郁甜美，與天然甘醇的蜜香紅茶相伴。",
    en: "Organic rose petals added to honey-scented black tea: the rich sweetness of rose alongside the natural, mellow sweetness of the tea." },
  [ruby]: { zh: "台灣特有茶種台茶 18 號，又名紅玉。茶湯明亮清澈、朱紅豔麗，滋味濃醇甘潤，帶有天然肉桂、薄荷與淡淡花香。",
    en: "Taiwan's own cultivar, TTES No. 18, known as Ruby. A bright, clear, vivid red liquor, rich and smooth, with natural notes of cinnamon, mint and a light floral scent." },
  [beauty]: { zh: "又稱白毫烏龍茶。茶小綠葉蟬吸食嫩芽而形成「著涎」，茶香帶有天然花果蜜香，口感醇厚甘潤。",
    en: "Also known as white-tip oolong. Tea leafhoppers feed on the young buds, giving the tea its natural honeyed, fruity floral aroma and a full, smooth sweetness." },
  [jinxuan]: { zh: "茶湯金黃明亮、水色澄清，微焙醇和並帶天然乳香，口感甘醇生津，茶性溫潤柔和。",
    en: "A bright golden, clear liquor; lightly roasted and mellow with a natural milky note, smooth and refreshing, gentle in character." },
  [fruit]: { zh: "無咖啡因。以蘋果、木瓜、蜜桃、西洋梨、鳳梨與芒果為甜蜜基底，佐以矢車菊與檸檬香茅的清雅香氣，再點綴玫瑰果的甘酸，入喉溫潤甜美。",
    en: "Caffeine-free. A sweet base of apple, papaya, peach, pear, pineapple and mango, with the light fragrance of cornflower and lemongrass and a touch of tart rosehip; warm and sweet on the palate." },
};
const teaNoteKey = (name: string) => name.includes("玫瑰烏龍") ? rose : name.includes("東方美人") ? beauty : name;
const isCompetitionTea = (name: string) => /等獎/.test(name);
const competitionNote: Bi = { zh: "每年由政府協辦冬夏兩季評鑑比賽，自茶乾與沖泡後的底葉外觀、乾茶與茶湯的香氣，以及茶湯水色，嚴謹評選出各級別的獲獎茶。",
  en: "Each winter and summer, government-supported competitions judge the dry leaf and the brewed leaf, the aroma of the leaf and the liquor, and the color of the liquor, and award each grade with rigor." };

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
    const mix = gift.choices ? t("單一茶款，整盒擇一", "one tea, chosen per box") : gift.contents.length > 1 ? t("綜合茶款", "assorted teas") : t("單一茶款", "single tea");
    const note = en ? gift.en.note : gift.note;
    const notices = [...(gift.notice?.map(lt) ?? []), ...(note ? [note] : [])];
    // USD on the US catalogue; the Taiwan list price (TWD) only for the hidden boxes
    const price = gift.usd !== undefined
      ? { amount: gift.usd, currency: "USD" as const }
      : { amount: (officialPrices.prices as Record<string, number>)[String(gift.officialId)], currency: "TWD" as const };
    // What the bag button offers: each tea × lid colour (the Shopify variants), each packaging option, or each tea
    const bagChoices = gift.packaging
      ? gift.packaging.map(p => ({ label: lt(p.label), contents: gift.contents, price: price.amount, note: lt(p.text), viewsFrom: p.viewsFrom, placeholderViews: p.placeholderViews })) // the text shows under the chooser once chosen (user 2026-10-07: 「可以精簡呈現在這區」), no longer a specification row
      : gift.choices?.flatMap(c => (gift.lid ?? [undefined]).map(l => ({ label: l ? `${vt(c.label)}${t("／", " / ")}${lt(l)}` : vt(c.label), contents: c.contents, price: c.price })));
    const choiceLabel = gift.packaging ? t("選擇包裝", "Choose your packaging") : gift.lid ? t("選擇茶款與盒蓋顏色", "Choose your tea and lid color") : t("選擇茶款（每盒擇一）", "Choose your tea");
    return {
      slug: gift.slug, category: "tea", name, english: gift.english,
      summary: (en && gift.en.summary) || t(`${gift.pieces} 入／盒 · ${mix}`, `${gift.pieces} Goldfish Tea Bags per box · ${mix}`),
      description: en ? gift.en.description : gift.description, image,
      views: [...(gift.scene || generated || journalScene ? [{ label: t("禮盒情境", "Gift box scene"), image }] : []), { label: t("官方商品圖", "Official product image"), image: official }],
      facts: [
        { label: t("系列", "Series"), value: v(gift.series) },
        { label: t("販售單位", "Sold as"), value: gift.setOf
          ? t(`1 組 ${gift.setOf} 盒（每盒小金魚茶包 ${gift.pieces} 入）`, `1 set of ${gift.setOf} boxes (${gift.pieces} Goldfish Tea Bags each)`)
          : t(`1 盒／小金魚茶包 ${gift.pieces} 入`, `1 box / ${gift.pieces} Goldfish Tea Bags`) },
        { label: gift.choices ? t("茶款選擇（每盒擇一）", "Choose one tea variety") : t("盒內茶款", "Tea selection"), value: contents,
          // one tea per line (user 2026-10-06: 「內容物用點列」)
          items: gift.choices ? gift.choices.map(c => describeContents(c.contents)) : gift.contents.map(c => describeContents([c])) },
        ...(gift.lid ? [{ label: t("盒蓋顏色", "Lid options"), value: gift.lid.map(lt).join(t("或", " or ")) }] : []),
        { label: t("盒型與材質", "Packaging"), value: v(gift.box) },
        ...(gift.dimensions ? [{ label: t("外盒尺寸（長 × 寬 × 高）", "Box dimensions (L × W × H)"), value: sizeText(gift.dimensions.replace(" cm", "").split(" × ").map(Number), lang) }] : []),
        ...(gift.ingredients ? [{ label: t("成分", "Ingredients"), value: lt(gift.ingredients) }] : []),
        ...(gift.weight ? [{ label: t("重量（含盒）", "Weight (with box)"), value: t(`約 ${gift.weight} 公克${gift.setOf ? "／盒" : ""}`, `About ${gift.weight} g${gift.setOf ? " per box" : ""}`) }] : []),
        { label: t("保存期限", "Shelf life"), value: v(gift.shelfLife || "1 年") },
        // the FAQ: the tea bag and the tea testing, true of every box
        { label: t("茶包材質", "Tea bag"), value: t("食品等級不織布，製作過程不使用化學黏劑；茶葉通過 SGS 檢測", "Food-grade non-woven fabric, made without chemical adhesives; the teas are SGS-tested") },
        ...(notices.length ? [{ label: t("產品須知", "Product notice"), value: notices.join(" "), items: notices }] : []),
      ],
      story: gift.story
        ? { title: lt(gift.story.title), body: lt(gift.story.body), image: journalStory, ...(gift.story.more ? { more: { title: lt(gift.story.more.title), body: lt(gift.story.more.body) } } : {}) }
        : {
          title: t("一盒風景，一席茶時", "A box of scenery, a time for tea"),
          body: t("先看盒面的紋理，再看金魚的摺痕。從指尖的手作到水中的舒展，每一件小物都邀請人放慢觀看的步調。禮盒被打開之後，藝術也隨著共飲的時刻，走進生活。",
            "Look first at the texture of the lid, then at the folds of the goldfish. From handwork at the fingertips to the unfurling in water, each small thing invites a slower pace of looking. Once the box is opened, art enters daily life with the time spent drinking tea together."),
          image: journalStory,
        },
      teaNotes: (() => {
        const names = gift.choices ? gift.choices.flatMap(c => c.contents.map(x => x.name)) : gift.contents.map(c => c.name);
        const keys = [...new Set(names.map(teaNoteKey))];
        const items = keys.map(k => { const n = teaNotes[k]; if (!n) throw new Error(`tea-gifts: no 茶款介紹 for "${k}"`); return { name: v(k), text: lt(n) }; });
        if (names.some(isCompetitionTea)) items.push({ name: t("比賽獲獎茶", "Competition-winning teas"), text: lt(competitionNote) });
        return { title: t("茶款介紹", "About the teas"), items };
      })(),
      ...(gift.slug !== "fruit-infusion-gift-box" ? { brew: { title: t("沖泡方式", "How to brew"), steps: brewSteps(t), image: brewImage(t) } } : {}),
      ...(gift.soldOut ? { soldOut: true } : {}),
      ...(gift.hidden ? { hidden: true } : {}),
      variant: gift.variant ? { group: gift.variant.group, label: v(gift.variant.label) } : undefined,
      officialUrl: `https://www.charmvilla.com.tw/product_d.php?lang=tw&tb=1&id=${gift.officialId}`,
      price,
      giftBox: { pieces: gift.pieces, series: v(gift.series), contents: gift.contents, choices: bagChoices, choiceLabel },
    };
  });
};

export const teaGiftProducts: Product[] = teaGiftProductsFor("zh");
