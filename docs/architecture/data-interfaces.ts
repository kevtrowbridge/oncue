/**
 * OnCue MVP — TypeScript Data Interfaces
 * Version: 3.0 | June 23, 2026
 *
 * PURPOSE
 * These interfaces define every data shape used across all OnCue components.
 * Written before application code so components are built with the correct prop
 * types from the start — preventing full rewrites when Supabase is wired in Phase 3.
 *
 * SOURCE
 * docs/architecture/mvp-ux-architecture.md (v3.0)
 * docs/FOUNDER_DECISIONS.md
 *
 * PHASE USAGE
 * Phase 1 (design system + brand components): no data model dependencies
 * Phase 2 (Lovable code migration): components use these types with mock arrays
 * Phase 3+ (Supabase): replace mock arrays with Supabase hook results that return
 *   these same types — no component rewrites required
 *
 * CONFLICT RESOLUTION LOG (v1.0 → v2.0)
 * Resolved 7 conflicts between data-interfaces.ts and event-flow-master types.
 * See docs/claude-handoff/current.md §5 for the full conflict table.
 * Each conflict is annotated at the affected field or type with a CONFLICT RESOLVED comment.
 *
 * ADDITIONS LOG (v2.0 → v3.0)
 * Added following Event Setup architecture review (June 23, 2026):
 * - PortraitLightingPreference enum (5-mode sunset / lighting constraint)
 * - PortraitLightingPriority enum
 * - OveragePolicy enum
 * - ServiceCoverage entity (billable coverage window, overage policy, hard departure time)
 * - CoverageImpact type (constraint engine coverage evaluation output)
 * - PersonRelationship entity (blended family / photo group separation logic)
 * - Person: departureConstraintTime, arrivalUncertain, isVip, mobilityConcern
 * - QuestionnairePreferences: portraitLightingPreference, portraitLightingPriority, totalPortraitMinutesDesired
 * - QuestionnaireVendor: departureTime, setupDurationMinutes
 *
 * SEPARATION RULES (enforced by this model):
 * - People: humans who may appear in portraits / family groups. Roster for photo optimizer.
 * - Vendors: service providers, companies, vendor roles, and their contact details.
 * - Participants: users or invitees with access to OnCue (UserEventRole). Not the same as People.
 * A vendor contact may become a Participant for app access, but is NOT automatically
 * a Person for photo / group purposes. Do not collapse these three concepts.
 *
 * RULES
 * - No framework imports (React, Supabase, etc.)
 * - No default values or business logic — types only
 * - IDs are string (will be UUIDs in Supabase)
 * - Timestamps are ISO strings ("2026-09-15T14:30:00Z")
 * - Times-of-day are "HH:MM" strings ("14:30")
 * - Nullable fields use `string | null`, not `string | undefined`
 */

// =============================================================================
// ENUMS
// =============================================================================

/**
 * Lifecycle state of an event.
 * Used by: Dashboard event cards (status badge), event header, Timeline Editor toolbar
 * Spec: §4 Screen 1
 *
 * CONFLICT RESOLVED (v2.0): keep this 7-state PascalCase model.
 * event-flow-master uses 4 lowercase states: "planning" | "on-track" | "draft" | "complete".
 * Those 4 are a subset; this model adds ReviewNeeded, Ready, and Live distinctions
 * needed for the full event lifecycle. event-flow-master components will be updated
 * to this model when code migrates to oncue.
 */
export type EventStatus =
  | "Draft"         // Created; questionnaire not yet started or shared
  | "InProgress"    // Actively being built; not yet shared with couple
  | "ReviewNeeded"  // Pending couple or collaborator proposals awaiting review
  | "Ready"         // All 7 Event Readiness Checklist items are complete
  | "Live"          // Wedding day is today — Day-Of Mode is active
  | "Completed"     // Event date has passed; still briefly writable
  | "Archived";     // Read-only; Planning Mode is locked

/**
 * Execution state of a single activity, set by the constraint engine at runtime.
 * Used by: Timeline Editor (activity row indicators), Status screen, IntelligencePanel
 * Spec: §7 Architecture and Timeline Intelligence — execution state
 *
 * ADDED v2.0: sourced from ActivityStatus in event-flow-master (oncue-data.ts).
 * Converted from EFM's kebab-case: on-track → OnTrack, needs-adjustment → NeedsAdjustment,
 * at-risk → AtRisk. All other values match with first letter capitalized.
 */
export type ActivityStatus =
  | "OnTrack"          // No issues; progressing as planned
  | "NeedsAdjustment"  // Minor deviation; adjustment recommended but not urgent
  | "Delayed"          // This activity has started late
  | "Recalculating"    // Constraint engine is actively recalculating downstream times
  | "Conflict"         // Hard conflict: two activities overlap or anchor is threatened
  | "AtRisk"           // On track now but vulnerable to a likely upcoming conflict
  | "Complete";        // Activity has ended

/**
 * How an activity behaves when the constraint engine recalculates times.
 * Used by: Activity Detail Panel, Timeline Editor (anchor indicator), constraint engine
 * Spec: §5 Interaction Patterns — Anchor Types
 *
 * CONFLICT RESOLVED (v2.0): keep this 4-value enum (not `isAnchor: boolean`).
 * event-flow-master uses `isAnchor: boolean`.
 * Derived boolean: isAnchor = anchorType === "Locked" || anchorType === "Preferred"
 * event-flow-master components will be updated when code migrates.
 */
export type AnchorType =
  | "Locked"               // Never moves under any condition (e.g. ceremony)
  | "Preferred"            // Moves only with explicit owner approval
  | "Flexible"             // Shifts silently within limits
  | "MovableWithApproval"; // Moves but triggers notification to affected parties

/**
 * Importance of an activity for scheduling decisions and conflict resolution.
 * Used by: Activity Detail Panel, constraint warning evaluation
 * Spec: §4 Screen 5 — Activity Detail
 *
 * CONFLICT RESOLVED (v2.0): keep this 5-value enum (not `isOptional: boolean`).
 * event-flow-master uses `isOptional: boolean`.
 * Derived boolean: isOptional = priority === "Optional" || priority === "Buffer"
 * event-flow-master components will be updated when code migrates.
 */
export type Priority =
  | "Critical"  // Must not be skipped or compressed (ceremony, first look)
  | "Important" // High value; compress only as last resort (first dances, cake)
  | "Flexible"  // Can shift within limits (most portrait sessions)
  | "Optional"  // First to cut under time pressure
  | "Buffer";   // Intentional padding; absorbs schedule drift

/**
 * Which roles can see a given activity in their filtered view.
 * Used by: Activity Detail Panel (visibility field), role-filtered timeline views
 * Spec: §6 Role-Filtered Views
 */
export type VisibilityTarget =
  | "Owner"
  | "Planner"
  | "Couple"
  | "VendorDJ"
  | "VendorVideographer"
  | "VendorFlorist"
  | "VendorHairMakeup"
  | "VendorVenue"
  | "VendorOfficiant"
  | "VendorCustom";

/**
 * Lifecycle of a participant's engagement with their shared link.
 * Used by: Vendor Management screen, Dashboard event card vendor summary chip
 * Spec: §4 Screen 7; §15 Participant status tracking
 */
export type VendorStatus = "Invited" | "Viewed" | "Confirmed";

/**
 * Two levels of planner access within an event.
 * Used by: Planner invite flow, Change Review, permissions enforcement
 * Spec: §1 Journey 2, §6 Planner — Collaborator / Co-owner
 */
export type PlannerRole = "Collaborator" | "CoOwner";

/**
 * Current state of a couple-submitted change proposal.
 * Used by: Change Review screen (Workflow A), proposal badge count
 * Spec: §4 Screen 8 — Workflow A
 */
export type ChangeProposalStatus = "Pending" | "Approved" | "Declined";

/**
 * Category of change recorded in the change log.
 * Used by: ChangeLogEntry, ChangeProposal, TimelineSnapshot labels
 * Spec: §5 Version History and Rollback
 */
export type ChangeType =
  | "ActivityEdit"
  | "ActivityAdd"
  | "ActivityDelete"
  | "ActivityReorder"
  | "QuestionnaireEdit"
  | "GroupPhotoEdit"
  | "VendorEdit"
  | "TimelineRestore";

/**
 * What caused a snapshot to be automatically created.
 * Used by: TimelineSnapshot.trigger, snapshot list labels
 * Spec: §5 Version History — Automatic snapshots
 */
export type SnapshotTrigger =
  | "TimelinePublished"
  | "PdfDownloaded"
  | "CollaboratorInvited"
  | "FirstEditAfterOpen"
  | "HourlyAutoSave";

/**
 * Execution state of a group photo group on wedding day.
 * Used by: Group Photo Optimizer group cards
 * Spec: §4 Screen 6
 */
export type GroupPhotoStatus = "Scheduled" | "Completed" | "Deferred" | "Missed";

/**
 * The five PDF export formats available to owners and planners.
 * Used by: PDF Export screen format selector, PdfExportRecord
 * Spec: §4 Screen 10 — Export formats
 */
export type PdfExportFormat =
  | "CompactItinerary" // One-page pocketable day-of reference
  | "FullTimeline"     // All activities, all fields, all notes
  | "VendorFiltered"   // One role's relevant activities
  | "GroupPhotoOnly"   // Group sequence with people and durations
  | "CoupleView";      // Activities at couple visibility level

/**
 * The role a person holds within a specific event.
 * Used by: UserEventRole, ChangeLogEntry, ChangeProposal
 * Spec: §6 Role-Filtered Views
 */
export type UserEventRoleType =
  | "Owner"
  | "Collaborator"
  | "CoOwner"
  | "Couple"
  | "Vendor";

/**
 * Which side of the couple a person belongs to, for group photo sequencing.
 * Used by: Person, PhotoGroup
 * Spec: §11 Family and Photo Group Optimizer — default portrait sequence
 *
 * ADDED v2.0: adopted from QPerson model in event-flow-master (questionnaire.ts).
 * Renamed from "bride-side" / "groom-side" to SideA / SideB to remain
 * compatible with the generic Event architecture (not wedding-specific).
 */
export type PersonSide = "SideA" | "SideB" | "Shared";

/**
 * The family grouping a person belongs to in the portrait sequence.
 * Drives the default 11-step portrait sequence in the Group Photo Optimizer.
 * Used by: Person, PhotoGroup, Group Photo Optimizer sequencing logic
 * Spec: §11 Family and Photo Group Optimizer — default 11-step portrait sequence
 *
 * ADDED v2.0: adopted from PersonGroup in event-flow-master (questionnaire.ts).
 */
export type PersonGroup =
  | "Extended"      // Extended family — outermost ring; released last
  | "Grandparents"  // Grandparents — high priority for early release
  | "Siblings"      // Siblings
  | "Immediate"     // Immediate family (parents + siblings combined)
  | "Parents"       // Parents only
  | "WeddingParty"  // Member of the wedding party
  | "VIP"           // Named VIP (special request; no family classification)
  | "Custom";       // Custom grouping not covered by above categories

/**
 * The family relationship type between two people.
 * Supports blended, step, divorced, and remarried family structures.
 * Used by: Person.relationshipKind
 * Spec: §11 Family and Photo Group Optimizer — blended family support
 *
 * ADDED v2.0: adopted from QRelationship model in event-flow-master (questionnaire.ts).
 */
export type RelationshipKind =
  | "Married"
  | "Divorced"
  | "Remarried"
  | "Step"
  | "Single";

/**
 * The preferred lighting condition for the couple portrait session.
 * Drives the constraint engine's positioning of portrait activities relative to
 * the calculated sunset time for the event date and portrait location.
 * Used by: QuestionnairePreferences.portraitLightingPreference, sunset conflict evaluation
 * Spec: Event Setup architecture review — Section 6
 *
 * ADDED v3.0: from Event Setup architecture review.
 */
export type PortraitLightingPreference =
  | "Flexible"               // No lighting constraint; portrait block may fall anywhere
  | "WarmLightBeforeSunset"  // Golden hour start; session begins ~60–90 min before sunset
  | "SunsetGlow"             // Session positioned around the 15–30 min window at/near sunset
  | "ColorfulSkyAfterSunset" // Nautical twilight; vivid sky colors; 0–20 min after sunset
  | "BlueHour";              // Astronomical twilight; cool even light; ~20–45 min after sunset

/**
 * How strongly the client wants the portrait lighting preference honored.
 * Governs how the constraint engine weights the lighting constraint against other
 * timeline demands when recovery options are evaluated.
 * Used by: QuestionnairePreferences.portraitLightingPriority
 *
 * ADDED v3.0: from Event Setup architecture review.
 */
export type PortraitLightingPriority = "NiceToHave" | "Important" | "Critical";

/**
 * Policy governing what happens when a service provider's timeline exceeds their
 * contracted coverage window. Does not represent billing policy — it is an
 * operational constraint only. No dollar figures are stored.
 * Used by: ServiceCoverage.overagePolicy, CoverageImpact
 * Spec: Event Setup architecture review — Section 2
 *
 * ADDED v3.0: from Event Setup architecture review.
 */
export type OveragePolicy =
  | "None"              // No overtime available; hard stop at coverage end
  | "ApprovalRequired"  // Overtime possible but must be explicitly approved on the day
  | "PreApproved";      // Overtime pre-approved up to ServiceCoverage.maxOverageMinutes


// =============================================================================
// LOCATIONS
// =============================================================================

/**
 * A named location associated with an event.
 * Used by: Questionnaire Section 2, Activity Detail Panel, travel block logic
 * Spec: §4 Screen 3 — Questionnaire section 2; §5 Travel block insertion
 */
export interface EventLocation {
  id: string;
  eventId: string;
  label: string;                        // "Ceremony Venue", "Getting Ready — Bride Side"
  address: string | null;
  estimatedTravelMinutesFromPrevious: number | null; // Default: 15 min; same building: 5 min
}


// =============================================================================
// ACTIVITIES AND TIMELINE
// =============================================================================

/**
 * Per-activity timing buffers set by the constraint engine.
 * Separates intentional padding from the activity's core duration so the engine
 * can compress buffers before compressing the activity itself.
 * Used by: Activity.buffers, constraint engine recalculation, Timeline Editor
 * Spec: §7 Architecture and Timeline Intelligence — constraint modeling
 *
 * ADDED v2.0: sourced from RelationalBuffer in event-flow-master (oncue-data.ts).
 */
export interface RelationalBuffer {
  before: number;        // Setup/prep time before this activity (minutes)
  after: number;         // Wrap/clear time after this activity (minutes)
  travelBefore: number;  // Travel time arriving at this activity's location (minutes)
  travelAfter: number;   // Travel time leaving this activity's location (minutes)
}

/**
 * A single scheduled item on the wedding day timeline.
 * Used by: Timeline Editor (list rows), Activity Detail Panel, Day-Of Mode,
 *          Group Photo Optimizer (when exported to timeline), role-filtered views
 * Spec: §4 Screens 4, 5, 9
 */
export interface Activity {
  id: string;
  eventId: string;
  sectionId: string;
  title: string;
  // CONFLICT RESOLVED (v2.0): keep durationMinutes (not `duration`).
  // event-flow-master uses `duration: number` — rename during data migration.
  durationMinutes: number;
  // CONFLICT RESOLVED (v2.0): keep minimumDurationMinutes (not `minDuration`).
  // event-flow-master uses `minDuration: number` — rename during data migration.
  minimumDurationMinutes: number;
  // CONFLICT RESOLVED (v2.0): keep "HH:MM" string (not ISO datetime).
  // ISO datetimes belong in the Supabase persistence layer, not in UI prop types.
  // event-flow-master uses ISO strings — update components during Supabase wiring phase.
  startTime: string | null;           // "HH:MM"; null until constraint engine calculates
  calculatedEndTime: string | null;   // "HH:MM"; derived from startTime + durationMinutes
  // CONFLICT RESOLVED (v2.0): keep 4-value enum (not `isAnchor: boolean`).
  // Derived boolean: isAnchor = anchorType === "Locked" || anchorType === "Preferred"
  // event-flow-master components will be updated when code migrates.
  anchorType: AnchorType;
  // CONFLICT RESOLVED (v2.0): keep 5-value enum (not `isOptional: boolean`).
  // Derived boolean: isOptional = priority === "Optional" || priority === "Buffer"
  // event-flow-master components will be updated when code migrates.
  priority: Priority;
  // CONFLICT RESOLVED (v2.0): keep locationId reference (not inline string).
  // event-flow-master uses `location: string` + `locationInfo` object for display convenience.
  // The canonical model uses a foreign key to EventLocation for constraint engine use.
  // The EFM inline location is a UI-only display convenience, not the source of truth.
  locationId: string | null;          // null = inherit location from parent section
  locationInherited: boolean;         // true when location comes from section default
  visibleTo: VisibilityTarget[];
  requiredPeople: string[];           // Person IDs who must be present
  weatherSensitive: boolean;
  isOutdoor: boolean;
  // CONFLICT RESOLVED (v2.0): keep two-field separation (not a single `notes: string`).
  // internalNotes is owner-only. vendorFacingNotes is role-gated.
  // Collapsing to one field loses role-based access control enforcement.
  internalNotes: string;              // Owner-only; never visible to couple or vendors
  vendorFacingNotes: string;          // Visible to vendors who can see this activity
  setupChecklistItems: string[];
  captureChecklistItems: string[];
  recoveryChecklistItems: string[];
  dependsOnActivityId: string | null; // Before/after relationship
  isTravelBlock: boolean;             // true = auto-inserted by constraint engine
  isMarkedComplete: boolean;          // Secondary; timeline advances by time, not taps
  hasConstraintWarning: boolean;      // Drives inline warning indicator in Timeline Editor
  constraintWarningMessage: string | null;
  sortOrder: number;
  // ADDED v2.0: constraint engine execution state; null in Planning Mode
  status: ActivityStatus | null;
  // ADDED v2.0: timing buffers from constraint engine; null until engine runs
  buffers: RelationalBuffer | null;
}

/**
 * A named section grouping related activities (e.g. "Ceremony", "Getting Ready").
 * Provides the default location for all activities within it.
 * Used by: Timeline Editor (section dividers), location inheritance
 * Spec: §4 Screen 4
 */
export interface ActivitySection {
  id: string;
  eventId: string;
  title: string;             // "Getting Ready", "First Look", "Ceremony", "Reception"
  locationId: string | null; // Default location; activities inherit unless overridden
  sortOrder: number;
  activities: Activity[];
}

/**
 * A constraint violation detected by the timeline engine.
 * Used by: Timeline Editor (inline warnings), constraint warning panel
 * Spec: §5 Constraint Warnings
 */
export interface ConstraintWarning {
  activityId: string;
  warningType:
    | "AnchorThreatened"
    | "DurationCompressed"
    | "TravelBlockMissing"
    | "SunsetConflict"
    | "RequiredPersonMissing"
    | "MinimumDurationViolated";
  message: string;               // "Ceremony is locked at 4:00pm. Extending..."
  suggestionMessage: string | null; // Optional recovery suggestion shown inline
}

/**
 * One recovery option presented after a delay is entered in Day-Of Mode.
 * Used by: Day-Of Mode delay panel (step 3 — recovery options list)
 * Spec: §2 Execution Mode Delay Adjustment Flow
 */
export interface RecoveryOption {
  id: string;
  label: string;                // "Compress portraits by 10 min"
  description: string;          // Full plain-language impact description
  affectedActivityIds: string[];
  minutesSaved: number;
}

/**
 * A person suggested for notification after a delay adjustment.
 * Owner explicitly selects who to notify before anything is sent.
 * Used by: Day-Of Mode delay panel (step 4 — notification selection)
 * Spec: §2 Execution Mode — notification step; system never notifies automatically
 */
export interface NotificationCandidate {
  id: string;
  displayName: string;
  role: string;            // "DJ", "Planner", "Florist"
  contactMethod: string;   // Phone number or email (display only)
  isSelected: boolean;     // Owner can add or remove before confirming
}

/**
 * The structured output the constraint engine produces for a single activity's status.
 * This is the approved 4-part explanation format: Why / Impact / Affected / Recommended Action.
 * Used by: IntelligencePanel, Status screen, Activity Detail Panel (execution state)
 * Spec: §7 Architecture and Timeline Intelligence — 4-part explanation format
 *
 * ADDED v2.0: sourced from StatusExplanation in event-flow-master (oncue-data.ts).
 * The event-flow-master version uses frontend heuristics labeled ⚠️ DEMO ONLY.
 * This interface defines what the real constraint solver must output in Phase 4.
 */
export interface StatusExplanation {
  status: ActivityStatus;
  statusLabel: string;              // Human-readable label for the status badge
  why: string;                      // Why is this status flagged?
  impact: string;                   // What happens if not addressed?
  affectedActivityIds: string[];    // Which other activities are at risk?
  recommendedAction: string;        // What should the owner do?
  estimatedDelayMinutes: number | null; // null when status is OnTrack or Complete
  pushesFixedActivity: boolean;     // true when this delay would push a Locked/Preferred activity
}


// =============================================================================
// EVENTS
// =============================================================================

/**
 * The top-level event record. One Event = one wedding.
 * Used by: Dashboard (event cards), all per-event screens, Create Event form
 * Spec: §4 Screens 1, 2
 */
export interface Event {
  id: string;
  ownerId: string;
  title: string;                      // "Smith & Johnson Wedding"
  coupleName1: string;
  coupleName2: string;
  eventDate: string;                  // ISO date: "2026-09-15"
  status: EventStatus;
  templateUsed: "Wedding";            // MVP: only Wedding template exists
  primaryLocationId: string | null;
  daysUntilEvent: number | null;      // Calculated; null after event date
  pendingProposalsCount: number;      // Couple proposals awaiting owner decision
  reviewRequiredCount: number;        // Collaborator changes awaiting owner review
  vendorSummary: VendorSummary;
  readinessChecklist: EventReadinessChecklist;
  lastPdfDownloadedAt: string | null;
  lastPdfDownloadedFormat: PdfExportFormat | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Compact participant status summary shown on the Dashboard event card.
 * Used by: Dashboard event card, event header vendor chip
 * Spec: §4 Screen 1 — information hierarchy item 2; §15 Participant status tracking
 */
export interface VendorSummary {
  totalVendors: number;
  confirmedCount: number;
  viewedCount: number;
  invitedCount: number;   // Link sent but not yet opened
}

/**
 * The 7-item Event Readiness Checklist.
 * All 7 must be true before an event should be considered ready for the wedding day.
 * Used by: Dashboard event card (near event date), Planning Mode sidebar,
 *          PDF Export screen (item 3 gating)
 * Spec: §2 Planning Mode — Event Readiness Checklist; §17 checklist items
 */
export interface EventReadinessChecklist {
  questionnaireComplete: boolean;    // All required questionnaire sections filled in
  groupPhotosSequenced: boolean;     // Group Photo Optimizer run and sequence confirmed
  pdfBackupDownloaded: boolean;      // At least one compact or full PDF downloaded
  noCriticalWarnings: boolean;       // No unresolved anchor threats or chain violations
  coupleProposalsResolved: boolean;  // No pending couple proposals
  vendorLinkShared: boolean;         // At least one participant has been sent their link
  emergencyContactsEntered: boolean; // At least one emergency contact in questionnaire
}

/**
 * Event-level health summary produced by the constraint engine.
 * Used by: Dashboard event card (health indicator), Status screen header, IntelligencePanel
 * Spec: §7 Architecture and Timeline Intelligence — execution intelligence
 *
 * ADDED v2.0: sourced from HealthScore in event-flow-master (oncue-data.ts).
 * The event-flow-master version uses frontend heuristics labeled ⚠️ DEMO ONLY.
 * This interface defines what the real constraint solver must output in Phase 4.
 */
export interface HealthScore {
  rating: "Good" | "Watch" | "Critical"; // Overall health rating
  criticalCompleted: number;              // Fixed Timing activities already completed
  criticalTotal: number;                  // Total Fixed Timing activities in the timeline
  attention: string[];                    // Plain-language items that need owner attention
  conflicts: string[];                    // Plain-language descriptions of hard conflicts
}


// =============================================================================
// QUESTIONNAIRE (all 8 sections)
// =============================================================================

/**
 * Section 1 — Core event details.
 * Used by: Questionnaire screen section 1
 * Spec: §4 Screen 3 — section 1
 */
export interface QuestionnaireCoreDetails {
  coupleName1: string;
  coupleName2: string;
  preferredSurname: string | null;
  eventDate: string;                 // ISO date
  phone1: string | null;
  phone2: string | null;
  email1: string | null;
  email2: string | null;
}

/**
 * Section 2 — Named locations for the wedding day.
 * Each field maps to an EventLocation; null = not yet provided.
 * Used by: Questionnaire screen section 2; drives travel block auto-insertion
 * Spec: §4 Screen 3 — section 2; §5 Creation Flow step 3
 */
export interface QuestionnaireLocations {
  gettingReadyBride: string | null;      // Location label or address
  gettingReadyGroom: string | null;
  firstLook: string | null;
  ceremony: string | null;
  portraits: string | null;
  reception: string | null;
  sunsetPortraitLocation: string | null;
}

/**
 * A single participant in family or wedding party group photos.
 * Sections 3 & 4 share this type; isWeddingParty distinguishes them.
 * Used by: Questionnaire sections 3 & 4, Group Photo Optimizer
 * Spec: §4 Screen 3 — sections 3 & 4; §4 Screen 6 note
 *
 * @deprecated Superseded by Person (see PEOPLE section below).
 * Person adds PersonSide, PersonGroup, and RelationshipKind from the QPerson
 * model in event-flow-master (questionnaire.ts), enabling the full missing-person
 * flow and 11-step portrait sequence. GroupParticipant is retained for backwards
 * compatibility with EventQuestionnaire until the data model migrates to Person[].
 */
export interface GroupParticipant {
  id: string;
  eventId: string;
  name: string;
  relationship: string;            // "Grandmother (Bride's side)", "Best Man", "MOH"
  notes: string | null;            // Mobility needs, arriving late, seat preference, etc.
  isWeddingParty: boolean;         // true = also in wedding party (Section 4)
  weddingPartyRole: string | null; // "MOH", "Groomsman", "Flower Girl", "Officiant"
  sortOrder: number;
}

/**
 * Section 5 — A vendor connected to the event.
 * Also the source for vendor link generation.
 * Used by: Questionnaire screen section 5, Vendor Management screen
 * Spec: §4 Screen 3 — section 5
 *
 * Vendor contacts are distinct from People (photo/group participants) and from
 * Participants (OnCue users/invitees). A QuestionnaireVendor record is a service
 * provider entry. It may link to a VendorRole for visibility configuration, and
 * may link to a ServiceCoverage record for coverage constraint modeling.
 */
export interface QuestionnaireVendor {
  id: string;
  eventId: string;
  roleLabel: string;             // "Florist", "DJ", "Videographer", "Planner", etc.
  name: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  arrivalTime: string | null;    // "HH:MM"
  // ADDED v3.0: from Event Setup architecture review
  departureTime: string | null;         // "HH:MM"; engine warns when vendor-visible activities are scheduled after this
  setupDurationMinutes: number | null;  // engine can insert a setup block before the vendor's first visible activity
}

/**
 * Section 6 — Creative and emotional preferences, and portrait lighting constraints.
 * Used by: Questionnaire screen section 6
 * Spec: §4 Screen 3 — section 6; Event Setup architecture review — Section 6
 *
 * portraitLightingPreference and portraitLightingPriority are MACHINE-EVALUATED fields.
 * The constraint engine uses them to position the portrait block relative to calculated
 * sunset time and to evaluate SunsetConflict warnings. All other fields in this section
 * are human-readable metadata that the photographer interprets when configuring the timeline.
 */
export interface QuestionnairePreferences {
  idealPortraitLocation: string | null;
  dreamSpaceDescription: string | null;
  importantPeopleAndMoments: string | null;
  emotionalPriorities: string | null;
  // ADDED v3.0: from Event Setup architecture review — machine-evaluated portrait constraints
  portraitLightingPreference: PortraitLightingPreference | null; // null treated as Flexible by the engine
  portraitLightingPriority: PortraitLightingPriority | null;     // null treated as NiceToHave by the engine
  totalPortraitMinutesDesired: number | null; // engine warns when the portrait block is shorter than this
}

/**
 * Section 7 — Scheduling priorities and flexibility.
 * Drives constraint engine priority assignments and recovery option ranking.
 * Used by: Questionnaire screen section 7
 * Spec: §4 Screen 3 — section 7
 */
export interface QuestionnairePriorities {
  mostImportantMoments: string | null;  // These should not be compressed
  mostFlexibleMoments: string | null;   // These can be cut if time is short
  weatherContingencyNotes: string | null;
}

/**
 * Section 8 — Emergency contacts for the wedding day.
 * Required for Event Readiness Checklist item 7.
 * Cached for offline access when Day-Of Mode is entered.
 * Used by: Questionnaire screen section 8, Day-Of Mode emergency panel
 * Spec: §4 Screen 3 — section 8; §4 Screen 9 — emergency contacts panel; §19
 */
export interface EmergencyContact {
  id: string;
  eventId: string;
  name: string;
  role: string;    // "Venue Coordinator", "Planner Mobile", "Family Contact"
  phone: string;
  sortOrder: number;
}

/**
 * The full questionnaire for an event, assembled from all 8 sections.
 * Used by: Questionnaire screen (master prop), completion status indicators
 * Spec: §4 Screen 3
 *
 * NOTE: groupParticipants will migrate to Person[] when the People data model
 * is wired to Supabase. GroupParticipant is the current interim type.
 */
export interface EventQuestionnaire {
  eventId: string;
  coreDetails: QuestionnaireCoreDetails;
  locations: QuestionnaireLocations;
  groupParticipants: GroupParticipant[];  // Sections 3 & 4 combined; migrates to Person[]
  vendors: QuestionnaireVendor[];
  preferences: QuestionnairePreferences;
  priorities: QuestionnairePriorities;
  emergencyContacts: EmergencyContact[];
  sectionCompletionStatus: {
    coreDetails: boolean;
    locations: boolean;
    groupParticipants: boolean;
    vendors: boolean;
    preferences: boolean;
    priorities: boolean;
    emergencyContacts: boolean;
  };
}


// =============================================================================
// PEOPLE
// =============================================================================

/**
 * A person associated with an event — family member, wedding party member, VIP,
 * or anyone else who appears in group photos or the event roster.
 * The People screen is the source of truth for the roster; Photo Groups are derived from it.
 * Used by: People screen, Group Photo Optimizer, PhotoGroup, MissingPersonImpact
 * Spec: §10 People and Photo Groups; §11 Family and Photo Group Optimizer
 *
 * ADDED v2.0: adopted from QPerson in event-flow-master (questionnaire.ts).
 * Supersedes GroupParticipant — adds side, group classification, and relationship structure.
 * People and Photo Groups are distinct concepts (§10): Person is the roster;
 * PhotoGroup is derived from Person[].
 */
export interface Person {
  id: string;
  eventId: string;
  name: string;
  side: PersonSide;                   // Which side of the couple this person belongs to
  group: PersonGroup;                 // Family classification for portrait sequencing
  relationshipKind: RelationshipKind | null; // null when not applicable (e.g. VIP, custom)
  relationshipLabel: string;          // "Grandmother (Bride's side)", "Best Man"
  notes: string | null;               // Mobility needs, arriving late, seat preference, etc.
  isWeddingParty: boolean;            // true = also in wedding party
  weddingPartyRole: string | null;    // "MOH", "Groomsman", "Flower Girl", "Officiant"
  sortOrder: number;
  // ADDED v3.0: from Event Setup architecture review
  departureConstraintTime: string | null; // "HH:MM"; optimizer flags portrait groups scheduled after this time
  arrivalUncertain: boolean;          // true = person may arrive late; optimizer adds a soft warning to their groups
  isVip: boolean;                     // true = elevated portrait priority; scheduled early in the portrait session
  mobilityConcern: boolean | null;    // null = unknown; true = needs early slot or accessibility accommodation
}

/**
 * A directed relationship between two people in the event roster.
 * Supports divorced, remarried, step-parent, and blended-family photo group logic.
 * The Group Photo Optimizer reads these records to avoid placing incompatible people
 * in the same group, and to enforce must-be-together constraints.
 *
 * NOTE: PersonRelationship is about photo logistics, not lineage or biography.
 * "Cannot be in the same photo" is the primary constraint the optimizer enforces here.
 * Lineage and context belong in Person.relationshipLabel and Person.notes.
 *
 * People (photo participants) remain separate from Vendors (service providers) and
 * Participants (OnCue users / invitees). PersonRelationship only connects Person records.
 *
 * Used by: Group Photo Optimizer (sequencing and separation logic)
 * Spec: Event Setup architecture review — Section 4
 *
 * ADDED v3.0: from Event Setup architecture review.
 * The prior scalar Person.relationshipKind describes the person, not a connection.
 * This entity models the connection between two specific Person records.
 */
export interface PersonRelationship {
  id: string;
  eventId: string;
  personAId: string;                   // Person.id — one end of the relationship
  personBId: string;                   // Person.id — other end of the relationship
  relationshipKind: RelationshipKind;  // Nature of the connection between A and B
  cannotBeInSamePhoto: boolean;        // true = optimizer never places A and B in the same group
  preferredNotSamePhoto: boolean;      // true = optimizer avoids it but does not hard-block
  mustBePhotographedTogether: boolean; // true = optimizer places A and B in at least one shared group
  notes: string | null;                // "New partner of Person A", "Divorced; amicable but separate groups"
}


// =============================================================================
// GROUP PHOTO OPTIMIZER
// =============================================================================

/**
 * One group photo combination (e.g. "Bride's Parents + Siblings").
 * Auto-generated from questionnaire participants; owner adjusts before confirming.
 * Used by: Group Photo Optimizer screen (group list), timeline export
 * Spec: §4 Screen 6
 *
 * NOTE: PhotoGroup (below) is the richer v2.0 model sourced from event-flow-master.
 * GroupPhotoGroup is retained for backwards compatibility with GroupPhotoOptimizerSummary
 * until the Supabase schema migration aligns with the PhotoGroup model.
 */
export interface GroupPhotoGroup {
  id: string;
  eventId: string;
  label: string;                       // "Couple + Both Sets of Parents"
  participantIds: string[];            // Person.id references (was GroupParticipant.id)
  estimatedDurationMinutes: number;
  status: GroupPhotoStatus;
  appearsInMultipleGroupsParticipants: string[]; // Person IDs appearing in 2+ groups
  notes: string | null;
  sortOrder: number;
}

/**
 * Summary of the full group photo sequence.
 * Used by: Group Photo Optimizer screen header, Event Readiness Checklist item 2
 * Spec: §4 Screen 6 — success metric
 */
export interface GroupPhotoOptimizerSummary {
  eventId: string;
  groups: GroupPhotoGroup[];
  totalEstimatedMinutes: number;
  isSequenceConfirmed: boolean;       // Drives readinessChecklist.groupPhotosSequenced
  crossGroupParticipantCount: number; // People appearing in 2+ groups
}

/**
 * A generated portrait group derived from the People roster.
 * Richer than GroupPhotoGroup — adds kind, deferred state, and missing-person tracking.
 * Implements the approved 11-step default portrait sequence.
 * Used by: Group Photo Optimizer (execution state), Day-Of Mode portrait tracking,
 *          MissingPersonImpact options
 * Spec: §11 Family and Photo Group Optimizer — 11-step default sequence
 *
 * ADDED v2.0: sourced from PhotoGroup in event-flow-master (oncue-data.ts).
 * Renamed kind values from "bride-side" / "groom-side" to SideA / SideB for
 * generic Event architecture compatibility. Replaces GroupPhotoGroup as the
 * target model for Phase 3 Supabase migration.
 */
export interface PhotoGroup {
  id: string;
  eventId: string;
  label: string;                     // "Couple + Bride's Parents"
  kind: "SideA" | "SideB" | "Shared" | "Custom";
  personIds: string[];               // Person.id references
  estimatedDurationMinutes: number;
  isDeferred: boolean;               // true = group was skipped and moved to end of session
  missingPersonIds: string[];        // Person.id references for people not yet present
  order: number;                     // Position in the portrait sequence (1-based)
  notes: string | null;
}

/**
 * One option for handling a missing person during the portrait session.
 * Presented to the owner as a choice — never applied automatically.
 * Used by: MissingPersonImpact.options, Day-Of Mode missing-person panel
 * Spec: §11 Missing-person flow
 *
 * ADDED v2.0: sourced from the missing-person options model in event-flow-master (oncue-data.ts).
 */
export interface MissingPersonOption {
  id: string;
  label: string;                    // "Proceed without them"
  description: string;              // Full plain-language explanation
  reason: string;                   // Why this option is available given the current situation
  recommended: boolean;             // Constraint engine's top recommendation
  affectedGroupIds: string[];       // PhotoGroup IDs affected by this choice
  estimatedDelayMinutes: number;    // 0 if proceeding without causes no delay
}

/**
 * The full impact model for a single missing person, including all available options.
 * Used by: Day-Of Mode missing-person panel, Group Photo Optimizer (execution state)
 * Spec: §11 Missing-person flow
 *
 * ADDED v2.0: sourced from MissingPersonImpact in event-flow-master (oncue-data.ts).
 */
export interface MissingPersonImpact {
  personId: string;                 // Person.id of the missing individual
  personName: string;               // Display name
  options: MissingPersonOption[];
}


// =============================================================================
// VENDORS
// =============================================================================

/**
 * A vendor role configured for an event with its visibility scope.
 * One VendorRole per role type (DJ, Videographer, etc.) per event.
 * Used by: Vendor Management screen (role list), link generation, role-filtered view
 * Spec: §4 Screen 7; §15 Participant Model
 */
export interface VendorRole {
  id: string;
  eventId: string;
  roleLabel: string;              // "DJ", "Videographer", "Florist", "Custom"
  visibleActivityIds: string[];   // Activities this vendor can see in their filtered view
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
}

/**
 * A shareable link generated for a specific vendor role.
 * No OnCue account required to access; status tracks participant engagement.
 * Used by: Vendor Management screen (status column), Dashboard vendor summary,
 *          Vendor Link Landing (token lookup), participant status tracking
 * Spec: §4 Screen 7; §1 Journey 3; §15 Participant status tracking; §16 non-user access
 */
export interface VendorLink {
  id: string;
  vendorRoleId: string;
  eventId: string;
  token: string;              // URL-safe token: oncue.day/v/{token}
  status: VendorStatus;
  generatedAt: string;        // ISO timestamp
  firstViewedAt: string | null;
  confirmedAt: string | null; // Set when vendor taps "I've got it"
}


// =============================================================================
// SERVICE COVERAGE
// =============================================================================

/**
 * Models the coverage window and billing constraints for any service role attending
 * an event — photographer, videographer, DJ, planner, coordinator, hair/makeup,
 * or any other service provider. This entity is generic and event-type-agnostic.
 *
 * IMPORTANT: ServiceCoverage does NOT store dollar figures, rates, or invoicing data.
 * It exists solely to support Timeline Intelligence:
 *   - Warn when the proposed day schedule would cause a service provider to exceed
 *     their contracted coverage window.
 *   - Surface overage approval requirements to the owner before the wedding day.
 *   - Alert in Day-Of Mode when a hard departure time is approaching.
 *   - Drive recovery option evaluation: "to stay within coverage, compress portraits by 15 min."
 *
 * Coverage belongs to the service ROLE, not to the vendor contact or participant.
 * A vendor contact may have an OnCue participant account (UserEventRole), but
 * ServiceCoverage links to the VendorRole they are fulfilling — not to their
 * identity record or photo/group roster entry. Vendors, People, and Participants
 * are and must remain separate concepts in this data model.
 *
 * Used by: Timeline Intelligence (coverage constraint evaluation), CoverageImpact,
 *          Day-Of Mode (departure alert), Event Readiness warnings
 * Spec: Event Setup architecture review — Section 2
 *
 * ADDED v3.0: from Event Setup architecture review.
 */
export interface ServiceCoverage {
  id: string;
  eventId: string;
  vendorRoleId: string;               // VendorRole.id — the role this coverage applies to
  participantId: string | null;       // UserEventRole.userId — specific participant if known; null if not yet assigned
  coverageStartTime: string;          // "HH:MM" — when this service provider begins their coverage window
  coverageEndTime: string;            // "HH:MM" — scheduled end of contracted coverage
  includedBillableMinutes: number;    // Total contracted coverage duration; may differ from end − start (see exclude fields)
  latestDepartureTime: string | null; // "HH:MM" — hard stop if different from coverageEndTime; null if flexible
  overagePolicy: OveragePolicy;
  maxOverageMinutes: number | null;   // Only set when overagePolicy === "PreApproved"
  excludeTravelTime: boolean;         // true = travel blocks do not count against billable minutes
  excludeBreaksLongerThanMinutes: number | null; // breaks longer than this threshold are excluded; null = no exclusion
  excludeDowntimeLongerThanMinutes: number | null; // idle gaps longer than this threshold are excluded; null = no exclusion
  notes: string | null;               // Any special coverage terms or clarifications
}

/**
 * The constraint engine's evaluation of whether the current timeline would cause
 * one or more service providers to exceed their contracted coverage.
 * Produced during Planning Mode constraint evaluation and in real time in Day-Of Mode
 * when a delay is entered.
 *
 * CoverageImpact is a computed output type, not a stored record.
 * It is generated at evaluation time and surfaced to the owner for awareness and action.
 * It does not represent an invoice, a charge, or a billing notification.
 *
 * Used by: Timeline Intelligence (constraint evaluation output), Day-Of Mode delay panel
 * Spec: Event Setup architecture review — Section 2
 *
 * ADDED v3.0: from Event Setup architecture review.
 */
export interface CoverageImpact {
  serviceCoverageId: string;                // ServiceCoverage.id this evaluation applies to
  projectedBillableMinutes: number;         // Billable minutes the current timeline would consume
  includedBillableMinutes: number;          // What the contract includes (from ServiceCoverage)
  projectedOverageMinutes: number;          // projectedBillableMinutes − includedBillableMinutes; 0 if within coverage
  remainingAllowedOverageMinutes: number | null; // null when overagePolicy === "None"; otherwise maxOverageMinutes − projectedOverageMinutes
  affectedActivityIds: string[];            // Activities that fall outside or near the coverage window
  affectedVendorRoleIds: string[];          // VendorRole.id records whose visibility includes out-of-coverage activities
  approvalRequired: boolean;                // true when overagePolicy === "ApprovalRequired" and overage is projected
  preApproved: boolean;                     // true when overagePolicy === "PreApproved" and within maxOverageMinutes
  recommendedAction: string;                // Plain-language suggestion: "Compress portraits by 15 min to stay within coverage."
}


// =============================================================================
// COLLABORATION: PROPOSALS, CHANGE LOG, SNAPSHOTS
// =============================================================================

/**
 * A change submitted by the couple that has NOT yet been applied.
 * Must be explicitly approved by Owner or CoOwner before taking effect.
 * Used by: Change Review screen — Workflow A (couple proposals section)
 * Spec: §4 Screen 8 — Workflow A; §14 — couple changes always require approval
 */
export interface ChangeProposal {
  id: string;
  eventId: string;
  submittedByUserId: string;
  submittedByName: string;
  submittedByRole: "Couple";    // MVP: only couple submits proposals
  submittedAt: string;          // ISO timestamp
  status: ChangeProposalStatus;
  changeType: ChangeType;
  targetId: string;             // ID of the activity or questionnaire field
  targetLabel: string;          // Human-readable: "Ceremony start time"
  fieldChanged: string;         // "startTime", "durationMinutes", "title"
  originalValue: string;        // Serialized as string for display comparison
  proposedValue: string;
  ownerNote: string | null;     // Optional note left by owner when resolving
  resolvedAt: string | null;
  resolvedByRole: "Owner" | "CoOwner" | null;
}

/**
 * A record of every change made to an event timeline, by any user.
 * Collaborator edits (isReviewRequired = true) flow into the Review Required log.
 * Owner/CoOwner edits (isReviewRequired = false) appear in the full change log.
 * Used by: Change Review — Workflow B (Review Required log), change log view,
 *          "What's Changed Since Last Visit" banner
 * Spec: §4 Screen 8 — Workflow B; §5 Version History — Change log; §14
 */
export interface ChangeLogEntry {
  id: string;
  eventId: string;
  changedByUserId: string;
  changedByName: string;
  changedByRole: UserEventRoleType;
  changedAt: string;            // ISO timestamp
  changeType: ChangeType;
  targetId: string;
  targetLabel: string;
  fieldChanged: string;
  previousValue: string;
  newValue: string;
  isReviewRequired: boolean;    // true for Collaborator edits
  isReverted: boolean;
  revertedAt: string | null;
  revertedByUserId: string | null;
  linkedSnapshotId: string | null;
}

/**
 * An automatic point-in-time snapshot of the full timeline state.
 * Created at key milestones; any snapshot can be restored by the owner.
 * Used by: Planning Mode (snapshot list), version comparison, restore flow
 * Spec: §5 Version History — Automatic snapshots, Full timeline restore; §18
 */
export interface TimelineSnapshot {
  id: string;
  eventId: string;
  createdAt: string;            // ISO timestamp
  trigger: SnapshotTrigger;
  label: string;                // "Before PDF download — Jun 15, 2:34pm"
  activityCount: number;
  isRestoredFrom: boolean;      // true if this snapshot was the source of a restore
}

/**
 * A version comparison between two snapshots.
 * Used by: Planning Mode — version comparison panel
 * Spec: §5 Version History — Change log and version comparison summary; §18
 */
export interface SnapshotComparison {
  fromSnapshotId: string;
  toSnapshotId: string;
  added: Activity[];
  removed: Activity[];
  modified: Array<{
    activityId: string;
    activityTitle: string;
    changedFields: Array<{
      field: string;
      from: string;
      to: string;
    }>;
  }>;
}

/**
 * Plain-language summary of changes since a user's last visit.
 * Shown as a dismissable banner to Owner, Planner, and Couple on return.
 * Used by: Dashboard event card, per-event tab bar, Couple view welcome section
 * Spec: §3 Navigation — "What's Changed Since Last Visit"; §14
 */
export interface ChangeSummary {
  eventId: string;
  viewerUserId: string;
  sinceTimestamp: string;              // The viewer's lastVisitedAt timestamp
  totalChanges: number;
  summaryLines: string[];              // ["Your portrait suggestion was approved.",
                                       //  "The ceremony timeline was updated."]
  isDismissed: boolean;
}

/**
 * Record of a PDF export download.
 * Used by: PDF Export screen (last download date), Event Readiness Checklist item 3
 * Spec: §4 Screen 10 — PDF is a required emergency backup; §20 PDF Backup
 */
export interface PdfExportRecord {
  id: string;
  eventId: string;
  downloadedByUserId: string;
  downloadedAt: string;          // ISO timestamp
  format: PdfExportFormat;
  vendorRoleId: string | null;   // Only set when format === "VendorFiltered"
}


// =============================================================================
// USER AND ROLES
// =============================================================================

/**
 * A user's role assignment within a specific event.
 * One record per person per event. Planners have a plannerRole sub-type.
 * Used by: Role-filtered views, Change Review, permissions enforcement
 * Spec: §6 Role-Filtered Views; §14 Collaboration and Change Control
 */
export interface UserEventRole {
  id: string;
  userId: string;
  eventId: string;
  role: UserEventRoleType;
  plannerRole: PlannerRole | null; // Only set when role is "Collaborator" or "CoOwner"
  displayName: string;
  email: string;
  lastVisitedAt: string | null;    // Drives "What's Changed Since Last Visit"
  invitedAt: string;
  acceptedAt: string | null;
}

/**
 * The authenticated user's global account profile.
 * Used by: Dashboard (account header), Account/Settings screen
 * Spec: §3 Global Navigation; §21 Business and Monetization — pricing tiers
 */
export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  plan: "Free" | "Professional" | "Studio"; // Three approved tiers (§21)
  eventsUsed: number;       // Free tier: max 3 lifetime self-created events
  eventsLimit: number;      // 3 on Free; higher on Professional / Studio
  createdAt: string;
}


// =============================================================================
// DAY-OF MODE
// =============================================================================

/**
 * The current activity displayed in the NOW card on Day-Of Mode.
 * Used by: Day-Of Mode main screen — NOW card
 * Spec: §4 Screen 9 — information hierarchy item 1
 */
export interface WeddingDayCurrentActivity {
  activity: Activity;
  elapsedMinutes: number;
  remainingMinutes: number;
  assignedPeople: string[];
  hasAttentionFlag: boolean;     // true when delay, constraint warning, or missing person
  attentionMessage: string | null;
}

/**
 * State passed into the delay adjustment panel after "Running Late" is tapped.
 * Used by: Day-Of Mode delay panel (all 5 steps)
 * Spec: §2 Execution Mode — Delay adjustment flow
 */
export interface DelayAdjustmentState {
  delayMinutes: number;
  affectedActivities: Array<{
    activity: Activity;
    newStartTime: string;        // "HH:MM" — what it becomes after the delay
    isAnchorThreatened: boolean;
  }>;
  recoveryOptions: RecoveryOption[];
  selectedRecoveryOptionId: string | null;
  notificationCandidates: NotificationCandidate[];
  isConfirmed: boolean;
}

/**
 * The complete state passed into the Day-Of Mode screen.
 * Emergency contacts are loaded upfront for offline access.
 * Used by: Day-Of Mode screen
 * Spec: §4 Screen 9; §19 Emergency Contacts (must be accessible offline)
 */
export interface WeddingDayModeState {
  event: Event;
  currentActivity: WeddingDayCurrentActivity | null;
  upcomingActivities: Activity[];    // Next 2–3 activities (NEXT cards)
  allActivities: Activity[];         // Full timeline reference (read-only)
  emergencyContacts: EmergencyContact[]; // Cached; available without internet
  delayAdjustment: DelayAdjustmentState | null; // null when panel is closed
  lastPdfDownloadedAt: string | null;
}
