// The FAQ as an accordion (user 2026-10-07, with a reference: 「常見問題參考附件版型修改成可以點開才回答的形式，不要一下就看這麼多字」):
// the title and a contact button at the left; at the right every question on its own row between hairlines with a round
// +/− button, the answer shown only once the row is opened. Native <details>, so it works without JavaScript and is keyboard-accessible.
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
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="faq-group" aria-labelledby={`${s.id}-heading`}>
            <h2 id={`${s.id}-heading`} className="tc">{s.heading}</h2>
            {s.blocks.map((b, i) => typeof b !== "string" && "q" in b
              ? <details key={i} className="faq-item">
                  <summary className="tc"><span>{b.q}</span><span className="faq-toggle" aria-hidden="true" /></summary>
                  <p className="tc">{b.a}</p>
                </details>
              : null)}
          </section>
        ))}
      </div>
    </article>
  );
}
