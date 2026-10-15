// Compatibility count endpoint: live Shopify variant quantities, not historical campaign allocations.
// API errors remain explicit; callers must not substitute stale local stock.
import { preOrderLeft } from "@/lib/shopify/preorder";
import { json, handleError } from "@/lib/shopify/http";

export async function GET() {
  try {
    const res = json({ left: await preOrderLeft() });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (e) { return handleError(e); }
}
