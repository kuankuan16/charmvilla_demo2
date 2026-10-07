// FAQ and policy pages (2026-10-02; the US store's documents 2026-10-07): a title, an intro, the document's update date where it has
// one, a list of the sections, then the sections. A block is a paragraph, a bulleted list, a question with its answer, or a fact
// the brand has not published yet ({ pending }), shown as such instead of being invented.
import type { PolicySection } from "@/data/commerce";

export default function PolicyPage({ title, intro, updated, sections, labels }: {
  title: string; intro?: string; updated?: string; sections: PolicySection[];
  labels: { contents: string; pending: string; source: string };
}) {
  return (
    <article className="policy-page">
      <header className="policy-head">
        <h1 className="tc">{title}</h1>
        {intro && <p className="policy-intro tc">{intro}</p>}
        {updated && <p className="policy-updated tc">{updated}</p>}
      </header>
      <nav className="policy-toc" aria-label={labels.contents}>
        <ol>{sections.map((s) => <li key={s.id}><a href={`#${s.id}`} className="tc">{s.heading}</a></li>)}</ol>
      </nav>
      <div className="policy-body">
        {sections.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-heading`}>
            <h2 id={`${s.id}-heading`} className="tc">{s.heading}</h2>
            {s.blocks.map((b, i) => typeof b === "string"
              ? <p key={i} className="tc">{b}</p>
              : "list" in b
                ? <ul key={i}>{b.list.map((item) => <li key={item} className="tc">{item}</li>)}</ul>
                : "q" in b
                  ? <div key={i} className="policy-qa"><h3 className="tc">{b.q}</h3><p className="tc">{b.a}</p></div>
                  : <p key={i} className="policy-pending tc"><span>{labels.pending}</span>{b.pending}</p>)}
            {/* `s.source` is the editors' reference (commerce.ts) and is not shown to customers (copy decision 2026-10-06) */}
          </section>
        ))}
      </div>
    </article>
  );
}
