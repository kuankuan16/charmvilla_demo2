import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAbout } from "@/data/about";
import { getContent } from "@/data/content";
import { categoryHref, getCategories } from "@/data/catalog";
import { alternatesFor, defaultLocale, isLocale, localeHref, translator, type Locale } from "@/i18n/config";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isLocale(raw) ? raw : defaultLocale;
  const t = translator(lang);
  return {
    title: t("關於 CHARM VILLA", "About | CHARM VILLA"),
    description: getAbout(lang).intro,
    alternates: alternatesFor(lang, "/about"),
  };
}

// Line icons for the store's terms (24 px grid, 1.5 px stroke, currentColor).
const icons: Record<string, React.ReactNode> = {
  shipping: <path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7M6 18a1.75 1.75 0 1 0 0-.01M17 18a1.75 1.75 0 1 0 0-.01" />,
  payment: <path d="M3 6.5h18v11H3zM3 10h18M6.5 14.5h4" />,
  delivery: <path d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM12 7.5V12l3 2" />,
  returns: <path d="M8 8.5H4.5V5M4.8 8.3A8 8 0 1 1 4 13" />,
};

const ArrowLink = ({ href, label, lang }: { href: string; label: string; lang: Locale }) => (
  <Link href={href.startsWith("#") ? href : localeHref(lang, href)} className="about-link tc">{label}<span className="about-link-arrow" aria-hidden="true" /></Link>
);

// About (user 2026-10-05: 「根據目前的設計風格…自動幫我完成 about 頁面」; then 「關於我們的頁面內容參考 zema-template.webflow.io/our-story，
// 補齊更像電商的功能」). The reference's order, with this brand's facts: the opening, the figures,
// four chapters (each with a link), the range, the store's service terms (the reference's benefit badges), questions and answers,
// and the sources every fact comes from (src/data/about.ts).
export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = translator(lang);
  const about = getAbout(lang);
  const { tea } = getContent(lang);
  const categories = getCategories(lang);
  return (
    <article className="about-page">
      {/* Opening spread for a portrait photograph (2026-10-05): the name, slogan and intro in the left half, set at the foot of the
          column; the photograph fills the right half. */}
      <header className="about-hero">
        <div className="about-hero-text">
          <p className="catalog-eyebrow tc">{about.eyebrow}</p>
          <h1>{about.title}</h1>
          <p className="about-slogan tc">{about.slogan}</p>
          <p className="about-intro tc">{about.intro}</p>
        </div>
        <figure className="about-hero-image"><Image src={about.hero.src} alt={about.hero.alt} fill priority sizes="(min-width:768px) 50vw, 100vw" quality={90} /></figure>
      </header>

      <ul className="about-figures">
        {about.figures.map((f) => <li key={f.value}><strong>{f.value}</strong><span className="tc">{f.label}</span></li>)}
      </ul>

      {about.chapters.map((c) => (
        <section key={c.id} className={`about-chapter about-chapter--${c.side}`} aria-labelledby={`about-${c.id}`}>
          <figure className="about-chapter-image" style={{ aspectRatio: c.image.w / c.image.h > 1.2 ? "3 / 2" : "4 / 5" }}>
            <Image src={c.image.src} alt={c.image.alt} fill sizes="(min-width:768px) 50vw, 100vw" />
          </figure>
          <div className="about-chapter-text">
            <p className="about-chapter-index">{c.index}</p>
            <h2 id={`about-${c.id}`} className="tc">{c.title}</h2>
            {c.body.map((p) => <p key={p} className="tc">{p}</p>)}
            {c.quote && <blockquote className="about-quote"><p className="tc">{c.quote.text}</p><cite className="tc">{c.quote.by}</cite></blockquote>}
            {/* the two award marks under the 03 text, larger, without captions (user 2026-10-05: 「刪除說明字，並加大 logo」「得獎 logo 加在這段文字之下」) */}
            {c.id === "world" && <div className="about-award-marks" role="group" aria-label={tea.honoursAria}>
              {tea.awards.map((a) => <Image key={a.image.src} src={a.image.src} alt={a.image.alt} width={a.image.w} height={a.image.h} sizes="200px" />)}
            </div>}
            {c.cta && <p className="about-chapter-cta"><ArrowLink href={c.cta.href} label={c.cta.label} lang={lang} /></p>}
          </div>
        </section>
      ))}

      <section className="about-range" aria-labelledby="about-range-title">
        <h2 id="about-range-title" className="tc">{about.rangeTitle}</h2>
        <ul>
          {about.range.map((r) => {
            const cat = categories.find((c) => c.id === r.id);
            if (!cat) return null;
            return <li key={r.id}><Link href={categoryHref(r.id, lang)} className="about-range-card">
              <span className="about-range-image"><Image src={r.image.src} alt={r.image.alt} fill sizes="(min-width:1024px) 16vw, (min-width:768px) 31vw, 48vw" style={r.position ? { objectPosition: r.position } : undefined} /></span>
              <span className="about-range-name tc">{cat.name}</span>
            </Link></li>;
          })}
        </ul>
      </section>

      {/* the selected pieces with prices and bag buttons were removed (user 2026-10-05: 「刪」); the store's service terms stay */}
      <section className="about-shop" aria-label={t("購物服務", "Shopping services")}>
        <ul className="about-benefits">
          {about.benefits.map((b) => <li key={b.id}><Link href={localeHref(lang, b.href)} className="about-benefit">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[b.id]}</svg>
            <strong className="tc">{b.title}</strong>
            <span className="tc">{b.text}</span>
          </Link></li>)}
        </ul>
      </section>

      <section className="about-faq" aria-labelledby="about-faq-title">
        <header className="about-section-head">
          <h2 id="about-faq-title" className="tc">{about.faqTitle}</h2>
          <ArrowLink href={about.faqMore.href} label={about.faqMore.label} lang={lang} />
        </header>
        <div className="about-faq-list">
          {about.faq.map((f) => <details key={f.q}>
            <summary className="tc">{f.q}<span className="about-faq-icon" aria-hidden="true" /></summary>
            <p className="tc">{f.a}</p>
          </details>)}
        </div>
      </section>
    </article>
  );
}
