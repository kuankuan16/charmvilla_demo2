"use client";
// Newsletter pop-up (user's reference 2026-10-13: picture left, white panel right with title, text, underlined email field with
// an envelope, black SUBSCRIBE button, a contact line, X at the top right, over a dark veil). It opens by itself once per visitor:
// 8 s after arrival or past half the page, whichever comes first; closing or submitting remembers that in localStorage. Never on
// /account. Submitting goes through the footer form's useNewsletterSubmit, so it only says the newsletter is not open yet.
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useT } from "@/i18n/LocaleProvider";
import { getCommerce } from "@/data/commerce";
import { getScroller } from "@/lib/motion/scroller";
import { useNewsletterSubmit } from "./NewsletterForm";

const SEEN_KEY = "cv-newsletter-popup-seen";
const DELAY_MS = 8000;
const isAccountPath = (path: string) => /(^|\/)account(\/|$)/.test(path);
const readSeen = () => { try { return window.localStorage.getItem(SEEN_KEY) === "1"; } catch { return false; } };
const writeSeen = () => { try { window.localStorage.setItem(SEEN_KEY, "1"); } catch { /* storage blocked: it simply may show again */ } };
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function NewsletterPopup() {
  const { lang, t } = useT();
  const pathname = usePathname();
  const pathRef = useRef(pathname);
  useEffect(() => { pathRef.current = pathname; }, [pathname]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const { note, submit } = useNewsletterSubmit();
  const email = getCommerce(lang).email;

  // Trigger: first of the timer or the half-page scroll. It waits (retrying) while the preloader, cart or menu is up, or on /account.
  useEffect(() => {
    if (readSeen()) return;
    let done = false;
    let retry: number | undefined;
    const tryOpen = () => {
      if (done) return;
      const html = document.documentElement;
      if (isAccountPath(pathRef.current) || html.classList.contains("is-loading") || html.classList.contains("cart--open") || document.querySelector(".menu--opened")) {
        window.clearTimeout(retry);
        retry = window.setTimeout(tryOpen, 3000);
        return;
      }
      done = true;
      cleanup();
      if (readSeen()) return;
      returnFocus.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    // The homepage scrolls inside [data-page-scroller]; inner pages scroll the window. Capture catches both.
    const onScroll = (e: Event) => {
      const el = e.target instanceof HTMLElement ? e.target : document.scrollingElement;
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      if (max > 0 && el.scrollTop / max > 0.5) tryOpen();
    };
    const timer = window.setTimeout(tryOpen, DELAY_MS);
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    function cleanup() {
      window.clearTimeout(timer);
      document.removeEventListener("scroll", onScroll, { capture: true });
    }
    return () => { done = true; cleanup(); window.clearTimeout(retry); };
  }, []);

  const close = useCallback(() => { writeSeen(); setOpen(false); }, []);

  // While open: background scroll locked (Lenis stopped like the menu does, plus overflow on html/body/the scroller),
  // focus moved into the dialog and trapped there, Esc closes; on close, focus goes back where it was.
  useEffect(() => {
    if (!open) return;
    const s = getScroller();
    const html = document.documentElement;
    html.classList.add("news-pop--open");
    s?.stop();
    panelRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key !== "Tab" || !panelRef.current) return;
      const f = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panelRef.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (active === last || !panelRef.current.contains(active))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      html.classList.remove("news-pop--open");
      if (html.classList.contains("is-loaded")) s?.start();
      returnFocus.current?.focus?.({ preventScroll: true });
    };
  }, [open, close]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => { submit(e); writeSeen(); };

  if (!open) return null;
  return (
    <div className="news-pop">
      <div className="news-pop-veil" onClick={close} aria-hidden="true" />
      <div ref={panelRef} className="news-pop-panel" role="dialog" aria-modal="true" aria-labelledby="news-pop-title" tabIndex={-1}>
        <div className="news-pop-media">
          <Image src="/media/site/about-scene-04-everyday-pieces-v2.webp" alt="" fill sizes="500px" className="object-cover" /* the everyday-pieces side table, as in the menu (user 2026-10-13: 「用這張當電子報圖」) */ />
        </div>
        <div className="news-pop-body">
          <button type="button" className="news-pop-close" onClick={close} aria-label={t("關閉電子報視窗", "Close newsletter")}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
          </button>
          <h2 id="news-pop-title" className="news-pop-title tc">{t("訂閱電子報", "News from CHARM VILLA")}</h2>
          <p className="news-pop-text tc">{t("新品、限定禮盒與活動消息，第一時間寄給你。", "Be the first to discover new pieces, limited-edition gift boxes and upcoming events.")}</p>
          <form className="news-pop-form" onSubmit={onSubmit}>
            <label className="news-pop-field">
              <span className="sr-only">Email</span>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none" /><path d="M3.5 6.5l8.5 6.5 8.5-6.5" stroke="currentColor" strokeWidth="1.4" fill="none" /></svg>
              <input type="email" name="email" placeholder="Email" autoComplete="email" required />
            </label>
            <button type="submit" className="news-pop-submit tc">{t("訂閱", "Subscribe")}</button>
            {note && <p className="news-pop-status tc" role="status">{note}</p>}
          </form>
          <p className="news-pop-note tc">{t("有任何問題，歡迎來信", "Questions? Email us at")} <a href={`mailto:${email}`}>{email}</a></p>
        </div>
      </div>
    </div>
  );
}
