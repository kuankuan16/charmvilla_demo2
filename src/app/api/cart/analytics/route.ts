import { z } from "zod";
import { storefront, firstUserError } from "@/lib/shopify/client";
import { body, buyerIp, handleError, json } from "@/lib/shopify/http";

const input = z.object({
  id: z.string().startsWith("gid://shopify/Cart/").max(1024),
  consent: z.enum(["granted", "denied"]),
  clientId: z.string().regex(/^\d+\.\d+$/).max(80).optional(),
  sessionId: z.string().regex(/^\d+$/).max(30).optional(),
  debug: z.boolean().optional(),
});
const query = `mutation CheckoutAnalytics($id: ID!, $attributes: [AttributeInput!]!) {
  cartAttributesUpdate(cartId: $id, attributes: $attributes) {
    cart { checkoutUrl }
    userErrors { field message }
  }
}`;
/** Private cart attributes join consented storefront and checkout sessions without email, address or account data. */
export async function POST(req: Request) {
  try {
    const parsed = input.safeParse(await body(req));
    if (!parsed.success) return json({ error: "bad_request" }, 400);
    const v = parsed.data; const allowed = v.consent === "granted";
    const attributes = [
      { key: "cv_analytics__", value: allowed ? "granted" : "denied" },
      { key: "cv_ga_client_id__", value: allowed ? v.clientId ?? "" : "" },
      { key: "cv_ga_session_id__", value: allowed ? v.sessionId ?? "" : "" },
      { key: "cv_ga_debug__", value: allowed && v.debug ? "1" : "0" },
    ];
    const data = await storefront<{ cartAttributesUpdate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] } }>(query, { id: v.id, attributes }, buyerIp(req));
    if (firstUserError(data.cartAttributesUpdate.userErrors) || !data.cartAttributesUpdate.cart) return json({ error: "checkout_unavailable" }, 502);
    return json({ checkoutUrl: data.cartAttributesUpdate.cart.checkoutUrl });
  } catch (e) { return handleError(e); }
}
