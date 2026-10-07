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
export type AboutChapter = { id: string; index: string; title: string; body: string[]; quote?: { text: string; by: string }; image: Img; placeholder?: boolean /* a grey block instead of the image, the photograph still to be chosen */; side: "left" | "right"; cta?: AboutLink };
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
      "CHARM VILLA is a design brand founded in 2013 by creative director Su Ching-mei. It began with a goldfish tea bag that unfurls in the cup, and it brings craft, tea and design into everyday life: the moment of giving, the time of a cup of tea, and the pieces worn and used each day."),
    // a portrait now (user 2026-10-05: 「刪掉改成剛剛的橘色畫布那一張，並更換適合直式配圖的版面」); about-hero.webp stays in the repo
    // 真皮包與金飾的情境照全站隱藏（使用者 2026-10-07，美國市場不販售）：白包照換成方凳托盤上的小金魚茶
    // v5 (user 2026-10-07: 「套用你後來學習的知識優化這一張透明茶杯與茶標籤還有小金魚的部分，要更接近真實」): only the cup (the brand's
    // single-walled fishbowl cup), the brewed goldfish and the tag with its string were redrawn and composited back; v4 stays in git
    hero: site("ottoman-tray-tea-cup-v5-realcup.webp", t("墨綠色毛圈布方凳上的木托盤裡，品牌的小魚缸玻璃杯泡開一尾小金魚茶包，透出玫瑰花瓣與茶葉，棉線越過杯口接到旁邊的金色茶標籤；牆邊靠著一幅赭色圓形筆觸的抽象畫", "On a wooden tray on a moss-green bouclé ottoman, a goldfish tea bag unfurls in the brand's fishbowl glass cup, rose petals and leaves showing through, its string over the rim to the gold tag beside it; an ochre abstract painting leans against the wall"), 1792, 2240),
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
        cta: { label: t("欣賞全部作品", "Explore all pieces"), href: "/collections/all" },
        title: t("起點：一個關於品牌的念頭", "Where it began"),
        body: [
          // the original wording is back (user 2026-10-05: 「加回原文」), as reported by Taiwan Panorama, July 2015
          t("創辦人蘇靜媚曾在德國科隆參展，聽見外國人看著台灣館說：「台灣是複製大王。」台灣有那麼多優秀的設計人才，為什麼沒有響亮的品牌？",
            "At an exhibition in Cologne, founder Su Ching-mei heard visitors to the Taiwan Pavilion call Taiwan a land of imitation. Taiwan had so many talented designers; why did it have no brands of renown?"),
          t("這個念頭成了 CHARM VILLA 的起點：以打造迷人的家居生活為出發點，用設計說台灣自己的故事。",
            "That question became the starting point of CHARM VILLA: to begin from a charming home life, and to tell Taiwan's own story through design."),
        ],
        // a generated scene in the site's photography (user 2026-10-07: 「01～04 的配圖，只有 03 不變…自動幫我生成」); the installation
        // photograph about-installation-2k.webp (CV-0215) stays in the repo
        // 01 (user 2026-10-07: 「到桌面『品牌與展覽』裡面重新生成高品質、商業攝影的素材搭配」): the booth generated from the folder's one
        // photograph, the Songbird series panel (IMG_1319), in the site's light; the sofa scene about-scene-01-giftbox-sofa.webp stays in the repo
        image: site("about-scene-01-exhibition-panel.webp", t("設計展的展位：白色看板上三根墨畫的鳥羽與直排小字「小鳥兒系列／鳥羽 創作／手繪 蘇靜媚」，底下金色 CHARM VILLA；看板前一朵白荷花，淺木檯座上放著團圓禮盒與一杯玻璃杯小金魚茶", "A design-fair booth: a white panel with three ink-painted feathers, a column of small characters naming the Songbird series and the hand-drawn work by Su Ching-mei, and CHARM VILLA in gold; a white lotus before it, and on a pale wooden plinth the Reunion gift box and a glass cup of goldfish tea"), 1856, 2304),
        placeholder: true, // a grey block for now (user 2026-10-07: 「用灰色塊先取代」); the image above stays on file
      },
      {
        id: "goldfish", index: "02", side: "left",
        cta: { label: t("選購小金魚茶包", "Shop the Goldfish Tea Bags"), href: "/collections/tea" },
        title: t("一尾小金魚", "A goldfish in the cup"),
        body: [
          t("2013 年 4 月，小金魚茶包開始設計並申請專利。魚與水本就自然相連，金魚在東方又象徵吉祥；金魚與茶，都帶著東方的韻味。同年中秋節第一次推出，還來不及舉辦發表會就已售罄，訂單一路排到年底。",
            "Design work on the goldfish tea bag began in April 2013, and a patent was filed. Fish and water belong together. In Chinese, the name of the goldfish echoes words for treasure and abundance, carrying wishes of happiness, peace, and prosperity. Launched for the Mid-Autumn Festival that year, it sold out before a launch event could be held, with orders running to the end of the year."),
          t("每一尾小金魚要經過 16 道工序，其中 9 道必須靠手工完成。茶包以食品等級不織布製作，過程不使用任何化學黏劑；左右不對稱的魚鰭，讓牠在熱水裡舒展、游動。所使用的茶葉皆通過 SGS 檢測。",
            "Each goldfish passes through 16 steps, nine of them by hand. The bag is made of food-grade non-woven fabric with no chemical adhesive, and its asymmetric fins let it unfurl and swim in hot water. Every tea used is SGS-tested."),
        ],
        quote: { text: t("「我們深愛茶文化，想用簡單的方式將茶文化推廣至國外。」", "“We love tea culture, and we want a simple way to share it with the world.”"), by: t("蘇靜媚，2015 年專訪", "Su Ching-mei, in a 2015 interview") },
        // user 2026-10-05: 「剛剛生成的皮革沙發取代這張」 (the hand-folding photograph, about-craft.webp, is kept in the repo)
        // 真皮包與金飾的情境照全站隱藏（使用者 2026-10-07，美國市場不販售）：皮躺椅白包照換回原本手摺小金魚的照片
        // generated scene (user 2026-10-07); the hand-folding photograph about-craft.webp stays in the repo
        image: site("about-scene-02-goldfish-cup.webp", t("胡桃木桌上一杯玻璃杯小金魚茶，旁邊一尾還沒泡的白色小金魚茶包、金色茶包袋、玫瑰花苞與烏龍茶球，後方是橄欖綠沙發", "A glass of goldfish tea on a walnut table, a dry white goldfish tea bag, a gold sachet, rosebuds and oolong pearls beside it, an olive sofa behind"), 1856, 2304),
        placeholder: true, // a grey block for now (user 2026-10-07: 「用灰色塊先取代」); the image above stays on file
      },
      {
        id: "world", index: "03", side: "right",
        cta: { label: t("看最新消息", "Read the latest news"), href: "/news" },
        title: t("被世界看見", "Seen by the world"),
        body: [
          t("2014 年，小金魚茶包獲得德國紅點傳達設計獎；2015 年 3 月，再從 1,624 件入選作品中，獲得德國 iF 設計大獎金獎。",
            "In 2014 the goldfish tea bag won the Red Dot Award for Communication Design; in March 2015, from 1,624 selected entries, it won an iF Design Award Gold."),
          t("如今小金魚茶包在全球 34 個國家取得設計專利，也曾登上 Bored Panda、Contemporist 等國際媒體；品牌並在京都寺町開設門市。",
            "Today the goldfish tea bag holds design patents in 34 countries and has appeared in international media such as Bored Panda and Contemporist; the brand also has a store on Teramachi in Kyoto."),
        ],
        // the brand's photograph of one paper goldfish on a mirror among white blossoms (CV-0169; user 2026-10-05: 「換」 for the school of fish, CV-0166)
        image: gallery("CV-0169", t("一尾白色紙金魚停在鏡面上，倒影與白色花叢", "A single white paper goldfish on a mirror, its reflection among white blossoms"), 1200, 1800),
      },
      {
        id: "everyday", index: "04", side: "left",
        cta: { label: t("欣賞全部作品", "Explore all pieces"), href: "/collections/all" },
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
        image: site("about-scene-04-everyday-pieces-v2.webp", t("橄欖綠沙發旁的胡桃木邊桌：白瓷杯小金魚茶放在白瓷盤上，旁邊一片雲朵杯墊、銀杏茶匙，一雙檜木筷擱在柴燒鳥形筷架上", "A walnut side table by an olive sofa: goldfish tea in a white cup on its saucer, a Cloud Coaster, a Ginkgo Style Tea Spoon and hinoki chopsticks on a wood-fired Songbird Chopsticks Rest"), 1856, 2304),
      },
    ] satisfies AboutChapter[],
    rangeTitle: t("作品", "The pieces"),
    range: [
      { id: "tea", image: site("scene-oak-table-goldfish-tea-chair.webp", t("暗暖光線下的橡木長桌，一杯小金魚茶與金色 CHARM VILLA 茶標，桌邊是胡桃木扶手椅", "In low warm light a cup of goldfish tea and its gold CHARM VILLA tag on an oak table, a walnut armchair at its edge"), 1792, 2240) },
      // the same picture as the menu's Scents preview (user 2026-10-05: 「改成選單的香氛那一張」)
      { id: "scents", image: site("scene-wooden-tray-table-sofa-v4.webp", t("橄欖綠沙發旁的黑色托盤邊几，刻著 CHARMVILLA 的梅花木盒、雲朵杯墊與銀杏茶匙", "A black tray table by an olive sofa: a plum-blossom box, a Cloud Coaster and a Ginkgo Style Tea Spoon, each engraved CHARMVILLA"), 1376, 2048) },
      { id: "jewelry", image: site("scene-diamond-goldfish-earring-profile-bw.webp", t("黑白側臉，耳垂上的鑽石垂墜小金魚耳環", "A black-and-white profile wearing the diamond goldfish drop earring"), 1792, 2240) },
      // the black-and-white portrait of the man in black holding the white bag (user 2026-10-05: 「改成男生黑白，黑衣服張」), framed on face, hand and bag
      { id: "bags", image: { src: "/media/hero/male-embracing-white-bag-v2-hd.webp", alt: t("黑白照片：穿黑衣的男子雙臂環過頭頂，指間提著白色編織提把皮革包", "Black-and-white photograph of a man in black, arms over his head, the white Braided Leather Bag hanging from his fingers"), w: 2560, h: 1720 }, position: "65% 50%" },
      // a scene instead of the studio shot, the same picture as the menu's Abundance preview (user 2026-10-05: 「用情境照」)
      { id: "abundance", image: site("scene-dessert-stand-fireplace-lounge-v2.webp", t("夜晚的酒廊，大理石層架與壁爐火光前，深色桌上的豐盛點心盤擺著幾樣精緻小點心，旁邊一杯紅茶、巧克力與閃電泡芙", "A lounge at night, backlit marble shelves and a fire behind: on a dark table the Abundance Dessert Tray with a few refined petits fours, a cup of tea, chocolates and an éclair"), 1792, 2240) },
      // the songbird rests on a tray on the oak coffee table (user 2026-10-05: 「並取代這張」 for CV-0242)
      { id: "wood-fired", image: site("scene-oak-table-bird-rests-close.webp", t("深色古銅托盤上的四隻柴燒鳥形筷架、備長炭與一雙檜木筷，近看", "Four wood-fired Songbird Chopsticks Rests, binchotan and hinoki chopsticks on a dark bronze tray, close up"), 1792, 2240) },
    ] satisfies AboutRange[],
    // the US store's Shipping & Returns Policy and FAQ (commerce.ts, user's document 2026-10-07)
    benefits: [
      { id: "shipping", title: t("滿 US$ 99 免運", "Free shipping over $99"), text: t("未達則依結帳時的地址與配送方式計算運費。", "Below that, shipping is calculated at checkout by address and service."), href: "/policy#us-shipping" },
      { id: "delivery", title: t("3–7 個工作天送達", "Delivered in 3–7 business days"), text: t("從加州出貨；出貨後寄送追蹤連結給您。", "Ships from California; a tracking link follows once your order ships."), href: "/policy#processing" },
      { id: "returns", title: t("陶瓷商品 14 天內可退", "14-day returns on ceramics"), text: t("茶品為食品，售出後恕不退換；損壞或錯誤訂單請於 7 天內告知。", "Tea is a food product and is not returnable; report damage or errors within 7 days."), href: "/policy#returns" },
      { id: "contact", title: t("來信 us@charmvilla.com", "Email us@charmvilla.com"), text: t("挑選禮物或既有訂單的協助，我們很樂意為您服務。", "For help choosing a gift or with an existing order."), href: "/faq" },
    ] satisfies { id: string; title: string; text: string; href: string }[],
    faqTitle: t("常見問題", "Frequently asked questions"),
    faq: getCommerce(lang).faqHighlights.map(({ q, a }) => ({ q, a })),
    faqMore: { label: t("看完整常見問題", "Read the full FAQ"), href: "/faq" },
  };
};
