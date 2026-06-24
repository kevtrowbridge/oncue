import { createFileRoute, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  generatePhotoGroups,
  getActivities,
  simulateMissingPerson,
  type PhotoGroup,
  type MissingPersonImpact,
} from "@/lib/oncue-data";
import { InfoTip } from "@/components/InfoTip";

export const Route = createFileRoute("/events/$eventId/people")({
  component: PeoplePage,
});

// ⚠️ DEMO ONLY — static prototype data. Replace with real Supabase queries in Phase 3.
const DEMO_PEOPLE = [
  { id: "p1", name: "Sarah Chen", role: "Bride", side: "Side A", group: "Couple", vip: true, departure: null },
  { id: "p2", name: "Daniel Okonkwo", role: "Groom", side: "Side B", group: "Couple", vip: true, departure: null },
  { id: "p3", name: "Margaret Chen", role: "Bride's Mother", side: "Side A", group: "Parent", vip: false, departure: "20:30" },
  { id: "p4", name: "James Chen", role: "Bride's Father", side: "Side A", group: "Parent", vip: false, departure: "20:30" },
  { id: "p5", name: "Patricia Okonkwo", role: "Groom's Mother", side: "Side B", group: "Parent", vip: false, departure: null },
  { id: "p6", name: "Charles Okonkwo", role: "Groom's Father", side: "Side B", group: "Parent", vip: false, departure: null },
  { id: "p7", name: "Lily Chen", role: "Bride's Sister", side: "Side A", group: "Sibling", vip: false, departure: null },
  { id: "p8", name: "Marcus Chen", role: "Bride's Brother", side: "Side A", group: "Sibling", vip: false, departure: null },
  { id: "p9", name: "Aisha Okonkwo", role: "Groom's Sister", side: "Side B", group: "Sibling", vip: false, departure: null },
  { id: "p10", name: "Eleanor Voss", role: "Bride's Grandmother", side: "Side A", group: "Grandparent", vip: true, departure: "18:00" },
  { id: "p11", name: "Sophie Laurent", role: "Maid of Honor", side: "Side A", group: "Wedding Party", vip: false, departure: null },
  { id: "p12", name: "Jordan Blake", role: "Best Man", side: "Side B", group: "Wedding Party", vip: false, departure: null },
];

// ⚠️ DEMO ONLY — static prototype data. Replace with real Supabase queries in Phase 3.
const DEMO_VENDORS = [
  { id: "v1", role: "Photographer", name: "You", arrival: "13:00", departure: "22:00", setup: null, contact: "" },
  { id: "v2", role: "Videographer", name: "Lumen Films", arrival: "14:00", departure: "22:00", setup: 30, contact: "+1 555-0191" },
  { id: "v3", role: "Planner", name: "Sophie Laurent", arrival: "11:00", departure: "23:00", setup: null, contact: "+1 555-0182" },
  { id: "v4", role: "DJ", name: "Resonance Audio", arrival: "15:00", departure: "23:00", setup: 90, contact: "+1 555-0100" },
  { id: "v5", role: "Florist", name: "Bloom & Co.", arrival: "09:00", departure: "16:00", setup: 180, contact: "+1 555-0145" },
  { id: "v6", role: "Hair & Makeup", name: "Studio Glow", arrival: "08:00", departure: "14:00", setup: null, contact: "+1 555-0133" },
];

const KIND_LABEL: Record<PhotoGroup["kind"], string> = {
  "bride-side": "Bride Side",
  shared: "Shared",
  "groom-side": "Groom Side",
  custom: "Custom",
};

const KIND_CHIP: Record<PhotoGroup["kind"], string> = {
  "bride-side": "bg-blush/15 text-blush",
  shared: "bg-gold/15 text-gold",
  "groom-side": "bg-secondary text-foreground",
  custom: "bg-secondary text-muted-foreground",
};

function PeoplePage() {
  const { eventId } = useParams({ from: "/events/$eventId" });
  const familyPhoto = getActivities(eventId).find((a) => a.title === "Family Photos")!;
  const planned = familyPhoto.duration;

  const [tab, setTab] = useState<"groups" | "roster" | "vendors">("groups");

  // ⚠️ DEMO ONLY: groups are seeded from mock data and mutated in local state.
  // Real photo groups would be persisted and re-optimized by the backend.
  const initial = useMemo(() => generatePhotoGroups(eventId), [eventId]);
  const [groups, setGroups] = useState<PhotoGroup[]>(initial);
  const [lastChange, setLastChange] = useState<string | null>(null);

  // Missing-person flow
  // ⚠️ DEMO ONLY: uses the frontend simulateMissingPerson heuristic.
  const [missingFor, setMissingFor] = useState<
    { groupIdx: number; person: string; impact: MissingPersonImpact } | null
  >(null);

  const activeMinutes = groups
    .filter((g) => !g.deferred)
    .reduce((sum, g) => sum + g.minutes, 0);
  const deltaVsPlanned = activeMinutes - planned;

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...groups];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setGroups(next.map((g, i) => ({ ...g, order: i + 1 })));
    setLastChange(`Reordered "${next[swap].name}" — order updated, total time unchanged.`);
  };

  const defer = (g: PhotoGroup) => {
    setGroups((gs) => gs.map((x) => (x.id === g.id ? { ...x, deferred: !x.deferred } : x)));
    setLastChange(
      g.deferred
        ? `Restored "${g.name}" — adds back ${g.minutes} min to the photo block.`
        : `Deferred "${g.name}" — saves ${g.minutes} min. Reschedule during Sunset Portraits.`,
    );
  };

  const split = (g: PhotoGroup) => {
    if (g.people.length < 2) return;
    const mid = Math.ceil(g.people.length / 2);
    const a = { ...g, id: `${g.id}-a`, name: `${g.name} (A)`, people: g.people.slice(0, mid), minutes: Math.ceil(g.minutes / 2) };
    const b = { ...g, id: `${g.id}-b`, name: `${g.name} (B)`, people: g.people.slice(mid), minutes: Math.ceil(g.minutes / 2) };
    setGroups((gs) => gs.flatMap((x) => (x.id === g.id ? [a, b] : [x])).map((x, i) => ({ ...x, order: i + 1 })));
    setLastChange(`Split "${g.name}" into two groups — adds ~${a.minutes + b.minutes - g.minutes} min.`);
  };

  const mergeWithPrev = (idx: number) => {
    if (idx === 0) return;
    const a = groups[idx - 1];
    const b = groups[idx];
    const merged: PhotoGroup = {
      ...a,
      id: `${a.id}+${b.id}`,
      name: `${a.name} + ${b.name}`,
      people: Array.from(new Set([...a.people, ...b.people])),
      minutes: Math.max(a.minutes, b.minutes) + 1,
    };
    const next = [...groups];
    next.splice(idx - 1, 2, merged);
    setGroups(next.map((g, i) => ({ ...g, order: i + 1 })));
    setLastChange(`Merged into "${merged.name}" — saves ${a.minutes + b.minutes - merged.minutes} min.`);
  };

  const flagMissing = (groupIdx: number, person: string) => {
    // ⚠️ DEMO ONLY: runs the lightweight frontend missing-person heuristic.
    const impact = simulateMissingPerson(groups, groupIdx, person);
    setMissingFor({ groupIdx, person, impact });
  };

  const resolveMissing = (optionId: string) => {
    if (!missingFor) return;
    const { groupIdx, person, impact } = missingFor;
    const choice = impact.options.find((o) => o.id === optionId)!;
    setGroups((gs) => {
      let next = [...gs];
      if (optionId === "continue") {
        next = next.map((g, i) => (i === groupIdx ? { ...g, missing: [...(g.missing ?? []), person] } : g));
      } else if (optionId === "reverse") {
        const sameKind = next[groupIdx].kind;
        const tail = next.slice(groupIdx);
        const tailReversed = [...tail.filter((g) => g.kind === sameKind).reverse(), ...tail.filter((g) => g.kind !== sameKind)];
        next = [...next.slice(0, groupIdx), ...tailReversed];
      } else if (optionId === "switch-side") {
        const opposite = next[groupIdx].kind === "bride-side" ? "groom-side" : "bride-side";
        const oppIdx = next.findIndex((g, i) => i > groupIdx && g.kind === opposite);
        if (oppIdx !== -1) {
          const moved = next.splice(oppIdx, 1)[0];
          next.splice(groupIdx, 0, moved);
        }
      }
      return next.map((g, i) => ({ ...g, order: i + 1 }));
    });
    setLastChange(`Missing-person flow: chose "${choice.label}" for ${person}. ${choice.description}`);
    setMissingFor(null);
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-8">
      {/* Page header */}
      <div className="mb-5">
        <div className="text-[10px] uppercase tracking-[0.22em] text-gold">People</div>
        <h1 className="font-display text-3xl text-foreground">People & Vendors</h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Manage the people appearing in photos and the vendors delivering the event. Photo Groups uses these rosters to build the optimal shooting sequence.
        </p>
      </div>

      {/* Tab selector */}
      <div className="mb-5 flex gap-1 rounded-xl border border-border bg-card p-1">
        {(
          [
            { key: "groups", label: "Photo Groups", count: groups.filter((g) => !g.deferred).length },
            { key: "roster", label: "People Roster", count: DEMO_PEOPLE.length },
            { key: "vendors", label: "Vendors", count: DEMO_VENDORS.length },
          ] as const
        ).map(({ key, label, count }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              tab === key
                ? "bg-secondary text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${tab === key ? "bg-card text-foreground" : "bg-secondary/60 text-muted-foreground"}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* ─── People Roster ─── */}
      {tab === "roster" && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              ⚠️ Demo data — these people are proto-examples of what Phase 3 will load from your event.
            </p>
            <button type="button" className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:bg-secondary/50">
              + Add Person
            </button>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Name</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Role</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Side</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Group</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Departs</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_PEOPLE.map((p, i) => (
                  <tr key={p.id} className={`border-b border-border/40 ${i % 2 === 0 ? "" : "bg-secondary/10"}`}>
                    <td className="px-4 py-2.5">
                      <span className="font-medium text-foreground">{p.name}</span>
                      {p.vip && (
                        <span className="ml-2 rounded-full bg-gold/15 px-1.5 py-0.5 text-[10px] font-medium text-gold">VIP</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{p.role}</td>
                    <td className="px-3 py-2.5">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${p.side === "Side A" ? "bg-blush/15 text-blush" : p.side === "Side B" ? "bg-secondary text-foreground" : "bg-gold/15 text-gold"}`}>
                        {p.side}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{p.group}</td>
                    <td className="px-3 py-2.5">
                      {p.departure ? (
                        <span className="status-shifting text-xs">{p.departure}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Departure times appear as warnings in the Photo Group Optimizer when groups are scheduled after that person must leave.
          </p>
        </section>
      )}

      {/* ─── Vendors ─── */}
      {tab === "vendors" && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              ⚠️ Demo data — Phase 3 will load from your event questionnaire.
            </p>
            <button type="button" className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:bg-secondary/50">
              + Add Vendor
            </button>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Role</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Name</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Arrives</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Departs</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Setup</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_VENDORS.map((v, i) => (
                  <tr key={v.id} className={`border-b border-border/40 ${i % 2 === 0 ? "" : "bg-secondary/10"}`}>
                    <td className="px-4 py-2.5">
                      <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-medium text-gold">{v.role}</span>
                    </td>
                    <td className="px-3 py-2.5 font-medium text-foreground">{v.name}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{v.arrival}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{v.departure}</td>
                    <td className="px-3 py-2.5">
                      {v.setup ? (
                        <span className="text-xs text-muted-foreground">{v.setup}m</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Setup duration lets OnCue insert a setup block before the vendor's first visible activity. Departure time triggers a coverage warning if the timeline extends past it.
          </p>
        </section>
      )}

      {/* ─── Photo Groups ─── */}
      {tab === "groups" && (
      <div>
      <div className="mb-4 flex items-end justify-between gap-4">
        <p className="max-w-xl text-sm text-muted-foreground">
          Default sequence: Bride Side → Shared → Groom Side, so each family unit is photographed contiguously. Reorder, defer, merge, split, or flag a missing person — OnCue reports how each change affects the photo block.
        </p>
        <div className="shrink-0 rounded-xl border border-border bg-card px-4 py-3 text-right">
          <div className="text-[10px] uppercase tracking-widest text-gold">
            <InfoTip label="The duration OnCue currently estimates for the photo block, summed across every active group. Compare against the activity's planned duration.">
              Photo block estimate
            </InfoTip>
          </div>
          <div className="font-display text-xl text-foreground">{activeMinutes}m</div>
          <div
            className={`text-xs ${
              deltaVsPlanned > 0
                ? "status-shifting"
                : deltaVsPlanned < 0
                  ? "status-on-track"
                  : "text-muted-foreground"
            }`}
          >
            {deltaVsPlanned === 0
              ? "matches planned duration"
              : deltaVsPlanned > 0
                ? `${deltaVsPlanned}m over the ${planned}m planned`
                : `${Math.abs(deltaVsPlanned)}m under the ${planned}m planned`}
          </div>
        </div>
      </div>

      {lastChange && (
        <div className="mb-4 rounded-lg border border-gold/30 bg-blush/5 px-3 py-2 text-xs text-foreground">
          <span className="text-gold">Why this changed: </span>
          {lastChange}
        </div>
      )}

      {/* Missing-person modal */}
      {missingFor && (
        <MissingPersonDialog
          impact={missingFor.impact}
          onChoose={resolveMissing}
          onClose={() => setMissingFor(null)}
        />
      )}

      <ul className="space-y-3">
        {groups.map((g, i) => (
          <li
            key={g.id}
            className={`rounded-xl border bg-card p-4 ${g.deferred ? "border-border/40 opacity-60" : "border-border"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blush/15 font-display text-gold">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg text-foreground">{g.name}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${KIND_CHIP[g.kind]}`}>
                      {KIND_LABEL[g.kind]}
                    </span>
                    <span className="text-[11px] text-muted-foreground">~{g.minutes}m</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {g.people.map((name) => {
                      const isMissing = g.missing?.includes(name);
                      return (
                        <button
                          key={name}
                          onClick={() => flagMissing(i, name)}
                          className={`group/chip flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${
                            isMissing
                              ? "border-[color:var(--shifting)]/50 bg-[color:var(--shifting)]/10 text-[color:var(--shifting)]"
                              : "border-border text-muted-foreground hover:border-[color:var(--shifting)]/50"
                          }`}
                          title={isMissing ? "Marked missing" : "Mark as missing"}
                        >
                          {isMissing ? "⚠ " : ""}
                          {name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-1">
                <IconBtn label="Move up" onClick={() => move(i, -1)}>↑</IconBtn>
                <IconBtn label="Move down" onClick={() => move(i, 1)}>↓</IconBtn>
                <select
                  className="rounded-md border border-border bg-card px-2 py-1.5 text-xs text-foreground"
                  value=""
                  onChange={(ev) => {
                    if (ev.target.value) flagMissing(i, ev.target.value);
                    ev.target.value = "";
                  }}
                  aria-label="Mark missing"
                >
                  <option value="">Missing…</option>
                  {g.people
                    .filter((p) => !g.missing?.includes(p))
                    .map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                </select>
                <TextBtn onClick={() => defer(g)}>{g.deferred ? "Restore" : "Defer"}</TextBtn>
                <MoreMenu
                  onMerge={() => mergeWithPrev(i)}
                  onSplit={() => split(g)}
                  canMerge={i > 0}
                  canSplit={g.people.length >= 2}
                />
              </div>

            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-xl border border-gold/30 bg-blush/5 p-4 text-sm text-muted-foreground">
        <span className="status-anchor mr-2">●</span>
        Tap any name in a group to flag a missing person — OnCue will suggest how to keep moving without losing the timeline.
      </div>
      </div>
      )}

    </div>
  );
}

function MissingPersonDialog({
  impact,
  onChoose,
  onClose,
}: {
  impact: MissingPersonImpact;
  onChoose: (optionId: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-background/80 p-4 backdrop-blur">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-5 shadow-elegant">
        <div className="mb-1 text-[10px] uppercase tracking-[0.22em] status-shifting">Missing Person</div>
        <h2 className="font-display text-2xl text-foreground">{impact.person} missing</h2>
        <p className="mt-1 text-sm text-muted-foreground">{impact.why}</p>

        <ul className="mt-4 space-y-2">
          {impact.options.map((o) => (
            <li
              key={o.id}
              className={`rounded-xl border bg-background p-3 ${
                o.recommended ? "border-gold/50" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-foreground">{o.label}</h3>
                    {o.recommended && (
                      <span className="rounded-full bg-gradient-gold px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{o.description}</p>
                  <p className="mt-1 rounded-md bg-secondary/50 px-2 py-1 text-[11px] text-foreground">
                    <span className="text-gold">Why: </span>
                    {o.reason}
                  </p>
                  {o.affected.length > 0 && (
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      <span className="text-gold">Affected:</span> {o.affected.slice(0, 3).join(" · ")}
                      {o.affected.length > 3 ? ` +${o.affected.length - 3}` : ""}
                    </p>
                  )}

                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Est. delay</div>
                  <div className={`font-display text-lg ${o.estimatedDelayMin > 0 ? "status-shifting" : "status-on-track"}`}>
                    {o.estimatedDelayMin > 0 ? `+${o.estimatedDelayMin}m` : "0m"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onChoose(o.id)}
                className="mt-2 w-full rounded-md border border-border bg-card py-1.5 text-xs text-foreground hover:bg-secondary"
              >
                Apply this option
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-md py-2 text-xs text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-md border border-border text-foreground hover:bg-secondary"
    >
      {children}
    </button>
  );
}
function TextBtn({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-md border border-border px-2.5 py-1.5 text-xs text-foreground hover:bg-secondary disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function MoreMenu({
  onMerge,
  onSplit,
  canMerge,
  canSplit,
}: {
  onMerge: () => void;
  onSplit: () => void;
  canMerge: boolean;
  canSplit: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-border px-2.5 py-1.5 text-xs text-foreground hover:bg-secondary"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        More
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-md border border-border bg-card shadow-elegant"
          onMouseLeave={() => setOpen(false)}
        >
          <button
            disabled={!canMerge}
            onClick={() => {
              setOpen(false);
              onMerge();
            }}
            className="block w-full px-3 py-2 text-left text-xs text-foreground hover:bg-secondary disabled:opacity-40"
          >
            Merge with previous
          </button>
          <button
            disabled={!canSplit}
            onClick={() => {
              setOpen(false);
              onSplit();
            }}
            className="block w-full px-3 py-2 text-left text-xs text-foreground hover:bg-secondary disabled:opacity-40"
          >
            Split group in two
          </button>
        </div>
      )}
    </div>
  );
}

