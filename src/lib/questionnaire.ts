/**
 * ⚠️ PHASE 2 STUB — REPLACE IN PHASE 3
 *
 * Provides type definitions and empty function stubs so setup.tsx compiles.
 * Contains NO localStorage, NO generation logic, NO real persistence.
 *
 * Phase 3 will replace this file with real Supabase-backed persistence.
 * The Setup screen will then load and save real event data from the database.
 *
 * v3.0 additions (June 23, 2026): QCoverage, QPortrait, PersonRelationship fields,
 * Person departure/arrival/VIP/mobility fields, Vendor departure/setup fields.
 */

const uid = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

// ============================================================
// Types
// ============================================================

export type RelationshipKind = "married" | "divorced" | "remarried" | "step" | "single";
export type PersonSide = "side-a" | "side-b" | "shared";
export type PersonGroup =
  | "couple" | "parent" | "step-parent" | "sibling" | "grandparent"
  | "extended" | "wedding-party" | "vip" | "other";
export type VendorRole =
  | "photographer" | "second-shooter" | "videographer" | "planner" | "dj"
  | "florist" | "hair-makeup" | "caterer" | "officiant" | "other";

export type PortraitLightingPreference =
  | "flexible"
  | "warm-light-before-sunset"
  | "sunset-glow"
  | "colorful-sky-after-sunset"
  | "blue-hour";

export type PortraitLightingPriority = "nice-to-have" | "important" | "critical";
export type OvertimePolicy = "none" | "approval-required" | "pre-approved";

export interface QPerson {
  id: string;
  name: string;
  side: PersonSide;
  group: PersonGroup;
  notes?: string;
  // ADDED v3.0 — Event Setup architecture; maps to Person in data-interfaces.ts
  departureConstraintTime?: string; // "HH:MM" — optimizer flags groups after this time
  arrivalUncertain?: boolean;       // optimizer adds soft warning to this person's groups
  isVip?: boolean;                  // elevated portrait priority; photographed early
  mobilityConcern?: boolean;        // needs early slot or accessibility accommodation
}

export interface QVendor {
  id: string;
  role: VendorRole;
  name: string;
  contact?: string;
  arrivalTime?: string;
  // ADDED v3.0 — Event Setup architecture; maps to QuestionnaireVendor in data-interfaces.ts
  departureTime?: string;          // "HH:MM" — engine warns if activities scheduled after this
  setupDurationMinutes?: number;   // engine can insert a setup block before first visible activity
}

export interface QLocation {
  id: string; label: string; name: string; address?: string;
}

export interface QPhotoRequest {
  id: string; label: string; priority: "high" | "medium" | "low";
}

export interface QPriority {
  id: string; label: string; importance: "must" | "important" | "flexible";
}

export interface QRelationship {
  id: string;
  kind: RelationshipKind;
  side: PersonSide;
  note: string;
  // ADDED v3.0 — maps to PersonRelationship in data-interfaces.ts
  personAName?: string;                // Name of person A in this relationship
  personBName?: string;                // Name of person B in this relationship
  cannotBeInSamePhoto?: boolean;       // optimizer never places A and B in the same group
  mustBePhotographedTogether?: boolean; // optimizer ensures A and B share at least one group
}

/** Coverage policy for a specific service role. Maps to ServiceCoverage in data-interfaces.ts. */
export interface QCoverage {
  startTime: string;             // "HH:MM"
  endTime: string;               // "HH:MM"
  billableHours: number | null;
  latestDepartureTime: string | null; // "HH:MM" — hard cutoff if different from endTime
  overtimePolicy: OvertimePolicy;
  maxOvertimeHours: number | null;   // only set when overtimePolicy === "pre-approved"
}

/** Portrait lighting preferences. Maps to QuestionnairePreferences in data-interfaces.ts. */
export interface QPortrait {
  lightingPreference: PortraitLightingPreference;
  lightingPriority: PortraitLightingPriority;
  totalMinutesDesired: number | null;
}

export interface Questionnaire {
  eventId: string;
  basics: {
    name: string;
    type: "wedding" | "conference" | "corporate-summit" | "production";
    date: string;
    startTime: string;
    endTime: string;
  };
  coverage: QCoverage;
  portrait: QPortrait;
  locations: QLocation[];
  people: QPerson[];
  vendors: QVendor[];
  relationships: QRelationship[];
  photoRequests: QPhotoRequest[];
  priorities: QPriority[];
  notes: string;
}

export interface GenerationResult {
  people: QPerson[];
  photoGroups: Array<{ id: string; name: string; minutes: number; people: string[] }>;
  activities: Array<{
    id: string; title: string; isAnchor: boolean; ownerRole: string;
    location: string; anchorReason?: string; startTime: string; duration: number;
  }>;
  checklist: Array<{ id: string; label: string; ownerRole: string; activityTitle: string }>;
}

// ============================================================
// Constants
// ============================================================

export const VENDOR_ROLES: { role: VendorRole; label: string }[] = [
  { role: "photographer", label: "Photographer" },
  { role: "second-shooter", label: "Second Shooter" },
  { role: "videographer", label: "Videographer" },
  { role: "planner", label: "Planner" },
  { role: "dj", label: "DJ" },
  { role: "florist", label: "Florist" },
  { role: "hair-makeup", label: "Hair & Makeup" },
  { role: "caterer", label: "Caterer" },
  { role: "officiant", label: "Officiant" },
];

export const PERSON_GROUPS: { group: PersonGroup; label: string }[] = [
  { group: "couple", label: "Couple" },
  { group: "parent", label: "Parent" },
  { group: "step-parent", label: "Step-Parent" },
  { group: "sibling", label: "Sibling" },
  { group: "grandparent", label: "Grandparent" },
  { group: "extended", label: "Extended Family" },
  { group: "wedding-party", label: "Wedding Party" },
  { group: "vip", label: "VIP" },
  { group: "other", label: "Other" },
];

export const PORTRAIT_LIGHTING_OPTIONS: { value: PortraitLightingPreference; label: string; description: string }[] = [
  { value: "flexible", label: "Flexible", description: "No lighting constraint — portrait block may fall anywhere" },
  { value: "warm-light-before-sunset", label: "Warm Light Before Sunset", description: "Golden hour start — session begins ~60–90 min before sunset" },
  { value: "sunset-glow", label: "Sunset Glow", description: "Session positioned around the 15–30 min window at/near sunset" },
  { value: "colorful-sky-after-sunset", label: "Colorful Sky After Sunset", description: "Nautical twilight; vivid sky colors; 0–20 min after sunset" },
  { value: "blue-hour", label: "Blue Hour", description: "Cool even light; ~20–45 min after sunset" },
];

// ============================================================
// Factory functions
// ============================================================

export function emptyQuestionnaire(eventId: string): Questionnaire {
  return {
    eventId,
    basics: { name: "", type: "wedding", date: "", startTime: "08:00", endTime: "22:00" },
    coverage: {
      startTime: "13:00",
      endTime: "22:00",
      billableHours: null,
      latestDepartureTime: null,
      overtimePolicy: "approval-required",
      maxOvertimeHours: null,
    },
    portrait: {
      lightingPreference: "warm-light-before-sunset",
      lightingPriority: "important",
      totalMinutesDesired: 60,
    },
    locations: [
      { id: uid("loc"), label: "Getting Ready", name: "" },
      { id: uid("loc"), label: "Ceremony", name: "" },
      { id: uid("loc"), label: "Reception", name: "" },
    ],
    people: [],
    vendors: [],
    relationships: [],
    photoRequests: [],
    priorities: [],
    notes: "",
  };
}

export function newPerson(partial: Partial<QPerson> = {}): QPerson {
  return { id: uid("p"), name: "", side: "side-a", group: "extended", arrivalUncertain: false, isVip: false, ...partial };
}
export function newVendor(partial: Partial<QVendor> = {}): QVendor {
  return { id: uid("v"), role: "other", name: "", ...partial };
}
export function newLocation(partial: Partial<QLocation> = {}): QLocation {
  return { id: uid("loc"), label: "Other", name: "", ...partial };
}
export function newRelationship(partial: Partial<QRelationship> = {}): QRelationship {
  return { id: uid("rel"), kind: "married", side: "side-a", note: "", cannotBeInSamePhoto: false, mustBePhotographedTogether: false, ...partial };
}
export function newPhotoRequest(partial: Partial<QPhotoRequest> = {}): QPhotoRequest {
  return { id: uid("pr"), label: "", priority: "medium", ...partial };
}
export function newPriority(partial: Partial<QPriority> = {}): QPriority {
  return { id: uid("pri"), label: "", importance: "flexible", ...partial };
}

// ============================================================
// Persistence stubs — Phase 3 replaces with Supabase
// ============================================================

export function loadQuestionnaire(eventId: string): Questionnaire {
  return emptyQuestionnaire(eventId);
}

export function saveQuestionnaire(_q: Questionnaire): void {
  // Phase 3: persist to Supabase
}

export function generateAll(_q: Questionnaire): GenerationResult {
  // Phase 3: real constraint solver output
  return { people: [], photoGroups: [], activities: [], checklist: [] };
}
