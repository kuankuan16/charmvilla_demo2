import { site, type Img } from "./content";

// Homepage "以手成形" carousel (2026-10-01): five lifestyle moments link the four categories through handwork.
// Presentation after recruit.positive.co.jp (Interview): drag carousel, tilted card, side peeks, quote + outlined CTA.
// Copy approved from output/craft-moments-2026-09-30/copy.zh-TW.md; images are artisan hands only (no faces).
export type CraftMoment = {
  id: string;
  en: string;
  name: string;
  quote: [string, string];
  role: string;
  body: string;
  ctas: { label: string; href: string }[];
  image: Img;
};

export const craftMoments = {
  kicker: "MADE BY HAND · 藝匠的五個片刻",
  heading: ["從一雙手，", "到一日的風景。"],
  sub: "五個生活片刻，五種手作的工夫",
  intro: "皮革、金、紙與木，經過同一種耐心。我們把作品放回它們原本要去的地方：清晨的桌面、出門的肩上、耳畔的光、餐桌的木紋、贈與的手裡。沿著一天的片刻觀看，不同的品類彼此相接，每一件手作背後的工夫也一起被看見。",
  items: [
    {
      id: "morning-table", en: "MORNING TABLE", name: "清晨的桌面",
      quote: ["且坐，", "待一盞茶的工夫。"],
      role: "小金魚茶包・銀杏茶匙 ／ 濾紙、棉線、玫瑰與茶葉",
      body: "一張濾紙摺成魚身，打出兩個小孔作眼，棉線從頭部的縫線出發。熱水注入，茶葉與玫瑰在袋裡舒展，木匙輕輕撥開浮起的葉。",
      ctas: [{ label: "選一盒茶", href: "/collections/tea" }, { label: "茶器", href: "/collections/teaware" }],
      image: site("craft-01-morning-cup.webp", "俯視玻璃杯中泡開的小金魚茶包，木桌上有銀杏葉杯墊（品牌實拍 CV-0023）"),
    },
    {
      id: "on-the-shoulder", en: "ON THE SHOULDER", name: "出門的肩上",
      quote: ["三股扁平的皮條，", "編成肩上的線。"],
      role: "編織提把皮革包 ／ 荔枝紋真皮、扁銅棒、麂皮切邊",
      body: "皮條裁成兩指寬，一股壓過一股，切邊露出灰藍的肉面。編到盡頭繞銅棒一圈打結，柔軟的包身便有了可以提起的骨。",
      ctas: [{ label: "看真皮包", href: "/collections/bags" }],
      image: site("craft-02-plaiting-documentary.webp", "職人雙手在工作檯上編三股扁平皮條，後方是白色編織提把皮革包"),
    },
    {
      id: "light-at-the-ear", en: "A LIGHT AT THE EAR", name: "耳畔的光",
      quote: ["磨到只剩輪廓，", "光才停在耳畔。"],
      role: "小金魚耳環 ／ 實心金、珍珠、圓鑽",
      body: "魚形先在紙上，再到金屬上。鋸、銼、磨，去掉多餘的，留下不對稱的一尾。頭接鍊，尾自由垂墜，轉身時各自接住光。",
      ctas: [{ label: "看金飾", href: "/collections/jewelry" }],
      image: site("craft-03-goldsmith-workshop.webp", "金工坊的廣角一景：窗邊工作檯、工具牆，職人只在畫面邊緣露出背影"),
    },
    {
      id: "at-the-table", en: "AT THE TABLE", name: "餐桌的木紋",
      quote: ["一片葉子的形，", "留在餐桌上。"],
      role: "銀杏茶匙・花形杯墊・鳥形筷架 ／ 木、陶、線",
      body: "銀杏的輪廓沿木紋鋸出，砂紙一次比一次細，直到指尖分不出邊緣。杯墊疊起，筷子擱在鳥背上，一席茶便有了自己的秩序。",
      ctas: [{ label: "看茶器與工藝", href: "/collections/teaware" }],
      image: site("craft-04-breakfast-table.webp", "逆光的早餐桌：花形木杯墊上的一杯茶、銀杏茶匙、鳥形筷架與木筷"),
    },
    {
      id: "in-giving", en: "IN GIVING", name: "贈與的手裡",
      quote: ["攜一盒秋光，", "赴一場相逢。"],
      role: "桐木禮盒・織布盒蓋・紗質緞帶 ／ 十八尾小金魚",
      body: "織布繃上桐木盒蓋，繡線走過牡丹與魚；緞帶在手裡打一個鬆鬆的結。禮盒被拿起、遞出，手作的心意在另一雙手裡打開。",
      ctas: [{ label: "選一份禮", href: "/collections/tea" }, { label: "全部作品", href: "/collections/all" }],
      image: site("craft-05-handing-over.webp", "門口交付禮盒的一刻：兩雙手之間的桐木禮盒，盒蓋繡著牡丹與小金魚、繫粉色紗帶"),
    },
  ] as CraftMoment[],
};
