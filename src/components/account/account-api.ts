// Small helpers shared by the account pages (AccountClient, AccountLinkForm).

/** The Shopify cart id CartProvider keeps in localStorage ("cv-cart-id"), if any. */
export const cartIdInBrowser = () => { try { return localStorage.getItem("cv-cart-id"); } catch { return null; } };

export async function api<T>(path: string, init?: RequestInit): Promise<{ ok: boolean; status: number; data: T & { message?: string; error?: string } }> {
  const res = await fetch(path, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  const data = (await res.json().catch(() => ({}))) as T & { message?: string; error?: string };
  return { ok: res.ok, status: res.status, data };
}
