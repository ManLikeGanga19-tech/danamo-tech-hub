/**
 * Turn an error thrown by apiFetch/adminFetch ("API 400: {"detail":"..."}")
 * into a message that is safe and readable to show to users.
 */
export function errorMessage(err: unknown, fallback: string): string {
  if (!(err instanceof Error) || !err.message) return fallback;
  const match = err.message.match(/^API (\d{3}): ([\s\S]*)$/);
  if (!match) return err.message === "NETWORK_ERROR" ? "Network error. Please try again." : err.message;

  const [, status, body] = match;
  if (status === "429") return "Too many requests. Please wait a minute and try again.";
  try {
    const detail = JSON.parse(body)?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && typeof detail[0]?.msg === "string") return detail[0].msg;
  } catch {
    // body was not JSON
  }
  return fallback;
}
