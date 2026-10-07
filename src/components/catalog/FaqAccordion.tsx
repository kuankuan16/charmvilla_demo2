// The FAQ as an accordion (user 2026-10-07, with a reference: 「常見問題參考附件版型修改成可以點開才回答的形式，不要一下就看這麼多字」):
// the title and a contact button at the left; at the right every question on its own row between hairlines with a round
// +/− button, the answer shown only once the row is opened; the questions sit inside closed group rows (after squarespace.com).
// Native <details>, so it works without JavaScript and is keyboard-accessible.
import type { PolicySection } from "@/data/commerce";

export default function FaqAccordion({ title, intro, sections, contact }: {
  title: string; intro?: string; sections: PolicySection[]; contact: { label: string; href: string };
}) {
  return (
    <article className="faq-page">
      <header className="faq-head">
        <h1 className="tc">{title}</h1>
        {intro && <p className="faq-intro tc">{intro}</p>}
        <a className="faq-contact tc" href={contact.href}>{contact.label}</a>
      </header>
      <div className="faq-body">
        {/* two levels (user 2026-10-07, after squarespace.com: 「先分大類別再個別展開小問題」): a closed row per group with a thin +,
            and inside it the group's questions, each its own row */}
        {sections.map((s) => (
          <details key={s.id} id={s.id} className="faq-group">
            <summary className="faq-group-summary"><h2 className="tc">{s.heading}</h2><span className="faq-plus" aria-hidden="true" /></summary>
            <div className="faq-group-body">
              {s.blocks.map((b, i) => typeof b !== "string" && "q" in b
                ? <details key={i} className="faq-item">
                    <summary className="tc"><span>{b.q}</span><span className="faq-toggle" aria-hidden="true" /></summary>
                    <p className="tc">{b.a}</p>
                  </details>
                : null)}
            </div>
          </details>
        ))}
      </div>
    </article>
  );
}
