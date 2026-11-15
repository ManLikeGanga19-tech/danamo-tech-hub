/**
 * The admin app is served at the root of admin.danamotech.co.ke
 * (proxy.ts rewrites "/x" -> "/admin/x"). In local development without the
 * admin subdomain it lives under "/admin". These helpers keep links correct
 * in both cases.
 */

function onAdminHost(): boolean {
  return typeof window !== "undefined" && window.location.hostname.startsWith("admin.");
}

/** Build an admin URL from an app-relative path like "/messages". */
export function adminPath(path: string = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (onAdminHost()) return clean;
  return clean === "/" ? "/admin" : `/admin${clean}`;
}

/** Normalise a pathname to app-relative form ("/admin/messages" -> "/messages"). */
export function toAppPath(pathname: string): string {
  if (pathname === "/admin") return "/";
  return pathname.startsWith("/admin/") ? pathname.slice("/admin".length) : pathname;
}
