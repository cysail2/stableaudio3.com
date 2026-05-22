import Link from "next/link";
import type { ReactNode } from "react";

/**
 * TryPromptLink — "Try this prompt" CTA that jumps to the generator with
 * the prompt + mode prefilled via URL params.
 *
 * Used in two scenarios:
 * - On the prompt guide page (/how-to-use-stable-audio-3) — cross-page jump
 *   to /stable-audio-3, generator reads ?prompt=... on mount.
 * - On the generator page itself (/stable-audio-3) under each mode's example —
 *   same-page jump, generator listens for searchParams change via useEffect
 *   and refills the form. Adds #generator anchor so the page scrolls to top.
 *
 * Per-mode accent: violet (T2A), pink (A2A), amber (Inpaint) — matches the
 * three-color strategy used across the site.
 */

export type TryPromptMode = "text-to-audio" | "audio-to-audio" | "audio-inpaint";

const ACCENT: Record<TryPromptMode, { ring: string; bg: string; text: string; hover: string }> = {
  "text-to-audio": {
    ring: "border-violet-200",
    bg: "bg-white",
    text: "text-violet-700",
    hover: "hover:border-violet-500 hover:bg-violet-600 hover:text-white",
  },
  "audio-to-audio": {
    ring: "border-pink-200",
    bg: "bg-white",
    text: "text-pink-700",
    hover: "hover:border-pink-500 hover:bg-pink-600 hover:text-white",
  },
  "audio-inpaint": {
    ring: "border-amber-200",
    bg: "bg-white",
    text: "text-amber-700",
    hover: "hover:border-amber-500 hover:bg-amber-600 hover:text-white",
  },
};

export function TryPromptLink({
  prompt,
  mode = "text-to-audio",
  tags,
  label = "Try this prompt",
  className = "",
  children,
}: {
  prompt: string;
  mode?: TryPromptMode;
  tags?: string;
  label?: string;
  className?: string;
  children?: ReactNode;
}) {
  const params = new URLSearchParams();
  params.set("mode", mode);
  params.set("prompt", prompt);
  if (tags) params.set("tags", tags);
  // #generator anchor lives on the tool hero shell — page scrolls to it on
  // navigation so the user lands on the form, not at whatever section they
  // clicked from. Cross-page nav already lands at top so the anchor is a no-op.
  const href = `/stable-audio-3?${params.toString()}#generator`;
  const accent = ACCENT[mode];

  return (
    <Link
      className={`inline-flex items-center gap-1.5 rounded-full border ${accent.ring} ${accent.bg} px-3.5 py-1.5 text-xs font-semibold ${accent.text} transition ${accent.hover} ${className}`}
      href={href}
    >
      {children ?? label}
      <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}
