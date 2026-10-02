// Cart API (Shopify Storefront cart). The client keeps only the cart id; every mutation returns the full cart.
//   GET    /api/cart?id=gid://shopify/Cart/…     → cart (or { configured:false } when Shopify is not set up)
//   POST   /api/cart   { id?, lines:[{merchandiseId, quantity}] }   → creates the cart if no id, otherwise adds lines
//   PATCH  /api/cart   { id, lines:[{id, quantity}] }               → updates quantities
//   DELETE /api/cart   { id, lineIds:[…] }                          → removes lines
import { getCart, createCart, addLines, updateLines, removeLines } from "@/lib/shopify/cart";
import { isShopifyConfigured } from "@/lib/shopify/config";
import { json, handleError, buyerIp, body } from "@/lib/shopify/http";

export async function GET(req: Request) {
  if (!isShopifyConfigured()) return json({ configured: false, cart: null });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return json({ configured: true, cart: null });
  try { return json({ configured: true, cart: await getCart(id, buyerIp(req)) }); } catch (e) { return handleError(e); }
}
export async function POST(req: Request) {
  const { id, lines } = await body<{ id?: string; lines?: { merchandiseId: string; quantity: number; attributes?: { key: string; value: string }[] }[] }>(req);
  if (!lines?.length) return json({ error: "bad_request", message: "缺少商品" }, 400);
  try { return json({ cart: id ? await addLines(id, lines, buyerIp(req)) : await createCart(lines, buyerIp(req)) }); } catch (e) { return handleError(e); }
}
export async function PATCH(req: Request) {
  const { id, lines } = await body<{ id?: string; lines?: { id: string; quantity: number }[] }>(req);
  if (!id || !lines?.length) return json({ error: "bad_request", message: "缺少購物車或商品" }, 400);
  try { return json({ cart: await updateLines(id, lines, buyerIp(req)) }); } catch (e) { return handleError(e); }
}
export async function DELETE(req: Request) {
  const { id, lineIds } = await body<{ id?: string; lineIds?: string[] }>(req);
  if (!id || !lineIds?.length) return json({ error: "bad_request", message: "缺少購物車或商品" }, 400);
  try { return json({ cart: await removeLines(id, lineIds, buyerIp(req)) }); } catch (e) { return handleError(e); }
}
