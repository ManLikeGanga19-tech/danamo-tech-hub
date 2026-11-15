"use client";

import { useEffect, useState } from "react";
import { Handshake } from "lucide-react";
import { apiFetch } from "@/lib/api/client";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
}

// Each half of the track holds at least this many logos, so one half is always
// wider than the widest screen and the loop never shows an empty gap.
const MIN_ITEMS_PER_HALF = 12;
const SECONDS_PER_ITEM = 3.5;

export default function PartnersSlider() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Partner[]>("/partners")
      .then(setPartners)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || partners.length === 0) return null;

  const repeats = Math.max(1, Math.ceil(MIN_ITEMS_PER_HALF / partners.length));
  const half = Array.from({ length: repeats }, () => partners).flat();
  const duration = `${half.length * SECONDS_PER_ITEM}s`;

  return (
    <section className="w-full py-16 bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F] border-y border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-4 md:px-8 mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Handshake className="w-3 h-3" />
          Our Partners
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Trusted by industry leaders
        </h2>
      </div>

      <div className="partners-marquee relative w-full overflow-hidden" role="region" aria-label="Our partners">
        {/*
          Two identical halves; the track moves left by exactly one half, then
          the animation restarts at the identical position, so the loop is
          seamless. Pure CSS transform: GPU-composited, no per-frame JS.
        */}
        <div className="partners-marquee__track flex w-max" style={{ animationDuration: duration }}>
          <LogoGroup partners={half} uniqueCount={partners.length} />
          <LogoGroup partners={half} uniqueCount={partners.length} hidden />
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-gray-50 to-transparent dark:from-[#0e0e15] z-10" />
        <div className="pointer-events-none absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-gray-50 to-transparent dark:from-[#0e0e15] z-10" />
      </div>
    </section>
  );
}

function LogoGroup({ partners, uniqueCount, hidden = false }: { partners: Partner[]; uniqueCount: number; hidden?: boolean }) {
  return (
    // pr-16 matches gap-16 so the spacing across the seam is identical
    <ul className="flex shrink-0 items-center gap-16 pr-16" aria-hidden={hidden || undefined}>
      {partners.map((p, i) => {
        // Only the first copy of each logo is announced and focusable; the
        // repeats exist purely to fill the loop.
        const primary = !hidden && i < uniqueCount;
        return (
          <li key={`${p.id}-${i}`} aria-hidden={primary ? undefined : true}>
            <PartnerLogo partner={p} focusable={primary} />
          </li>
        );
      })}
    </ul>
  );
}

function PartnerLogo({ partner, focusable }: { partner: Partner; focusable: boolean }) {
  const content = (
    // Client logos are mostly dark-on-light artwork, so in dark mode they sit
    // on a soft light chip to stay legible; light mode is unchanged.
    <div className="flex items-center justify-center px-8 h-20 min-w-[140px] dark:bg-gray-100 dark:rounded-xl">
      <img
        src={partner.logo_url}
        alt={partner.name}
        loading="lazy"
        className="max-h-14 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 dark:opacity-80 transition-all duration-300"
        style={{ maxWidth: "160px" }}
      />
    </div>
  );

  if (partner.website_url) {
    return (
      <a
        href={partner.website_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={partner.name}
        tabIndex={focusable ? undefined : -1}
      >
        {content}
      </a>
    );
  }
  return content;
}
