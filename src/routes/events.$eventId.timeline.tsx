import { createFileRoute, useParams, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";

import {
  getActivities,
  getActivity,
  computeHealth,
  explainStatus,
  fmtDate,
  fmtTime,
  getEvent,
  STATUS_LABEL,
  TERMS,
} from "@/lib/oncue-data";
import { InfoTip } from "@/components/InfoTip";
import { HealthCard } from "@/components/HealthCard";
import { IntelligencePanel } from "@/components/IntelligencePanel";

export const Route = createFileRoute("/events/$eventId/timeline")({
  component: TimelinePage,
});

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);

const NEEDS_PANEL = new Set([
  "needs-adjustment",
  "delayed",
  "recalculating",
  "conflict",
  "at-risk",
]);

function TimelinePage() {
  const { eventId } = useParams({ from: "/events/$eventId" });
  const navigate = useNavigate();
  const evt = getEvent(eventId)!;
  const acts = getActivities(eventId);
  // ⚠️ DEMO ONLY: health and explanations come from frontend mock heuristics.
  const health = computeHealth(eventId);

  const firstAttentionId = health.attention[0]?.id ?? acts[3]?.id ?? acts[0]?.id;
  const [selectedId, setSelectedId] = useState<string>(firstAttentionId);
  const selected = getActivity(selectedId)!;
  const explanation = useMemo(() => explainStatus(eventId, selectedId), [eventId, selectedId]);

  // Ref to scroll to the full intelligence strip when user clicks "See all issues"
  const issuesStripRef = useRef<HTMLElement>(null);

  const dayStart = new Date(`${evt.date}T${String(HOURS[0]).padStart(2, "0")}:00:00.000Z`);
  const attentionCount = health.attention.length;

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-8">
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground"
            aria-label="Previous day"
          >
            ‹
          </button>
          <div className="font-display text-base text-foreground">
            {fmtDate(evt.date, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
          </div>
          <button
            className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground"
            aria-label="Next day"
          >
            ›
          </button>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Legend swatch="bg-gradient-gold" label={<InfoTip label={TERMS["Fixed Timing"]}>Fixed Timing</InfoTip>} />
          <Legend swatch="bg-[color:var(--shifting)]" label={<InfoTip label={TERMS["Needs Adjustment"]}>Needs Adjustment</InfoTip>} />
          <Legend swatch="bg-[color:oklch(0.4_0.02_260)]" label="On Track" />
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md bg-gradient-gold px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-gold">
            + Add Activity
          </button>
        </div>
      </div>

      {/* Attention alert — above the main grid so it's always above the fold */}
      {attentionCount > 0 && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-[color:var(--shifting)]/40 bg-[color:var(--shifting)]/8 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[color:var(--shifting)]" />
            <p className="text-sm text-foreground">
              <span className="font-medium status-shifting">{attentionCount} {attentionCount === 1 ? "issue" : "issues"} need attention</span>
              {" "}— click any activity in the Issues list or{" "}
              <button
                type="button"
                onClick={() => issuesStripRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="text-gold underline-offset-2 hover:underline"
              >
                see all issues below
              </button>
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {health.attention.slice(0, 3).map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelectedId(a.id)}
                className={`rounded-full border border-[color:var(--shifting)]/40 px-2.5 py-1 text-[11px] text-foreground transition hover:bg-secondary/60 ${
                  selectedId === a.id ? "bg-[color:var(--shifting)]/15 font-medium" : ""
                }`}
              >
                {a.title}
              </button>
            ))}
            {attentionCount > 3 && (
              <span className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                +{attentionCount - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        {/* Gantt */}
        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="sticky top-0 z-10 grid grid-cols-[260px_160px_1fr] border-b border-border bg-card/95 backdrop-blur">
            <div className="px-4 py-3 text-[10px] uppercase tracking-widest text-muted-foreground">Activity</div>
            <div className="px-2 py-3 text-[10px] uppercase tracking-widest text-muted-foreground">Status</div>
            <div className="relative h-10">
              {HOURS.map((h, i) => (
                <div
                  key={h}
                  className="absolute top-0 h-full border-l border-border/60 pl-2 pt-2 text-[10px] uppercase tracking-widest text-muted-foreground"
                  style={{ left: `${(i / HOURS.length) * 100}%`, width: `${100 / HOURS.length}%` }}
                >
                  {h <= 12 ? `${h} AM` : `${h - 12} PM`}
                </div>
              ))}
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {acts.map((a) => {
              const start = new Date(a.start);
              const minsFromStart = (start.getTime() - dayStart.getTime()) / 60000;
              const totalMins = HOURS.length * 60;
              const leftPct = (minsFromStart / totalMins) * 100;
              const widthPct = (a.duration / totalMins) * 100;
              const isSelected = a.id === selectedId;
              const time = fmtTime(a.start);

              const isAttention = NEEDS_PANEL.has(a.status);
              const statusLabel =
                a.status === "complete"
                  ? "DONE"
                  : a.isAnchor
                    ? "FIXED TIMING"
                    : isAttention
                      ? STATUS_LABEL[a.status].toUpperCase()
                      : a.isOptional
                        ? "OPTIONAL"
                        : "ON TRACK";
              const statusClass =
                a.status === "complete"
                  ? "status-on-track"
                  : a.isAnchor
                    ? "status-anchor"
                    : isAttention
                      ? "status-shifting"
                      : a.isOptional
                        ? "status-optional"
                        : "status-on-track";
              const barClass =
                a.isAnchor
                  ? "bar-anchor"
                  : isAttention
                    ? "bar-shifting"
                    : a.isOptional
                      ? "bar-optional"
                      : "bar-on-track";

              return (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => setSelectedId(a.id)}
                  onDoubleClick={() =>
                    navigate({
                      to: "/events/$eventId/activities/$activityId",
                      params: { eventId, activityId: a.id },
                    })
                  }
                  title="Click to preview · Double-click to open & edit"
                  className={`grid w-full grid-cols-[260px_160px_1fr] items-center border-b border-border/40 text-left transition hover:bg-secondary/40 ${
                    isSelected ? "bg-secondary/60" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 px-4 py-2.5">
                    <span
                      className={`inline-block h-2 w-2 shrink-0 rounded-full ${
                        a.isAnchor
                          ? "bg-gold"
                          : isAttention
                            ? "bg-[color:var(--shifting)]"
                            : "bg-[color:var(--on-track)]"
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="text-[11px] text-muted-foreground">
                        {time} · {a.duration}m
                      </div>
                      <div className="truncate text-sm text-foreground">{a.title}</div>
                      <div className="truncate text-[11px] text-muted-foreground">{a.location}</div>
                    </div>
                  </div>
                  <div className="px-2 py-2.5">
                    <div className={`text-[10px] font-medium tracking-wider ${statusClass}`}>{statusLabel}</div>
                    {a.isAnchor && (
                      <div className="mt-0.5 text-[10px] text-muted-foreground" title={a.anchorReason}>
                        Can't move
                      </div>
                    )}
                    {a.delayMinutes && a.delayMinutes > 0 && (
                      <div className="mt-0.5 text-[10px] text-[color:var(--shifting)]">+{a.delayMinutes}m</div>
                    )}
                  </div>
                  <div className="relative h-12">
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 rounded-md border border-border/40 ${barClass}`}
                      style={{
                        left: `${leftPct}%`,
                        width: `max(28px, ${widthPct}%)`,
                        height: 20,
                      }}
                      title={`${a.title} · ${a.duration}m`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Right rail */}
        <aside className="space-y-4">
          {/* Health card with clickable issue items */}
          <HealthCard health={health} onSelectActivity={setSelectedId} />

          {/* Selected activity */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-display text-xl text-foreground">{selected.title}</h3>
                <p className="truncate text-xs text-muted-foreground">{selected.location}</p>
              </div>
              <span
                className={`shrink-0 rounded-full border border-current/30 px-2 py-0.5 text-[10px] font-medium tracking-wider ${
                  selected.isAnchor
                    ? "status-anchor"
                    : NEEDS_PANEL.has(selected.status)
                      ? "status-shifting"
                      : "status-on-track"
                }`}
              >
                {selected.isAnchor ? "FIXED" : STATUS_LABEL[selected.status].toUpperCase()}
              </span>
            </div>

            <dl className="space-y-2 text-sm">
              <Row label="Start" value={fmtTime(selected.start)} />
              <Row label="Duration" value={`${selected.duration}m`} />
              <Row label="Owner" value={selected.ownerRole} />
            </dl>

            {selected.isAnchor && selected.anchorReason && (
              <div className="mt-3 rounded-md border border-gold/30 bg-blush/5 p-3 text-xs text-muted-foreground">
                <span className="font-medium text-gold">Why this can't move: </span>
                {selected.anchorReason}
              </div>
            )}

            {NEEDS_PANEL.has(selected.status) && (
              <div className="mt-4">
                <IntelligencePanel title={selected.title} explanation={explanation} defaultOpen compact />
              </div>
            )}

            <div className="mt-5 space-y-2">
              {NEEDS_PANEL.has(selected.status) && (
                <button className="w-full rounded-md bg-gradient-gold py-2 text-sm font-medium text-primary-foreground shadow-gold">
                  Update Remaining Timeline
                </button>
              )}
              <Link
                to="/events/$eventId/activities/$activityId"
                params={{ eventId, activityId: selected.id }}
                className="block w-full rounded-md border border-border py-2 text-center text-sm text-foreground"
              >
                Open & Edit Activity
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Intelligence Strip — full Why/Impact/Affected/Recommendation for every issue */}
      {health.attention.length > 0 && (
        <section ref={issuesStripRef} className="mt-6 space-y-3" id="issues-strip">
          <div className="flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.22em] text-gold">
              Issues — {attentionCount} {attentionCount === 1 ? "activity" : "activities"} need attention
            </div>
            <span className="text-[10px] text-muted-foreground">Click any card to select the activity above</span>
          </div>

          {acts
            .filter((a) => NEEDS_PANEL.has(a.status))
            .map((a) => (
              <div
                key={a.id}
                onClick={() => setSelectedId(a.id)}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelectedId(a.id)}
              >
                <IntelligencePanel
                  title={a.title}
                  explanation={explainStatus(eventId, a.id)}
                  defaultOpen={a.id === firstAttentionId}
                />
              </div>
            ))}
        </section>
      )}
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${swatch}`} />
      {label}
    </span>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}
