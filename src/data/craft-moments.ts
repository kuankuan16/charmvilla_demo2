import { site, type Img } from "./content";

// Homepage "以手成形" carousel (2026-10-01): four lifestyle moments, one per category (tea gift boxes, bags, jewelry, teaware).
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
  kicker: "MADE BY HAND · 藝匠的四個片刻",
  heading: ["從一雙手，", "到一日的風景。"],
  sub: "四個生活片刻，四種手作的工夫",
  intro: "皮革、金、紙與木，經過同一種耐心。我們把作品放回它們原本要去的地方：清晨的桌面、出門的肩上、耳畔的光、餐桌的木紋。沿著一天的片刻觀看，不同的品類彼此相接，每一件手作背後的工夫也一起被看見。",
  items: [
    {
      id: "morning-table", en: "MORNING TABLE", name: "清晨的桌面",
      quote: ["且坐，", "待一盞茶的工夫。"],
      role: "小金魚茶包禮盒 ／ 濾紙、棉線、玫瑰與茶葉、桐木盒",
      body: "一張濾紙摺成魚身，打出兩個小孔作眼，棉線從頭部的縫線出發。十八尾收進桐木禮盒；熱水注入，茶葉與玫瑰在袋裡舒展，一盞茶便開始了一天。",
      ctas: [{ label: "選一盒茶", href: "/collections/tea" }],
      image: site("craft-01-morning-cup.webp", "俯視玻璃杯中泡開的小金魚茶包，木桌上有銀杏葉杯墊（品牌實拍 CV-0023）"),
    },
    {
      id: "on-the-shoulder", en: "ON THE SHOULDER", name: "出門的肩上",
      quote: ["裁刀落下之前，", "先用手讀過整張皮。"],
      role: "編織提把皮革包 ／ 整張荔枝紋真皮、裁刀與鋼尺、扁銅棒",
      body: "整張皮攤在檯上，先看紋理的走向，再沿鋼尺落刀。切口露出淺色的肉面，一條條裁成兩指寬，之後才有肩上那段編織。",
      ctas: [{ label: "看真皮包", href: "/collections/bags" }],
      image: site("craft-02-leather-cutting.webp", "職人雙手沿鋼尺以裁刀從整張米白荔枝紋皮革裁下皮條，桌上有藍、粉皮捲與工具"),
    },
    {
      id: "light-at-the-ear", en: "A LIGHT AT THE EAR", name: "耳畔的光",
      quote: ["磨到只剩輪廓，", "光才停在耳畔。"],
      role: "小金魚耳環 ／ 實心金、珍珠、圓鑽",
      body: "魚形先在紙上，再到金屬上。鋸、銼、磨，去掉多餘的，留下不對稱的一尾。頭接鍊，尾自由垂墜，轉身時各自接住光。",
      ctas: [{ label: "看金飾", href: "/collections/jewelry" }],
      image: site("craft-03-goldsmith-sunlight.webp", "晨光斜射進金工坊的窗：工作檯、工具牆與塵埃光束，職人只在畫面邊緣露出背影"),
    },
    {
      id: "at-the-table", en: "AT THE TABLE", name: "餐桌的木紋",
      quote: ["一片葉子的形，", "留在餐桌上。"],
      role: "銀杏茶匙・花形杯墊・鳥形筷架 ／ 木、陶、線",
      body: "銀杏的輪廓沿木紋鋸出，砂紙一次比一次細，直到指尖分不出邊緣。杯墊疊起，筷子擱在鳥背上，一席茶便有了自己的秩序。",
      ctas: [{ label: "看茶器與工藝", href: "/collections/teaware" }],
      image: site("craft-04-breakfast-table.webp", "逆光的早餐桌：花形木杯墊上的一杯茶、銀杏茶匙、鳥形筷架與木筷"),
    },
  ] as CraftMoment[],
};
