import { storefront, ShopifyError, firstUserError } from "./client";
import { CART_QUERY, CART_CREATE, CART_LINES_ADD, CART_LINES_UPDATE, CART_LINES_REMOVE, CART_BUYER_IDENTITY } from "./queries";
import type { Cart, UserError } from "./types";

type LineInput = { merchandiseId: string; quantity: number };
type Payload<K extends string> = Record<K, { cart: Cart | null; userErrors: UserError[] }>;

function unwrap<K extends string>(data: Payload<K>, key: K): Cart {
  const err = firstUserError(data[key].userErrors); if (err) throw new ShopifyError(err, 400);
  if (!data[key].cart) throw new ShopifyError("購物車不存在", 404);
  return data[key].cart;
}

export const getCart = async (id: string, buyerIp?: string) => (await storefront<{ cart: Cart | null }>(CART_QUERY, { id }, buyerIp)).cart;
export const createCart = async (lines: LineInput[], buyerIp?: string) => unwrap(await storefront<Payload<"cartCreate">>(CART_CREATE, { input: { lines } }, buyerIp), "cartCreate");
export const addLines = async (cartId: string, lines: LineInput[], buyerIp?: string) => unwrap(await storefront<Payload<"cartLinesAdd">>(CART_LINES_ADD, { cartId, lines }, buyerIp), "cartLinesAdd");
export const updateLines = async (cartId: string, lines: { id: string; quantity: number }[], buyerIp?: string) => unwrap(await storefront<Payload<"cartLinesUpdate">>(CART_LINES_UPDATE, { cartId, lines }, buyerIp), "cartLinesUpdate");
export const removeLines = async (cartId: string, lineIds: string[], buyerIp?: string) => unwrap(await storefront<Payload<"cartLinesRemove">>(CART_LINES_REMOVE, { cartId, lineIds }, buyerIp), "cartLinesRemove");
/** Attach the logged-in customer (and optional country for Shopify Markets pricing) to the cart. */
export const setBuyerIdentity = async (cartId: string, identity: { customerAccessToken?: string; email?: string; countryCode?: string }, buyerIp?: string) =>
  unwrap(await storefront<Payload<"cartBuyerIdentityUpdate">>(CART_BUYER_IDENTITY, { cartId, buyerIdentity: identity }, buyerIp), "cartBuyerIdentityUpdate");
