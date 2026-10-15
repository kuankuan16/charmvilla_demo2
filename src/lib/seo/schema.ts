import type { Product } from "@/data/catalog";
import type { NewsEntry } from "@/data/news";
import type { Img } from "@/data/content";
import { company, supportEmail } from "../../data/commerce";
import { htmlLang, siteUrl, translator, type Locale } from "../../i18n/config";
import { variantLabel } from "../shopify/catalog-data";
import { absoluteUrl, pageUrl, seoText } from "./metadata";

export type SchemaNode = Record<string, unknown>;
export const entityIds = {
  store: `${siteUrl}/#organization`, brand: `${siteUrl}/#brand`, website: `${siteUrl}/#website`, logo: `${siteUrl}/#logo`,
};
export const ref = (id: string) => ({ "@id": id });
export const graph = (nodes: SchemaNode[]) => ({ "@context": "https://schema.org", "@graph": nodes });
export const serializeSchema = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

/** US distributor and Taiwanese brand are different entities. No unverified parent-company relationship. */
export function siteEntities(lang: Locale, socialUrls: string[]) {
  const t = translator(lang);
  return [
    { "@type": "OnlineStore", "@id": entityIds.store, name: "CHARM VILLA US Store", legalName: company.legalName, url: `${siteUrl}/`,
      description: seoText(t("由 Haoying LLC 經營的 CHARM VILLA 美國授權獨立經銷商，從加州出貨；美國僅提供線上購買。", "CHARM VILLA's authorized independent US distributor, operated by Haoying LLC. Orders ship from California; the US store sells online only.")),
      logo: ref(entityIds.logo), image: absoluteUrl("/media/site/og-charm-villa-1200x630.jpg"), email: supportEmail,
      address: { "@type": "PostalAddress", streetAddress: company.street, addressLocality: company.locality, addressRegion: company.region, postalCode: company.postalCode, addressCountry: company.country },
      contactPoint: { "@type": "ContactPoint", contactType: "customer service", email: supportEmail, availableLanguage: ["en", "zh-Hant"] },
      areaServed: { "@type": "Country", name: "United States" }, brand: ref(entityIds.brand) },
    { "@type": "Brand", "@id": entityIds.brand, name: "CHARM VILLA", alternateName: ["CHARMVILLA", "子村莊園"], url: "https://www.charmvilla.com.tw/", logo: ref(entityIds.logo), sameAs: ["https://charmvilla.jp/", ...socialUrls] },
    { "@type": "ImageObject", "@id": entityIds.logo, url: absoluteUrl("/brand/charmvilla-logo-schema.png"), contentUrl: absoluteUrl("/brand/charmvilla-logo-schema.png"), width: 1200, height: 240, caption: "CHARM VILLA" },
    { "@type": "WebSite", "@id": entityIds.website, url: `${siteUrl}/`, name: "CHARM VILLA", publisher: ref(entityIds.store), about: ref(entityIds.brand), inLanguage: ["en", "zh-Hant"] },
  ];
}

export function webPage(lang: Locale, path: string, name: string, description: string, type = "WebPage", extra: SchemaNode = {}): SchemaNode {
  const url = pageUrl(lang, path);
  return { "@type": type, "@id": `${url}#webpage`, url, name: seoText(name), description: seoText(description), inLanguage: htmlLang[lang], isPartOf: ref(entityIds.website), publisher: ref(entityIds.store), about: ref(entityIds.brand), ...extra };
}
export function breadcrumbs(lang: Locale, items: { path: string; name: string }[]): SchemaNode {
  const url = pageUrl(lang, items[items.length - 1].path);
  return { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: seoText(item.name), item: pageUrl(lang, item.path) })) };
}
export function pageNodes(lang: Locale, path: string, name: string, description: string, type = "WebPage", parents: { path: string; name: string }[] = [], extra: SchemaNode = {}) {
  const t = translator(lang);
  const url = pageUrl(lang, path);
  return [webPage(lang, path, name, description, type, { breadcrumb: ref(`${url}#breadcrumb`), ...extra }), breadcrumbs(lang, [{ path: "/", name: t("首頁", "Home") }, ...parents, { path, name }])];
}
export function itemList(lang: Locale, path: string, items: { path: string; name: string }[]): SchemaNode {
  return { "@type": "ItemList", "@id": `${pageUrl(lang, path)}#list`, numberOfItems: items.length, itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: seoText(item.name), url: pageUrl(lang, item.path) })) };
}

/** One Offer per actual Shopify variant: keep different prices, SKUs and stock states intact. */
export function productNode(product: Product, category: string, lang: Locale): SchemaNode {
  const url = pageUrl(lang, `/products/${product.slug}`);
  const data = product.shopifyData;
  const offers = !product.displayOnly && data?.published && data.status === "ACTIVE" && product.price?.currency === "USD"
    ? data.variants.filter(v => v.price.trim() !== "" && Number.isFinite(Number(v.price)) && Number(v.price) >= 0).map(v => ({
      "@type": "Offer", "@id": `${url}#offer-${v.id.split("/").pop()}`, url,
      name: seoText(data.variants.length > 1 ? `${product.name} — ${variantLabel(v.title, lang)}` : product.name),
      ...(v.sku ? { sku: v.sku } : {}), price: v.price, priceCurrency: "USD", seller: ref(entityIds.store),
      availability: `https://schema.org/${!v.availableForSale ? "OutOfStock" : data.scheduledPreOrder ? "PreOrder" : v.currentlyNotInStock ? "BackOrder" : "InStock"}`,
    })) : [];
  const images = [...new Set([product.image.src, ...product.views.filter(v => !v.placeholder).map(v => v.image.src)])].map(absoluteUrl);
  return { "@type": "Product", "@id": `${url}#product`, url, name: seoText(product.name), description: seoText(product.description), image: images,
    category: seoText(category), brand: ref(entityIds.brand), mainEntityOfPage: ref(`${url}#webpage`),
    ...(data ? { productID: data.productId } : {}),
    ...(data?.variants.length === 1 && data.variants[0].sku ? { sku: data.variants[0].sku } : {}),
    ...(offers.length ? { offers } : {}) };
}
export function articleNode(news: NewsEntry, lang: Locale): SchemaNode {
  const url = pageUrl(lang, `/news/${news.slug}`);
  const image = news.story ?? news.card;
  // news.date is an event date (including future events), not a verified publication timestamp.
  return { "@type": "Article", "@id": `${url}#article`, url, headline: seoText(news.title), description: seoText(news.summary), inLanguage: htmlLang[lang],
    articleSection: news.tag, image: [absoluteUrl(image.src)], publisher: ref(entityIds.store), mainEntityOfPage: ref(`${url}#webpage`), about: ref(entityIds.brand) };
}

type Shop = { id: string; name: string; addr: string; phone: { tel: string }; href: string; image: Img };
/** The homepage visibly lists these stores. They are not branches of the independent US distributor. */
export function physicalStores(lang: Locale, shops: Shop[]): SchemaNode[] {
  return shops.map((shop) => ({ "@type": "Store", "@id": `${siteUrl}/#store-${shop.id === "taipei" ? "taipei" : "kyoto"}`, name: seoText(shop.name),
    url: `${pageUrl(lang, "/")}#visit`, image: absoluteUrl(shop.image.src), telephone: shop.phone.tel, hasMap: shop.href,
    address: { "@type": "PostalAddress", streetAddress: seoText(shop.addr), addressLocality: shop.id === "taipei" ? "Taipei" : "Kyoto", addressCountry: shop.id === "taipei" ? "TW" : "JP" },
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: (shop.id === "taipei" ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] : ["Saturday", "Sunday"]).map(d => `https://schema.org/${d}`), opens: shop.id === "taipei" ? "10:00" : "11:00", closes: shop.id === "taipei" ? "21:00" : "18:00" }],
  }));
}
