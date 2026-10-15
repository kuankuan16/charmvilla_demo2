import { storefront, ShopifyError, firstUserError } from "./client";
import { CART_QUERY, CART_CREATE, CART_LINES_ADD, CART_LINES_UPDATE, CART_LINES_REMOVE, CART_BUYER_IDENTITY } from "./queries";
import type { Cart, UserError } from "./types";

type LineInput = { merchandiseId: string; quantity: number; attributes?: { key: string; value: string }[] }; // attributes: e.g. the tea chosen for a one-tea gift box
type Payload<K extends string> = Record<K, { cart: Cart | null; userErrors: UserError[]; warnings?: { code: string; message: string }[] }>;
/** Shopify may change a line instead of refusing it (e.g. fewer in stock than asked) and only say so in `warnings`; the bag shows that. */
export type CartResult = { cart: Cart; warning?: string };

/** A mutation on an existing cart that comes back without one: Shopify no longer has it (checkout completed, or expired). */
export const CART_GONE = "cart_gone";
const cartGone = () => new ShopifyError("購物車已失效，請重新加入商品。", 404, CART_GONE);
function unwrap<K extends string>(data: Payload<K>, key: K, existing = true): Cart {
  if (existing && !data[key].cart) throw cartGone();
  const err = firstUserError(data[key].userErrors); if (err) throw Object.assign(new ShopifyError(err, 400), data[key].cart ? { cart: data[key].cart } : {});
  if (!data[key].cart) throw new ShopifyError("購物車不存在", 404);
  return data[key].cart;
}
const withWarning = <K extends string>(data: Payload<K>, key: K, existing = true): CartResult => ({ cart: unwrap(data, key, existing), ...(data[key].warnings?.length ? { warning: data[key].warnings[0].message } : {}) });

export const getCart = async (id: string, buyerIp?: string) => (await storefront<{ cart: Cart | null }>(CART_QUERY, { id }, buyerIp)).cart;
type BuyerIdentity = { customerAccessToken?: string; email?: string; countryCode?: string };
/** The US store sells to the United States only, in USD: every cart is created and re-identified with this country. */
export const STORE_COUNTRY = "US";
export const createCart = async (lines: LineInput[], buyerIp?: string, buyerIdentity?: BuyerIdentity) => withWarning(await storefront<Payload<"cartCreate">>(CART_CREATE, { input: { lines, ...(buyerIdentity ? { buyerIdentity } : {}) } }, buyerIp), "cartCreate", false);
export const addLines = async (cartId: string, lines: LineInput[], buyerIp?: string) => withWarning(await storefront<Payload<"cartLinesAdd">>(CART_LINES_ADD, { cartId, lines }, buyerIp), "cartLinesAdd");
export const updateLines = async (cartId: string, lines: { id: string; quantity: number }[], buyerIp?: string) => withWarning(await storefront<Payload<"cartLinesUpdate">>(CART_LINES_UPDATE, { cartId, lines }, buyerIp), "cartLinesUpdate");
export const removeLines = async (cartId: string, lineIds: string[], buyerIp?: string) => unwrap(await storefront<Payload<"cartLinesRemove">>(CART_LINES_REMOVE, { cartId, lineIds }, buyerIp), "cartLinesRemove");
/** Attach the logged-in customer (and the country for Shopify Markets pricing) to the cart. */
export const setBuyerIdentity = async (cartId: string, identity: BuyerIdentity, buyerIp?: string) =>
  unwrap(await storefront<Payload<"cartBuyerIdentityUpdate">>(CART_BUYER_IDENTITY, { cartId, buyerIdentity: identity }, buyerIp), "cartBuyerIdentityUpdate");
/** After sign-in: tie the visitor's existing cart to the customer so checkout starts with their details. Never fails the sign-in. */
export const attachCustomer = async (cartId: string | undefined, customerAccessToken: string, buyerIp?: string) => {
  if (!cartId) return;
  await setBuyerIdentity(cartId, { customerAccessToken, countryCode: STORE_COUNTRY }, buyerIp).catch(() => null);
};
