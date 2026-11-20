"use client";

import { openCookiePreferences } from "@/lib/consent";

/** The only interactive part of the footer, so the footer itself can render on the server. */
export default function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookiePreferences} className={className}>
      Cookie Preferences
    </button>
  );
}
