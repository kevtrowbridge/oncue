import { ReactNode } from "react";

/**
 * Plain-language tooltip used throughout OnCue to explain Timeline Intelligence
 * concepts in operational language (no project-management jargon).
 *
 * Uses the native `title` attribute for accessibility + a hover popover for
 * richer in-product explanations.
 */
export function InfoTip({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`group relative inline-flex items-center gap-1 ${className}`}>
      {children}
      <span
        aria-label={label}
        title={label}
        className="grid h-3.5 w-3.5 cursor-help place-items-center rounded-full border border-border text-[9px] leading-none text-muted-foreground hover:border-gold hover:text-gold"
      >
        i
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full z-30 mt-1.5 hidden w-64 rounded-md border border-border bg-popover p-2.5 text-[11px] leading-snug text-popover-foreground shadow-elegant group-hover:block"
      >
        {label}
      </span>
    </span>
  );
}
