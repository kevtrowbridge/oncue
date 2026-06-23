import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  getActivity,
  getActivities,
  explainStatus,
  fmtTime,
  STATUS_LABEL,
  updateActivity,
  suggestNotification,
} from "@/lib/oncue-data";
import { IntelligencePanel } from "@/components/IntelligencePanel";

export const Route = createFileRoute("/events/$eventId/activities/$activityId")({
  component: ActivityDetail,
  notFoundComponent: () => <div className="p-10 text-foreground">Activity not found.</div>,
  errorComponent: ({ error }) => <div className="p-10 text-foreground">{error.message}</div>,
});

const NEEDS_PANEL = new Set([
  "needs-adjustment",
  "delayed",
  "recalculating",
  "conflict",
  "at-risk",
]);

function ActivityDetail() {
  const { eventId, activityId } = useParams({ from: "/events/$eventId/activities/$activityId" });
  const a = getActivity(activityId);
  if (!a) {
    return (
      <div className="p-10 text-foreground">
        Activity not found.{" "}
        <Link to="/events/$eventId/timeline" params={{ eventId }} className="text-gold underline">
          Back to timeline
        </Link>
      </div>
    );
  }
  return <ActivityDetailInner eventId={eventId} a={a} />;
}

function ActivityDetailInner({
  eventId,
  a,
}: {
  eventId: string;
  a: NonNullable<ReturnType<typeof getActivity>>;
}) {
  const allActs = getActivities(eventId);

  // Bump on save so derived demo values re-render with latest mock data.
  // ⚠️ DEMO ONLY: version counter forces re-computation of frontend mock heuristics.
  const [version, setVersion] = useState(0);



  const explanation = useMemo(
    () => explainStatus(eventId, a.id),
    [eventId, a.id, version],
  );
  const notify = useMemo(
    () => suggestNotification(eventId, a.id),
    [eventId, a.id, version],
  );
  const startDate = new Date(a.start);
  const end = new Date(startDate.getTime() + a.duration * 60000);

  // Local editable state — committed via the demo updateActivity on blur.
  // ⚠️ DEMO ONLY: edits live only in memory and are lost on reload.
  const [form, setForm] = useState({
    start: toLocalTime(a.start),
    duration: a.duration,
    minDuration: a.minDuration,
    location: a.location,
    address: a.locationInfo?.address ?? "",
    travelBefore: a.buffers.travelBefore,
    travelAfter: a.buffers.travelAfter,
    travelEstimateMin: a.locationInfo?.travelEstimateMin ?? 0,
    travelEstimateSource:
      a.locationInfo?.travelEstimateSource ?? ("manual" as const),
    owner: a.ownerRole,
    bufferBefore: a.buffers.before,
    bufferAfter: a.buffers.after,
    isAnchor: a.isAnchor,
    isOptional: a.isOptional,
    dependencies: a.dependencies.join(","),
  });

  function save() {
    const [hh, mm] = form.start.split(":").map(Number);
    const newStart = new Date(a.start);
    newStart.setUTCHours(hh, mm, 0, 0);
    updateActivity(a.id, {
      start: newStart.toISOString(),
      duration: Number(form.duration) || a.duration,
      minDuration: Number(form.minDuration) || a.minDuration,
      location: form.location,
      ownerRole: form.owner,
      owner: form.owner,
      isAnchor: form.isAnchor,
      isOptional: form.isOptional,
      dependencies: form.dependencies
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      buffers: {
        before: Number(form.bufferBefore) || 0,
        after: Number(form.bufferAfter) || 0,
        travelBefore: Number(form.travelBefore) || 0,
        travelAfter: Number(form.travelAfter) || 0,
      },
      locationInfo: {
        name: form.location,
        address: form.address || undefined,
        travelEstimateMin: Number(form.travelEstimateMin) || undefined,
        travelEstimateSource: form.travelEstimateSource,
      },
    });
    setVersion((v) => v + 1);
  }

  const statusLabel = a.isAnchor ? "Fixed Timing" : STATUS_LABEL[a.status];
  const statusClass = a.isAnchor
    ? "text-gold"
    : NEEDS_PANEL.has(a.status)
      ? "status-shifting"
      : "status-on-track";

  // Checklist
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const checklist = a.checklist;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
      <Link
        to="/events/$eventId/timeline"
        params={{ eventId }}
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        ← Timeline
      </Link>

      {/* New header: status sits right next to the title */}
      <header className="mt-4">
        <div className="text-[10px] uppercase tracking-[0.22em] text-gold">Activity Detail</div>
        <h1 className="font-display text-3xl text-foreground">
          {a.title}{" "}
          <span className={`align-middle text-base font-normal ${statusClass}`}>
            — {statusLabel}
          </span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{a.location}</p>
        <p className="mt-1 text-sm text-foreground">
          Start {fmtTime(startDate.toISOString())} · Duration {a.duration}m · Owner {a.ownerRole}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Ends {fmtTime(end.toISOString())} · Min duration {a.minDuration}m
        </p>
      </header>

      <div className="rule-gold my-6" />

      {NEEDS_PANEL.has(a.status) && (
        <div className="mb-6">
          <IntelligencePanel title={a.title} explanation={explanation} defaultOpen />
        </div>
      )}

      {/* Notification suggestion — only when a shift actually affects others.
           ⚠️ DEMO ONLY: this is a generated message, not a real notification. */}
      {NEEDS_PANEL.has(a.status) && (
        <NotifyCard
          notify={notify}
          onCopy={() =>
            typeof navigator !== "undefined" &&
            navigator.clipboard?.writeText(notify.suggestedMessage)
          }
        />
      )}

      {/* Editable fields */}
      <section className="mt-6 rounded-xl border border-border bg-card p-4">
        <div className="mb-3 text-[10px] uppercase tracking-widest text-gold">Edit Activity</div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input
            label="Start (HH:MM, UTC)"
            value={form.start}
            onChange={(v) => setForm((s) => ({ ...s, start: v }))}
            onBlur={save}
          />
          <Input
            label="Owner / Role"
            value={form.owner}
            onChange={(v) => setForm((s) => ({ ...s, owner: v }))}
            onBlur={save}
          />
          <Input
            label="Duration (min)"
            type="number"
            value={String(form.duration)}
            onChange={(v) => setForm((s) => ({ ...s, duration: Number(v) }))}
            onBlur={save}
          />
          <Input
            label="Minimum duration (min)"
            type="number"
            value={String(form.minDuration)}
            onChange={(v) => setForm((s) => ({ ...s, minDuration: Number(v) }))}
            onBlur={save}
          />
          <Input
            label="Buffer before (min)"
            type="number"
            value={String(form.bufferBefore)}
            onChange={(v) => setForm((s) => ({ ...s, bufferBefore: Number(v) }))}
            onBlur={save}
          />
          <Input
            label="Buffer after (min)"
            type="number"
            value={String(form.bufferAfter)}
            onChange={(v) => setForm((s) => ({ ...s, bufferAfter: Number(v) }))}
            onBlur={save}
          />
          <Input
            label="Dependencies (comma-separated activity IDs)"
            value={form.dependencies}
            onChange={(v) => setForm((s) => ({ ...s, dependencies: v }))}
            onBlur={save}
            className="md:col-span-2"
          />
          <div className="flex items-center gap-4 md:col-span-2">
            <Checkbox
              label="Fixed Timing (Anchor)"
              checked={form.isAnchor}
              onChange={(v) => {
                setForm((s) => ({ ...s, isAnchor: v }));
                setTimeout(save, 0);
              }}
            />
            <Checkbox
              label="Optional"
              checked={form.isOptional}
              onChange={(v) => {
                setForm((s) => ({ ...s, isOptional: v }));
                setTimeout(save, 0);
              }}
            />
          </div>
        </div>
      </section>

      {/* Location / address readiness — ready for Google Maps wiring */}
      <section className="mt-4 rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-widest text-gold">Location & Travel</div>
          <span className="text-[10px] text-muted-foreground">
            Google Maps integration prepared — not yet enabled.
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input
            label="Location name"
            value={form.location}
            onChange={(v) => setForm((s) => ({ ...s, location: v }))}
            onBlur={save}
          />
          <Input
            label="Address"
            value={form.address}
            onChange={(v) => setForm((s) => ({ ...s, address: v }))}
            onBlur={save}
            placeholder="123 Garden Way, City"
          />
          <Input
            label="Travel before (min)"
            type="number"
            value={String(form.travelBefore)}
            onChange={(v) => setForm((s) => ({ ...s, travelBefore: Number(v) }))}
            onBlur={save}
          />
          <Input
            label="Travel after (min)"
            type="number"
            value={String(form.travelAfter)}
            onChange={(v) => setForm((s) => ({ ...s, travelAfter: Number(v) }))}
            onBlur={save}
          />
          <Input
            label="Estimated travel time (min)"
            type="number"
            value={String(form.travelEstimateMin)}
            onChange={(v) => setForm((s) => ({ ...s, travelEstimateMin: Number(v) }))}
            onBlur={save}
          />
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-muted-foreground">
              Travel estimate source
            </label>
            <select
              value={form.travelEstimateSource}
              onChange={(ev) => {
                setForm((s) => ({
                  ...s,
                  travelEstimateSource: ev.target.value as typeof form.travelEstimateSource,
                }));
                setTimeout(save, 0);
              }}
              className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground"
            >
              <option value="manual">Manual</option>
              <option value="estimate">Estimate</option>
              <option value="google-maps">Google Maps</option>
            </select>
          </div>
        </div>
      </section>

      {a.notes && (
        <div className="mt-6 rounded-xl border border-border bg-card p-4">
          <div className="mb-1 text-[10px] uppercase tracking-widest text-gold">Notes</div>
          <p className="text-sm text-foreground">{a.notes}</p>
        </div>
      )}

      {/* Activity checklist */}
      <section className="mt-6 rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-widest text-gold">Checklist</div>
          <span className="text-[11px] text-muted-foreground">
            {checklist.filter((c) => completed[c.id] ?? c.done).length}/{checklist.length} done
          </span>
        </div>
        <ul className="space-y-2">
          {checklist.map((c) => {
            const isDone = completed[c.id] ?? c.done;
            return (
              <li
                key={c.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <button
                  type="button"
                  onClick={() => setCompleted((s) => ({ ...s, [c.id]: !isDone }))}
                  className={`grid h-4 w-4 place-items-center rounded border ${
                    isDone ? "border-gold bg-gradient-gold text-primary-foreground" : "border-border"
                  }`}
                  aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                >
                  {isDone ? "✓" : ""}
                </button>
                <div className={`min-w-0 flex-1 ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {c.label}
                </div>
                <select
                  className="rounded-md border border-border bg-card px-2 py-1 text-[11px] text-foreground"
                  defaultValue={c.activityId}
                  aria-label="Move to activity"
                >
                  {allActs.map((act) => (
                    <option key={act.id} value={act.id}>
                      {act.title}
                    </option>
                  ))}
                </select>
              </li>
            );
          })}
          {checklist.length === 0 && (
            <li className="text-xs text-muted-foreground">No checklist items.</li>
          )}
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-2">
        {NEEDS_PANEL.has(a.status) && (
          <button className="rounded-md bg-gradient-gold px-4 py-2 text-sm font-medium text-primary-foreground shadow-gold">
            Update Remaining Timeline
          </button>
        )}
        <button className="rounded-md border border-border px-4 py-2 text-sm text-foreground">
          Mark Complete
        </button>
      </div>
    </div>
  );
}

function NotifyCard({
  notify,
  onCopy,
}: {
  notify: ReturnType<typeof suggestNotification>;
  onCopy: () => void;
}) {
  // ⚠️ DEMO ONLY: internalOnly / sent / copied are local UI states. No backend
  // notification dispatch exists in the MVP.
  const [internalOnly, setInternalOnly] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <section className="mb-6 rounded-xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-[10px] uppercase tracking-widest text-gold">Notification</div>
        <span
          className={`text-[10px] uppercase tracking-widest ${
            notify.shouldNotify ? "status-shifting" : "status-on-track"
          }`}
        >
          {notify.shouldNotify ? "Suggested" : "Not needed"}
        </span>
      </div>
      <p className="text-sm text-foreground">{notify.reason}</p>
      {notify.shouldNotify && !internalOnly && (
        <div className="mt-3 rounded-md border border-border bg-background p-3 text-sm text-foreground">
          <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            Suggested message
          </div>
          {notify.suggestedMessage}
        </div>
      )}
      <p className="mt-2 text-[11px] text-muted-foreground">
        Nothing is sent automatically. You stay in control.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          disabled={!notify.shouldNotify || internalOnly}
          onClick={() => setSent(true)}
          className="rounded-md bg-gradient-gold px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-gold disabled:opacity-40"
        >
          {sent ? "Planner notified" : "Notify Planner"}
        </button>
        <button
          disabled={!notify.shouldNotify || internalOnly}
          onClick={() => {
            onCopy();
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground disabled:opacity-40"
        >
          {copied ? "Copied" : "Copy Update"}
        </button>
        <button
          onClick={() => setInternalOnly((v) => !v)}
          className={`rounded-md border px-3 py-1.5 text-xs ${
            internalOnly
              ? "border-gold/50 bg-blush/5 text-gold"
              : "border-border text-foreground"
          }`}
        >
          {internalOnly ? "Internal only ✓" : "Mark Internal Only"}
        </button>
      </div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground"
      />
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4"
      />
      {label}
    </label>
  );
}

function toLocalTime(iso: string) {
  const d = new Date(iso);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}
