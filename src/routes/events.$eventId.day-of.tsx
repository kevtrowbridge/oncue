import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import {
  getActivities,
  getEvent,
  computeHealth,
  fmtTime,
} from "@/lib/oncue-data";

export const Route = createFileRoute("/events/$eventId/day-of")({
  component: DayOfPage,
});

function DayOfPage() {
  const { eventId } = useParams({ from: "/events/$eventId" });
  const evt = getEvent(eventId)!;
  const acts = getActivities(eventId);
  // ⚠️ DEMO ONLY: day-of state is derived from mock activities and frontend
  // health heuristics. Real day-of mode needs live time + real activity state.
  const health = computeHealth(eventId);

  const nowIdx = Math.max(0, acts.findIndex((a) => a.status !== "complete"));
  const now = acts[nowIdx];
  const next = acts.slice(nowIdx + 1, nowIdx + 4);

  const remaining = Math.max(5, Math.round(now.duration * 0.6));
  const elapsedPct = ((now.duration - remaining) / now.duration) * 100;

  const topAttention = health.attention[0];

  return (
    <div className="mx-auto max-w-md px-4 py-6 md:max-w-xl">
      {/* Now */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
        <div className="mb-1 text-[10px] uppercase tracking-[0.22em] text-gold">Now</div>
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-4xl text-foreground">{fmtTime(now.start)}</h2>
          <span
            className={`text-xs ${
              health.rating === "good"
                ? "status-on-track"
                : health.rating === "watch"
                  ? "status-shifting"
                  : "text-destructive"
            }`}
          >
            {health.rating === "good" ? "ON TRACK" : health.rating === "watch" ? "WATCH" : "AT RISK"}
          </span>
        </div>
        <div className="mt-4 rounded-xl bg-secondary/60 p-4">
          <div className="mb-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blush" />
            <span className="font-display text-xl text-foreground">{now.title}</span>
          </div>
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{now.location}</span>
            <span>{now.duration}m</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-background/60">
            <div className="h-full bg-gradient-gold transition-all" style={{ width: `${elapsedPct}%` }} />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {remaining}m remaining · {now.ownerRole}
          </div>
        </div>

        <Link
          to="/events/$eventId/activities/$activityId"
          params={{ eventId, activityId: now.id }}
          className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-gradient-gold py-2 text-sm font-medium text-primary-foreground shadow-gold"
        >
          View Details
        </Link>
      </section>

      {/* Up next */}
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[10px] uppercase tracking-[0.22em] text-gold">Up Next</h3>
          <Link
            to="/events/$eventId/timeline"
            params={{ eventId }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Full timeline →
          </Link>
        </div>
        <ul className="space-y-2">
          {next.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
            >
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">
                  {fmtTime(a.start)}
                  {a.isAnchor && <span className="ml-2 status-anchor">FIXED</span>}
                </div>
                <div className="truncate text-sm text-foreground">{a.title}</div>
                <div className="truncate text-xs text-muted-foreground">{a.location}</div>
              </div>
              <span className="text-xs text-muted-foreground">{a.duration}m</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Attention — short summary only; diagnostics live in Timeline/Status */}
      {topAttention && (
        <section className="mt-6">
          <div className="mb-2 text-[10px] uppercase tracking-[0.22em] status-shifting">Attention</div>
          <Link
            to="/events/$eventId/activities/$activityId"
            params={{ eventId, activityId: topAttention.id }}
            className="block rounded-xl border border-[color:var(--shifting)]/40 bg-[color:var(--shifting)]/5 p-4 transition hover:bg-[color:var(--shifting)]/10"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground">{topAttention.title}</div>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{topAttention.reason}</p>
              </div>
              <span className="shrink-0 text-xs text-[color:var(--shifting)]">View Details →</span>
            </div>
          </Link>
        </section>
      )}

      <p className="mt-8 text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {evt.name}
      </p>
    </div>
  );
}

