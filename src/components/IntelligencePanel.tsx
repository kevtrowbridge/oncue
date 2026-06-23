import { useState } from "react";
// PHASE 2 TODO: update this import to the canonical data-interfaces.ts path once
// the app scaffold is wired up. The EFM StatusExplanation shape used here is
// richer than the current canonical definition — see notes below.
//
// EFM StatusExplanation fields used by this component:
//   explanation.status         — string kebab-case (e.g. "on-track", "at-risk")
//   explanation.statusLabel    — string
//   explanation.why            — string
//   explanation.impact         — string
//   explanation.affected       — Array<{ id, title, newTime, note }> (richer than canonical affectedActivityIds)
//   explanation.recommendation — { label, rationale } (richer than canonical recommendedAction: string)
//   explanation.estimatedDelayMin  — number (canonical uses estimatedDelayMinutes)
//   explanation.pushesFixedActivity — boolean
//
// When Phase 2 wires data, either update this component to use the canonical
// StatusExplanation shape from data-interfaces.ts, or update data-interfaces.ts
// to match this richer shape. Do not silently leave the mismatch.
import type { StatusExplanation } from "@/lib/oncue-data";

const TONE: Record<
  string,
  { ring: string; chip: string; bar: string; label: string }
> = {
  "needs-adjustment": {
    ring: "border-[color:var(--shifting)]/40",
    chip: "text-[color:var(--shifting)] border-[color:var(--shifting)]/40 bg-[color:var(--shifting)]/10",
    bar: "bg-[color:var(--shifting)]/5",
    label: "Needs Adjustment",
  },
  delayed: {
    ring: "border-[color:var(--shifting)]/50",
    chip: "text-[color:var(--shifting)] border-[color:var(--shifting)]/50 bg-[color:var(--shifting)]/10",
    bar: "bg-[color:var(--shifting)]/5",
    label: "Delayed",
  },
  recalculating: {
    ring: "border-blush/40",
    chip: "text-blush border-blush/50 bg-blush/10",
    bar: "bg-blush/5",
    label: "Recalculating",
  },
  conflict: {
    ring: "border-destructive/40",
    chip: "text-destructive border-destructive/50 bg-destructive/10",
    bar: "bg-destructive/5",
    label: "Conflict",
  },
  "at-risk": {
    ring: "border-destructive/50",
    chip: "text-destructive border-destructive/50 bg-destructive/10",
    bar: "bg-destructive/5",
    label: "At Risk",
  },
  "on-track": {
    ring: "border-border",
    chip: "text-[color:var(--on-track)] border-border bg-secondary/40",
    bar: "bg-secondary/30",
    label: "On Track",
  },
  complete: {
    ring: "border-border",
    chip: "text-muted-foreground border-border bg-secondary/40",
    bar: "bg-secondary/30",
    label: "Complete",
  },
};

interface Props {
  title: string;
  explanation: StatusExplanation;
  defaultOpen?: boolean;
  compact?: boolean;
}

/**
 * The single Intelligence Panel used everywhere a status appears.
 * Renders WHY / IMPACT / AFFECTED / RECOMMENDATION in plain language.
 *
 * ⚠️ DEMO ONLY: the `explanation` prop comes from frontend mock heuristics in
 * `@/lib/oncue-data`. This component is pure presentation and should render
 * real solver output once the backend engine exists.
 */
export function IntelligencePanel({ title, explanation, defaultOpen = false, compact = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const tone = TONE[explanation.status] ?? TONE["on-track"];
  const muted = explanation.status === "on-track" || explanation.status === "complete";

  return (
    <div className={`rounded-xl border ${tone.ring} ${tone.bar} overflow-hidden`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-secondary/40"
        aria-expanded={open}

      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wider ${tone.chip}`}
            >
              {explanation.statusLabel.toUpperCase()}
            </span>
            <span className="truncate text-sm text-foreground">{title}</span>
            {explanation.estimatedDelayMin > 0 && (
              <span className="text-[11px] text-muted-foreground">
                ({explanation.estimatedDelayMin}m)
              </span>
            )}
          </div>
          {!open && !muted && (
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{explanation.why}</p>
          )}
        </div>
        <span className="shrink-0 rounded-md border border-border px-2 py-0.5 text-xs text-foreground">{open ? "Hide" : "View Details"}</span>
      </button>

      {open && (
        <div className={`grid gap-3 border-t border-border/60 px-4 py-3 ${compact ? "" : "md:grid-cols-2"}`}>
          <Section heading="Why">
            <p className="text-sm text-foreground">{explanation.why}</p>
          </Section>
          <Section heading="Impact">
            <p className="text-sm text-foreground">{explanation.impact}</p>
            {explanation.pushesFixedActivity && (
              <p className="mt-1 text-xs text-destructive">
                Will push a Fixed-Timing activity. Resolve before it propagates.
              </p>
            )}
          </Section>
          <Section heading="Affected Activities">
            {explanation.affected.length === 0 ? (
              <p className="text-sm text-muted-foreground">None — buffer absorbs the change.</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {explanation.affected.map((x) => (
                  <li key={x.id} className="flex items-baseline justify-between gap-2">
                    <span className="text-foreground">{x.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{x.newTime} · {x.note}</span>
                  </li>
                ))}
              </ul>
            )}
          </Section>
          <Section heading="Recommended Action">
            {explanation.recommendation ? (
              <div>
                <div className="text-sm text-foreground">{explanation.recommendation.label}</div>
                <div className="text-xs text-muted-foreground">{explanation.recommendation.rationale}</div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No action required.</p>
            )}
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[10px] uppercase tracking-widest text-gold">{heading}</div>
      {children}
    </div>
  );
}
