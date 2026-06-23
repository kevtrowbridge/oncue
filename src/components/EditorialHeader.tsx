import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Logo } from "./brand/Logo";

interface Props {
  children?: ReactNode;
  rightSlot?: ReactNode;
  compact?: boolean;
}

/**
 * Editorial cream header band. Used on desktop and as the compact muted
 * cream strip on mobile screens to anchor brand presence without competing
 * with the operational dark workspace.
 */
export function EditorialHeader({ children, rightSlot, compact = false }: Props) {
  return (
    <header
      className={`editorial-header w-full border-b border-gold/30 ${
        compact ? "px-4 py-3" : "px-6 py-5 md:px-10 md:py-6"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 md:gap-4">
          <Logo size={compact ? 36 : 52} />
          {!compact && (
            <>
              <div className="hidden h-12 w-px bg-gold/40 md:block" />
              <div className="leading-tight">
                <div className="font-display text-2xl tracking-tight text-[color:var(--obsidian)] md:text-3xl">
                  OnCue<span className="text-gold">.</span>
                </div>
                <div className="font-display text-[11px] italic text-[color:var(--obsidian)]/70 md:text-xs">
                  Timeline Intelligence.
                </div>
              </div>
            </>
          )}
          {compact && (
            <div className="font-display text-lg text-[color:var(--obsidian)]">
              OnCue<span className="text-gold">.</span>
            </div>
          )}
        </Link>
        {children && (
          <div className="hidden flex-1 items-center justify-center text-center md:flex">
            {children}
          </div>
        )}
        {rightSlot && <div className="flex items-center gap-3">{rightSlot}</div>}
      </div>
    </header>
  );
}
