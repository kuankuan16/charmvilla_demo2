"use client";
// News list (user 2026-10-06: 「最新消息」 after jakobsencopenhagen.com/stories and the verin, framer and solena templates):
// the categories as text filters, the newest story as a large split (photograph | number, category, title, arrow), the rest as
// framed rows with the photograph inset and a large light number. The filter only narrows the list; the URL stays the same.
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { Picture } from "@/components/ui";
import type { Img } from "@/data/content";

export type NewsItem = { slug: string; href: string; n: string; date: string; dateLabel: string; tag: string; title: string; summary: string; card: Img; focus?: string };

const focusStyle = (focus?: string) => (focus ? ({ "--focus": focus } as CSSProperties) : undefined);

export default function NewsIndex({ items, allLabel, filterLabel, readLabel }: { items: NewsItem[]; allLabel: string; filterLabel: string; readLabel: string }) {
  const [tag, setTag] = useState<string | null>(null);
  const tags = [...new Set(items.map((i) => i.tag))];
  const shown = tag ? items.filter((i) => i.tag === tag) : items;
  const [lead, ...rest] = shown;
  return (
    <>
      <div className="news-filters" role="group" aria-label={filterLabel}>
        {[null, ...tags].map((x) => (
          <button key={x ?? "all"} type="button" className="news-filter tc" aria-pressed={tag === x} onClick={() => setTag(x)}>
            {x ?? allLabel}<sup>{x ? items.filter((i) => i.tag === x).length : items.length}</sup>
          </button>
        ))}
      </div>

      {lead && (
        <Link href={lead.href} className="news-lead">
          <div className="news-lead-image" style={focusStyle(lead.focus)}><Picture img={lead.card} fill fit="cover" animate={false} sizes="(min-width:768px) 46vw, 100vw" /></div>
          <div className="news-lead-text">
            <div className="news-top"><span className="news-num" aria-hidden="true">{lead.n}</span><span className="news-tag tc">{lead.tag}</span></div>
            <div>
              <time className="news-date tc" dateTime={lead.date}>{lead.dateLabel}</time>
              <h2 className="news-lead-title tc">{lead.title}</h2>
              <p className="news-summary tc">{lead.summary}</p>
              <span className="news-read tc">{readLabel}<span className="news-arrow" aria-hidden="true" /></span>
            </div>
          </div>
        </Link>
      )}

      {rest.length > 0 && (
        <ul className="news-rows">
          {rest.map((i) => (
            <li key={i.slug}>
              <Link href={i.href} className="news-row">
                <div className="news-row-media"><div className="news-row-image" style={focusStyle(i.focus)}><Picture img={i.card} fill fit="cover" animate={false} sizes="(min-width:768px) 38vw, 100vw" /></div></div>
                <div className="news-row-text">
                  <div className="news-top"><span className="news-num" aria-hidden="true">{i.n}</span><span className="news-tag tc">{i.tag}</span></div>
                  <div className="news-row-body">
                    <h2 className="news-row-title tc">{i.title}</h2>
                    <p className="news-summary tc">{i.summary}</p>
                  </div>
                  <div className="news-row-foot"><time className="news-date tc" dateTime={i.date}>{i.dateLabel}</time><span className="news-arrow news-arrow-long" aria-hidden="true" /></div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
