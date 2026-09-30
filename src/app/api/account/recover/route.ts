import { recover } from "@/lib/shopify/customer";
import { json, handleError, body } from "@/lib/shopify/http";

export async function POST(req: Request) {
  const { email } = await body<{ email?: string }>(req);
  if (!email) return json({ error: "bad_request", message: "請填寫 Email" }, 400);
  try { await recover(email); return json({ ok: true }); } catch (e) { return handleError(e); }
}
