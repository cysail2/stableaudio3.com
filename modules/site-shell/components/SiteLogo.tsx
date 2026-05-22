/**
 * SiteLogo — Stable Audio 3 brand mark, inline SVG (no external file).
 *
 * Concept: "Sonic S" — 7 rounded bars positioned to trace the letter S.
 * Each cluster of bars takes a different mode color:
 *   - Top-left  (T2A)     → violet  #7c3aed
 *   - Middle    (A2A)     → pink    #ec4899
 *   - Bottom    (Inpaint) → amber   #f59e0b
 *
 * Why inline SVG (not /public/logo.webp):
 *   - Crisp at every size (header 40px, favicon 16px, OG card 256px+)
 *   - Color tokens stay in code, no asset round-trip on rebrand
 *   - Single-color variants ("mono") for OG, print, partner decks
 *
 * Variants:
 *   - "color"      → tri-color bars on dark slate-900 square (default)
 *   - "mono-white" → white bars on dark slate-900 square (use on white bg)
 *   - "mono-dark"  → slate-900 bars on transparent (use on light surfaces; print)
 */

import type { CSSProperties } from "react";

export type SiteLogoVariant = "color" | "mono-white" | "mono-dark";

export type SiteLogoProps = {
  size?: number;
  variant?: SiteLogoVariant;
  className?: string;
  title?: string;
  style?: CSSProperties;
};

// 7 bars tracing an S-curve through a 48×48 viewBox
const BAR_LAYOUT = [
  { x: 13, y: 16, h: 12, group: "t2a" },
  { x: 18, y: 11, h: 10, group: "t2a" },
  { x: 23, y: 14, h: 14, group: "a2a" },
  { x: 23, y: 24, h: 10, group: "a2a" },
  { x: 23, y: 30, h: 7, group: "inpaint" },
  { x: 28, y: 27, h: 10, group: "inpaint" },
  { x: 33, y: 22, h: 14, group: "inpaint" },
] as const;

const COLOR_MAP: Record<string, string> = {
  t2a: "#7c3aed", // violet-600
  a2a: "#ec4899", // pink-500
  inpaint: "#f59e0b", // amber-500
};

export function SiteLogo({
  size = 40,
  variant = "color",
  className,
  title = "Stable Audio 3",
  style,
}: SiteLogoProps) {
  const isDarkBg = variant !== "mono-dark";
  const bgFill = isDarkBg ? "#0f172a" : "transparent";

  const barFill = (group: string) => {
    if (variant === "color") return COLOR_MAP[group];
    if (variant === "mono-white") return "#ffffff";
    return "#0f172a"; // mono-dark
  };

  return (
    <svg
      aria-label={title}
      className={className}
      height={size}
      role="img"
      style={style}
      viewBox="0 0 48 48"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <rect fill={bgFill} height="48" rx="11" width="48" />
      {BAR_LAYOUT.map((bar) => (
        <rect
          fill={barFill(bar.group)}
          height={bar.h}
          key={`${bar.x}-${bar.y}`}
          rx="2.5"
          width="5"
          x={bar.x}
          y={bar.y}
        />
      ))}
    </svg>
  );
}
