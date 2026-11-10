// Changed from http://localhost:8000 to the proxy path
const BASE = "/api/proxy/admin";

export async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const isFormData = init.body instanceof FormData;
  const headers = isFormData
    ? { ...(init.headers ?? {}) }
    : { "Content-Type": "application/json", ...(init.headers ?? {}) };

  // The browser now calls: http://localhost:3000/api/proxy/admin/auth/login
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}