// Business identity and shopping policies for the shopping guide, the privacy page and the footer (2026-10-02).
// Required by 消費者保護法 §18–19, 個人資料保護法 §8 and 零售業等網路交易定型化契約應記載事項. Facts are copied from the
// brand's official sites (each section names its source); what the brand has not published is a { pending } block, shown
// as 「待品牌方提供」 rather than invented. The full list of open items: 電商必備資料清單.xlsx (2026-10-02 package).

import { translator, type Locale } from "../i18n/config";

/** A paragraph, a bulleted list, or a fact the brand still has to supply. */
export type PolicyBlock = string | { list: string[] } | { pending: string };
export type PolicySection = { id: string; heading: string; blocks: PolicyBlock[]; source?: string };

// Sources (read 2026-10-02):
const TW = "www.charmvilla.com.tw";                               // the brand's official online store
const REGISTRY = "經濟部商工登記公示資料（data.gcis.nat.gov.tw）";    // company registry: tax id, representative, address
const LAW = "消費者保護法第 19 條";

const build = (lang: Locale) => {
  const t = translator(lang);
  const pending = (zh: string, en: string): PolicyBlock => ({ pending: t(zh, en) });
  // Seller identity. The registered name has no published English form, so it stays in Chinese on both pages.
  const company = {
    name: "子村宥宥股份有限公司",
    taxId: "70391352",
    representative: "謝少庠",
    address: t("新北市淡水區沙崙路一段 126 巷 32 號 2 樓", "2F, No. 32, Lane 126, Sec. 1, Shalun Rd., Tamsui Dist., New Taipei City, Taiwan"),
    phone: "02-2542-0303",
    hours: "10:00–21:00",
    email: "e-service@charmvilla.com",
  };
  const identity: PolicyBlock = { list: [
    t(`公司名稱：${company.name}（CHARM VILLA）`, `Company: ${company.name} (CHARM VILLA)`),
    t(`統一編號：${company.taxId}`, `Tax ID (統一編號): ${company.taxId}`),
    t(`代表人：${company.representative}`, `Representative: ${company.representative}`),
    t(`公司登記地址：${company.address}`, `Registered address: ${company.address}`),
    t(`客服電話：${company.phone}（${company.hours}）`, `Customer service: +886 2 2542 0303 (${company.hours}, Taiwan time)`),
    t(`客服信箱：${company.email}`, `Email: ${company.email}`),
  ] };

  const guide = {
    title: t("購物須知", "Shopping guide"),
    intro: t("訂購前請先閱讀以下說明。本站為 CHARM VILLA 的新版網站，線上結帳開放前，請透過門市或 CHARM VILLA 台灣官方線上商店（www.charmvilla.com.tw）訂購。",
      "Please read the following before ordering. This is CHARM VILLA's new website; until online checkout opens here, orders are taken in our stores and at the CHARM VILLA Taiwan official online store (www.charmvilla.com.tw)."),
    sections: [
      { id: "seller", heading: t("賣家資訊", "Seller"), blocks: [identity], source: `${TW}；${REGISTRY}` },
      { id: "payment", heading: t("訂購與付款", "Ordering and payment"), blocks: [
        t("付款方式：貨到付款、線上刷卡、ATM 匯款（戶名：子村宥宥股份有限公司）。", "Payment: cash on delivery, card online, or ATM bank transfer (account name 子村宥宥股份有限公司)."),
        t("本站標示之價格為新台幣。", "Prices on this site are in New Taiwan dollars (NT$)."),
        pending("價格是否含稅、刷卡分期與其他付款方式，待品牌方確認。", "Whether prices include tax, card instalments and any other payment methods are awaiting confirmation."),
        t("訂單於出貨前，CHARM VILLA 保有不接受訂單或取消出貨之權利。", "Until an order is shipped, CHARM VILLA may decline the order or cancel its shipment."),
      ], source: TW },
      { id: "shipping", heading: t("運送", "Delivery"), blocks: [
        { list: [
          t("單筆訂單滿 NT$ 2,000 免運費；未滿則酌收運費 NT$ 120。", "Orders of NT$ 2,000 or more ship free; below that, delivery is NT$ 120."),
          t("貨到付款、線上刷卡：訂單成立後翌日起算，約 5–7 個工作天送達。", "Cash on delivery or card: about 5–7 working days from the day after the order is placed."),
          t("ATM 匯款：確認款項後翌日起算，約 5 個工作天送達。", "ATM transfer: about 5 working days from the day after payment is confirmed."),
          t("超商取貨單筆最多寄送 4 盒。", "Convenience-store pickup takes up to 4 boxes per order."),
          t("可寄送台灣與港澳；港澳訂單同樣滿 NT$ 2,000 免運，香港部分偏遠地區物流可能另收運費。", "We ship within Taiwan and to Hong Kong and Macau, with the same free delivery from NT$ 2,000; in some remote parts of Hong Kong the carrier may charge an extra fee."),
          t("金飾不提供海外寄送。", "Jewelry is not shipped overseas."),
        ] },
        pending("離島運費與配送時間、合作物流業者，待品牌方確認。", "Outlying-island rates and times, and the carriers used, are awaiting confirmation."),
      ], source: TW },
      { id: "made-to-order", heading: t("訂製與預購商品", "Made-to-order pieces"), blocks: [
        t("金飾為訂製商品，製作時間視訂單情形約 25–60 天，請於訂購前先來電洽詢。", "Jewelry is made to order and takes about 25–60 days depending on orders; please call us before ordering."),
        t("珍稀禮盒（如紫斑蝶）依茶葉競賽結果供應，售價依競賽公定價格調整。", "Rare gift boxes (such as Purple Butterfly) depend on tea-competition results, and their price follows the competition's official price."),
      ], source: TW },
      { id: "returns", heading: t("退換貨", "Returns"), blocks: [
        t(`依${LAW}，網路購物之消費者得於收受商品後七日內，以退回商品或書面通知方式解除契約，無須說明理由及負擔任何費用或對價。`,
          "Under Article 19 of Taiwan's Consumer Protection Act, you may cancel an online purchase within seven days of receiving the goods, by returning them or by written notice, without giving a reason or bearing any cost."),
        t("七日鑑賞期非試用期，退回之商品請保持完整包裝與配件。", "The seven days are for examining the goods, not for trial use; please return pieces complete with their packaging and accessories."),
        pending("退貨申請方式、退款時間與方式，以及不適用七日解除權之商品（例如已拆封食品、訂製金飾），待品牌方確認後於此載明；未載明前，所有商品均適用七日解除權。",
          "How to request a return, refund timing and method, and any pieces excluded from the seven-day right (such as opened food or made-to-order jewelry) are awaiting confirmation; until they are listed here, the seven-day right applies to every piece."),
      ], source: `${LAW}；${TW}` },
      { id: "invoice", heading: t("發票", "Invoices"), blocks: [
        pending("電子發票開立方式（手機條碼載具、捐贈、統一編號）待品牌方確認。", "How e-invoices are issued (mobile barcode carrier, donation, company tax ID) is awaiting confirmation."),
      ] },
      { id: "service", heading: t("客服與消費爭議", "Customer service and complaints"), blocks: [
        t(`客服電話 ${company.phone}（${company.hours}），客服信箱 ${company.email}。`, `Call +886 2 2542 0303 (${company.hours}, Taiwan time) or write to ${company.email}.`),
        t("如對處理結果有疑義，可撥打行政院消費者服務專線 1950 或向各地方政府消費者服務中心申訴。", "If a complaint is not resolved, consumers in Taiwan can call the Executive Yuan consumer hotline 1950 or contact a local government consumer service centre."),
        t("本站條款之解釋與適用依中華民國法律，並以公司所在地之地方法院為第一審管轄法院。", "These terms are governed by the laws of the Republic of China (Taiwan); the district court where the company is registered is the court of first instance."),
      ], source: TW },
    ] as PolicySection[],
  };

  const privacy = {
    title: t("隱私權政策", "Privacy policy"),
    intro: t(`本政策說明 ${company.name}（CHARM VILLA）在本網站如何蒐集、使用與保護您的個人資料，依個人資料保護法第 8 條告知。`,
      `This policy explains how ${company.name} (CHARM VILLA) collects, uses and protects personal data on this website, as notified under Article 8 of Taiwan's Personal Data Protection Act.`),
    sections: [
      { id: "collector", heading: t("蒐集者", "Who collects your data"), blocks: [identity] , source: `${TW}；${REGISTRY}` },
      { id: "data", heading: t("蒐集的資料", "What we collect"), blocks: [{ list: [
        t("建立會員帳號：姓名、Email、手機（選填）、密碼，以及是否願意收到新品與活動通知。", "Creating an account: name, email, mobile number (optional), password, and whether you want news of new pieces and events."),
        t("會員地址簿：收件人姓名、地址、電話。", "Your address book: recipient name, address and phone number."),
        t("購物車：只在您的瀏覽器中記錄商品與數量，不含個人資料。", "The bag: only the pieces and quantities, kept in your own browser, with no personal data."),
      ] }] },
      { id: "use", heading: t("使用目的與範圍", "How we use it"), blocks: [
        { list: [
          t("會員登入與帳號管理。", "Signing in and managing your account."),
          t("處理訂單、配送與客服聯繫。", "Processing orders, delivery and customer service."),
          t("經您同意後寄送電子報或商品訊息；您可隨時表示拒絕，我們即停止寄送。", "With your consent, sending newsletters or product news; tell us at any time and we will stop."),
        ] },
        t("會員帳號與訂單資料由 Shopify 平台代為處理與保存，資料可能儲存於台灣以外的地區。", "Accounts and orders are processed and stored for us by the Shopify platform, which may keep data outside Taiwan."),
        pending("個人資料保存期間，以及合作之物流、金流業者名單，待品牌方確認。", "How long personal data is kept, and the delivery and payment companies we share it with, are awaiting confirmation."),
      ] },
      { id: "rights", heading: t("您的權利", "Your rights"), blocks: [
        t("依個人資料保護法第 3 條，您可以向我們請求：查詢或閱覽、製給複製本、補充或更正、停止蒐集處理或利用、刪除您的個人資料。", "Under Article 3 of the Personal Data Protection Act you may ask us to let you see your data, give you a copy, correct or complete it, stop collecting, processing or using it, or delete it."),
        t(`請來信 ${company.email} 或來電 ${company.phone}。`, `Write to ${company.email} or call +886 2 2542 0303.`),
        t("若您不提供必要資料，將無法建立會員帳號或完成訂購。", "Without the required details we cannot create an account for you or complete an order."),
      ] },
      { id: "cookies", heading: t("Cookie 與瀏覽器儲存", "Cookies and browser storage"), blocks: [{ list: [
        t("登入狀態：一個僅供本站伺服器讀取的 Cookie。", "Sign-in: one cookie that only this site's server can read."),
        t("購物車與開場動畫：存放在您的瀏覽器中，可隨時清除。", "The bag and the opening animation: stored in your browser; you can clear them at any time."),
        t("本站目前未使用廣告或分析追蹤工具。", "This site uses no advertising or analytics trackers."),
      ] }] },
      { id: "security", heading: t("資料安全與政策修訂", "Security and changes"), blocks: [
        t("本站全程以 HTTPS 加密傳輸。本政策如有修訂，將公布於此頁並更新日期。", "The whole site is served over encrypted HTTPS. Changes to this policy are published on this page with a new date."),
      ] },
    ] as PolicySection[],
  };

  const footer = {
    links: [
      { label: t("購物須知", "Shopping guide"), href: "/shopping-guide" },
      { label: t("退換貨", "Returns"), href: "/shopping-guide#returns" },
      { label: t("隱私權政策", "Privacy policy"), href: "/privacy" },
    ],
    company: [
      t(`${company.name}　統一編號 ${company.taxId}`, `${company.name} · Tax ID ${company.taxId}`),
      t(`客服 ${company.phone}（${company.hours}）`, `+886 2 2542 0303 (${company.hours})`),
      company.email,
    ],
  };

  return {
    company, guide, privacy, footer,
    updated: t("資料更新日期：2026 年 10 月 2 日", "Last updated: 2 October 2026"),
    labels: { contents: t("本頁內容", "On this page"), pending: t("待品牌方提供", "To be confirmed"), source: t("資料來源：", "Source: ") },
  };
};

const built: Partial<Record<Locale, ReturnType<typeof build>>> = {};
export const getCommerce = (lang: Locale) => (built[lang] ??= build(lang));
