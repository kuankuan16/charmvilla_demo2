// Customer session = the Storefront customerAccessToken kept in an httpOnly cookie. Nothing else is stored on our side.
import { cookies } from "next/headers";

export const SESSION_COOKIE = "cv_customer";

export async function readSession() {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}
export async function writeSession(token: string, expiresAt: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: new Date(expiresAt) });
}
export async function clearSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}
