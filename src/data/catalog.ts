import { teaGiftProductsFor, type TeaContents } from "./tea-gifts";
import { christmasGiftProductsFor } from "./christmas-gifts";
import shopifyMap from "./shopify-map.json";
import studioListing from "./studio-listing.json";
import { getContent, gallery, site, type Img } from "./content";
import type { Locale } from "../i18n/config";

// Product facts come from the existing approved content and asset manifest.
// No inferred prices, stock, metal purity, gemstone grades, sizes or tea brewing times. Prices, metal and sizes added
// 2026-10-02 are copied from www.charmvilla.com.tw product pages (read that day); where the official page could not be
// matched to a piece with certainty (the two diamond earrings, the Prosperity stands), nothing was added.
//
// Bilingual (2026-10-01): buildCatalog(lang) builds the same products in Chinese (the source) or English. Every visible
// string is written as t("中文", "English"); slugs, images, prices and Shopify ids are shared.
export type CategoryId = "bags" | "jewelry" | "tea" | "teaware";
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
  /** Shopify handle + variant GID from src/data/shopify-map.json; empty until the store is connected. */
  shopify?: { handle: string; variantId: string };
  giftBox?: { pieces: number; series: string; contents: TeaContents; choices?: { label: string; contents: TeaContents; price?: number }[] };
};

const buildCatalog = (lang: Locale) => {
  const t = (zh: string, en: string) => (lang === "en" ? en : zh);
  const { bags, jewelry } = getContent(lang);

  const categories: Category[] = [
    { id: "bags", name: t("真皮包", "Leather Bags"), en: "LEATHER BAGS", intro: t("從交織的提把看向包身，細紋與線條各有秩序。拿起一只皮革包，也把對材質的欣賞帶進日常。", "Follow the plaited handle down to the body: grain and line each keep their own order. To pick up a leather bag is to bring an eye for material into the everyday.") },
    { id: "jewelry", name: t("金飾", "Goldfish Jewelry"), en: "GOLDFISH JEWELRY", intro: t("金魚的輪廓縮小至耳畔，光澤便有了貼近肌膚的尺度。轉身之間，欣賞金面、珍珠與鑽石各自的表情。", "Scaled down to the ear, the goldfish outline brings its lustre close to the skin. As you turn, the gold surface, the pearl and the diamond each show a different expression.") },
    { id: "tea", name: t("小金魚茶包禮盒", "Goldfish Tea Gifts"), en: "GOLDFISH TEA GIFTS", intro: t("從織布的經緯到桐木的紋理，一盒茶也有值得細看的風景。以禮盒收藏手作的小金魚，依盒型、入數與茶款，選一份走進日常的心意。", "From the warp and weft of the fabric to the grain of paulownia wood, a box of tea holds scenery worth a closer look. Each gift box keeps a set of handmade goldfish. Choose by box, count and tea for a gesture that finds its way into daily life.") },
    { id: "teaware", name: t("茶器與工藝", "Teaware & Craft"), en: "TEAWARE & CRAFT", intro: t("餐桌上的陳列，隨每次使用而改變。點心架的高低、茶匙的弧線與木紋，讓日常器物有了值得停留的細節。", "What sits on the table changes with every use. The tiers of a dessert stand, the curve of a teaspoon and the grain of its wood give everyday objects details worth lingering over.") },
  ];

  const bagProducts: Product[] = bags.products.map((p) => ({
    slug: `braided-leather-bag-${p.id}`, category: "bags", name: t(`${bags.product}・${p.name}`, `${bags.product} · ${p.name}`),
    english: `BRAIDED LEATHER BAG / ${p.en}`, summary: t("交織的提把，連起手與皮革。", "A plaited handle that joins hand and leather."),
    description: t(`${p.name}荔枝紋真皮，搭配扁平三股編織肩帶與扁銅棒五金。提把的編織線條與包身細紋相接，金屬接點則讓柔軟的材質有了清楚的收束。`,
      `${p.name} lychee-grain leather with a flat three-strand plaited strap and a flat brass bar. The lines of the plait meet the grain of the body, and the metal joint gives the soft material a clear point of closure.`),
    image: p.views[0].image, views: p.views.map((v) => ({ label: v.label, image: v.image })),
    facts: [
      { label: t("顏色", "Colour"), value: p.name }, { label: t("材質", "Material"), value: t("荔枝紋真皮", "Lychee-grain leather") },
      { label: t("肩帶", "Strap"), value: t("扁平三股編織", "Flat three-strand plait") }, { label: t("五金", "Hardware"), value: t("扁銅棒", "Flat brass bar") },
      { label: t("發明專利", "Invention patent"), value: "TW I728606" },
    ],
    story: {
      title: t("肩上的一件作品", "A piece for the shoulder"),
      body: t("先看輪廓，再走近。荔枝紋在光線下顯出細微起伏，三股編織沿著提把延伸；當包被提起，原本陳列中的線條，也隨身體的動作進入生活。",
        "Take in the outline first, then come closer. Under light the lychee grain shows its fine relief, and the three-strand plait runs the length of the handle. Once the bag is lifted, lines that sat still on display move with the body and into daily life."),
      image: p.views[2].image,
    },
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
  const jewelryDetails = [
    t("珍珠、長鏈與金魚", "Pearl, long chain and goldfish"),
    t("金魚、短鏈與爪鑲垂墜圓鑽", "Goldfish, short chain and a claw-set round diamond drop"),
    t("單尾金魚耳釘、魚口圓鑽、無垂墜", "Single goldfish stud, round diamond at the mouth, no drop"),
    t("兩尾金魚以短鏈相連", "Two goldfish joined by a short chain"),
    t("單尾小金魚、霧面金屬表面", "Single small goldfish, matte metal surface"),
  ];
  const jewelryExtra: Record<number, Img[]> = {
    0: [gallery("CV-0377", t("珍珠長鏈小金魚耳環・石面光影", "Pearl Chain Goldfish Earrings in light and shadow on stone")), gallery("CV-0379", t("珍珠長鏈小金魚耳環・橄欖綠花影", "Pearl Chain Goldfish Earrings among olive-green floral shadows")), gallery("CV-0380", t("珍珠長鏈小金魚耳環・米白衣領", "Pearl Chain Goldfish Earrings against a cream collar"))],
    1: [gallery("CV-0372", t("小金魚耳環・鑽石系列・垂墜・配戴", "Goldfish Earrings, Diamond Series drop, as worn")), gallery("CV-0370", t("小金魚耳環・鑽石系列・垂墜・暗調肖像", "Goldfish Earrings, Diamond Series drop, a low-key portrait")), gallery("CV-0371", t("小金魚耳環・鑽石系列・垂墜・側臉", "Goldfish Earrings, Diamond Series drop, in profile")), site("goldfish-drop-sketch.webp", t("小金魚耳環・鑽石系列・垂墜・炭筆素描配戴圖", "Goldfish Earrings, Diamond Series drop, charcoal sketch of the piece as worn"), 896, 1120)],
    2: [gallery("CV-0374", t("小金魚耳環・鑽石系列・耳釘・深綠靜影", "Goldfish Earrings, Diamond Series stud, a still life in deep green")), gallery("CV-0373", t("小金魚耳環・鑽石系列・耳釘・配戴", "Goldfish Earrings, Diamond Series stud, as worn")), site("goldfish-stud-sketch.webp", t("小金魚耳環・鑽石系列・耳釘・炭筆素描配戴圖", "Goldfish Earrings, Diamond Series stud, charcoal sketch of the piece as worn"), 896, 1120)],
    3: [gallery("CV-0378", t("小金魚耳環・雙魚系列・配戴", "Goldfish Earrings, Twin Series, as worn"))],
  };
  const jewelryEditorial = [
    {
      description: t("珍珠與長鏈向下延伸，金魚停在鏈末。從耳畔到頸側，細長的線條把觀看的距離拉開，也讓魚形的比例更容易被看見。", "Pearl and long chain extend downward, and the goldfish rests at the chain's end. From the ear to the side of the neck, the slender line opens up the distance of looking and makes the proportions of the fish easier to see."),
      title: t("垂落的線，游動的形", "A falling line, a swimming form"),
      body: t("動作，讓線條有了變化。長鏈隨轉身輕移，珍珠與金魚各自接住光線；靜止時的構圖，到了配戴者身上，又是另一幅畫面。", "Movement changes the line. The long chain shifts as you turn, and pearl and goldfish each catch the light. A composition at rest becomes another picture on the person who wears it."),
    },
    {
      description: t("一尾小金魚停在耳畔，短鏈之下垂著一顆爪鑲圓鑽。金面與鑽石的明暗不同，隨動作各自接住光，讓魚形與那一點光之間有了距離。", "One small goldfish rests at the ear; below a short chain hangs a claw-set round diamond. Gold surface and diamond differ in brightness and catch the light separately as you move, leaving a distance between the fish and that point of light."),
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
  ];
  // www.charmvilla.com.tw (2026-10-02): K18 gold, made in Taiwan, sold per single earring, made to order in about 25–60 days,
  // not shipped overseas. List prices only where the official page is certainly this piece.
  const jewelryPrices: Record<string, number> = { "pearl-chain-goldfish-earrings": 9600, "twin-goldfish-earrings": 9600, "raw-gold-goldfish-earrings": 5500 };
  const jewelryFacts = (slug: string) => [
    { label: t("材質", "Material"), value: slug === "pearl-chain-goldfish-earrings" ? t("K18 純金、珍珠", "18K gold, pearl") : t("K18 純金", "18K gold") },
    { label: t("販售單位", "Sold as"), value: t("單只（單耳）", "A single earring") },
    { label: t("產地", "Made in"), value: t("台灣", "Taiwan") },
    { label: t("製作時間", "Making time"), value: t("訂製商品，約 25–60 天；訂購前請先來電洽詢", "Made to order in about 25–60 days; please call before ordering") },
    { label: t("寄送", "Delivery"), value: t("金飾不提供海外寄送", "Jewelry is not shipped overseas") },
  ];
  const jewelryProducts: Product[] = jewelry.items.map((p, i) => ({
    slug: jewelrySlugs[i], category: "jewelry", name: p.title, english: jewelryEnglish[i],
    summary: p.desc, description: jewelryEditorial[i].description,
    image: p.image, views: [{ label: t("商品照", "Product photograph"), image: p.image }, ...(jewelryExtra[i] || []).map((image, j) => ({ label: t(`情境 ${j + 1}`, `Scene ${j + 1}`), image }))],
    facts: [{ label: t("系列", "Series"), value: t("小金魚金飾", "Goldfish Jewelry") }, { label: t("款式", "Style"), value: p.title }, { label: t("設計細節", "Design details"), value: jewelryDetails[i] }, ...jewelryFacts(jewelrySlugs[i])],
    ...(jewelryPrices[jewelrySlugs[i]] ? { price: { amount: jewelryPrices[jewelrySlugs[i]], currency: "TWD" as const } } : {}),
    story: { title: jewelryEditorial[i].title, body: jewelryEditorial[i].body, image: jewelryExtra[i]?.[0] },
  }));

  // Seasonal editions lead the tea listing; the 16 official gift boxes follow.
  const teaProducts: Product[] = [...christmasGiftProductsFor(lang), ...teaGiftProductsFor(lang)];

  const prosperity = t("豐盛系列", "Prosperity Series"), wooden = t("木質餐具", "Wooden Tableware");
  const tablewareEntries = [
    { slug: "prosperity-dessert-stand", name: t("下午茶點心架", "Afternoon Tea Dessert Stand"), en: "DESSERT STAND", series: prosperity, ids: ["CV-0068", "CV-0074", "CV-0081"],
      summary: t("把點心與茶，安放在同一席風景。", "Sweets and tea, set within one view."),
      detail: t("以點心架整理茶席上的高低與層次。從擺放到取用，讓下午茶有自己的節奏。", "A dessert stand brings height and layers to the tea table. From arranging to serving, afternoon tea finds its own rhythm."),
      story: { title: t("餐桌上的高與低", "Highs and lows on the table"), body: t("擺放，也是一種構圖。點心有了不同的高度，杯與盤之間便多了可觀看的層次；每次相聚，都能重新安排這一席景致。", "Arranging is a kind of composition. With sweets at different heights there are more layers to look at between cup and plate, and every gathering is a chance to set the scene anew.") } },
    { slug: "prosperity-stand-gift-box", name: t("點心架與包裝禮盒", "Dessert Stand with Gift Box"), en: "DESSERT STAND / GIFT BOX", series: prosperity, ids: ["CV-0121", "CV-0068"],
      summary: t("一份關於茶席，也關於相聚的心意。", "A gesture about the tea table, and about gathering."),
      detail: t("從點心架到包裝，完整觀看豐盛系列的贈禮形式。", "From the stand to its packaging: the Prosperity Series as it is given."),
      story: { title: t("從打開禮盒開始", "It begins with opening the box"), body: t("送出一件器物，也邀請對方想像它的位置。點心架從盒中來到桌上，與家中的杯盤相伴，禮物便開始參與下一次相聚。", "To give an object is to invite someone to imagine where it will sit. The stand moves from box to table, keeps company with the cups and plates of the house, and the gift begins to take part in the next gathering.") } },
    // 2026-10-02 (user: 「這些商品是分開販售，不要擅自合併」): the cloud coasters are their own product on www.charmvilla.com.tw
    // (id 156); the old "木質杯墊與茶匙" listing merged them with the ginkgo teaspoon, which is sold on its own below.
    { slug: "cloud-coaster", name: t("雲朵杯墊", "Cloud Coasters"), en: "CLOUD COASTERS", series: wooden, ids: ["CV-0232"],
      summary: t("一杯茶的旁邊，木紋靜靜相伴。", "Beside a cup of tea, wood grain keeps quiet company."),
      detail: t("雲朵形狀的檜木杯墊，把木質的紋理帶到茶杯旁。一組六片，近看表面，也觀察每一片的輪廓。", "Cloud-shaped hinoki coasters bring the grain of wood to the side of the cup. Six to a set: look closely at the surface, and at the outline of each piece."),
      story: { title: t("茶杯旁的木紋", "Wood grain beside the cup"), body: t("手先於目光感受材質。每一次放下茶杯，杯墊表面的紋理與雲朵的輪廓，便一次次回到注意之中。", "The hand knows the material before the eye does. Each time a cup is set down, the grain of the surface and the outline of the cloud come back to attention.") } },
    { slug: "bird-chopstick-rest", name: t("鳥形筷架", "Bird Chopstick Rest"), en: "BIRD CHOPSTICK REST", series: t("茶席器物", "Objects for the Tea Table"), ids: ["CV-0256", "CV-0248", "CV-0239"],
      summary: t("讓一雙筷子，有一處停歇。", "A place for a pair of chopsticks to rest."),
      detail: t("以鳥的輪廓構成筷架。小小一件，在餐具與桌面之間，留下有形的留白。", "A chopstick rest drawn from the outline of a bird. A small thing that leaves a shaped pause between tableware and table."),
      story: { title: t("餐具之間，一隻鳥", "A bird among the tableware"), body: t("筷子放下時，鳥形的輪廓便與修長的線條相遇。一件小器物改變了桌面的構圖，也讓用餐間的停頓有了可看的細節。", "When the chopsticks are set down, the bird's outline meets their long line. One small object changes the composition of the table and gives the pauses in a meal a detail to look at.") } },
    { slug: "ginkgo-teaspoon-gift-box", name: t("銀杏茶匙", "Ginkgo Teaspoon"), en: "GINKGO TEASPOON", series: wooden, ids: ["CV-0231", "CV-0234", "CV-0229"],
      summary: t("把一片葉子的形，留在茶席上。", "The shape of a leaf, kept at the tea table."),
      detail: t("銀杏的輪廓成為茶匙的造型，木紋則為每一次觀看帶來不同細節。以禮盒呈現，收藏一份茶席心意。", "The outline of a ginkgo leaf becomes the form of a teaspoon, and the wood grain offers a different detail each time you look. Presented in a gift box: a tea-table gesture to keep."),
      story: { title: t("一片葉子的轉譯", "A leaf, translated"), body: t("葉形來到茶席。銀杏的輪廓經由茶匙與木質呈現，既可近看造型，也能在取用之間，感受自然形態如何走入生活。", "A leaf shape arrives at the tea table. The ginkgo outline is rendered in a teaspoon and in wood: a form to look at closely and, in use, a way to sense how a natural shape enters daily life.") } },
    { slug: "wooden-chopsticks", name: t("檜木筷子", "Hinoki Chopsticks"), en: "HINOKI CHOPSTICKS", series: wooden, ids: ["CV-0243", "CV-0245", "CV-0227"],
      summary: t("從一雙木筷，開始日常的一餐。", "An everyday meal begins with a pair of wooden chopsticks."),
      detail: t("沿著修長線條看見木質紋理。與鳥形筷架搭配，在餐桌上形成一組安靜的物件。", "Follow the long line and the grain of the wood appears. Paired with the bird chopstick rest, they form a quiet set on the table."),
      story: { title: t("每日使用的線條", "A line used every day"), body: t("一雙筷子，常在手邊。從修長的外形看到木紋，熟悉的餐具也有可細讀之處；與鳥形筷架一同擺放，便形成餐桌上的小幅構圖。", "A pair of chopsticks is always within reach. From their long shape to the grain of the wood, even familiar tableware has something to read closely; set beside the bird chopstick rest, they make a small composition on the table.") } },
  ];
  const teawareOfficial: Record<string, { price: number; facts: { label: string; value: string }[] }> = {
    "cloud-coaster": { price: 1880, facts: [
      { label: t("販售單位", "Sold as"), value: t("6 片／組", "6 per set") },
      { label: t("材質", "Material"), value: t("台灣一級檜木", "Taiwan cypress (hinoki), first grade") },
      { label: t("尺寸", "Size"), value: "8 × 10 cm" },
      { label: t("包裝", "Packaging"), value: t("外盒盒蓋以傳統織布機手工梭織", "Box lid hand-woven on a traditional loom") },
    ] },
    "wooden-chopsticks": { price: 680, facts: [
      { label: t("販售單位", "Sold as"), value: t("2 雙／組（不含鳥形筷架）", "2 pairs per set (bird chopstick rest not included)") },
      { label: t("材質", "Material"), value: t("台灣一級檜木", "Taiwan cypress (hinoki), first grade") },
      { label: t("尺寸", "Size"), value: t("長 23 cm", "Length 23 cm") },
    ] },
    "ginkgo-teaspoon-gift-box": { price: 760, facts: [
      { label: t("販售單位", "Sold as"), value: t("1 只／盒", "1 per box") },
      { label: t("材質", "Material"), value: t("檜木", "Cypress (hinoki)") },
      { label: t("尺寸", "Size"), value: t("長 15.7 cm", "Length 15.7 cm") },
      { label: t("設計", "Design"), value: "蘇靜媚" },
    ] },
  };
  const teawareProducts: Product[] = tablewareEntries.map((p) => ({
    slug: p.slug, category: "teaware", name: p.name, english: p.en, summary: p.summary, description: p.detail,
    image: gallery(p.ids[0], p.name), views: p.ids.map((id, i) => ({ label: i ? t(`細節 ${i}`, `Detail ${i}`) : t("商品全貌", "Full view"), image: gallery(id, p.name) })),
    facts: [
      { label: t("系列", "Series"), value: p.series }, { label: t("品項", "Item"), value: p.name },
      { label: t("使用情境", "Use"), value: p.series === prosperity ? t("下午茶與點心擺放", "Afternoon tea and serving sweets") : t("茶席與日常餐桌", "Tea table and everyday dining") },
      ...(teawareOfficial[p.slug]?.facts ?? []),
    ],
    ...(teawareOfficial[p.slug] ? { price: { amount: teawareOfficial[p.slug].price, currency: "TWD" as const } } : {}),
    story: { title: p.story.title, body: p.story.body, image: p.ids[1] ? gallery(p.ids[1], p.name) : undefined },
  }));

  const studioLabel = t("棚拍商品照", "Studio photograph");
  const studioAlt = (name: string) => t(`${name}・棚拍商品照`, `${name}, studio photograph`);
  // Homepage featured grid: studio shots generated 2026-09-30 in the white bag's language (output/featured-editorial-2026-09-30).
  const featuredFiles: Record<string, string> = {
    "ginkgo-teaspoon-gift-box": "featured-ginkgo-teaspoon-gift-box.webp",
    "reunion-paulownia-gift-box": "featured-reunion-paulownia-gift-box.webp",
    "bird-chopstick-rest": "featured-bird-chopstick-rest-55.webp", // the piece at 55 % of the first version, its centre moved up to 53 % of the height (user 2026-10-02: 「小鳥要縮小一點並高度要居中一點」; 70 % before)
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
    "pearl-chain-goldfish-earrings": "CV-0377", "diamond-goldfish-earrings": "CV-0372", "diamond-goldfish-stud-earrings": "CV-0376", "twin-goldfish-earrings": "CV-0378",
    "bird-chopstick-rest": "CV-0248",
  };
  const listingSceneSite: Record<string, Img> = {};
  // 2026-10-01 evening (user, with a screenshot of the white bag page: 「刪」): the two ink-green scenes — the figure looking back
  // (scene-white-bag-over-shoulder-ink-green) and the bag in the air on ink green (gallery CV-0450) — are off the site; the files
  // are in the git history. The white bag's scenes now lead with the bag in the air on Morandi sage.
  const sceneAfterLead: Record<string, Img[]> = {
    "braided-leather-bag-white": [
      // the strap follows the user's reference curve, Morandi sage backdrop (output/white-bag-floating-ink-green-2026-10-01/v2-strap-curve-morandi)
      site("scene-white-bag-floating-morandi.webp", t("編織提把皮革包・白色，在莫蘭迪灰綠背景前懸空，肩帶畫出長弧", "Braided Leather Bag in white, in mid-air against a Morandi sage backdrop, its strap drawing a long arc"))],
  };
  // 2026-10-01 (user: 「先幫我把目前有的都放上官網」): scenes that follow a product's existing scenes.
  const sceneExtra: Record<string, Img[]> = {
    "braided-leather-bag-pink": [site("scene-pink-bag-armchair.webp", t("編織提把皮革包・粉紅色，放在米色皮革單椅的座墊上，背後是一幅藍色筆觸的畫", "Braided Leather Bag in pink on the seat of a beige leather armchair, a blue brush painting behind"))],
  };
  // Interior scenes of the wooden tableware (user-approved 2026-10-01, gallery CV-0447 / CV-0448, output/wooden-goods-interior-scenes-2026-10-01):
  // they lead the scenes of the pieces they show.
  // 2026-10-02 (user: 「這張商品的情境照要換室內擺飾…喜歡他光影的呈現」, logos where the real pieces carry them): a new sunlit interior
  // replaces the black tray table by the sofa (scene-wooden-tray-table-sofa.webp, still in git).
  const woodenSofa = site("scene-wooden-interior-sunlit.webp", t("陽光從窗邊斜射在米白色圓形石灰桌面上，雲朵杯墊、梅花形木盒與銀杏茶匙各自刻著 CHARM VILLA，旁邊是毛圈布沙發與橡木長凳", "Low sun through a window across a round off-white plaster table: a cloud coaster, a plum-blossom wooden box and a ginkgo teaspoon, each engraved CHARM VILLA, beside a bouclé sofa and an oak bench"), 1792, 2240);
  const woodenCloseup = site("scene-wooden-tray-table-closeup.webp", t("木筷擱在鳥形筷架上，旁邊一片雲朵杯墊，黑色托盤邊几特寫", "Wooden chopsticks on a bird-shaped rest beside a cloud-shaped coaster, close view of a black tray table"));
  // after the user's coffee-table reference (2026-10-02: the vase and a book 換 our pieces, plus a cup of goldfish tea, the tag correct)
  const coffeeTable = site("scene-coffee-table-tea-coasters.webp", t("陽光斜照的米白石灰咖啡桌上，書上一只玻璃杯泡著小金魚茶包，杯下墊著雲朵杯墊；旁邊另一片雲朵杯墊與銀杏茶匙，各自刻著 CHARM VILLA", "Low sun across an off-white plaster coffee table: a glass cup of goldfish tea on a cloud coaster on a book, and beside it another cloud coaster and the ginkgo teaspoon, each engraved CHARM VILLA"), 1792, 2240);
  const woodenOttomans = site("scene-wooden-ottomans.webp", t("兩片雲朵杯墊與兩支銀杏茶匙，放在芥末黃織布圓凳上", "Two cloud-shaped coasters and two ginkgo teaspoons on a mustard woven ottoman"));
  const sceneLead: Record<string, Img[]> = {
    // the only scene of the Raw Gold earring, so its listing card has a hover image too. The user's chosen model (dark green
    // satin), the goldfish outline taken from the brand's own silhouette, matte gold generated
    // (output/raw-gold-earring-scene-2026-10-01/v4-official-outline, approved 2026-10-01).
    "raw-gold-goldfish-earrings": [site("scene-raw-gold-earring-model.webp", t("璞金小金魚耳環配戴在耳垂上，霧面金，墨綠緞面", "Raw Gold goldfish earring worn on the earlobe, matte gold, against dark green satin"))],
    // black-and-white profile, only the earring in colour (user 2026-10-02: 側臉、黑白照片，只有耳環是彩色); a new image, the face
    // invented, generated with the site's own photograph of the earring as reference
    "diamond-goldfish-earrings": [site("scene-diamond-goldfish-earring-profile-bw.webp", t("黑白側臉照片，閉眼的短髮女子，耳垂上的鑽石垂墜小金魚耳環是唯一的彩色", "Black-and-white profile of a short-haired woman with her eyes closed; the diamond goldfish drop earring on her lobe is the only colour"), 1792, 2240)],
    "cloud-coaster": [coffeeTable, woodenSofa, woodenOttomans, woodenCloseup], "ginkgo-teaspoon-gift-box": [woodenOttomans, woodenSofa, coffeeTable],
    "wooden-chopsticks": [woodenCloseup], "bird-chopstick-rest": [woodenCloseup],
  };
  // Further studio views beside the front view: the bags' three-quarter view. No near-duplicates in a product's gallery: the
  // earrings' close photographs repeated the front view, so each earring keeps only its better shot (user 2026-10-02: 「這個位置的圖
  // 不要重複，挑一張品質比較好的保留就好」) — the 2000 px studio front for the pearl, diamond and twin earrings, the close view for
  // Raw Gold, whose front view showed the piece too small (studio-listing.json points it at the close view).
  const studioExtra: Record<string, { file: string; zh: string; en: string; enAlt: string }[]> = {
    "braided-leather-bag-white": [{ file: "studio-braided-leather-bag-white-angle-hd.webp", zh: "斜側面", en: "Three-quarter view", enAlt: "three-quarter view" }],
    "braided-leather-bag-blue": [{ file: "studio-braided-leather-bag-blue-angle-hd.webp", zh: "斜側面", en: "Three-quarter view", enAlt: "three-quarter view" }],
    "braided-leather-bag-pink": [{ file: "studio-braided-leather-bag-pink-angle-hd.webp", zh: "斜側面", en: "Three-quarter view", enAlt: "three-quarter view" }],
  };
  // Photographs a product page leaves out (user 2026-10-01, on the coaster page: 「這2張不要」 — the box under branch shadows and the
  // flat lay of every wooden piece on stone).
  const sceneOmit: Record<string, string[]> = { "cloud-coaster": ["CV-0232", "CV-0231"].map((id) => `/media/gallery/${id}.webp`) };
  // Not scenes: studio composites and their sources (cut-outs, the plain product shots the composites were made from).
  const studioSources = new Set(["CV-0398", "CV-0400", "CV-0419", "CV-0420", "CV-0399", "CV-0397", "CV-0256"].map((id) => `/media/gallery/${id}.webp`));
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
    const scenes = [...lead, ...p.views.map((v) => v.image), ...(p.story.image ? [p.story.image] : []), ...(p.slug === "bird-chopstick-rest" ? sceneLead[p.slug] : []), ...(sceneExtra[p.slug] ?? [])]
      .filter((img, i, list) => !shown.has(img.src) && !isStudioLike(img) && !(sceneOmit[p.slug] ?? []).includes(img.src) && list.findIndex((x) => x.src === img.src) === i);
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
