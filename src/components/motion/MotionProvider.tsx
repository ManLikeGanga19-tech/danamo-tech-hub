"use client";

import type { ReactNode } from "react";
import { LazyMotion } from "framer-motion";

const loadFeatures = () => import("./features").then((mod) => mod.default);

/**
 * framer-motion with its animation features loaded after first paint.
 * Use `m.div` (not `motion.div`) inside: `strict` makes a stray `motion.*`
 * throw in development, since it would pull the full bundle back in.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
