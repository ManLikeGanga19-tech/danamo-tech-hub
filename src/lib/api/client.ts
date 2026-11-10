const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const isFormData = init.body instanceof FormData;
  const headers = isFormData
    ? { ...(init.headers ?? {}) }
    : { "Content-Type": "application/json", ...(init.headers ?? {}) };

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      credentials: "include",
      headers,
    });
  } catch {
    // Network-level failure: backend down, offline, DNS, CORS, etc.
    throw new Error("NETWORK_ERROR");
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}