// POST /api/account/reset { url, password, cartId? } — the link from Shopify's email plus the new password; signs the customer in.
import { resetByUrl } from "@/lib/shopify/customer";
import { attachCustomer } from "@/lib/shopify/cart";
import { isShopifyConfigured, NOT_CONFIGURED, NOT_CONFIGURED_MESSAGE } from "@/lib/shopify/config";
import { writeSession } from "@/lib/shopify/session";
import { json, handleError, body, buyerIp } from "@/lib/shopify/http";

// Only a link of Shopify's own shape is passed on: https://…/account/reset/<customer id>/<token>
const isLink = (url: string) => { try { const u = new URL(url); return u.protocol === "https:" && /\/account\/reset\/[^/]+\/[^/]+$/.test(u.pathname); } catch { return false; } };

export async function POST(req: Request) {
  if (!isShopifyConfigured()) return json({ error: NOT_CONFIGURED, message: NOT_CONFIGURED_MESSAGE }, 503);
  const { url, password, cartId } = await body<{ url?: string; password?: string; cartId?: string }>(req);
  if (!url || !isLink(url)) return json({ error: "bad_request", message: "重設連結無效或已過期，請重新申請。" }, 400);
  if (!password || password.length < 8) return json({ error: "bad_request", message: "密碼至少 8 個字元" }, 400);
  try { const token = await resetByUrl(url, password); await writeSession(token.accessToken, token.expiresAt); await attachCustomer(cartId, token.accessToken, buyerIp(req)); return json({ ok: true }); } catch (e) { return handleError(e); }
}
