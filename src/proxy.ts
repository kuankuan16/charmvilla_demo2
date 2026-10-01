// Locale routing. Chinese is served at the unprefixed URL and English under /en; both are rendered from app/[lang].
//   /collections/tea     → rewritten to /zh/collections/tea (the URL in the browser does not change)
//   /en/collections/tea  → served as is
//   /zh/collections/tea  → redirected to /collections/tea so the Chinese page has one address
// No Accept-Language redirect: the language is changed only with the switch in the header.
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();
  const url = request.nextUrl.clone();
  if (pathname === "/zh" || pathname.startsWith("/zh/")) {
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }
  url.pathname = `/zh${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

// Skip API routes, Next internals, public media and any path with a file extension (sitemap.xml, icon.svg, …).
export const config = { matcher: ["/((?!api|_next|media|brand|.*\\..*).*)"] };
