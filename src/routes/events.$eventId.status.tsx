import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  computeHealth,
  fmtTime,
  getActivities,
  getMasterChecklist,
} from "@/lib/oncue-data";

export const Route = createFileRoute("/events/$eventId/status")({
  component: StatusPage,
});

const changeLog = [
  { time: "10:42", text: "Couple Portraits start moved +10m due to lighting", role: "Photographer" },
  { time: "09:58", text: "Detail Photos marked complete", role: "Photographer" },
  { time: "08:30", text: "Hair & Makeup started 5m early", role: "Coordinator" },
];

const acknowledgements = [
  { name: "Photographer", state: "Acknowledged" },
  { name: "DJ", state: "Notified" },
  { name: "Catering Lead", state: "Notified" },
  { name: "Officiant", state: "Pending" },
  { name: "MC", state: "Pending" },
];

// ⚠️ DEMO ONLY: changeLog and acknowledgements above are static placeholder data.
// Real status page would consume a backend change/acknowledgement log.

function StatusPage() {
  const { eventId } = useParams({ from: "/events/$eventId" });
  const acts = getActivities(eventId);
  // ⚠️ DEMO ONLY: health/checklist come from frontend mock data/heuristics.
  const health = computeHealth(eventId);
  const masterChecklist = getMasterChecklist(eventId);

  const [done, setDone] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(masterChecklist.map((c) => [c.id, c.done])),
  );
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");

  const totalDone = Object.values(done).filter(Boolean).length;

  // Group by activity for the master view.
  const byActivity = acts.map((a) => ({
    activity: a,
    items: masterChecklist.filter((c) => c.activityId === a.id),
  }));

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

      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Activities" value={`${acts.length}`} />
        <Stat label="Critical complete" value={`${health.criticalCompleted} / ${health.criticalTotal}`} />
        <Stat label="Conflicts" value={`${health.conflicts.length}`} />
        <Stat label="Checklist" value={`${totalDone} / ${masterChecklist.length}`} />
      </div>

      {/* Master Checklist */}
      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[10px] uppercase tracking-widest text-gold">Master Checklist</h2>
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
                          className={`grid h-4 w-4 place-items-center rounded border ${
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
          Items reassigned between activities stay visible until completed. Open the activity to drag an item to a different one.
        </p>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 text-[10px] uppercase tracking-widest text-gold">Change Log</h2>
          <ul className="space-y-3">
            {changeLog.map((c, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="font-mono text-xs text-muted-foreground">{c.time}</span>
                <div>
                  <div className="text-foreground">{c.text}</div>
                  <div className="text-xs text-muted-foreground">{c.role}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 text-[10px] uppercase tracking-widest text-gold">Vendor Acknowledgements</h2>
          <ul className="space-y-2">
            {acknowledgements.map((a) => (
              <li
                key={a.name}
                className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm"
              >
                <span className="text-foreground">{a.name}</span>
                <span
                  className={`text-xs ${
                    a.state === "Acknowledged"
                      ? "status-on-track"
                      : a.state === "Notified"
                        ? "status-shifting"
                        : "status-optional"
                  }`}
                >
                  {a.state}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-3xl text-foreground">{value}</div>
    </div>
  );
}
