import { subscribe } from "@/lib/shopify/newsletter";
import { json, handleError, body } from "@/lib/shopify/http";

// POST { email, company? } from the footer form and the newsletter popup (NewsletterForm's useNewsletterSubmit).
// "company" is a hidden field people never see: when a bot fills it, answer as if subscribed and store nothing.
export async function POST(req: Request) {
  const { email, company } = await body<{ email?: string; company?: string }>(req);
  const address = email?.trim().toLowerCase() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address) || address.length > 254) return json({ error: "bad_request", message: "請填寫正確的 Email" }, 400);
  if (company) return json({ ok: true });
  try { await subscribe(address); return json({ ok: true }); } catch (e) { return handleError(e); }
}
