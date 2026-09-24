// Content layer — every fact below is sourced (gallery asset titles, the current charmvilla site copy,
// verified award pages, or the Show more! invitation). Nothing invented. Images live in /public/media.

export type Img = { src: string; alt: string; w: number; h: number };

import dims from "./images.json";
const size = (src: string, w: number, h: number): [number, number] => { const d = (dims as unknown as Record<string, [number, number]>)[src]; return d ? d : [w, h]; };
export const gallery = (id: string, alt: string, w = 1000, h = 1000): Img => { const src = `/media/gallery/${id}.webp`; const [W, H] = size(src, w, h); return { src, alt, w: W, h: H }; };
export const site = (file: string, alt: string, w = 1000, h = 1000): Img => { const src = `/media/site/${file}`; const [W, H] = size(src, w, h); return { src, alt, w: W, h: H }; };

export const sections = [
  { id: "hero", label: "Top", zh: "首頁" },
  { id: "bags", label: "Leather bag", zh: "真皮包" },
  { id: "jewelry", label: "Jewelry", zh: "金飾" },
  { id: "tea", label: "Tea", zh: "茶包" },
  { id: "teaware", label: "Teaware", zh: "茶器" },
  { id: "visit", label: "Visit", zh: "門市" },
] as const;

export const hero = {
  title: "EVERYDAY LUXURIES",
  subtitle: "把日常的物件，當作展品。",
  exhibitsLabel: "EXHIBITS:",
  exhibits: [
    { label: "LEATHER BAG", zh: "真皮包", href: "#bags" },
    { label: "JEWELRY", zh: "金飾", href: "#jewelry" },
    { label: "TEA", zh: "茶包", href: "#tea" },
    { label: "TEAWARE", zh: "茶器", href: "#teaware" },
  ],
  image: gallery("CV-0422", "白色編織提把皮革包，沙發人物情境", 2048, 2048),
  caption: { name: "CHARM VILLA", role: "TAIPEI · KYOTO" },
};

export const manifesto = {
  index: "1:",
  kicker: "藝廊的第一眼",
  heading: "由藝術家與設計師主導，我們也策展。",
  body: ["首飾、手袋、香氛與器物。", "每一次發表，都是一場小小的展覽。"],
  image: gallery("CV-0426", "白色與藍色編織提把皮革包，紙捲雕塑靜物", 896, 1120),
  tail: "從台北的小工作室游向世界。",
};

export const bags = {
  index: "2:",
  kicker: "真皮包",
  heading: "LEATHER BAG",
  product: "編織提把皮革包",
  facts: ["荔枝紋真皮", "扁平三股編織肩帶", "扁銅棒五金"],
  patent: "發明專利證號 Invention Patent No. TW I728606",
  // E-commerce logic (user, 2026-09-24): one product = one card; the other angles live in the detail view.
  products: [
    {
      id: "white", name: "白色", en: "WHITE",
      views: [
        { label: "正面", en: "FRONT", image: gallery("CV-0398", "編織提把皮革包・白色正面", 1122, 1402) },
        { label: "斜側面", en: "THREE-QUARTER", image: gallery("CV-0400", "編織提把皮革包・白色斜側面", 1122, 1402) },
        { label: "情境", en: "EDITORIAL", image: gallery("CV-0422", "編織提把皮革包・白色，沙發手提情境", 2048, 2048) },
        { label: "靜物", en: "STILL LIFE", image: gallery("CV-0426", "編織提把皮革包・白色與藍色，紙捲雕塑靜物", 896, 1120) },
      ],
    },
    {
      id: "blue", name: "藍色", en: "BLUE",
      views: [
        { label: "正面", en: "FRONT", image: gallery("CV-0419", "編織提把皮革包・藍色正面", 1597, 2000) },
        { label: "斜側面", en: "THREE-QUARTER", image: gallery("CV-0420", "編織提把皮革包・藍色斜側面", 1792, 2240) },
        { label: "情境", en: "EDITORIAL", image: gallery("CV-0423", "編織提把皮革包・藍色，肩背情境", 1792, 2240) },
      ],
    },
    {
      id: "pink", name: "粉紅色", en: "PINK",
      views: [
        { label: "正面", en: "FRONT", image: gallery("CV-0399", "編織提把皮革包・粉紅色正面", 1122, 1402) },
        { label: "斜側面", en: "THREE-QUARTER", image: gallery("CV-0397", "編織提把皮革包・粉紅色斜側面", 1122, 1402) },
        { label: "情境", en: "EDITORIAL", image: gallery("CV-0424", "編織提把皮革包・粉紅色，硬光手提情境", 1792, 2240) },
      ],
    },
  ],
  detail: { hint: "查看細節", viewsLabel: "VIEWS:", close: "CLOSE", closeZh: "關閉" },
  cta: { label: "SHOW MORE! 新品發表", href: "#show-more" },
};

export const jewelry = {
  index: "3:",
  kicker: "金飾",
  heading: "小金魚 金飾",
  headingEn: "GOLDFISH JEWELRY",
  items: [
    { n: "01.", title: "珍珠長鏈小金魚耳環", desc: "珍珠長鏈，金魚自鏈末垂墜。", image: gallery("CV-0377", "珍珠長鏈小金魚耳環", 6144, 7680) },
    { n: "02.", title: "吐鑽小金魚耳環・包鑲", desc: "包鑲單鑽於魚嘴前，側臉輪廓。", image: gallery("CV-0370", "吐鑽小金魚耳環・包鑲", 2560, 3200) },
    { n: "03.", title: "單鑽小金魚耳環", desc: "單鑽，實心拋光平面金。", image: gallery("CV-0373", "單鑽小金魚耳環", 6144, 7680) },
    { n: "04.", title: "雙星小金魚耳環", desc: "兩尾金魚，象牙花影。", image: gallery("CV-0378", "雙星小金魚耳環", 6146, 7680) },
  ],
  craft: {
    label: "CRAFT:",
    heading: "實心拋光平面金",
    points: ["不對稱輪廓", "頭接鍊", "尾自由垂墜"],
  },
};

export const interlude = {
  image: gallery("CV-0380", "珍珠長鏈小金魚耳環，米白衣領、電影光影", 6146, 7680),
};

export const tea = {
  index: "4:",
  kicker: "茶包",
  heading: "小金魚茶包",
  headingEn: "GOLDFISH TEA BAG",
  scrollHint: "SCROLL TO EXPLORE",
  cards: [
    { code: "A", title: "玫瑰與金萱", tea: "金萱", flower: "玫瑰", image: site("kv-rose.webp", "玫瑰與金萱的小金魚茶包", 1200, 1500) },
    { code: "B", title: "荔枝與紅玉", tea: "紅玉", flower: "荔枝", image: site("kv-lychee.webp", "荔枝與紅玉的小金魚茶包", 1200, 1500) },
    { code: "C", title: "蜜香與東方美人", tea: "東方美人", flower: "蜜香", image: site("kv-beauty.webp", "蜜香與東方美人的小金魚茶包", 1200, 1500) },
    { code: "D", title: "桂花與包種", tea: "包種", flower: "桂花", image: site("kv-osmanthus.webp", "桂花與包種的小金魚茶包", 1200, 1500) },
    { code: "E", title: "洛神與焙香烏龍", tea: "焙香烏龍", flower: "洛神", image: site("kv-roselle.webp", "洛神與焙香烏龍的小金魚茶包", 1200, 1500) },
  ],
  craft: "一塊茶袋布，經過裁剪、摺疊、縫製，在職人指尖折出魚鰭與尾巴，再填入台灣山頭的茶葉。",
  honours: ["全球 34 國設計專利", "2014 德國紅點傳達設計獎 Red Dot Winner", "2015 德國 iF 設計大獎 iF Gold Award"],
};

export const teaware = {
  index: "5:",
  kicker: "茶器",
  heading: "茶器與工藝",
  headingEn: "TEAWARE & CRAFT",
  left: { label: "豐盛系列", items: ["下午茶點心架", "點心架與包裝禮盒"], image: gallery("CV-0068", "豐盛系列・下午茶點心架", 1951, 1053) },
  right: { label: "木質餐具", items: ["木質杯墊與茶匙", "鳥形筷架", "銀杏茶匙禮盒", "木筷"], image: gallery("CV-0239", "鳥形筷架・木炭與餐具", 4644, 3096) },
};

export const shown = {
  index: "6:",
  heading: "SHOWN AT:",
  label: "STOCKISTS & PRESS:",
  years: "2014–2026",
  places: [
    { name: "台北晶華酒店 麗晶精品", sub: "REGENT TAIPEI · B1" },
    { name: "CHARM VILLA 京都", sub: "KYOTO · TERAMACHI" },
    { name: "THE SCHOLART SELECTION", sub: "SAN GABRIEL, CA" },
    { name: "誠品生活南西", sub: "POP-UP · 期間限定茶席" },
    { name: "MONOCLE", sub: "PRESS · 專訪創辦人" },
  ],
  awards: [
    { src: "/brand/awards/reddot-winner-2014.svg", alt: "Red Dot Award 2014 Winner", w: 1200, h: 847 },
    { src: "/brand/awards/if-gold-award-2015.svg", alt: "iF Gold Award 2015", w: 1200, h: 615 },
  ],
  regent: { src: "/brand/regent-taipei.svg", alt: "Regent Taipei", w: 1094, h: 437 },
};

export const showMore = {
  index: "7:",
  heading: "SHOW MORE!",
  sub: "真皮包新品發表會",
  events: [
    { date: "10/3", city: "TAIPEI", venue: "台北晶華酒店 麗晶精品 B1" },
    { date: "10/17", city: "USA", venue: "The Scholart Selection · San Gabriel, CA" },
    { date: "10/31", city: "JAPAN", venue: "CHARM VILLA 京都" },
  ],
  cta: { label: "查看邀請", href: "/media/gallery/CV-0427.webp" },
  invitation: gallery("CV-0427", "Show more! 真皮包新品發表邀請卡（最終版）", 1280, 1963),
};

export const visit = {
  index: "8:",
  heading: "VISIT US:",
  tabs: [
    {
      id: "shops", label: "門市", labelEn: "SHOPS",
      shops: [
        { name: "CHARM VILLA 晶華門市", addr: "台北市中山區中山北路二段39巷3號 B1（麗晶精品）", href: "https://goo.gl/maps/agJHzfM2VE82", image: site("shop-regent.webp", "CHARM VILLA 晶華門市", 1600, 1067) },
        { name: "CHARM VILLA 京都門市", addr: "京都市中京區寺町通二條・山本町442", hours: "週六・週日 11:00–18:00", href: "https://www.google.com/maps/search/?api=1&query=京都市中京区寺町通二条西入る山本町442", image: site("shop-kyoto.jpg", "CHARM VILLA 京都門市", 1600, 1067) },
      ],
    },
    {
      id: "online", label: "線上", labelEn: "ONLINE",
      text: "線上選購小金魚——站內瀏覽商品、加入購物袋與 Shopify 安全結帳。",
      href: "https://charmvilla-rho.vercel.app/collection",
      image: site("shop-online.webp", "線上選購小金魚", 1600, 1067),
    },
  ],
  news: {
    label: "NEWS:",
    items: [
      { date: "8月11日", tag: "禮盒預購", text: "2026 中秋限定禮盒開放預購，燙金魚鱗紙盒限量登場。" },
      { date: "7月28日", tag: "媒體報導", text: "《Monocle》專訪創辦人蘇靜媚：一尾金魚，如何游進世界的茶杯。" },
      { date: "7月2日", tag: "活動快訊", text: "8月15日起，於誠品生活南西展開「杯中金魚」期間限定茶席。" },
    ],
  },
  instagram: "https://www.instagram.com/charmvilla/",
};

export const brand = {
  // Official gold wordmark supplied by the user on 2026-09-24 (transparent PNG, never redrawn; sha256 c8e27c1a…).
  logo: { src: "/brand/charmvilla-logo.png", w: 929, h: 82, ratio: 929 / 82 },
  name: "CHARM VILLA",
};
