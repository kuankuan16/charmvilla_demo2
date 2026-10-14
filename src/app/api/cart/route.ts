// Cart API (Shopify Storefront cart). The client keeps only the cart id; every mutation returns the full cart.
//   GET    /api/cart?id=gid://shopify/Cart/…     → cart (or { configured:false } when Shopify is not set up)
//   POST   /api/cart   { id?, lines:[{merchandiseId, quantity, attributes?}] } → creates the cart if no id (country US, plus the
//                                                                    signed-in customer when there is one), otherwise adds lines
//   PATCH  /api/cart   { id, lines:[{id, quantity}] }               → updates quantities
//   (POST and PATCH refuse more pre-order boxes than are left: 409 preorder_full, src/lib/shopify/preorder.ts)
//   DELETE /api/cart   { id, lineIds:[…] }                          → removes lines
import { getCart, createCart, addLines, updateLines, removeLines, STORE_COUNTRY } from "@/lib/shopify/cart";
import { readSession } from "@/lib/shopify/session";
import { isShopifyConfigured } from "@/lib/shopify/config";
import { json, handleError, buyerIp, body } from "@/lib/shopify/http";
import { assertPreOrderRoom } from "@/lib/shopify/preorder";

export async function GET(req: Request) {
  if (!isShopifyConfigured()) return json({ configured: false, cart: null });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return json({ configured: true, cart: null });
  try { return json({ configured: true, cart: await getCart(id, buyerIp(req)) }); } catch (e) { return handleError(e); }
}
export async function POST(req: Request) {
  const { id, lines } = await body<{ id?: string; lines?: { merchandiseId: string; quantity: number; attributes?: { key: string; value: string }[] }[] }>(req);
  if (!lines?.length) return json({ error: "bad_request", message: "缺少商品" }, 400);
  try {
    // pre-order products share one allowance (客戶答覆 B7): the bag may not hold more boxes than are left
    await assertPreOrderRoom(id ? await getCart(id, buyerIp(req)) : null, lines);
    if (id) return json({ cart: await addLines(id, lines, buyerIp(req)) });
    const customerAccessToken = (await readSession()) ?? undefined;
    return json({ cart: await createCart(lines, buyerIp(req), { countryCode: STORE_COUNTRY, ...(customerAccessToken ? { customerAccessToken } : {}) }) });
  } catch (e) { return handleError(e); }
}
export async function PATCH(req: Request) {
  const { id, lines } = await body<{ id?: string; lines?: { id: string; quantity: number }[] }>(req);
  if (!id || !lines?.length) return json({ error: "bad_request", message: "缺少購物車或商品" }, 400);
  try { await assertPreOrderRoom(await getCart(id, buyerIp(req)), [], lines); return json({ cart: await updateLines(id, lines, buyerIp(req)) }); } catch (e) { return handleError(e); }
}
export async function DELETE(req: Request) {
  const { id, lineIds } = await body<{ id?: string; lineIds?: string[] }>(req);
  if (!id || !lineIds?.length) return json({ error: "bad_request", message: "缺少購物車或商品" }, 400);
  try { return json({ cart: await removeLines(id, lineIds, buyerIp(req)) }); } catch (e) { return handleError(e); }
}
