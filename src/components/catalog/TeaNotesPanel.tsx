"use client";
// The deep-coffee panel beside the film in 茶款介紹 (user 2026-10-08, after a two-card layout: 「右邊的色塊改為深咖啡色，跟著滑鼠移動會一直
// 長出資訊卡（像目前這樣）」): moving the pointer across it grows one tea's card after another where the pointer is — every ~110px of
// travel brings the next tea, and the cards stay, piling up like the sticky stack did. On touch a tap grows the next card. A faint
// goldfish sits in the corner like the reference's icon; a short hint fades once the first card is out. The full list is also in the
// DOM for screen readers, since the cards only exist once grown.
import { useRef, useState, type PointerEvent } from "react";
import { GOLDFISH_D } from "./goldfish-path";

type Item = { name: string; text: string };
type Card = { i: number; x: number; y: number };
const STEP = 110, W = 300, H = 200, PAD = 12;

const split = (name: string) => { const m = name.match(/^(.*?)\s*[（(]([^（）()]+)[）)]\s*(.*)$/); return m ? { main: `${m[1]}${m[3] ? ` ${m[3]}` : ""}`, small: m[2] } : { main: name, small: "" }; };

export default function TeaNotesPanel({ items, hintMouse, hintTouch, label }: { items: Item[]; hintMouse: string; hintTouch: string; label: string }) {
  const panel = useRef<HTMLDivElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const grow = (clientX: number, clientY: number) => {
    const el = panel.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const w = Math.min(W, r.width * 0.78), h = Math.min(H, r.height * 0.8);
    const x = Math.min(Math.max(clientX - r.left - 40, PAD), r.width - w - PAD);
    const y = Math.min(Math.max(clientY - r.top - 30, PAD), r.height - h - PAD);
    setCards((c) => (c.length >= items.length ? c : [...c, { i: c.length, x, y }]));
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const p = last.current;
    if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) < STEP) return;
    last.current = { x: e.clientX, y: e.clientY };
    grow(e.clientX, e.clientY);
  };
  const onDown = (e: PointerEvent<HTMLDivElement>) => { if (e.pointerType === "touch") grow(e.clientX, e.clientY); };
  return (
    <div ref={panel} className={`tea-notes-panel${cards.length ? " is-started" : ""}`} onPointerMove={onMove} onPointerDown={onDown} aria-label={label}>
      <p className="tea-notes-hint tc" aria-hidden="true"><span className="tea-notes-hint-mouse">{hintMouse}</span><span className="tea-notes-hint-touch">{hintTouch}</span></p>
      <svg className="tea-notes-mark" viewBox="-20 -20 1224 1028" aria-hidden="true"><path d={GOLDFISH_D} fill="none" stroke="currentColor" strokeWidth="26" strokeLinejoin="round" /></svg>
      {cards.map((c) => { const n = split(items[c.i].name); return (
        <div key={c.i} className="tea-notes-card" style={{ left: c.x, top: c.y, zIndex: c.i + 1 }} aria-hidden="true">
          <h3 className="tc">{n.main}{n.small && <small>{n.small}</small>}</h3>
          <p className="tc">{items[c.i].text}</p>
        </div>); })}
      <ul className="sr-only">{items.map((n) => <li key={n.name}>{n.name}：{n.text}</li>)}</ul>
    </div>
  );
}
