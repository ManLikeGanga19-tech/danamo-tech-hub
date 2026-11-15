/**
 * Cookie consent state (Kenya Data Protection Act 2019, s.32; ODPC 2024
 * guidance). Non-essential categories are OFF until the visitor opts in.
 *
 * The choice is stored in localStorage with a version and timestamp so it can
 * be shown as a record of consent, and so we can ask again if the categories
 * change (bump CONSENT_VERSION).
 */

export type ConsentCategory = "analytics" | "marketing";

export type ConsentState = {
  version: number;
  analytics: boolean;
  marketing: boolean;
  /** ISO timestamp of the visitor's decision */
  decidedAt: string;
};

export const CONSENT_VERSION = 1;
const STORAGE_KEY = "danamo-cookie-consent";
const CHANGE_EVENT = "danamo:consent-change";
export const OPEN_PREFERENCES_EVENT = "danamo:open-cookie-preferences";

let cachedRaw: string | null | undefined;
let cachedValue: ConsentState | null = null;

function parse(raw: string | null): ConsentState | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as ConsentState;
    return v && v.version === CONSENT_VERSION ? v : null;
  } catch {
    return null;
  }
}

/** Current decision, or null when the visitor hasn't decided yet. */
export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // storage blocked: treat as undecided (nothing non-essential runs)
  }
  // Stable reference for useSyncExternalStore while nothing changed.
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = parse(raw);
  }
  return cachedValue;
}

export function saveConsent(choice: Pick<ConsentState, ConsentCategory>): void {
  const state: ConsentState = {
    version: CONSENT_VERSION,
    analytics: choice.analytics,
    marketing: choice.marketing,
    decidedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable — the choice still applies for this page view
    cachedRaw = JSON.stringify(state);
    cachedValue = state;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeConsent(onChange: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** Ask the banner to reopen the preferences dialog (e.g. from the footer). */
export function openCookiePreferences(): void {
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}
