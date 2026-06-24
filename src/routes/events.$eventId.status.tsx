import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  computeHealth,
  fmtTime,
  getActivities,
  getMasterChecklist,
} from "@/lib/oncue-data";

export const Route = createFileRoute("/events/$eventId/status")({
  component: StatusPage,
});

// ⚠️ DEMO ONLY — static placeholder data; replace with Supabase change log in Phase 3.
const changeLog = [
  { time: "10:42", text: "Couple Portraits start moved +10m due to lighting", role: "Photographer" },
  { time: "09:58", text: "Detail Photos marked complete", role: "Photographer" },
  { time: "08:30", text: "Hair & Makeup started 5m early", role: "Coordinator" },
];

// ⚠️ DEMO ONLY — static placeholder data; replace with Supabase in Phase 3.
const acknowledgements = [
  { name: "Photographer", state: "Acknowledged" },
  { name: "DJ", state: "Notified" },
  { name: "Catering Lead", state: "Notified" },
  { name: "Officiant", state: "Pending" },
  { name: "MC", state: "Pending" },
];

function StatusPage() {
  const { eventId } = useParams({ from: "/events/$eventId" });
  const acts = getActivities(eventId);
  // ⚠️ DEMO ONLY: health/checklist come from frontend mock heuristics.
  const health = computeHealth(eventId);
  const masterChecklist = getMasterChecklist(eventId);

  const [done, setDone] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(masterChecklist.map((c) => [c.id, c.done])),
  );
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");

  const totalDone = Object.values(done).filter(Boolean).length;

  // Section refs for stat card scroll-to behavior
  const checklistRef = useRef<HTMLElement>(null);
  const changeLogRef = useRef<HTMLElement>(null);
  const vendorRef = useRef<HTMLElement>(null);
  const conflictsRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLElement | HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const byActivity = acts.map((a) => ({
    activity: a,
    items: masterChecklist.filter((c) => c.activityId === a.id),
  }));

  const pendingAcks = acknowledgements.filter((a) => a.state !== "Acknowledged").length;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-gold">Management</div>
          <h1 className="font-display text-3xl text-foreground">Status & Change Log</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acknowledgement is informational — it never blocks timeline execution.
          </p>
        </div>
      </div>

      {/* Stat cards — clickable to jump to relevant section */}
      <div className="grid gap-3 md:grid-cols-4">
        <Stat
          label="Activities"
          value={`${acts.length}`}
          sub="total on timeline"
          onClick={() => scrollTo(checklistRef)}
          actionLabel="View checklist"
        />
        <Stat
          label="Key Milestones Done"
          value={`${health.criticalCompleted} / ${health.criticalTotal}`}
          sub="fixed-timing complete"
          onClick={() => scrollTo(checklistRef)}
          actionLabel="View checklist"
          alert={health.criticalCompleted < health.criticalTotal}
        />
        <Stat
          label="Conflicts"
          value={`${health.conflicts.length}`}
          sub="activities flagged"
          onClick={health.conflicts.length > 0 ? () => scrollTo(conflictsRef) : undefined}
          actionLabel={health.conflicts.length > 0 ? "See conflicts" : undefined}
          alert={health.conflicts.length > 0}
        />
        <Stat
          label="Vendor Acks"
          value={`${acknowledgements.length - pendingAcks} / ${acknowledgements.length}`}
          sub={`${pendingAcks} pending`}
          onClick={() => scrollTo(vendorRef)}
          actionLabel="View acknowledgements"
          alert={pendingAcks > 0}
        />
      </div>

      {/* Conflicts alert — only if there are conflicts */}
      {health.conflicts.length > 0 && (
        <div
          ref={conflictsRef}
          className="mt-4 rounded-xl border border-[color:var(--shifting)]/40 bg-[color:var(--shifting)]/8 p-4"
        >
          <div className="mb-2 text-[10px] uppercase tracking-widest status-shifting">
            {health.conflicts.length} {health.conflicts.length === 1 ? "Conflict" : "Conflicts"} Need Attention
          </div>
          <ul className="space-y-1.5">
            {health.conflicts.map((c) => (
              <li key={c.id} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--shifting)]" />
                <div>
                  <Link
                    to="/events/$eventId/activities/$activityId"
                    params={{ eventId, activityId: c.id }}
                    className="font-medium text-foreground hover:text-gold"
                  >
                    {c.title}
                  </Link>
                  {c.reason && (
                    <p className="text-[11px] text-muted-foreground">{c.reason}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Change Log + Vendor Acknowledgements — surfaced before checklist */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section ref={changeLogRef} className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 text-[10px] uppercase tracking-widest text-gold">Change Log</h2>
          <ul className="space-y-3">
            {changeLog.map((c, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="shrink-0 font-mono text-xs text-muted-foreground">{c.time}</span>
                <div>
                  <div className="text-foreground">{c.text}</div>
                  <div className="text-xs text-muted-foreground">{c.role}</div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-muted-foreground">
            ⚠️ Demo data — Phase 3 will stream real timeline changes.
          </p>
        </section>

        <section ref={vendorRef} className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 text-[10px] uppercase tracking-widest text-gold">Vendor Acknowledgements</h2>
          <ul className="space-y-2">
            {acknowledgements.map((a) => (
              <li
                key={a.name}
                className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm"
              >
                <span className="text-foreground">{a.name}</span>
                <span
                  className={`text-xs font-medium ${
                    a.state === "Acknowledged"
                      ? "status-on-track"
                      : a.state === "Notified"
                        ? "status-shifting"
                        : "text-muted-foreground"
                  }`}
                >
                  {a.state}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-muted-foreground">
            ⚠️ Demo data — acknowledgements are informational only.
          </p>
        </section>
      </div>

      {/* Master Checklist */}
      <section ref={checklistRef} className="mt-5 rounded-xl border border-border bg-card p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[10px] uppercase tracking-widest text-gold">Master Checklist</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {totalDone} of {masterChecklist.length} complete
            </p>
          </div>
          <div className="flex gap-1 rounded-full border border-border bg-background p-0.5 text-xs">
            {(["all", "open", "done"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1 capitalize ${
                  filter === f ? "bg-gradient-gold text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {byActivity.map(({ activity, items }) => {
            const visible = items.filter((c) => {
              const isDone = done[c.id] ?? c.done;
              if (filter === "open") return !isDone;
              if (filter === "done") return isDone;
              return true;
            });
            if (visible.length === 0) return null;
            return (
              <div key={activity.id}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <Link
                    to="/events/$eventId/activities/$activityId"
                    params={{ eventId, activityId: activity.id }}
                    className="text-sm text-foreground hover:text-gold"
                  >
                    {activity.title}
                  </Link>
                  <span className="text-[11px] text-muted-foreground">
                    {fmtTime(activity.start)} · {activity.ownerRole}
                  </span>
                </div>
                <ul className="space-y-1">
                  {visible.map((c) => {
                    const isDone = done[c.id] ?? c.done;
                    return (
                      <li
                        key={c.id}
                        className="flex items-center gap-3 rounded-lg border border-border/60 bg-background px-3 py-1.5 text-sm"
                      >
                        <button
                          type="button"
                          onClick={() => setDone((s) => ({ ...s, [c.id]: !isDone }))}
                          className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${
                            isDone
                              ? "border-gold bg-gradient-gold text-primary-foreground"
                              : "border-border"
                          }`}
                          aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                        >
                          {isDone ? "✓" : ""}
                        </button>
                        <span className={isDone ? "text-muted-foreground line-through" : "text-foreground"}>
                          {c.label}
                        </span>
                        <span className="ml-auto text-[10px] text-muted-foreground">{c.owner}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Items reassigned between activities stay visible until completed. Open the activity to reassign an item.
        </p>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  onClick,
  actionLabel,
  alert,
}: {
  label: string;
  value: string;
  sub?: string;
  onClick?: () => void;
  actionLabel?: string;
  alert?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`w-full rounded-xl border bg-card p-5 text-left transition ${
        onClick ? "hover:border-gold/40 hover:shadow-sm" : ""
      } ${alert ? "border-[color:var(--shifting)]/40" : "border-border"}`}
    >
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-3xl ${alert ? "status-shifting" : "text-foreground"}`}>{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>}
      {actionLabel && onClick && (
        <div className="mt-2 text-[10px] text-gold">{actionLabel} →</div>
      )}
    </button>
  );
}
