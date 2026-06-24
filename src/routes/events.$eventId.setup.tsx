import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Sparkles, Save, ChevronDown, ChevronRight } from "lucide-react";
import {
  emptyQuestionnaire,
  generateAll,
  loadQuestionnaire,
  newLocation,
  newPerson,
  newPhotoRequest,
  newPriority,
  newRelationship,
  newVendor,
  PERSON_GROUPS,
  PORTRAIT_LIGHTING_OPTIONS,
  saveQuestionnaire,
  VENDOR_ROLES,
  type GenerationResult,
  type OvertimePolicy,
  type PersonGroup,
  type PersonSide,
  type PortraitLightingPreference,
  type PortraitLightingPriority,
  type Questionnaire,
  type RelationshipKind,
  type VendorRole,
} from "@/lib/questionnaire";

export const Route = createFileRoute("/events/$eventId/setup")({
  component: SetupPage,
});

type SectionKey =
  | "basics"
  | "coverage"
  | "portrait"
  | "locations"
  | "people"
  | "vendors"
  | "relationships"
  | "requests"
  | "priorities"
  | "notes";

function SetupPage() {
  const { eventId } = useParams({ from: "/events/$eventId/setup" });
  // ⚠️ DEMO ONLY: questionnaire state is loaded from memory. Phase 3 replaces with Supabase.
  const [q, setQ] = useState<Questionnaire>(() => emptyQuestionnaire(eventId));
  const [hydrated, setHydrated] = useState(false);
  const [preview, setPreview] = useState<GenerationResult | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // Collapsible state — basics and coverage open by default, rest collapsed
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    basics: true,
    coverage: true,
    portrait: false,
    locations: false,
    people: false,
    vendors: false,
    relationships: false,
    requests: false,
    priorities: false,
    notes: false,
  });
  const toggle = (key: SectionKey) =>
    setOpen((s) => ({ ...s, [key]: !s[key] }));

  useEffect(() => {
    setQ(loadQuestionnaire(eventId));
    setHydrated(true);
  }, [eventId]);

  const update = (patch: Partial<Questionnaire>) =>
    setQ((prev) => ({ ...prev, ...patch }));

  const save = () => {
    saveQuestionnaire(q);
    setSavedAt(new Date().toLocaleTimeString());
  };

  const handleGenerate = () => {
    saveQuestionnaire(q);
    setPreview(generateAll(q));
    setSavedAt(new Date().toLocaleTimeString());
  };

  const completion = useMemo(() => computeCompletion(q), [q]);

  if (!hydrated) {
    return <div className="p-10 text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-4 p-4 md:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Event Setup
          </p>
          <h1 className="font-display text-3xl text-foreground">Event Setup</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            The raw facts of your event — names, times, coverage, people. OnCue uses these to generate your photo groups, checklist, and starter timeline.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono">
            {completion}% complete
          </Badge>
          <Button variant="outline" size="sm" onClick={save}>
            <Save className="mr-1 h-4 w-4" /> Save
          </Button>
          <Button size="sm" onClick={handleGenerate}>
            <Sparkles className="mr-1 h-4 w-4" /> Generate
          </Button>
        </div>
      </header>
      {savedAt && (
        <p className="text-xs text-muted-foreground">Saved at {savedAt} · ⚠️ Demo only — not persisted</p>
      )}

      <BasicsCard q={q} update={update} open={open.basics} onToggle={() => toggle("basics")} />
      <CoverageCard q={q} update={update} open={open.coverage} onToggle={() => toggle("coverage")} />
      <PortraitCard q={q} update={update} open={open.portrait} onToggle={() => toggle("portrait")} />
      <LocationsCard q={q} update={update} open={open.locations} onToggle={() => toggle("locations")} />
      <PeopleCard q={q} update={update} open={open.people} onToggle={() => toggle("people")} />
      <VendorsCard q={q} update={update} open={open.vendors} onToggle={() => toggle("vendors")} />
      <RelationshipsCard q={q} update={update} open={open.relationships} onToggle={() => toggle("relationships")} />
      <PhotoRequestsCard q={q} update={update} open={open.requests} onToggle={() => toggle("requests")} />
      <PrioritiesCard q={q} update={update} open={open.priorities} onToggle={() => toggle("priorities")} />
      <NotesCard q={q} update={update} open={open.notes} onToggle={() => toggle("notes")} />

      {preview && <PreviewCard preview={preview} />}
    </div>
  );
}

function computeCompletion(q: Questionnaire): number {
  let score = 0;
  let total = 0;
  const inc = (cond: boolean) => { total += 1; if (cond) score += 1; };
  inc(!!q.basics.name);
  inc(!!q.basics.date);
  inc(!!q.basics.startTime);
  inc(!!q.coverage.startTime && !!q.coverage.endTime);
  inc(q.locations.some((l) => l.name));
  inc(q.people.length > 0);
  inc(q.people.some((p) => p.group === "couple"));
  inc(q.vendors.length > 0);
  inc(q.priorities.length > 0);
  return Math.round((score / total) * 100);
}

// ─────────────────────────────────────────────────────────────
// Collapsible card shell
// ─────────────────────────────────────────────────────────────
function SectionCard({
  title,
  subtitle,
  badge,
  open,
  onToggle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  open: boolean;
  onToggle: () => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {open ? (
              <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            ) : (
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <div>
              <CardTitle className="flex items-center gap-2">
                {title}
                {badge && (
                  <span className="rounded-full border border-gold/40 px-2 py-0.5 text-[10px] text-gold">{badge}</span>
                )}
              </CardTitle>
              {subtitle && (
                <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && (
            <div onClick={(e) => e.stopPropagation()}>{actions}</div>
          )}
        </div>
      </CardHeader>
      {open && <CardContent>{children}</CardContent>}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Section: Event Basics
// ─────────────────────────────────────────────────────────────
function BasicsCard({
  q, update, open, onToggle,
}: {
  q: Questionnaire;
  update: (p: Partial<Questionnaire>) => void;
  open: boolean;
  onToggle: () => void;
}) {
  const set = (patch: Partial<Questionnaire["basics"]>) =>
    update({ basics: { ...q.basics, ...patch } });
  return (
    <SectionCard title="Event Basics" open={open} onToggle={onToggle}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Event name">
          <Input
            value={q.basics.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="Sarah & Daniel Wedding"
          />
        </Field>
        <Field label="Event type">
          <Select
            value={q.basics.type}
            onValueChange={(v) => set({ type: v as Questionnaire["basics"]["type"] })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="wedding">Wedding</SelectItem>
              <SelectItem value="conference">Conference</SelectItem>
              <SelectItem value="corporate-summit">Corporate Summit</SelectItem>
              <SelectItem value="production">Production / Shoot</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Date">
          <Input
            type="date"
            value={q.basics.date}
            onChange={(e) => set({ date: e.target.value })}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start time">
            <Input
              type="time"
              value={q.basics.startTime}
              onChange={(e) => set({ startTime: e.target.value })}
            />
          </Field>
          <Field label="End time">
            <Input
              type="time"
              value={q.basics.endTime}
              onChange={(e) => set({ endTime: e.target.value })}
            />
          </Field>
        </div>
      </div>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────
// Section: Coverage Policy  ⭐ NEW — v3.0 Event Setup
// ─────────────────────────────────────────────────────────────
function CoverageCard({
  q, update, open, onToggle,
}: {
  q: Questionnaire;
  update: (p: Partial<Questionnaire>) => void;
  open: boolean;
  onToggle: () => void;
}) {
  const set = (patch: Partial<Questionnaire["coverage"]>) =>
    update({ coverage: { ...q.coverage, ...patch } });
  return (
    <SectionCard
      title="Coverage Policy"
      badge="PROTOTYPE"
      subtitle="OnCue uses these times and limits to warn you when the timeline approaches or exceeds your contracted coverage."
      open={open}
      onToggle={onToggle}
    >
      <div className="mb-3 rounded-md border border-gold/30 bg-blush/5 px-3 py-2 text-xs text-muted-foreground">
        ⚠️ These fields are prototypes — they will drive real overage warnings once the constraint engine is wired in Phase 4.
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Coverage starts">
          <Input
            type="time"
            value={q.coverage.startTime}
            onChange={(e) => set({ startTime: e.target.value })}
          />
        </Field>
        <Field label="Coverage ends">
          <Input
            type="time"
            value={q.coverage.endTime}
            onChange={(e) => set({ endTime: e.target.value })}
          />
        </Field>
        <Field label="Contracted billable hours">
          <Input
            type="number"
            value={q.coverage.billableHours ?? ""}
            onChange={(e) =>
              set({ billableHours: e.target.value ? Number(e.target.value) : null })
            }
            placeholder="e.g. 8"
          />
        </Field>
        <Field label="Latest departure time (optional)">
          <Input
            type="time"
            value={q.coverage.latestDepartureTime ?? ""}
            onChange={(e) =>
              set({ latestDepartureTime: e.target.value || null })
            }
            placeholder="Hard cutoff"
          />
        </Field>
        <Field label="Overtime policy">
          <Select
            value={q.coverage.overtimePolicy}
            onValueChange={(v) => set({ overtimePolicy: v as OvertimePolicy })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No overtime allowed</SelectItem>
              <SelectItem value="approval-required">Overtime requires approval</SelectItem>
              <SelectItem value="pre-approved">Pre-approved overtime</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        {q.coverage.overtimePolicy === "pre-approved" && (
          <Field label="Max overtime hours">
            <Input
              type="number"
              value={q.coverage.maxOvertimeHours ?? ""}
              onChange={(e) =>
                set({ maxOvertimeHours: e.target.value ? Number(e.target.value) : null })
              }
              placeholder="e.g. 2"
            />
          </Field>
        )}
      </div>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────
// Section: Portrait Lighting Preferences  ⭐ NEW — v3.0 Event Setup
// ─────────────────────────────────────────────────────────────
function PortraitCard({
  q, update, open, onToggle,
}: {
  q: Questionnaire;
  update: (p: Partial<Questionnaire>) => void;
  open: boolean;
  onToggle: () => void;
}) {
  const set = (patch: Partial<Questionnaire["portrait"]>) =>
    update({ portrait: { ...q.portrait, ...patch } });
  const selected = PORTRAIT_LIGHTING_OPTIONS.find(
    (o) => o.value === q.portrait.lightingPreference,
  );
  return (
    <SectionCard
      title="Portrait Preferences"
      badge="PROTOTYPE"
      subtitle="Lighting preference drives when OnCue positions the portrait block relative to sunset."
      open={open}
      onToggle={onToggle}
    >
      <div className="mb-3 rounded-md border border-gold/30 bg-blush/5 px-3 py-2 text-xs text-muted-foreground">
        ⚠️ These fields are prototypes — the sunset constraint engine activates in Phase 4.
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Field label="Lighting preference">
            <Select
              value={q.portrait.lightingPreference}
              onValueChange={(v) =>
                set({ lightingPreference: v as PortraitLightingPreference })
              }
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PORTRAIT_LIGHTING_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          {selected && (
            <p className="mt-1.5 text-xs text-muted-foreground">{selected.description}</p>
          )}
        </div>
        <Field label="Priority">
          <Select
            value={q.portrait.lightingPriority}
            onValueChange={(v) =>
              set({ lightingPriority: v as PortraitLightingPriority })
            }
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="nice-to-have">Nice to have</SelectItem>
              <SelectItem value="important">Important</SelectItem>
              <SelectItem value="critical">Critical — hold if possible</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Target portrait block (minutes)">
          <Input
            type="number"
            value={q.portrait.totalMinutesDesired ?? ""}
            onChange={(e) =>
              set({ totalMinutesDesired: e.target.value ? Number(e.target.value) : null })
            }
            placeholder="e.g. 60"
          />
        </Field>
      </div>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────
// Section: Locations
// ─────────────────────────────────────────────────────────────
function LocationsCard({
  q, update, open, onToggle,
}: {
  q: Questionnaire;
  update: (p: Partial<Questionnaire>) => void;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <SectionCard
      title="Locations"
      subtitle={`${q.locations.length} venue${q.locations.length !== 1 ? "s" : ""}`}
      open={open}
      onToggle={onToggle}
      actions={
        <Button
          size="sm"
          variant="outline"
          onClick={() => update({ locations: [...q.locations, newLocation()] })}
        >
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      }
    >
      <div className="space-y-2">
        {q.locations.map((loc, i) => (
          <div
            key={loc.id}
            className="grid gap-2 rounded-md border border-border p-3 md:grid-cols-[160px,1fr,1.5fr,auto]"
          >
            <Input
              value={loc.label}
              onChange={(e) => {
                const next = [...q.locations];
                next[i] = { ...loc, label: e.target.value };
                update({ locations: next });
              }}
              placeholder="Label"
            />
            <Input
              value={loc.name}
              onChange={(e) => {
                const next = [...q.locations];
                next[i] = { ...loc, name: e.target.value };
                update({ locations: next });
              }}
              placeholder="Venue name"
            />
            <Input
              value={loc.address ?? ""}
              onChange={(e) => {
                const next = [...q.locations];
                next[i] = { ...loc, address: e.target.value };
                update({ locations: next });
              }}
              placeholder="Address"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                update({ locations: q.locations.filter((l) => l.id !== loc.id) })
              }
              aria-label="Remove location"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────
// Section: People  (enhanced with v3.0 fields)
// ─────────────────────────────────────────────────────────────
function PeopleCard({
  q, update, open, onToggle,
}: {
  q: Questionnaire;
  update: (p: Partial<Questionnaire>) => void;
  open: boolean;
  onToggle: () => void;
}) {
  const add = (partial: Parameters<typeof newPerson>[0] = {}) =>
    update({ people: [...q.people, newPerson(partial)] });

  return (
    <SectionCard
      title="People"
      subtitle={`${q.people.length} people — photo groups generated from this list`}
      open={open}
      onToggle={onToggle}
      actions={
        <div className="flex flex-wrap gap-1">
          <Button size="sm" variant="outline" onClick={() => add({ group: "couple" })}>
            <Plus className="mr-1 h-3 w-3" /> Couple
          </Button>
          <Button size="sm" variant="outline" onClick={() => add({ group: "parent" })}>
            <Plus className="mr-1 h-3 w-3" /> Parent
          </Button>
          <Button size="sm" variant="outline" onClick={() => add({ group: "sibling" })}>
            <Plus className="mr-1 h-3 w-3" /> Sibling
          </Button>
          <Button size="sm" variant="outline" onClick={() => add()}>
            <Plus className="mr-1 h-3 w-3" /> Person
          </Button>
        </div>
      }
    >
      {q.people.length === 0 && (
        <p className="mb-3 text-sm text-muted-foreground">
          Add the couple first, then families and VIPs. Use the Add buttons above.
        </p>
      )}
      <div className="space-y-2">
        {q.people.map((person, i) => {
          const upd = (patch: Partial<typeof person>) => {
            const next = [...q.people];
            next[i] = { ...person, ...patch };
            update({ people: next });
          };
          return (
            <div key={person.id} className="rounded-md border border-border p-3">
              <div className="grid gap-2 md:grid-cols-[1.5fr,1fr,1fr,1.5fr,auto]">
                <Input
                  value={person.name}
                  onChange={(e) => upd({ name: e.target.value })}
                  placeholder="Full name"
                />
                <Select
                  value={person.side}
                  onValueChange={(v) => upd({ side: v as PersonSide })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="side-a">Side A</SelectItem>
                    <SelectItem value="side-b">Side B</SelectItem>
                    <SelectItem value="shared">Shared</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={person.group}
                  onValueChange={(v) => upd({ group: v as PersonGroup })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PERSON_GROUPS.map((g) => (
                      <SelectItem key={g.group} value={g.group}>{g.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={person.notes ?? ""}
                  onChange={(e) => upd({ notes: e.target.value })}
                  placeholder="Notes"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    update({ people: q.people.filter((p) => p.id !== person.id) })
                  }
                  aria-label="Remove person"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {/* v3.0 constraint fields — PROTOTYPE */}
              <div className="mt-2 grid gap-2 md:grid-cols-[160px,1fr,auto,auto,auto]">
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">
                    Must leave by
                  </label>
                  <Input
                    type="time"
                    value={person.departureConstraintTime ?? ""}
                    onChange={(e) => upd({ departureConstraintTime: e.target.value || undefined })}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="flex items-end gap-3 pb-1">
                  <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={!!person.isVip}
                      onChange={(e) => upd({ isVip: e.target.checked })}
                      className="h-3.5 w-3.5"
                    />
                    VIP — photograph early
                  </label>
                  <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={!!person.arrivalUncertain}
                      onChange={(e) => upd({ arrivalUncertain: e.target.checked })}
                      className="h-3.5 w-3.5"
                    />
                    Arrival uncertain
                  </label>
                  <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={!!person.mobilityConcern}
                      onChange={(e) => upd({ mobilityConcern: e.target.checked })}
                      className="h-3.5 w-3.5"
                    />
                    Mobility concern
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Departure constraints and VIP flags are prototype fields — they will drive scheduling warnings in Phase 4.
      </p>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────
// Section: Vendors  (enhanced with v3.0 departure + setup fields)
// ─────────────────────────────────────────────────────────────
function VendorsCard({
  q, update, open, onToggle,
}: {
  q: Questionnaire;
  update: (p: Partial<Questionnaire>) => void;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <SectionCard
      title="Vendors"
      subtitle={`${q.vendors.length} vendor${q.vendors.length !== 1 ? "s" : ""}`}
      open={open}
      onToggle={onToggle}
      actions={
        <Button
          size="sm"
          variant="outline"
          onClick={() => update({ vendors: [...q.vendors, newVendor()] })}
        >
          <Plus className="mr-1 h-4 w-4" /> Add vendor
        </Button>
      }
    >
      <div className="space-y-2">
        {q.vendors.map((v, i) => {
          const upd = (patch: Partial<typeof v>) => {
            const next = [...q.vendors];
            next[i] = { ...v, ...patch };
            update({ vendors: next });
          };
          return (
            <div key={v.id} className="rounded-md border border-border p-3">
              <div className="grid gap-2 md:grid-cols-[1fr,1.5fr,1.5fr,auto]">
                <Select
                  value={v.role}
                  onValueChange={(val) => upd({ role: val as VendorRole })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {VENDOR_ROLES.map((r) => (
                      <SelectItem key={r.role} value={r.role}>{r.label}</SelectItem>
                    ))}
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={v.name}
                  onChange={(e) => upd({ name: e.target.value })}
                  placeholder="Company / person"
                />
                <Input
                  value={v.contact ?? ""}
                  onChange={(e) => upd({ contact: e.target.value })}
                  placeholder="Phone / email"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    update({ vendors: q.vendors.filter((x) => x.id !== v.id) })
                  }
                  aria-label="Remove vendor"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {/* v3.0 time fields */}
              <div className="mt-2 grid gap-2 md:grid-cols-[140px,140px,160px,1fr]">
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">Arrives</label>
                  <Input
                    type="time"
                    value={v.arrivalTime ?? ""}
                    onChange={(e) => upd({ arrivalTime: e.target.value || undefined })}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">
                    Departs <span className="text-gold">(new)</span>
                  </label>
                  <Input
                    type="time"
                    value={v.departureTime ?? ""}
                    onChange={(e) => upd({ departureTime: e.target.value || undefined })}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">
                    Setup duration (min) <span className="text-gold">(new)</span>
                  </label>
                  <Input
                    type="number"
                    value={v.setupDurationMinutes ?? ""}
                    onChange={(e) =>
                      upd({ setupDurationMinutes: e.target.value ? Number(e.target.value) : undefined })
                    }
                    placeholder="e.g. 60"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Departure time triggers a coverage warning; setup duration lets OnCue reserve a setup block before this vendor's first activity.
      </p>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────
// Section: Family Relationships  (enhanced with PersonA/PersonB and flags)
// ─────────────────────────────────────────────────────────────
function RelationshipsCard({
  q, update, open, onToggle,
}: {
  q: Questionnaire;
  update: (p: Partial<Questionnaire>) => void;
  open: boolean;
  onToggle: () => void;
}) {
  const peopleNames = q.people.map((p) => p.name).filter(Boolean);
  return (
    <SectionCard
      title="Family Relationships"
      subtitle="Flag situations OnCue should respect when generating photo groups."
      open={open}
      onToggle={onToggle}
      actions={
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            update({ relationships: [...q.relationships, newRelationship()] })
          }
        >
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      }
    >
      <div className="space-y-2">
        {q.relationships.map((r, i) => {
          const upd = (patch: Partial<typeof r>) => {
            const next = [...q.relationships];
            next[i] = { ...r, ...patch };
            update({ relationships: next });
          };
          return (
            <div key={r.id} className="rounded-md border border-border p-3">
              <div className="grid gap-2 md:grid-cols-[1fr,1fr,120px,1fr,auto]">
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">Person A</label>
                  <Input
                    list={`people-list-${r.id}-a`}
                    value={r.personAName ?? ""}
                    onChange={(e) => upd({ personAName: e.target.value })}
                    placeholder="Name"
                    className="h-8 text-sm"
                  />
                  <datalist id={`people-list-${r.id}-a`}>
                    {peopleNames.map((n) => <option key={n} value={n} />)}
                  </datalist>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">Person B</label>
                  <Input
                    list={`people-list-${r.id}-b`}
                    value={r.personBName ?? ""}
                    onChange={(e) => upd({ personBName: e.target.value })}
                    placeholder="Name"
                    className="h-8 text-sm"
                  />
                  <datalist id={`people-list-${r.id}-b`}>
                    {peopleNames.map((n) => <option key={n} value={n} />)}
                  </datalist>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">Side</label>
                  <Select
                    value={r.side}
                    onValueChange={(v) => upd({ side: v as PersonSide })}
                  >
                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="side-a">Side A</SelectItem>
                      <SelectItem value="side-b">Side B</SelectItem>
                      <SelectItem value="shared">Shared</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  value={r.note}
                  onChange={(e) => upd({ note: e.target.value })}
                  placeholder="e.g. Divorced — keep apart"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    update({
                      relationships: q.relationships.filter((x) => x.id !== r.id),
                    })
                  }
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-4">
                <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={!!r.cannotBeInSamePhoto}
                    onChange={(e) => upd({ cannotBeInSamePhoto: e.target.checked })}
                    className="h-3.5 w-3.5"
                  />
                  Never in same photo
                </label>
                <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={!!r.mustBePhotographedTogether}
                    onChange={(e) => upd({ mustBePhotographedTogether: e.target.checked })}
                    className="h-3.5 w-3.5"
                  />
                  Must appear together
                </label>
                <Select
                  value={r.kind}
                  onValueChange={(v) => upd({ kind: v as RelationshipKind })}
                >
                  <SelectTrigger className="h-7 w-36 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="remarried">Remarried</SelectItem>
                    <SelectItem value="step">Step</SelectItem>
                    <SelectItem value="single">Single</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────
// Section: Photo Requests
// ─────────────────────────────────────────────────────────────
function PhotoRequestsCard({
  q, update, open, onToggle,
}: {
  q: Questionnaire;
  update: (p: Partial<Questionnaire>) => void;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <SectionCard
      title="Photo Requests"
      subtitle={`${q.photoRequests.length} specific shots or portraits requested`}
      open={open}
      onToggle={onToggle}
      actions={
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            update({ photoRequests: [...q.photoRequests, newPhotoRequest()] })
          }
        >
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      }
    >
      <div className="space-y-2">
        {q.photoRequests.map((r, i) => (
          <div
            key={r.id}
            className="grid gap-2 rounded-md border border-border p-3 md:grid-cols-[1fr,160px,auto]"
          >
            <Input
              value={r.label}
              onChange={(e) => {
                const next = [...q.photoRequests];
                next[i] = { ...r, label: e.target.value };
                update({ photoRequests: next });
              }}
              placeholder="e.g. Aunt Linda Portrait"
            />
            <Select
              value={r.priority}
              onValueChange={(v) => {
                const next = [...q.photoRequests];
                next[i] = { ...r, priority: v as "high" | "medium" | "low" };
                update({ photoRequests: next });
              }}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High priority</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                update({
                  photoRequests: q.photoRequests.filter((x) => x.id !== r.id),
                })
              }
              aria-label="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────
// Section: Timeline Priorities
// ─────────────────────────────────────────────────────────────
function PrioritiesCard({
  q, update, open, onToggle,
}: {
  q: Questionnaire;
  update: (p: Partial<Questionnaire>) => void;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <SectionCard
      title="Timeline Priorities"
      subtitle="Tell OnCue what must hold, what should hold, and what can flex."
      open={open}
      onToggle={onToggle}
      actions={
        <Button
          size="sm"
          variant="outline"
          onClick={() => update({ priorities: [...q.priorities, newPriority()] })}
        >
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      }
    >
      <div className="space-y-2">
        {q.priorities.map((p, i) => (
          <div
            key={p.id}
            className="grid gap-2 rounded-md border border-border p-3 md:grid-cols-[1fr,180px,auto]"
          >
            <Input
              value={p.label}
              onChange={(e) => {
                const next = [...q.priorities];
                next[i] = { ...p, label: e.target.value };
                update({ priorities: next });
              }}
              placeholder="e.g. Sunset portraits important"
            />
            <Select
              value={p.importance}
              onValueChange={(v) => {
                const next = [...q.priorities];
                next[i] = { ...p, importance: v as "must" | "important" | "flexible" };
                update({ priorities: next });
              }}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="must">Must hold</SelectItem>
                <SelectItem value="important">Important</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                update({ priorities: q.priorities.filter((x) => x.id !== p.id) })
              }
              aria-label="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────
// Section: Notes
// ─────────────────────────────────────────────────────────────
function NotesCard({
  q, update, open, onToggle,
}: {
  q: Questionnaire;
  update: (p: Partial<Questionnaire>) => void;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <SectionCard title="Special Notes" open={open} onToggle={onToggle}>
      <Textarea
        value={q.notes}
        onChange={(e) => update({ notes: e.target.value })}
        placeholder="Allergies, accessibility, surprises, weather contingencies, anything OnCue should keep in mind."
        rows={4}
      />
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────
// Generation preview
// ⚠️ DEMO ONLY — frontend starter generator output; not real persistence.
// ─────────────────────────────────────────────────────────────
function PreviewCard({ preview }: { preview: GenerationResult }) {
  return (
    <Card className="border-gold/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" /> Generated Starter Kit
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          ⚠️ Demo only — generated from frontend stubs. Phase 3 replaces with real solver output.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            People ({preview.people.length})
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {preview.people.map((p) => (
              <Badge key={p.id} variant="secondary">
                {p.name || "Unnamed"} · {p.group}
              </Badge>
            ))}
            {preview.people.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Add people in the People section to generate groups.
              </p>
            )}
          </div>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Photo Groups ({preview.photoGroups.length})
          </h3>
          <ol className="space-y-2">
            {preview.photoGroups.map((g, i) => (
              <li key={g.id} className="rounded-md border border-border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{i + 1}. {g.name}</span>
                  <Badge variant="outline">{g.minutes}m</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{g.people.join(", ")}</p>
              </li>
            ))}
          </ol>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Starter Timeline ({preview.activities.length})
          </h3>
          <ol className="space-y-2">
            {preview.activities.map((a) => (
              <li
                key={a.id}
                className="flex items-start justify-between gap-4 rounded-md border border-border p-3 text-sm"
              >
                <div>
                  <div className="font-medium">
                    {a.title}{" "}
                    {a.isAnchor && (
                      <Badge variant="outline" className="ml-1">Fixed Timing</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {a.ownerRole}
                    {a.location ? ` · ${a.location}` : ""}
                    {a.anchorReason ? ` · ${a.anchorReason}` : ""}
                  </p>
                </div>
                <div className="text-right text-xs">
                  <div className="font-mono">{a.startTime}</div>
                  <div className="text-muted-foreground">{a.duration}m</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Checklist Items ({preview.checklist.length})
          </h3>
          <ul className="space-y-1 text-sm">
            {preview.checklist.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3">
                <span>{c.label}</span>
                <span className="text-xs text-muted-foreground">
                  {c.ownerRole} · {c.activityTitle}
                </span>
              </li>
            ))}
            {preview.checklist.length === 0 && (
              <p className="text-muted-foreground">
                Add photo requests and vendor arrival times to seed the checklist.
              </p>
            )}
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}
