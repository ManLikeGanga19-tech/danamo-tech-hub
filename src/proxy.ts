import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Host-based separation of the two apps built from this codebase:
 *
 *  - admin.danamotech.co.ke  -> admin console only. "/x" is served from the
 *    /admin route tree, so URLs stay clean (no "/admin" prefix). Public pages
 *    are unreachable here.
 *  - danamotech.co.ke / www  -> public site only. "/admin" and the admin API
 *    proxy ("/api/proxy") return 404 in production.
 *
 * In development, "/admin" on localhost:3000 is still allowed for convenience;
 * admin.localhost:3000 behaves exactly like production.
 */

const isDev = process.env.NODE_ENV !== "production";

function isAdminRoute(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAdminApiProxy(pathname: string): boolean {
  return pathname === "/api/proxy" || pathname.startsWith("/api/proxy/");
}

function notFound(req: NextRequest): NextResponse {
  // Rewrite to a path with no route so Next renders the global 404 page.
  const url = req.nextUrl.clone();
  url.pathname = "/__not-found";
  return NextResponse.rewrite(url);
}

export function proxy(req: NextRequest) {
  const hostname = req.headers.get("host") ?? "";
  const { pathname } = req.nextUrl;

  if (hostname.startsWith("admin.")) {
    if (isAdminApiProxy(pathname)) return NextResponse.next();

    if (pathname === "/robots.txt") {
      return new NextResponse("User-agent: *\nDisallow: /\n", {
        headers: { "content-type": "text/plain" },
      });
    }

    // Canonical admin URLs have no "/admin" prefix. Build the target from the
    // Host header (req.nextUrl carries the container's internal address).
    if (isAdminRoute(pathname)) {
      const proto =
        req.headers.get("x-forwarded-proto")?.split(",")[0].trim() ??
        req.nextUrl.protocol.replace(":", "");
      const target = new URL(
        (pathname.slice("/admin".length) || "/") + req.nextUrl.search,
        `${proto}://${hostname}`,
      );
      return NextResponse.redirect(target, 308);
    }

    const url = req.nextUrl.clone();
    url.pathname = pathname === "/" ? "/admin" : `/admin${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Public host
  if (!isDev && (isAdminRoute(pathname) || isAdminApiProxy(pathname))) {
    return notFound(req);
  }

  return NextResponse.next();
}

export const config = {
  // Everything except build assets and static files. /api/proxy IS included so
  // the admin API proxy can be blocked on the public host.
  matcher: [
    "/((?!_next/static|_next/image|favicon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|webmanifest)$).*)",
  ],
};
