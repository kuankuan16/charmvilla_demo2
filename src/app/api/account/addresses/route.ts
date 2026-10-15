import { createAddress, updateAddress, deleteAddress, setDefaultAddress, type AddressInput } from "@/lib/shopify/customer";
import { readSession } from "@/lib/shopify/session";
import { ShopifyError } from "@/lib/shopify/client";
import { json, handleError, body } from "@/lib/shopify/http";

// No session is a 401; every other failure (an address Shopify refuses, an outage) keeps its own status. (Before 2026-10-14 every
// error carrying a status, Shopify's included, was answered as 401 "please sign in".)
const auth = async () => { const t = await readSession(); if (!t) throw new ShopifyError("請先登入", 401, "unauthorized"); return t; };

export async function POST(req: Request) {
  try { const token = await auth(); const { address, makeDefault } = await body<{ address: AddressInput; makeDefault?: boolean }>(req);
    const created = await createAddress(token, address); if (makeDefault) await setDefaultAddress(token, created.id); return json({ address: created });
  } catch (e) { return handleError(e); }
}
export async function PATCH(req: Request) {
  try { const token = await auth(); const { id, address, makeDefault } = await body<{ id: string; address?: AddressInput; makeDefault?: boolean }>(req);
    const updated = address ? await updateAddress(token, id, address) : null; if (makeDefault) await setDefaultAddress(token, id); return json({ address: updated, ok: true });
  } catch (e) { return handleError(e); }
}
export async function DELETE(req: Request) {
  try { const token = await auth(); const { id } = await body<{ id: string }>(req); await deleteAddress(token, id); return json({ ok: true });
  } catch (e) { return handleError(e); }
}
