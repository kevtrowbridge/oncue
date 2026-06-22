/**
 * OnCue MVP — TypeScript Data Interfaces
 * Version: 1.0 | June 21, 2026
 *
 * PURPOSE
 * These interfaces define every data shape used across all OnCue components.
 * They are written before the Lovable scaffold so Lovable builds components
 * with the correct prop types from the start — preventing the need for full
 * rewrites when Supabase is wired in Phase 4.
 *
 * SOURCE
 * docs/architecture/mvp-ux-architecture.md (v3.0)
 * docs/FOUNDER_DECISIONS.md
 *
 * PHASE USAGE
 * Phase 1 (Lovable scaffold): use these with hardcoded static arrays
 * Phase 4+ (Claude Code): replace static arrays with Supabase hook results
 *   that return these same types — no component rewrites required
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
 */
export type EventStatus =
  | "Draft"         // Created; questionnaire not yet started or shared
  | "InProgress"    // Actively being built; not yet shared with couple
  | "ReviewNeeded"  // Pending couple or collaborator proposals awaiting review
  | "Ready"         // All 7 Event Readiness Checklist items are complete
  | "Live"          // Wedding day is today — Wedding Day Mode is active
  | "Completed"     // Event date has passed; still briefly writable
  | "Archived";     // Read-only; Planning Mode is locked

/**
 * How an activity behaves when the constraint engine recalculates times.
 * Used by: Activity Detail Panel, Timeline Editor (anchor indicator), constraint engine
 * Spec: §5 Interaction Patterns — Anchor Types
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
 * Lifecycle of a vendor's engagement with their shared link.
 * Used by: Vendor Management screen, Dashboard event card vendor summary chip
 * Spec: §4 Screen 7 — Vendor status definitions; §1 Journey 3
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
 * A single scheduled item on the wedding day timeline.
 * Used by: Timeline Editor (list rows), Activity Detail Panel, Wedding Day Mode,
 *          Group Photo Optimizer (when exported to timeline), role-filtered views
 * Spec: §4 Screens 4, 5, 9
 */
export interface Activity {
  id: string;
  eventId: string;
  sectionId: string;
  title: string;
  durationMinutes: number;
  minimumDurationMinutes: number;
  startTime: string | null;           // "HH:MM"; null until constraint engine calculates
  calculatedEndTime: string | null;   // "HH:MM"; derived from startTime + duration
  anchorType: AnchorType;
  priority: Priority;
  locationId: string | null;          // null = inherit location from parent section
  locationInherited: boolean;         // true when location comes from section default
  visibleTo: VisibilityTarget[];
  requiredPeople: string[];           // Names or roles who must be present
  weatherSensitive: boolean;
  isOutdoor: boolean;
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
  message: string;              // "Ceremony is locked at 4:00pm. Extending..."
  suggestionMessage: string | null; // Optional recovery suggestion shown inline
}

/**
 * One recovery option presented after a delay is entered in Wedding Day Mode.
 * Used by: Wedding Day Mode delay panel (step 3 — recovery options list)
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
 * Used by: Wedding Day Mode delay panel (step 4 — notification selection)
 * Spec: §2 Execution Mode — notification step; system never notifies automatically
 */
export interface NotificationCandidate {
  id: string;
  displayName: string;
  role: string;            // "DJ", "Planner", "Florist"
  contactMethod: string;   // Phone number or email (display only)
  isSelected: boolean;     // Owner can add or remove before confirming
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
 * Compact vendor status summary shown on the Dashboard event card.
 * Used by: Dashboard event card, event header vendor chip
 * Spec: §4 Screen 1 — information hierarchy item 2
 */
export interface VendorSummary {
  totalVendors: number;
  confirmedCount: number;
  viewedCount: number;
  invitedCount: number;   // Generated but not yet opened
}

/**
 * The 7-item Event Readiness Checklist.
 * All 7 must be true before an event should be considered ready for the wedding day.
 * Used by: Dashboard event card (near event date), Planning Mode sidebar,
 *          PDF Export screen (item 3 gating)
 * Spec: §2 Planning Mode — Event Readiness Checklist; §9 item B
 */
export interface EventReadinessChecklist {
  questionnaireComplete: boolean;    // All required questionnaire sections filled in
  groupPhotosSequenced: boolean;     // Group Photo Optimizer run and sequence confirmed
  pdfBackupDownloaded: boolean;      // At least one compact or full PDF downloaded
  noCriticalWarnings: boolean;       // No unresolved anchor threats or chain violations
  coupleProposalsResolved: boolean;  // No pending couple proposals
  vendorLinkShared: boolean;         // At least one vendor has been sent their link
  emergencyContactsEntered: boolean; // At least one emergency contact in questionnaire
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
 * Scope is intentionally broad: parents, step-parents, grandparents, siblings,
 * children, extended family, chosen family, VIPs — anyone in a group photo.
 * Used by: Questionnaire sections 3 & 4, Group Photo Optimizer
 * Spec: §4 Screen 3 — sections 3 & 4; §4 Screen 6 note
 */
export interface GroupParticipant {
  id: string;
  eventId: string;
  name: string;
  relationship: string;          // "Grandmother (Bride's side)", "Best Man", "MOH"
  notes: string | null;          // Mobility needs, arriving late, seat preference, etc.
  isWeddingParty: boolean;       // true = also in wedding party (Section 4)
  weddingPartyRole: string | null; // "MOH", "Groomsman", "Flower Girl", "Officiant"
  sortOrder: number;
}

/**
 * Section 5 — A vendor connected to the event.
 * Also the source for vendor link generation.
 * Used by: Questionnaire screen section 5, Vendor Management screen
 * Spec: §4 Screen 3 — section 5
 */
export interface QuestionnaireVendor {
  id: string;
  eventId: string;
  roleLabel: string;             // "Florist", "DJ", "Videographer", "Planner", etc.
  name: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  arrivalTime: string | null;    // "HH:MM"
}

/**
 * Section 6 — Creative and emotional preferences.
 * Used by: Questionnaire screen section 6
 * Spec: §4 Screen 3 — section 6
 */
export interface QuestionnairePreferences {
  idealPortraitLocation: string | null;
  dreamSpaceDescription: string | null;
  importantPeopleAndMoments: string | null;
  emotionalPriorities: string | null;
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
 * Cached for offline access when Wedding Day Mode is entered.
 * Used by: Questionnaire screen section 8, Wedding Day Mode emergency panel
 * Spec: §4 Screen 3 — section 8; §4 Screen 9 — emergency contacts panel; §9 item G
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
 */
export interface EventQuestionnaire {
  eventId: string;
  coreDetails: QuestionnaireCoreDetails;
  locations: QuestionnaireLocations;
  groupParticipants: GroupParticipant[];  // Sections 3 & 4 combined
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
// GROUP PHOTO OPTIMIZER
// =============================================================================

/**
 * One group photo combination (e.g. "Bride's Parents + Siblings").
 * Auto-generated from questionnaire participants; owner adjusts before confirming.
 * Used by: Group Photo Optimizer screen (group list), timeline export
 * Spec: §4 Screen 6
 */
export interface GroupPhotoGroup {
  id: string;
  eventId: string;
  label: string;                       // "Couple + Both Sets of Parents"
  participantIds: string[];            // References GroupParticipant.id
  estimatedDurationMinutes: number;
  status: GroupPhotoStatus;
  appearsInMultipleGroupsParticipants: string[]; // Participant IDs that appear in 2+ groups
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


// =============================================================================
// VENDORS
// =============================================================================

/**
 * A vendor role configured for an event with its visibility scope.
 * One VendorRole per role type (DJ, Videographer, etc.) per event.
 * Used by: Vendor Management screen (role list), link generation, role-filtered view
 * Spec: §4 Screen 7
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
 * No OnCue account required to access; status tracks vendor engagement.
 * Used by: Vendor Management screen (status column), Dashboard vendor summary,
 *          Vendor Link Landing (token lookup), vendor status tracking
 * Spec: §4 Screen 7 — Vendor status definitions; §1 Journey 3; §9 item F
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
// COLLABORATION: PROPOSALS, CHANGE LOG, SNAPSHOTS
// =============================================================================

/**
 * A change submitted by the couple that has NOT yet been applied.
 * Must be explicitly approved by Owner or CoOwner before taking effect.
 * Used by: Change Review screen — Workflow A (couple proposals section)
 * Spec: §4 Screen 8 — Workflow A; §9 item A (couple changes always require approval)
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
 * Spec: §4 Screen 8 — Workflow B; §5 Version History — Change log; §9 item A
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
 * Spec: §5 Version History — Automatic snapshots, Full timeline restore
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
 * Spec: §5 Version History — Change log and version comparison summary
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
 * Spec: §3 Navigation — "What's Changed Since Last Visit"; §9 item E
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
 * Spec: §4 Screen 10 — PDF is a required emergency backup; §9 item I
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
 * Spec: §6 Role-Filtered Views
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
 * Spec: §3 Global Navigation
 */
export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  plan: "Free" | "Pro";
  eventsUsed: number;       // Free tier: max 3 lifetime events
  eventsLimit: number;      // 3 on Free; higher on Pro
  createdAt: string;
}


// =============================================================================
// WEDDING DAY MODE
// =============================================================================

/**
 * The current activity displayed in the NOW card on Wedding Day Mode.
 * Used by: Wedding Day Mode main screen — NOW card
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
 * Used by: Wedding Day Mode delay panel (all 5 steps)
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
 * The complete state passed into the Wedding Day Mode screen.
 * Emergency contacts are loaded upfront for offline access.
 * Used by: Wedding Day Mode screen
 * Spec: §4 Screen 9; §9 item G (emergency contacts cached offline)
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
