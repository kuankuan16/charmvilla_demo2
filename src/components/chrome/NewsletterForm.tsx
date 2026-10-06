"use client";
// Footer newsletter sign-up (after the reference's "Stay in the loop"). Nothing is collected until the brand's mailing list
// is connected (Shopify customer marketing): the form says so instead of pretending to subscribe.
import { useState, type FormEvent } from "react";
import { useT } from "@/i18n/LocaleProvider";

export default function NewsletterForm() {
  const { t } = useT();
  const [note, setNote] = useState<string | null>(null);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNote(t("電子報將於 Shopify 串接完成後開放訂閱。", "The newsletter is not open yet."));
  };
  return (
    <form className="footer-news-form" onSubmit={submit}>
      <label className="sr-only" htmlFor="footer-email">Email</label>
      <input id="footer-email" type="email" name="email" placeholder="Email" autoComplete="email" required />
      <button type="submit" className="tc">{t("訂閱", "Subscribe")}</button>
      {note && <p className="footer-news-status tc" role="status">{note}</p>}
    </form>
  );
}
