import { teaGiftProducts, type TeaContents } from "./tea-gifts";
import { christmasGiftProducts } from "./christmas-gifts";
import shopifyMap from "./shopify-map.json";
import studioListing from "./studio-listing.json";
import { bags, jewelry, gallery, site, type Img } from "./content";

// Product facts come from the existing approved content and asset manifest.
// No inferred prices, stock, metal purity, gemstone grades, sizes or tea brewing times.
export const categories = [
  { id: "bags", name: "真皮包", en: "LEATHER BAGS", intro: "從交織的提把看向包身，細紋與線條各有秩序。拿起一只皮革包，也把對材質的欣賞帶進日常。" },
  { id: "jewelry", name: "金飾", en: "GOLDFISH JEWELRY", intro: "金魚的輪廓縮小至耳畔，光澤便有了貼近肌膚的尺度。轉身之間，欣賞金面、珍珠與鑽石各自的表情。" },
  { id: "tea", name: "小金魚茶包禮盒", en: "GOLDFISH TEA GIFTS", intro: "從織布的經緯到桐木的紋理，一盒茶也有值得細看的風景。以禮盒收藏手作的小金魚，依盒型、入數與茶款，選一份走進日常的心意。" },
  { id: "teaware", name: "茶器與工藝", en: "TEAWARE & CRAFT", intro: "餐桌上的陳列，隨每次使用而改變。點心架的高低、茶匙的弧線與木紋，讓日常器物有了值得停留的細節。" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];
export type ProductView = { label: string; image: Img };
export type Product = {
  slug: string; category: CategoryId; name: string; english: string;
  summary: string; description: string; image: Img; views: ProductView[];
  facts: { label: string; value: string }[];
  story: { title: string; body: string; image?: Img };
  variant?: { group: string; label: string };
  officialUrl?: string;
  /** Studio editorial shot for the homepage featured grid (falls back to `image`). */
  featuredImage?: Img;
  /** Local-mode list price (official TWD). In shopify mode the Storefront API price wins. */
  price?: { amount: number; currency: "TWD" };
  /** Shopify handle + variant GID from src/data/shopify-map.json; empty until the store is connected. */
  shopify?: { handle: string; variantId: string };
  giftBox?: { pieces: number; series: string; contents: TeaContents; choices?: { label: string; contents: TeaContents }[] };
};

const bagProducts: Product[] = bags.products.map((p) => ({
  slug: `braided-leather-bag-${p.id}`, category: "bags", name: `${bags.product}・${p.name}`,
  english: `BRAIDED LEATHER BAG / ${p.en}`, summary: "交織的提把，連起手與皮革。",
  description: `${p.name}荔枝紋真皮，搭配扁平三股編織肩帶與扁銅棒五金。提把的編織線條與包身細紋相接，金屬接點則讓柔軟的材質有了清楚的收束。`,
  image: p.views[0].image, views: p.views.map((v) => ({ label: v.label, image: v.image })),
  facts: [{ label: "顏色", value: p.name }, { label: "材質", value: "荔枝紋真皮" }, { label: "肩帶", value: "扁平三股編織" }, { label: "五金", value: "扁銅棒" }, { label: "發明專利", value: "TW I728606" }],
  story: { title: "肩上的一件作品", body: "先看輪廓，再走近。荔枝紋在光線下顯出細微起伏，三股編織沿著提把延伸；當包被提起，原本陳列中的線條，也隨身體的動作進入生活。", image: p.views[2].image },
  variant: { group: "braided-leather-bag", label: p.name },
}));

// 2026-09-30: the charcoal-sketch listings (goldfish-diamond-stud / goldfish-diamond-drop) were the same products as the
// bezel-diamond and single-diamond earrings; they are merged here as extra views and their URLs redirect (next.config.ts).
// 2026-09-30 (later): the brand supplied the real product photography — four series: 珍珠長鏈、鑽石、雙魚、璞金. The earlier
// "bezel diamond at the mouth" listing did not exist as a product; it and "single diamond" merged into 鑽石系列 (redirects in next.config.ts).
// 2026-10-01 (user): 鑽石系列 has two styles — 垂墜 (fish + short chain + claw-set drop) and 耳釘 (stud, no drop). Scene photos are
// sorted by which style they show: drop = CV-0370/0371/0372 + drop sketch; stud = CV-0376/0374/0373 + stud sketch.
const jewelrySlugs = ["pearl-chain-goldfish-earrings", "diamond-goldfish-earrings", "diamond-goldfish-stud-earrings", "twin-goldfish-earrings", "raw-gold-goldfish-earrings"];
const jewelryEnglish = ["PEARL CHAIN", "DIAMOND DROP", "DIAMOND STUD", "TWIN GOLDFISH", "RAW GOLD"];
const jewelryDetails = ["珍珠、長鏈與金魚", "金魚、短鏈與爪鑲垂墜圓鑽", "單尾金魚耳釘、魚口圓鑽、無垂墜", "兩尾金魚以短鏈相連", "單尾小金魚、霧面金屬表面"];
const jewelryExtra: Record<number, Img[]> = {
  0: [gallery("CV-0377", "珍珠長鏈小金魚耳環・石面光影"), gallery("CV-0379", "珍珠長鏈小金魚耳環・橄欖綠花影"), gallery("CV-0380", "珍珠長鏈小金魚耳環・米白衣領")],
  1: [gallery("CV-0372", "小金魚耳環・鑽石系列・垂墜・配戴"), gallery("CV-0370", "小金魚耳環・鑽石系列・垂墜・暗調肖像"), gallery("CV-0371", "小金魚耳環・鑽石系列・垂墜・側臉"), site("goldfish-drop-sketch.webp", "小金魚耳環・鑽石系列・垂墜・炭筆素描配戴圖", 896, 1120)],
  2: [gallery("CV-0374", "小金魚耳環・鑽石系列・耳釘・深綠靜影"), gallery("CV-0373", "小金魚耳環・鑽石系列・耳釘・配戴"), site("goldfish-stud-sketch.webp", "小金魚耳環・鑽石系列・耳釘・炭筆素描配戴圖", 896, 1120)],
  3: [gallery("CV-0378", "小金魚耳環・雙魚系列・配戴")],
};
const jewelryEditorial = [
  { description: "珍珠與長鏈向下延伸，金魚停在鏈末。從耳畔到頸側，細長的線條把觀看的距離拉開，也讓魚形的比例更容易被看見。", title: "垂落的線，游動的形", body: "動作，讓線條有了變化。長鏈隨轉身輕移，珍珠與金魚各自接住光線；靜止時的構圖，到了配戴者身上，又是另一幅畫面。" },
  { description: "一尾小金魚停在耳畔，短鏈之下垂著一顆爪鑲圓鑽。金面與鑽石的明暗不同，隨動作各自接住光，讓魚形與那一點光之間有了距離。", title: "魚身之下的一點光", body: "輪廓之外，還有間距。金魚固定在耳畔，圓鑽隨短鏈輕移；靜與動同時存在，貼近側臉觀看，便能讀出各個細節之間的關係。" },
  { description: "單尾小金魚耳釘，魚口嵌著一顆圓鑽，沒有垂墜。光集中在耳畔的一點，轉頭時魚形與鑽石一起接住光。", title: "耳畔的一點光", body: "貼近看，才看見魚口那顆鑽。輪廓收斂，光也收斂；配戴時像一枚安靜的印記，只在轉身的瞬間亮一下。" },
  { description: "兩尾金魚以短鏈相連：一尾停在耳畔，一尾垂落。觀看一尾的輪廓，也留意另一尾的位置；形與形之間的距離，讓耳畔有了小幅的構圖。", title: "兩尾魚之間", body: "視線可以來回。先看各自的輪廓，再看兩者如何相處，配戴的比例便從這份呼應裡慢慢清楚。" },
  { description: "單尾小金魚，霧面的金屬表面收住反光，只留下輪廓。收斂的尺度，讓魚形的轉折集中在一起，適合從近處細看。", title: "只留下輪廓", body: "少了亮面的反射，形狀便更安靜。魚身與尾鰭的每一處轉折都有被看見的空間，配戴時像一枚貼近耳畔的小印記。" },
];
const jewelryProducts: Product[] = jewelry.items.map((p, i) => ({
  slug: jewelrySlugs[i], category: "jewelry", name: p.title, english: jewelryEnglish[i],
  summary: p.desc, description: jewelryEditorial[i].description,
  image: p.image, views: [{ label: "商品照", image: p.image }, ...(jewelryExtra[i] || []).map((image, j) => ({ label: `情境 ${j + 1}`, image }))],
  facts: [{ label: "系列", value: "小金魚金飾" }, { label: "款式", value: p.title }, { label: "設計細節", value: jewelryDetails[i] }],
  story: { title: jewelryEditorial[i].title, body: jewelryEditorial[i].body, image: jewelryExtra[i]?.[0] },
}));

// Seasonal editions lead the tea listing; the 16 official gift boxes follow.
const teaProducts: Product[] = [...christmasGiftProducts, ...teaGiftProducts];

const tablewareEntries = [
  { slug: "prosperity-dessert-stand", name: "下午茶點心架", en: "DESSERT STAND", series: "豐盛系列", ids: ["CV-0068", "CV-0074", "CV-0081"], summary: "把點心與茶，安放在同一席風景。", detail: "以點心架整理茶席上的高低與層次。從擺放到取用，讓下午茶有自己的節奏。" },
  { slug: "prosperity-stand-gift-box", name: "點心架與包裝禮盒", en: "DESSERT STAND / GIFT BOX", series: "豐盛系列", ids: ["CV-0121", "CV-0068"], summary: "一份關於茶席，也關於相聚的心意。", detail: "從點心架到包裝，完整觀看豐盛系列的贈禮形式。" },
  { slug: "wooden-coaster-teaspoon", name: "木質杯墊與茶匙", en: "COASTER & TEASPOON", series: "木質餐具", ids: ["CV-0232", "CV-0231"], summary: "一杯茶的旁邊，木紋靜靜相伴。", detail: "杯墊與茶匙，把木質的紋理帶到茶杯旁。近看表面，也觀察每一件物件的輪廓。" },
  { slug: "bird-chopstick-rest", name: "鳥形筷架", en: "BIRD CHOPSTICK REST", series: "茶席器物", ids: ["CV-0256", "CV-0248", "CV-0239"], summary: "讓一雙筷子，有一處停歇。", detail: "以鳥的輪廓構成筷架。小小一件，在餐具與桌面之間，留下有形的留白。" },
  { slug: "ginkgo-teaspoon-gift-box", name: "銀杏茶匙禮盒", en: "GINKGO TEASPOON", series: "木質餐具", ids: ["CV-0231", "CV-0234", "CV-0229"], summary: "把一片葉子的形，留在茶席上。", detail: "銀杏的輪廓成為茶匙的造型，木紋則為每一次觀看帶來不同細節。以禮盒呈現，收藏一份茶席心意。" },
  { slug: "wooden-chopsticks", name: "木筷", en: "WOODEN CHOPSTICKS", series: "木質餐具", ids: ["CV-0243", "CV-0245", "CV-0227"], summary: "從一雙木筷，開始日常的一餐。", detail: "沿著修長線條看見木質紋理。與鳥形筷架搭配，在餐桌上形成一組安靜的物件。" },
];
const tablewareStories: Record<string, { title: string; body: string }> = {
  "prosperity-dessert-stand": { title: "餐桌上的高與低", body: "擺放，也是一種構圖。點心有了不同的高度，杯與盤之間便多了可觀看的層次；每次相聚，都能重新安排這一席景致。" },
  "prosperity-stand-gift-box": { title: "從打開禮盒開始", body: "送出一件器物，也邀請對方想像它的位置。點心架從盒中來到桌上，與家中的杯盤相伴，禮物便開始參與下一次相聚。" },
  "wooden-coaster-teaspoon": { title: "茶杯旁的木紋", body: "手先於目光感受材質。放下茶杯、拿起茶匙，這些熟悉的動作，讓表面的紋理與器物的輪廓，一次次回到注意之中。" },
  "bird-chopstick-rest": { title: "餐具之間，一隻鳥", body: "筷子放下時，鳥形的輪廓便與修長的線條相遇。一件小器物改變了桌面的構圖，也讓用餐間的停頓有了可看的細節。" },
  "ginkgo-teaspoon-gift-box": { title: "一片葉子的轉譯", body: "葉形來到茶席。銀杏的輪廓經由茶匙與木質呈現，既可近看造型，也能在取用之間，感受自然形態如何走入生活。" },
  "wooden-chopsticks": { title: "每日使用的線條", body: "一雙筷子，常在手邊。從修長的外形看到木紋，熟悉的餐具也有可細讀之處；與鳥形筷架一同擺放，便形成餐桌上的小幅構圖。" },
};
const teawareProducts: Product[] = tablewareEntries.map((p) => ({
  slug: p.slug, category: "teaware", name: p.name, english: p.en, summary: p.summary, description: p.detail,
  image: gallery(p.ids[0], p.name), views: p.ids.map((id, i) => ({ label: i ? `細節 ${i}` : "商品全貌", image: gallery(id, p.name) })),
  facts: [{ label: "系列", value: p.series }, { label: "品項", value: p.name }, { label: "使用情境", value: p.series === "豐盛系列" ? "下午茶與點心擺放" : "茶席與日常餐桌" }],
  story: { title: tablewareStories[p.slug].title, body: tablewareStories[p.slug].body, image: p.ids[1] ? gallery(p.ids[1], p.name) : undefined },
}));

// Homepage featured grid: studio shots generated 2026-09-30 in the white bag's language (output/featured-editorial-2026-09-30).
const featuredImages: Record<string, Img> = {
  "ginkgo-teaspoon-gift-box": site("featured-ginkgo-teaspoon-gift-box.webp", "銀杏茶匙禮盒・棚拍商品照"),
  "reunion-paulownia-gift-box": site("featured-reunion-paulownia-gift-box.webp", "團圓桐木木盒・棚拍商品照"),
  "bird-chopstick-rest": site("featured-bird-chopstick-rest.webp", "鳥形筷架・棚拍商品照"),
};
const withShopify = (p: Product): Product => { const m = (shopifyMap as Record<string, { handle: string; variantId: string } | string>)[p.slug]; const f = featuredImages[p.slug]; const q = f ? { ...p, featuredImage: f, views: p.views.some((v) => v.image.src === f.src) ? p.views : [...p.views, { label: "棚拍商品照", image: f }] } : p; return typeof m === "object" && (m.handle || m.variantId) ? { ...q, shopify: m } : q; };
// 2026-10-01 (user): listing covers on /collections/* are scene photography again (「這頁的改以情境照當封面」). The warm-grey
// studio renders from scripts/studio-listing.mjs stay as a 「棚拍商品照」 product view. Products whose own image is not a scene
// (bags, earrings, the bird cut-out) take a gallery scene from this map; the rest keep their scene image.
const listingScene: Record<string, string> = {
  "braided-leather-bag-white": "CV-0422", "braided-leather-bag-blue": "CV-0423", "braided-leather-bag-pink": "CV-0424",
  "pearl-chain-goldfish-earrings": "CV-0377", "diamond-goldfish-earrings": "CV-0372", "diamond-goldfish-stud-earrings": "CV-0376", "twin-goldfish-earrings": "CV-0378",
  "bird-chopstick-rest": "CV-0248",
};
// 2026-10-01 (user): the white bag's cover is the over-shoulder ink-green portrait (a site file, not a gallery asset);
// the previous cover CV-0422 follows it as the second product view.
const listingSceneSite: Record<string, Img> = {
  "braided-leather-bag-white": site("scene-white-bag-over-shoulder-ink-green.webp", "編織提把皮革包・白色，肩背回眸情境，墨綠背景"),
};
const withListing = (p: Product): Product => {
  const file = (studioListing as Record<string, string>)[p.slug];
  const studio = file ? site(file, `${p.name}・棚拍商品照`) : undefined;
  const sceneId = listingScene[p.slug];
  const siteScene = listingSceneSite[p.slug];
  const image = siteScene ?? (sceneId ? gallery(sceneId, `${p.name}・情境照`) : (p.category === "jewelry" && studio ? studio : p.image));
  let views = p.views;
  if (!views.some((v) => v.image.src === image.src)) views = [{ label: "情境照", image }, ...views];
  if (siteScene && sceneId) {
    const prev = `/media/gallery/${sceneId}.webp`;
    views = [views[0], ...views.filter((v) => v.image.src === prev), ...views.slice(1).filter((v) => v.image.src !== prev)];
  }
  if (studio && !views.some((v) => v.image.src === studio.src)) views = [...views, { label: "棚拍商品照", image: studio }];
  return { ...p, image, views };
};
export const products: Product[] = [...bagProducts, ...jewelryProducts, ...teaProducts, ...teawareProducts].map(withShopify).map(withListing);
export const isSellable = (p: Product) => Boolean(p.price || p.shopify?.variantId);
export const formatPrice = (amount: number, currency = "TWD") => currency === "TWD" ? `NT$ ${amount.toLocaleString("en-US")}` : new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
export const productHref = (product: Product | string) => `/products/${typeof product === "string" ? product : product.slug}`;
export const categoryHref = (category: string) => `/collections/${category}`;
export const findProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCategory = (id: string) => categories.find((c) => c.id === id);
export const getCategoryProducts = (id: string) => id === "all" ? products : products.filter((p) => p.category === id);
export const bagCatalog = bagProducts;
export const jewelryCatalog = jewelryProducts;
export const teaCatalog = teaProducts;
export const teawareCatalog = teawareProducts;
