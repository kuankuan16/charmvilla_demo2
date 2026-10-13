// Locale routing. English (the US store's default, user 2026-10-13) is served at the unprefixed URL and Chinese under /zh;
// both are rendered from app/[lang].
//   /collections/tea     → rewritten to /en/collections/tea (the URL in the browser does not change)
//   /zh/collections/tea  → served as is
//   /en/collections/tea  → redirected to /collections/tea so the English page has one address (old /en links keep working)
// No Accept-Language redirect: the language is changed only with the switch in the header.
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/zh" || pathname.startsWith("/zh/")) return NextResponse.next();
  const url = request.nextUrl.clone();
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

// Skip API routes, Next internals, public media and any path with a file extension (sitemap.xml, icon.svg, …).
export const config = { matcher: ["/((?!api|_next|media|brand|.*\\..*).*)"] };
