"use client";
// Member area on top of Shopify classic customer accounts (Storefront API). Three states:
//   not configured → the forms are shown but every submit explains that Shopify is not connected yet
//   signed out     → 登入 / 註冊 / 忘記密碼
//   signed in      → 個人資料 / 地址簿 / 訂單 / 登出
import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Customer, Address } from "@/lib/shopify/types";

type Tab = "login" | "register" | "recover";
type Section = "profile" | "addresses" | "orders";
const NOT_CONNECTED = "會員系統將於 Shopify 串接完成後啟用。";
const money = (m: { amount: string; currencyCode: string }) => m.currencyCode === "TWD" ? `NT$ ${Number(m.amount).toLocaleString("en-US")}` : new Intl.NumberFormat("en-US", { style: "currency", currency: m.currencyCode }).format(Number(m.amount));
const statusZh: Record<string, string> = { PAID: "已付款", PENDING: "待付款", AUTHORIZED: "已授權", REFUNDED: "已退款", PARTIALLY_REFUNDED: "部分退款", VOIDED: "已取消", FULFILLED: "已出貨", UNFULFILLED: "備貨中", PARTIALLY_FULFILLED: "部分出貨" };

async function api<T>(path: string, init?: RequestInit): Promise<{ ok: boolean; status: number; data: T & { message?: string; error?: string } }> {
  const res = await fetch(path, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  const data = (await res.json().catch(() => ({}))) as T & { message?: string; error?: string };
  return { ok: res.ok, status: res.status, data };
}

export default function AccountClient() {
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
    form.forEach((v, k) => { if (k === "remember") return; payload[k] = k === "acceptsMarketing" || k === "makeDefault" ? v === "on" : String(v); });
    setBusy(true);
    const { ok, data } = await api<{ ok?: boolean }>(path, { method, body: JSON.stringify(payload) });
    setBusy(false);
    if (!ok) { setNotice({ kind: "error", text: data.error === "not_configured" ? NOT_CONNECTED : data.message || "操作失敗，請再試一次。" }); return; }
    onOk?.();
  };

  if (loading) return <div className="account-shell"><p className="catalog-eyebrow">ACCOUNT</p><p className="tc">載入中…</p></div>;

  if (!customer) return (
    <div className="account-shell account-shell--out">
      {!configured && <p className="account-banner tc">{NOT_CONNECTED}</p>}
      {notice && <p className={`account-notice account-notice--${notice.kind} tc`} role="status">{notice.text}</p>}
      <div className="account-split">
        <section className="account-col" aria-labelledby="account-title">
          {tab === "register" ? (
            <>
              <h1 id="account-title" className="tc account-title">建立帳號</h1>
              <p className="tc account-sub">填寫基本資料，完成後自動登入。</p>
              <form className="account-form" onSubmit={(e) => submit(e, "/api/account/register", "POST", load)}>
                <div className="account-row"><label className="tc">姓<input id="reg-last" name="lastName" type="text" autoComplete="family-name" /></label><label className="tc">名<input id="reg-first" name="firstName" type="text" autoComplete="given-name" /></label></div>
                <label className="tc">Email <span className="account-req">（必填）</span><input id="reg-email" name="email" type="email" autoComplete="email" required /></label>
                <label className="tc">手機<input id="reg-phone" name="phone" type="tel" autoComplete="tel" placeholder="+886…" /></label>
                <label className="tc">密碼 <span className="account-req">（必填，至少 8 個字元）</span><input id="reg-password" name="password" type="password" autoComplete="new-password" required minLength={8} /></label>
                <label className="account-check tc"><input id="reg-marketing" name="acceptsMarketing" type="checkbox" /> 願意收到新品與活動通知</label>
                <button type="submit" className="btn-pill tc" disabled={busy}>建立帳號</button>
                <p className="account-hint tc">已有帳號？<button type="button" onClick={() => { setTab("login"); setNotice(null); }}>登入</button></p>
              </form>
            </>
          ) : tab === "recover" ? (
            <>
              <h1 id="account-title" className="tc account-title">重設密碼</h1>
              <p className="tc account-sub">輸入註冊時的 Email，我們會寄出重設密碼的連結。</p>
              <form className="account-form" onSubmit={(e) => submit(e, "/api/account/recover", "POST", () => setNotice({ kind: "ok", text: "已寄出重設密碼的信件，請查看信箱。" }))}>
                <label className="tc">Email <span className="account-req">（必填）</span><input id="recover-email" name="email" type="email" autoComplete="email" required /></label>
                <button type="submit" className="btn-pill tc" disabled={busy}>寄送重設連結</button>
                <p className="account-hint tc"><button type="button" onClick={() => { setTab("login"); setNotice(null); }}>回到登入</button></p>
              </form>
            </>
          ) : (
            <>
              <h1 id="account-title" className="tc account-title">登入</h1>
              <p className="tc account-sub">登入以管理您的帳號</p>
              <form className="account-form" onSubmit={(e) => submit(e, "/api/account/login", "POST", load)}>
                <label className="tc">Email <span className="account-req">（必填）</span><input id="login-email" name="email" type="email" autoComplete="email" required /></label>
                <label className="tc">密碼 <span className="account-req">（必填）</span><input id="login-password" name="password" type="password" autoComplete="current-password" required minLength={8} /></label>
                <div className="account-row--between">
                  <label className="account-check tc"><input id="login-remember" name="remember" type="checkbox" /> 記住我</label>
                  <button type="button" className="account-link tc" onClick={() => { setTab("recover"); setNotice(null); }}>忘記密碼？</button>
                </div>
                <button type="submit" className="btn-pill tc" disabled={busy}>登入</button>
              </form>
            </>
          )}
        </section>
        <aside className="account-col account-col--new" aria-labelledby="new-title">
          <h2 id="new-title" className="tc account-title">第一次來 CHARM VILLA？</h2>
          <p className="tc account-sub">建立帳號後，您可以：</p>
          <ul className="account-benefits tc">
            <li>查看訂單狀態與購買紀錄。</li>
            <li>管理個人資料與收件地址。</li>
            <li>第一時間收到新品與活動通知。</li>
          </ul>
          <button type="button" className="btn-pill btn-pill--outline tc" onClick={() => { setTab("register"); setNotice(null); }}>建立帳號</button>
        </aside>
      </div>
    </div>
  );

  const addresses: Address[] = customer.addresses.edges.map((e) => e.node);
  const orders = customer.orders.edges.map((e) => e.node);
  return (
    <div className="account-shell account-shell--in">
      <p className="catalog-eyebrow">ACCOUNT</p>
      <h1 className="tc account-title">{[customer.lastName, customer.firstName].filter(Boolean).join("") || customer.email}，您好</h1>
      <div className="account-tabs" role="tablist">
        {([["profile", "個人資料"], ["addresses", "地址簿"], ["orders", "訂單"]] as [Section, string][]).map(([id, label]) => <button key={id} role="tab" type="button" aria-selected={section === id} className="tc" onClick={() => { setSection(id); setNotice(null); }}>{label}</button>)}
        <button type="button" className="tc account-logout" onClick={async () => { await api("/api/account/logout", { method: "POST" }); setCustomer(null); setTab("login"); }}>登出</button>
      </div>
      {notice && <p className={`account-notice account-notice--${notice.kind} tc`} role="status">{notice.text}</p>}
      {section === "profile" && <form className="account-form" onSubmit={(e) => submit(e, "/api/account/profile", "PATCH", () => { setNotice({ kind: "ok", text: "已更新。" }); load(); })}>
        <div className="account-row"><label className="tc">姓<input name="lastName" defaultValue={customer.lastName ?? ""} /></label><label className="tc">名<input name="firstName" defaultValue={customer.firstName ?? ""} /></label></div>
        <label className="tc">Email<input name="email" type="email" defaultValue={customer.email ?? ""} /></label>
        <label className="tc">手機<input name="phone" type="tel" defaultValue={customer.phone ?? ""} /></label>
        <label className="account-check tc"><input name="acceptsMarketing" type="checkbox" defaultChecked={customer.acceptsMarketing} /> 願意收到新品與活動通知</label>
        <button type="submit" className="catalog-button tc" disabled={busy}>儲存</button>
      </form>}
      {section === "addresses" && <div className="account-addresses">
        {addresses.length === 0 && <p className="tc account-hint">還沒有地址。</p>}
        <ul>{addresses.map((a) => <li key={a.id} className={customer.defaultAddress?.id === a.id ? "is-default" : ""}>
          <p className="tc">{a.formatted.join("，")}</p>
          <div className="account-addr-tools">
            {customer.defaultAddress?.id !== a.id && <button type="button" className="tc" onClick={async () => { await api("/api/account/addresses", { method: "PATCH", body: JSON.stringify({ id: a.id, makeDefault: true }) }); load(); }}>設為預設</button>}
            {customer.defaultAddress?.id === a.id && <span className="tc">預設地址</span>}
            <button type="button" className="tc" onClick={async () => { await api("/api/account/addresses", { method: "DELETE", body: JSON.stringify({ id: a.id }) }); load(); }}>刪除</button>
          </div>
        </li>)}</ul>
        <form className="account-form" onSubmit={(e) => submit(e, "/api/account/addresses", "POST", () => { setNotice({ kind: "ok", text: "已新增地址。" }); load(); })}>
          <h2 className="tc account-subtitle">新增地址</h2>
          <div className="account-row"><label className="tc">姓<input name="lastName" /></label><label className="tc">名<input name="firstName" /></label></div>
          <label className="tc">國家／地區<input name="country" placeholder="Taiwan / United States / Japan" required /></label>
          <div className="account-row"><label className="tc">縣市／州<input name="province" /></label><label className="tc">郵遞區號<input name="zip" /></label></div>
          <label className="tc">市區<input name="city" /></label>
          <label className="tc">地址<input name="address1" required /></label>
          <label className="tc">地址（第二行）<input name="address2" /></label>
          <label className="tc">電話<input name="phone" type="tel" /></label>
          <label className="account-check tc"><input name="makeDefault" type="checkbox" /> 設為預設地址</label>
          <button type="submit" className="catalog-button tc" disabled={busy}>新增</button>
        </form>
      </div>}
      {section === "orders" && <div className="account-orders">
        {orders.length === 0 && <p className="tc account-hint">還沒有訂單。</p>}
        <ul>{orders.map((o) => <li key={o.id}>
          <div className="account-order-head"><strong>#{o.orderNumber}</strong><span>{new Date(o.processedAt).toLocaleDateString("zh-TW")}</span><span className="tc">{statusZh[o.financialStatus ?? ""] ?? o.financialStatus} · {statusZh[o.fulfillmentStatus] ?? o.fulfillmentStatus}</span><strong>{money(o.totalPrice)}</strong></div>
          <ul className="account-order-lines">{o.lineItems.edges.map(({ node }, i) => <li key={i}>{node.variant?.image && <img src={node.variant.image.url} alt="" />}<span className="tc">{node.title} × {node.quantity}</span></li>)}</ul>
          <a href={o.statusUrl} target="_blank" rel="noreferrer" className="tc account-order-link">查看訂單狀態</a>
        </li>)}</ul>
      </div>}
    </div>
  );
}
