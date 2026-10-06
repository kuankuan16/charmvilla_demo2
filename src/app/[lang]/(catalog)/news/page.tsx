import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsIndex from "@/components/catalog/NewsIndex";
import { getNews } from "@/data/news";
import { alternatesFor, defaultLocale, isLocale, localeHref, translator } from "@/i18n/config";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isLocale(raw) ? raw : defaultLocale;
  const t = translator(lang);
  return { title: t("最新消息｜CHARM VILLA", "News & Announcements | CHARM VILLA"), description: t("新品發表、禮盒預購與期間限定活動。", "Launches, gift-box pre-orders and limited-time events."), alternates: alternatesFor(lang, "/news") };
}

// News (user 2026-10-06: 「最新消息單元的版型參考這些，並重新設計適合現在官網的版型」, after jakobsencopenhagen.com/stories and
// the verin, framer and solena templates): the title with the number of stories in light ink and a short line at the right,
// then the filters and the list (src/components/catalog/NewsIndex.tsx). Stories are numbered newest first.
export default async function NewsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = translator(lang);
  const news = getNews(lang);
  const items = news.map((n, i) => ({
    slug: n.slug, href: localeHref(lang, `/news/${n.slug}`), n: String(i + 1).padStart(2, "0"), date: n.date, dateLabel: n.dateLabel,
    tag: n.tag, title: n.title, summary: n.summary, card: n.card, focus: n.focus,
  }));
  return (
    <section className="news-page" aria-labelledby="news-title">
      <header className="news-mast">
        <h1 id="news-title" className="tc">{t("最新消息", "News & Announcements")}<span className="news-mast-count" aria-hidden="true">{news.length}</span></h1>
        <p className="news-mast-intro tc">{t("新品發表、禮盒預購與期間限定活動，CHARM VILLA 的近況都在這裡。", "Launches, gift-box pre-orders and limited-time events: the latest from CHARM VILLA.")}</p>
      </header>
      <NewsIndex items={items} allLabel={t("全部", "All")} filterLabel={t("依分類瀏覽", "Browse by category")} readLabel={t("閱讀全文", "Read the story")} />
    </section>
  );
}
