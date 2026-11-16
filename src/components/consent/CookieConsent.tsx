"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  OPEN_PREFERENCES_EVENT,
  readConsent,
  saveConsent,
  subscribeConsent,
  type ConsentState,
} from "@/lib/consent";

const UNKNOWN = "unknown" as const; // server render / before hydration

const CATEGORIES = [
  {
    key: "necessary" as const,
    title: "Strictly necessary",
    text: "Keep you signed in and protect your account. Always on: the site can't work without them.",
    locked: true,
  },
  {
    key: "analytics" as const,
    title: "Analytics",
    text: "Help us understand how the site is used (for example Google Analytics), so we can improve it. No ads, no selling of data.",
    locked: false,
  },
  {
    key: "marketing" as const,
    title: "Marketing",
    text: "Measure our campaigns and, where used, show relevant ads on other sites.",
    locked: false,
  },
];

const btnBase =
  "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#1E1E2F]";
// "Reject all" and "Accept all" deliberately share the same visual weight.
const btnPrimary = `${btnBase} bg-blue-600 text-white hover:bg-blue-700`;
const btnSecondary = `${btnBase} border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800`;

export default function CookieConsent() {
  const consent = useSyncExternalStore<ConsentState | null | typeof UNKNOWN>(
    subscribeConsent,
    readConsent,
    () => UNKNOWN,
  );
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [draft, setDraft] = useState({ analytics: false, marketing: false });

  const openPreferences = () => {
    const current = readConsent();
    setDraft({ analytics: current?.analytics ?? false, marketing: current?.marketing ?? false });
    setPrefsOpen(true);
  };

  // Footer "Cookie Preferences" link reopens the dialog at any time.
  useEffect(() => {
    const onOpen = () => openPreferences();
    window.addEventListener(OPEN_PREFERENCES_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, onOpen);
  }, []);

  const decide = (choice: { analytics: boolean; marketing: boolean }) => {
    saveConsent(choice);
    setPrefsOpen(false);
  };

  const showBanner = consent === null && !prefsOpen;

  return (
    <>
      {showBanner && (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-[90] p-4 sm:p-6 pointer-events-none"
        >
          <div className="pointer-events-auto mx-auto max-w-4xl rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-[#1E1E2F]/95 backdrop-blur shadow-2xl p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <div className="flex gap-4 flex-1">
                <div className="hidden sm:flex shrink-0 w-11 h-11 rounded-full bg-blue-50 dark:bg-blue-500/10 items-center justify-center">
                  <Cookie className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">We value your privacy</h2>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    We use necessary cookies to run this site. With your permission we&apos;d also use analytics and
                    marketing cookies to understand how the site is used and improve it. You can change your choice
                    at any time. See our{" "}
                    <Link href="/cookies" className="font-semibold text-blue-600 dark:text-blue-400 underline underline-offset-2">
                      Cookies Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 shrink-0">
                <button type="button" className={btnSecondary} onClick={openPreferences}>
                  Customize
                </button>
                <button type="button" className={btnSecondary} onClick={() => decide({ analytics: false, marketing: false })}>
                  Reject all
                </button>
                <button type="button" className={btnPrimary} onClick={() => decide({ analytics: true, marketing: true })}>
                  Accept all
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={prefsOpen} onOpenChange={setPrefsOpen}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-[#1E1E2F] rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-900 dark:text-white">Cookie preferences</DialogTitle>
            <DialogDescription className="text-gray-700 dark:text-gray-300">
              Choose which cookies we may use. Your choice applies to this browser and you can change it any time from
              &quot;Cookie Preferences&quot; in the footer.
            </DialogDescription>
          </DialogHeader>

          <ul className="space-y-3">
            {CATEGORIES.map((c) => {
              const checked = c.locked ? true : draft[c.key as "analytics" | "marketing"];
              const id = `consent-${c.key}`;
              return (
                <li key={c.key} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <label htmlFor={id} className="font-semibold text-gray-900 dark:text-white">
                        {c.title}
                      </label>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{c.text}</p>
                    </div>
                    <button
                      id={id}
                      type="button"
                      role="switch"
                      aria-checked={checked}
                      disabled={c.locked}
                      onClick={() =>
                        !c.locked &&
                        setDraft((d) => ({ ...d, [c.key]: !d[c.key as "analytics" | "marketing"] }))
                      }
                      className={`relative mt-1 inline-flex h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                      } ${c.locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <span className="sr-only">{c.locked ? "Always on" : checked ? "On" : "Off"}</span>
                      <span
                        aria-hidden="true"
                        className={`inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform ${
                          checked ? "translate-x-[22px]" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2">
            <button type="button" className={btnSecondary} onClick={() => decide({ analytics: false, marketing: false })}>
              Reject all
            </button>
            <button type="button" className={btnSecondary} onClick={() => decide(draft)}>
              Save choices
            </button>
            <button type="button" className={btnPrimary} onClick={() => decide({ analytics: true, marketing: true })}>
              Accept all
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
