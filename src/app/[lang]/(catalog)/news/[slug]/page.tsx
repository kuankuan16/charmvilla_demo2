import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { Picture } from "@/components/ui";
import { findNews, getNews } from "@/data/news";
import { alternatesFor, defaultLocale, isLocale, locales, localeHref, translator } from "@/i18n/config";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((lang) => getNews(lang).map((n) => ({ lang, slug: n.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = isLocale(raw) ? raw : defaultLocale;
  const n = findNews(slug, lang);
  return n ? { title: lang === "en" ? `${n.title} | CHARM VILLA` : `${n.title}｜CHARM VILLA`, description: n.summary, alternates: alternatesFor(lang, `/news/${slug}`) } : {};
}

// Article (user 2026-10-06, after jakobsencopenhagen.com/stories, verin, framer and solena): the 4:5 photograph held beside
// the text while it scrolls; at the right the breadcrumb, category and date, the title over a short gold rule, the text and its
// links, and the way back; then the other stories as a numbered list. The entry's wide `hero` is not shown here: the launch
// banner is the same pose as its card, and the same picture twice on one page reads as a repeat.
export default async function NewsArticle({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const n = findNews(slug, lang);
  if (!n) notFound();
  const t = translator(lang);
  const all = getNews(lang);
  const others = all.map((o, i) => ({ ...o, n: String(i + 1).padStart(2, "0") })).filter((o) => o.slug !== n.slug);
  return (
    <article className="news-article">
      <div className="news-story">
        <div className="news-story-media"><div className="news-story-image" style={n.ground ? { background: n.ground } : undefined}><Picture img={n.card} fill fit={n.whole ? "contain" : "cover"} animate={false} sizes="(min-width:768px) 46vw, 100vw" /></div></div>
        <div className="news-story-text">
          <nav className="news-crumbs tc" aria-label={t("麵包屑", "Breadcrumb")}><Link href={localeHref(lang, "/news")}>{t("最新消息", "News")}</Link><span aria-hidden="true">/</span><span aria-current="page">{n.title}</span></nav>
          <div className="news-story-main">
            <p className="news-story-meta tc"><span>{n.tag}</span><time dateTime={n.date}>{n.dateLabel}</time></p>
            <h1 className="tc">{n.title}</h1>
            <span className="news-story-rule" aria-hidden="true" />
            <div className="news-article-body">
              {n.body.map((b, i) => typeof b === "string" ? <p key={i} className="tc">{b}</p>
                : "list" in b ? <ul key={i}>{b.list.map((x) => <li key={x} className="tc">{x}</li>)}</ul>
                : <p key={i} className="news-article-links">{b.links.map((l) => <Link key={l.href} href={l.href.startsWith("/media/") ? l.href : localeHref(lang, l.href)} className="tc">{l.label}</Link>)}</p>)}
            </div>
          </div>
          <div className="news-story-foot"><Link href={localeHref(lang, "/news")} className="news-back tc"><span className="news-arrow news-arrow-back" aria-hidden="true" />{t("返回最新消息", "Back to News")}</Link></div>
        </div>
      </div>

      {others.length > 0 && (
        <section className="news-more" aria-labelledby="news-more-title">
          <header className="news-more-head">
            <h2 id="news-more-title" className="tc">{t("更多消息", "More news")}</h2>
            <Link href={localeHref(lang, "/news")} className="news-read tc">{t("全部消息", "All news")}<span className="news-arrow" aria-hidden="true" /></Link>
          </header>
          <ul className="news-more-list">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={localeHref(lang, `/news/${o.slug}`)} className="news-more-row">
                  <span className="news-num" aria-hidden="true">{o.n}</span>
                  <div className="news-more-thumb" style={o.focus ? ({ "--focus": o.focus } as CSSProperties) : undefined}><Picture img={o.card} fill fit="cover" animate={false} sizes="120px" /></div>
                  <div><span className="news-more-meta tc">{o.tag}{lang === "en" ? " · " : "・"}<time dateTime={o.date}>{o.dateLabel}</time></span><span className="news-more-title tc">{o.title}</span></div>
                  <span className="news-arrow news-arrow-long" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
