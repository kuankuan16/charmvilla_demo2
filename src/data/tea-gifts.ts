import officialImages from "./gift-box-images.json";
import officialPrices from "./official-prices.json";
import { gallery, site, type Img } from "./content";
import type { Product } from "./catalog";

// One listing per official gift box; tea choices belong to that box, never a standalone SKU.
// Verified against the live classic, rare and 2026 Mid-Autumn collections on 2026-09-29.
export type TeaContents = { name: string; count: number }[];
export type TeaGift = {
  officialId: number;
  slug: string;
  name: string;
  english: string;
  series: "經典禮盒" | "珍稀禮盒" | "2026 中秋禮盒";
  pieces: number;
  box: string;
  dimensions: string;
  shelfLife?: string;
  contents: TeaContents;
  choices?: { label: string; contents: TeaContents }[];
  scene?: string;          // AI scene from the asset gallery (CV-xxxx) used as the listing image
  journalScene?: number;   // tea-journal photo (people-free) showing this box, used as the listing image
  journalStory?: number;   // tea-journal photo (people-free) for the product page "in everyday life" section
  description: string;
  note?: string;
  variant?: { group: string; label: string };
};

const rose = "台灣玫瑰烏龍茶", honey = "台灣玫瑰蜜香紅茶", ruby = "台灣紅玉紅茶";
const beauty = "台灣東方美人茶", jinxuan = "台灣金萱茶", fruit = "花果茶";
const count = (name: string, count: number) => ({ name, count });
const reunion = [rose, honey, ruby, beauty].map(name => count(name, 3));
const eighteen = [count(rose, 9), ...[ruby, jinxuan, beauty].map(name => count(name, 3))];
const rareChoices = ["頭等獎獲獎玫瑰烏龍茶", "參等獎獲獎東方美人茶"].map(label => ({ label, contents: [count(label, 12)] }));
const wood = "桐木盒、織布盒蓋";
const longBox = "28.6 × 11.7 × 9 cm";
const smallBox = "20.5 × 18.5 × 6.9 cm";
const squareBox = "28 × 19 × 9 cm";
const rareBox = "27.7 × 19.1 × 9.6 cm";

export const teaGifts: TeaGift[] = [
  { officialId: 891, slug: "reunion-paper-gift-box", journalStory: 301, name: "團圓｜繽紛紙盒", english: "REUNION / PAPER BOX", series: "經典禮盒", pieces: 12, box: "織布盒蓋、繽紛紙盒（日本製）", dimensions: longBox, contents: reunion, scene: "CV-0348", description: "經緯紗線交織成盒蓋，繽紛紙盒收攏四款台灣茶。從打開禮盒到金魚入盞，把相聚的時間留給細看與分享。", variant: { group: "reunion-gift-box", label: "繽紛紙盒・12 入" } },
  { officialId: 64, slug: "reunion-paulownia-gift-box", journalStory: 308, name: "團圓｜桐木木盒", english: "REUNION / PAULOWNIA BOX", series: "經典禮盒", pieces: 12, box: wood, dimensions: longBox, contents: reunion, scene: "CV-0350", description: "織布的經緯與桐木的紋理，在一只盒上相接。四款台灣茶各自成形，讓一份茶禮，也成為值得收藏的日常物件。", variant: { group: "reunion-gift-box", label: "桐木木盒・12 入" } },
  { officialId: 954, slug: "year-of-plenty-gift-box", journalStory: 319, name: "年年有魚｜年節禮", english: "YEAR OF PLENTY", series: "經典禮盒", pieces: 18, box: wood, dimensions: squareBox, contents: eighteen, scene: "CV-0356", description: "紅色織面上，魚形與紋樣相互呼應。十八尾小金魚收在桐木盒中，把年節的祝福帶到下一次共飲的茶席。" },
  { officialId: 1053, slug: "blossoming-prosperity-gift-box", journalStory: 329, name: "花開富貴｜年節禮", english: "BLOSSOMING PROSPERITY", series: "經典禮盒", pieces: 18, box: wood, dimensions: squareBox, contents: eighteen, description: "花的姿態留在織布盒蓋上，桐木盒承接十八入茶禮。欣賞盒面的構圖，也在一杯杯茶中，把相聚的日常慢慢展開。" },
  { officialId: 104, slug: "spring-blossoms-gift-box", journalStory: 325, name: "花滿富春", english: "SPRING BLOSSOMS", series: "經典禮盒", pieces: 18, box: wood, dimensions: rareBox, contents: eighteen, description: "金魚游過牡丹花間，花葉與魚形構成盒上的風景。四款茶盛入十八尾手作小金魚，從盒中的陳列走向杯裡的舒展。" },
  { officialId: 692, slug: "kyoto-gift-box", journalScene: 320, journalStory: 309, name: "京都版", english: "KYOTO EDITION", series: "經典禮盒", pieces: 6, box: "紙盒", dimensions: smallBox, contents: [count(honey, 6)], description: "六尾玫瑰蜜香紅茶小金魚，收在京都版紙盒中。從盒面的形，到水中的姿態，邀請收禮的人留一段時間給茶。" },
  { officialId: 970, slug: "heart-gift-box", journalStory: 305, name: "心有愛禮盒", english: "WITH LOVE", series: "經典禮盒", pieces: 2, box: "紙盒", dimensions: "10 × 6.5 × 7.5 cm", contents: [], choices: [rose, honey].map(label => ({ label, contents: [count(label, 2)] })), description: "把心意收進小小的紙盒。每盒兩尾同款小金魚茶包，可選玫瑰烏龍茶或玫瑰蜜香紅茶，為一次相逢留下一杯茶的邀請。" },
  { officialId: 183, slug: "fruit-infusion-gift-box", journalStory: 330, name: "花果茶禮盒", english: "FRUIT INFUSION", series: "經典禮盒", pieces: 9, box: "繽紛紙盒、織布盒蓋", dimensions: longBox, contents: [count(fruit, 9)], description: "九尾花果茶小金魚，在織布與紙盒之間安放。無咖啡因的花果配方，讓飲茶的片刻，多一種果香與花香交錯的選擇。" },
  { officialId: 343, slug: "rose-encounter-gift-box", journalStory: 323, name: "玫好相遇", english: "A ROSE ENCOUNTER", series: "經典禮盒", pieces: 6, box: "紙盒", dimensions: smallBox, contents: [count(rose, 3), count(honey, 3)], description: "同是玫瑰，與不同茶款相遇便有不同表情。三尾玫瑰烏龍茶、三尾玫瑰蜜香紅茶，邀請兩個人從一只禮盒開始共飲。" },
  { officialId: 196, slug: "tea-to-share-gift-box", journalStory: 311, name: "魚你分享｜茶繽紛", english: "TEA TO SHARE", series: "經典禮盒", pieces: 6, box: "紙盒", dimensions: "13 × 11.4 × 11.4 cm", contents: [rose, ruby, jinxuan, beauty, honey, fruit].map(name => count(name, 1)), description: "六款茶，各留一尾。從烏龍、紅茶到花果茶，讓同一只禮盒盛下不同的選擇，也為分享留下話題。" },
  { officialId: 850, slug: "spring-dawn-gift-box", journalStory: 307, scene: "CV-0040", name: "春曉", english: "SPRING DAWN", series: "珍稀禮盒", pieces: 12, box: wood, dimensions: longBox, contents: [], choices: rareChoices, description: "晨光與花鳥留在織面上，手染漸層使每只盒的色澤略有不同。盒內選用十二尾同款獲獎茶，從觀看盒面，走向細品茶湯。", note: "整盒茶款擇一；手染布面漸層依每盒而異。獲獎茶售價與供應依官方商品頁為準。" },
  { officialId: 582, slug: "winter-blossom-gift-box", journalStory: 303, scene: "CV-0041", name: "暮雪", english: "WINTER BLOSSOM", series: "珍稀禮盒", pieces: 12, box: wood, dimensions: longBox, contents: [], choices: rareChoices, description: "暮冬與初春的景色，化為盒面的花鳥構圖。十二尾同款獲獎茶藏在桐木盒中，將季節的觀看，延續到一杯茶的時間。", note: "整盒茶款擇一；獲獎茶售價與供應依官方商品頁為準。" },
  { officialId: 960, slug: "orchid-gift-box", journalStory: 313, name: "蝴蝶蘭", english: "ORCHID", series: "珍稀禮盒", pieces: 18, box: wood, dimensions: rareBox, shelfLife: "2 年", contents: [count("頭等獎獲獎玫瑰烏龍茶", 18)], description: "蘭花的姿態與織布的紋理相伴，盒中收納十八尾頭等獎獲獎玫瑰烏龍茶。讓花的形與茶的香，各自留有被欣賞的空間。", note: "獲獎茶售價與供應依官方商品頁為準。" },
  { officialId: 88, slug: "purple-butterfly-gift-box", journalStory: 315, name: "紫斑蝶", english: "PURPLE BUTTERFLY", series: "珍稀禮盒", pieces: 18, box: wood, dimensions: rareBox, shelfLife: "2 年", contents: [count("貳等獎獲獎東方美人茶", 18)], description: "端紫斑蝶的輪廓留在織布盒蓋上，細看翅面的藍紫與紋樣。十八尾貳等獎獲獎東方美人茶，將這幅風景帶到共飲的日常。", note: "珍稀商品採預訂後製作；預訂方式、供應與售價請洽官方商店。" },
  { officialId: 1072, slug: "small-moon-tea-gift-box", journalStory: 326, name: "小鮮月禮盒｜純茶包", english: "SMALL MOON / TEA", series: "2026 中秋禮盒", pieces: 6, box: "紙盒", dimensions: smallBox, contents: [count(rose, 3), count(honey, 3)], description: "中秋的心意，收在六尾小金魚之間。玫瑰烏龍茶與玫瑰蜜香紅茶各三入，讓相聚從打開禮盒、注入一杯熱水開始。" },
  { officialId: 994, slug: "full-moon-tea-gift-box", journalStory: 301, name: "大盈月禮盒｜純茶包", english: "FULL MOON / TEA", series: "2026 中秋禮盒", pieces: 18, box: wood, dimensions: squareBox, contents: eighteen, scene: "CV-0357", description: "花鳥與枝葉鋪展在織布盒蓋上，桐木盒收藏十八尾小金魚。從盒上的一幅風景，到杯中的一段茶時，讓團聚與欣賞一同發生。", note: "本款為純茶包禮盒，不含茶點與茶具；緞帶顏色隨機出貨。" },
];

const describeContents = (contents: TeaContents) => contents.map(c => `${c.name} ${c.count} 入`).join("、");
export const teaGiftProducts: Product[] = teaGifts.map(gift => {
  const official = { ...officialImages[String(gift.officialId) as keyof typeof officialImages], alt: `${gift.name}・官方禮盒商品圖`, cutout: true } satisfies Img;
  const journalScene = gift.journalScene ? site(`journal-${gift.journalScene}.webp`, `${gift.name}・日常茶時情境（tea journal）`) : undefined;
  const journalStory = gift.journalStory ? site(`journal-${gift.journalStory}.webp`, `${gift.name}・日常茶時情境（tea journal）`) : undefined;
  const image = gift.scene ? gallery(gift.scene, `${gift.name}・禮盒茶席情境`) : journalScene ?? official;
  const contents = gift.choices
    ? gift.choices.map(c => describeContents(c.contents)).join("；或 ")
    : describeContents(gift.contents);
  return {
    slug: gift.slug, category: "tea", name: gift.name, english: gift.english,
    summary: `${gift.pieces} 入／盒 · ${gift.choices ? "單一茶款，整盒擇一" : gift.contents.length > 1 ? "綜合茶款" : "單一茶款"}`,
    description: gift.description, image,
    views: [...(gift.scene || journalScene ? [{ label: "禮盒情境", image }] : []), { label: "官方商品圖", image: official }],
    facts: [
      { label: "系列", value: gift.series },
      { label: "販售單位", value: `1 盒／小金魚茶包 ${gift.pieces} 入` },
      { label: gift.choices ? "茶款選擇（每盒擇一）" : "盒內茶款", value: contents },
      { label: "盒型與材質", value: gift.box },
      { label: "外盒尺寸（長 × 寬 × 高）", value: gift.dimensions },
      { label: "保存期限", value: gift.shelfLife || "1 年" },
      ...(gift.note ? [{ label: "選購說明", value: gift.note }] : []),
    ],
    story: { title: "一盒風景，一席茶時", body: "先看盒面的紋理，再看金魚的摺痕。從指尖的手作到水中的舒展，每一件小物都邀請人放慢觀看的步調。禮盒被打開之後，藝術也隨著共飲的時刻，走進生活。", image: journalStory },
    variant: gift.variant,
    officialUrl: `https://www.charmvilla.com.tw/product_d.php?lang=tw&tb=1&id=${gift.officialId}`,
    price: { amount: (officialPrices.prices as Record<string, number>)[String(gift.officialId)], currency: "TWD" },
    giftBox: { pieces: gift.pieces, series: gift.series, contents: gift.contents, choices: gift.choices },
  };
});
