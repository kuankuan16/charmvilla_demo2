// Messages for failed API calls. The API routes answer in Chinese (the source language); English pages show their own
// message keyed on the error code. A message written by Shopify itself is shown as Shopify sends it (.translation/decisions.md).
import type { Locale } from "./config";

const english: Record<string, string> = {
  bad_request: "Some required information is missing. Please check and try again.",
  unauthorized: "Please sign in first.",
  not_configured: "This will be available once Shopify is connected.",
  server_error: "Something went wrong. Please try again.",
};
const cjk = /[\u3400-\u9fff]/;

export function apiMessage(lang: Locale, data: { error?: string; message?: string }, fallback: string) {
  if (lang !== "en") return data.message || fallback;
  if (data.error && english[data.error]) return english[data.error];
  return data.message && !cjk.test(data.message) ? data.message : fallback;
}
