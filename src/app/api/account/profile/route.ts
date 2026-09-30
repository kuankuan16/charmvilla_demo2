import { updateProfile } from "@/lib/shopify/customer";
import { readSession } from "@/lib/shopify/session";
import { json, handleError, body } from "@/lib/shopify/http";

export async function PATCH(req: Request) {
  const token = await readSession();
  if (!token) return json({ error: "unauthorized", message: "請先登入" }, 401);
  const input = await body<{ firstName?: string; lastName?: string; phone?: string; email?: string; password?: string; acceptsMarketing?: boolean }>(req);
  try { return json({ customer: await updateProfile(token, input) }); } catch (e) { return handleError(e); }
}
