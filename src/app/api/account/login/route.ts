import { login } from "@/lib/shopify/customer";
import { writeSession } from "@/lib/shopify/session";
import { json, handleError, body } from "@/lib/shopify/http";

export async function POST(req: Request) {
  const { email, password } = await body<{ email?: string; password?: string }>(req);
  if (!email || !password) return json({ error: "bad_request", message: "請填寫 Email 與密碼" }, 400);
  try { const token = await login(email, password); await writeSession(token.accessToken, token.expiresAt); return json({ ok: true }); } catch (e) { return handleError(e); }
}
