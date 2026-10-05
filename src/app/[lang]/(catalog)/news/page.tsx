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

// The list in the card style the About page used (user 2026-10-05: 「最新消息清單版型改這個」): three columns with the page's
// gaps, a 4:5 photograph, then the date and category on one line, the title and one line of summary.
export default async function NewsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = translator(lang);
  return (
    <section className="news-page" aria-labelledby="news-title">
      <header className="news-head">
        <h1 id="news-title" className="tc">{t("最新消息", "News & Announcements")}</h1>
      </header>
      <ul className="news-grid">
        {getNews(lang).map((n) => (
          <li key={n.slug}>
            <Link href={localeHref(lang, `/news/${n.slug}`)} className="news-card">
              <span className="news-card-image"><Picture img={n.card} fill fit="cover" animate={false} sizes="(min-width:768px) 32vw, 100vw" /></span>
              <span className="news-card-meta tc"><time dateTime={n.date}>{n.dateLabel}</time>・{n.tag}</span>
              <span className="news-card-title tc">{n.title}</span>
              <span className="news-card-summary tc">{n.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
