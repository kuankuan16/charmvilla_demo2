// GET /api/preorder → { left: { "<slug>": boxes left } } for the pre-order products with a shared allowance (src/lib/shopify/preorder.ts);
// 503 not_configured until the Admin token is set, and the pages then keep the allowance written in the data.
import { preOrderLeft } from "@/lib/shopify/preorder";
import { json, handleError } from "@/lib/shopify/http";

export async function GET() {
  try {
    const res = json({ left: await preOrderLeft() });
    res.headers.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=30");
    return res;
  } catch (e) { return handleError(e); }
}
