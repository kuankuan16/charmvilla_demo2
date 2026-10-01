"use client";
import { getContent } from "@/data/content";
import { useLocale } from "@/i18n/LocaleProvider";
import { Picture } from "@/components/ui";
import StoreCarousel from "./StoreCarousel";

export default function Visit() {
  const { visit, showMore } = getContent(useLocale());
  // 2026-10-01 (user): the ONLINE SHOP / 前往線上商店 block after the store carousel was removed (the site is the shop).
  return (
    <section id="visit" className="relative">
      <StoreCarousel />
      <div className="container-x">
        <section id="news" aria-labelledby="news-heading" className="grid grid-cols-12 gap-x-20 bg-page py-40">
          <h2 id="news-heading" className="col-span-12 text-xs font-bold lg:col-span-5">{visit.news.label}{visit.news.labelZh && <span className="tc ml-10">{visit.news.labelZh}</span>}</h2>
          <ul className="col-span-12 mt-20 lg:col-span-7 lg:mt-0">
            <li id="news-show-more" className="py-25">
              <article className="grid gap-25 sm:grid-cols-[1fr_150px]" aria-labelledby="launch-news-heading">
                <div>
                  <div className="tc text-xs font-medium text-stone-deep">{showMore.kicker}</div>
                  <h3 id="launch-news-heading" className="mt-10 text-2xl font-bold">{showMore.heading}</h3>
                  <p className="tc mt-8 text-base font-bold">{showMore.sub}</p>
                  <ul className="mt-20 space-y-12">
                    {showMore.events.map((event) => (
                      <li key={event.date} className="grid grid-cols-[55px_1fr] gap-x-12 text-xs leading-body">
                        <span className="tc font-bold">{event.date}</span>
                        <span className="tc">{event.venue}</span>
                      </li>
                    ))}
                  </ul>
                  <a className="link-underline mt-20 inline-flex items-center gap-8 text-xs font-bold" href={showMore.cta.href} target="_blank" rel="noreferrer">
                    <span className="tc">{showMore.cta.label}</span>
                  </a>
                </div>
                <a href={showMore.cta.href} target="_blank" rel="noreferrer" aria-label={showMore.cta.aria} className="block w-160 max-w-full sm:w-full">
                  <Picture img={showMore.invitation} sizes="160px" animate={false} />
                </a>
              </article>
            </li>
            {visit.news.items.map((n, i) => (
              <li
                key={n.text}
                data-animation="moveUp"
                data-delay={i * 0.1}
                className="grid grid-cols-[70px_80px_1fr] gap-x-15 py-15 lg:grid-cols-[90px_90px_1fr]"
              >
                <span className="tc text-xs font-bold">{n.date}</span>
                <span className="tc text-xs font-bold text-ink/60">{n.tag}</span>
                <span className="tc text-base font-bold">{n.text}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
