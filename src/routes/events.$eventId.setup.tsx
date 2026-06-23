import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Trash2, Plus, Sparkles, Save } from "lucide-react";
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
  saveQuestionnaire,
  VENDOR_ROLES,
  type GenerationResult,
  type PersonGroup,
  type PersonSide,
  type Questionnaire,
  type RelationshipKind,
  type VendorRole,
} from "@/lib/questionnaire";

export const Route = createFileRoute("/events/$eventId/setup")({
  component: SetupPage,
});

function SetupPage() {
  const { eventId } = useParams({ from: "/events/$eventId/setup" });
  // ⚠️ DEMO ONLY: questionnaire state is loaded from localStorage and mutated
  // in memory. Replace with real event data + API mutations before launch.
  const [q, setQ] = useState<Questionnaire>(() => emptyQuestionnaire(eventId));
  const [hydrated, setHydrated] = useState(false);
  const [preview, setPreview] = useState<GenerationResult | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

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
    // ⚠️ DEMO ONLY: runs the frontend starter generator and shows a preview.
    // Generated data is not committed to the real timeline in this MVP.
    saveQuestionnaire(q);
    setPreview(generateAll(q));
    setSavedAt(new Date().toLocaleTimeString());
  };

  const completion = useMemo(() => computeCompletion(q), [q]);

  if (!hydrated) {
    return <div className="p-10 text-muted-foreground">Loading questionnaire…</div>;
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-6 p-4 md:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Event Setup
          </p>
          <h1 className="font-display text-3xl text-foreground">Questionnaire</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Collect the raw facts of your event. OnCue uses these to generate your
            people roster, photo groups, checklist, and a starter timeline.
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
        <p className="text-xs text-muted-foreground">Saved at {savedAt}</p>
      )}

      <BasicsCard q={q} update={update} />
      <LocationsCard q={q} update={update} />
      <PeopleCard q={q} update={update} />
      <VendorsCard q={q} update={update} />
      <RelationshipsCard q={q} update={update} />
      <PhotoRequestsCard q={q} update={update} />
      <PrioritiesCard q={q} update={update} />
      <NotesCard q={q} update={update} />

      {preview && <PreviewCard preview={preview} />}
    </div>
  );
}

function computeCompletion(q: Questionnaire): number {
  let score = 0;
  let total = 0;
  const inc = (cond: boolean) => {
    total += 1;
    if (cond) score += 1;
  };
  inc(!!q.basics.name);
  inc(!!q.basics.date);
  inc(!!q.basics.startTime);
  inc(q.locations.some((l) => l.name));
  inc(q.people.length > 0);
  inc(q.people.some((p) => p.group === "couple"));
  inc(q.vendors.length > 0);
  inc(q.priorities.length > 0);
  return Math.round((score / total) * 100);
}

// ============================================================
// Section: Basics
// ============================================================
function BasicsCard({
  q,
  update,
}: {
  q: Questionnaire;
  update: (p: Partial<Questionnaire>) => void;
}) {
  const set = (patch: Partial<Questionnaire["basics"]>) =>
    update({ basics: { ...q.basics, ...patch } });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Basics</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
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
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
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
      </CardContent>
    </Card>
  );
}

// ============================================================
// Section: Locations
// ============================================================
function LocationsCard({
  q,
  update,
}: {
  q: Questionnaire;
  update: (p: Partial<Questionnaire>) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Locations</CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() => update({ locations: [...q.locations, newLocation()] })}
        >
          <Plus className="mr-1 h-4 w-4" /> Add location
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
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
      </CardContent>
    </Card>
  );
}

// ============================================================
// Section: People
// ============================================================
function PeopleCard({
  q,
  update,
}: {
  q: Questionnaire;
  update: (p: Partial<Questionnaire>) => void;
}) {
  const add = (partial: Parameters<typeof newPerson>[0] = {}) =>
    update({ people: [...q.people, newPerson(partial)] });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>People</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            People are editable independently. Photo Groups are generated from this
            list.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => add({ group: "couple" })}>
            <Plus className="mr-1 h-4 w-4" /> Couple
          </Button>
          <Button size="sm" variant="outline" onClick={() => add({ group: "parent" })}>
            <Plus className="mr-1 h-4 w-4" /> Parent
          </Button>
          <Button size="sm" variant="outline" onClick={() => add({ group: "sibling" })}>
            <Plus className="mr-1 h-4 w-4" /> Sibling
          </Button>
          <Button size="sm" variant="outline" onClick={() => add()}>
            <Plus className="mr-1 h-4 w-4" /> Person
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {q.people.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Add the couple first, then their families and any VIPs.
          </p>
        )}
        {q.people.map((person, i) => (
          <div
            key={person.id}
            className="grid gap-2 rounded-md border border-border p-3 md:grid-cols-[1.5fr,1fr,1fr,1.5fr,auto]"
          >
            <Input
              value={person.name}
              onChange={(e) => {
                const next = [...q.people];
                next[i] = { ...person, name: e.target.value };
                update({ people: next });
              }}
              placeholder="Full name"
            />
            <Select
              value={person.side}
              onValueChange={(v) => {
                const next = [...q.people];
                next[i] = { ...person, side: v as PersonSide };
                update({ people: next });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="side-a">Side A</SelectItem>
                <SelectItem value="side-b">Side B</SelectItem>
                <SelectItem value="shared">Shared</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={person.group}
              onValueChange={(v) => {
                const next = [...q.people];
                next[i] = { ...person, group: v as PersonGroup };
                update({ people: next });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERSON_GROUPS.map((g) => (
                  <SelectItem key={g.group} value={g.group}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={person.notes ?? ""}
              onChange={(e) => {
                const next = [...q.people];
                next[i] = { ...person, notes: e.target.value };
                update({ people: next });
              }}
              placeholder="Notes (mobility, conflicts, etc.)"
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
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================================
// Section: Vendors / Participants
// ============================================================
function VendorsCard({
  q,
  update,
}: {
  q: Questionnaire;
  update: (p: Partial<Questionnaire>) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Vendors & Participants</CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() => update({ vendors: [...q.vendors, newVendor()] })}
        >
          <Plus className="mr-1 h-4 w-4" /> Add vendor
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {q.vendors.map((v, i) => (
          <div
            key={v.id}
            className="grid gap-2 rounded-md border border-border p-3 md:grid-cols-[1fr,1.5fr,1.5fr,120px,auto]"
          >
            <Select
              value={v.role}
              onValueChange={(val) => {
                const next = [...q.vendors];
                next[i] = { ...v, role: val as VendorRole };
                update({ vendors: next });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VENDOR_ROLES.map((r) => (
                  <SelectItem key={r.role} value={r.role}>
                    {r.label}
                  </SelectItem>
                ))}
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={v.name}
              onChange={(e) => {
                const next = [...q.vendors];
                next[i] = { ...v, name: e.target.value };
                update({ vendors: next });
              }}
              placeholder="Company / person"
            />
            <Input
              value={v.contact ?? ""}
              onChange={(e) => {
                const next = [...q.vendors];
                next[i] = { ...v, contact: e.target.value };
                update({ vendors: next });
              }}
              placeholder="Phone / email"
            />
            <Input
              type="time"
              value={v.arrivalTime ?? ""}
              onChange={(e) => {
                const next = [...q.vendors];
                next[i] = { ...v, arrivalTime: e.target.value };
                update({ vendors: next });
              }}
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
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================================
// Section: Relationships
// ============================================================
function RelationshipsCard({
  q,
  update,
}: {
  q: Questionnaire;
  update: (p: Partial<Questionnaire>) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Family Relationships</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Flag situations OnCue should respect when generating photo groups —
            divorces, step-parents, kept-apart pairs, and so on.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            update({ relationships: [...q.relationships, newRelationship()] })
          }
        >
          <Plus className="mr-1 h-4 w-4" /> Add relationship
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {q.relationships.map((r, i) => (
          <div
            key={r.id}
            className="grid gap-2 rounded-md border border-border p-3 md:grid-cols-[140px,140px,1fr,auto]"
          >
            <Select
              value={r.kind}
              onValueChange={(v) => {
                const next = [...q.relationships];
                next[i] = { ...r, kind: v as RelationshipKind };
                update({ relationships: next });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="remarried">Remarried</SelectItem>
                <SelectItem value="step">Step</SelectItem>
                <SelectItem value="single">Single</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={r.side}
              onValueChange={(v) => {
                const next = [...q.relationships];
                next[i] = { ...r, side: v as PersonSide };
                update({ relationships: next });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="side-a">Side A</SelectItem>
                <SelectItem value="side-b">Side B</SelectItem>
                <SelectItem value="shared">Shared</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={r.note}
              onChange={(e) => {
                const next = [...q.relationships];
                next[i] = { ...r, note: e.target.value };
                update({ relationships: next });
              }}
              placeholder="e.g. Parents divorced — keep separate in photos"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                update({
                  relationships: q.relationships.filter((x) => x.id !== r.id),
                })
              }
              aria-label="Remove relationship"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================================
// Section: Photo Requests
// ============================================================
function PhotoRequestsCard({
  q,
  update,
}: {
  q: Questionnaire;
  update: (p: Partial<Questionnaire>) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Photo Requests</CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            update({ photoRequests: [...q.photoRequests, newPhotoRequest()] })
          }
        >
          <Plus className="mr-1 h-4 w-4" /> Add request
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
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
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
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
              aria-label="Remove request"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================================
// Section: Timeline Priorities
// ============================================================
function PrioritiesCard({
  q,
  update,
}: {
  q: Questionnaire;
  update: (p: Partial<Questionnaire>) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Timeline Priorities</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Tell OnCue what must hold, what should hold, and what can flex.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => update({ priorities: [...q.priorities, newPriority()] })}
        >
          <Plus className="mr-1 h-4 w-4" /> Add priority
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
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
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
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
              aria-label="Remove priority"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================================
// Section: Notes
// ============================================================
function NotesCard({
  q,
  update,
}: {
  q: Questionnaire;
  update: (p: Partial<Questionnaire>) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Special Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={q.notes}
          onChange={(e) => update({ notes: e.target.value })}
          placeholder="Allergies, accessibility, surprises, weather contingencies, anything OnCue should keep in mind."
          rows={4}
        />
      </CardContent>
    </Card>
  );
}

// ============================================================
// Generation preview
// ⚠️ DEMO ONLY: displays the output of the frontend starter generator.
// This preview is not persisted to the real timeline in the MVP.
// ============================================================
function PreviewCard({ preview }: { preview: GenerationResult }) {
  return (
    <Card className="border-gold/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" /> Generated Starter Kit
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          OnCue derived this from your questionnaire. Regenerate any time —
          people remain editable on their own.
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
              <li
                key={g.id}
                className="rounded-md border border-border p-3 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {i + 1}. {g.name}
                  </span>
                  <Badge variant="outline">{g.minutes}m</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {g.people.join(", ")}
                </p>
              </li>
            ))}
            {preview.photoGroups.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No groups yet — add at least the couple and one family member.
              </p>
            )}
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
                      <Badge variant="outline" className="ml-1">
                        Fixed Timing
                      </Badge>
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}
