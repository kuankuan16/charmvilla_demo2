import { storefront, ShopifyError, firstUserError } from "./client";
import { CUSTOMER_QUERY, CUSTOMER_CREATE, TOKEN_CREATE, TOKEN_DELETE, CUSTOMER_RECOVER, CUSTOMER_RESET_BY_URL, CUSTOMER_ACTIVATE_BY_URL, CUSTOMER_UPDATE, ADDRESS_CREATE, ADDRESS_UPDATE, ADDRESS_DELETE, ADDRESS_DEFAULT } from "./queries";
import type { Customer, Address, UserError } from "./types";

export type AddressInput = { firstName?: string; lastName?: string; company?: string; address1?: string; address2?: string; city?: string; province?: string; zip?: string; country?: string; phone?: string };

// Shopify's customer errors that the pages explain in their own words (src/i18n/errors.ts has the English); any other error keeps Shopify's message.
const known = (e: UserError): ShopifyError | null => {
  if (e.code === "TAKEN" && e.field?.includes("email")) return new ShopifyError("這個 Email 已經註冊過，請直接登入；忘記密碼可以重設。", 400, "email_taken");
  // the email is already a customer without a login (a newsletter subscriber, a past guest buyer): Shopify emails an activation link
  if (e.code === "CUSTOMER_DISABLED") return new ShopifyError("這個 Email 已經在我們的顧客名單上（例如訂閱過電子報）。我們已寄出啟用帳號的信，請到信箱點連結設定密碼。", 409, "activation_sent");
  if (e.code === "UNIDENTIFIED_CUSTOMER") return new ShopifyError("Email 或密碼不正確。", 400, "bad_login");
  if (e.field?.includes("phone")) return new ShopifyError("手機號碼格式不正確，請用國際格式，例如 +1 415 555 0100。", 400, "invalid_phone");
  return null;
};
const fail = (errors?: UserError[], fallback = "Shopify 回傳錯誤") => { const m = firstUserError(errors); if (m) throw known(errors![0]) ?? new ShopifyError(m, 400); throw new ShopifyError(fallback, 502); };

export async function register(input: { email: string; password: string; firstName?: string; lastName?: string; phone?: string; acceptsMarketing?: boolean }) {
  const d = await storefront<{ customerCreate: { customer: { id: string; email: string } | null; customerUserErrors: UserError[] } }>(CUSTOMER_CREATE, { input });
  if (!d.customerCreate.customer) fail(d.customerCreate.customerUserErrors, "註冊失敗");
  return d.customerCreate.customer!;
}

export async function login(email: string, password: string) {
  const d = await storefront<{ customerAccessTokenCreate: { customerAccessToken: { accessToken: string; expiresAt: string } | null; customerUserErrors: UserError[] } }>(TOKEN_CREATE, { input: { email, password } });
  if (!d.customerAccessTokenCreate.customerAccessToken) fail(d.customerAccessTokenCreate.customerUserErrors, "登入失敗");
  return d.customerAccessTokenCreate.customerAccessToken!;
}

export const logout = (token: string) => storefront(TOKEN_DELETE, { token }).catch(() => null);
export const me = async (token: string) => (await storefront<{ customer: Customer | null }>(CUSTOMER_QUERY, { token })).customer;
/** Asks Shopify to email a reset link. An email with no account gets the same answer, so the form never tells who has one. */
export async function recover(email: string) {
  const d = await storefront<{ customerRecover: { customerUserErrors: UserError[] } }>(CUSTOMER_RECOVER, { email });
  const errors = d.customerRecover.customerUserErrors.filter((e) => e.code !== "UNIDENTIFIED_CUSTOMER");
  const m = firstUserError(errors); if (m) throw new ShopifyError(m, 400);
}
type TokenPayload = { customerAccessToken: { accessToken: string; expiresAt: string } | null; customerUserErrors: UserError[] };
/** Set a new password from the emailed reset link; signs the customer in. */
export async function resetByUrl(resetUrl: string, password: string) {
  const d = await storefront<{ customerResetByUrl: TokenPayload }>(CUSTOMER_RESET_BY_URL, { resetUrl, password });
  if (!d.customerResetByUrl.customerAccessToken) fail(d.customerResetByUrl.customerUserErrors, "重設密碼失敗");
  return d.customerResetByUrl.customerAccessToken!;
}
/** Activate an account (created by the shop or invited) from the emailed link, choosing a password; signs the customer in. */
export async function activateByUrl(activationUrl: string, password: string) {
  const d = await storefront<{ customerActivateByUrl: TokenPayload }>(CUSTOMER_ACTIVATE_BY_URL, { activationUrl, password });
  if (!d.customerActivateByUrl.customerAccessToken) fail(d.customerActivateByUrl.customerUserErrors, "帳號啟用失敗");
  return d.customerActivateByUrl.customerAccessToken!;
}
export async function updateProfile(token: string, customer: { firstName?: string; lastName?: string; phone?: string; email?: string; password?: string; acceptsMarketing?: boolean }) {
  const d = await storefront<{ customerUpdate: { customer: Customer | null; customerUserErrors: UserError[] } }>(CUSTOMER_UPDATE, { token, customer });
  if (!d.customerUpdate.customer) fail(d.customerUpdate.customerUserErrors, "更新失敗");
  return d.customerUpdate.customer!;
}
export async function createAddress(token: string, address: AddressInput) {
  const d = await storefront<{ customerAddressCreate: { customerAddress: Address | null; customerUserErrors: UserError[] } }>(ADDRESS_CREATE, { token, address });
  if (!d.customerAddressCreate.customerAddress) fail(d.customerAddressCreate.customerUserErrors, "新增地址失敗");
  return d.customerAddressCreate.customerAddress!;
}
export async function updateAddress(token: string, id: string, address: AddressInput) {
  const d = await storefront<{ customerAddressUpdate: { customerAddress: Address | null; customerUserErrors: UserError[] } }>(ADDRESS_UPDATE, { token, id, address });
  if (!d.customerAddressUpdate.customerAddress) fail(d.customerAddressUpdate.customerUserErrors, "更新地址失敗");
  return d.customerAddressUpdate.customerAddress!;
}
export async function deleteAddress(token: string, id: string) {
  const d = await storefront<{ customerAddressDelete: { deletedCustomerAddressId: string | null; customerUserErrors: UserError[] } }>(ADDRESS_DELETE, { token, id });
  if (!d.customerAddressDelete.deletedCustomerAddressId) fail(d.customerAddressDelete.customerUserErrors, "刪除地址失敗");
}
export async function setDefaultAddress(token: string, id: string) {
  const d = await storefront<{ customerDefaultAddressUpdate: { customer: { id: string } | null; customerUserErrors: UserError[] } }>(ADDRESS_DEFAULT, { token, id });
  if (!d.customerDefaultAddressUpdate.customer) fail(d.customerDefaultAddressUpdate.customerUserErrors, "設定預設地址失敗");
}
