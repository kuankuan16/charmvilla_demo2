import { logout } from "@/lib/shopify/customer";
import { readSession, clearSession } from "@/lib/shopify/session";
import { json } from "@/lib/shopify/http";

export async function POST() {
  const token = await readSession();
  if (token) await logout(token);
  await clearSession();
  return json({ ok: true });
}
