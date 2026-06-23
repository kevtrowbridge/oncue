import type { ReactNode } from "react";

interface LogoProps {
  size?: number;
  variant?: "blush" | "obsidian" | "alabaster";
}

/**
 * OnCue primary logo: blush circle, thin champagne-gold ring, gold OC monogram.
 * Locked brand mark — do not redesign proportions or stroke weight.
 */
export function Logo({ size = 40, variant = "blush" }: LogoProps) {
  const bg =
    variant === "obsidian"
      ? "var(--obsidian)"
      : variant === "alabaster"
        ? "var(--alabaster)"
        : "var(--blush)";
  const ringColor = "var(--gold)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="OnCue"
      style={{ display: "block" }}
    >
      <circle cx="50" cy="50" r="48" fill={bg} />
      <circle cx="50" cy="50" r="46" fill="none" stroke={ringColor} strokeWidth="1.4" />
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fontFamily="Playfair Display, serif"
        fontSize="44"
        fontStyle="italic"
        fontWeight="500"
        fill={ringColor}
        letterSpacing="-2"
      >
        OC<tspan dx="-2">.</tspan>
      </text>
    </svg>
  );
}

export function Wordmark({ tagline = true, children }: { tagline?: boolean; children?: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <Logo size={48} />
      <div className="hidden h-10 w-px bg-gold/60 sm:block" />
      <div className="leading-tight">
        <div className="font-display text-2xl tracking-tight text-gold">OnCue.</div>
        {tagline && (
          <div className="font-display text-xs italic text-gold/80">Timeline Intelligence.</div>
        )}
        {children}
      </div>
    </div>
  );
}
