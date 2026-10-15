import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { pageNodes } from "@/lib/seo/schema";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FaqAccordion from "@/components/catalog/FaqAccordion";
import { getCommerce, supportEmail, type PolicySection } from "@/data/commerce";
import { defaultLocale, isLocale, translator, type Locale } from "@/i18n/config";

type Props = { params: Promise<{ lang: string }> };

// Accessibility statement (launch QA 2026-10-13). A goal and a contact route only: no claim of conformance, since no audit has
// certified the site. The copy lives here rather than in src/data so this page stays self-contained; the client should confirm it.
const statement = (lang: Locale) => {
  const t = translator(lang);
  const sections: PolicySection[] = [
    { id: "commitment", heading: t("我們的目標", "Our Goal"), blocks: [
      t("CHARM VILLA 希望每一位客人都能順利瀏覽作品、閱讀商品資訊並完成購物，包括使用螢幕報讀器、鍵盤操作、放大畫面或減少動態效果的客人。",
        "CHARM VILLA wants every customer to be able to browse our pieces, read product information and shop with ease, including customers who use a screen reader, navigate by keyboard, zoom the page or prefer reduced motion."),
      t("我們以全球資訊網協會（W3C）的《網頁內容無障礙指引》（WCAG）2.1 AA 級為努力目標，並會持續檢查與改善本網站。",
        "We are working toward Level AA of the Web Content Accessibility Guidelines (WCAG) 2.1 published by the W3C, and we continue to review and improve this website."),
    ] },
    { id: "measures", heading: t("目前的做法", "What We Do"), blocks: [
      { list: [
        t("內頁提供「跳至內容」連結；我們也努力讓選單、按鈕與表單都能用鍵盤操作。", "A “Skip to content” link on inner pages, and menus, buttons and forms we aim to make usable with a keyboard."),
        t("圖片提供替代文字，表單欄位附有標籤。", "Text alternatives for images and labels for form fields."),
        t("首頁自動輪播的照片可以暫停；系統設定「減少動態效果」時，動畫會停止或簡化。", "A pause button for the rotating photographs on the homepage, and animations that stop or simplify when your device asks for reduced motion."),
        t("網站提供中文與英文兩種語言。", "The website is available in English and Chinese."),
      ] },
    ] },
    { id: "limitations", heading: t("已知限制", "Known Limitations"), blocks: [
      t("部分內容可能尚未完全符合上述目標，例如某些動畫、影片或由第三方提供的頁面（如結帳流程）。我們會在發現問題後盡快改善。",
        "Some content may not yet fully meet this goal, such as certain animations, videos or pages provided by third parties (for example, checkout). We work to fix issues as soon as we learn of them."),
    ] },
    { id: "contact", heading: t("意見回饋與協助", "Feedback and Assistance"), blocks: [
      t(`如果您在使用本網站時遇到任何困難，或需要以其他方式取得資訊，請寫信到 ${supportEmail}，並告訴我們頁面網址與遇到的問題。我們會盡快回覆，並協助您完成需要的服務。`,
        `If you have difficulty using any part of this website, or need information in another format, please email ${supportEmail} with the page address and a description of the problem. We will respond as soon as we can and help you with what you need.`),
    ] },
  ];
  return {
    title: t("無障礙聲明", "Accessibility Statement"),
    intro: t("我們希望每個人都能自在地使用 CHARM VILLA 網站。", "We want everyone to be able to use the CHARM VILLA website comfortably."),
    updated: t("最後更新：2026 年 10 月 13 日", "Last Updated: Oct 13, 2026"),
    sections,
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isLocale(raw) ? raw : defaultLocale;
  const t = translator(lang);
  return pageMetadata({ lang, path: "/accessibility", title: t("無障礙聲明｜CHARM VILLA", "Accessibility Statement | CHARM VILLA"), description: t("CHARM VILLA 以 WCAG 2.1 AA 為目標，持續改善網站無障礙；遇到困難請來信。", "CHARM VILLA works toward WCAG 2.1 Level AA and keeps improving the site. If something gets in your way, email us.") });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const doc = statement(lang);
  const { labels } = getCommerce(lang);
  // the same accordion as /privacy and the other policy pages (user 2026-10-07: 「其他很多資訊的頁面也都用相同的邏輯設計」), without the contact button (「這幾頁的聯絡我們的按鈕可以刪」); the email is in the text
  return <><JsonLd nodes={pageNodes(lang, "/accessibility", doc.title, doc.intro ?? doc.title)} /><FaqAccordion title={doc.title} intro={doc.intro} updated={doc.updated} sections={doc.sections} labels={labels} /></>;
}
