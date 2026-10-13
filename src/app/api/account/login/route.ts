import { login } from "@/lib/shopify/customer";
import { writeSession } from "@/lib/shopify/session";
import { attachCustomer } from "@/lib/shopify/cart";
import { json, handleError, body, buyerIp } from "@/lib/shopify/http";

export async function POST(req: Request) {
  const { email, password, cartId } = await body<{ email?: string; password?: string; cartId?: string }>(req); // cartId: the bag already in this browser
  if (!email || !password) return json({ error: "bad_request", message: "請填寫 Email 與密碼" }, 400);
  try { const token = await login(email, password); await writeSession(token.accessToken, token.expiresAt); await attachCustomer(cartId, token.accessToken, buyerIp(req)); return json({ ok: true }); } catch (e) { return handleError(e); }
}
