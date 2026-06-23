import { TERMS } from "@/lib/oncue-data";
import type { TimelineHealth } from "@/lib/oncue-data";
import { InfoTip } from "./InfoTip";

interface Props {
  health: TimelineHealth;
}

/**
 * Timeline Health card.
 *
 * Replaces vague indicators with the four things an operator actually wants:
 *   • Score
 *   • Protected Anchors
 *   • Issues
 *   • Recommended Adjustments
 *
 * ⚠️ DEMO ONLY: `health` is computed by frontend mock heuristics in
 * `@/lib/oncue-data`. The card itself is presentation-only and should be
 * wired to real solver output once available.
 */
export function HealthCard({ health }: Props) {
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
      <div className="mb-3 flex items-center justify-between">
        <InfoTip label={TERMS["Timeline Health"]}>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Timeline Health
          </span>
        </InfoTip>
        <span className={`text-xs font-semibold ${tone}`}>{ratingLabel}</span>
      </div>

      <div className="flex items-baseline gap-2">
        <div className={`font-display text-5xl ${tone}`}>{health.score}%</div>
        <InfoTip label={TERMS["Timeline Health Score"]}>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </InfoTip>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{health.ratingReason}</p>

      <div className="mt-5 grid gap-4 border-t border-border/60 pt-4 md:grid-cols-3">
        {/* Protected anchors */}
        <div>
          <div className="mb-2 text-[10px] uppercase tracking-widest text-gold">
            <InfoTip label="Protected Anchors are Fixed-Timing activities that OnCue is actively safeguarding from upstream delays.">
              Protected
            </InfoTip>
          </div>
          {health.protectedAnchors.length === 0 && (
            <p className="text-xs text-muted-foreground">No anchors defined.</p>
          )}
          <ul className="space-y-1.5 text-sm">
            {health.protectedAnchors.map((a) => (
              <li key={a.id} className="flex items-center gap-2">
                <span className="text-[color:var(--on-track)]">✓</span>
                <span className="text-foreground">{a.title}</span>
                <span className="ml-auto text-xs text-muted-foreground">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Issues */}
        <div>
          <div className="mb-2 text-[10px] uppercase tracking-widest text-gold">
            <InfoTip label="Activities OnCue thinks you should look at — delayed, low confidence, or sitting in a tight handoff.">
              Issues
            </InfoTip>
          </div>
          {health.attention.length === 0 && (
            <p className="text-xs text-muted-foreground">Nothing needs attention.</p>
          )}
          <ul className="space-y-1.5 text-sm">
            {health.attention.slice(0, 3).map((a) => (
              <li key={a.id}>
                <div className="text-foreground">{a.title}</div>
                <div className="text-[11px] text-muted-foreground">{a.reason}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div>
          <div className="mb-2 text-[10px] uppercase tracking-widest text-gold">
            Recommended
          </div>
          {health.recommendations.length === 0 && (
            <p className="text-xs text-muted-foreground">No adjustments recommended.</p>
          )}
          <ul className="space-y-1.5 text-sm">
            {health.recommendations.map((r) => (
              <li key={r.id}>
                <div className="text-foreground">{r.label}</div>
                <div className="text-[11px] text-muted-foreground">{r.rationale}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
