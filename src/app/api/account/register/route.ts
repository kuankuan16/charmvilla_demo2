import { register, login } from "@/lib/shopify/customer";
import { writeSession } from "@/lib/shopify/session";
import { attachCustomer } from "@/lib/shopify/cart";
import { json, handleError, body, buyerIp } from "@/lib/shopify/http";

export async function POST(req: Request) {
  const input = await body<{ cartId?: string; email?: string; password?: string; firstName?: string; lastName?: string; phone?: string; acceptsMarketing?: boolean }>(req);
  if (!input.email || !input.password) return json({ error: "bad_request", message: "請填寫 Email 與密碼" }, 400);
  if (input.password.length < 8) return json({ error: "bad_request", message: "密碼至少 8 個字元" }, 400);
  try {
    await register({ email: input.email, password: input.password, firstName: input.firstName, lastName: input.lastName, phone: input.phone || undefined, acceptsMarketing: !!input.acceptsMarketing });
    const token = await login(input.email, input.password);   // sign in right after registering
    await writeSession(token.accessToken, token.expiresAt);
    await attachCustomer(input.cartId, token.accessToken, buyerIp(req));
    return json({ ok: true });
  } catch (e) { return handleError(e); }
}
