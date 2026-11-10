"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useAnimationFrame, useTransform } from "framer-motion";
import { Handshake } from "lucide-react";
import { apiFetch } from "@/lib/api/client";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
}

export default function PartnersSlider() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    apiFetch<Partner[]>("/partners")
      .then(setPartners)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // If no partners, render nothing
  if (loading || partners.length === 0) return null;

  // Duplicate for seamless loop
  const loopItems = [...partners, ...partners];

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

      <div
        className="relative w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <SmoothMarquee partners={loopItems} paused={isHovered} />

        {/* Edge fades */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-gray-50 to-transparent dark:from-[#0e0e15] z-10" />
        <div className="pointer-events-none absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-gray-50 to-transparent dark:from-[#0e0e15] z-10" />
      </div>
    </section>
  );
}

function SmoothMarquee({ partners, paused }: { partners: Partner[]; paused: boolean }) {
  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (v) => `${v}%`);

  useAnimationFrame((t, delta) => {
    if (paused) return;
    // Slow drift: roughly 1.5% per second
    const moveBy = -(delta / 1000) * 1.5;
    let newX = baseX.get() + moveBy;
    if (newX <= -50) newX = 0;
    baseX.set(newX);
  });

  return (
    <div className="overflow-hidden w-full">
      <motion.div className="flex gap-16 items-center w-max px-8" style={{ x, willChange: "transform" }}>
        {partners.map((p, i) => (
          <PartnerLogo key={`${p.id}-${i}`} partner={p} />
        ))}
      </motion.div>
    </div>
  );
}

function PartnerLogo({ partner }: { partner: Partner }) {
  const content = (
    <div className="flex items-center justify-center px-8 h-20 min-w-[140px]">
      <img
        src={partner.logo_url}
        alt={partner.name}
        className="max-h-14 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 dark:invert-0"
        style={{ maxWidth: "160px" }}
      />
    </div>
  );

  if (partner.website_url) {
    return (
      <a href={partner.website_url} target="_blank" rel="noopener noreferrer" aria-label={partner.name}>
        {content}
      </a>
    );
  }
  return content;
}