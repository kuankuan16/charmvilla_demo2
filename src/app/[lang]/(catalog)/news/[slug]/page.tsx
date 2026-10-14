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
// 2026-10-14 (user: 「分析並高度推理，修改排版，請優化」, after a portfolio page held together by hairlines): an event's particulars
// (`facts`) sit in a ruled label / value table instead of loose bullets, and the way back follows the text instead of being pushed to
// the foot of the column, so no empty band opens between them.
// Line icons beside the detail titles in the style of a plain outline icon set (user 2026-10-14: 「我想要像這樣加入 icon」, then
// 「icon 風格改這樣」 with a sheet of simple single-weight outline icons): one even stroke, rounded ends, no fill, no echoes or tints,
// only the few lines that name the thing. Decorative only (the title says it in words).
function FactIcon({ kind }: { kind: "venue" | "event" | "hours" }) {
  return <svg className="news-fact-icon" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "venue" && <><path d="M16 28c-5.5-6.3-8.5-10.8-8.5-14.5a8.5 8.5 0 0 1 17 0c0 3.7-3 8.2-8.5 14.5Z" /><circle cx="16" cy="13.5" r="3" /></>}
    {kind === "event" && <><rect x="5.5" y="7.5" width="21" height="19" rx="1.5" /><path d="M5.5 12.5h21M11 5.5v4M21 5.5v4M12.5 15.5v8M19.5 15.5v8M9 18h14M9 21.5h14" /></>}
    {kind === "hours" && <><circle cx="16" cy="16" r="11" /><path d="M16 9.5V16h5M16 5v2M16 25v2M5 16h2M25 16h2" /></>}
  </svg>;
}

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
        <div className="news-story-media"><div className="news-story-image" style={n.ground ? { background: n.ground } : undefined}><Picture img={n.story ?? n.card} fill fit={n.story ? "cover" : n.whole ? "contain" : "cover"} animate={false} sizes="(min-width:768px) 46vw, 100vw" /></div></div>
        <div className="news-story-text">
          <nav className="news-crumbs tc" aria-label={t("麵包屑", "Breadcrumb")}><Link href={localeHref(lang, "/news")}>{t("最新消息", "News")}</Link><span aria-hidden="true">/</span><span aria-current="page">{n.title}</span></nav>
          <div className="news-story-main">
            <p className="news-story-meta tc"><span>{n.tag}</span><time dateTime={n.date}>{n.dateLabel}</time></p>
            <h1 className="tc">{n.title}</h1>
            <span className="news-story-rule" aria-hidden="true" />
            <div className="news-article-body">
              {n.body.map((b, i) => typeof b === "string" ? <p key={i} className="tc">{b}</p>
                : "heading" in b ? <p key={i} className="tc font-bold">{b.heading /* bold sub-heading (user 2026-10-13: 「開幕活動一般開放時間 加粗」) */}</p>
                : "list" in b ? <ul key={i}>{b.list.map((x) => <li key={x} className="tc">{x}</li>)}</ul>
                : <p key={i} className="news-article-links">{b.links.map((l) => <Link key={l.href} href={l.href.startsWith("/media/") ? l.href : localeHref(lang, l.href)} className="tc">{l.label}</Link>)}</p>)}
            </div>
            {n.facts && (
              <dl className="news-facts">
                {n.facts.map((f) => (
                  <div key={f.label} className="news-fact">
                    <dt className="tc">{f.icon && <FactIcon kind={f.icon} />}<span className="news-fact-label">{f.label}</span></dt>
                    <dd>
                      <span className="news-fact-value tc">{f.value.split(/(・| · )/).map((x, i) => i % 2 ? x : <span key={i} className="news-fact-part">{x}</span> /* each part unbroken: a time never splits as 下 / 午 5:00 */)}</span>
                      {f.detail?.map((d) => <span key={d} className="news-fact-detail tc">{d}</span>)}
                      {f.map && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(f.map)}`} target="_blank" rel="noopener noreferrer" className="news-fact-map tc" aria-label={t("在 Google 地圖開啟（新分頁）", "Open in Google Maps (new tab)")}><span className="news-fact-map-label">{t("地圖", "Map")}</span><span aria-hidden="true">↗</span></a>}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="news-story-foot"><Link href={localeHref(lang, "/news")} className="news-back tc"><span className="news-arrow news-arrow-back" aria-hidden="true" />{t("返回最新消息", "Back to News")}</Link></div>
          </div>
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
