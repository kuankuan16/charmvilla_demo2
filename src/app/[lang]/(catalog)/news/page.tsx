import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Picture } from "@/components/ui";
import { getNews } from "@/data/news";
import { alternatesFor, defaultLocale, isLocale, localeHref, translator } from "@/i18n/config";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isLocale(raw) ? raw : defaultLocale;
  const t = translator(lang);
  return { title: t("最新消息｜CHARM VILLA", "News & Announcements | CHARM VILLA"), description: t("新品發表、期間限定活動與媒體報導。", "Launches, limited-time events and press."), alternates: alternatesFor(lang, "/news") };
}

// After verin-template.webflow.io/news: a large heading and one line, then a three-column grid of cards — photograph with
// the category on a small label at its top right, title, one line — set close together (4 px across, 32 px down).
export default async function NewsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = translator(lang);
  return (
    <section className="news-page" aria-labelledby="news-title">
      <header className="news-head">
        <h1 id="news-title" className="tc">{t("最新消息", "News & Announcements")}</h1>
        <p className="tc">{t("新品發表、期間限定活動與媒體報導，CHARM VILLA 的最新動態。", "Launches, limited-time events and press: the latest from CHARM VILLA.")}</p>
      </header>
      <ul className="news-grid">
        {getNews(lang).map((n) => (
          <li key={n.slug}>
            <Link href={localeHref(lang, `/news/${n.slug}`)} className="news-card">
              <span className="news-card-image"><Picture img={n.card} fill fit="cover" animate={false} sizes="(min-width:768px) 32vw, 100vw" /><span className="news-card-tag tc">{n.tag}</span></span>
              <span className="news-card-title tc">{n.title}</span>
              <span className="news-card-summary tc">{n.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
