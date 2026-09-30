import { NextResponse } from "next/server";
import { ShopifyError } from "./client";

export const json = (body: unknown, status = 200) => NextResponse.json(body, { status });
export function handleError(e: unknown) {
  if (e instanceof ShopifyError) return json({ error: e.code ?? "shopify_error", message: e.message }, e.status);
  return json({ error: "server_error", message: e instanceof Error ? e.message : "未知錯誤" }, 500);
}
export const buyerIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
export async function body<T>(req: Request): Promise<T> { try { return (await req.json()) as T; } catch { return {} as T; } }
