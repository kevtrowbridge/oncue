import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  computeHealth,
  fmtTime,
  getActivities,
  getMasterChecklist,
} from "@/lib/oncue-data";
import { ChevronDown, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/events/$eventId/status")({
  component: StatusPage,
});

// ⚠️ DEMO ONLY — static placeholder data; replace with Supabase in Phase 3.
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

  // Panel open state — all open by default for compact command-center view
  const [openPanels, setOpenPanels] = useState({
    acks: true,
    changes: true,
    checklist: true,
  });
  const togglePanel = (key: keyof typeof openPanels) =>
    setOpenPanels((s) => ({ ...s, [key]: !s[key] }));

  const totalDone = Object.values(done).filter(Boolean).length;
  const pendingAcks = acknowledgements.filter((a) => a.state !== "Acknowledged").length;
  const attentionCount = health.attention.length;
  const scheduleConflicts = health.conflicts.length;

  const byActivity = acts.map((a) => ({
    activity: a,
    items: masterChecklist.filter((c) => c.activityId === a.id),
  }));

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-8">
      {/* Page header */}
      <div className="mb-5">
        <div className="text-[10px] uppercase tracking-[0.22em] text-gold">Management</div>
        <h1 className="font-display text-3xl text-foreground">Status</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overall event state at a glance. Use Timeline to view and resolve issues.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard
          label="Activities"
          value={`${acts.length}`}
          sub="on timeline"
        />
        <StatCard
          label="Key Milestones Done"
          value={`${health.criticalCompleted} / ${health.criticalTotal}`}
          sub="fixed-timing complete"
          alert={health.criticalCompleted < health.criticalTotal}
        />
        <StatCard
          label="Schedule Conflicts"
          value={`${scheduleConflicts}`}
          sub={scheduleConflicts > 0 ? "resolve in Timeline" : "none detected"}
          alert={scheduleConflicts > 0}
          linkTo={scheduleConflicts > 0 ? `/events/${eventId}/timeline` : undefined}
          linkLabel="Open Timeline →"
        />
        <StatCard
          label="Vendor Acks"
          value={`${acknowledgements.length - pendingAcks} / ${acknowledgements.length}`}
          sub={`${pendingAcks} pending`}
          alert={pendingAcks > 0}
        />
      </div>

      {/* Needs Attention — compact summary, directs to Timeline for resolution */}
      <div className={`mt-4 rounded-xl border px-4 py-3 ${
        attentionCount > 0
          ? "border-[color:var(--shifting)]/40 bg-[color:var(--shifting)]/8"
          : "border-border bg-card"
      }`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`h-2 w-2 shrink-0 rounded-full ${attentionCount > 0 ? "bg-[color:var(--shifting)]" : "bg-[color:var(--on-track)]"}`} />
            {attentionCount > 0 ? (
              <p className="text-sm text-foreground">
                <span className="font-medium status-shifting">{attentionCount} {attentionCount === 1 ? "activity needs" : "activities need"} attention</span>
                {scheduleConflicts > 0 && (
                  <span className="ml-1 text-muted-foreground">
                    · including {scheduleConflicts} schedule {scheduleConflicts === 1 ? "conflict" : "conflicts"}
                  </span>
                )}
              </p>
            ) : (
              <p className="text-sm text-[color:var(--on-track)]">No issues — timeline looks good.</p>
            )}
          </div>
          {attentionCount > 0 && (
            <Link
              to="/events/$eventId/timeline"
              params={{ eventId }}
              className="shrink-0 rounded-md bg-gradient-gold px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-gold"
            >
              Review in Timeline →
            </Link>
          )}
        </div>
        {attentionCount > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-2">
            {health.attention.slice(0, 4).map((a) => (
              <Link
                key={a.id}
                to="/events/$eventId/timeline"
                params={{ eventId }}
                className="rounded-full border border-[color:var(--shifting)]/40 px-2.5 py-0.5 text-[11px] text-foreground hover:bg-secondary/60"
                title={a.reason}
              >
                {a.title}
              </Link>
            ))}
            {attentionCount > 4 && (
              <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground">
                +{attentionCount - 4} more in Timeline
              </span>
            )}
          </div>
        )}
      </div>

      {/* Vendor Acks + Recent Changes — side by side, collapsible */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <CollapsiblePanel
          title="Vendor Acknowledgements"
          open={openPanels.acks}
          onToggle={() => togglePanel("acks")}
          badge={pendingAcks > 0 ? `${pendingAcks} pending` : undefined}
          badgeAlert={pendingAcks > 0}
        >
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
            ⚠️ Demo data — acknowledgement is informational and never blocks timeline execution.
          </p>
        </CollapsiblePanel>

        <CollapsiblePanel
          title="Recent Changes"
          open={openPanels.changes}
          onToggle={() => togglePanel("changes")}
        >
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
            ⚠️ Demo data — Phase 3 will stream real change events.
          </p>
        </CollapsiblePanel>
      </div>

      {/* Master Checklist — collapsible */}
      <div className="mt-4">
        <CollapsiblePanel
          title="Master Checklist"
          open={openPanels.checklist}
          onToggle={() => togglePanel("checklist")}
          badge={`${totalDone} / ${masterChecklist.length}`}
          right={
            <div className="flex gap-1 rounded-full border border-border bg-background p-0.5 text-xs">
              {(["all", "open", "done"] as const).map((f) => (
                <button
                  key={f}
                  onClick={(e) => { e.stopPropagation(); setFilter(f); }}
                  className={`rounded-full px-3 py-1 capitalize ${
                    filter === f ? "bg-gradient-gold text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          }
        >
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
            Open any activity to reassign checklist items.
          </p>
        </CollapsiblePanel>
      </div>
    </div>
  );
}

// ─── Shared panel components ───────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  alert,
  linkTo,
  linkLabel,
}: {
  label: string;
  value: string;
  sub?: string;
  alert?: boolean;
  linkTo?: string;
  linkLabel?: string;
}) {
  const inner = (
    <div className={`w-full rounded-xl border p-4 text-left ${
      alert ? "border-[color:var(--shifting)]/40" : "border-border"
    } bg-card`}>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-0.5 font-display text-3xl ${alert ? "status-shifting" : "text-foreground"}`}>{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>}
      {linkTo && linkLabel && (
        <div className="mt-1.5 text-[10px] text-gold">{linkLabel}</div>
      )}
    </div>
  );
  if (linkTo) {
    return (
      <Link to={linkTo as string} className="block transition hover:opacity-90">
        {inner}
      </Link>
    );
  }
  return inner;
}

function CollapsiblePanel({
  title,
  open,
  onToggle,
  badge,
  badgeAlert,
  right,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  badge?: string;
  badgeAlert?: boolean;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span className="text-[10px] font-medium uppercase tracking-widest text-gold">{title}</span>
          {badge && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
              badgeAlert
                ? "bg-[color:var(--shifting)]/15 status-shifting"
                : "bg-secondary text-muted-foreground"
            }`}>
              {badge}
            </span>
          )}
        </div>
        {right && (
          <div onClick={(e) => e.stopPropagation()}>{right}</div>
        )}
      </button>
      {open && (
        <div className="border-t border-border/60 px-5 py-4">
          {children}
        </div>
      )}
    </div>
  );
}
