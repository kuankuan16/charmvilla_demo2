// About page copy (user 2026-10-05: 「根據目前的設計風格…自動幫我完成 about 頁面，刪除裡面的影片，產生適合情境的圖；資訊來源根據
// 官網，或搜集網路上的媒體報導與採訪」). Every fact below comes from one of the sources listed at the end of this file:
//   P  = 陳建瑋〈子村莊園，小金魚茶包游向世界〉，《台灣光華雜誌》2015 年 7 月 (the founding story, the design idea, 16 steps / 9 by
//        hand, no adhesive, asymmetric fins, April 2013, the 2013 Mid-Autumn sell-out, Red Dot 2014, iF Gold March 2015 among 1,624)
//   O  = CHARM VILLA 台灣官方線上商店 (slogan, 34-country design patents, food-grade non-woven fabric, SGS-tested teas)
//   K  = internetcom.jp (the Kyoto store is the brand's first overseas store); M = Bored Panda / Contemporist coverage
//   S  = this site's verified product facts (K18 gold, hinoki, invention patent TW I728606, the Abundance tray by 蘇靜媚)
// Nothing here may be added without a source; no founding claims beyond these.
import { site, gallery, type Img } from "./content";
import { translator, type Locale } from "@/i18n/config";

export type AboutChapter = { id: string; index: string; title: string; body: string[]; quote?: { text: string; by: string }; image: Img; side: "left" | "right" };

export const getAbout = (lang: Locale) => {
  const t = translator(lang);
  return {
    eyebrow: t("關於我們", "About"),
    title: "CHARM VILLA",
    subtitle: t("子村莊園", "Charm Villa, Taiwan"),
    // O: the official slogan, both languages as the brand writes them
    slogan: t("建立迷人的子村，創造迷人的生活，享受迷人的世界。", "Enjoy a charming life and a charming world in CHARM VILLA."),
    intro: t(
      "CHARM VILLA 子村莊園是來自台灣的設計品牌，2013 年由創意總監蘇靜媚創立。從一尾在茶杯裡舒展的小金魚茶包開始，我們把工藝、茶與設計帶進日常：送禮的時刻、一杯茶的時間，還有每天配戴、使用的物件。",
      "CHARM VILLA is a design brand from Taiwan, founded in 2013 by creative director Su Ching-mei. It began with a goldfish tea bag that unfurls in the cup, and it brings craft, tea and design into everyday life: the moment of giving, the time of a cup of tea, and the pieces worn and used each day."),
    hero: site("about-hero.webp", t("熱水注入玻璃杯，杯中的小金魚茶包在茶湯裡舒展", "Hot water poured into a glass cup, a goldfish tea bag unfurling in the tea"), 2400, 1600),
    figures: [
      { value: "2013", label: t("品牌創立", "Brand founded") },
      { value: "16", label: t("道工序，其中 9 道手作", "steps, 9 of them by hand") },
      { value: "34", label: t("國設計專利", "countries with design patents") },
      { value: "iF GOLD", label: t("2015 德國 iF 設計大獎金獎", "iF Design Award Gold, 2015") },
    ],
    chapters: [
      {
        id: "origin", index: "01", side: "right",
        title: t("起點：一個關於品牌的念頭", "Where it began"),
        body: [
          t("創辦人蘇靜媚曾在德國科隆參展，聽見外國人看著台灣館說：「台灣是複製大王。」台灣有那麼多優秀的設計人才，為什麼沒有響亮的品牌？",
            "At an exhibition in Cologne, founder Su Ching-mei heard visitors to the Taiwan Pavilion call Taiwan a land of imitation. Taiwan had so many talented designers; why did it have no brands of renown?"),
          t("這個念頭成了 CHARM VILLA 的起點：以打造迷人的家居生活為出發點，用設計說台灣自己的故事。",
            "That question became the starting point of CHARM VILLA: to begin from a charming home life, and to tell Taiwan's own story through design."),
        ],
        image: gallery("CV-0215", t("沿著手繪牆面游動的白色小金魚裝置，CHARM VILLA 展覽", "A shoal of white paper goldfish along a painted wall, a CHARM VILLA installation")),
      },
      {
        id: "goldfish", index: "02", side: "left",
        title: t("一尾小金魚", "A goldfish in the cup"),
        body: [
          t("2013 年 4 月，小金魚茶包開始設計並申請專利。魚與水本就自然相連，金魚在東方又象徵吉祥；金魚與茶，都帶著東方的韻味。同年中秋節第一次推出，還來不及舉辦發表會就已售罄，訂單一路排到年底。",
            "Design work on the Goldfish Tea Bag began in April 2013, and a patent was filed. Fish and water belong together, and in the East the goldfish stands for good fortune; goldfish and tea share an Oriental flavour. Launched for the Mid-Autumn Festival that year, it sold out before a launch event could be held, with orders running to the end of the year."),
          t("每一尾小金魚要經過 16 道工序，其中 9 道必須靠手工完成。茶包以食品等級不織布製作，過程不使用任何化學黏劑；左右不對稱的魚鰭，讓牠在熱水裡舒展、游動。所使用的茶葉皆通過 SGS 檢測。",
            "Each goldfish passes through 16 steps, nine of them by hand. The bag is made of food-grade non-woven fabric with no chemical adhesive, and its asymmetric fins let it unfurl and swim in hot water. Every tea used is SGS-tested."),
        ],
        quote: { text: t("「我們深愛茶文化，想用簡單的方式將茶文化推廣至國外。」", "“We love tea culture, and we want a simple way to share it with the world.”"), by: t("蘇靜媚，《台灣光華雜誌》2015", "Su Ching-mei, Taiwan Panorama, 2015") },
        image: site("about-craft.webp", t("一雙手在木桌上摺出小金魚茶包的紙鰭，旁邊是未完成的茶包與茶葉", "Hands folding the paper fins of a goldfish tea bag on a wooden bench, unfinished tea bags and tea leaves beside them"), 1792, 2240),
      },
      {
        id: "world", index: "03", side: "right",
        title: t("被世界看見", "Seen by the world"),
        body: [
          t("2014 年，小金魚茶包獲得德國紅點傳達設計獎；2015 年 3 月，再從 1,624 件入選作品中，獲得被譽為設計界奧斯卡的德國 iF 設計大獎金獎。",
            "In 2014 the Goldfish Tea Bag won the Red Dot Award for Communication Design; in March 2015, from 1,624 selected entries, it won an iF Design Award Gold, often called the Oscar of design."),
          t("如今小金魚茶包在全球 34 個國家取得設計專利，也曾登上 Bored Panda、Contemporist 等國際媒體；京都寺町的門市，是品牌的第一間海外門市。",
            "Today the Goldfish Tea Bag holds design patents in 34 countries and has appeared in international media such as Bored Panda and Contemporist; the store on Teramachi in Kyoto is the brand's first overseas store."),
        ],
        image: gallery("CV-0166", t("一群白色紙金魚在牆前游動，CHARM VILLA 展覽", "A school of white paper goldfish swimming before a wall, a CHARM VILLA installation")),
      },
      {
        id: "everyday", index: "04", side: "left",
        title: t("從茶杯到日常", "From the cup to everyday life"),
        body: [
          t("從小金魚茶包出發，CHARM VILLA 把同樣的工藝精神延伸到更多日常物件：台灣檜木的杯墊、茶匙與筷子，逐件手工完成的柴燒鳥形筷架，可收納、重複使用的豐盛點心盤，K18 金的小金魚金飾，以及提把取得台灣發明專利的交織系列皮革包。",
            "From the Goldfish Tea Bag, CHARM VILLA carries the same care into more everyday pieces: hinoki coasters, tea spoons and chopsticks; wood-fired songbird chopstick rests, each finished by hand; the reusable Abundance dessert tray; goldfish earrings in 18K gold; and the leather bags of the Interwoven Collection, whose braided handle holds a Taiwanese invention patent."),
          t("一份禮物被打開、一杯茶被分享，美便從作品走進生活。",
            "When a gift is opened and a cup is shared, beauty moves from the object into everyday life."),
        ],
        image: site("about-gift.webp", t("午後窗光下，一隻手把打開的桐木小金魚茶包禮盒遞給另一隻手，旁邊一杯小金魚茶", "In afternoon light one hand passes an open paulownia box of goldfish tea bags to another, a cup of goldfish tea beside it"), 1792, 2240),
      },
    ] satisfies AboutChapter[],
    rangeTitle: t("作品", "The pieces"),
    range: [
      { id: "tea", image: site("scene-leather-chair-goldfish-tea-tagfix.webp", t("皮椅上的一杯小金魚茶", "A cup of goldfish tea on a leather chair"), 1792, 2240) },
      { id: "scents", image: site("scene-coffee-table-tea-coasters-tagfix.webp", t("咖啡桌上的雲朵杯墊與銀杏茶匙", "Cloud Coasters and a Ginkgo Style Tea Spoon on a coffee table"), 1792, 2240) },
      { id: "jewelry", image: site("scene-diamond-goldfish-earring-profile-bw.webp", t("黑白側臉，耳垂上的鑽石垂墜小金魚耳環", "A black-and-white profile wearing the diamond goldfish drop earring"), 1792, 2240) },
      { id: "bags", image: site("scene-pink-bag-armchair-2k-v3-tagfix.webp", t("皮椅上的粉紅色編織提把皮革包", "The pink Braided Leather Bag on a leather armchair"), 1760, 2336) },
      { id: "abundance", image: site("studio2k-prosperity-dessert-stand.webp", t("金色摺紙的豐盛點心盤", "The gold folded-paper Abundance dessert tray"), 1792, 2240) },
      { id: "wood-fired", image: site("scene-wooden-tray-table-closeup-v2.webp", t("檜木筷子擱在鳥形筷架上", "Hinoki chopsticks on a Songbird Chopsticks Rest"), 1376, 2048) },
    ],
    storesTitle: t("門市", "Visit us"),
    storesCta: t("查看門市資訊", "Store information"),
    sourcesTitle: t("參考資料", "Sources"),
    sources: [
      { label: t("陳建瑋〈子村莊園，小金魚茶包游向世界〉，《台灣光華雜誌》，2015 年 7 月", "Kobe Chen, “Charm Villa—A Fishy Feel for the World’s Teacups,” Taiwan Panorama, July 2015"),
        href: lang === "zh" ? "https://www.taiwan-panorama.com/Articles/Details?Guid=face2970-4fcc-4068-b298-124b1eb68333" : "https://www.taiwan-panorama.com/en/Articles/Details?Guid=2b1501c4-5b30-406b-82a4-ad10ef674664" },
      { label: t("CHARM VILLA 台灣官方線上商店", "CHARM VILLA official online store, Taiwan"), href: "https://www.charmvilla.com.tw/" },
      { label: "Bored Panda, “Goldfish Tea Bags Will Turn Your Teacup Into A Fishbowl”", href: "https://www.boredpanda.com/gold-fish-tea-bag-charm-villa/" },
      { label: "Contemporist, “Teabags Designed To Look Like A Goldfish Is Swimming In Your Mug”", href: "https://www.contemporist.com/teabags-designed-to-look-like-a-goldfish-is-swimming-in-your-mug/" },
      { label: t("internetcom，CHARM VILLA 京都店開幕報導", "internetcom.jp, on the opening of CHARM VILLA Kyoto"), href: "https://internetcom.jp/202351/gold-fish-tea-bag-charm-villa" },
    ],
  };
};
