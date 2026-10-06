import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { Picture } from "@/components/ui";
import { getNews } from "@/data/news";
import { alternatesFor, defaultLocale, isLocale, localeHref, translator } from "@/i18n/config";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isLocale(raw) ? raw : defaultLocale;
  const t = translator(lang);
  return { title: t("最新消息｜CHARM VILLA", "News & Announcements | CHARM VILLA"), description: t("新品發表、禮盒預購與期間限定活動。", "Launches, gift-box pre-orders and limited-time events."), alternates: alternatesFor(lang, "/news") };
}

// The list after verin-template.webflow.io/news (user 2026-10-06: 「最新消息清單頁，喜歡這個版型」): the title with a short line under
// it at the left, then three columns only 4 px apart; each card a landscape photograph with the category on a small light label at
// its top right, the title and one line under it. On hover the photograph blurs, the label goes and an outlined eye appears.
export default async function NewsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = translator(lang);
  return (
    <section className="news-page" aria-labelledby="news-title">
      <header className="news-head">
        <h1 id="news-title" className="tc">{t("最新消息", "News & Announcements")}</h1>
        <p className="tc">{t("新品發表、禮盒預購與期間限定活動，CHARM VILLA 的近況都在這裡。", "Launches, gift-box pre-orders and limited-time events: the latest from CHARM VILLA.")}</p>
      </header>
      <ul className="news-grid">
        {getNews(lang).map((n) => (
          <li key={n.slug}>
            <Link href={localeHref(lang, `/news/${n.slug}`)} className="news-card">
              <span className="news-card-image" style={n.focus ? ({ "--focus": n.focus } as CSSProperties) : undefined}>
                <Picture img={n.card} fill fit="cover" animate={false} sizes="(min-width:1024px) 32vw, (min-width:768px) 50vw, 100vw" />
                <span className="news-card-tag tc">{n.tag}</span>
                <span className="news-card-eye" aria-hidden="true"><svg width="58" height="30" viewBox="0 0 58 30" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 15C9 5.5 18.5 1 29 1s20 4.5 28 14c-8 9.5-17.5 14-28 14S9 24.5 1 15Z" /><circle cx="29" cy="15" r="7.5" /></svg></span>
              </span>
              <h2 className="news-card-title tc">{n.title}</h2>
              <span className="news-card-summary tc">{n.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
