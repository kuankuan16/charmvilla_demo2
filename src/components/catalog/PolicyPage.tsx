// Shopping guide and privacy policy pages (2026-10-02): a title, the date the facts were read, a list of the sections,
// then the sections. A block the brand has not published yet is shown as such ({ pending }) instead of being invented.
import type { PolicySection } from "@/data/commerce";

export default function PolicyPage({ title, intro, updated, sections, labels }: {
  title: string; intro?: string; updated: string; sections: PolicySection[];
  labels: { contents: string; pending: string; source: string };
}) {
  return (
    <article className="policy-page">
      <header className="policy-head">
        <h1 className="tc">{title}</h1>
        {intro && <p className="policy-intro tc">{intro}</p>}
        <p className="policy-updated tc">{updated}</p>
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
                : <p key={i} className="policy-pending tc"><span>{labels.pending}</span>{b.pending}</p>)}
            {s.source && <p className="policy-source tc">{labels.source}{s.source}</p>}
          </section>
        ))}
      </div>
    </article>
  );
}
