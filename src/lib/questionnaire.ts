/**
 * ⚠️ PHASE 2 STUB — REPLACE IN PHASE 3
 *
 * Provides type definitions and empty function stubs so setup.tsx compiles.
 * Contains NO localStorage, NO generation logic, NO real persistence.
 *
 * Phase 3 will replace this file with real Supabase-backed persistence.
 * The Setup screen will then load and save real event data from the database.
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

export interface QPerson {
  id: string; name: string; side: PersonSide; group: PersonGroup; notes?: string;
}
export interface QVendor {
  id: string; role: VendorRole; name: string; contact?: string; arrivalTime?: string;
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
  id: string; kind: RelationshipKind; side: PersonSide; note: string;
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

// ============================================================
// Factory functions
// ============================================================

export function emptyQuestionnaire(eventId: string): Questionnaire {
  return {
    eventId,
    basics: { name: "", type: "wedding", date: "", startTime: "08:00", endTime: "22:00" },
    locations: [
      { id: uid("loc"), label: "Preparation", name: "" },
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
  return { id: uid("p"), name: "", side: "side-a", group: "extended", ...partial };
}
export function newVendor(partial: Partial<QVendor> = {}): QVendor {
  return { id: uid("v"), role: "other", name: "", ...partial };
}
export function newLocation(partial: Partial<QLocation> = {}): QLocation {
  return { id: uid("loc"), label: "Other", name: "", ...partial };
}
export function newRelationship(partial: Partial<QRelationship> = {}): QRelationship {
  return { id: uid("rel"), kind: "married", side: "side-a", note: "", ...partial };
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
