// The FAQ and the policy pages as a two-level accordion (user 2026-10-07: 「常見問題參考附件版型修改成可以點開才回答的形式，不要一下就看
// 這麼多字」, then after squarespace.com 「先分大類別再個別展開小問題」, then 「其他很多資訊的頁面也都用相同的邏輯設計」): the title, the
// intro, the document's date and a contact button at the left; at the right one closed row per section with a thin +, and inside it
// the section's content — paragraphs and lists as they are, each question its own row with a round +/− button, the answer shown
// only once opened. Native <details>, so it works without JavaScript and is keyboard-accessible. A document with a single
// section (Prop 65) opens it at once.
import type { PolicySection } from "@/data/commerce";

export default function FaqAccordion({ title, intro, updated, sections, contact, labels }: {
  title: string; intro?: string; updated?: string; sections: PolicySection[]; contact: { label: string; href: string };
  labels?: { pending: string };
}) {
  return (
    <article className="faq-page">
      <header className="faq-head">
        <h1 className="tc">{title}</h1>
        {intro && <p className="faq-intro tc">{intro}</p>}
        {updated && <p className="faq-updated tc">{updated}</p>}
        <a className="faq-contact tc" href={contact.href}>{contact.label}</a>
      </header>
      <div className="faq-body">
        {sections.map((s) => (
          <details key={s.id} id={s.id} className="faq-group" open={sections.length === 1 || undefined}>
            <summary className="faq-group-summary"><h2 className="tc">{s.heading}</h2><span className="faq-plus" aria-hidden="true" /></summary>
            <div className="faq-group-body">
              {s.blocks.map((b, i) => typeof b === "string"
                ? <p key={i} className="faq-text tc">{b}</p>
                : "list" in b
                  ? <ul key={i} className="faq-list">{b.list.map((item) => <li key={item} className="tc">{item}</li>)}</ul>
                  : "q" in b
                    ? <details key={i} className="faq-item">
                        <summary className="tc"><span>{b.q}</span><span className="faq-toggle" aria-hidden="true" /></summary>
                        <p className="tc">{b.a}</p>
                      </details>
                    : <p key={i} className="faq-text faq-pending tc">{labels && <span>{labels.pending}</span>}{b.pending}</p>)}
              {/* `s.source` is the editors' reference (commerce.ts) and is not shown to customers (copy decision 2026-10-06) */}
            </div>
          </details>
        ))}
      </div>
    </article>
  );
}
