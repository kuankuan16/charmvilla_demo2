// About page copy (user 2026-10-05: 「根據目前的設計風格…自動幫我完成 about 頁面，刪除裡面的影片，產生適合情境的圖；資訊來源根據
// 官網，或搜集網路上的媒體報導與採訪」). Every fact below comes from one of these sources (no longer listed on the page,
// user 2026-10-06: 「刪」 the 參考資料 block):
//   P  = 陳建瑋〈子村莊園，小金魚茶包游向世界〉，《台灣光華雜誌》2015 年 7 月 (the founding story, the design idea, 16 steps / 9 by
//        hand, no adhesive, asymmetric fins, April 2013, the 2013 Mid-Autumn sell-out, Red Dot 2014, iF Gold March 2015 among 1,624)
//   O  = CHARM VILLA 台灣官方線上商店 (slogan, 34-country design patents, food-grade non-woven fabric, SGS-tested teas)
//   K  = internetcom.jp (the Kyoto store is the brand's first overseas store); M = Bored Panda / Contemporist coverage
//   S  = this site's verified product facts (K18 gold, hinoki, invention patent TW I728606, the Abundance tray by 蘇靜媚)
// Nothing here may be added without a source; no founding claims beyond these.
// 2026-10-05 (user: 「拿掉關於我們所有『子村莊園』的字眼，都用 CHARM VILLA 呈現，並不強調來自台灣」): the brand is named CHARM VILLA only,
// the Chinese slogan (which contains 子村) gives way to the official English line, and Taiwan is no longer the frame of the story.
import { site, gallery, type Img } from "./content";
import { getCommerce } from "./commerce";
import { translator, type Locale } from "@/i18n/config";

export type AboutRange = { id: string; image: Img; position?: string };
export type AboutChapter = { id: string; index: string; title: string; body: string[]; quote?: { text: string; by: string }; image: Img; side: "left" | "right" };
export type AboutLink = { label: string; href: string };

export const getAbout = (lang: Locale) => {
  const t = translator(lang);
  return {
    eyebrow: t("關於我們", "About"),
    title: "CHARM VILLA",
    // O: the official English slogan, word for word, in both languages
    slogan: "Enjoy a charming life and a charming world in CHARM\u00A0VILLA.",
    intro: t(
      "CHARM VILLA 是 2013 年由創意總監蘇靜媚創立的設計品牌。從一尾在茶杯裡舒展的小金魚茶包開始，我們把工藝、茶與設計帶進日常：送禮的時刻、一杯茶的時間，還有每天配戴、使用的物件。",
      "Founded in 2013 by creative director Su Ching-mei, CHARM VILLA is a design brand that brings craft, tea and design into everyday life. It began with a goldfish tea bag unfurling in a cup, and continues through the gifts we share and the pieces we wear and use each day."),
    // a portrait now (user 2026-10-05: 「刪掉改成剛剛的橘色畫布那一張，並更換適合直式配圖的版面」); about-hero.webp stays in the repo
    // 真皮包與金飾的情境照全站隱藏（使用者 2026-10-07，美國市場不販售）：白包照換成方凳托盤上的小金魚茶
    // v4 again (user 2026-10-07: 「換回原本的」 after a v5 that redrew the cup, the goldfish and the tag; v5 stays in git history)
    hero: site("scene-olive-armchair-books-goldfish-tea.webp", t("疊起的書上，雲朵杯墊承著一杯小金魚茶", "Goldfish tea on a Cloud Coaster, resting on stacked books"), 1856, 2304),
    // the shop-like additions after zema-template.webflow.io/our-story (user 2026-10-05: 「補齊更像電商的功能」): a link under each chapter (the
    // button under the intro was removed: 「刪」),
    // the store's service terms, questions and answers. All facts come from
    // commerce.ts (the official store's shopping guide), content.ts (the stores) and news.ts.
    figures: [
      { value: "2013", label: t("品牌創立", "Brand founded") },
      { value: "16", label: t("道工序，其中 9 道手作", "steps, 9 of them by hand") },
      { value: "34", label: t("國設計專利", "countries with design patents for the Goldfish Tea Bag") },
      { value: "iF GOLD", label: t("2015 德國 iF 設計大獎金獎", "iF Design Award Gold 2015, Goldfish Tea Bag") },
    ],
    chapters: [
      {
        id: "origin", index: "01", side: "right",
        title: t("起點：一個關於品牌的念頭", "Where it began"),
        body: [
          // the original wording is back (user 2026-10-05: 「加回原文」), as reported by Taiwan Panorama, July 2015
          t("創辦人蘇靜媚曾在德國科隆參展，聽見外國人看著台灣館說：「台灣是複製大王。」台灣有那麼多優秀的設計人才，為什麼沒有響亮的品牌？",
            "At an exhibition in Cologne, founder Su Ching-mei heard visitors to the Taiwan Pavilion call Taiwan a land of imitation. Taiwan had so many talented designers; why did it have no brands of renown?"),
          t("這個念頭成了 CHARM VILLA 的起點：以打造迷人的家居生活為出發點，用設計說台灣自己的故事。",
            "That question became the starting point of CHARM VILLA: to bring charm to life at home and tell Taiwan's own story through design."),
        ],
        // a generated scene in the site's photography (user 2026-10-07: 「01～04 的配圖，只有 03 不變…自動幫我生成」); the installation
        // photograph about-installation-2k.webp (CV-0215) stays in the repo
        // 01 (user 2026-10-07: 「到桌面『品牌與展覽』裡面重新生成高品質、商業攝影的素材搭配」): the booth generated from the folder's one
        // photograph, the Songbird series panel (IMG_1319), in the site's light; the sofa scene about-scene-01-giftbox-sofa.webp stays in the repo
        // the brand's own photograph of its paper-goldfish installation (341.JPG), re-shot as a 2K studio image by Nano Banana 2.1 with the
        // composition kept (user 2026-10-08: 「用 Higgsfield…enhance，把它變成是…更有質感的 studio shot，然後 2K 的 image。放進官網」); it replaces
        // the grey block of 2026-10-07. The design-fair booth photograph (about-scene-01-exhibition-panel.webp) stays on file.
        image: site("about-scene-01-paper-goldfish-exhibition.webp", t("展場裡懸掛的白色紙摺小金魚", "White paper goldfish hanging in an exhibition"), 2528, 1696),
      },
      {
        id: "goldfish", index: "02", side: "left",
        title: t("一尾小金魚", "A goldfish in the cup"),
        body: [
          t("2013 年 4 月，小金魚茶包開始設計並申請專利。魚與水本就自然相連，金魚在東方又象徵吉祥；金魚與茶，都帶著東方的韻味。同年中秋節第一次推出，還來不及舉辦發表會就已售罄，訂單一路排到年底。",
            "Design work on the goldfish tea bag began in April 2013, and a patent was filed. Fish and water belong together. In Chinese, the name of the goldfish echoes words for treasure and abundance, carrying wishes of happiness, peace, and prosperity. Launched for the Mid-Autumn Festival that year, it sold out before a launch event could be held, with orders running to the end of the year."),
          t("每一尾小金魚要經過 16 道工序，其中 9 道必須靠手工完成。茶包以食品等級不織布製作，過程不使用任何化學黏劑；左右不對稱的魚鰭，讓牠在熱水裡舒展、游動。所使用的茶葉皆通過 SGS 檢測。",
            "Each goldfish passes through 16 steps, nine of them by hand. The bag is made of food-grade non-woven fabric with no chemical adhesive, and its asymmetric fins let it unfurl and swim in hot water. Every tea used is SGS-tested."),
        ],
        quote: { text: t("我們深愛茶文化，想用簡單的方式將茶文化推廣至國外。", "We love tea culture, and we want a simple way to share it with the world."), by: t("蘇靜媚，2015 年專訪", "Su Ching-mei, in a 2015 interview") },
        // 02 改用手作過程照，直接呼應 16 道工序與 9 道手作（使用者 2026-10-12：「取消合併，再幫我重新配圖」「挑適合 02 的圖」）。
        // 同日再換（「要換 about 02 的圖…有職人感，符合內容，並巧妙避開小金魚茶包容易出錯的破綻」）：新生成的手工填茶情境，完成的小金魚不入鏡、
        // 沒有膠水（內文寫不使用化學黏劑），光線沿用官網攝影風格（Nano Banana 2.1）；about-02.webp 保留在 repo。
        // 10-13 再換成使用者提供的品牌照（「換這張」「把它變高清並刪除下面的 logo」）：Nano Banana 2.1 只擦掉 CHARM VILLA 字樣與倒影並放大到 4K，
        // 提示詞與前後對照見 docs/qa/2026-10-13-about-02-brand-photo；about-02-artisan-filling-tea-v2.webp 留在 repo。
        image: site("about-02-goldfish-tea-bags-red-ink-hd.webp", t("黑色亮面桌上的一排白色小金魚茶包", "A row of white goldfish tea bags on a glossy black table"), 2880, 1932),
      },
      {
        id: "world", index: "03", side: "right",
        title: t("被世界看見", "International recognition"),
        body: [
          t("2014 年，小金魚茶包獲得德國紅點傳達設計獎；2015 年 3 月，再從 1,624 件入選作品中，獲得德國 iF 設計大獎金獎。",
            "In 2014 the goldfish tea bag won the Red Dot Award for Communication Design; in March 2015, from 1,624 selected entries, it won an iF Design Award Gold."),
          t("如今小金魚茶包在全球 34 個國家取得設計專利，也曾登上 Bored Panda、Contemporist 等國際媒體；品牌並在京都寺町開設門市。",
            "Today the goldfish tea bag holds design patents in 34 countries and has appeared in international media such as Bored Panda and Contemporist; the brand also has a store on Teramachi in Kyoto."),
        ],
        // the brand's photograph of one paper goldfish on a mirror among white blossoms (CV-0169; user 2026-10-05: 「換」 for the school of fish, CV-0166)
        image: gallery("CV-0169", t("鏡面上的一尾白色紙金魚", "A white paper goldfish on a mirror"), 1200, 1800),
      },
      {
        id: "everyday", index: "04", side: "left",
        title: t("從茶杯到日常", "From the cup to everyday life"),
        body: [
          t("從小金魚茶包出發，CHARM VILLA 把同樣的工藝精神延伸到更多日常物件：檜木的杯墊、茶匙與筷子，以及逐件手工完成的柴燒鳥形筷架。",
            "From the goldfish tea bag, CHARM VILLA carries the same care into more everyday pieces: hinoki coasters, tea spoons and chopsticks; and wood-fired songbird chopstick rests, each finished by hand."),
          t("一份禮物被打開、一杯茶被分享，美便從作品走進生活。",
            "When a gift is opened and a cup is shared, beauty moves from the object into everyday life."),
        ],
        // the red embroidered gift box with goldfish tea, cloud coasters, the ginkgo spoon and a songbird rest (user 2026-10-05: 「紅色禮盒好了放這裡」)
        // generated scene (user 2026-10-07); the red gift box scene scene-red-giftbox-tea-hinoki-bird.webp stays in the repo.
        // v2 (user 2026-10-07: 「這張刪掉杯墊與其他商品」, then 「加回其他商品，注意『盤子下面不要再放杯墊』」): the pieces are back on the
        // table but the saucer stands directly on the wood; only the table top changed between versions (local edits, composited back)
        image: site("about-scene-04-everyday-pieces-v2.webp", t("小金魚茶旁的雲朵杯墊、銀杏茶匙、檜木筷子與鳥形筷架", "Goldfish tea with the Cloud Coaster, Ginkgo Teaspoon, Hinoki Wood Chopsticks and Songbird Chopstick Rest"), 1856, 2304),
      },
    ] satisfies AboutChapter[],
    rangeTitle: t("作品", "The pieces"),
    range: [
      { id: "tea", image: site("scene-oak-table-goldfish-tea-chair.webp", t("一杯小金魚茶與金色茶標", "A cup of goldfish tea with its gold tag"), 1792, 2240) },
      // the same picture as the menu's Scents preview (user 2026-10-05: 「改成選單的香氛那一張」)
      { id: "scents", image: site("scene-wooden-tray-table-sofa-v4.webp", t("雲朵杯墊與銀杏茶匙放在托盤邊几上", "The Cloud Coaster and Ginkgo Teaspoon on a tray table"), 1376, 2048) },
      { id: "jewelry", image: site("scene-diamond-goldfish-earring-profile-bw.webp", t("黑白側臉，耳垂上的鑽石垂墜小金魚耳環", "A black-and-white profile wearing the diamond goldfish drop earring"), 1792, 2240) },
      // the black-and-white portrait of the man in black holding the white bag (user 2026-10-05: 「改成男生黑白，黑衣服張」), framed on face, hand and bag
      { id: "bags", image: { src: "/media/hero/male-embracing-white-bag-v2-hd.webp", alt: t("黑白照片：穿黑衣的男子雙臂環過頭頂，指間提著白色編織提把皮革包", "Black-and-white photograph of a man in black, arms over his head, the white Braided Leather Bag hanging from his fingers"), w: 2560, h: 1720 }, position: "65% 50%" },
      // a scene instead of the studio shot, the same picture as the menu's Abundance preview (user 2026-10-05: 「用情境照」)
      { id: "abundance", image: site("scene-dessert-stand-fireplace-lounge-v2.webp", t("夜晚的酒廊，大理石層架與壁爐火光前，深色桌上的豐盛點心盤擺著幾樣精緻小點心，旁邊一杯紅茶、巧克力與閃電泡芙", "A lounge at night, backlit marble shelves and a fire behind: on a dark table the Abundance Dessert Tray with a few refined petits fours, a cup of tea, chocolates and an éclair"), 1792, 2240) },
      // the songbird rests on a tray on the oak coffee table (user 2026-10-05: 「並取代這張」 for CV-0242)
      { id: "wood-fired", image: site("scene-oak-table-bird-rests-close.webp", t("托盤上的鳥形筷架與檜木筷子特寫", "A close-up of Songbird Chopstick Rests and Hinoki Wood Chopsticks"), 1792, 2240) },
    ] satisfies AboutRange[],
    // the US store's Shipping & Returns Policy and FAQ (commerce.ts, user's document 2026-10-07); shipping, delivery and returns
    // follow the client's final answers 2026-10-12 (D1 US$199 to the contiguous 48 states, D2/D3 dispatch, D4 non-tea returns)
    benefits: [
      { id: "shipping", title: t("滿 US$ 199 免運", "Free shipping on US$199 or more"), text: t("配送至美國本土相連 48 州；未達則依結帳時的地址與配送方式計算運費。", "To the contiguous United States (48 states). Below that, shipping is calculated at checkout by address and service."), href: "/policy#us-shipping" },
      { id: "delivery", title: t("現貨 1–2 個工作天出貨", "In-stock orders ship in 1–2 business days"), text: t("從加州出貨，出貨後通常另需 3–7 個工作天送達；週末及美國聯邦假日不出貨。", "From California. Delivery typically takes an additional 3–7 business days after dispatch; no dispatch on weekends or U.S. federal holidays."), href: "/policy#processing" },
      { id: "returns", title: t("非茶商品 30 天內可申請退貨", "30-day returns on non-tea items"), text: t("茶品為食品，售出後恕不退換；損壞或錯誤訂單請於 7 天內告知。", "Tea is a food product and is not returnable; report damage or errors within 7 days."), href: "/policy#returns" },
      { id: "contact", title: t("來信 us@charmvilla.com", "Email us@charmvilla.com"), text: t("挑選禮物或既有訂單的協助，我們很樂意為您服務。", "For help choosing a gift or with an existing order."), href: "/faq" },
    ] satisfies { id: string; title: string; text: string; href: string }[],
    faqTitle: t("常見問題", "Frequently asked questions"),
    faq: getCommerce(lang).faqHighlights.map(({ q, a }) => ({ q, a })),
    faqMore: { label: t("看完整常見問題", "Read the full FAQ"), href: "/faq" },
  };
};
