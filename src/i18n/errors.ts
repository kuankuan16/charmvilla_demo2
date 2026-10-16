// Messages for failed API calls. The API routes answer in Chinese (the source language); English pages show their own
// message keyed on the error code. A message written by Shopify itself is shown as Shopify sends it (.translation/decisions.md).
import type { Locale } from "./config";

const english: Record<string, string> = {
  bad_request: "Some required information is missing. Please check and try again.",
  unauthorized: "Please sign in first.",
  not_configured: "This is not open yet.",
  server_error: "Something went wrong. Please try again.",
  preorder_full: "Not enough pre-order boxes are left for this quantity.",
  preorder_unavailable: "This pre-order option is full or is not accepting orders at the moment.",
  bad_tea_mix: "Choose a tea for all three boxes. You can choose the same tea more than once.",
  cart_gone: "Your bag had expired, so it has been emptied. Please add the pieces again.",
  bad_quantity: "Please choose a quantity from 1 to 99.",
  email_taken: "An account with this email already exists. Please sign in, or reset your password.",
  activation_sent: "This email is already on our customer list (for example from the newsletter). We have sent you an email to activate your account: please follow the link in it to choose a password.",
  bad_login: "The email or password is incorrect.",
  invalid_phone: "Please enter the phone number in international format, for example +1 415 555 0100.",
};
const cjk = /[\u3400-\u9fff]/;

export function apiMessage(lang: Locale, data: { error?: string; message?: string }, fallback: string) {
  if (lang !== "en") return data.message || fallback;
  if (data.error && english[data.error]) return english[data.error];
  return data.message && !cjk.test(data.message) ? data.message : fallback;
}
