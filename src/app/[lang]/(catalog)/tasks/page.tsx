// Internal to-do list preview (user 2026-10-14: 「給我建立專案維護 TASKS.md（待辦清單），完成就打勾。並在官網下給我一個預覽清單頁面」).
// TASKS.md at the repo root is read at build time, so pushing a changed file to main updates this page. Only the syntax the file
// uses is parsed: `#` title, plain intro lines, `##` sections, `- [ ]` / `- [x]` items, inline `code` and plain URLs.
// The list is internal: same Chinese content in both languages, noindex, not linked from the nav, footer or sitemap.
import { readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";

type Props = { params: Promise<{ lang: string }> };
type Item = { text: string; done: boolean };
type Section = { heading: string; items: Item[] };

export const metadata: Metadata = { title: "待辦清單｜CHARM VILLA", robots: { index: false, follow: false } };

function parseTasks() {
  let source = "";
  try { source = readFileSync(path.join(process.cwd(), "TASKS.md"), "utf8"); } catch { source = ""; }
  let title = "待辦清單";
  const intro: string[] = [];
  const sections: Section[] = [];
  for (const raw of source.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const item = line.match(/^[-*]\s+\[( |x|X)\]\s+(.*)$/);
    if (line.startsWith("## ")) sections.push({ heading: line.slice(3).trim(), items: [] });
    else if (line.startsWith("# ")) title = line.slice(2).trim();
    else if (item) {
      if (!sections.length) sections.push({ heading: "待辦", items: [] });
      sections[sections.length - 1].items.push({ done: item[1] !== " ", text: item[2] });
    } else if (!sections.length) intro.push(line);
  }
  return { title, intro, sections, found: source !== "" };
}

// inline `code` and plain http(s) URLs; everything else stays text
function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|https?:\/\/[^\s）)，。、]+)/g);
  return <>{parts.map((p, i) => p.startsWith("`") && p.endsWith("`") && p.length > 1
    ? <code key={i} className="tasks-code">{p.slice(1, -1)}</code>
    : /^https?:\/\//.test(p)
      ? <a key={i} className="tasks-link" href={p}>{p}</a>
      : p)}</>;
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { title, intro, sections, found } = parseTasks();
  const all = sections.flatMap((s) => s.items);
  const done = all.filter((i) => i.done).length;
  const pct = all.length ? Math.round((done / all.length) * 100) : 0;
  return (
    <article className="tasks-page" lang="zh-Hant">
      <header className="tasks-head">
        <h1 className="tc">{title}</h1>
        {intro.map((p, i) => <p key={i} className="tasks-intro tc"><Inline text={p} /></p>)}
        <div className="tasks-progress">
          <p className="tasks-progress-label tc">完成 {done} / 共 {all.length} 項（{pct}%）</p>
          <div className="tasks-bar" role="progressbar" aria-label="整體進度" aria-valuemin={0} aria-valuemax={all.length} aria-valuenow={done}>
            <span style={{ width: `${pct}%` }} />
          </div>
        </div>
        {!found && <p className="tasks-note tc">找不到 TASKS.md。</p>}
      </header>
      <div className="tasks-body">
        {sections.map((s, si) => {
          const n = s.items.filter((i) => i.done).length;
          return (
            <section key={si} className="tasks-section" aria-labelledby={`tasks-s${si}`}>
              <div className="tasks-section-head">
                <h2 id={`tasks-s${si}`} className="tc">{s.heading}</h2>
                <p className="tasks-count tc">完成 {n} / 共 {s.items.length}</p>
              </div>
              <ul className="tasks-list">
                {s.items.map((item, ii) => (
                  <li key={ii} className={`tasks-item tc${item.done ? " is-done" : ""}`}>
                    <span className="tasks-box" role="checkbox" aria-checked={item.done} aria-disabled="true" aria-label={item.done ? "已完成" : "未完成"}>
                      {item.done && <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </span>
                    <span className="tasks-text"><Inline text={item.text} /></span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </article>
  );
}
