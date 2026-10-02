import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  return n ? { title: `${n.title}｜CHARM VILLA`, description: n.summary, alternates: alternatesFor(lang, `/news/${slug}`) } : {};
}

// Article after the reference: breadcrumb, title, a wide photograph, the date and category, then the text in a centred column.
export default async function NewsArticle({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const n = findNews(slug, lang);
  if (!n) notFound();
  const t = translator(lang);
  return (
    <article className="news-article">
      <nav className="news-crumbs tc" aria-label={t("麵包屑", "Breadcrumb")}><Link href={localeHref(lang, "/news")}>{t("最新消息", "News")}</Link><span aria-hidden="true">/</span><span aria-current="page">{n.title}</span></nav>
      <h1 className="tc">{n.title}</h1>
      <div className="news-article-hero"><Picture img={n.hero} fill fit="cover" animate={false} sizes="(min-width:768px) 88vw, 100vw" /></div>
      <p className="news-article-meta tc"><span>{n.tag}</span><time dateTime={n.date}>{n.dateLabel}</time></p>
      <div className="news-article-body">
        {n.body.map((b, i) => typeof b === "string" ? <p key={i} className="tc">{b}</p>
          : "list" in b ? <ul key={i}>{b.list.map((x) => <li key={x} className="tc">{x}</li>)}</ul>
          : <p key={i} className="news-article-links">{b.links.map((l) => <Link key={l.href} href={l.href.startsWith("/media/") ? l.href : localeHref(lang, l.href)} className="tc">{l.label}</Link>)}</p>)}
      </div>
    </article>
  );
}
