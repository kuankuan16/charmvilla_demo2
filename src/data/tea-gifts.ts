import officialImages from "./gift-box-images.json";
import officialPrices from "./official-prices.json";
import { gallery, site, type Img } from "./content";
import type { Product } from "./catalog";
import type { Locale } from "../i18n/config";
import { sizeText } from "./measure";

// One listing per official gift box; tea choices belong to that box, never a standalone SKU.
// Verified against the live classic, rare and 2026 Mid-Autumn collections on 2026-09-29.
// Bilingual (2026-10-01): Chinese is the source; `en` holds the English name, description and note of each box.
// Tea, series and box wording is translated through the dictionaries below (glossary: /.translation/glossary.csv).
export type TeaContents = { name: string; count: number }[];
export type TeaGift = {
  officialId: number;
  slug: string;
  name: string;
  english: string;
  series: "經典商品" | "珍稀商品" | "2026 中秋節限定商品";
  pieces: number;
  box: string;
  dimensions: string;
  shelfLife?: string;
  contents: TeaContents;
  /** one tea per box; `price` where that tea costs more than the box's list price (official option list, 2026-10-02) */
  choices?: { label: string; contents: TeaContents; price?: number }[];
  setOf?: number;          // sold as a set of this many boxes (心有愛: NT$810 buys 3 boxes)
  weight: number;          // grams, box included (official product page, 「約 … 公克」)
  ingredients?: { zh: string; en: string };
  scene?: string;          // AI scene from the asset gallery (CV-xxxx) used as the listing image
  journalScene?: number;   // tea-journal photo (people-free) showing this box, used as the listing image
  sceneFile?: string;      // generated listing scene in /media/site (output/tea-gift-listing-scenes-2026-09-30), used when no gallery scene exists
  journalStory?: number;   // tea-journal photo (people-free) for the product page "in everyday life" section
  description: string;
  note?: string;
  /** marked sold out on the official store: the price stays, the bag button is disabled (Sapphire Wings, user 2026-10-06) */
  soldOut?: boolean;
  variant?: { group: string; label: string };
  // summary: the count line on cards and the page (English Copy Review 2026-10-02, verified against Shopify); tea: Shopify's tea
  // names for this box where they differ from the shared dictionary
  en: { name: string; description: string; note?: string; summary?: string; tea?: Record<string, string> };
};

const rose = "台灣玫瑰烏龍茶", honey = "台灣玫瑰蜜香紅茶", ruby = "台灣紅玉紅茶";
const beauty = "台灣東方美人茶", jinxuan = "台灣金萱茶", fruit = "花果茶";
const count = (name: string, count: number) => ({ name, count });
const reunion = [rose, honey, ruby, beauty].map(name => count(name, 3));
const eighteen = [count(rose, 9), ...[ruby, jinxuan, beauty].map(name => count(name, 3))];
const rareChoices = [{ label: "頭等獎獲獎玫瑰烏龍茶" }, { label: "參等獎獲獎東方美人茶", price: 4370 }].map(c => ({ ...c, contents: [count(c.label, 12)] }));
const wood = "桐木盒、織布盒蓋";
const longBox = "28.6 × 11.7 × 9 cm";
const smallBox = "20.5 × 18.5 × 6.9 cm";
const squareBox = "28 × 19 × 9 cm";
const rareBox = "27.7 × 19.1 × 9.6 cm";

// English wording for the shared vocabulary. Every Chinese value used above must have an entry (checked at build).
const english: Record<string, string> = {
  [rose]: "Rose Oolong Tea", [honey]: "Rose & Honey-Scented Black Tea", [ruby]: "Ruby Black Tea",
  [beauty]: "Oriental Beauty Tea", [jinxuan]: "Jin Xuan Tea", [fruit]: "Fruit & Herbal Tea",
  "頭等獎獲獎玫瑰烏龍茶": "First-Prize Rose Oolong Tea", "貳等獎獲獎東方美人茶": "Second-Prize Oriental Beauty Tea", "參等獎獲獎東方美人茶": "Third-Prize Oriental Beauty Tea",
  "經典商品": "Classic Gift Boxes", "珍稀商品": "Rare Gift Boxes", "2026 中秋節限定商品": "2026 Mid-Autumn Gift Boxes",
  [wood]: "Paulownia wood box, woven-fabric lid", "織布盒蓋、繽紛紙盒（日本製）": "Woven-fabric lid, patterned paper box (made in Japan)",
  "紙盒": "Paper box", "繽紛紙盒、織布盒蓋": "Patterned paper box, woven-fabric lid",
  "2 年": "2 years", "1 年": "1 year",
  "繽紛紙盒・12 入": "Paper box · 12 tea bags", "桐木木盒・12 入": "Paulownia box · 12 tea bags",
};
const awardNote = { zh: "獲獎茶售價與供應依官方商品頁為準。", en: "Prices and availability of award-winning teas follow the official product page." };

export const teaGifts: TeaGift[] = [
  { officialId: 891, slug: "reunion-paper-gift-box", journalStory: 301, name: "團圓｜繽紛紙盒", english: "REUNION / PAPER BOX", series: "經典商品", pieces: 12, box: "織布盒蓋、繽紛紙盒（日本製）", dimensions: longBox, weight: 407, contents: reunion, scene: "CV-0348", description: "經緯紗線交織成盒蓋，繽紛紙盒收攏四款台灣茶。從打開禮盒到金魚入盞，把相聚的時間留給細看與分享。", variant: { group: "reunion-gift-box", label: "繽紛紙盒・12 入" },
    en: { name: "Reunion | Paper Box", description: "Warp and weft are woven into the lid, and a patterned paper box gathers four Taiwanese teas. From opening the box to the goldfish entering the cup, the time of a gathering is given to looking closely and to sharing." } },
  { officialId: 64, slug: "reunion-paulownia-gift-box", journalStory: 308, name: "團圓｜桐木木盒", english: "REUNION / PAULOWNIA BOX", series: "經典商品", pieces: 12, box: wood, dimensions: longBox, weight: 407, contents: reunion, sceneFile: "CV-0350-tag2.webp" /* the brand's CV-0350 with the real gold foil tag (2026-10-05) */, description: "織布的經緯與桐木的紋理，在一只盒上相接。四款台灣茶各自成形，讓一份茶禮，也成為值得收藏的日常物件。", variant: { group: "reunion-gift-box", label: "桐木木盒・12 入" },
    en: { name: "Reunion | Paulownia Box", description: "The weave of the fabric and the grain of paulownia meet on a single box. Four Taiwanese teas each take their own form, making a gift of tea an everyday object worth keeping." } },
  { officialId: 954, slug: "year-of-plenty-gift-box", journalStory: 319, name: "年年有魚", english: "ABUNDANCE & PROSPERITY", series: "經典商品", pieces: 18, box: wood, dimensions: squareBox, weight: 400, contents: eighteen, sceneFile: "CV-0356-tag2.webp" /* the brand's CV-0356 with the real gold foil tag (2026-10-05) */, description: "紅色織面上，魚形與紋樣相互呼應。十八尾小金魚收在桐木盒中，把年節的祝福帶到下一次共飲的茶席。",
    en: { name: "Abundance & Prosperity", description: "Eighteen goldfish tea bags: nine Rose Oolong Tea, plus three each of Ruby Black Tea, Jin Xuan Tea and Oriental Beauty Tea.", summary: "18 Goldfish Tea Bags · Four-tea assortment" } },
  { officialId: 1053, slug: "blossoming-prosperity-gift-box", sceneFile: "scene-blossoming-prosperity-gift-box.webp", journalStory: 329, name: "花開富貴", english: "PROSPERITY IN BLOOM", series: "經典商品", pieces: 18, box: wood, dimensions: squareBox, weight: 400, contents: eighteen, description: "花的姿態留在織布盒蓋上，桐木盒承接十八入茶禮。欣賞盒面的構圖，也在一杯杯茶中，把相聚的日常慢慢展開。",
    en: { name: "Prosperity in Bloom", description: "Eighteen goldfish tea bags: nine Rose Oolong Tea, plus three each of Ruby Black Tea, Jin Xuan Tea and Oriental Beauty Tea.", summary: "18 Goldfish Tea Bags · Four-tea assortment" } },
  { officialId: 104, slug: "spring-blossoms-gift-box", sceneFile: "scene-spring-blossoms-gift-box.webp", journalStory: 325, name: "花滿富春", english: "SPRING BLOSSOMS", series: "經典商品", pieces: 18, box: wood, dimensions: rareBox, weight: 400, contents: eighteen, description: "金魚游過牡丹花間，花葉與魚形構成盒上的風景。四款茶盛入十八尾手作小金魚，從盒中的陳列走向杯裡的舒展。",
    en: { name: "Spring Blossoms", description: "Goldfish swim among peonies; blossom, leaf and fish form the scenery on the lid. Four teas fill eighteen handmade goldfish, moving from their arrangement in the box to their unfurling in the cup." } },
  { officialId: 692, slug: "kyoto-gift-box", journalScene: 320, journalStory: 309, name: "京都版", english: "KYOTO ARTISANAL RESERVE", series: "經典商品", pieces: 6, box: "紙盒", dimensions: smallBox, weight: 99, contents: [], choices: [honey, rose, ruby].map(label => ({ label, contents: [count(label, 6)] })), description: "六尾玫瑰蜜香紅茶小金魚，收在京都版紙盒中。從盒面的形，到水中的姿態，邀請收禮的人留一段時間給茶。",
    en: { name: "Kyoto Artisanal Reserve", description: "Six goldfish tea bags in your chosen variety: Rose Oolong Tea, Rose & Honey-Scented Black Tea or Ruby Black Tea.", summary: "6 Goldfish Tea Bags · Choose one tea variety" } },
  { officialId: 970, slug: "heart-gift-box", sceneFile: "scene-heart-gift-box.webp", journalStory: 305, name: "心有愛禮盒", english: "WITH LOVE", series: "經典商品", pieces: 2, setOf: 3, box: "紙盒", dimensions: "10 × 6.5 × 7.5 cm", weight: 20, contents: [], choices: [rose, honey].map(label => ({ label, contents: [count(label, 2)] })), description: "把心意收進小小的紙盒。每盒兩尾同款小金魚茶包，可選玫瑰烏龍茶或玫瑰蜜香紅茶，為一次相逢留下一杯茶的邀請。",
    en: { name: "With Love Gift Box", description: "A gesture kept in a small paper box. Each box holds two goldfish tea bags of the same tea, Rose Oolong Tea or Rose & Honey-Scented Black Tea: an invitation to a cup of tea, left for one encounter." } },
  { officialId: 183, slug: "fruit-infusion-gift-box", sceneFile: "scene-fruit-infusion-gift-box.webp", journalStory: 330, name: "花果茶", english: "FRUIT & HERBAL TEA", series: "經典商品", pieces: 9, box: "繽紛紙盒、織布盒蓋", dimensions: longBox, weight: 340, contents: [count(fruit, 9)], ingredients: { zh: "蘋果、西洋梨、鳳梨、木瓜、蜜桃、芒果、檸檬草、玫瑰果、矢車菊、香料、糖", en: "Apple, pear, pineapple, papaya, peach, mango, lemongrass, rosehip, cornflower, flavoring, sugar" }, description: "九尾花果茶小金魚，在織布與紙盒之間安放。無咖啡因的花果配方，讓飲茶的片刻，多一種果香與花香交錯的選擇。",
    en: { name: "Fruit & Herbal Tea Gift Box", description: "Nine goldfish of Fruit & Herbal Tea rest between woven fabric and paper box. The caffeine-free blend of fruit and flowers adds another choice to the tea moment, where fruit and floral notes cross." } },
  { officialId: 343, slug: "rose-encounter-gift-box", sceneFile: "scene-rose-encounter-gift-box.webp", journalStory: 323, name: "玫好相遇", english: "A ROSE ENCOUNTER", series: "經典商品", pieces: 6, box: "紙盒", dimensions: smallBox, weight: 99, contents: [count(rose, 3), count(honey, 3)], description: "同是玫瑰，與不同茶款相遇便有不同表情。三尾玫瑰烏龍茶、三尾玫瑰蜜香紅茶，邀請兩個人從一只禮盒開始共飲。",
    en: { name: "A Rose Encounter", description: "The same rose takes on a different expression with each tea it meets. Three goldfish of Rose Oolong Tea and three of Rose & Honey-Scented Black Tea invite two people to begin drinking together from a single box." } },
  { officialId: 196, slug: "tea-to-share-gift-box", sceneFile: "scene-tea-to-share-gift-box.webp", journalStory: 311, name: "魚你分享｜茶繽紛", english: "TEA TO SHARE", series: "經典商品", pieces: 6, box: "紙盒", dimensions: "13 × 11.4 × 11.4 cm", weight: 100, contents: [rose, ruby, jinxuan, beauty, honey, fruit].map(name => count(name, 1)), description: "六款茶，各留一尾。從烏龍、紅茶到花果茶，讓同一只禮盒盛下不同的選擇，也為分享留下話題。",
    en: { name: "Tea to Share | Assorted Teas", description: "Six teas, one goldfish of each. From oolong and black tea to fruit and herbal tea, one box holds different choices and leaves something to talk about when it is shared." } },
  { officialId: 850, slug: "spring-dawn-gift-box", journalStory: 307, name: "春曉", english: "SPRING AWAKENING", series: "珍稀商品", pieces: 12, box: wood, dimensions: longBox, weight: 350, contents: [], choices: rareChoices, description: "晨光與花鳥留在織面上，手染漸層使每只盒的色澤略有不同。盒內選用十二尾同款獲獎茶，從觀看盒面，走向細品茶湯。", note: `整盒茶款擇一；手染布面漸層依每盒而異。${awardNote.zh}`,
    en: { name: "Spring Awakening (Blue)", description: "Twelve goldfish tea bags of First-Prize Rose Oolong Tea or Third-Prize Oriental Beauty Tea. Each box features hand-dyed fabric with a unique color gradient; product images are for illustrative purposes only.", note: `One tea per box. The hand-dyed gradient varies from box to box. ${awardNote.en}`, summary: "12 Goldfish Tea Bags · First-Prize Rose Oolong Tea or Third-Prize Oriental Beauty Tea" } },
  { officialId: 582, slug: "winter-blossom-gift-box", journalStory: 303, name: "暮雪", english: "SNOWY TWILIGHT", series: "珍稀商品", pieces: 12, box: wood, dimensions: longBox, weight: 350, contents: [], choices: rareChoices, description: "暮冬與初春的景色，化為盒面的花鳥構圖。十二尾同款獲獎茶藏在桐木盒中，將季節的觀看，延續到一杯茶的時間。", note: `整盒茶款擇一；${awardNote.zh}`,
    en: { name: "Snowy Twilight", description: "Twelve goldfish tea bags of First-Prize Rose Oolong Tea or Third-Prize Oriental Beauty Tea. Each box features hand-dyed fabric with a unique color gradient; product images are for illustrative purposes only.", note: `One tea per box. ${awardNote.en}`, summary: "12 Goldfish Tea Bags · First-Prize Rose Oolong Tea or Third-Prize Oriental Beauty Tea" } },
  { officialId: 960, slug: "orchid-gift-box", sceneFile: "scene-orchid-gift-box.webp", name: "蝴蝶蘭", english: "ROYAL ORCHID", series: "珍稀商品", pieces: 18, box: wood, dimensions: rareBox, weight: 400, shelfLife: "2 年", contents: [], choices: [{ label: "頭等獎獲獎玫瑰烏龍茶" }, { label: "參等獎獲獎東方美人茶", price: 5200 }].map(c => ({ ...c, contents: [count(c.label, 18)] })), description: "蘭花的姿態與織布的紋理相伴，盒中收納十八尾頭等獎獲獎玫瑰烏龍茶。讓花的形與茶的香，各自留有被欣賞的空間。", note: awardNote.zh,
    en: { name: "Royal Orchid (Gold)", description: "Eighteen goldfish tea bags of First-Prize Rose Oolong Tea or Third-Prize Oriental Beauty Tea.", note: awardNote.en, summary: "18 Goldfish Tea Bags · First-Prize Rose Oolong Tea or Third-Prize Oriental Beauty Tea" } },
  { officialId: 88, slug: "purple-butterfly-gift-box", sceneFile: "scene-purple-butterfly-gift-box.webp", name: "紫斑蝶｜貳等獎獲獎東方美人茶", english: "SAPPHIRE WINGS", series: "珍稀商品", pieces: 18, box: wood, dimensions: rareBox, weight: 400, shelfLife: "2 年", contents: [count("貳等獎獲獎東方美人茶", 18)], description: "把紫斑蝶的輪廓留在織布盒蓋上，細看翅面的藍紫與紋樣。十八尾貳等獎獲獎東方美人茶，將這幅風景帶到共飲的日常。", note: "暫時售罄。售價浮動，依每次茶葉競賽（一年兩次）的公定價格調整。", soldOut: true,
    en: { name: "Sapphire Wings", description: "Eighteen goldfish tea bags of Second-Prize Oriental Beauty Tea.", note: "Sold out for now. The price follows the official price of each tea competition (held twice a year).", summary: "18 Goldfish Tea Bags · Second-Prize Oriental Beauty Tea" } },
  { officialId: 1072, slug: "small-moon-tea-gift-box", sceneFile: "scene-small-moon-tea-gift-box.webp", name: "小鮮月禮盒｜純茶包", english: "SMALL MOON / TEA", series: "2026 中秋節限定商品", pieces: 6, box: "紙盒", dimensions: smallBox, weight: 99, contents: [count(rose, 3), count(honey, 3)], description: "中秋的心意，收在六尾小金魚之間。玫瑰烏龍茶與玫瑰蜜香紅茶各三入，讓相聚從打開禮盒、注入一杯熱水開始。",
    en: { name: "Small Moon Gift Box | Tea Only", description: "A Mid-Autumn gesture kept among six goldfish: three of Rose Oolong Tea and three of Rose & Honey-Scented Black Tea. The gathering begins with opening the box and pouring a cup of hot water." } },
  { officialId: 994, slug: "full-moon-tea-gift-box", journalStory: 301, name: "大盈月禮盒｜純茶包", english: "FULL MOON / TEA", series: "2026 中秋節限定商品", pieces: 18, box: wood, dimensions: squareBox, weight: 400, contents: eighteen, sceneFile: "CV-0357-tag2.webp" /* the brand's CV-0357 with the real gold foil tag (2026-10-05) */, description: "花鳥與枝葉鋪展在織布盒蓋上，桐木盒收藏十八尾小金魚。從盒上的一幅風景，到杯中的一段茶時，讓團聚與欣賞一同發生。", note: "本款為純茶包禮盒，不含茶點與茶具；緞帶顏色隨機出貨。",
    en: { name: "Full Moon Gift Box | Tea Only", description: "Flowers, birds and branches spread across the woven lid, and a paulownia box keeps eighteen goldfish. From the scenery on the box to the tea time in the cup, reunion and appreciation happen together.", note: "This is a tea-only gift box; sweets and teaware are not included. The ribbon color is chosen at random." } },
];

// How to brew (guide §4, the implemented website sequence, 2026-10-06). English is the guide's wording; the Chinese is a faithful translation.
// Not shown on the fruit & herbal tea box (user 2026-10-06: 「花果茶禮盒先不放」).
const brewSteps = (t: (zh: string, en: string) => string) => [
  { title: t("注入熱水", "Pour the Water"), text: t("將 150 mL（約 5 fl oz）、95°C（203°F）的熱水倒入杯中。建議使用透明玻璃杯，欣賞小金魚的姿態。", "Pour 150 mL (about 5 fl oz) of hot water at 95°C (203°F) into your cup. Use a clear glass cup to enjoy the goldfish's shape.") },
  { title: t("打開包裝", "Open the Package"), text: t("沿著缺口將包裝完整撕開，取出小金魚茶包。", "Tear the package fully open at the notch and lift out the goldfish tea bag.") },
  { title: t("放入小金魚", "Add Your Goldfish"), text: t("將茶包放入水中。可用茶匙或攪拌棒輕輕將茶包壓入水中，再讓它浮起。", "Add the tea bag to the water. Using a teaspoon or stirrer, gently submerge the tea bag, then let it float.") },
  { title: t("浸泡", "Steep"), text: t("浸泡約 5 分鐘，看茶色漸漸加深，小金魚慢慢成形。", "Steep for about 5 minutes as the tea's color deepens and the goldfish takes shape.") },
  { title: t("享用", "Enjoy"), text: t("聞一聞茶香，啜飲一口，為自己留一段時間。", "Enjoy the fragrance, take a sip, and make a little time for yourself.") },
];

// 茶款介紹 under the specifications, as on the official product pages (user 2026-10-07, with the wording for the four main teas);
// 金萱 and 花果茶 are condensed from the official store's descriptions. A competition tea describes its base tea, plus the note on the competitions.
const teaNotes: Record<string, { zh: string; en: string }> = {
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
const competitionNote = { zh: "每年由政府協辦冬夏兩季評鑑比賽，自茶乾與沖泡後的底葉外觀、乾茶與茶湯的香氣，以及茶湯水色，嚴謹評選出各級別的獲獎茶。",
  en: "Each winter and summer, government-supported competitions judge the dry leaf and the brewed leaf, the aroma of the leaf and the liquor, and the color of the liquor, and award each grade with rigor." };

export const teaGiftProductsFor = (lang: Locale): Product[] => {
  const en = lang === "en";
  const t = (zh: string, e: string) => (en ? e : zh);
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
    const journalStory = gift.journalStory ? site(`journal-${gift.journalStory}.webp`, journalAlt) : undefined;
    const generated = gift.sceneFile ? site(gift.sceneFile, sceneAlt) : undefined;
    const image = gift.scene ? gallery(gift.scene, sceneAlt) : generated ?? journalScene ?? official;
    const contents = gift.choices
      ? gift.choices.map(c => describeContents(c.contents)).join(t("；或 ", "; or "))
      : describeContents(gift.contents);
    const mix = gift.choices ? t("單一茶款，整盒擇一", "one tea, chosen per box") : gift.contents.length > 1 ? t("綜合茶款", "assorted teas") : t("單一茶款", "single tea");
    const note = en ? gift.en.note : gift.note;
    return {
      slug: gift.slug, category: "tea", name, english: gift.english,
      summary: (en && gift.en.summary) || t(`${gift.pieces} 入／盒 · ${mix}`, `${gift.pieces} per box · ${mix}`),
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
        { label: t("盒型與材質", "Packaging"), value: v(gift.box) },
        { label: t("外盒尺寸（長 × 寬 × 高）", "Box dimensions (L × W × H)"), value: sizeText(gift.dimensions.replace(" cm", "").split(" × ").map(Number), lang) },
        ...(gift.ingredients ? [{ label: t("成分", "Ingredients"), value: t(gift.ingredients.zh, gift.ingredients.en) }] : []),
        { label: t("重量（含盒）", "Weight (with box)"), value: t(`約 ${gift.weight} 公克${gift.setOf ? "／盒" : ""}`, `About ${gift.weight} g${gift.setOf ? " per box" : ""}`) },
        { label: t("保存期限", "Shelf life"), value: v(gift.shelfLife || "1 年") },
        // official FAQ (www.charmvilla.com.tw/faq.php): the tea bag and the tea testing, true of every box
        { label: t("茶包材質", "Tea bag"), value: t("食品等級不織布，製作過程不使用化學黏劑；茶葉通過 SGS 檢測", "Food-grade non-woven fabric, made without chemical adhesives; the teas are SGS-tested") },
        ...(note ? [{ label: t("選購說明", "Purchase notes"), value: note }] : []),
      ],
      story: {
        title: t("一盒風景，一席茶時", "A box of scenery, a time for tea"),
        body: t("先看盒面的紋理，再看金魚的摺痕。從指尖的手作到水中的舒展，每一件小物都邀請人放慢觀看的步調。禮盒被打開之後，藝術也隨著共飲的時刻，走進生活。",
          "Look first at the texture of the lid, then at the folds of the goldfish. From handwork at the fingertips to the unfurling in water, each small thing invites a slower pace of looking. Once the box is opened, art enters daily life with the time spent drinking tea together."),
        image: journalStory,
      },
      teaNotes: (() => {
        const names = gift.choices ? gift.choices.flatMap(c => c.contents.map(x => x.name)) : gift.contents.map(c => c.name);
        const keys = [...new Set(names.map(teaNoteKey))];
        const items = keys.map(k => { const n = teaNotes[k]; if (!n) throw new Error(`tea-gifts: no 茶款介紹 for "${k}"`); return { name: v(k), text: t(n.zh, n.en) }; });
        if (names.some(n => n.includes("獲獎"))) items.push({ name: t("比賽獲獎茶", "Competition-winning teas"), text: t(competitionNote.zh, competitionNote.en) });
        return { title: t("茶款介紹", "About the teas"), items };
      })(),
      ...(gift.slug !== "fruit-infusion-gift-box" ? { brew: { title: t("沖泡方式", "How to brew"), steps: brewSteps(t) } } : {}),
      ...(gift.soldOut ? { soldOut: true } : {}),
      variant: gift.variant ? { group: gift.variant.group, label: v(gift.variant.label) } : undefined,
      officialUrl: `https://www.charmvilla.com.tw/product_d.php?lang=tw&tb=1&id=${gift.officialId}`,
      price: { amount: (officialPrices.prices as Record<string, number>)[String(gift.officialId)], currency: "TWD" },
      giftBox: { pieces: gift.pieces, series: v(gift.series), contents: gift.contents, choices: gift.choices?.map(c => ({ label: vt(c.label), contents: c.contents, price: c.price })) },
    };
  });
};

export const teaGiftProducts: Product[] = teaGiftProductsFor("zh");
