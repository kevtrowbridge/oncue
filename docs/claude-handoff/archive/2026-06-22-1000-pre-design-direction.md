# Claude Handoff — Current

**Last updated:** June 22, 2026
**Current phase:** Pre-Phase 1 prep complete — TypeScript interfaces written — ready for founder review before Phase 1 Lovable scaffolding

---

## Canonical Repository

**Correct repo:** `https://github.com/KevTrowbridge/oncue`
**Old/accidental repo:** `https://github.com/ktrowbridge/oncue` — left in place, not deleted

---

## Pre-Phase 1 Status

| Item | Status |
|---|---|
| Architecture v3.0 | Confirmed — all Section 9 decisions approved |
| GitHub repo | `KevTrowbridge/oncue` ✓ |
| Lovable account | Connected to `KevTrowbridge` ✓ |
| Google Drive merge | **Complete** ✓ |
| TypeScript interfaces | **Complete** ✓ — `docs/architecture/data-interfaces.ts` |
| 10-phase implementation plan | Complete — `docs/claude-handoff/current.md` (prior version) |
| Application code | None |
| Supabase project | None |
| Lovable project | None |

**All pre-Phase 1 prerequisites are complete. Phase 1 may begin after founder reviews the interfaces.**

---

## What Was Completed This Session

**TypeScript data interfaces written:**

File: `docs/architecture/data-interfaces.ts`

44 exports — 12 type aliases (enums) and 32 interfaces.

**Coverage confirmed against all 11 architecture screens:**

| Screen | Key types provided |
|---|---|
| Dashboard | `Event`, `VendorSummary`, `EventReadinessChecklist` |
| Create Event | `Event`, `EventLocation` |
| Questionnaire (all 8 sections) | `EventQuestionnaire` + 7 section types + `EmergencyContact` |
| Timeline Editor | `Activity`, `ActivitySection`, `ConstraintWarning` |
| Activity Detail Panel | `Activity` (24 fields) |
| Group Photo Optimizer | `GroupPhotoGroup`, `GroupParticipant`, `GroupPhotoOptimizerSummary` |
| Vendor Management | `VendorRole`, `VendorLink`, `VendorStatus` |
| Change Review | `ChangeProposal`, `ChangeLogEntry`, `ChangeSummary` |
| Wedding Day Mode | `WeddingDayModeState`, `DelayAdjustmentState`, `RecoveryOption`, `NotificationCandidate` |
| PDF Export | `PdfExportFormat`, `PdfExportRecord` |
| Couple View | `Activity`, `EventQuestionnaire`, `ChangeProposal`, `ChangeSummary` |

**All enums confirmed:**
`EventStatus` · `AnchorType` · `Priority` · `VisibilityTarget` · `VendorStatus` ·
`PlannerRole` · `ChangeProposalStatus` · `ChangeType` · `SnapshotTrigger` ·
`GroupPhotoStatus` · `PdfExportFormat` · `UserEventRoleType`

**Also included beyond the minimum specification:**
- `ConstraintWarning` — required for Timeline Editor inline warnings and the constraint engine (Phase 5)
- `RecoveryOption` — required for Wedding Day Mode delay panel (Phase 8)
- `NotificationCandidate` — required for selective notification step after delay (Phase 8)
- `WeddingDayModeState` — assembles everything Wedding Day Mode needs in one prop type
- `DelayAdjustmentState` — manages all 5 steps of the delay flow in one structure
- `SnapshotComparison` — required for version comparison summary (Phase 6)
- `PdfExportRecord` — required for tracking download history and readiness checklist item 3
- `UserProfile` — required for Dashboard account header and free-tier event count
- `VendorSummary` — required for Dashboard event card vendor status chip

---

## Files Created or Modified

| File | Action |
|---|---|
| `docs/architecture/data-interfaces.ts` | Created — v1.0 |
| `docs/claude-handoff/archive/2026-06-22-0900-pre-typescript-interfaces.md` | Created (prior handoff archived) |
| `docs/claude-handoff/current.md` | Updated (this file) |

No application code. No Supabase project. No Lovable project.

---

## Git Status

| Hash | Message | Location |
|---|---|---|
| `73e42bc` | Write TypeScript data interfaces for Phase 1 Lovable scaffold | KevTrowbridge/oncue |
| `f99bd21` | Add 10-phase OnCue implementation plan to live handoff | KevTrowbridge/oncue |
| `3e81cc0` | Confirm repo migration commit hash in live handoff | KevTrowbridge/oncue |

---

## Founder Review Required Before Phase 1

**Action:** Open `docs/architecture/data-interfaces.ts` in VS Code.

Review specifically:
- `EventStatus` values — confirm the 7-state lifecycle (Draft / InProgress / ReviewNeeded / Ready / Live / Completed / Archived) matches your intended UX
- `AnchorType` values — confirm Locked / Preferred / Flexible / MovableWithApproval
- `EventReadinessChecklist` — confirm all 7 boolean field names match your intent
- `Activity` — 24 fields; confirm nothing is missing or misnamed before Lovable uses them
- `ChangeProposal` vs `ChangeLogEntry` — these are two distinct structures; confirm the distinction makes sense
- `WeddingDayModeState` — confirm this assembles everything Wedding Day Mode needs

If you see any field names, types, or enum values that do not match your intent, correct them before Phase 1 begins. These names will propagate through every Lovable-generated component.

---

## Review Status
Visible to founder: Yes — `docs/architecture/data-interfaces.ts` in VS Code
Founder review recommended: Yes — required before the Lovable prompt is run
Next step: Founder reviews interfaces, then uses the Phase 1 prompt below

---

## Phase 1 Lovable Scaffolding Prompt

After reviewing and approving the interfaces, use this prompt to start Phase 1 in Lovable.

**Instructions for use:**
1. Log into Lovable
2. Connect to `KevTrowbridge/oncue` (or open the existing project if already created)
3. Paste the prompt below as the first message

---

```
Build the static UI scaffold for OnCue — a Timeline Intelligence platform for
wedding photographers. This is Phase 1: static only, no data fetching, no API
calls, no Supabase, no environment variables required.

The data shapes for every component are already defined. They live in:
  docs/architecture/data-interfaces.ts

Import types from that file wherever needed. Do not invent your own data
structures. Every prop type must match the interfaces in that file exactly.

Build these 9 screens using hardcoded static placeholder data that matches
the interface shapes:

1. DASHBOARD — event list
   - 2–3 hardcoded Event cards
   - Each card: couple names, event date, status badge (use EventStatus),
     days-until chip, pending proposals badge, vendor status chip
     (use VendorSummary), Event Readiness Checklist summary near event date
   - "Create Event" button
   - Archived events section (collapsed)

2. CREATE EVENT — form shell
   - Couple name 1, couple name 2, event date, primary location (optional)
   - "Create" button (no submission logic)
   - Template selector showing "Wedding" as the only option

3. TIMELINE EDITOR — planning mode
   - Left panel: ordered activity list with section dividers
   - Each activity row: title, start time, duration, location label,
     anchor type indicator, constraint warning badge when applicable
   - Travel block rows (visually distinct)
   - Right panel: Activity Detail Panel with all Activity fields
   - Toolbar: undo, redo, pending proposals count, Review Required badge,
     publish/share button
   - Inline constraint warning shown on one activity as a placeholder

4. QUESTIONNAIRE — all 8 sections
   - Section navigation (sidebar or tabs): Core Details, Locations,
     Family & Wedding Party, Group Photo Priorities, Vendors,
     Preferences, Priorities, Emergency Contacts
   - Each section: form fields matching the questionnaire interfaces
   - Progress indicator per section
   - "Invite couple to complete their sections" button

5. GROUP PHOTO OPTIMIZER
   - Auto-generated group list (3–4 placeholder groups)
   - Each group card: label, participant names, estimated duration,
     status badge (use GroupPhotoStatus), cross-group participant indicator
   - Total estimated block time at top
   - Reorder handle on each card
   - "Sequence confirmed" toggle

6. VENDOR MANAGEMENT
   - Role list: DJ, Videographer, Florist, Hair/Makeup, Venue, Officiant
   - Each row: role label, contact name, vendor status badge
     (use VendorStatus — show one Invited, one Viewed, one Confirmed)
   - "Copy link" button per row
   - "Generate link" for roles without a link
   - Preview vendor view button

7. CHANGE REVIEW
   - Two sections: "Needs your decision" (couple proposals) and
     "Review Required" (collaborator changes — already applied)
   - Couple proposals section: 1–2 placeholder proposals with
     original value vs. proposed value, Approve / Decline buttons
   - Review Required section: 1 placeholder collaborator change
     with Revert button
   - What's Changed banner at top (dismissable)

8. WEDDING DAY MODE
   - Compact card layout — mobile-first, one-handed
   - NOW card: activity title, location, assigned people, time remaining
   - NEXT section: 2–3 upcoming activity rows (minimal)
   - Attention flag (visible as a placeholder — styled but not wired)
   - "Running Late" button — prominent, accessible in one tap
     Opens delay panel with: delay amount selector (5/10/15/20/30+),
     affected activities list, recovery option cards (2–3 placeholder options),
     notification candidate list with checkboxes, Confirm button
   - Emergency contacts button — opens panel with name/role/phone rows

9. PDF EXPORT
   - 5 format options: Compact Itinerary, Full Timeline, Vendor-Filtered,
     Group Photo Only, Couple's View
   - Each format: label, brief description, "Download" button
     (no actual PDF generation — button is a placeholder)
   - Last download date shown (hardcoded placeholder)
   - Warning banner if PDF not yet downloaded (show as a placeholder)

DESIGN REQUIREMENTS:
- Mobile-first. All screens must work on a 390px wide phone screen.
- Wedding Day Mode must be operable with one thumb. Primary actions
  in the bottom half of the screen. Touch targets minimum 44×44pt.
- Running Late button and emergency contacts must be reachable in 2 taps
  from the main Wedding Day screen.
- Planning Mode on mobile: bottom tab bar, detail panel as bottom sheet.
- All placeholder data must use realistic values (real names, real times,
  real wedding-day language) — not "Lorem ipsum" or "Activity 1".

DO NOT BUILD:
- Supabase client or any data fetching
- Authentication or session management
- Real constraint logic or time calculations
- Real PDF generation
- Role-based routing guards
- Any .env variables or configuration

The goal of Phase 1 is: every screen loads without errors, all placeholder
data uses the correct interface shapes, and the visual design is established.
A Claude Code audit will follow before any real data is wired.
```

---

## Exact Next Step (after founder reviews interfaces)

**Founder action:** Review `docs/architecture/data-interfaces.ts` in VS Code. Correct any field names or enum values that do not match your intent. Then open Lovable and paste the Phase 1 prompt above.

**After Phase 1 is complete:** Return to Claude Code with:
> "Phase 1 Lovable scaffold is complete. Run the Phase 2 code audit."
