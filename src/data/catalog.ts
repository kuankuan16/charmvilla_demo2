import { bags, jewelry, tea, gallery, type Img } from "./content";

// Product facts come from the existing approved content and asset manifest.
// No inferred prices, stock, metal purity, gemstone grades, sizes or tea brewing times.
export const categories = [
  { id: "bags", name: "真皮包", en: "LEATHER BAGS", intro: "從荔枝紋真皮到編織提把，讓材質與線條回到日常。" },
  { id: "jewelry", name: "金飾", en: "GOLDFISH JEWELRY", intro: "一尾小金魚，停在耳畔。隨著光線與動作，讀出不同的輪廓。" },
  { id: "tea", name: "小金魚茶包", en: "GOLDFISH TEA", intro: "一尾手工小金魚，盛入台灣茶葉。讓一盞茶的時間，成為日常的小風景。" },
  { id: "teaware", name: "茶器與工藝", en: "TEAWARE & CRAFT", intro: "從點心架到木質餐具，在一席茶之間，安放日常所用的物件。" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];
export type ProductView = { label: string; image: Img };
export type Product = {
  slug: string; category: CategoryId; name: string; english: string;
  summary: string; description: string; image: Img; views: ProductView[];
  facts: { label: string; value: string }[];
  story: { title: string; body: string; image?: Img };
  variant?: { group: string; label: string };
};

const bagProducts: Product[] = bags.products.map((p) => ({
  slug: `braided-leather-bag-${p.id}`, category: "bags", name: `${bags.product}・${p.name}`,
  english: `BRAIDED LEATHER BAG / ${p.en}`, summary: "在編織與皮革之間，留下一道俐落的線。",
  description: `${p.name}荔枝紋真皮，搭配扁平三股編織肩帶與扁銅棒五金。由包身、提把到接點，從不同角度看見材質與結構。`,
  image: p.views[0].image, views: p.views.map((v) => ({ label: v.label, image: v.image })),
  facts: [{ label: "顏色", value: p.name }, { label: "材質", value: "荔枝紋真皮" }, { label: "肩帶", value: "扁平三股編織" }, { label: "五金", value: "扁銅棒" }, { label: "發明專利", value: "TW I728606" }],
  story: { title: "把細節，帶進日常。", body: "皮革的細紋，與提把的交織線條相互呼應。從正面到斜側面，觀看包身輪廓，也看見提把與五金如何相接。", image: p.views[2].image },
  variant: { group: "braided-leather-bag", label: p.name },
}));

const jewelrySlugs = ["pearl-chain-goldfish-earrings", "bezel-diamond-goldfish-earrings", "single-diamond-goldfish-earrings", "twin-goldfish-earrings", "goldfish-diamond-stud", "goldfish-diamond-drop"];
const jewelryEnglish = ["PEARL CHAIN", "BEZEL DIAMOND", "SINGLE DIAMOND", "TWIN GOLDFISH", "DIAMOND STUD", "DIAMOND DROP"];
const jewelryDetails = ["珍珠、長鏈與金魚", "魚嘴前的包鑲單鑽", "單鑽與金魚輪廓", "兩尾金魚", "耳畔的金魚與圓鑽", "金魚、短鏈與垂墜圓鑽"];
const jewelryExtra: Record<number, Img[]> = {
  0: [gallery("CV-0379", "珍珠長鏈小金魚耳環・橄欖綠花影"), gallery("CV-0380", "珍珠長鏈小金魚耳環・米白衣領")],
  1: [gallery("CV-0371", "吐鑽小金魚耳環・包鑲・紅棕側臉"), gallery("CV-0372", "吐鑽小金魚耳環・包鑲・珍珠灰柔光")],
  2: [gallery("CV-0374", "單鑽小金魚耳環・深綠靜影"), gallery("CV-0376", "單鑽小金魚耳環・暖金緞光")],
};
const jewelryProducts: Product[] = jewelry.items.map((p, i) => ({
  slug: jewelrySlugs[i], category: "jewelry", name: p.title, english: jewelryEnglish[i],
  summary: p.desc, description: `${p.desc}從側臉的配戴視角，觀看${jewelryDetails[i]}；輪廓、光澤與垂墜的位置，構成耳畔的一處細節。`,
  image: p.image, views: [{ label: "配戴視角", image: p.image }, ...(jewelryExtra[i] || []).map((image, j) => ({ label: `情境 ${j + 1}`, image }))],
  facts: [{ label: "系列", value: "小金魚金飾" }, { label: "款式", value: p.title }, { label: "設計細節", value: jewelryDetails[i] }],
  story: { title: "耳畔，一尾小金魚。", body: `${jewelryDetails[i]}，在肌膚與光線之間留下清楚的形。近看輪廓，退一步看配戴的比例，讓小物件成為造型的一部分。`, image: jewelryExtra[i]?.[0] },
}));

const teaSlugs = ["rose-jinxuan", "lychee-ruby", "honey-oriental-beauty", "osmanthus-baozhong", "roselle-roasted-oolong"];
const teaEnglish = ["ROSE / JINXUAN", "LYCHEE / RUBY BLACK TEA", "HONEY / ORIENTAL BEAUTY", "OSMANTHUS / BAOZHONG", "ROSELLE / ROASTED OOLONG"];
const teaProducts: Product[] = tea.cards.map((p, i) => ({
  slug: `goldfish-tea-${teaSlugs[i]}`, category: "tea", name: p.title, english: teaEnglish[i],
  summary: `${p.tea}為茶底，${p.flower}作風味。一尾小金魚，一盞茶。`,
  description: `${p.title}，是小金魚茶包的五款風味之一。${tea.craft}`,
  image: p.image, views: [{ label: "茶包細節", image: p.image }],
  facts: [{ label: "系列", value: "小金魚茶包" }, { label: "茶底", value: p.tea }, { label: "風味", value: p.flower }, { label: "製作", value: "手工裁剪、摺疊、縫製" }, { label: "茶葉", value: "台灣茶葉" }],
  story: { title: "金魚入盞，茶成一景。", body: "薄透的茶袋，經過裁剪與摺疊，形成魚鰭與尾巴。看茶葉在水中舒展，也把喝茶的片刻，留給自己。" },
  variant: { group: "goldfish-tea", label: p.title },
}));

const tablewareEntries = [
  { slug: "prosperity-dessert-stand", name: "下午茶點心架", en: "DESSERT STAND", series: "豐盛系列", ids: ["CV-0068", "CV-0074", "CV-0081"], summary: "把點心與茶，安放在同一席風景。", detail: "以點心架整理茶席上的高低與層次。從擺放到取用，讓下午茶有自己的節奏。" },
  { slug: "prosperity-stand-gift-box", name: "點心架與包裝禮盒", en: "DESSERT STAND / GIFT BOX", series: "豐盛系列", ids: ["CV-0121", "CV-0068"], summary: "一份關於茶席，也關於相聚的心意。", detail: "從點心架到包裝，完整觀看豐盛系列的贈禮形式。" },
  { slug: "wooden-coaster-teaspoon", name: "木質杯墊與茶匙", en: "COASTER & TEASPOON", series: "木質餐具", ids: ["CV-0232", "CV-0231"], summary: "一杯茶的旁邊，木紋靜靜相伴。", detail: "杯墊與茶匙，把木質的紋理帶到茶杯旁。近看表面，也觀察每一件物件的輪廓。" },
  { slug: "bird-chopstick-rest", name: "鳥形筷架", en: "BIRD CHOPSTICK REST", series: "茶席器物", ids: ["CV-0256", "CV-0248", "CV-0239"], summary: "讓一雙筷子，有一處停歇。", detail: "以鳥的輪廓構成筷架。小小一件，在餐具與桌面之間，留下有形的留白。" },
  { slug: "ginkgo-teaspoon-gift-box", name: "銀杏茶匙禮盒", en: "GINKGO TEASPOON", series: "木質餐具", ids: ["CV-0229"], summary: "把一片葉子的形，留在茶席上。", detail: "銀杏的輪廓成為茶匙的造型，木紋則為每一次觀看帶來不同細節。以禮盒呈現，收藏一份茶席心意。" },
  { slug: "wooden-chopsticks", name: "木筷", en: "WOODEN CHOPSTICKS", series: "木質餐具", ids: ["CV-0227"], summary: "從一雙木筷，開始日常的一餐。", detail: "沿著修長線條看見木質紋理。與鳥形筷架搭配，在餐桌上形成一組安靜的物件。" },
];
const teawareProducts: Product[] = tablewareEntries.map((p) => ({
  slug: p.slug, category: "teaware", name: p.name, english: p.en, summary: p.summary, description: p.detail,
  image: gallery(p.ids[0], p.name), views: p.ids.map((id, i) => ({ label: i ? `細節 ${i}` : "商品全貌", image: gallery(id, p.name) })),
  facts: [{ label: "系列", value: p.series }, { label: "品項", value: p.name }, { label: "使用情境", value: p.series === "豐盛系列" ? "下午茶與點心擺放" : "茶席與日常餐桌" }],
  story: { title: "一席茶，有物相伴。", body: p.detail, image: p.ids[1] ? gallery(p.ids[1], p.name) : undefined },
}));

export const products: Product[] = [...bagProducts, ...jewelryProducts, ...teaProducts, ...teawareProducts];
export const productHref = (product: Product | string) => `/products/${typeof product === "string" ? product : product.slug}`;
export const categoryHref = (category: string) => `/collections/${category}`;
export const findProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCategory = (id: string) => categories.find((c) => c.id === id);
export const getCategoryProducts = (id: string) => id === "all" ? products : products.filter((p) => p.category === id);
export const bagCatalog = bagProducts;
export const jewelryCatalog = jewelryProducts;
export const teaCatalog = teaProducts;
export const teawareCatalog = teawareProducts;
