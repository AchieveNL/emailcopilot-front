// /lib/api/hooks.ts
import { useState, useEffect } from "react";
import api from "./api";
export function useApi() {
    return api;
}

// ─── Responsive rows-per-page ─────────────────────────────────────────────
// - Mobile (<lg, card layout): capped at mobileMax (default 10) — cards are
//   tall, so a full desktop page would mean endless scrolling on a phone.
// - Desktop at 1080p and below: base (default 20).
// - Taller desktop viewports: one extra row per ROW_HEIGHT_PX of additional
//   height, so big monitors show more rows instead of whitespace.
// Capped at MAX_PER_PAGE for sanity.
const ROW_HEIGHT_PX = 70;
const REFERENCE_HEIGHT_PX = 1080;
const MAX_PER_PAGE = 50;
const MOBILE_BREAKPOINT_PX = 1024; // Tailwind lg

export function getRowsPerPage(
  viewportWidth: number,
  viewportHeight: number,
  base: number,
  mobileMax = 10,
): number {
  if (viewportWidth < MOBILE_BREAKPOINT_PX) return Math.min(base, mobileMax);
  if (viewportHeight <= REFERENCE_HEIGHT_PX) return base;
  const extra = Math.floor((viewportHeight - REFERENCE_HEIGHT_PX) / ROW_HEIGHT_PX);
  return Math.min(MAX_PER_PAGE, base + extra);
}

export function useRowsPerPage(base = 20, mobileMax = 10): number {
  const [perPage, setPerPage] = useState<number>(() =>
    typeof window === "undefined"
      ? base
      : getRowsPerPage(window.innerWidth, window.innerHeight, base, mobileMax),
  );

  useEffect(() => {
    const update = () =>
      setPerPage(getRowsPerPage(window.innerWidth, window.innerHeight, base, mobileMax));
    update();
    let t: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(update, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, [base, mobileMax]);

  return perPage;
}
