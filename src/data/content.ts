// Content layer — every fact below is sourced (gallery asset titles, the current charmvilla site copy,
// verified award pages, or the Show more! invitation). Nothing invented. Images live in /public/media.
//
// Bilingual (2026-10-01): the Chinese copy is the source; each visible string sits next to its English version as
// t("中文", "English"). Glossary, style guide and protected terms: /.translation. Facts (numbers, dates, addresses,
// award names) are identical in both languages.
import type { Locale } from "../i18n/config";

// cutout = product photographed on a transparent ground (official gift-box PNGs, cut-out craft shots).
// Listings show cutouts contained on one shared ground colour and everything else as full-bleed scene photography.
export type Img = { src: string; alt: string; w: number; h: number; cutout?: boolean };
export const imageFit = (img: Img): "contain" | "cover" => (img.cutout ? "contain" : "cover");

import dims from "./images.json";
const size = (src: string, w: number, h: number): [number, number] => { const d = (dims as unknown as Record<string, [number, number]>)[src]; return d ? d : [w, h]; };
const cutoutAssets = new Set(["CV-0227", "CV-0229"]); // transparent-ground craft photos in the gallery set
export const gallery = (id: string, alt: string, w = 1000, h = 1000): Img => { const src = `/media/gallery/${id}.webp`; const [W, H] = size(src, w, h); return { src, alt, w: W, h: H, ...(cutoutAssets.has(id) ? { cutout: true } : {}) }; };
export const site = (file: string, alt: string, w = 1000, h = 1000): Img => { const src = `/media/site/${file}`; const [W, H] = size(src, w, h); return { src, alt, w: W, h: H }; };

// `label` is the English navigation label, `zh` the Chinese one. Chinese pages show both; English pages show `label` only.
export const sections = [
  { id: "hero", label: "Top", zh: "首頁" },
  { id: "bags", label: "Leather bag", zh: "真皮包" },
  { id: "jewelry", label: "Jewelry", zh: "金飾" },
  { id: "tea", label: "Tea", zh: "茶包禮盒" },
  { id: "teaware", label: "Teaware", zh: "茶器" },
  { id: "visit", label: "Visit", zh: "門市" },
] as const;

const buildContent = (lang: Locale) => {
  const t = (zh: string, en: string) => (lang === "en" ? en : zh);

  const hero = {
    title: "EVERYDAY LUXURIES",
    subtitle: t("藝術即生活", "Art as Life"),
    image: gallery("CV-0422", t("白色編織提把皮革包，沙發人物情境", "Braided Leather Bag in white, held by a seated figure on a sofa"), 2048, 2048),
    slides: [
      { id: "male", src: "/media/hero/male-embracing-white-bag-v2-hd.webp", alt: t("黑白照片：男子雙臂環過頭頂，指間提著白色編織提把皮革包", "Black-and-white photograph of a man with both arms folded over his head, the white Braided Leather Bag hanging from his fingers"), w: 2560, h: 1720, label: t("編織提把皮革包", "Braided Leather Bag"), en: "Leather bag", href: "/products/braided-leather-bag-white" },
      { id: "female", src: "/media/hero/dancer-female-selected.webp", alt: t("黑白女舞者高舉手臂，白色編織提把皮革包掛於腕間", "Black-and-white photograph of a female dancer with one arm raised, the white Braided Leather Bag hanging from her wrist"), w: 1690, h: 2294, label: t("編織提把皮革包", "Braided Leather Bag"), en: "Leather bag", href: "/products/braided-leather-bag-white" },
      // black-and-white version of gallery CV-0380 (user 2026-10-01: 「首頁這張改黑白照試試看」; docs/qa/2026-10-01-hero-jewelry-bw/build.mjs)
      { id: "jewelry", src: "/media/hero/pearl-earring-profile-bw.webp", alt: t("黑白照片：側臉光影中的珍珠長鏈小金魚耳環，淺色衣領", "Black-and-white photograph of the Pearl Chain Goldfish Earrings in profile light above a pale collar"), w: 1921, h: 2400, label: t("珍珠長鏈小金魚耳環", "Pearl Chain Goldfish Earrings"), en: "Goldfish jewelry", href: "/products/pearl-chain-goldfish-earrings" },
    ],
  };

  const manifesto = {
    paragraphs: [
      t("藝術即生活", "Art as Life"),
      t("生活，是一座可以親近的藝廊。光落在皮革的細紋，隨轉身掠過耳畔的金色；一件器物被拿起、放下，材質與手的關係，也在這些微小的動作裡變得清楚。",
        "Life is a gallery you can walk up to. Light settles in the grain of leather and, as you turn, passes over the gold at the ear. An object is picked up and set down, and in those small movements the relationship between material and hand comes into focus."),
      t("在 CHARM VILLA，觀看從細節開始。編織的交接、金飾的輪廓、茶袋的一道摺痕，都是理解一件作品的入口。職人反覆琢磨材質與比例，讓手作的心意有了具體的形。作品走出陳列，來到肩上、耳畔與餐桌，藝術便有了日常的尺度。",
        "At CHARM VILLA, looking begins with detail. The crossing of a plait, the outline of a piece of gold, a single fold in a tea bag: each is a way into the work. The artisans return again and again to material and proportion, until the care of the hand takes a definite form. When a piece leaves the display for the shoulder, the ear and the table, art takes on the scale of the everyday."),
    ],
    awards: t("小金魚茶包榮獲 2014 德國紅點傳達設計獎（Red Dot Winner）與 2015 德國 iF 設計大獎（iF DESIGN AWARD）。",
      "The Goldfish Tea Bag received the Red Dot Award: Communication Design 2014 (Red Dot Winner) and the iF DESIGN AWARD 2015, both in Germany."),
    // Not rendered since the image gallery became the craft carousel (2026-10-01); kept for the unused sections.
    images: [
      { ...site("about-02.webp", "指尖摺製小金魚茶包的手作情境", 1361, 1824), label: "手作細節" },
      { ...gallery("CV-0347", "春日花影與玻璃杯中的小金魚茶包", 1344, 752), label: "茶香日常" },
      { ...gallery("CV-0436", "舞者躍起，手持白色編織提把皮革包", 3312, 2480), label: "皮革與身體" },
    ],
  };

  const bags = {
    index: "2:",
    kicker: t("真皮包", "Leather Bags"),
    heading: "LEATHER BAG",
    product: t("編織提把皮革包", "Braided Leather Bag"),
    facts: ["荔枝紋真皮", "扁平三股編織肩帶", "扁銅棒五金"],
    patent: "發明專利證號 Invention Patent No. TW I728606",
    // E-commerce logic (user, 2026-09-24): one product = one card; the other angles live in the detail view.
    products: [
      {
        id: "white", name: t("白色", "White"), en: "WHITE",
        views: [
          { label: t("正面", "Front"), en: "FRONT", image: gallery("CV-0398", t("編織提把皮革包・白色正面", "Braided Leather Bag in white, front view"), 1122, 1402) },
          { label: t("斜側面", "Three-quarter"), en: "THREE-QUARTER", image: gallery("CV-0400", t("編織提把皮革包・白色斜側面", "Braided Leather Bag in white, three-quarter view"), 1122, 1402) },
          { label: t("情境", "In context"), en: "EDITORIAL", image: gallery("CV-0422", t("編織提把皮革包・白色，沙發手提情境", "Braided Leather Bag in white, held by hand on a sofa"), 2048, 2048) },
          { label: t("靜物", "Still life"), en: "STILL LIFE", image: gallery("CV-0426", t("編織提把皮革包・白色與藍色，紙捲雕塑靜物", "Braided Leather Bags in white and blue, a still life with paper-roll sculptures"), 896, 1120) },
        ],
      },
      {
        id: "blue", name: t("藍色", "Blue"), en: "BLUE",
        views: [
          { label: t("正面", "Front"), en: "FRONT", image: gallery("CV-0419", t("編織提把皮革包・藍色正面", "Braided Leather Bag in blue, front view"), 1597, 2000) },
          { label: t("斜側面", "Three-quarter"), en: "THREE-QUARTER", image: gallery("CV-0420", t("編織提把皮革包・藍色斜側面", "Braided Leather Bag in blue, three-quarter view"), 1792, 2240) },
          { label: t("情境", "In context"), en: "EDITORIAL", image: gallery("CV-0423", t("編織提把皮革包・藍色，肩背情境", "Braided Leather Bag in blue, worn on the shoulder"), 1792, 2240) },
        ],
      },
      {
        id: "pink", name: t("粉紅色", "Pink"), en: "PINK",
        views: [
          { label: t("正面", "Front"), en: "FRONT", image: gallery("CV-0399", t("編織提把皮革包・粉紅色正面", "Braided Leather Bag in pink, front view"), 1122, 1402) },
          { label: t("斜側面", "Three-quarter"), en: "THREE-QUARTER", image: gallery("CV-0397", t("編織提把皮革包・粉紅色斜側面", "Braided Leather Bag in pink, three-quarter view"), 1122, 1402) },
          { label: t("情境", "In context"), en: "EDITORIAL", image: gallery("CV-0424", t("編織提把皮革包・粉紅色，硬光手提情境", "Braided Leather Bag in pink, carried by hand in hard light"), 1792, 2240) },
        ],
      },
    ],
    detail: { hint: "查看細節", viewsLabel: "VIEWS:", close: "CLOSE", closeZh: "關閉" },
    cta: { label: "SHOW MORE! 新品發表", href: "#news-show-more" },
  };

  // Unused homepage section (kept for reference); Chinese only.
  const bagCampaign = {
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

  const jewelry = {
    index: "3:",
    kicker: t("金飾", "Goldfish Jewelry"),
    heading: "小金魚 金飾",
    headingEn: "GOLDFISH JEWELRY",
    items: [
      // Real product photography supplied by the brand on 2026-09-30 (output/jewelry-product-photos-2026-09-30): four series.
      { n: "01.", title: t("珍珠長鏈小金魚耳環", "Pearl Chain Goldfish Earrings"), desc: t("沿著珍珠長鏈，一尾金魚垂落在頸側。", "Along a long chain below a pearl, one goldfish falls beside the neck."), image: site("jewelry-pearl-chain.webp", t("珍珠長鏈小金魚耳環・商品照", "Pearl Chain Goldfish Earrings, product photograph"), 1200, 1500) },
      { n: "02.", title: t("小金魚耳環・鑽石系列・垂墜", "Goldfish Earrings · Diamond Series · Drop"), desc: t("魚身之下，一顆爪鑲圓鑽隨短鏈輕垂。", "Beneath the fish, a claw-set round diamond hangs lightly from a short chain."), image: site("jewelry-diamond.webp", t("小金魚耳環・鑽石系列・垂墜・商品照", "Goldfish Earrings, Diamond Series drop, product photograph"), 1200, 1500) },
      // 2026-10-01 (user): the diamond series has two styles — the drop above and a stud without the drop. Split listings; the stud's
      // product shot is the satin close-up until the brand supplies a studio photo of it.
      { n: "02b.", title: t("小金魚耳環・鑽石系列・耳釘", "Goldfish Earrings · Diamond Series · Stud"), desc: t("一尾小金魚停在耳畔，魚口一點圓鑽的光。", "One small goldfish rests at the ear, a point of diamond light at its mouth."), image: gallery("CV-0376", t("小金魚耳環・鑽石系列・耳釘・暖金緞光", "Goldfish Earrings, Diamond Series stud, on warm gold satin"), 1920, 2400) },
      { n: "03.", title: t("小金魚耳環・雙魚系列", "Goldfish Earrings · Twin Series"), desc: t("一尾停在耳畔，一尾隨短鏈垂落。", "One rests at the ear; the other falls on a short chain."), image: site("jewelry-twin.webp", t("小金魚耳環・雙魚系列・商品照", "Goldfish Earrings, Twin Series, product photograph"), 1200, 1500) },
      { n: "04.", title: t("小金魚耳環・璞金系列", "Goldfish Earrings · Raw Gold Series"), desc: t("霧面金屬的一尾小金魚，貼近耳畔。", "A single small goldfish in matte metal, close to the ear."), image: site("jewelry-raw-gold.webp", t("小金魚耳環・璞金系列・商品照", "Goldfish Earrings, Raw Gold Series, product photograph"), 1200, 1500) },
    ],
    craft: {
      label: "CRAFT:",
      heading: "實心拋光平面金",
      points: ["不對稱輪廓", "頭接鍊", "尾自由垂墜"],
    },
  };

  const interlude = {
    image: gallery("CV-0380", "珍珠長鏈小金魚耳環，米白衣領、電影光影", 6146, 7680),
  };

  const tea = {
    index: "4:",
    kicker: t("茶包禮盒", "Tea Gifts"),
    heading: t("小金魚茶包禮盒", "Goldfish Tea Gifts"),
    headingEn: "GOLDFISH TEA GIFTS",
    craft: "形，從一雙手開始。薄透茶袋經過裁剪、摺疊與縫製，魚鰭和尾巴逐漸成形，再填入台灣茶葉。水注入杯中，原本靜止的輪廓隨之舒展，手作也有了另一種觀看方式。",
    honours: [t("全球 34 國設計專利", "Design patents in 34 countries"), "2014 德國紅點傳達設計獎 Red Dot Winner", "2015 德國 iF 設計大獎 iF Gold Award"],
    honoursLabel: t("小金魚茶包", "Goldfish Tea Bag"),
    honoursAria: t("小金魚茶包設計榮譽", "Design honours for the Goldfish Tea Bag"),
    awards: [
      { image: { src: "/brand/awards/if-gold-award-2015.svg", alt: "iF Gold Award 2015", w: 1200, h: 615 }, text: t("2015 德國 iF 設計大獎（iF DESIGN AWARD）", "iF DESIGN AWARD 2015, Germany") },
      { image: { src: "/brand/awards/reddot-winner-2014-transparent.svg", alt: "Red Dot Winner 2014", w: 1200, h: 847 }, text: t("2014 德國紅點傳達設計獎（Red Dot Winner）", "Red Dot Award: Communication Design 2014 (Red Dot Winner), Germany") },
    ],
  };

  // Unused homepage section (kept for reference); Chinese only.
  const teaware = {
    index: "5:",
    kicker: "茶器",
    heading: "茶器與工藝",
    headingEn: "TEAWARE & CRAFT",
    left: { label: "豐盛系列", items: ["下午茶點心架", "點心架與包裝禮盒"], image: gallery("CV-0068", "豐盛系列・下午茶點心架", 1951, 1053) },
    right: { label: "木質餐具", items: ["木質杯墊與茶匙", "鳥形筷架", "銀杏茶匙禮盒", "木筷"], image: gallery("CV-0239", "鳥形筷架・木炭與餐具", 4644, 3096) },
  };

  const shown = {
    index: "6:",
    heading: "SHOWN AT:",
    places: [
      { name: t("台北晶華酒店 麗晶精品", "Regent Galleria, Regent Taipei"), sub: t("REGENT TAIPEI · B1", "TAIPEI · B1") },
      { name: t("CHARM VILLA 京都", "CHARM VILLA Kyoto"), sub: "KYOTO · TERAMACHI" },
      { name: "THE SCHOLART SELECTION", sub: "SAN GABRIEL, CA" },
      // 2026-10-01 (user): 誠品生活南西 pop-up and MONOCLE press rows removed.
    ],
    awards: [
      { src: "/brand/awards/if-gold-award-2015.svg", alt: "iF Gold Award 2015", w: 1200, h: 615 },
      { src: "/brand/awards/reddot-winner-2014-transparent.svg", alt: "Red Dot Award 2014 Winner", w: 1200, h: 847 },
    ],
    // 2026-10-01 (user): transparent version — the official dark wordmark on the page ground, no black tile.
    regent: { src: "/brand/regent-taipei-dark.svg", alt: "Regent Taipei", w: 1094, h: 437 },
  };

  // Partners screen (user, 2026-09-24: one screen in the LAXER "PARTNERS:" layout). Venues = the three
  // Show more! launch hosts / stockists already listed above; contact goes to the brand Instagram.
  const partners = {
    label: "PARTNERS:",
    // 2026-10-01 (user): the male dancer replaces the blue-bag portrait here; the frame ends a little below the elbow (user: 「再露出多一點點的褲子」), short of the hem, so the shorts do not read as boxer shorts.
    image: site("partners-male-dancer-c.webp", t("黑白男舞者側身俯首，一手提著白色編織提把皮革包", "Black-and-white photograph of a male dancer bowing in profile, the white Braided Leather Bag hanging from one hand"), 1869, 1952),
    statement: t("作品與人的相遇，需要一處空間。從台北晶華酒店麗晶精品、The Scholart Selection，到京都寺町，CHARM VILLA 與夥伴一同呈現作品，讓遠近的觀看，回到材質與細節。",
      "For a piece to meet a person, it needs a place. From Regent Galleria at Regent Taipei and The Scholart Selection to Teramachi in Kyoto, CHARM VILLA presents its work together with its partners, so that looking, from near or far, comes back to material and detail."),
    cta: { label: "WORK WITH US", zh: t("合作洽詢", ""), href: "https://www.instagram.com/charmvilla/" },
  };

  const showMore = {
    index: "7:",
    heading: "SHOW MORE!",
    kicker: t("2026 · 新品發表", "2026 · New launch"),
    sub: t("真皮包新品發表會", "Leather bag launch event"),
    events: [
      { date: t("10/3", "Oct 3"), city: "TAIPEI", venue: t("台北晶華酒店 麗晶精品 B1", "Regent Galleria B1, Regent Taipei") },
      { date: t("10/17", "Oct 17"), city: "USA", venue: "The Scholart Selection · San Gabriel, CA" },
      { date: t("10/31", "Oct 31"), city: "JAPAN", venue: t("CHARM VILLA 京都", "CHARM VILLA Kyoto") },
    ],
    cta: { label: t("查看邀請", "View the invitation"), aria: t("查看 SHOW MORE! 新品發表邀請卡", "View the SHOW MORE! launch invitation"), href: "/media/gallery/CV-0427.webp" },
    invitation: gallery("CV-0427", t("Show more! 真皮包新品發表邀請卡（最終版）", "Show more! invitation to the leather bag launch (final version)"), 1280, 1963),
  };

  // Header cart button (user 2026-09-30: 像電商有購物車的按鈕). This site has no checkout; the button opens the official
  // online store where orders are placed. No prices or stock are shown here.
  const officialStore = { href: "https://www.charmvilla.com.tw/product.php?lang=tw&tb=1", label: t("官方線上商店", "Official online store") };

  const visit = {
    index: "7:",
    heading: "VISIT US:",
    storesHeading: "Our Stores",
    storesSub: t("分店介紹", ""),
    tabs: [
      {
        id: "shops", label: "門市", labelEn: "SHOPS",
        shops: [
          // Store photos + hours: official charmvilla.jp/#indexStore (user, 2026-09-24).
          {
            name: t("CHARM VILLA 晶華門市", "CHARM VILLA Regent Taipei"),
            addr: t("台北市中山區中山北路二段39巷3號 B1（麗晶精品）", "B1, Regent Galleria, No. 3, Ln. 39, Sec. 2, Zhongshan N. Rd., Zhongshan Dist., Taipei"),
            hours: t("10:00–21:00・全年無休", "10:00–21:00 · Open every day"),
            href: "https://goo.gl/maps/agJHzfM2VE82",
            image: site("store-regent.jpg", t("CHARM VILLA 晶華門市（charmvilla.jp）", "CHARM VILLA store at Regent Taipei (charmvilla.jp)"), 640, 384),
            intro: {
              city: "Taipei",
              heading: t("在城市裡，留一段細看的時間", "In the city, time set aside for a closer look"),
              body: t("走進台北晶華門市，讓畫面中的作品來到眼前。從皮革的編織、金飾的輪廓，到茶與器物，沿著材質逐件觀看，感受作品與日常生活的距離。",
                "Step into our store at Regent Taipei and meet in person the pieces you have seen in pictures. From plaited leather and the outlines of gold to tea and objects for the table, look at each one through its material and sense how close the work sits to daily life."),
            },
          },
          {
            name: t("CHARM VILLA 京都門市", "CHARM VILLA Kyoto"),
            addr: t("京都市中京區寺町通二條・山本町442", "442 Yamamoto-cho, Teramachi-dori Nijo, Nakagyo-ku, Kyoto"),
            hours: t("週六・週日 11:00–18:00", "Saturday and Sunday 11:00–18:00"),
            href: "https://goo.gl/maps/WBdsELDfMx52",
            image: site("store-kyoto.jpg", t("CHARM VILLA 京都門市（charmvilla.jp）", "CHARM VILLA store in Kyoto (charmvilla.jp)"), 1000, 600),
            intro: {
              city: "Kyoto",
              heading: t("在寺町，與作品相遇", "In Teramachi, an encounter with the work"),
              body: t("來到京都寺町，將步伐放慢。從一尾小金魚到隨身的物件，近看手作的細節，也想像它們走進自己的茶席、餐桌與日常。",
                "In Teramachi, Kyoto, slow your pace. From a single goldfish to the objects you carry, look closely at what the hand has made, and picture each piece at your own tea table, your dining table, your everyday."),
            },
          },
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
      labelZh: t("最新消息", ""),
      items: [
        { date: t("8月11日", "Aug 11"), tag: t("禮盒預購", "Pre-order"), text: t("2026 中秋限定禮盒開放預購，燙金魚鱗紙盒限量登場。", "Pre-orders open for the 2026 Mid-Autumn limited gift boxes, with a limited paper box in gold-foil fish scales.") },
        { date: t("7月28日", "Jul 28"), tag: t("媒體報導", "Press"), text: t("《Monocle》專訪創辦人蘇靜媚：一尾金魚，如何游進世界的茶杯。", "Monocle interviews founder Su Jingmei: how one goldfish swam into the world's teacups.") },
        { date: t("7月2日", "Jul 2"), tag: t("活動快訊", "Events"), text: t("8月15日起，於誠品生活南西展開「杯中金魚」期間限定茶席。", "From August 15, a limited-time tea table, Goldfish in a Cup, opens at eslite spectrum Nanxi.") },
      ],
    },
    instagram: "https://www.instagram.com/charmvilla/",
  };

  return { hero, manifesto, bags, bagCampaign, jewelry, interlude, tea, teaware, shown, partners, showMore, officialStore, visit };
};

const contents: Partial<Record<Locale, ReturnType<typeof buildContent>>> = {};
/** The site copy in one language (built once per language). */
export const getContent = (lang: Locale) => (contents[lang] ??= buildContent(lang));

// Chinese (source) objects under their original names, for code that is not locale-aware.
export const { hero, manifesto, bags, bagCampaign, jewelry, interlude, tea, teaware, shown, partners, showMore, officialStore, visit } = getContent("zh");

// Social accounts as listed in the footer of https://www.charmvilla.com.tw/product.php?lang=tw&tb=1 (2026-09-30).
export const social = [
  { id: "facebook", label: "Facebook", href: "https://www.facebook.com/CHARMVILLA8/" },
  { id: "twitter", label: "Twitter", href: "https://twitter.com/charmvilla8" },
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/charmvilla/" },
] as const;

export const brand = {
  // Official gold wordmark supplied by the user on 2026-09-24 (transparent PNG, never redrawn; sha256 c8e27c1a…).
  logo: { src: "/brand/charmvilla-logo.png", w: 929, h: 82, ratio: 929 / 82 },
  name: "CHARM VILLA",
};
