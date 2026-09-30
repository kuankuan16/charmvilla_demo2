export type Money = { amount: string; currencyCode: string };
export type CartLine = {
  id: string; quantity: number; cost: { totalAmount: Money };
  merchandise: { id: string; title: string; price: Money; image: { url: string; altText: string | null } | null; product: { handle: string; title: string } };
};
export type Cart = { id: string; checkoutUrl: string; totalQuantity: number; cost: { subtotalAmount: Money; totalAmount: Money }; lines: { edges: { node: CartLine }[] } };
export type Address = { id: string; firstName: string | null; lastName: string | null; company: string | null; address1: string | null; address2: string | null; city: string | null; province: string | null; zip: string | null; country: string | null; phone: string | null; formatted: string[] };
export type Order = { id: string; orderNumber: number; processedAt: string; financialStatus: string | null; fulfillmentStatus: string; statusUrl: string; totalPrice: Money; lineItems: { edges: { node: { title: string; quantity: number; variant: { image: { url: string; altText: string | null } | null } | null } }[] } };
export type Customer = { id: string; firstName: string | null; lastName: string | null; email: string | null; phone: string | null; acceptsMarketing: boolean; defaultAddress: Address | null; addresses: { edges: { node: Address }[] }; orders: { edges: { node: Order }[] } };
export type UserError = { code?: string | null; field?: string[] | null; message: string };
