// Cart API (Shopify Storefront cart). The client keeps only the cart id; every mutation returns the full cart.
//   GET    /api/cart?id=gid://shopify/Cart/…     → cart (or { configured:false } when Shopify is not set up)
//   POST   /api/cart   { id?, lines:[{merchandiseId, quantity, attributes?}] } → creates the cart if no id (country US, plus the
//                                                                    signed-in customer when there is one), otherwise adds lines
//                                                                    (POST and PATCH may add `warning`: Shopify changed a line, e.g. fewer in stock)
//   PATCH  /api/cart   { id, lines:[{id, quantity}] }               → updates quantities
//   Shopify's live inventory and inventory policy validate every line; local pre-order allowances are not used.
//   DELETE /api/cart   { id, lineIds:[…] }                          → removes lines
// Quantities are whole numbers, 1–99 per line (0 in PATCH removes the line, as in Shopify). A refused change answers with the
// cart as Shopify has it now (`cart` beside the error), so the bag never keeps showing lines that are gone.
// A cart Shopify no longer has (checkout completed, expired) is replaced by a new one on the next add instead of failing.
import { getCart, createCart, addLines, updateLines, removeLines, STORE_COUNTRY, CART_GONE } from "@/lib/shopify/cart";
import { readSession } from "@/lib/shopify/session";
import { isShopifyConfigured } from "@/lib/shopify/config";
import { ShopifyError } from "@/lib/shopify/client";
import { json, handleError, buyerIp, body } from "@/lib/shopify/http";
import { MAX_LINE_QUANTITY, type Cart } from "@/lib/shopify/types";
import { preparePreorderLines } from "@/lib/shopify/preorder-cart";
import type { LineInput } from "@/lib/shopify/cart";

const wholeQuantity = (q: unknown, min: number) => typeof q === "number" && Number.isInteger(q) && q >= min && q <= MAX_LINE_QUANTITY;
const badQuantity = () => json({ error: "bad_quantity", message: `數量需為 1 到 ${MAX_LINE_QUANTITY} 的整數` }, 400);

export async function GET(req: Request) {
  if (!isShopifyConfigured()) return json({ configured: false, cart: null });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return json({ configured: true, cart: null });
  try { return json({ configured: true, cart: await getCart(id, buyerIp(req)) }); } catch (e) { return handleError(e); }
}
export async function POST(req: Request) {
  const { id, lines } = await body<{ id?: string; lines?: LineInput[] }>(req);
  if (!Array.isArray(lines) || !lines.length || lines.some((l) => !l || typeof l.merchandiseId !== "string")) return json({ error: "bad_request", message: "缺少商品" }, 400);
  if (lines.some((l) => !wholeQuantity(l.quantity, 1))) return badQuantity();
  try {
    const purchaseLines = await preparePreorderLines(lines);
    const current = id ? await getCart(id, buyerIp(req)) : null;
    // Shopify variant inventory and selling policies remain authoritative.
    if (current) return json(await addLines(current.id, purchaseLines, buyerIp(req)));
    const customerAccessToken = (await readSession()) ?? undefined;
    return json(await createCart(purchaseLines, buyerIp(req), { countryCode: STORE_COUNTRY, ...(customerAccessToken ? { customerAccessToken } : {}) }));
  } catch (e) { return handleError(e); }
}
export async function PATCH(req: Request) {
  const { id, lines } = await body<{ id?: string; lines?: { id: string; quantity: number }[] }>(req);
  if (typeof id !== "string" || !id || !Array.isArray(lines) || !lines.length) return json({ error: "bad_request", message: "缺少購物車或商品" }, 400);
  if (lines.some((l) => !wholeQuantity(l?.quantity, 0))) return badQuantity();
  try {
    const current = await getCart(id, buyerIp(req));
    if (!current) throw new ShopifyError("購物車已失效，請重新加入商品。", 404, CART_GONE);
    return json(await updateLines(id, lines, buyerIp(req)));
  } catch (e) { return handleError(e); }
}
export async function DELETE(req: Request) {
  const { id, lineIds } = await body<{ id?: string; lineIds?: string[] }>(req);
  if (typeof id !== "string" || !id || !Array.isArray(lineIds) || !lineIds.length || lineIds.some(l => typeof l !== "string")) return json({ error: "bad_request", message: "缺少購物車或商品" }, 400);
  try { return json({ cart: await removeLines(id, lineIds, buyerIp(req)) }); } catch (e) {
    // a line already gone from the cart (removed on Shopify's side, or a second click) is what the shopper wanted: remove the rest
    const cart = e instanceof ShopifyError ? (e.cart as Cart | undefined) : undefined;
    if (cart) {
      const still = lineIds.filter((l) => cart.lines.edges.some(({ node }) => node.id === l));
      if (still.length === lineIds.length) return handleError(e);
      try { return json({ cart: still.length ? await removeLines(id, still, buyerIp(req)) : cart }); } catch (again) { return handleError(again); }
    }
    return handleError(e);
  }
}
