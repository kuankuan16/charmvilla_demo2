// News & announcements (2026-10-02, after verin-template.webflow.io/news; user: 「做出 news 的版型，並拿掉首頁 news 的區塊」).
// Only facts already on the site: the four homepage news lines and the SHOW MORE! launch. Each entry has a list card and a
// short article; nothing is added beyond those facts.
import { gallery, site, type Img } from "./content";
import { translator, type Locale } from "../i18n/config";

// Chinese titles carry a zero-width space (\u200b) at their natural pause: titles wrap only there (word-break: keep-all),
// so a phrase such as 開放 is never split across lines.
export type NewsBlock = string | { list: string[] } | { links: { label: string; href: string }[] };
// `focus` is the card photograph's object-position, used where the list crops it wider than it is (the list cards are about 1.3 : 1)
// `whole`: the article shows the card picture uncropped (a printed piece such as an invitation) on `ground`, its paper colour
export type NewsEntry = { slug: string; date: string; dateLabel: string; tag: string; title: string; summary: string; card: Img; focus?: string; whole?: boolean; ground?: string; hero: Img; body: NewsBlock[] };

const build = (lang: Locale): NewsEntry[] => {
  const t = translator(lang);
  return [
    {
      slug: "show-more-leather-bag-launch", date: "2026-10-03", dateLabel: t("2026 年 10 月", "October 2026"),
      tag: t("新品發表", "New launch"), title: t("Show more! 真皮包\u200b新品發表會", "Show more! The leather bag launch"),
      summary: t("編織提把皮革包巡迴發表：台北、洛杉磯、京都三場。", "The Braided Leather Bag on tour: Taipei, Los Angeles and Kyoto."),
      // the launch invitation instead of the dancer (user 2026-10-06: 「這張改」): the list crops to the bag, the article shows it whole
      card: gallery("CV-0427", t("Show more! 真皮包新品發表邀請卡：淺灰紙上浮雕的編織提把皮革包，上方金色 CHARM VILLA，下方三場發表的日期與地點", "Invitation to the Show more! leather bag launch: the braided-handle bag embossed on pale gray paper under gold CHARM VILLA lettering, with the dates and venues of the three events"), 1280, 1963),
      focus: "50% 50.5%", whole: true, ground: "#eceef0", // 50.5 %: the card band falls between the text lines at 1.3 : 1 and 1.43 : 1
      hero: site("banner-bag-dancer-dark.webp", t("深色漸層前，男舞者俯身，一手提著白色編織提把皮革包", "Against a dark gradient, a male dancer bends forward, the white Braided Leather Bag hanging from one hand"), 2560, 1080),
      body: [
        t("編織提把皮革包的新品發表，分三場舉行：", "The Braided Leather Bag is presented in three events:"),
        { list: [t("10 月 3 日・台北晶華酒店 麗晶精品 B1", "October 3 · Regent Galleria B1, Regent Taipei"), t("10 月 17 日・The Scholart Selection・San Gabriel, CA", "October 17 · The Scholart Selection · San Gabriel, CA"), t("10 月 31 日・CHARM VILLA 京都", "October 31 · CHARM VILLA Kyoto")] },
        // 「選購交織系列」按鈕隨真皮包全站隱藏一起拿掉（使用者 2026-10-07）；「查看邀請卡」 removed (user 2026-10-06: 「刪」)
      ],
    },
    {
      slug: "mid-autumn-2026-pre-order", date: "2026-08-11", dateLabel: t("2026 年 8 月 11 日", "August 11, 2026"),
      tag: t("禮盒預購", "Pre-order"), title: t("2026 中秋限定\u200b禮盒開放預購", "2026 Mid-Autumn gift boxes: pre-orders open"),
      summary: t("燙金魚鱗紙盒限量登場。", "A limited paper box in gold-foil fish scales."),
      card: site("scene-small-moon-tea-gift-box.webp", t("小鮮月禮盒的茶席情境", "The Small Moon gift box at a tea table")),
      focus: "50% 72%",
      hero: site("scene-small-moon-tea-gift-box.webp", t("小鮮月禮盒的茶席情境", "The Small Moon gift box at a tea table")),
      body: [
        t("2026 中秋限定禮盒開放預購，燙金魚鱗紙盒限量登場。", "Pre-orders are open for the 2026 Mid-Autumn limited gift boxes, with a limited paper box in gold-foil fish scales."),
        { links: [{ label: t("小鮮月禮盒｜純茶包", "Small Moon Gift Box | Tea Only"), href: "/products/small-moon-tea-gift-box" }, { label: t("大盈月禮盒｜純茶包", "Full Moon Gift Box | Tea Only"), href: "/products/full-moon-tea-gift-box" }] },
      ],
    },
    // 2026-10-02 (user: 「刪」): the Monocle interview entry was removed; its URL redirects to /news (next.config.ts).
    {
      slug: "goldfish-in-a-cup-eslite-nanxi", date: "2026-07-02", dateLabel: t("2026 年 7 月 2 日", "July 2, 2026"),
      tag: t("活動快訊", "Events"), title: t("「杯中金魚」\u200b期間限定茶席", "Goldfish in a Cup: a limited-time tea table"),
      summary: t("8 月 15 日起，於誠品生活南西。", "From August 15 at eslite spectrum Nanxi."),
      // the tea-table scene with fluted glasses (user 2026-10-06: 「取代這張」); its tag laid flat on the cloth per the tag spec
      card: site("scene-fluted-glass-goldfish-tea-hand-v2.webp", t("暖光茶席上，一隻手托著黑色鎚紋鐵托盤，直條紋玻璃杯裡泡著一尾小金魚茶包，金色 CHARM VILLA 茶標平放在桌布上；後方幾杯茶在柔焦裡", "At a sunlit tea table a hand holds a hammered black iron tray with a goldfish tea bag steeping in a fluted glass, the gold CHARM VILLA tag lying flat on the cloth, more cups soft-focus behind"), 1792, 2240),
      focus: "50% 76%",
      hero: site("scene-fluted-glass-goldfish-tea-hand-v2.webp", t("暖光茶席上，一隻手托著黑色鎚紋鐵托盤，直條紋玻璃杯裡泡著一尾小金魚茶包，金色 CHARM VILLA 茶標平放在桌布上；後方幾杯茶在柔焦裡", "At a sunlit tea table a hand holds a hammered black iron tray with a goldfish tea bag steeping in a fluted glass, the gold CHARM VILLA tag lying flat on the cloth, more cups soft-focus behind"), 1792, 2240),
      body: [
        t("8 月 15 日起，於誠品生活南西展開「杯中金魚」期間限定茶席。", "From August 15, a limited-time tea table, Goldfish in a Cup, opens at eslite spectrum Nanxi."),
        { links: [{ label: t("看小金魚茶包", "View the Goldfish Tea Bags"), href: "/collections/tea" }] },
      ],
    },
  ];
};

const built: Partial<Record<Locale, NewsEntry[]>> = {};
// 真皮包與金飾的情境照全站隱藏（使用者 2026-10-07，美國市場不販售）：Show more! 真皮包新品發表那篇不出現在清單、其他文章與網站地圖，網址變 404；資料保留
// 2026 中秋禮盒不在美國販售（使用者 2026-10-07，美國版商品清單）：預購那篇也隱藏
const hiddenNews = new Set(["show-more-leather-bag-launch", "mid-autumn-2026-pre-order"]);
export const getNews = (lang: Locale) => (built[lang] ??= build(lang).filter((n) => !hiddenNews.has(n.slug)));
export const findNews = (slug: string, lang: Locale) => getNews(lang).find((n) => n.slug === slug);
