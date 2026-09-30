import { storefront, ShopifyError, firstUserError } from "./client";
import { CUSTOMER_QUERY, CUSTOMER_CREATE, TOKEN_CREATE, TOKEN_DELETE, CUSTOMER_RECOVER, CUSTOMER_UPDATE, ADDRESS_CREATE, ADDRESS_UPDATE, ADDRESS_DELETE, ADDRESS_DEFAULT } from "./queries";
import type { Customer, Address, UserError } from "./types";

export type AddressInput = { firstName?: string; lastName?: string; company?: string; address1?: string; address2?: string; city?: string; province?: string; zip?: string; country?: string; phone?: string };

const fail = (errors?: UserError[], fallback = "Shopify 回傳錯誤") => { const m = firstUserError(errors); if (m) throw new ShopifyError(m, 400); throw new ShopifyError(fallback, 502); };

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
export async function recover(email: string) {
  const d = await storefront<{ customerRecover: { customerUserErrors: UserError[] } }>(CUSTOMER_RECOVER, { email });
  const m = firstUserError(d.customerRecover.customerUserErrors); if (m) throw new ShopifyError(m, 400);
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
