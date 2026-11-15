"use client";

import { useCallback } from "react";
import { useTheme as useNextTheme } from "next-themes";

type Theme = "light" | "dark";

/**
 * Switch the theme in one step. Many elements carry their own
 * `transition-colors` (300–700ms), so a plain class swap makes the page
 * "ripple" into the new theme at different speeds. Instead:
 *   1. all CSS transitions are paused for the swap, so every element
 *      changes at once;
 *   2. where supported, the View Transitions API crossfades the whole page
 *      between two GPU snapshots (smooth, cheap, no layout work).
 * Browsers without View Transitions, and users who prefer reduced motion,
 * get an instant switch.
 */
function swapThemeClass(next: Theme) {
  const pause = document.createElement("style");
  pause.textContent = "*,*::before,*::after{transition:none!important}";
  document.head.appendChild(pause);

  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(next);
  root.style.colorScheme = next;

  // Force a style recalc while transitions are off, then restore them.
  void window.getComputedStyle(document.body).backgroundColor;
  requestAnimationFrame(() => requestAnimationFrame(() => pause.remove()));
}

export function useTheme() {
  const { resolvedTheme, setTheme } = useNextTheme();
  const theme: Theme = resolvedTheme === "dark" ? "dark" : "light";

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof document.startViewTransition !== "function" || reduceMotion) {
      swapThemeClass(next);
      setTheme(next);
      return;
    }

    document.startViewTransition(() => {
      swapThemeClass(next);
      setTheme(next); // persists the choice; next-themes re-applies the same class
    });
  }, [theme, setTheme]);

  return { theme, toggleTheme };
}
