"use client";
// Landing pages for the two links Shopify emails to customers (classic customer accounts, Storefront API):
//   reset    → customerResetByUrl     (from 「忘記密碼」 on /account)
//   activate → customerActivateByUrl  (an account the shop created or invited)
// The link reaches this page either whole as ?url=<the Shopify link> or with its path kept on this site
// (/account/reset/<id>/<token>); see docs/shopify-integration.md. Until Shopify is connected the form explains that accounts are not open yet.
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { localeHref } from "@/i18n/config";
import { useT } from "@/i18n/LocaleProvider";
import { apiMessage } from "@/i18n/errors";
import { api, cartIdInBrowser } from "./account-api";

type Kind = "reset" | "activate";

export default function AccountLinkForm({ kind, segments, linkUrl }: { kind: Kind; segments: string[]; linkUrl?: string }) {
  const { lang, t } = useT();
  const NOT_CONNECTED = t("會員系統將於 Shopify 串接完成後啟用。", "Customer accounts are not available yet.");
  const [configured, setConfigured] = useState(true);
  const [busy, setBusy] = useState(false); const [done, setDone] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  useEffect(() => { queueMicrotask(async () => { const { status, data } = await api<{ configured?: boolean }>("/api/account/me"); if (data.configured === false || status === 503) setConfigured(false); }); }, []);

  // The Shopify link: given whole, or rebuilt from the path kept on this site (Shopify reads the id and token from the path).
  const linkFor = () => linkUrl ?? (segments.length === 2 ? `https://${window.location.host}/account/${kind}/${segments.map(encodeURIComponent).join("/")}` : null);
  const hasLink = Boolean(linkUrl) || segments.length === 2;

  const copy = kind === "reset"
    ? { title: t("設定新密碼", "Set a new password"), sub: t("請輸入新的密碼，完成後會自動登入。", "Enter a new password. You will be signed in when done."), button: t("儲存新密碼", "Save new password"), ok: t("密碼已更新，您已登入。", "Your password has been updated and you are signed in."), invalid: t("重設連結無效或已過期，請回到會員頁重新申請。", "This reset link is invalid or has expired. Please request a new one from the account page.") }
    : { title: t("啟用帳號", "Activate your account"), sub: t("請設定登入密碼，完成後會自動登入。", "Choose a password to sign in with. You will be signed in when done."), button: t("啟用帳號", "Activate account"), ok: t("帳號已啟用，您已登入。", "Your account is active and you are signed in."), invalid: t("啟用連結無效或已過期，請來信與我們聯絡。", "This activation link is invalid or has expired. Please contact us for a new one.") };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setNotice(null);
    if (!configured) { setNotice({ kind: "error", text: NOT_CONNECTED }); return; }
    const link = linkFor();
    if (!link) { setNotice({ kind: "error", text: copy.invalid }); return; }
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? ""), confirm = String(form.get("confirm") ?? "");
    if (password !== confirm) { setNotice({ kind: "error", text: t("兩次輸入的密碼不一致。", "The two passwords do not match.") }); return; }
    setBusy(true);
    const { ok, data } = await api<{ ok?: boolean }>(`/api/account/${kind}`, { method: "POST", body: JSON.stringify({ url: link, password, cartId: cartIdInBrowser() ?? undefined }) });
    setBusy(false);
    if (!ok) { setNotice({ kind: "error", text: data.error === "not_configured" ? NOT_CONNECTED : apiMessage(lang, data, t("操作失敗，請再試一次。", "That did not work. Please try again.")) }); return; }
    setDone(true); setNotice({ kind: "ok", text: copy.ok });
  };

  return (
    <div className="account-shell">
      {!configured && <p className="account-banner tc">{NOT_CONNECTED}</p>}
      {notice && <p className={`account-notice account-notice--${notice.kind} tc`} role={notice.kind === "error" ? "alert" : "status"}>{notice.text}</p>}
      <section aria-labelledby="account-link-title">
        <h1 id="account-link-title" className="tc account-title">{copy.title}</h1>
        {done ? (
          <p><Link href={localeHref(lang, "/account")} className="btn-pill tc">{t("前往我的帳號", "Go to my account")}</Link></p>
        ) : !hasLink ? (
          <>
            <p className="tc account-sub">{copy.invalid}</p>
            <p><Link href={localeHref(lang, "/account")} className="account-link tc">{t("回到會員頁", "Back to the account page")}</Link></p>
          </>
        ) : (
          <>
            <p className="tc account-sub">{copy.sub}</p>
            <form className="account-form" onSubmit={submit}>
              <label className="tc">{t("新密碼", "New password")} <span className="account-req">{t("（必填，至少 8 個字元）", "(required, at least 8 characters)")}</span><input id={`${kind}-password`} name="password" type="password" autoComplete="new-password" required minLength={8} /></label>
              <label className="tc">{t("再輸入一次", "Confirm password")} <span className="account-req">{t("（必填）", "(required)")}</span><input id={`${kind}-confirm`} name="confirm" type="password" autoComplete="new-password" required minLength={8} /></label>
              <button type="submit" className="btn-pill tc" disabled={busy}>{busy ? t("處理中…", "Working…") : copy.button}</button>
              <p><Link href={localeHref(lang, "/account")} className="account-link tc">{t("回到會員頁", "Back to the account page")}</Link></p>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
