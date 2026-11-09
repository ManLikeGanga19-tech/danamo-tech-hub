const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  // Check if the body is FormData (e.g., for file uploads like CVs)
  const isFormData = init.body instanceof FormData;

  // If FormData, do NOT set Content-Type. The browser must set it automatically
  // to include the multipart boundary. Otherwise, default to JSON.
  const headers = isFormData
    ? { ...(init.headers ?? {}) }
    : { "Content-Type": "application/json", ...(init.headers ?? {}) };

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}