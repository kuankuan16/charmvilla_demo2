// About page copy (user 2026-10-05: 「根據目前的設計風格…自動幫我完成 about 頁面，刪除裡面的影片，產生適合情境的圖；資訊來源根據
// 官網，或搜集網路上的媒體報導與採訪」). Every fact below comes from one of the sources listed at the end of this file:
//   P  = 陳建瑋〈子村莊園，小金魚茶包游向世界〉，《台灣光華雜誌》2015 年 7 月 (the founding story, the design idea, 16 steps / 9 by
//        hand, no adhesive, asymmetric fins, April 2013, the 2013 Mid-Autumn sell-out, Red Dot 2014, iF Gold March 2015 among 1,624)
//   O  = CHARM VILLA 台灣官方線上商店 (slogan, 34-country design patents, food-grade non-woven fabric, SGS-tested teas)
//   K  = internetcom.jp (the Kyoto store is the brand's first overseas store); M = Bored Panda / Contemporist coverage
//   S  = this site's verified product facts (K18 gold, hinoki, invention patent TW I728606, the Abundance tray by 蘇靜媚)
// Nothing here may be added without a source; no founding claims beyond these.
// 2026-10-05 (user: 「拿掉關於我們所有『子村莊園』的字眼，都用 CHARM VILLA 呈現，並不強調來自台灣」): the brand is named CHARM VILLA only,
// the Chinese slogan (which contains 子村) gives way to the official English line, and Taiwan is no longer the frame of the story.
import { site, gallery, type Img } from "./content";
import { translator, type Locale } from "@/i18n/config";

export type AboutRange = { id: string; image: Img; position?: string };
export type AboutChapter = { id: string; index: string; title: string; body: string[]; quote?: { text: string; by: string }; image: Img; side: "left" | "right" };

export const getAbout = (lang: Locale) => {
  const t = translator(lang);
  return {
    eyebrow: t("關於我們", "About"),
    title: "CHARM VILLA",
    // O: the official English slogan, word for word, in both languages
    slogan: "Enjoy a charming life and a charming world in CHARM VILLA.",
    intro: t(
      "CHARM VILLA 是 2013 年由創意總監蘇靜媚創立的設計品牌。從一尾在茶杯裡舒展的小金魚茶包開始，我們把工藝、茶與設計帶進日常：送禮的時刻、一杯茶的時間，還有每天配戴、使用的物件。",
      "CHARM VILLA is a design brand founded in 2013 by creative director Su Ching-mei. It began with a goldfish tea bag that unfurls in the cup, and it brings craft, tea and design into everyday life: the moment of giving, the time of a cup of tea, and the pieces worn and used each day."),
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
          t("創辦人蘇靜媚在德國科隆參展時，開始思考一個問題：身邊有那麼多優秀的設計人才，為什麼沒有讓人記得的品牌？",
            "While exhibiting in Cologne, founder Su Ching-mei began to ask a question: with so many talented designers around her, why were there no brands people remembered?"),
          t("這個念頭成了 CHARM VILLA 的起點：以打造迷人的家居生活為出發點，用設計創造屬於自己的品牌。",
            "That question became the starting point of CHARM VILLA: to begin from a charming home life, and to build a brand of its own through design."),
        ],
        // the brand's installation photograph CV-0215, enhanced to 2K with Higgsfield's upscaler (user 2026-10-05)
        image: site("about-installation-2k.webp", t("沿著手繪牆面游動的白色小金魚裝置，CHARM VILLA 展覽", "A shoal of white paper goldfish along a painted wall, a CHARM VILLA installation"), 2400, 1604),
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
        quote: { text: t("「我們深愛茶文化，想用簡單的方式將茶文化推廣至國外。」", "“We love tea culture, and we want a simple way to share it with the world.”"), by: t("蘇靜媚，2015 年專訪", "Su Ching-mei, in a 2015 interview") },
        // user 2026-10-05: 「剛剛生成的皮革沙發取代這張」 (the hand-folding photograph, about-craft.webp, is kept in the repo)
        image: site("scene-lounge-chair-tea-bird.webp", t("焦糖色真皮躺椅上放著白色編織提把皮革包，前景洞石邊几上一杯小金魚茶、金色茶標與柴燒鳥形筷架", "A white Braided Leather Bag on a cognac leather lounge chair; on a travertine side table in front, a glass of goldfish tea, its gold tag and a wood-fired Songbird Chopsticks Rest"), 1792, 2240),
      },
      {
        id: "world", index: "03", side: "right",
        title: t("被世界看見", "Seen by the world"),
        body: [
          t("2014 年，小金魚茶包獲得德國紅點傳達設計獎；2015 年 3 月，再從 1,624 件入選作品中，獲得被譽為設計界奧斯卡的德國 iF 設計大獎金獎。",
            "In 2014 the Goldfish Tea Bag won the Red Dot Award for Communication Design; in March 2015, from 1,624 selected entries, it won an iF Design Award Gold, often called the Oscar of design."),
          t("如今小金魚茶包在全球 34 個國家取得設計專利，也曾登上 Bored Panda、Contemporist 等國際媒體；品牌並在京都寺町開設門市。",
            "Today the Goldfish Tea Bag holds design patents in 34 countries and has appeared in international media such as Bored Panda and Contemporist; the brand also has a store on Teramachi in Kyoto."),
        ],
        // the brand's photograph of one paper goldfish on a mirror among white blossoms (CV-0169; user 2026-10-05: 「換」 for the school of fish, CV-0166)
        image: gallery("CV-0169", t("一尾白色紙金魚停在鏡面上，倒影與白色花叢", "A single white paper goldfish on a mirror, its reflection among white blossoms"), 1200, 1800),
      },
      {
        id: "everyday", index: "04", side: "left",
        title: t("從茶杯到日常", "From the cup to everyday life"),
        body: [
          t("從小金魚茶包出發，CHARM VILLA 把同樣的工藝精神延伸到更多日常物件：檜木的杯墊、茶匙與筷子，逐件手工完成的柴燒鳥形筷架，可收納、重複使用的豐盛點心盤，K18 金的小金魚金飾，以及提把取得發明專利的交織系列皮革包。",
            "From the Goldfish Tea Bag, CHARM VILLA carries the same care into more everyday pieces: hinoki coasters, tea spoons and chopsticks; wood-fired songbird chopstick rests, each finished by hand; the reusable Abundance dessert tray; goldfish earrings in 18K gold; and the leather bags of the Interwoven Collection, whose braided handle holds an invention patent."),
          t("一份禮物被打開、一杯茶被分享，美便從作品走進生活。",
            "When a gift is opened and a cup is shared, beauty moves from the object into everyday life."),
        ],
        image: site("about-gift.webp", t("午後窗光下，一隻手把打開的桐木小金魚茶包禮盒遞給另一隻手，旁邊一杯小金魚茶", "In afternoon light one hand passes an open paulownia box of goldfish tea bags to another, a cup of goldfish tea beside it"), 1792, 2240),
      },
    ] satisfies AboutChapter[],
    rangeTitle: t("作品", "The pieces"),
    range: [
      { id: "tea", image: site("scene-leather-chair-goldfish-tea-tagfix.webp", t("皮椅上的一杯小金魚茶", "A cup of goldfish tea on a leather chair"), 1792, 2240) },
      { id: "scents", image: site("scene-wooden-tray-table-closeup-v2.webp", t("橄欖綠沙發旁的黑色托盤邊几，刻著 CHARMVILLA 的雲朵杯墊與檜木筷子", "A black tray table by an olive sofa, a Cloud Coaster engraved CHARMVILLA and hinoki chopsticks"), 1376, 2048) },
      { id: "jewelry", image: site("scene-diamond-goldfish-earring-profile-bw.webp", t("黑白側臉，耳垂上的鑽石垂墜小金魚耳環", "A black-and-white profile wearing the diamond goldfish drop earring"), 1792, 2240) },
      // the black-and-white portrait of the man in black holding the white bag (user 2026-10-05: 「改成男生黑白，黑衣服張」), framed on face, hand and bag
      { id: "bags", image: { src: "/media/hero/male-embracing-white-bag-v2-hd.webp", alt: t("黑白照片：穿黑衣的男子雙臂環過頭頂，指間提著白色編織提把皮革包", "Black-and-white photograph of a man in black, arms over his head, the white Braided Leather Bag hanging from his fingers"), w: 2560, h: 1720 }, position: "65% 50%" },
      { id: "abundance", image: site("studio2k-prosperity-dessert-stand.webp", t("金色摺紙的豐盛點心盤", "The gold folded-paper Abundance dessert tray"), 1792, 2240) },
      // the tray close-up now stands for Scents, so the bird rests show the brand's own photograph
      { id: "wood-fired", image: gallery("CV-0242", t("青瓷與米黃的柴燒鳥形筷架散在白桌與木炭之間", "Wood-fired Songbird Chopsticks Rests in celadon and cream between a white table and charcoal")) },
    ] satisfies AboutRange[],
    sourcesTitle: t("參考資料", "Sources"),
    sources: [
      { label: t("《台灣光華雜誌》專訪，陳建瑋，2015 年 7 月", "Taiwan Panorama interview, Kobe Chen, July 2015"),
        href: lang === "zh" ? "https://www.taiwan-panorama.com/Articles/Details?Guid=face2970-4fcc-4068-b298-124b1eb68333" : "https://www.taiwan-panorama.com/en/Articles/Details?Guid=2b1501c4-5b30-406b-82a4-ad10ef674664" },
      { label: t("CHARM VILLA 官方線上商店", "CHARM VILLA official online store"), href: "https://www.charmvilla.com.tw/" },
      { label: "Bored Panda, “Goldfish Tea Bags Will Turn Your Teacup Into A Fishbowl”", href: "https://www.boredpanda.com/gold-fish-tea-bag-charm-villa/" },
      { label: "Contemporist, “Teabags Designed To Look Like A Goldfish Is Swimming In Your Mug”", href: "https://www.contemporist.com/teabags-designed-to-look-like-a-goldfish-is-swimming-in-your-mug/" },
      { label: t("internetcom，CHARM VILLA 京都店開幕報導", "internetcom.jp, on the opening of CHARM VILLA Kyoto"), href: "https://internetcom.jp/202351/gold-fish-tea-bag-charm-villa" },
    ],
  };
};
