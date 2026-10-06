import { teaGiftProductsFor, type TeaContents } from "./tea-gifts";
import shopifyMap from "./shopify-map.json";
import studioListing from "./studio-listing.json";
import { getContent, gallery, site, type Img } from "./content";
import type { Locale } from "../i18n/config";
import { sizeText } from "./measure";

// Product facts come from the existing approved content and asset manifest.
// No inferred prices, stock, metal purity, gemstone grades, sizes or tea brewing times. Prices, metal and sizes added
// 2026-10-02 are copied from www.charmvilla.com.tw product pages (read that day); where the official page could not be
// matched to a piece with certainty (the two diamond earrings, the Prosperity stands), nothing was added.
//
// Bilingual (2026-10-01): buildCatalog(lang) builds the same products in Chinese (the source) or English. Every visible
// string is written as t("中文", "English"); slugs, images, prices and Shopify ids are shared.
export type CategoryId = "bags" | "jewelry" | "tea" | "scents" | "abundance" | "wood-fired";
export type Category = { id: CategoryId; name: string; en: string; intro: string };
export type ProductView = { label: string; image: Img };
export type Product = {
  slug: string; category: CategoryId; name: string; english: string;
  summary: string; description: string;
  /** Listing cover and first gallery view: the studio photograph on the light ground (user 2026-10-01). */
  image: Img;
  /** Scene shown on a listing card while it is hovered. */
  hoverImage?: Img;
  /** Product-page gallery: studio views on the light ground only, all 4:5. */
  views: ProductView[];
  /** Scene photography, laid out below the gallery like a magazine spread. */
  scenes?: Img[];
  facts: { label: string; value: string }[];
  story: { title: string; body: string; image?: Img };
  variant?: { group: string; label: string };
  officialUrl?: string;
  /** Studio editorial shot for the homepage featured grid (falls back to `image`). */
  featuredImage?: Img;
  /** Local-mode list price (official TWD). In shopify mode the Storefront API price wins. */
  price?: { amount: number; currency: "TWD" };
  /** Marked sold out on the official store; the price stays visible and the bag button is disabled. */
  soldOut?: boolean;
  /** Shopify handle + variant GID from src/data/shopify-map.json; empty until the store is connected. */
  shopify?: { handle: string; variantId: string };
  /** How to brew (tea gift boxes, guide §4). */
  brew?: { title: string; steps: { title: string; text: string }[] };
  /** The Show more! concept: the protected slogan and the finalized concept copy (guide §5). */
  concept?: { title: string; slogan: string; body: string };
  giftBox?: { pieces: number; series: string; contents: TeaContents; choices?: { label: string; contents: TeaContents; price?: number }[] };
};

const buildCatalog = (lang: Locale) => {
  const t = (zh: string, en: string) => (lang === "en" ? en : zh);
  const { bags, jewelry } = getContent(lang);

  // Category names and order from the user's Google Doc (2026-10-02): 全部作品 All Pieces · 小金魚茶包 Goldfish Tea Bags · 香氛 Scents
  // (slogan 「香味，是喜悅的記憶。」, the official store's 香味是喜悅的記憶 category: the hinoki pieces) · 金飾 Jewelry · 豐盛系列
  // Abundance Collection · 柴燒系列 Wood-Fired Collection (the chopstick rest) · 門市 Our Stores. The leather bags were kept
  // (user's choice) and renamed 交織系列 Interwoven Collection after their braided handles, in the series naming of the others.
  // The former 茶器與工藝 is split into 香氛, 豐盛系列 and 柴燒系列 (/collections/teaware redirects to /collections/scents).
  const categories: Category[] = [
    { id: "tea", name: t("小金魚茶包", "Goldfish Tea Bags"), en: "GOLDFISH TEA BAGS", intro: t("從織布的經緯到桐木的紋理，一盒茶也有值得細看的風景。以禮盒收藏手作的小金魚，依盒型、入數與茶款，選一份走進日常的心意。", "Hand-folded goldfish tea bags, presented in paper and paulownia wood gift boxes. Explore woven textures and illustrated lids, then choose the tea selection and box size for the person you have in mind.") },
    // Chinese names as on the official store www.charmvilla.com.tw (user 2026-10-05: 「全站的商品名稱與分類都跟官網一致」): 香味是喜悅的記憶 and 如魚得水
    { id: "scents", name: t("香味是喜悅的記憶", "Scents"), en: "SCENTS", intro: t("以檜木製作的杯墊、茶匙與筷子。", "Scent is a memory of joy. Here, hinoki wood becomes a Cloud Coaster, a Ginkgo Style Tea Spoon and Hinoki Wood Chopsticks. Look at the grain, notice the natural, mellow aroma, and bring a little of it to your tea and your meals.") /* the slogan is now the Chinese name itself */ },
    { id: "jewelry", name: t("如魚得水", "Jewelry"), en: "JEWELRY", intro: t("金魚的輪廓縮小至耳畔，光澤便有了貼近肌膚的尺度。轉身之間，欣賞金面、珍珠與鑽石各自的表情。", "Our goldfish takes on a new form in jewelry. Explore designs with pearls, diamonds and matte finishes, each catching the light in its own way as you move.") },
    { id: "bags", name: t("交織系列", "Interwoven Collection"), en: "INTERWOVEN COLLECTION", intro: t("從交織的提把看向包身，細紋與線條各有秩序。拿起一只皮革包，也把對材質的欣賞帶進日常。", "A braided handle, textured leather and a carefully considered silhouette. Discover bags that bring distinctive details to the pieces you carry every day.") },
    { id: "abundance", name: t("豐盛系列", "Abundance Collection"), en: "ABUNDANCE COLLECTION", intro: t("以點心盤整理茶席上的高低與層次。從擺放到取用，讓下午茶有自己的節奏。", "A paper dessert tray designed for easy storage, portability and reuse, created by Su Ching-mei. Unfold the tray, place the supplied dessert paper on top and arrange your sweets for the gathering. The dessert paper is single-use and for room-temperature use only.") },
    { id: "wood-fired", name: t("柴燒系列", "Wood-Fired Collection"), en: "WOOD-FIRED COLLECTION", intro: t("以鳥的輪廓構成筷架。小小一件，在餐具與桌面之間，留下有形的留白。", "Wood-fired chopsticks rests in the outline of a songbird, each shaped and finished by hand, with subtle variations in color and gradient from piece to piece. A small piece that keeps your chopsticks close between bites.") },
  ];

  const bagProducts: Product[] = bags.products.map((p) => ({
    slug: `braided-leather-bag-${p.id}`, category: "bags", name: t(`${bags.product}・${p.name}`, `${bags.product} · ${p.name}`),
    english: `BRAIDED LEATHER BAG / ${p.en}`, summary: t("交織的提把，連起手與皮革。", "A braided handle that joins hand and leather."),
    description: t(`${p.name}荔枝紋真皮，搭配扁平三股編織肩帶與扁銅棒五金。提把的編織線條與包身細紋相接，金屬接點則讓柔軟的材質有了清楚的收束。`,
      `${p.name} lychee-grain leather with a flat three-strand braided strap and a flat brass bar. The lines of the braid meet the grain of the body, and the metal joint gives the soft material a clear point of closure.`),
    image: p.views[0].image, views: p.views.map((v) => ({ label: v.label, image: v.image })),
    facts: [
      { label: t("顏色", "Color"), value: p.name }, { label: t("材質", "Material"), value: t("荔枝紋真皮", "Lychee-grain leather") },
      { label: t("肩帶", "Strap"), value: t("扁平三股編織", "Flat three-strand braid") }, { label: t("五金", "Hardware"), value: t("扁銅棒", "Flat brass bar") },
      { label: t("發明專利", "Invention patent"), value: "TW I728606" },
    ],
    story: {
      title: t("肩上的一件作品", "A piece for the shoulder"),
      body: t("先看輪廓，再走近。荔枝紋在光線下顯出細微起伏，三股編織沿著提把延伸；當包被提起，原本陳列中的線條，也隨身體的動作進入生活。",
        "Take in the outline first, then come closer. Under light the lychee grain shows its fine relief, and the three-strand braid runs the length of the handle. Once the bag is lifted, lines that sat still on display move with the body and into daily life."),
      image: p.views[2].image,
    },
    variant: { group: "braided-leather-bag", label: p.name },
    // Show more! = this bag (user 2026-10-06). The slogan is protected (guide §5): it is shown word for word in both languages.
    // The English concept copy is the finalized text, unchanged; the Chinese is a faithful translation of it.
    concept: {
      title: t("設計概念", "Design concept"),
      slogan: "Simplify to amplify. Show more, in your life!",
      body: t("運用原創的折疊與交扣結構，將一整片平面的皮革轉化為完整成形的包款。不需縫線、不需黏著劑，也無須後續加工，讓皮革保持最自然的狀態，同時開啟再利用與轉化的新可能。這份設計展現了對材質及其所取自的自然資源的深切尊重。",
        "Using an original folding and interlocking structure, a single flat piece of leather is transformed into a fully formed bag. Requiring no stitching, no adhesives, and no further fabrication, the design preserves the leather in its most natural state while opening new possibilities for reuse and transformation. It reflects a deep respect for the material and the natural resources from which it comes."),
    },
  }));

  // 2026-09-30: the charcoal-sketch listings (goldfish-diamond-stud / goldfish-diamond-drop) were the same products as the
  // bezel-diamond and single-diamond earrings; they are merged here as extra views and their URLs redirect (next.config.ts).
  // 2026-09-30 (later): the brand supplied the real product photography — four series: 珍珠長鏈、鑽石、雙魚、璞金. The earlier
  // "bezel diamond at the mouth" listing did not exist as a product; it and "single diamond" merged into 鑽石系列 (redirects in next.config.ts).
  // 2026-10-01 (user): 鑽石系列 has two styles — 垂墜 (fish + short chain + claw-set drop) and 耳釘 (stud, no drop). Scene photos are
  // sorted by which style they show: drop = CV-0370/0371/0372 + drop sketch; stud = CV-0376/0374/0373 + stud sketch.
  const jewelrySlugs = ["pearl-chain-goldfish-earrings", "diamond-goldfish-earrings", "diamond-goldfish-stud-earrings", "twin-goldfish-earrings", "raw-gold-goldfish-earrings", "diamond-bezel-goldfish-earrings"];
  const jewelryEnglish = ["PEARL CHAIN", "DIAMOND DROP", "DIAMOND STUD", "TWIN GOLDFISH", "RAW GOLD", "DIAMOND BEZEL"];
  // the official store's series of each piece (如魚得水 › 珍珠系列／鑽石系列／雙魚系列／璞金系列)
  const jewelrySeries = [t("珍珠系列", "Pearl Series"), t("鑽石系列", "Diamond Series"), t("鑽石系列", "Diamond Series"), t("雙魚系列", "Twin Series"), t("璞金系列", "Raw Gold Series"), t("鑽石系列", "Diamond Series")];
  const jewelryDetails = [
    t("珍珠、長鏈與金魚", "Pearl, long chain and goldfish"),
    t("金魚、短鏈與爪鑲垂墜圓鑽", "Goldfish, short chain and a prong-set round diamond drop"),
    t("單尾金魚耳釘、魚口圓鑽、無垂墜", "Single goldfish stud, round diamond at the mouth, no drop"),
    t("兩尾金魚以短鏈相連", "Two goldfish joined by a short chain"),
    t("單尾小金魚、霧面金屬表面", "Single small goldfish, matte metal surface"),
    t("金魚、短鏈與包鑲垂墜圓鑽", "Goldfish, short chain and a bezel-set round diamond drop"),
  ];
  const jewelryExtra: Record<number, Img[]> = {
    // pearl chain: the olive-coat portrait among ivory pleats (CV-0379) removed (user 2026-10-02: 「刪」)
    0: [gallery("CV-0377", t("珍珠長鏈小金魚耳環・石面光影", "Pearl Chain Goldfish Earrings in light and shadow on stone")), gallery("CV-0380", t("珍珠長鏈小金魚耳環・米白衣領", "Pearl Chain Goldfish Earrings against a cream collar"))],
    // stud: the colour photograph of the stud as worn (CV-0373) was removed and the charcoal sketch kept (user 2026-10-02: 「保留素描的」)
    2: [gallery("CV-0374", t("單鑽小金魚耳環・深綠靜影", "Goldfish Earrings, Diamond Series stud, a still life in deep green")), site("goldfish-stud-sketch.webp", t("單鑽小金魚耳環・炭筆素描配戴圖", "Goldfish Earrings, Diamond Series stud, charcoal sketch of the piece as worn"), 896, 1120)],
    // CV-0372/0370/0371 and the drop sketch show the bezel setting (checked 2026-10-05), so they belong to 包鑲, not 爪鑲
    // CV-0371 (red-brown drapes) and the drop sketch removed from the bezel page (user 2026-10-05: 「刪」)
    5: [// the olive-sofa colour portrait was removed (user 2026-10-05: 「刪」)
      gallery("CV-0372", t("吐鑽小金魚耳環｜包鑲・配戴", "Goldfish Earrings, Diamond Series bezel, as worn")), gallery("CV-0370", t("吐鑽小金魚耳環｜包鑲・暗調肖像", "Goldfish Earrings, Diamond Series bezel, a low-key portrait"))],
    // twin: the as-worn photograph among ivory pleats (CV-0378) was removed (user 2026-10-02: 「刪」), so the twin has no scene
  };
  const jewelryEditorial = [
    {
      description: t("珍珠與長鏈向下延伸，金魚停在鏈末。從耳畔到頸側，細長的線條把觀看的距離拉開，也讓魚形的比例更容易被看見。", "Pearl and long chain extend downward, and the goldfish rests at the chain's end. From the ear to the side of the neck, the slender line opens up the distance of looking and makes the proportions of the fish easier to see."),
      title: t("垂落的線，游動的形", "A falling line, a swimming form"),
      body: t("動作，讓線條有了變化。長鏈隨轉身輕移，珍珠與金魚各自接住光線；靜止時的構圖，到了配戴者身上，又是另一幅畫面。", "Movement changes the line. The long chain shifts as you turn, and pearl and goldfish each catch the light. A composition at rest becomes another picture on the person who wears it."),
    },
    {
      description: t("一尾小金魚停在耳畔，短鏈之下垂著一顆爪鑲圓鑽。金面與鑽石的明暗不同，隨動作各自接住光，讓魚形與那一點光之間有了距離。", "One small goldfish rests at the ear; below a short chain hangs a prong-set round diamond. Gold surface and diamond differ in brightness and catch the light separately as you move, leaving a distance between the fish and that point of light."),
      title: t("魚身之下的一點光", "A point of light beneath the fish"),
      body: t("輪廓之外，還有間距。金魚固定在耳畔，圓鑽隨短鏈輕移；靜與動同時存在，貼近側臉觀看，便能讀出各個細節之間的關係。", "Beyond the outline there is spacing. The goldfish stays fixed at the ear while the diamond moves on its short chain. Stillness and motion exist together; seen close to the profile, the relationship between each detail becomes legible."),
    },
    {
      description: t("單尾小金魚耳釘，魚口嵌著一顆圓鑽，沒有垂墜。光集中在耳畔的一點，轉頭時魚形與鑽石一起接住光。", "A single goldfish stud with a round diamond set at its mouth and no drop. The light gathers at one point by the ear; when the head turns, fish and diamond catch it together."),
      title: t("耳畔的一點光", "A point of light at the ear"),
      body: t("貼近看，才看見魚口那顆鑽。輪廓收斂，光也收斂；配戴時像一枚安靜的印記，只在轉身的瞬間亮一下。", "Only up close do you see the diamond at the fish's mouth. The outline is restrained, and so is the light. Worn, it is like a quiet mark that brightens only for the instant you turn."),
    },
    {
      description: t("兩尾金魚以短鏈相連：一尾停在耳畔，一尾垂落。觀看一尾的輪廓，也留意另一尾的位置；形與形之間的距離，讓耳畔有了小幅的構圖。", "Two goldfish joined by a short chain: one rests at the ear, one hangs below. Look at the outline of one and notice where the other sits; the distance between the two forms makes a small composition at the ear."),
      title: t("兩尾魚之間", "Between two fish"),
      body: t("視線可以來回。先看各自的輪廓，再看兩者如何相處，配戴的比例便從這份呼應裡慢慢清楚。", "The eye can travel back and forth. Look first at each outline, then at how the two sit together; the proportions of the piece, as worn, slowly come clear in that exchange."),
    },
    {
      description: t("單尾小金魚，霧面的金屬表面收住反光，只留下輪廓。收斂的尺度，讓魚形的轉折集中在一起，適合從近處細看。", "A single small goldfish whose matte metal surface holds back reflection and leaves only the outline. At this restrained scale the turns of the fish form gather together, made to be read up close."),
      title: t("只留下輪廓", "Only the outline remains"),
      body: t("少了亮面的反射，形狀便更安靜。魚身與尾鰭的每一處轉折都有被看見的空間，配戴時像一枚貼近耳畔的小印記。", "Without a polished surface to reflect, the shape grows quieter. Every turn of body and tail fin has room to be seen; worn, it is like a small mark kept close to the ear."),
    },
    {
      description: t("一尾小金魚停在耳畔，短鏈之下垂著一顆圓鑽，鑽石外圍由一圈金邊包住。金面與鑽石隨動作各自接住光。", "One small goldfish rests at the ear; below a short chain hangs a round diamond held in a rim of gold. Gold and diamond each catch the light as you move."),
      title: t("金邊裡的一點光", "A point of light held in gold"),
      body: t("包鑲把鑽石收進一圈金邊，輪廓更圓也更完整。金魚停在耳畔，圓鑽隨短鏈輕移，近看能讀出金邊與鑽石的分界。", "The bezel gathers the diamond into a ring of gold, so the outline is rounder and complete. The goldfish stays at the ear while the diamond moves on its short chain; up close you can read the line between gold and stone."),
    },
  ];
  // www.charmvilla.com.tw (2026-10-02): K18 gold, made in Taiwan, sold per single earring, made to order in about 25–60 days,
  // not shipped overseas. List prices only where the official page is certainly this piece.
  // 2026-10-05: 爪鑲 (id 128) 8,600, 單鑽 (id 132) 9,600 and 包鑲 (id 180) 10,300, matched to the official pages by photograph
  const jewelryPrices: Record<string, number> = { "pearl-chain-goldfish-earrings": 9600, "twin-goldfish-earrings": 9600, "raw-gold-goldfish-earrings": 5500, "diamond-goldfish-earrings": 8600, "diamond-goldfish-stud-earrings": 9600, "diamond-bezel-goldfish-earrings": 10300 };
  const jewelryFacts = (slug: string) => [
    { label: t("材質", "Material"), value: slug === "pearl-chain-goldfish-earrings" ? t("K18 純金、珍珠", "18K gold, pearl") : t("K18 純金", "18K gold") },
    { label: t("販售單位", "Sold as"), value: t("單只（單耳）", "A single earring") },
    { label: t("產地", "Made in"), value: t("台灣", "Taiwan") },
    { label: t("製作時間", "Making time"), value: t("訂製商品，約 25–60 天；訂購前請先來電洽詢", "Made to order in about 25–60 days; please call before ordering") },
    { label: t("寄送", "Delivery"), value: t("金飾不提供海外寄送", "Jewelry is not shipped overseas") },
  ];
  // the bezel-set drop sits next to the claw-set one
  // the official store marks 吐鑽小金魚耳環｜爪鑲｜ (id 128) ｜售罄｜ (user 2026-10-05: mark it here too)
  const jewelrySoldOut = new Set(["diamond-goldfish-earrings"]);
  const jewelryOrder = ["pearl-chain-goldfish-earrings", "diamond-goldfish-earrings", "diamond-bezel-goldfish-earrings", "diamond-goldfish-stud-earrings", "twin-goldfish-earrings", "raw-gold-goldfish-earrings"];
  const jewelryProducts: Product[] = jewelry.items.map((p, i): Product => ({
    slug: jewelrySlugs[i], category: "jewelry", name: p.title, english: jewelryEnglish[i],
    summary: p.desc, description: jewelryEditorial[i].description,
    image: p.image, views: [{ label: t("商品照", "Product photograph"), image: p.image }, ...(jewelryExtra[i] || []).map((image, j) => ({ label: t(`情境 ${j + 1}`, `Scene ${j + 1}`), image }))],
    // facts only (user 2026-10-05: 「商品 spec 不寫形容文案」): the style repeated the name and is gone; the parts are 「組成」
    facts: [{ label: t("系列", "Series"), value: jewelrySeries[i] }, { label: t("組成", "Parts"), value: jewelryDetails[i] }, ...jewelryFacts(jewelrySlugs[i])],
    ...(jewelryPrices[jewelrySlugs[i]] ? { price: { amount: jewelryPrices[jewelrySlugs[i]], currency: "TWD" as const } } : {}),
    ...(jewelrySoldOut.has(jewelrySlugs[i]) ? { soldOut: true } : {}),
    story: { title: jewelryEditorial[i].title, body: jewelryEditorial[i].body, image: jewelryExtra[i]?.[0] },
  })).sort((a, b) => jewelryOrder.indexOf(a.slug) - jewelryOrder.indexOf(b.slug));

  // The 16 official gift boxes; the two 2026 Christmas editions were removed (user 2026-10-05: 「聖誕節茶包都刪」).
  const teaProducts: Product[] = teaGiftProductsFor(lang);

  const prosperity = t("豐盛系列", "Abundance Collection"), wooden = t("香味是喜悅的記憶", "Scents");
  const tablewareEntries = [
    { slug: "prosperity-dessert-stand", name: t("豐盛點心盤", "Abundance Collection (4-Color Series)"), en: "ABUNDANCE COLLECTION", series: prosperity, ids: ["CV-0068", "CV-0074", "CV-0081"],
      summary: t("把點心與茶，安放在同一席風景。", "Abundance Dessert Tray · Paper serving set"),
      detail: t("以點心盤整理茶席上的高低與層次。從擺放到取用，讓下午茶有自己的節奏。", "A paper dessert tray designed for easy storage, portability and reuse, created by Su Ching-mei. Unfold the tray, place the supplied dessert paper on top and arrange your sweets for the gathering. The dessert paper is single-use and for room-temperature use only."),
      story: { title: t("餐桌上的高與低", "Highs and lows on the table"), body: t("擺放，也是一種構圖。點心有了不同的高度，杯與盤之間便多了可觀看的層次；每次相聚，都能重新安排這一席景致。", "Arranging is a kind of composition. With sweets at different heights there are more layers to look at between cup and plate, and every gathering is a chance to set the scene anew.") } },
    // 豐盛點心盤｜包裝禮盒 removed: the official store sells one product, 豐盛點心盤 (user 2026-10-05: 「照官網的」); the URL redirects
    // 2026-10-02 (user: 「這些商品是分開販售，不要擅自合併」): the cloud coasters are their own product on www.charmvilla.com.tw
    // (id 156); the old "木質杯墊與茶匙" listing merged them with the ginkgo teaspoon, which is sold on its own below.
    { slug: "cloud-coaster", name: t("雲朵杯墊", "Cloud Coaster"), en: "CLOUD COASTER", series: wooden, ids: ["CV-0232"],
      summary: t("一杯茶的旁邊，木紋靜靜相伴。", "Beside a cup of tea, wood grain keeps quiet company."),
      detail: t("雲朵形狀的檜木杯墊，把木質的紋理與自然溫潤的香氣帶到茶杯旁。一組六片，拿起一片感受表面，也觀察每一片的輪廓。", "Cloud-shaped hinoki coasters bring the grain of wood, and its natural, mellow aroma, to the side of the cup. Six to a set: pick one up to feel the surface, then look at the outline of each piece."),
      story: { title: t("茶杯旁的木紋", "Wood grain beside the cup"), body: t("手先於目光感受材質。每一次放下茶杯，杯墊表面的紋理與雲朵的輪廓，便一次次回到注意之中。", "The hand knows the material before the eye does. Each time a cup is set down, the grain of the surface and the outline of the cloud come back to attention.") } },
    { slug: "bird-chopstick-rest", name: t("鳥形筷架", "Songbird Chopsticks Rest"), en: "SONGBIRD CHOPSTICKS REST", series: t("柴燒系列", "Wood-Fired Collection"), ids: ["CV-0256"] /* CV-0248 replaced by scene-bird-rest-gift-box; CV-0239 (birds on a heap of charcoal) removed (user 2026-10-05: 「刪」) */,
      summary: t("讓一雙筷子，有一處停歇。", "Individually handcrafted, with natural variations in color."),
      detail: t("以鳥的輪廓構成筷架。小小一件，在餐具與桌面之間，留下有形的留白。", "Individually shaped and finished by hand, with subtle variations in color and gradient from piece to piece. Hand wash only; not dishwasher safe."),
      story: { title: t("餐具之間，一隻鳥", "A bird among the tableware"), body: t("筷子放下時，鳥形的輪廓便與修長的線條相遇。一件小器物改變了桌面的構圖，也讓用餐間的停頓有了可看的細節。", "When the chopsticks are set down, the bird's outline meets their long line. One small object changes the composition of the table and gives the pauses in a meal a detail to look at.") } },
    { slug: "ginkgo-teaspoon-gift-box", name: t("銀杏茶匙", "Ginkgo Style Tea Spoon"), en: "GINKGO STYLE TEA SPOON", series: wooden, ids: ["CV-0231", "CV-0234", "CV-0229"],
      summary: t("把一片葉子的形，留在茶席上。", "A Hinoki wood tea spoon, shaped in the Ginkgo style."),
      detail: t("銀杏的輪廓成為茶匙的造型，木紋則為每一次觀看帶來不同細節。以禮盒呈現，收藏一份茶席心意。", "A Hinoki wood tea spoon with a natural, mellow aroma. Gently hand wash to preserve the wood and craftsmanship; not dishwasher safe."),
      story: { title: t("一片葉子的轉譯", "A leaf, translated"), body: t("葉形來到茶席。銀杏的輪廓經由茶匙與木質呈現，既可近看造型，也能在取用之間，感受自然形態如何走入生活。", "A leaf shape arrives at the tea table. The ginkgo outline is rendered in a teaspoon and in wood: a form to look at closely and, in use, a way to sense how a natural shape enters daily life.") } },
    { slug: "wooden-chopsticks", name: t("檜木筷子", "Hinoki Wood Chopsticks"), en: "HINOKI WOOD CHOPSTICKS", series: wooden, ids: ["CV-0243", "CV-0245", "CV-0227"],
      summary: t("從一雙木筷，開始日常的一餐。", "Hinoki Wood Chopsticks · Rest sold separately"),
      detail: t("沿著修長線條看見木質紋理。與鳥形筷架搭配，在餐桌上形成一組安靜的物件。", "Hinoki Wood Chopsticks, sold on their own. The Songbird Chopsticks Rest is sold separately."),
      story: { title: t("每日使用的線條", "A line used every day"), body: t("一雙筷子，常在手邊。從修長的外形看到木紋，熟悉的餐具也有可細讀之處；與鳥形筷架一同擺放，便形成餐桌上的小幅構圖。", "A pair of chopsticks is always within reach. From their long shape to the grain of the wood, even familiar tableware has something to read closely; set beside the Songbird Chopsticks Rest, they make a small composition on the table.") } },
  ];
  // Only facts a buyer needs first (user 2026-10-05). Rows marked Shopify follow the Shopify product descriptions quoted in the
  // English Website Copy Review (2026-10-02); prices stay with the official Taiwan store where known.
  const handWash = { label: t("清潔方式", "Care"), value: t("請輕柔手洗，不可使用洗碗機", "Hand wash gently; not dishwasher safe") };
  const teawareFacts: Record<string, { label: string; value: string }[]> = {
    "prosperity-dessert-stand": [
      { label: t("販售單位", "Sold as"), value: t("1 組／盒", "1 set per box") },
      { label: t("材質", "Material"), value: t("紙", "Paper") },
      { label: t("尺寸", "Size"), value: sizeText([29.5, 22, 3.5], lang, "±5%") },
      { label: t("搭配點心紙", "Dessert paper"), value: t("紙＋PE（食品級），12 組／盒；台灣製，符合 ISO 22000 與 HACCP", "Paper + PE (food-contact grade), 12 sets per box; made in Taiwan, ISO 22000 and HACCP compliant") },
      { label: t("使用注意", "Use"), value: t("點心紙僅限常溫、單次使用，請勿加熱；遠離火源，存放於乾燥處", "Dessert paper for room temperature and single use only; do not heat. Keep away from fire and store dry") },
      { label: t("設計", "Design"), value: t("蘇靜媚", "Su Ching-mei") },
    ],
    "bird-chopstick-rest": [
      { label: t("製作", "Making"), value: t("逐件手工塑形與修整，每件色澤與漸層略有不同", "Shaped and finished by hand; color and gradient vary slightly from piece to piece") },
      { label: t("清潔方式", "Care"), value: t("僅限手洗，不可使用洗碗機", "Hand wash only; not dishwasher safe") },
    ],
  };
  const teawareOfficial: Record<string, { price: number; facts: { label: string; value: string }[] }> = {
    "prosperity-dessert-stand": { price: 1880, facts: [] }, // official id 705, 豐盛系列｜豐盛點心盤 (2026-10-05); its facts are above
    "cloud-coaster": { price: 1880, facts: [
      { label: t("販售單位", "Sold as"), value: t("6 片／組", "6 per set") },
      { label: t("材質", "Material"), value: t("台灣一級檜木", "Taiwan cypress (hinoki), first grade") },
      { label: t("尺寸", "Size"), value: sizeText([8, 10], lang) },
      { label: t("包裝", "Packaging"), value: t("外盒盒蓋以傳統織布機手工梭織", "Box lid hand-woven on a traditional loom") },
      { label: t("清潔方式", "Care"), value: t("請輕柔手洗，不可使用洗碗機", "Gently hand wash only; not dishwasher safe.") },
    ] },
    "wooden-chopsticks": { price: 680, facts: [
      { label: t("販售單位", "Sold as"), value: t("2 雙／組（不含鳥形筷架）", "2 pairs per set (Songbird Chopsticks Rest sold separately)") },
      { label: t("材質", "Material"), value: t("台灣一級檜木", "Taiwan cypress (hinoki), first grade") },
      { label: t("尺寸", "Size"), value: `${t("長", "Length")} ${sizeText([23], lang)}` },
      handWash,
    ] },
    "ginkgo-teaspoon-gift-box": { price: 760, facts: [
      { label: t("販售單位", "Sold as"), value: t("1 只／盒", "1 per box") },
      { label: t("材質", "Material"), value: t("檜木", "Cypress (hinoki)") },
      { label: t("尺寸", "Size"), value: `${t("長", "Length")} ${sizeText([15.7], lang)}` },
      { label: t("設計", "Design"), value: t("蘇靜媚", "Su Ching-mei") },
      handWash,
    ] },
  };
  const teawareProducts: Product[] = tablewareEntries.map((p) => ({
    slug: p.slug, category: (p.series === prosperity ? "abundance" : p.slug === "bird-chopstick-rest" ? "wood-fired" : "scents") as CategoryId, name: p.name, english: p.en, summary: p.summary, description: p.detail,
    image: gallery(p.ids[0], p.name), views: p.ids.map((id, i) => ({ label: i ? t(`細節 ${i}`, `Detail ${i}`) : t("商品全貌", "Full view"), image: gallery(id, p.name) })),
    facts: [
      { label: t("系列", "Series"), value: p.series },
      ...(teawareOfficial[p.slug]?.facts ?? []),
      ...(teawareFacts[p.slug] ?? []),
    ],
    ...(teawareOfficial[p.slug] ? { price: { amount: teawareOfficial[p.slug].price, currency: "TWD" as const } } : {}),
    story: { title: p.story.title, body: p.story.body, image: p.ids[1] ? gallery(p.ids[1], p.name) : undefined },
  }));

  const studioLabel = t("棚拍商品照", "Studio photograph");
  const studioAlt = (name: string) => t(`${name}・棚拍商品照`, `${name}, studio photograph`);
  // Homepage featured grid: studio shots generated 2026-09-30 in the white bag's language (output/featured-editorial-2026-09-30).
  const featuredFiles: Record<string, string> = {
    // ginkgo: the 896 px featured shot filled the frame (user 2026-10-05: 「太滿，縮小一點商品的比例」); the 2K cover is used everywhere (v5: the product about 64 % of the width, after 「再大一點」)
    "reunion-paulownia-gift-box": "featured-reunion-paulownia-gift-box.webp",
    // bird-chopstick-rest: featured-bird-chopstick-rest-55.webp is now its cover everywhere (studio-listing.json; user 2026-10-05: 「所有這個商品都統一用這張當封面」)
  };
  const withShopify = (p: Product): Product => {
    const m = (shopifyMap as Record<string, { handle: string; variantId: string } | string>)[p.slug];
    const f = featuredFiles[p.slug] ? site(featuredFiles[p.slug], studioAlt(p.name)) : undefined;
    const q = f ? { ...p, featuredImage: f, views: p.views.some((v) => v.image.src === f.src) ? p.views : [...p.views, { label: studioLabel, image: f }] } : p;
    return typeof m === "object" && (m.handle || m.variantId) ? { ...q, shopify: m } : q;
  };
  // 2026-10-01 (user, later the same day): 「所有的商品清單都用淺色背景那張為封面，hover 時才出現情境照」 and, on the product page,
  // 「這區塊統一用淺色背景那張放不同視角的圖，其他情境照都用雜誌排版風格在下面」. So every product is split in two:
  //   views  = studio photographs on the light warm-grey ground (scripts/studio-listing.mjs), all 4:5 — the gallery and the cover;
  //   scenes = everything photographed in a setting — the hover image of the card and the magazine spread under the gallery.
  // The scene that used to be the cover leads the scenes.
  const listingScene: Record<string, string> = {
    "braided-leather-bag-white": "CV-0422", "braided-leather-bag-blue": "CV-0423", "braided-leather-bag-pink": "CV-0424",
    "pearl-chain-goldfish-earrings": "CV-0377", "diamond-goldfish-stud-earrings": "CV-0376",
  };
  // the bird rest leads with the white CHARMVILLA box and a budding branch, regenerated in the oak-table scene's light
  // (user 2026-10-05: 「重新算這張圖，攝影風格依照剛才的筷架情境照」 for CV-0248)
  const listingSceneSite: Record<string, Img> = {
    // a new lifestyle scene (user 2026-10-05: 「我現在要做豐盛點心盤的生品情境照」): the stand with a few petits fours and goldfish tea on an oak table, olive sofa in front
    // v3 (user 2026-10-05): the bottom tier widened to the real piece's 38 : 71 : 100 and the painting navy; v2: an orange wall, a white gold-rimmed cup, a piped-cream tartlet, a fiddle-leaf fig
    "prosperity-dessert-stand": site("scene-dessert-stand-oak-table-tea-v3.webp", t("燒橘色牆面的溫暖客廳，牆上一幅海軍藍的畫，橡木圓桌上的豐盛點心盤擺著幾樣小點心，旁邊一杯白瓷金邊杯泡的小金魚茶，後方是琴葉榕，前景是橄欖綠毛圈沙發", "In a warm room with a burnt-orange wall and a navy painting, the Abundance Dessert Tray on a round oak table with a few petits fours, goldfish tea in a white gold-rimmed cup, a fiddle-leaf fig behind and an olive bouclé sofa in front"), 1792, 2240),
    "bird-chopstick-rest": site("scene-bird-rest-gift-box-v2.webp", t("暖色斜陽下，一隻灰藍柴燒鳥形筷架停在印著金色 CHARMVILLA 的白色禮盒上，上方帶綠芽的樹枝投下影子", "In low warm sun a gray-blue wood-fired Songbird Chopsticks Rest on a white box lettered CHARMVILLA in gold, a budding branch casting shadows"), 1688, 2110) /* levelled 2.5° (user 2026-10-05: 「修正照片的水平線」) */,
  };
  // 2026-10-01 evening (user, with a screenshot of the white bag page: 「刪」): the two ink-green scenes — the figure looking back
  // (scene-white-bag-over-shoulder-ink-green) and the bag in the air on ink green (gallery CV-0450) — are off the site; the files
  // are in the git history. The white bag's scenes now lead with the bag in the air on Morandi sage.
  // 白包懸空照已拿掉（使用者 2026-10-06：「刪」），目前沒有排在主圖後面的情境照
  const sceneAfterLead: Record<string, Img[]> = {};
  // 2026-10-01 (user: 「先幫我把目前有的都放上官網」): scenes that follow a product's existing scenes.
  const sceneExtra: Record<string, Img[]> = {
    // the brand's own photographs from the asset library (user 2026-10-02: 「更多的官網素材可以從這個網站抓」), two angles the page did not have yet
    "bird-chopstick-rest": [site("scene-bird-rest-tray-closeup.webp", t("深色古銅托盤上，一雙檜木筷架在青瓷色鳥形筷架上，後方小鳥停在備長炭上", "On a dark bronze tray, hinoki chopsticks resting on a celadon Songbird Chopsticks Rest, another bird perched on binchotan behind"), 2040, 1360) /* CV-0240 re-staged on the oak scene's tray (2026-10-05) */, site("scene-oak-table-bird-rests.webp", t("橡木圓桌上的金屬托盤裡，四隻柴燒鳥形筷架、備長炭與一雙檜木筷", "Four wood-fired Songbird Chopsticks Rests, binchotan and hinoki chopsticks on a tray on an oak coffee table"), 1792, 2240)],
    "braided-leather-bag-pink": [// v3 (user 2026-10-02: the painting and the foreground changed — a deep-blue field painting, an olive bouclé ottoman with a
    // tray, a glass of goldfish tea on a cloud coaster; the bag and chair untouched)
    site("scene-pink-bag-armchair-olive-v2.webp", t("編織提把皮革包・粉紅色，放在橄欖綠布面單椅上；背後是橘色色塊的畫，前景橡木小邊几上一杯小金魚茶與 CHARM VILLA 茶標", "Braided Leather Bag in pink on an olive bouclé armchair; an orange field painting behind, and on an oak side table in front a glass of goldfish tea with its CHARM VILLA tag"), 1760, 2336)],
    // 客廳照（橄欖綠扶手椅、芥末黃躺椅、團圓桐木盒）已從粉紅包頁拿掉（使用者 2026-10-06：「刪」），團圓桐木木盒頁仍保留
  };
  // the twin-earring portrait on a mustard sofa (user 2026-10-05: 「加入對應的商品圖」): the twin earrings, the blue bag and the cloud coaster are all in it
  // 參考 9 張包款廣告照的拍法生成的人物情境照，臉只露到唇下（使用者 2026-10-06：「這2個放上官網商品內容頁」）
  sceneExtra["braided-leather-bag-white"] = [...(sceneExtra["braided-leather-bag-white"] ?? []), site("scene-white-bag-walking-tobacco.webp", t("身穿菸草棕針織衫與寬褲的女子走過米白灰泥牆，手提白色編織提把皮革包，午後陽光把包的影子投在牆上", "A woman in a tobacco-brown knit and wide trousers walks past an off-white plaster wall, the white Braided Leather Bag in her hand, late sun casting its shadow on the wall"), 1792, 2240)];
  // 粉紅包手提行走：象牙白細條紋襯衫與寬褲，參考使用者的手提姿勢（使用者 2026-10-06：「放上官網」）
  sceneExtra["braided-leather-bag-pink"] = [...(sceneExtra["braided-leather-bag-pink"] ?? []), site("scene-pink-bag-walking-ivory-linen.webp", t("穿象牙白細條紋襯衫與寬褲的女子走過米白牆，手提粉紅色編織提把皮革包，牆上有柔和的光影", "A woman in an ivory pinstripe shirt and wide trousers walks past a cream wall, the pink Braided Leather Bag in her hand, soft shadows on the wall"), 1792, 2240)];
  // 藍色包放在橄欖綠扶手椅上的客廳，橘色系的畫、藤編茶几（使用者 2026-10-06：「放進商品內容頁（要大張）」）
  sceneExtra["braided-leather-bag-blue"] = [...(sceneExtra["braided-leather-bag-blue"] ?? []), site("scene-blue-bag-olive-armchair-rattan.webp", t("暖色客廳一角，橄欖綠毛圈布扶手椅上靠著藍色編織提把皮革包；牆上是橘色系的抽象大圓弧畫，椅子左邊是一張藤編茶几", "A warm corner of a living room: the blue Braided Leather Bag rests on an olive bouclé armchair, an orange arched abstract painting on the wall and a woven rattan side table to the left"), 1520, 2688)];
  // 白包肩背近拍：深藍薄紗襯衫、側光照出荔枝紋（使用者 2026-10-06：「放上官網」）
  sceneExtra["braided-leather-bag-white"] = [...(sceneExtra["braided-leather-bag-white"] ?? []), site("scene-white-bag-shoulder-navy-silk.webp", t("穿深藍薄紗襯衫的女子側身，白色編織提把皮革包背在肩上、貼著身側，側光照出荔枝紋皮革", "A woman in a sheer navy blouse in profile, the white Braided Leather Bag on her shoulder close to her side, side light raking across the lychee-grain leather"), 1792, 2240)];
  sceneExtra["braided-leather-bag-blue"] = [...(sceneExtra["braided-leather-bag-blue"] ?? []), site("scene-blue-bag-shoulder-oatmeal-coat.webp", t("穿燕麥色羊毛大衣的女子側身回望，藍色編織提把皮革包背在肩上、貼著身側", "A woman in an oatmeal wool coat glances back over her shoulder, the blue Braided Leather Bag worn on her shoulder close to her side"), 1792, 2240)];
  for (const slug of ["twin-goldfish-earrings", "braided-leather-bag-blue", "cloud-coaster"]) sceneExtra[slug] = [...(sceneExtra[slug] ?? []), site("scene-twin-earring-profile-mustard-sofa.webp", t("金髮女子靠在芥末黃毛圈沙發上的側臉，耳垂上戴著雙星小金魚耳環；小邊桌上雲朵杯墊承著一杯小金魚茶，旁邊是藍色編織提把皮革包", "A blonde woman in profile on a mustard bouclé sofa, wearing the Twin Goldfish Earrings; on a side table a glass of goldfish tea on a Cloud Coaster beside the blue Braided Leather Bag"), 1792, 2240)];
  // a second dessert-tray scene: a desert lounge with a larger marble table (user 2026-10-05)
  // a third: a fireplace lounge at night, after the user's hotel afternoon-tea references (2026-10-05); flutes, teapot and jars removed, the tray at true size; v2 stands it on the tabletop, further right (user: 「應該在桌面上，不要往上浮，並右移」)
  sceneExtra["prosperity-dessert-stand"] = [...(sceneExtra["prosperity-dessert-stand"] ?? []), site("scene-dessert-stand-fireplace-lounge-v2.webp", t("夜晚的酒廊，大理石層架與壁爐火光前，深色桌上的豐盛點心盤擺著幾樣精緻小點心，旁邊一杯紅茶、巧克力與閃電泡芙", "A lounge at night, backlit marble shelves and a fire behind: on a dark table the Abundance Dessert Tray with a few refined petits fours, a cup of tea, chocolates and an éclair"), 1792, 2240)];
  sceneExtra["prosperity-dessert-stand"] = [...(sceneExtra["prosperity-dessert-stand"] ?? []), site("scene-dessert-stand-marble-desert-lounge.webp", t("落地玻璃窗外是陽光下的沙漠與金合歡樹，暖白大理石圓桌上的豐盛點心盤擺著幾樣小點心，旁邊是玻璃茶壺與白瓷茶杯，前景是干邑色皮椅", "Beyond a glass wall, a sunlit desert and an acacia; on a round warm-white marble table the Abundance Dessert Tray with a few petits fours, a glass teapot and a white cup, cognac leather chairs in front"), 1792, 2240)];
  // the lounge scene shows the Reunion paulownia box beside the goldfish tea (2026-10-05)
  sceneExtra["reunion-paulownia-gift-box"] = [...(sceneExtra["reunion-paulownia-gift-box"] ?? []), site("scene-olive-mustard-lounge-pink-bag-tea.webp", t("灰褐色客廳裡，粉紅色編織提把皮革包放在橄欖綠毛圈扶手椅上，胡桃木茶几上有一杯小金魚茶與團圓桐木木盒，右邊芥末黃躺椅與地毯上灑著窗格光影", "In a taupe living room, the pink Braided Leather Bag on an olive bouclé armchair; on a walnut coffee table a glass of goldfish tea and the Reunion paulownia box; window light falls across a mustard lounge chair and the rug"), 1792, 2240)];
  // Interior scenes of the wooden tableware (user-approved 2026-10-01, gallery CV-0447 / CV-0448, output/wooden-goods-interior-scenes-2026-10-01):
  // they lead the scenes of the pieces they show.
  // 2026-10-02 (user: 「這張商品的情境照要換室內擺飾…喜歡他光影的呈現」, logos where the real pieces carry them): a new sunlit interior
  // replaces the black tray table by the sofa (scene-wooden-tray-table-sofa.webp, still in git).
  const woodenSofa = site("scene-wooden-interior-sunlit.webp", t("陽光從窗邊斜射在米白色圓形石灰桌面上，雲朵杯墊、梅花形木盒與銀杏茶匙各自刻著 CHARMVILLA，旁邊是毛圈布沙發與橡木長凳", "Low sun through a window across a round off-white plaster table: a cloud coaster, a plum-blossom wooden box and a ginkgo teaspoon, each engraved CHARMVILLA, beside a bouclé sofa and an oak bench"), 1792, 2240);
  const woodenCloseup = site("scene-wooden-tray-table-closeup-v2.webp", t("木筷擱在鳥形筷架上，旁邊一片刻著 CHARMVILLA 的雲朵杯墊，黑色托盤邊几，後方是橄欖綠毛呢沙發", "Wooden chopsticks on a Songbird Chopsticks Rest beside a Cloud Coaster engraved CHARMVILLA on a black tray table, an olive bouclé sofa behind"));
  // after the user's coffee-table reference (2026-10-02: the vase and a book 換 our pieces, plus a cup of goldfish tea, the tag correct)
  const coffeeTable = site("scene-coffee-table-tea-coasters-tagfix.webp", t("陽光斜照的米白石灰咖啡桌上，書上一只玻璃杯泡著小金魚茶包，杯下墊著雲朵杯墊；旁邊另一片雲朵杯墊與銀杏茶匙，各自刻著 CHARMVILLA", "Low sun across an off-white plaster coffee table: a glass cup of goldfish tea on a cloud coaster on a book, and beside it another cloud coaster and the ginkgo teaspoon, each engraved CHARMVILLA"), 1792, 2240);
  // the tray table by the olive sofa, box, coaster and spoon engraved CHARMVILLA (user 2026-10-05: 「換剛剛那張」 on the spoon's
  // ottoman photograph, which stays in the repo)
  const traySofa = site("scene-wooden-tray-table-sofa-v4.webp", t("橄欖綠沙發旁的黑色托盤邊几，刻著 CHARMVILLA 的梅花木盒、雲朵杯墊與銀杏茶匙", "A black tray table by an olive sofa: a plum-blossom box, a Cloud Coaster and a Ginkgo Style Tea Spoon, each engraved CHARMVILLA"), 1376, 2048);
  const sceneLead: Record<string, Img[]> = {
    // the only scene of the Raw Gold earring, so its listing card has a hover image too. The user's chosen model (dark green
    // satin), the goldfish outline taken from the brand's own silhouette, matte gold generated
    // (output/raw-gold-earring-scene-2026-10-01/v4-official-outline, approved 2026-10-01).
    // Every earring's hover image in the drop earring's language (user 2026-10-02: 「金飾系列的 hover 圖都參考這個，黑白背景，金飾彩色」;
    // people after the user's references, never facing the camera, faces invented): black and white, only the piece in colour.
    // The earring is generated on the sitter, never pasted on (user 2026-10-02: 「飾品真戴在圖裡面…不要分開處理」).
    "pearl-chain-goldfish-earrings": [site("scene-pearl-chain-goldfish-earrings-profile-bw-v2.webp", t("黑白照片，長髮女子一手扶著後頸，耳垂上的珍珠長鏈小金魚耳環是唯一的彩色", "Black-and-white photograph of a woman with long hair, a hand at the nape of her neck; the Pearl Chain Goldfish Earring is the only color"), 1792, 2240)],
    "diamond-goldfish-stud-earrings": [site("scene-diamond-goldfish-stud-earrings-profile-bw-v2.webp", t("黑白照片，短黑髮女子側頭低眼，耳垂上的鑽石小金魚耳釘是唯一的彩色", "Black-and-white photograph of a woman with short black hair, head turned and eyes lowered; the diamond goldfish stud is the only color"), 1792, 2240)],
    "twin-goldfish-earrings": [site("scene-twin-goldfish-earrings-profile-bw-v2.webp", t("黑白側臉照片，金髮綁馬尾的女子手撫後頸，耳垂上的雙魚小金魚耳環是唯一的彩色", "Black-and-white profile of a blonde woman with a ponytail, a hand at the nape of her neck; the Twin Goldfish Earring is the only color"), 1792, 2240)],
    "raw-gold-goldfish-earrings": [site("scene-raw-gold-goldfish-earrings-profile-bw-v3.webp", t("黑白側臉照片，低髮髻的女子坐在沙發邊平視前方，耳垂上的璞金小金魚耳釘是唯一的彩色", "Black-and-white profile of a woman with a low bun seated at the edge of a sofa, looking ahead; the Raw Gold goldfish earring is the only color"), 1792, 2240),
      site("scene-raw-gold-earring-model.webp", t("璞金小金魚耳環配戴在耳垂上，霧面金，墨綠緞面", "Raw Gold goldfish earring worn on the earlobe, matte gold, against dark green satin"))],
    // black-and-white profile, only the earring in colour (user 2026-10-02: 側臉、黑白照片，只有耳環是彩色); a new image, the face
    // invented, generated with the site's own photograph of the earring as reference
    // the bezel: the brand's CV-0371 turned black and white with only the earring kept in colour (2026-10-05, no generation)
    "diamond-bezel-goldfish-earrings": [site("scene-diamond-bezel-goldfish-earring-profile-bw.webp", t("黑白側臉照片，閉眼的女子在布幔之間，耳垂上的包鑲吐鑽小金魚耳環是唯一的彩色", "Black-and-white profile of a woman with closed eyes between drapes; the bezel-set diamond goldfish earring is the only color"), 1920, 2400)],
    "diamond-goldfish-earrings": [site("scene-diamond-goldfish-earring-profile-bw.webp", t("黑白側臉照片，閉眼的短髮女子，耳垂上的鑽石垂墜小金魚耳環是唯一的彩色", "Black-and-white profile of a short-haired woman with her eyes closed; the diamond goldfish drop earring on her lobe is the only color"), 1792, 2240)],
    "cloud-coaster": [coffeeTable, woodenSofa, woodenCloseup], "ginkgo-teaspoon-gift-box": [traySofa, woodenSofa, coffeeTable],
    "wooden-chopsticks": [woodenCloseup], // off the bird page (user 2026-10-05: 「刪」)
  };
  // Further studio views beside the front view: the bags' three-quarter view. No near-duplicates in a product's gallery: the
  // earrings' close photographs repeated the front view, so each earring keeps only its better shot (user 2026-10-02: 「這個位置的圖
  // 不要重複，挑一張品質比較好的保留就好」) — the 2000 px studio front for the pearl, diamond and twin earrings, and the front view for
  // Raw Gold too (2026-10-05: 「比例太大，應該要跟其他金飾視覺上是一樣大」; the close view had replaced it on 2026-10-01).
  const studioExtra: Record<string, { file: string; zh: string; en: string; enAlt: string }[]> = {
    // the cover is now the set with its dessert-paper folder and gold box on the listing ground (user 2026-10-05: 「豐盛系列的商品大圖用這個去改淺灰背景」);
    // the tray on its own follows (the earlier CV-0120 set view was the same arrangement, so it is not repeated)
    "prosperity-dessert-stand": [{ file: "studio2k-prosperity-dessert-stand-v2.webp", zh: "點心盤", en: "The tray", enAlt: "the three-tier tray on its own" }],
    // the brand's own photograph of the box, straight on, on the same light floor (asset library 2400 px cut-outs, 2026-10-02:
    // 「更多的官網素材可以從這個網站抓」); the generated three-quarter view stays the cover
    ...Object.fromEntries(["purple-butterfly", "year-of-plenty", "winter-blossom", "kyoto", "blossoming-prosperity"].map((s) => [`${s}-gift-box`, [{ file: `studio-${s}-gift-box-official.webp`, zh: "官方商品照", en: "Official photograph", enAlt: "official photograph" }]])),
    "braided-leather-bag-white": [{ file: "studio-braided-leather-bag-white-angle-hd.webp", zh: "斜側面", en: "Three-quarter view", enAlt: "three-quarter view" }],
    "braided-leather-bag-blue": [{ file: "studio-braided-leather-bag-blue-angle-hd.webp", zh: "斜側面", en: "Three-quarter view", enAlt: "three-quarter view" }],
    "braided-leather-bag-pink": [{ file: "studio-braided-leather-bag-pink-angle-hd-v2.webp", zh: "斜側面", en: "Three-quarter view", enAlt: "three-quarter view" }],
  };
  // Photographs a product page leaves out (user 2026-10-01, on the coaster page: 「這 2 張不要」 — the box under branch shadows and the
  // flat lay of every wooden piece on stone).
  const sceneOmit: Record<string, string[]> = {
    "cloud-coaster": ["CV-0232", "CV-0231"].map((id) => `/media/gallery/${id}.webp`),
    // the three event photographs of the stands (CV-0068 / 0074 / 0081) are off the dessert tray page (user 2026-10-05: 「刪」)
    "prosperity-dessert-stand": ["CV-0068", "CV-0074", "CV-0081"].map((id) => `/media/gallery/${id}.webp`),
    // 白包頁拿掉白、藍兩只包在檯座上的照片（使用者 2026-10-06：「刪」）
    "braided-leather-bag-white": ["/media/gallery/CV-0426.webp"],
    // 藍包頁拿掉米色大衣背影照（使用者 2026-10-06：標叉）
    "braided-leather-bag-blue": ["/media/gallery/CV-0423.webp"],
  };
  // off every page (user 2026-10-02: 「刪」 — the near-identical flat lays of all the wooden pieces on stone, then the third copy CV-0234)
  const omitEverywhere = ["CV-0231", "CV-0232", "CV-0234"].map((id) => `/media/gallery/${id}.webp`);
  // Not scenes: studio composites and their sources (cut-outs, the plain product shots the composites were made from).
  const studioSources = new Set(["CV-0398", "CV-0400", "CV-0419", "CV-0420", "CV-0399", "CV-0397", "CV-0256"].map((id) => `/media/gallery/${id}.webp`));
  // An explicit order where the photographs would otherwise leave a half-empty row: the bird rest's three portraits run down
  // the information column and its two landscapes close the page as one full row.
  const sceneOrder: Record<string, string[]> = {
    // the white bag's hover shows a person with the bag, like the blue and pink ones (user 2026-10-05: 「hover 也改成人物跟包」)
    // 白包卡片 hover 改用手提行走照（使用者 2026-10-06：「白色包包 商品 hover 用這張」），所以它排第一
    "braided-leather-bag-white": ["/media/site/scene-white-bag-walking-tobacco.webp", "/media/gallery/CV-0422.webp", "/media/site/scene-white-bag-shoulder-navy-silk.webp"],
    // 藍色：新照片排在第一張情境照（也是卡片 hover 圖）後面（使用者 2026-10-06：「這2個放上官網商品內容頁」）
    "braided-leather-bag-blue": ["/media/site/scene-blue-bag-shoulder-oatmeal-coat.webp", "/media/site/scene-blue-bag-olive-armchair-rattan.webp", "/media/site/scene-twin-earring-profile-mustard-sofa.webp"],
    // 粉紅：手提行走的新照片排在第一張情境照後面（使用者 2026-10-06：「放上官網」）
    "braided-leather-bag-pink": ["/media/gallery/CV-0424.webp", "/media/site/scene-pink-bag-armchair-olive-v2.webp", "/media/site/scene-pink-bag-walking-ivory-linen.webp"], // 扶手椅照與手提行走照左右交換（使用者 2026-10-06）
    "bird-chopstick-rest": ["/media/site/scene-bird-rest-gift-box-v2.webp", "/media/site/scene-oak-table-bird-rests.webp", "/media/site/scene-bird-rest-tray-closeup.webp"],
  };
  const isStudioLike = (img: Img) => Boolean(img.cutout) || studioSources.has(img.src) || /^\/media\/(site\/(studio-|featured-|jewelry-)|gift-boxes\/)/.test(img.src);
  const withListing = (p: Product): Product => {
    const file = (studioListing as Record<string, string>)[p.slug];
    const studio = file ? site(file, studioAlt(p.name)) : undefined;
    const sceneId = listingScene[p.slug];
    const lead = [...(p.slug === "bird-chopstick-rest" ? [] : sceneLead[p.slug] ?? []), listingSceneSite[p.slug], ...(sceneAfterLead[p.slug] ?? []), sceneId ? gallery(sceneId, t(`${p.name}・情境照`, `${p.name}, in context`)) : undefined].filter((x): x is Img => Boolean(x));
    // A product without a studio photograph yet (the diamond stud) keeps its own first image as cover and only view.
    const views: ProductView[] = studio
      ? [{ label: t("正面", "Front view"), image: studio }, ...(studioExtra[p.slug] ?? []).map((v) => ({ label: t(v.zh, v.en), image: site(v.file, `${p.name}${t("・", ", ")}${t(v.zh, v.enAlt)}`) }))]
      : p.views.slice(0, 1);
    const shown = new Set(views.map((v) => v.image.src));
    // the bird rest keeps its own photograph first; the new interior follows it
    const scenes = [...lead, ...p.views.map((v) => v.image), ...(p.story.image ? [p.story.image] : []), ...(p.slug === "bird-chopstick-rest" ? sceneLead[p.slug] ?? [] : []), ...(sceneExtra[p.slug] ?? [])]
      .filter((img, i, list) => !shown.has(img.src) && !isStudioLike(img) && !(sceneOmit[p.slug] ?? []).includes(img.src) && !omitEverywhere.includes(img.src) && list.findIndex((x) => x.src === img.src) === i);
    const order = sceneOrder[p.slug]; if (order) scenes.sort((a, b) => order.indexOf(a.src) - order.indexOf(b.src));
    return { ...p, image: views[0].image, hoverImage: scenes[0], views, scenes };
  };
  const products: Product[] = [...bagProducts, ...jewelryProducts, ...teaProducts, ...teawareProducts].map(withShopify).map(withListing);
  return { categories, products, bagProducts, jewelryProducts, teaProducts, teawareProducts };
};

const catalogs: Partial<Record<Locale, ReturnType<typeof buildCatalog>>> = {};
/** The catalogue in one language (built once per language). */
export const getCatalog = (lang: Locale = "zh") => (catalogs[lang] ??= buildCatalog(lang));

const prefix = (lang: Locale) => (lang === "en" ? "/en" : "");
// Chinese (source) catalogue under the original names, for code that is not locale-aware.
export const categories = getCatalog("zh").categories;
export const products: Product[] = getCatalog("zh").products;
export const getProducts = (lang: Locale = "zh") => getCatalog(lang).products;
export const getCategories = (lang: Locale = "zh") => getCatalog(lang).categories;
export const isSellable = (p: Product) => Boolean(p.price || p.shopify?.variantId);
export const formatPrice = (amount: number, currency = "TWD") => currency === "TWD" ? `NT$ ${amount.toLocaleString("en-US")}` : new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
export const productHref = (product: Product | string, lang: Locale = "zh") => `${prefix(lang)}/products/${typeof product === "string" ? product : product.slug}`;
export const categoryHref = (category: string, lang: Locale = "zh") => `${prefix(lang)}/collections/${category}`;
export const findProduct = (slug: string, lang: Locale = "zh") => getProducts(lang).find((p) => p.slug === slug);
export const getCategory = (id: string, lang: Locale = "zh") => getCategories(lang).find((c) => c.id === id);
export const getCategoryProducts = (id: string, lang: Locale = "zh") => id === "all" ? getProducts(lang) : getProducts(lang).filter((p) => p.category === id);
export const bagCatalog = getCatalog("zh").bagProducts;
export const jewelryCatalog = getCatalog("zh").jewelryProducts;
export const teaCatalog = getCatalog("zh").teaProducts;
export const teawareCatalog = getCatalog("zh").teawareProducts;
