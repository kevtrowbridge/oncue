/**
 * ⚠️ DEMO ONLY — TEMPORARY DATA LAYER
 *
 * All data in this file is hardcoded mock arrays and frontend heuristics.
 * This file is the placeholder intelligence engine for Phase 2 of the
 * oncue/event-flow-master merge. It will be replaced in Phase 4 by a real
 * constraint solver backed by Supabase (Phase 3) and the OnCue intelligence
 * engine (Phase 4).
 *
 * DO NOT treat this as production logic.
 * DO NOT build real features against these heuristics.
 * DO NOT persist any data from this layer to a real database.
 *
 * Replaced in: Phase 4 (real intelligence engine + Supabase persistence)
 */

/**
 * OnCue MOCK data + PROTOTYPE Timeline Intelligence engine.
 *
 * ⚠️ PROTOTYPE / DEMO ONLY: Everything in this file is frontend mock logic.
 * It uses hard-coded seed data and in-memory mutation. None of the scores,
 * recommendations, or status explanations are persisted or produced by a real
 * backend/domain engine. When the app moves to production architecture, this
 * entire module should be replaced by a server-side timeline solver and a real
 * event repository.
 *
 * Every derived value (health, buffer, conflicts, change impact, status
 * explanation) is returned with plain-language reasoning the UI can
 * surface as-is — OnCue's job is to *explain* the timeline, not just
 * display it.
 */

export type ActivityStatus =
  | "on-track"
  | "needs-adjustment" // formerly "shifting"
  | "delayed"
  | "recalculating"
  | "conflict"
  | "at-risk"
  | "complete";

export type EventStatus = "planning" | "on-track" | "draft" | "complete";
export type EventType = "wedding" | "conference" | "corporate-summit" | "production";

export interface RelationalBuffer {
  before: number;
  after: number;
  travelBefore: number;
  travelAfter: number;
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
  /** owner role responsible — surfaces in master checklist */
  owner?: string;
  /** activityId this item currently lives under (mutable via drag) */
  activityId: string;
  /** if reassigned from another activity, where it came from */
  reassignedFrom?: string;
}

export interface LocationInfo {
  /** Location name shown to the user (e.g. "Garden Terrace"). */
  name: string;
  /** Postal address — feeds Google Maps when wired up. */
  address?: string;
  /** Estimated travel-time (min). Populated by Google Maps API later. */
  travelEstimateMin?: number;
  /** Where the travel estimate came from. */
  travelEstimateSource?: "manual" | "google-maps" | "estimate";
}

export interface Activity {
  id: string;
  eventId: string;
  title: string;
  start: string;
  duration: number;
  minDuration: number;
  /** Display location — kept for back-compat with existing UI. */
  location: string;
  /** Structured location, ready for Google Maps wiring. */
  locationInfo?: LocationInfo;
  owner: string;
  ownerRole: string;
  priority: "high" | "medium" | "low";
  dependencies: string[];
  buffers: RelationalBuffer;
  notes?: string;
  checklist: ChecklistItem[];
  /** Fixed Timing — can't move (ceremony start, sunset, vendor contract). */
  isAnchor: boolean;
  /** Reason the activity is fixed, surfaced in tooltips. */
  anchorReason?: string;
  isOptional: boolean;
  status: ActivityStatus;
  /** Minutes the activity is currently running behind (or ahead, negative). */
  delayMinutes?: number;
  /** Activity that *caused* this one's status, if any. */
  causedBy?: string;
  confidence: "confirmed" | "estimated" | "assumed";
  meta?: { photoPriority?: number };
}


// ============================================================
// Plain-language terminology dictionary — used by tooltips
// ============================================================

export const TERMS: Record<string, string> = {
  Dependency:
    "A Dependency means this activity can't start until another one finishes. If the earlier activity runs long, this one moves with it.",
  Anchor:
    "An Anchor is an activity with Fixed Timing — it's tied to an outside constraint like a ceremony, a sunset, or a vendor contract. OnCue protects anchors from being pushed by upstream delays.",
  "Fixed Timing":
    "Fixed Timing means the activity's start cannot move. Everything else flexes around it. Common examples: ceremony start, sunset window, officiant arrival.",
  "Timeline Health":
    "Timeline Health is OnCue's at-a-glance read on how safe the day is. It accounts for protected anchors, available buffer, and any conflicts.",
  "Timeline Health Score":
    "A 0–100 score. 100 means every fixed activity is protected and every handoff has breathing room. The score drops as conflicts and adjustments appear.",
  "Needs Adjustment":
    "OnCue thinks this activity should be reviewed — usually because it's running long, has low confidence, or sits in a tight handoff.",
  Recalculating:
    "OnCue is updating downstream start times because something upstream changed. The new times appear once recalculation is done.",
  "Alternative Path":
    "An Alternative Path is a different way to resolve a conflict — shorten the next activity, defer an optional one, or absorb the delay with buffer.",
  Delayed:
    "Delayed means the activity has officially started later than planned. Downstream activities may need to shift unless time is recovered.",
  Conflict:
    "A Conflict is two activities trying to occupy the same time, or a handoff with too little setup. It will cause a real delay if not resolved.",
  "At Risk":
    "At Risk means a Fixed-Timing activity (Anchor) will be missed unless the schedule is adjusted now.",
  Buffer:
    "Buffer is the unused time between activities. It's the cushion that absorbs running-over without pushing fixed activities.",
};

/** Photo group used by the Family Group Optimizer. */
export type PhotoGroupKind =
  | "bride-side"
  | "shared"
  | "groom-side"
  | "custom";

export interface PhotoGroup {
  id: string;
  eventId: string;
  name: string;
  kind: PhotoGroupKind;
  people: string[];
  /** estimated minutes to set up + shoot this group */
  minutes: number;
  order: number;
  deferred?: boolean;
  /** People marked missing — affects flow and timing. */
  missing?: string[];
}

export interface OnCueEvent {
  id: string;
  name: string;
  type: EventType;
  date: string;
  location: string;
  status: EventStatus;
  health: "good" | "watch" | "risk";
  ownerTeam: string;
}

// ============================================================
// FIXED DATES — deterministic across SSR + client to avoid
// hydration mismatches. Times are absolute (UTC "Z").
// ============================================================

export const EVENTS: OnCueEvent[] = [
  {
    id: "evt-sarah-daniel",
    name: "Sarah & Daniel Wedding",
    type: "wedding",
    date: "2026-07-05",
    location: "The Grand Estate",
    status: "on-track",
    health: "good",
    ownerTeam: "Alex Carter (Planner)",
  },
  {
    id: "evt-summit-2026",
    name: "Corporate Summit 2026",
    type: "corporate-summit",
    date: "2026-08-12",
    location: "Cape Town ICC",
    status: "planning",
    health: "watch",
    ownerTeam: "Mira Okafor",
  },
  {
    id: "evt-product-day",
    name: "Product Experience Day",
    type: "production",
    date: "2026-09-22",
    location: "The Foundry",
    status: "draft",
    health: "good",
    ownerTeam: "Jordan Lee",
  },
];

/** Deterministic UTC ISO timestamp — same on server and client. */
const t = (date: string, hh: number, mm: number) =>
  `${date}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00.000Z`;

/** Format a UTC ISO time as a short clock — locale + tz fixed for hydration. */
export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

/** Format a date string (YYYY-MM-DD) in a fixed locale/tz. */
export function fmtDate(date: string, opts: Intl.DateTimeFormatOptions = {}) {
  return new Date(`${date}T12:00:00.000Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
    ...opts,
  });
}

const weddingDate = EVENTS[0].date;
const e = EVENTS[0].id;

// ============================================================
// Activities — wedding day timeline
// ⚠️ SEED / MOCK DATA: hard-coded demo timeline. Replace with real
// persisted activities loaded from the backend before launch.
// ============================================================

export const ACTIVITIES: Activity[] = [
  mk("a-010", "Getting Ready", 7, 30, 90, "Bridal Suite", "Hair & Makeup", [], {
    checklist: [
      { id: "gr-1", label: "Shoes", done: true },
      { id: "gr-2", label: "Rings", done: false },
      { id: "gr-3", label: "Bouquet Charm", done: false },
      { id: "gr-4", label: "Vows card", done: true },
    ],
  }),
  mk("a-020", "Detail Photos", 8, 15, 30, "Bridal Suite", "Photographer", ["a-010"], {
    status: "complete",
  }),
  mk("a-030", "First Look", 9, 15, 30, "Garden Terrace", "Photographer", ["a-020"], {
    priority: "high",
    notes: "Best natural light window. Keep private until start.",
    status: "complete",
  }),
  mk("a-040", "Couple Portraits", 9, 45, 45, "Garden Terrace", "Photographer", ["a-030"], {
    status: "delayed",
    delayMinutes: 10,
    causedBy: "a-030",
    priority: "high",
  }),
  mk("a-050", "Wedding Party Photos", 10, 30, 45, "Garden Terrace", "Photographer", ["a-040"], {
    status: "needs-adjustment",
    causedBy: "a-040",
  }),
  mk("a-060", "Family Photos", 11, 15, 45, "Garden Terrace", "Photographer", ["a-050"], {
    meta: { photoPriority: 1 },
    status: "needs-adjustment",
    causedBy: "a-040",
    checklist: [
      { id: "fp-1", label: "Aunt Linda Portrait", done: false },
      { id: "fp-2", label: "Grandparents Portrait", done: false },
      { id: "fp-3", label: "Both sets of parents", done: false },
    ],
  }),
  mk("a-070", "Travel to Ceremony", 12, 0, 15, "Garden Terrace → Chapel", "Coordinator", ["a-060"]),
  mk("a-080", "Ceremony", 12, 15, 30, "The Chapel", "Officiant", ["a-070"], {
    isAnchor: true,
    priority: "high",
    anchorReason: "Officiant booked for 12:15 — start time cannot move.",
  }),
  mk("a-090", "Recessional", 12, 45, 15, "The Chapel", "Coordinator", ["a-080"]),
  mk("a-100", "Cocktail Hour", 13, 0, 60, "East Lawn", "Bar Lead", ["a-090"]),
  mk("a-110", "Reception Introduction", 14, 0, 15, "Grand Ballroom", "MC", ["a-100"], {
    isAnchor: true,
    anchorReason: "Catering plated for 14:15 — entrance must precede service.",
  }),
  mk("a-120", "Dinner Service", 14, 15, 60, "Grand Ballroom", "Catering Lead", ["a-110"]),
  mk("a-130", "Speeches", 15, 15, 30, "Grand Ballroom", "MC", ["a-120"]),
  mk("a-140", "First Dance & Open Floor", 15, 45, 120, "Grand Ballroom", "DJ", ["a-130"]),
  mk("a-150", "Sunset Portraits", 17, 45, 20, "West Lawn", "Photographer", ["a-140"], {
    isOptional: true,
    isAnchor: true,
    anchorReason: "Sunset is at 18:05 — natural-light window cannot shift.",
    notes: "Weather window 18:15 PM",
  }),
  mk("a-160", "Cake Cutting", 18, 15, 15, "Grand Ballroom", "Coordinator", ["a-150"]),
  mk("a-170", "Send Off", 18, 30, 15, "Grand Entrance", "Coordinator", ["a-160"]),
];

function mk(
  id: string,
  title: string,
  hh: number,
  mm: number,
  duration: number,
  location: string,
  ownerRole: string,
  dependencies: string[],
  opts: Omit<Partial<Activity>, "checklist"> & { checklist?: { id: string; label: string; done: boolean; owner?: string }[] } = {},
): Activity {
  const { checklist: rawChecklist, ...rest } = opts;
  const checklist: ChecklistItem[] = (
    rawChecklist ?? [
      { id: "c1", label: "Confirm with owner", done: true },
      { id: "c2", label: "Verify location ready", done: false },
    ]
  ).map((c) => ({ ...c, activityId: id, owner: c.owner ?? ownerRole }));
  return {
    id,
    eventId: e,
    title,
    start: t(weddingDate, hh, mm),
    duration,
    minDuration: Math.max(10, Math.round(duration * 0.6)),
    location,
    owner: ownerRole,
    ownerRole,
    priority: "medium",
    dependencies,
    buffers: { before: 5, after: 5, travelBefore: 0, travelAfter: 0 },
    notes: undefined,
    checklist: checklist as unknown as Activity["checklist"],
    isAnchor: false,
    isOptional: false,
    status: "on-track",
    confidence: "confirmed",
    ...rest,
  } as Activity;
}


// ============================================================
// Family roster + photo groups (Optimizer V2)
// ⚠️ MOCK DATA: hard-coded roster used to demo the Family Group
// Optimizer. Real people should come from the questionnaire/event API.
// ============================================================

type PersonRole =
  | "bride"
  | "groom"
  | "bride-parent"
  | "groom-parent"
  | "bride-sibling"
  | "groom-sibling"
  | "bride-grandparent"
  | "groom-grandparent"
  | "bride-extended"
  | "groom-extended";

interface Person {
  id: string;
  name: string;
  role: PersonRole;
}

const ROSTER: Person[] = [
  { id: "p1", name: "Sarah (Bride)", role: "bride" },
  { id: "p2", name: "Daniel (Groom)", role: "groom" },
  { id: "p3", name: "Mother of Bride", role: "bride-parent" },
  { id: "p4", name: "Father of Bride", role: "bride-parent" },
  { id: "p5", name: "Sister of Bride", role: "bride-sibling" },
  { id: "p6", name: "Mother of Groom", role: "groom-parent" },
  { id: "p7", name: "Father of Groom", role: "groom-parent" },
  { id: "p8", name: "Brother of Groom", role: "groom-sibling" },
  { id: "p9", name: "Grandma Rose (Bride)", role: "bride-grandparent" },
  { id: "p10", name: "Grandpa Bill (Bride)", role: "bride-grandparent" },
  { id: "p11", name: "Aunt Linda (Bride)", role: "bride-extended" },
  { id: "p12", name: "Uncle Pete (Bride)", role: "bride-extended" },
  { id: "p13", name: "Grandma Iris (Groom)", role: "groom-grandparent" },
  { id: "p14", name: "Aunt Mara (Groom)", role: "groom-extended" },
];

const nameOf = (ids: string[]) => ids.map((i) => ROSTER.find((r) => r.id === i)!.name);

/**
 * Default sequence (approved):
 *  Bride side (extended → parents)
 *  Shared (both sets)
 *  Groom side (parents → extended)
 *
 * Immediate Family = Parents + Siblings.
 * Bride + Groom remain included by default in every group.
 */
export function generatePhotoGroups(eventId: string): PhotoGroup[] {
  const bride = "p1";
  const groom = "p2";
  const brideParents = ROSTER.filter((p) => p.role === "bride-parent").map((p) => p.id);
  const brideSiblings = ROSTER.filter((p) => p.role === "bride-sibling").map((p) => p.id);
  const brideGrand = ROSTER.filter((p) => p.role === "bride-grandparent").map((p) => p.id);
  const brideExt = ROSTER.filter((p) => p.role === "bride-extended").map((p) => p.id);
  const groomParents = ROSTER.filter((p) => p.role === "groom-parent").map((p) => p.id);
  const groomSiblings = ROSTER.filter((p) => p.role === "groom-sibling").map((p) => p.id);
  const groomGrand = ROSTER.filter((p) => p.role === "groom-grandparent").map((p) => p.id);
  const groomExt = ROSTER.filter((p) => p.role === "groom-extended").map((p) => p.id);

  const seq: Omit<PhotoGroup, "id" | "order" | "eventId">[] = [
    // Bride Side
    { name: "Couple + Bride Extended Family", kind: "bride-side", people: nameOf([bride, groom, ...brideExt]), minutes: 5 },
    { name: "Couple + Bride Grandparents", kind: "bride-side", people: nameOf([bride, groom, ...brideGrand]), minutes: 4 },
    { name: "Couple + Bride Siblings", kind: "bride-side", people: nameOf([bride, groom, ...brideSiblings]), minutes: 3 },
    { name: "Couple + Bride Immediate Family", kind: "bride-side", people: nameOf([bride, groom, ...brideParents, ...brideSiblings]), minutes: 5 },
    { name: "Couple + Bride Parents", kind: "bride-side", people: nameOf([bride, groom, ...brideParents]), minutes: 4 },
    // Shared
    { name: "Couple + Both Sets of Parents", kind: "shared", people: nameOf([bride, groom, ...brideParents, ...groomParents]), minutes: 5 },
    // Groom Side
    { name: "Couple + Groom Parents", kind: "groom-side", people: nameOf([bride, groom, ...groomParents]), minutes: 4 },
    { name: "Couple + Groom Immediate Family", kind: "groom-side", people: nameOf([bride, groom, ...groomParents, ...groomSiblings]), minutes: 5 },
    { name: "Couple + Groom Siblings", kind: "groom-side", people: nameOf([bride, groom, ...groomSiblings]), minutes: 3 },
    { name: "Couple + Groom Grandparents", kind: "groom-side", people: nameOf([bride, groom, ...groomGrand]), minutes: 4 },
    { name: "Couple + Groom Extended Family", kind: "groom-side", people: nameOf([bride, groom, ...groomExt]), minutes: 5 },
  ];

  return seq.map((g, i) => ({
    id: `pg-${i + 1}`,
    eventId,
    order: i + 1,
    ...g,
  }));
}

// ============================================================
// Missing-Person flow
// ⚠️ DEMO HEURISTIC: this scoring is a lightweight frontend stand-in for
// the real group-sequencing optimizer. It is not persisted and should not
// be treated as the production recommendation engine.
// ============================================================

export interface MissingPersonOption {
  id: "continue" | "reverse" | "switch-side" | "wait";
  label: string;
  description: string;
  /** Short plain-language rationale shown under each option. */
  reason: string;
  estimatedDelayMin: number;
  affected: string[];
  recommended?: boolean;
}


export interface MissingPersonImpact {
  person: string;
  group: string;
  why: string;
  options: MissingPersonOption[];
}

export function simulateMissingPerson(
  groups: PhotoGroup[],
  groupIdx: number,
  person: string,
): MissingPersonImpact {
  const g = groups[groupIdx];
  const remaining = groups.slice(groupIdx).filter((x) => !x.deferred);
  const sameSide = remaining.filter((x) => x.kind === g.kind);
  const oppositeKind = g.kind === "bride-side" ? "groom-side" : "bride-side";
  const oppositeSide = remaining.filter((x) => x.kind === oppositeKind);

  // Smarter scoring — considers who's gathered, who's missing, what can be
  // completed without this person, and how fast people can be released.
  const needsPerson = remaining.filter((x) => x.people.includes(person));
  const sameSideWithoutPerson = sameSide.filter((x) => !x.people.includes(person));
  const newPeopleForOppositeSide = oppositeSide[0]
    ? oppositeSide[0].people.filter((p) => !g.people.includes(p)).length
    : 99;

  const waitDelay = Math.max(8, needsPerson.length * 2);
  const reverseDelay = Math.max(2, Math.round(sameSideWithoutPerson.length * 0.5));

  // Score each option; highest wins "recommended".
  const score = {
    continue: needsPerson.length <= 1 ? 8 : 4,
    reverse: sameSideWithoutPerson.length >= 1 ? 9 + sameSideWithoutPerson.length : 2,
    switchSide:
      newPeopleForOppositeSide <= 1
        ? 7
        : newPeopleForOppositeSide <= 3
          ? 4
          : 1,
    wait: needsPerson.length >= 3 ? 5 : 1,
  };
  const winner = Object.entries(score).sort((a, b) => b[1] - a[1])[0][0];

  const options: MissingPersonOption[] = [
    {
      id: "continue",
      label: "Continue current sequence",
      description: "Skip this group for now and keep moving — circle back when they arrive.",
      reason:
        needsPerson.length <= 1
          ? `Only one group needs ${person}. Skipping releases everyone else immediately.`
          : `${person} appears in ${needsPerson.length} remaining groups, so skipping doesn't unblock much.`,
      estimatedDelayMin: 0,
      affected: [g.name],
      recommended: winner === "continue",
    },
    {
      id: "reverse",
      label: "Reverse the remaining sequence",
      description: "Shoot the same side in reverse order so groups that don't need this person finish first.",
      reason:
        sameSideWithoutPerson.length >= 1
          ? `Recommended because this keeps the current gathered family moving and avoids calling a new group. ${sameSideWithoutPerson.length} same-side group${sameSideWithoutPerson.length === 1 ? "" : "s"} can still complete without ${person}.`
          : `Every remaining same-side group needs ${person}, so reversing doesn't help much.`,
      estimatedDelayMin: reverseDelay,
      affected: sameSideWithoutPerson.map((x) => x.name),
      recommended: winner === "reverse",
    },
    {
      id: "switch-side",
      label: `Switch to the ${oppositeKind === "bride-side" ? "bride" : "groom"} side`,
      description: "Move to the opposite family while we wait — preserves momentum and uses the time.",
      reason:
        newPeopleForOppositeSide <= 1
          ? `Almost everyone needed for the next ${oppositeKind === "bride-side" ? "bride" : "groom"}-side group is already here.`
          : `Switching sides means gathering ${newPeopleForOppositeSide} new people — slower than reversing the current side.`,
      estimatedDelayMin: newPeopleForOppositeSide * 2,
      affected: oppositeSide.slice(0, 2).map((x) => x.name),
      recommended: winner === "switchSide",
    },
    {
      id: "wait",
      label: "Wait for them",
      description: "Pause the photo block until they arrive.",
      reason: `Holding the whole block risks pushing Family Photos and Travel to Ceremony — only worth it if ${person} is needed in many remaining groups.`,
      estimatedDelayMin: waitDelay,
      affected: remaining.map((x) => x.name),
      recommended: winner === "wait",
    },
  ];

  return {
    person,
    group: g.name,
    why: `${person} hasn't arrived for "${g.name}". Holding the sequence stalls the whole photo block.`,
    options,
  };
}

// ============================================================
// Lookups + mutation
// ============================================================

export function getEvent(id: string) {
  return EVENTS.find((x) => x.id === id);
}
export function getActivities(eventId: string) {
  return ACTIVITIES.filter((a) => a.eventId === eventId).sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );
}
export function getActivity(id: string) {
  return ACTIVITIES.find((a) => a.id === id);
}

/**
 * ⚠️ DEMO ONLY: Mutates the in-memory ACTIVITIES array. No persistence,
 * no validation, no conflict resolution. Used to let the MVP preview edits
 * without a backend. Replace with a real update mutation before launch.
 */
export function updateActivity(id: string, patch: Partial<Activity>) {
  const a = ACTIVITIES.find((x) => x.id === id);
  if (!a) return;
  Object.assign(a, patch);
}

// ============================================================
// Notification suggestions — only when a shift actually affects
// another role, vendor, ceremony, or fixed-timing activity.
// ⚠️ DEMO ONLY: No message is actually sent. This builds a string the
// planner can copy; real notifications belong to a backend dispatch service.
// ============================================================

export interface NotificationSuggestion {
  shouldNotify: boolean;
  reason: string;
  affectedRoles: string[];
  affectsFixedTiming: boolean;
  suggestedMessage: string;
}

export function suggestNotification(
  eventId: string,
  activityId: string,
): NotificationSuggestion {
  const ex = explainStatus(eventId, activityId);
  const target = getActivity(activityId)!;
  const acts = getActivities(eventId);
  const others = ex.affected
    .map((a) => acts.find((x) => x.id === a.id))
    .filter((a): a is Activity => Boolean(a));
  const affectedRoles = Array.from(
    new Set(others.map((a) => a.ownerRole).filter((r) => r !== target.ownerRole)),
  );

  const shouldNotify =
    affectedRoles.length > 0 || ex.pushesFixedActivity || ex.estimatedDelayMin >= 10;

  const reason = !shouldNotify
    ? "No one else is affected yet — keep this internal."
    : ex.pushesFixedActivity
      ? "A Fixed-Timing activity is at risk — the planner should know now."
      : `${affectedRoles.length} other role${affectedRoles.length === 1 ? "" : "s"} affected: ${affectedRoles.join(", ")}.`;

  const suggestedMessage = shouldNotify
    ? `Heads up — ${target.title} is running ${ex.estimatedDelayMin}m late. ${ex.impact} Recommendation: ${ex.recommendation?.label ?? "absorb with buffer"}.`
    : "";

  return {
    shouldNotify,
    reason,
    affectedRoles,
    affectsFixedTiming: ex.pushesFixedActivity,
    suggestedMessage,
  };
}


// ============================================================
// Master checklist
// ============================================================

export interface MasterChecklistItem extends ChecklistItem {
  activityTitle: string;
  activityStart: string;
}

export function getMasterChecklist(eventId: string): MasterChecklistItem[] {
  return getActivities(eventId).flatMap((a) =>
    a.checklist.map((c) => ({
      ...c,
      activityTitle: a.title,
      activityStart: a.start,
    })),
  );
}

// ============================================================
// Timeline Intelligence
// ⚠️ DEMO HEURISTICS: health score, conflicts, attention items, and
// recommendations are computed from the mock in-memory data. They exist to
// prove the UX, not to serve as the authoritative timeline solver.
// ============================================================

export interface AttentionItem {
  id: string;
  title: string;
  reason: string;
  effect: string;
  severity: "info" | "watch" | "risk";
}

export interface Conflict {
  id: string;
  title: string;
  reason: string;
  affects: string[];
}

export interface TimelineHealth {
  score: number;
  rating: "good" | "watch" | "risk";
  ratingReason: string;
  bufferMinutes: number;
  bufferExplanation: string;
  protectedAnchors: { id: string; title: string; time: string; reason: string }[];
  fixedTiming: { id: string; title: string; time: string; reason: string }[];
  attention: AttentionItem[];
  conflicts: Conflict[];
  /** Concise list of operator-facing recommendations. */
  recommendations: { id: string; label: string; rationale: string }[];
  criticalCompleted: number;
  criticalTotal: number;
}

export function computeHealth(eventId: string): TimelineHealth {
  const acts = getActivities(eventId);
  const fixed = acts.filter((a) => a.isAnchor);
  const critical = acts.filter((a) => a.priority === "high" || a.isAnchor);
  const completed = critical.filter((a) => a.status === "complete").length;

  let bufferMinutes = 0;
  const conflicts: Conflict[] = [];
  for (let i = 1; i < acts.length; i++) {
    const prev = acts[i - 1];
    const cur = acts[i];
    const gap =
      (new Date(cur.start).getTime() - (new Date(prev.start).getTime() + prev.duration * 60000)) /
      60000;
    if (gap < 0) {
      conflicts.push({
        id: `c-${cur.id}`,
        title: `${prev.title} runs into ${cur.title}`,
        reason: `${prev.title} ends after ${cur.title} is scheduled to begin.`,
        affects: [prev.id, cur.id],
      });
    } else if (gap < cur.buffers.before) {
      conflicts.push({
        id: `c-${cur.id}`,
        title: `Tight handoff into ${cur.title}`,
        reason: `Only ${Math.round(gap)} min between activities — ${cur.title} needs at least ${cur.buffers.before} min to set up.`,
        affects: [prev.id, cur.id],
      });
    } else {
      bufferMinutes += gap;
    }
  }

  const attention: AttentionItem[] = [];
  for (const a of acts) {
    if (a.status === "delayed" || a.status === "needs-adjustment" || a.status === "at-risk") {
      const delay = a.delayMinutes ?? 10;
      attention.push({
        id: a.id,
        title: a.title,
        reason:
          a.status === "delayed"
            ? `Running ${delay} min behind schedule.`
            : a.status === "at-risk"
              ? `Fixed activity will be missed unless adjusted.`
              : `Affected by an earlier shift — may need adjusting.`,
        effect: `Will push everything before ${nextAnchorAfter(acts, a)?.title ?? "the next fixed activity"} unless adjusted.`,
        severity: a.status === "at-risk" ? "risk" : "watch",
      });
    }
  }
  for (const c of conflicts) {
    attention.push({
      id: c.id,
      title: c.title,
      reason: c.reason,
      effect: "May delay every activity that follows.",
      severity: "risk",
    });
  }

  let score = 100;
  score -= conflicts.length * 12;
  score -= attention.filter((a) => a.severity === "watch").length * 6;
  score -= attention.filter((a) => a.severity === "risk").length * 10;
  if (bufferMinutes < 30) score -= 8;
  score = Math.max(40, Math.min(100, score));

  const rating: TimelineHealth["rating"] =
    conflicts.length > 0 || attention.some((a) => a.severity === "risk")
      ? "risk"
      : attention.length > 0
        ? "watch"
        : "good";

  const ratingReason =
    rating === "good"
      ? "All fixed activities are protected and every handoff has breathing room."
      : rating === "watch"
        ? "A few activities need adjustment — nothing fixed is at risk yet."
        : "One or more activities will collide if you don't adjust the schedule.";

  // Build recommendations from the first delayed/needs-adjustment item.
  const recommendations: TimelineHealth["recommendations"] = [];
  const firstDelayed = acts.find((a) => a.status === "delayed");
  if (firstDelayed) {
    const next = acts.find((a) => a.causedBy === firstDelayed.id && !a.isAnchor);
    if (next) {
      recommendations.push({
        id: `rec-${firstDelayed.id}`,
        label: `Reduce ${next.title} by ${firstDelayed.delayMinutes ?? 10}m`,
        rationale: `Recovers the ${firstDelayed.delayMinutes ?? 10} min lost on ${firstDelayed.title} and protects ${nextAnchorAfter(acts, firstDelayed)?.title ?? "the next fixed activity"}.`,
      });
    }
  }
  if (recommendations.length === 0 && attention.length > 0) {
    recommendations.push({
      id: "rec-buffer",
      label: "Absorb the delay with buffer",
      rationale: `You have ${Math.round(bufferMinutes)} min of buffer between activities — enough to soak up small delays without action.`,
    });
  }

  const fixedTiming = fixed.map((a) => ({
    id: a.id,
    title: a.title,
    time: fmtTime(a.start),
    reason: a.anchorReason ?? "Fixed timing — anchored to a contract or external constraint.",
  }));

  return {
    score: Math.round(score),
    rating,
    ratingReason,
    bufferMinutes: Math.round(bufferMinutes),
    bufferExplanation:
      "Buffer is the unused time between activities. It's the cushion that absorbs delays before they push fixed activities.",
    protectedAnchors: fixedTiming,
    fixedTiming,
    attention,
    conflicts,
    recommendations,
    criticalCompleted: completed,
    criticalTotal: critical.length,
  };
}

function nextAnchorAfter(acts: Activity[], a: Activity) {
  const idx = acts.findIndex((x) => x.id === a.id);
  return acts.slice(idx + 1).find((x) => x.isAnchor);
}

// ============================================================
// Status explanation — Why / Impact / Affected / Recommendation
// ⚠️ DEMO HEURISTIC: plain-language wrapper around the mock activity
// state. The real engine should produce structured explanations from an
// actual constraint/dependency solver.
// ============================================================

export interface StatusExplanation {
  status: ActivityStatus;
  statusLabel: string;
  /** What caused the issue */
  why: string;
  /** What changes downstream if nothing is done */
  impact: string;
  /** Downstream activities impacted, in order */
  affected: { id: string; title: string; newTime: string; note: string }[];
  /** Best suggested adjustment */
  recommendation: { label: string; rationale: string } | null;
  estimatedDelayMin: number;
  pushesFixedActivity: boolean;
}

export const STATUS_LABEL: Record<ActivityStatus, string> = {
  "on-track": "On Track",
  "needs-adjustment": "Needs Adjustment",
  delayed: "Delayed",
  recalculating: "Recalculating",
  conflict: "Conflict",
  "at-risk": "At Risk",
  complete: "Complete",
};

export function explainStatus(eventId: string, activityId: string): StatusExplanation {
  const acts = getActivities(eventId);
  const target = acts.find((a) => a.id === activityId)!;
  const delay = target.delayMinutes ?? (target.status === "needs-adjustment" ? 10 : 0);

  // Walk forward, absorbing delay with buffer, recording who is affected.
  const idx = acts.findIndex((a) => a.id === activityId);
  const affected: StatusExplanation["affected"] = [];
  let runningDelay = delay;
  let pushesFixed = false;
  for (let i = idx + 1; i < acts.length && runningDelay > 0; i++) {
    const a = acts[i];
    const prev = acts[i - 1];
    const gap =
      (new Date(a.start).getTime() - (new Date(prev.start).getTime() + prev.duration * 60000)) /
      60000;
    const absorbed = Math.max(0, Math.min(gap, runningDelay));
    runningDelay -= absorbed;
    if (runningDelay <= 0 && !a.isAnchor) break;

    const newStart = new Date(new Date(a.start).getTime() + runningDelay * 60000);
    affected.push({
      id: a.id,
      title: a.title,
      newTime: fmtTime(newStart.toISOString()),
      note: a.isAnchor
        ? `Cannot move — ${a.anchorReason ?? "fixed timing"}.`
        : `Shifts ${Math.round(runningDelay)} min later.`,
    });
    if (a.isAnchor) {
      pushesFixed = true;
      break;
    }
  }

  // Why
  let why = "";
  const cause = target.causedBy ? acts.find((a) => a.id === target.causedBy) : null;
  switch (target.status) {
    case "delayed":
      why = cause
        ? `${cause.title} completed late, pushing ${target.title} ${delay} min later.`
        : `${target.title} started ${delay} min later than planned.`;
      break;
    case "needs-adjustment":
      why = cause
        ? `${cause.title} ran long — ${target.title} no longer fits in its planned window.`
        : `${target.title} is at risk of running into the next activity.`;
      break;
    case "recalculating":
      why = "An upstream change just happened. OnCue is updating downstream start times.";
      break;
    case "conflict":
      why = "Two activities are scheduled to occupy the same time.";
      break;
    case "at-risk":
      why = `${target.title} has Fixed Timing and the current schedule will miss it.`;
      break;
    default:
      why = `${target.title} is currently ${STATUS_LABEL[target.status]}.`;
  }

  // Impact
  const nextAnchor = nextAnchorAfter(acts, target);
  let impact = "";
  if (target.status === "complete" || target.status === "on-track") {
    impact = "No downstream effect — everything after this is on track.";
  } else if (pushesFixed) {
    impact = `Will push ${nextAnchor?.title ?? "a fixed-timing activity"} — that cannot move.`;
  } else if (affected.length === 0) {
    impact = "Absorbed entirely by buffer — no later activity moves.";
  } else {
    impact = `${affected.length} downstream ${affected.length === 1 ? "activity shifts" : "activities shift"} later. Buffer absorbs the rest.`;
  }

  // Recommendation
  let recommendation: StatusExplanation["recommendation"] = null;
  if (target.status === "delayed" || target.status === "needs-adjustment") {
    const trimmable = acts
      .slice(idx + 1)
      .find((a) => !a.isAnchor && a.duration - a.minDuration >= delay);
    if (trimmable && delay > 0) {
      recommendation = {
        label: `Reduce ${trimmable.title} by ${delay}m`,
        rationale: `Recovers the ${delay} min and preserves ${nextAnchor?.title ?? "the next fixed activity"}.`,
      };
    } else if (delay > 0) {
      recommendation = {
        label: `Defer an optional activity`,
        rationale: `No single activity can absorb ${delay} min — move an optional item (e.g. Sunset Portraits) to recover time.`,
      };
    }
  } else if (target.status === "at-risk") {
    recommendation = {
      label: "Resolve upstream delay now",
      rationale: `${target.title} is anchored and cannot move. Adjust earlier activities before it propagates.`,
    };
  }

  return {
    status: target.status,
    statusLabel: STATUS_LABEL[target.status],
    why,
    impact,
    affected,
    recommendation,
    estimatedDelayMin: delay,
    pushesFixedActivity: pushesFixed,
  };
}

// Back-compat: keep `simulateChange` for any caller that still uses it.
// ⚠️ DEMO WRAPPER: now delegates to explainStatus; retained only for
// legacy callers during the prototype phase.
export interface ChangeImpact {
  what: string;
  why: string;
  affected: { id: string; title: string; newTime: string; note: string }[];
  alternatives: { label: string; description: string }[];
  estimatedDelayMin: number;
  pushesFixedActivity: boolean;
}
export function simulateChange(
  eventId: string,
  activityId: string,
  deltaMin: number,
  reason = "Running over the planned duration",
): ChangeImpact {
  const ex = explainStatus(eventId, activityId);
  return {
    what: `${getActivity(activityId)?.title ?? "Activity"} is running ${Math.abs(deltaMin)} min ${deltaMin > 0 ? "long" : "ahead"}`,
    why: reason,
    affected: ex.affected,
    alternatives: [
      { label: "Absorb with buffer", description: "Use available buffer to keep later activities on time." },
      { label: "Shorten next activity", description: `Trim ${deltaMin} min from the next non-fixed activity.` },
      { label: "Defer optional item", description: "Move an optional activity (e.g. Sunset Portraits) to recover time." },
    ],
    estimatedDelayMin: ex.estimatedDelayMin,
    pushesFixedActivity: ex.pushesFixedActivity,
  };
}
