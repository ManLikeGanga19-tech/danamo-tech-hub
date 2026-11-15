"use client";

import { useEffect, useSyncExternalStore } from "react";
import Script from "next/script";
import { readConsent, subscribeConsent } from "@/lib/consent";

/**
 * Google Analytics 4 with Consent Mode v2.
 *
 * - Does nothing unless NEXT_PUBLIC_GA_ID is set at build time.
 * - The gtag library is only downloaded after the visitor allows analytics,
 *   so nothing reaches Google before consent.
 * - Consent defaults to "denied"; choices are pushed with consent "update",
 *   and withdrawing analytics consent deletes the _ga cookies.
 */
// Only a well-formed GA4 measurement ID is accepted (it is inlined into a script).
const RAW_GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
const GA_ID = /^G-[A-Z0-9]{4,20}$/.test(RAW_GA_ID) ? RAW_GA_ID : "";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

function consentSignals(analytics: boolean, marketing: boolean) {
  const v = (on: boolean) => (on ? "granted" : "denied");
  return {
    analytics_storage: v(analytics),
    ad_storage: v(marketing),
    ad_user_data: v(marketing),
    ad_personalization: v(marketing),
  };
}

function clearGaCookies() {
  const domains = ["", `; domain=${location.hostname}`, `; domain=.${location.hostname.replace(/^www\./, "")}`];
  for (const name of document.cookie.split(";").map((c) => c.split("=")[0].trim())) {
    if (name === "_ga" || name.startsWith("_ga_") || name === "_gid") {
      for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d}`;
    }
  }
}

export default function GoogleAnalytics() {
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => null);
  const analytics = consent?.analytics ?? false;
  const marketing = consent?.marketing ?? false;

  // Push changes to an already-loaded gtag (e.g. consent withdrawn later).
  useEffect(() => {
    if (!GA_ID || typeof window.gtag !== "function") return;
    window.gtag("consent", "update", consentSignals(analytics, marketing));
    if (!analytics) clearGaCookies();
  }, [analytics, marketing]);

  if (!GA_ID || !analytics) return null;

  const defaults = JSON.stringify(consentSignals(false, false));
  const granted = JSON.stringify(consentSignals(analytics, marketing));

  return (
    <>
      <Script id="ga-consent" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', ${defaults});
gtag('consent', 'update', ${granted});
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    </>
  );
}
