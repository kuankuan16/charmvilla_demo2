// Content layer — every fact below is sourced (gallery asset titles, the current charmvilla site copy,
// verified award pages, or the Show more! invitation). Nothing invented. Images live in /public/media.

// cutout = product photographed on a transparent ground (official gift-box PNGs, cut-out craft shots).
// Listings show cutouts contained on one shared ground colour and everything else as full-bleed scene photography.
export type Img = { src: string; alt: string; w: number; h: number; cutout?: boolean };
export const imageFit = (img: Img): "contain" | "cover" => (img.cutout ? "contain" : "cover");

import dims from "./images.json";
const size = (src: string, w: number, h: number): [number, number] => { const d = (dims as unknown as Record<string, [number, number]>)[src]; return d ? d : [w, h]; };
const cutoutAssets = new Set(["CV-0227", "CV-0229"]); // transparent-ground craft photos in the gallery set
export const gallery = (id: string, alt: string, w = 1000, h = 1000): Img => { const src = `/media/gallery/${id}.webp`; const [W, H] = size(src, w, h); return { src, alt, w: W, h: H, ...(cutoutAssets.has(id) ? { cutout: true } : {}) }; };
export const site = (file: string, alt: string, w = 1000, h = 1000): Img => { const src = `/media/site/${file}`; const [W, H] = size(src, w, h); return { src, alt, w: W, h: H }; };

export const sections = [
  { id: "hero", label: "Top", zh: "首頁" },
  { id: "bags", label: "Leather bag", zh: "真皮包" },
  { id: "jewelry", label: "Jewelry", zh: "金飾" },
  { id: "tea", label: "Tea", zh: "茶包禮盒" },
  { id: "teaware", label: "Teaware", zh: "茶器" },
  { id: "visit", label: "Visit", zh: "門市" },
] as const;

export const hero = {
  title: "EVERYDAY LUXURIES",
  subtitle: "藝術即生活",
  image: gallery("CV-0422", "白色編織提把皮革包，沙發人物情境", 2048, 2048),
  slides: [
    { id: "male", src: "/media/hero/dancer-male.webp", alt: "黑白男舞者，手持白色編織提把皮革包；畫面裁至腰部以上", w: 1844, h: 1896, label: "編織提把皮革包", en: "Leather bag", href: "/products/braided-leather-bag-white" },
    { id: "female", src: "/media/hero/dancer-female-selected.webp", alt: "黑白女舞者高舉手臂，白色編織提把皮革包掛於腕間", w: 1690, h: 2294, label: "編織提把皮革包", en: "Leather bag", href: "/products/braided-leather-bag-white" },
    { id: "jewelry", src: "/media/gallery/CV-0380.webp", alt: "側臉光影中的珍珠長鏈小金魚耳環，米白色衣領", w: 6146, h: 7680, label: "珍珠長鏈小金魚耳環", en: "Goldfish jewelry", href: "/products/pearl-chain-goldfish-earrings" },
  ],
};

export const manifesto = {
  paragraphs: [
    "藝術即生活",
    "生活，是一座可以親近的藝廊。光落在皮革的細紋，隨轉身掠過耳畔的金色；一件器物被拿起、放下，材質與手的關係，也在這些微小的動作裡變得清楚。",
    "在 CHARM VILLA，觀看從細節開始。編織的交接、金飾的輪廓、茶袋的一道摺痕，都是理解一件作品的入口。職人反覆琢磨材質與比例，讓手作的心意有了具體的形。作品走出陳列，來到肩上、耳畔與餐桌，藝術便有了日常的尺度。",
  ],
  awards: "小金魚茶包榮獲 2014 德國紅點傳達設計獎（Red Dot Winner）與 2015 德國 iF 設計大獎（iF DESIGN AWARD）。",
  images: [
    { ...site("about-02.webp", "指尖摺製小金魚茶包的手作情境", 1361, 1824), label: "手作細節" },
    { ...gallery("CV-0347", "春日花影與玻璃杯中的小金魚茶包", 1344, 752), label: "茶香日常" },
    { ...gallery("CV-0436", "舞者躍起，手持白色編織提把皮革包", 3312, 2480), label: "皮革與身體" },
  ],
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
  cta: { label: "SHOW MORE! 新品發表", href: "#news-show-more" },
};

export const bagCampaign = {
  heading: "LEATHER BAG",
  subtitle: "舞者 × 編織提把皮革包",
  images: [
    gallery("CV-0429", "女舞者躍起，高舉白色編織提把皮革包，白紗背景", 880, 1168),
    gallery("CV-0431", "男舞者折身，背後提起白色編織提把皮革包，白紗背景", 880, 1168),
    gallery("CV-0434", "女舞者伸手，以手腕掛起白色編織提把皮革包，黑色背景", 896, 1120),
    gallery("CV-0437", "男舞者立足尖，前伸的手提起白色編織提把皮革包，暖灰棚景", 752, 1344),
    gallery("CV-0436", "男舞者空中橫劈，雙手下方垂掛白色編織提把皮革包，白紗背景", 3312, 2480),
  ],
};

export const jewelry = {
  index: "3:",
  kicker: "金飾",
  heading: "小金魚 金飾",
  headingEn: "GOLDFISH JEWELRY",
  items: [
    { n: "01.", title: "珍珠長鏈小金魚耳環", desc: "沿著珍珠長鏈，一尾金魚垂落在頸側。", image: gallery("CV-0377", "珍珠長鏈小金魚耳環", 6144, 7680) },
    { n: "02.", title: "吐鑽小金魚耳環・包鑲", desc: "魚嘴前的一顆包鑲單鑽，點亮側臉的輪廓。", image: gallery("CV-0370", "吐鑽小金魚耳環・包鑲", 2560, 3200) },
    { n: "03.", title: "單鑽小金魚耳環", desc: "單鑽與拋光金面，在耳畔映出不同的光。", image: gallery("CV-0373", "單鑽小金魚耳環", 6144, 7680) },
    { n: "04.", title: "雙星小金魚耳環", desc: "兩尾金魚相伴，細看輪廓之間的呼應。", image: gallery("CV-0378", "雙星小金魚耳環", 6146, 7680) },
    { n: "05.", title: "小金魚鑽石耳釘", desc: "金色魚形與一顆圓鑽，貼近耳畔。", image: site("goldfish-stud-sketch.webp", "小金魚鑽石耳釘，素描配戴圖", 896, 1120) },
    { n: "06.", title: "小金魚垂鑽耳環", desc: "金魚下方，一顆圓鑽隨短鏈垂墜。", image: site("goldfish-drop-sketch.webp", "小金魚垂鑽耳環，素描配戴圖", 896, 1120) },
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
  kicker: "茶包禮盒",
  heading: "小金魚茶包禮盒",
  headingEn: "GOLDFISH TEA GIFTS",
  craft: "形，從一雙手開始。薄透茶袋經過裁剪、摺疊與縫製，魚鰭和尾巴逐漸成形，再填入台灣茶葉。水注入杯中，原本靜止的輪廓隨之舒展，手作也有了另一種觀看方式。",
  honours: ["全球 34 國設計專利", "2014 德國紅點傳達設計獎 Red Dot Winner", "2015 德國 iF 設計大獎 iF Gold Award"],
  awards: [
    { image: { src: "/brand/awards/if-gold-award-2015.svg", alt: "iF Gold Award 2015", w: 1200, h: 615 }, text: "2015 德國 iF 設計大獎（iF DESIGN AWARD）" },
    { image: { src: "/brand/awards/reddot-winner-2014-transparent.svg", alt: "Red Dot Winner 2014", w: 1200, h: 847 }, text: "2014 德國紅點傳達設計獎（Red Dot Winner）" },
  ],
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
    { src: "/brand/awards/if-gold-award-2015.svg", alt: "iF Gold Award 2015", w: 1200, h: 615 },
    { src: "/brand/awards/reddot-winner-2014-transparent.svg", alt: "Red Dot Award 2014 Winner", w: 1200, h: 847 },
  ],
  regent: { src: "/brand/regent-taipei.svg", alt: "Regent Taipei", w: 1094, h: 437 },
};

// Partners screen (user, 2026-09-24: one screen in the LAXER "PARTNERS:" layout). Venues = the three
// Show more! launch hosts / stockists already listed above; contact goes to the brand Instagram.
export const partners = {
  label: "PARTNERS:",
  image: gallery("CV-0423", "編織提把皮革包・藍色，肩背情境", 1792, 2240),
  statement: "作品與人的相遇，需要一處空間。從台北晶華酒店麗晶精品、The Scholart Selection，到京都寺町，CHARM VILLA 與夥伴一同呈現作品，讓遠近的觀看，回到材質與細節。",
  statementEn: "REGENT TAIPEI · THE SCHOLART SELECTION · CHARM VILLA KYOTO",
  cta: { label: "WORK WITH US", zh: "合作洽詢", href: "https://www.instagram.com/charmvilla/" },
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

// Header cart button (user 2026-09-30: 像電商有購物車的按鈕). This site has no checkout; the button opens the official
// online store where orders are placed. No prices or stock are shown here.
export const cart = { href: "https://www.charmvilla.com.tw/product.php?lang=tw&tb=1", label: "前往官方線上商店選購" };

// Social accounts as listed in the footer of https://www.charmvilla.com.tw/product.php?lang=tw&tb=1 (2026-09-30).
export const social = [
  { id: "facebook", label: "Facebook", href: "https://www.facebook.com/CHARMVILLA8/" },
  { id: "twitter", label: "Twitter", href: "https://twitter.com/charmvilla8" },
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/charmvilla/" },
] as const;

export const visit = {
  index: "7:",
  heading: "VISIT US:",
  tabs: [
    {
      id: "shops", label: "門市", labelEn: "SHOPS",
      shops: [
        // Store photos + hours: official charmvilla.jp/#indexStore (user, 2026-09-24).
        { name: "CHARM VILLA 晶華門市", addr: "台北市中山區中山北路二段39巷3號 B1（麗晶精品）", hours: "10:00–21:00・全年無休", href: "https://goo.gl/maps/agJHzfM2VE82", image: site("store-regent.jpg", "CHARM VILLA 晶華門市（charmvilla.jp）", 640, 384) },
        { name: "CHARM VILLA 京都門市", addr: "京都市中京區寺町通二條・山本町442", hours: "週六・週日 11:00–18:00", href: "https://goo.gl/maps/WBdsELDfMx52", image: site("store-kyoto.jpg", "CHARM VILLA 京都門市（charmvilla.jp）", 1000, 600) },
      ],
    },
    {
      id: "online", label: "線上", labelEn: "ONLINE",
      text: "在線上，延續觀看。瀏覽小金魚茶包與禮盒，為自己的茶席，或下一次相聚，挑選一份心意。",
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
