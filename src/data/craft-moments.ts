import { site, type Img } from "./content";

// Homepage "以手成形" carousel (2026-10-01): four cards, one per category, each a portrait of the artisan behind it.
// Presentation after recruit.positive.co.jp (Interview): drag carousel, tilted card, side peeks, outlined CTA.
// 2026-10-01 (user): keep only the big headline and the matching craft; the words describe the artisan; no other copy.
export type CraftMoment = {
  id: string;
  craft: string;
  quote: [string, string];
  ctas: { label: string; href: string }[];
  image: Img;
};

export const craftMoments = {
  heading: ["從一雙手，", "到一日的風景。"],
  items: [
    {
      id: "tea",
      craft: "摺紙職人 · 小金魚茶包禮盒",
      quote: ["摺紙的手，", "把一張濾紙摺成會游的形。"],
      ctas: [{ label: "選一盒茶", href: "/collections/tea" }],
      image: site("craft-01-morning-cup.webp", "俯視玻璃杯中泡開的小金魚茶包，木桌上有銀杏葉杯墊（品牌實拍 CV-0023）"),
    },
    {
      id: "leather",
      craft: "製革職人 · 編織提把皮革包",
      quote: ["裁皮的人，", "落刀前先用手讀過整張皮。"],
      ctas: [{ label: "看真皮包", href: "/collections/bags" }],
      image: site("craft-02-leather-ridge.webp", "暗場暖光下的皮件工坊靜物：捲起的米白荔枝紋皮革、攤平的皮面與裁刀、錐子、修邊器、剪刀"),
    },
    {
      id: "jewelry",
      craft: "金工職人 · 小金魚耳環",
      quote: ["金工的人，", "磨到只剩輪廓才肯停手。"],
      ctas: [{ label: "看金飾", href: "/collections/jewelry" }],
      image: site("craft-03-goldsmith-sunlight.webp", "晨光斜射進金工坊的窗：工作檯、工具牆與塵埃光束，職人只在畫面邊緣露出背影"),
    },
    {
      id: "teaware",
      craft: "木作職人 · 銀杏茶匙與杯墊",
      quote: ["做木的人，", "順著木紋把一片葉子鋸出來。"],
      ctas: [{ label: "看茶器與工藝", href: "/collections/teaware" }],
      image: site("craft-04-breakfast-table.webp", "逆光的早餐桌：花形木杯墊上的一杯茶、銀杏茶匙、鳥形筷架與木筷"),
    },
  ] as CraftMoment[],
};
