"use client";
// Member area on top of Shopify classic customer accounts (Storefront API). Three states:
//   not configured → the forms are shown but every submit explains that Shopify is not connected yet
//   signed out     → 登入 / 註冊 / 忘記密碼
//   signed in      → 個人資料 / 地址簿 / 訂單 / 登出
import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { localeHref } from "@/i18n/config";
import type { Customer, Address } from "@/lib/shopify/types";
import { useT } from "@/i18n/LocaleProvider";
import { apiMessage } from "@/i18n/errors";

type Tab = "login" | "register" | "recover";
type Section = "profile" | "addresses" | "orders";
const money = (m: { amount: string; currencyCode: string }) => m.currencyCode === "TWD" ? `NT$ ${Number(m.amount).toLocaleString("en-US")}` : new Intl.NumberFormat("en-US", { style: "currency", currency: m.currencyCode }).format(Number(m.amount));
const statusZh: Record<string, string> = { PAID: "已付款", PENDING: "待付款", AUTHORIZED: "已授權", REFUNDED: "已退款", PARTIALLY_REFUNDED: "部分退款", VOIDED: "已取消", FULFILLED: "已出貨", UNFULFILLED: "備貨中", PARTIALLY_FULFILLED: "部分出貨" };
const statusEn: Record<string, string> = { PAID: "Paid", PENDING: "Payment pending", AUTHORIZED: "Authorized", REFUNDED: "Refunded", PARTIALLY_REFUNDED: "Partially refunded", VOIDED: "Canceled", FULFILLED: "Shipped", UNFULFILLED: "Being prepared", PARTIALLY_FULFILLED: "Partially shipped" };

async function api<T>(path: string, init?: RequestInit): Promise<{ ok: boolean; status: number; data: T & { message?: string; error?: string } }> {
  const res = await fetch(path, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  const data = (await res.json().catch(() => ({}))) as T & { message?: string; error?: string };
  return { ok: res.ok, status: res.status, data };
}

export default function AccountClient() {
  const { lang, t } = useT();
  const zh = lang === "zh";
  const NOT_CONNECTED = t("會員系統將於 Shopify 串接完成後啟用。", "The member area is not open yet.");
  const status = zh ? statusZh : statusEn;
  const required = t("（必填）", "(required)");
  // Chinese forms ask for the family name first; English forms for the given name first.
  const nameFields = (ids?: [string, string], values?: { lastName?: string | null; firstName?: string | null }) => {
    const last = <label key="last" className="tc">{t("姓", "Last name")}<input id={ids?.[0]} name="lastName" type="text" autoComplete="family-name" defaultValue={values ? values.lastName ?? "" : undefined} /></label>;
    const first = <label key="first" className="tc">{t("名", "First name")}<input id={ids?.[1]} name="firstName" type="text" autoComplete="given-name" defaultValue={values ? values.firstName ?? "" : undefined} /></label>;
    return <div className="account-row">{zh ? [last, first] : [first, last]}</div>;
  };
  const [loading, setLoading] = useState(true); const [configured, setConfigured] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [tab, setTab] = useState<Tab>("login"); const [section, setSection] = useState<Section>("profile");
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null); const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { ok, status, data } = await api<{ configured: boolean; customer: Customer | null }>("/api/account/me");
    setConfigured(data.configured !== false); setCustomer(ok ? data.customer : null); if (status === 503) setConfigured(false); setLoading(false);
  }, []);
  useEffect(() => { queueMicrotask(() => { void load(); }); }, [load]);

  const submit = async (e: FormEvent<HTMLFormElement>, path: string, method = "POST", onOk?: () => void) => {
    e.preventDefault(); setNotice(null);
    if (!configured) { setNotice({ kind: "error", text: NOT_CONNECTED }); return; }
    const form = new FormData(e.currentTarget); const payload: Record<string, unknown> = {};
    form.forEach((v, k) => { if (k === "remember" || k === "consent") return; payload[k] = k === "acceptsMarketing" || k === "makeDefault" ? v === "on" : String(v); });
    setBusy(true);
    const { ok, data } = await api<{ ok?: boolean }>(path, { method, body: JSON.stringify(payload) });
    setBusy(false);
    if (!ok) { setNotice({ kind: "error", text: data.error === "not_configured" ? NOT_CONNECTED : apiMessage(lang, data, t("操作失敗，請再試一次。", "That did not work. Please try again.")) }); return; }
    onOk?.();
  };

  if (loading) return <div className="account-shell"><p className="catalog-eyebrow">ACCOUNT</p><p className="tc">{t("載入中…", "Loading…")}</p></div>;

  if (!customer) return (
    <div className="account-shell account-shell--out">
      {!configured && <p className="account-banner tc">{NOT_CONNECTED}</p>}
      {notice && <p className={`account-notice account-notice--${notice.kind} tc`} role="status">{notice.text}</p>}
      <div className="account-split">
        <section className="account-col" aria-labelledby="account-title">
          {tab === "register" ? (
            <>
              <h1 id="account-title" className="tc account-title">{t("建立帳號", "Create account")}</h1>
              <p className="tc account-sub">{t("填寫基本資料，完成後自動登入。", "Fill in your details. You will be signed in automatically when done.")}</p>
              <form className="account-form" onSubmit={(e) => submit(e, "/api/account/register", "POST", load)}>
                {nameFields(["reg-last", "reg-first"])}
                <label className="tc">Email <span className="account-req">{required}</span><input id="reg-email" name="email" type="email" autoComplete="email" required /></label>
                <label className="tc">{t("手機", "Mobile")}<input id="reg-phone" name="phone" type="tel" autoComplete="tel" placeholder="+886…" /></label>
                <label className="tc">{t("密碼", "Password")} <span className="account-req">{t("（必填，至少 8 個字元）", "(required, at least 8 characters)")}</span><input id="reg-password" name="password" type="password" autoComplete="new-password" required minLength={8} /></label>
                <label className="account-check tc"><input id="reg-marketing" name="acceptsMarketing" type="checkbox" /> {t("願意收到新品與活動通知", "I would like to receive news of new pieces and events")}</label>
                {/* 2026-10-02: the privacy notice and the terms are shown and agreed to before any personal data is sent (個資法 §8). */}
                <label className="account-check tc"><input id="reg-consent" name="consent" type="checkbox" required /> <span>{t("我已閱讀並同意", "I have read and agree to the ")}<Link href={localeHref(lang, "/shopping-guide")} target="_blank">{t("購物須知與服務條款", "shopping guide and terms")}</Link>{t("及", " and the ")}<Link href={localeHref(lang, "/privacy")} target="_blank">{t("隱私權政策", "privacy policy")}</Link>{t("。", ".")}</span></label>
                <button type="submit" className="btn-pill tc" disabled={busy}>{t("建立帳號", "Create account")}</button>
                <p className="account-hint tc">{t("已有帳號？", "Already have an account? ")}<button type="button" onClick={() => { setTab("login"); setNotice(null); }}>{t("登入", "Sign in")}</button></p>
              </form>
            </>
          ) : tab === "recover" ? (
            <>
              <h1 id="account-title" className="tc account-title">{t("重設密碼", "Reset password")}</h1>
              <p className="tc account-sub">{t("輸入註冊時的 Email，我們會寄出重設密碼的連結。", "Enter the email you registered with and we will send a link to reset your password.")}</p>
              <form className="account-form" onSubmit={(e) => submit(e, "/api/account/recover", "POST", () => setNotice({ kind: "ok", text: t("已寄出重設密碼的信件，請查看信箱。", "A password reset email has been sent. Please check your inbox.") }))}>
                <label className="tc">Email <span className="account-req">{required}</span><input id="recover-email" name="email" type="email" autoComplete="email" required /></label>
                <button type="submit" className="btn-pill tc" disabled={busy}>{t("寄送重設連結", "Send reset link")}</button>
                <p className="account-hint tc"><button type="button" onClick={() => { setTab("login"); setNotice(null); }}>{t("回到登入", "Back to sign in")}</button></p>
              </form>
            </>
          ) : (
            <>
              <h1 id="account-title" className="tc account-title">{t("登入", "Sign in")}</h1>
              <p className="tc account-sub">{t("登入以管理您的帳號", "Sign in to manage your account")}</p>
              <form className="account-form" onSubmit={(e) => submit(e, "/api/account/login", "POST", load)}>
                <label className="tc">Email <span className="account-req">{required}</span><input id="login-email" name="email" type="email" autoComplete="email" required /></label>
                <label className="tc">{t("密碼", "Password")} <span className="account-req">{required}</span><input id="login-password" name="password" type="password" autoComplete="current-password" required minLength={8} /></label>
                <div className="account-row--between">
                  <label className="account-check tc"><input id="login-remember" name="remember" type="checkbox" /> {t("記住我", "Remember me")}</label>
                  <button type="button" className="account-link tc" onClick={() => { setTab("recover"); setNotice(null); }}>{t("忘記密碼？", "Forgot password?")}</button>
                </div>
                <button type="submit" className="btn-pill tc" disabled={busy}>{t("登入", "Sign in")}</button>
              </form>
            </>
          )}
        </section>
        <aside className="account-col account-col--new" aria-labelledby="new-title">
          <h2 id="new-title" className="tc account-title">{t("第一次來 CHARM VILLA？", "New to CHARM VILLA?")}</h2>
          <p className="tc account-sub">{t("建立帳號後，您可以：", "With an account you can:")}</p>
          <ul className="account-benefits tc">
            <li>{t("查看訂單狀態與購買紀錄。", "View order status and purchase history.")}</li>
            <li>{t("管理個人資料與收件地址。", "Manage your details and delivery addresses.")}</li>
            <li>{t("第一時間收到新品與活動通知。", "Be the first to hear about new pieces and events.")}</li>
          </ul>
          <button type="button" className="btn-pill btn-pill--outline tc" onClick={() => { setTab("register"); setNotice(null); }}>{t("建立帳號", "Create account")}</button>
        </aside>
      </div>
    </div>
  );

  const addresses: Address[] = customer.addresses.edges.map((e) => e.node);
  const orders = customer.orders.edges.map((e) => e.node);
  return (
    <div className="account-shell account-shell--in">
      <p className="catalog-eyebrow">ACCOUNT</p>
      <h1 className="tc account-title">{zh ? `${[customer.lastName, customer.firstName].filter(Boolean).join("") || customer.email}，您好` : `Hello, ${[customer.firstName, customer.lastName].filter(Boolean).join(" ") || customer.email}`}</h1>
      <div className="account-tabs" role="tablist">
        {([["profile", t("個人資料", "Profile")], ["addresses", t("地址簿", "Addresses")], ["orders", t("訂單", "Orders")]] as [Section, string][]).map(([id, label]) => <button key={id} role="tab" type="button" aria-selected={section === id} className="tc" onClick={() => { setSection(id); setNotice(null); }}>{label}</button>)}
        <button type="button" className="tc account-logout" onClick={async () => { await api("/api/account/logout", { method: "POST" }); setCustomer(null); setTab("login"); }}>{t("登出", "Sign out")}</button>
      </div>
      {notice && <p className={`account-notice account-notice--${notice.kind} tc`} role="status">{notice.text}</p>}
      {section === "profile" && <form className="account-form" onSubmit={(e) => submit(e, "/api/account/profile", "PATCH", () => { setNotice({ kind: "ok", text: t("已更新。", "Updated.") }); load(); })}>
        {nameFields(undefined, customer)}
        <label className="tc">Email<input name="email" type="email" defaultValue={customer.email ?? ""} /></label>
        <label className="tc">{t("手機", "Mobile")}<input name="phone" type="tel" defaultValue={customer.phone ?? ""} /></label>
        <label className="account-check tc"><input name="acceptsMarketing" type="checkbox" defaultChecked={customer.acceptsMarketing} /> {t("願意收到新品與活動通知", "I would like to receive news of new pieces and events")}</label>
        <button type="submit" className="catalog-button tc" disabled={busy}>{t("儲存", "Save")}</button>
      </form>}
      {section === "addresses" && <div className="account-addresses">
        {addresses.length === 0 && <p className="tc account-hint">{t("還沒有地址。", "No addresses yet.")}</p>}
        <ul>{addresses.map((a) => <li key={a.id} className={customer.defaultAddress?.id === a.id ? "is-default" : ""}>
          <p className="tc">{a.formatted.join(t("，", ", "))}</p>
          <div className="account-addr-tools">
            {customer.defaultAddress?.id !== a.id && <button type="button" className="tc" onClick={async () => { await api("/api/account/addresses", { method: "PATCH", body: JSON.stringify({ id: a.id, makeDefault: true }) }); load(); }}>{t("設為預設", "Set as default")}</button>}
            {customer.defaultAddress?.id === a.id && <span className="tc">{t("預設地址", "Default address")}</span>}
            <button type="button" className="tc" onClick={async () => { await api("/api/account/addresses", { method: "DELETE", body: JSON.stringify({ id: a.id }) }); load(); }}>{t("刪除", "Delete")}</button>
          </div>
        </li>)}</ul>
        <form className="account-form" onSubmit={(e) => submit(e, "/api/account/addresses", "POST", () => { setNotice({ kind: "ok", text: t("已新增地址。", "Address added.") }); load(); })}>
          <h2 className="tc account-subtitle">{t("新增地址", "Add an address")}</h2>
          {nameFields()}
          <label className="tc">{t("國家／地區", "Country/region")}<input name="country" placeholder="Taiwan / United States / Japan" required /></label>
          <div className="account-row"><label className="tc">{t("縣市／州", "State/province")}<input name="province" /></label><label className="tc">{t("郵遞區號", "Postal code")}<input name="zip" /></label></div>
          <label className="tc">{t("市區", "City")}<input name="city" /></label>
          <label className="tc">{t("地址", "Address")}<input name="address1" required /></label>
          <label className="tc">{t("地址（第二行）", "Address (line 2)")}<input name="address2" /></label>
          <label className="tc">{t("電話", "Phone")}<input name="phone" type="tel" /></label>
          <label className="account-check tc"><input name="makeDefault" type="checkbox" /> {t("設為預設地址", "Set as default address")}</label>
          <button type="submit" className="catalog-button tc" disabled={busy}>{t("新增", "Add")}</button>
        </form>
      </div>}
      {section === "orders" && <div className="account-orders">
        {orders.length === 0 && <p className="tc account-hint">{t("還沒有訂單。", "No orders yet.")}</p>}
        <ul>{orders.map((o) => <li key={o.id}>
          <div className="account-order-head"><strong>#{o.orderNumber}</strong><span>{zh ? new Date(o.processedAt).toLocaleDateString("zh-TW") : new Date(o.processedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span><span className="tc">{status[o.financialStatus ?? ""] ?? o.financialStatus} · {status[o.fulfillmentStatus] ?? o.fulfillmentStatus}</span><strong>{money(o.totalPrice)}</strong></div>
          <ul className="account-order-lines">{o.lineItems.edges.map(({ node }, i) => <li key={i}>{node.variant?.image && <img src={node.variant.image.url} alt="" />}<span className="tc">{node.title} × {node.quantity}</span></li>)}</ul>
          <a href={o.statusUrl} target="_blank" rel="noreferrer" className="tc account-order-link">{t("查看訂單狀態", "View order status")}</a>
        </li>)}</ul>
      </div>}
    </div>
  );
}
