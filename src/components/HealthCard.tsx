import { TERMS } from "@/lib/oncue-data";
import type { TimelineHealth } from "@/lib/oncue-data";
import { InfoTip } from "./InfoTip";

interface Props {
  health: TimelineHealth;
  /** Optional: called when the user clicks an issue item in this card. */
  onSelectActivity?: (id: string) => void;
}

/**
 * Timeline Health card.
 *
 * Shows score, issues (actionable — click to select), protected anchors,
 * and recommended adjustments in a stacked vertical layout that doesn't
 * overflow in the 380px right rail.
 *
 * ⚠️ DEMO ONLY: `health` is computed by frontend mock heuristics in
 * `@/lib/oncue-data`. Wire to real solver output in Phase 4.
 */
export function HealthCard({ health, onSelectActivity }: Props) {
  const tone =
    health.rating === "good"
      ? "text-[color:var(--on-track)]"
      : health.rating === "watch"
        ? "status-shifting"
        : "text-destructive";
  const ratingLabel =
    health.rating === "good"
      ? "HEALTHY"
      : health.rating === "watch"
        ? "NEEDS ATTENTION"
        : "AT RISK";

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <InfoTip label={TERMS["Timeline Health"]}>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Timeline Health
          </span>
        </InfoTip>
        <span className={`text-xs font-semibold ${tone}`}>{ratingLabel}</span>
      </div>

      {/* Score */}
      <div className="flex items-baseline gap-2">
        <div className={`font-display text-5xl ${tone}`}>{health.score}%</div>
        <InfoTip label={TERMS["Timeline Health Score"]}>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </InfoTip>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{health.ratingReason}</p>

      <div className="mt-5 space-y-5 border-t border-border/60 pt-4">
        {/* Issues — shown first; clickable to select the activity */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <InfoTip label="Activities OnCue thinks you should look at — delayed, low confidence, or sitting in a tight handoff.">
              <span className={`text-[10px] uppercase tracking-widest ${health.attention.length > 0 ? "status-shifting" : "text-gold"}`}>
                Issues
              </span>
            </InfoTip>
            {health.attention.length > 0 && (
              <span className="text-[10px] status-shifting font-medium">
                {health.attention.length} need attention
              </span>
            )}
          </div>
          {health.attention.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nothing needs attention.</p>
          ) : (
            <ul className="space-y-1">
              {health.attention.slice(0, 4).map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => onSelectActivity?.(a.id)}
                    className="w-full rounded-md px-2 py-1.5 text-left transition-colors hover:bg-secondary/50"
                    title="Click to inspect this issue"
                  >
                    <div className="truncate text-sm text-foreground">{a.title}</div>
                    <div className="truncate text-[11px] text-muted-foreground">{a.reason}</div>
                  </button>
                </li>
              ))}
              {health.attention.length > 4 && (
                <li className="px-2 text-[11px] text-muted-foreground">
                  +{health.attention.length - 4} more — scroll to Issues below
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Protected anchors */}
        <div>
          <div className="mb-2 text-[10px] uppercase tracking-widest text-gold">
            <InfoTip label="Protected Anchors are Fixed-Timing activities that OnCue is actively safeguarding from upstream delays.">
              Protected
            </InfoTip>
          </div>
          {health.protectedAnchors.length === 0 ? (
            <p className="text-xs text-muted-foreground">No anchors defined.</p>
          ) : (
            <ul className="space-y-1.5">
              {health.protectedAnchors.map((a) => (
                <li key={a.id} className="flex items-center gap-2 text-sm">
                  <span className="shrink-0 text-[color:var(--on-track)]">✓</span>
                  <span className="min-w-0 flex-1 truncate text-foreground">{a.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{a.time}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recommendations */}
        {health.recommendations.length > 0 && (
          <div>
            <div className="mb-2 text-[10px] uppercase tracking-widest text-gold">Recommended</div>
            <ul className="space-y-1.5">
              {health.recommendations.map((r) => (
                <li key={r.id}>
                  <div className="text-sm text-foreground">{r.label}</div>
                  <div className="text-[11px] text-muted-foreground">{r.rationale}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
