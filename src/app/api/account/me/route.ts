import { me } from "@/lib/shopify/customer";
import { isShopifyConfigured } from "@/lib/shopify/config";
import { readSession, clearSession } from "@/lib/shopify/session";
import { json, handleError } from "@/lib/shopify/http";

export async function GET() {
  if (!isShopifyConfigured()) return json({ configured: false, customer: null });
  const token = await readSession();
  if (!token) return json({ configured: true, customer: null }, 401);
  try {
    const customer = await me(token);
    if (!customer) { await clearSession(); return json({ configured: true, customer: null }, 401); }
    return json({ configured: true, customer });
  } catch (e) { return handleError(e); }
}
