# Claude Handoff — Current

**Last updated:** June 21, 2026
**Current phase:** Implementation plan complete — pre-Phase 1 prep required before Lovable

---

## Canonical Repository

**Correct repo:** `https://github.com/KevTrowbridge/oncue`
**Old/accidental repo:** `https://github.com/ktrowbridge/oncue` — left in place, not deleted

---

## Pre-Implementation Status

| Item | Status |
|---|---|
| Architecture v3.0 | Confirmed — all Section 9 decisions approved |
| GitHub repo | `KevTrowbridge/oncue` ✓ |
| Lovable account | Connected to `KevTrowbridge` ✓ |
| Google Drive merge | **Pending — required before Phase 1** |
| TypeScript interfaces | **Pending — required before Phase 1** |
| Application code | None |
| Supabase project | None |
| Lovable project | None |

---

## Why This Build Order Matters

**The BeHive lesson:** BeHive's Lovable scaffold invented its own data types. When Claude Code later wired real Supabase data, it required a single 14,172-line rewrite touching 22 files — rebuilding nearly every component. That is the rewiring problem this plan avoids.

**The fix:** Claude Code writes TypeScript data interfaces that match the real schema *before* Lovable generates a single component. Those interfaces are pasted directly into the Phase 1 Lovable prompt. Lovable's components are built with the correct data shapes from commit one. Wiring Supabase later becomes a swap — not a rewrite.

---

## 10-Phase Implementation Plan

---

### Phase 1 — Static UI Scaffold
**Tool:** Lovable (in-browser editor)

**Deliverable:** A navigable app with all 9 core screens using static placeholder data only. No API calls. No environment variables required to run.

**Screens to build:**
1. Dashboard — event list (2–3 hardcoded event cards with status badges)
2. Create Event — form shell
3. Timeline Editor — hardcoded activity list with section dividers and constraint indicator placeholders
4. Questionnaire — 8-section form shell (all sections visible; no submission logic)
5. Group Photo Optimizer — placeholder group list with cross-group indicator
6. Vendor Management — placeholder role list with Invited / Viewed / Confirmed status badges
7. Change Review — two-section layout: couple proposals (pending/approve/decline) + Review Required log
8. Wedding Day Mode — NOW/NEXT compact card layout; Running Late button; emergency contacts button
9. PDF Export — format selector with 5 format options (no actual PDF generation)

**Visible to founder:** App loads in a browser. All 9 screens are navigable. Visual design and layout are established.

**Must NOT be built yet:** Supabase client, data-fetching hooks, authentication, `.env` vars, real PDF generation, real constraint logic, role-based routing guards, Group Photo Optimizer logic.

**Verification before Phase 2:**
- All 9 screens load in Chrome without console errors
- Zero network requests visible in DevTools
- App runs with no `.env.local` file present
- Founder confirms visual design direction before any code changes are made

---

### Phase 2 — Repo / Code Audit
**Tool:** Claude Code (read-only)

**Deliverable:** A written audit in `docs/` of every file Lovable generated: routing structure, component tree, TypeScript prop interfaces, and an explicit list of every location where static data will be replaced with hook calls.

**Visible to founder:** Audit document in VS Code. A clear map of what Lovable built and exactly what changes in each subsequent phase.

**Must NOT be built yet:** No code changes of any kind.

**Verification before Phase 3:**
- Audit confirms Lovable's component prop shapes match the pre-defined TypeScript interfaces
- Any divergence is identified and resolved before schema work begins
- Claude Code can describe every component's data dependencies without reading code during the session

---

### Phase 3 — Supabase Schema Design
**Tool:** Claude Code

**Deliverable:** Complete SQL migration files in `supabase/migrations/` covering all MVP tables, relationships, Row Level Security policies, and database views. No Supabase project created yet.

**Tables required (minimum):**
- `events`, `activities`, `activity_sections`
- `questionnaire_responses`, `emergency_contacts`
- `group_photo_groups`, `group_participants`
- `vendor_roles`, `vendor_links` (with status: invited/viewed/confirmed)
- `user_event_roles` (owner / collaborator / co-owner / couple)
- `change_proposals`, `change_log`, `timeline_snapshots`

**Visible to founder:** SQL files readable in VS Code. Schema reviewed before any database is created.

**Must NOT be built yet:** No Supabase project. No migrations applied. No auth configured.

**Verification before Phase 4:**
- Founder reads and approves the schema
- Every MVP feature in `docs/architecture/mvp-ux-architecture.md` maps to a confirmed table or column
- No post-launch migration would require destructive changes to existing rows

---

### Phase 4 — First Real Data Flow
**Tool:** Claude Code

**Deliverable:** One screen wired end-to-end: the Dashboard event list. Supabase project created, first migration applied, magic link auth configured. Dashboard reads and creates real events.

**Visible to founder:** Sign in via magic link → see Dashboard → create a test event → it appears in the list → refresh → it persists.

**Must NOT be built yet:** Any other screen beyond Dashboard. No constraint logic. No role filtering.

**Verification before Phase 5:**
- Event creation and retrieval works in an incognito window
- Data survives page refresh
- RLS blocks unauthenticated reads (verify in incognito without signing in)
- No Supabase service key or secret is committed to the repo

---

### Phase 5 — Timeline Engine v1
**Tool:** Claude Code

**Deliverable:** The constraint engine wired to real data. Activities create, reorder, and cascade. Anchor types enforced. Travel blocks auto-inserted on location change. All 6 constraint warning scenarios from the architecture document surface correctly.

**Visible to founder:** In the Timeline Editor — move an activity, see downstream times update, see a constraint warning when an anchor is threatened, see a travel block appear when the location changes between activities.

**Must NOT be built yet:** Collaboration features (no proposals yet), vendor access, Wedding Day Mode, PDF, Group Photo Optimizer.

**Verification before Phase 6:**
- Test each of the 6 constraint warning scenarios from Section 5 of `docs/architecture/mvp-ux-architecture.md`
- Undo/redo works within a session
- First automatic snapshot is created on timeline publish
- Founder confirms the constraint engine feels like real Timeline Intelligence before proceeding

---

### Phase 6 — Collaboration / Review Workflow
**Tool:** Claude Code

**Deliverable:** Planner invite works (Collaborator and Co-owner). Couple magic link sign-in works. Couple can propose a change — it appears in Change Review requiring owner approval. Collaborator edit applies immediately under Review Required — owner sees the notification and can revert. Co-owner can approve couple proposals. What's Changed Since Last Visit appears on return for all roles.

**Visible to founder:** Two-browser test — one tab as owner, one as couple. Submit a suggestion in the couple's tab. See it appear in the owner's Change Review. Approve it. Confirm it applies to the live timeline.

**Must NOT be built yet:** Vendor link access, Wedding Day Mode, PDF export.

**Verification before Phase 7:**
- Couple proposal workflow tested end-to-end in two concurrent browser sessions
- Collaborator Review Required notification appears for owner after a collaborator edit
- Owner can revert a collaborator change from the change log
- What's Changed Since Last Visit shows the correct plain-language summary for each role

---

### Phase 7 — Vendor and Couple Access
**Tool:** Claude Code

**Deliverable:** Vendor link generation works. Vendor sees only their filtered activities (read-only, no account required). Vendor link status updates: Invited on generate, Viewed on first open, Confirmed on "I've got it" tap. Couple can download their filtered PDF. Marketing prompt appears on vendor landing.

**Visible to founder:** Generate a DJ link → open in incognito (no account) → confirm filtered view shows only DJ activities → tap "I've got it" → confirm status updates to Confirmed in Vendor Management.

**Must NOT be built yet:** Wedding Day Mode, full PDF export suite.

**Verification before Phase 8:**
- Vendor cannot see any activity outside their assigned role (verify by checking another vendor's activity is absent)
- No edit controls of any kind visible in vendor view
- Vendor status updates correctly in the owner's Vendor Management screen
- Couple PDF download works from the couple's interface

---

### Phase 8 — Wedding Day Mode
**Tool:** Claude Code

**Deliverable:** Full delay adjustment flow on mobile. Running Late → enter delay → see impacted activities → pick recovery option → approve notification list → timeline updates. Emergency contacts accessible in one tap from the main view. Emergency contact data cached on Wedding Day Mode entry (no internet required after entering).

**Visible to founder:** Mobile phone test — enter a 15-minute delay, see the cascade, pick a recovery, dismiss the notification prompt. Under 60 seconds.

**Must NOT be built yet:** Group Photo Optimizer in execution view, full PDF export suite.

**Verification before Phase 9:**
- 60-second test passed on a real phone (not a simulator)
- Emergency contacts are accessible in airplane mode after entering Wedding Day Mode once
- No notification is sent without explicit owner confirmation
- Mark complete is present but timeline advances by clock time, not by completion taps

---

### Phase 9 — PDF Export and Event Readiness Checklist
**Tool:** Claude Code

**Deliverable:** All 5 PDF export formats working. Event Readiness Checklist wired with all 7 items updating dynamically. Persistent warning shown in Planning Mode if PDF not downloaded before event date. Last download date displayed on Export screen.

**Visible to founder:** Download each of the 5 formats. Open compact itinerary on a phone. Print it. Verify the 7-item checklist responds as each item is completed.

**Must NOT be built yet:** No new features. This phase closes out existing requirements only.

**Verification before Phase 10:**
- All 5 formats download successfully in Chrome and Safari
- Compact itinerary is legible when printed from a phone browser (portrait, one page)
- Checklist item 3 (PDF downloaded) updates immediately after the first download
- Dashboard shows a readiness warning when event is within 7 days and checklist is incomplete

---

### Phase 10 — MVP Review
**Tool:** Founder + Claude Code

**Deliverable:** A complete end-to-end walkthrough with realistic test data for one simulated wedding. Group Photo Optimizer exercised from questionnaire data. All 7 Event Readiness Checklist items reachable. Smart defaults verified on event creation. Vendor status tracking confirmed. What's Changed Since Last Visit confirmed across owner, planner, and couple.

**Visible to founder:** Full simulated wedding day — event creation, questionnaire, timeline build, collaboration, vendor access, Wedding Day Mode delay handling, PDF download.

**Must NOT be built yet:** Anything outside the confirmed MVP feature list. No new features until this review is complete and the product has been used on at least one real wedding.

**Verification — MVP is done when:**
- Founder completes the full flow without asking Claude for help
- All 7 Event Readiness Checklist items are achievable with realistic test data
- Delay handling passes the 60-second phone test
- All 6 constraint warning scenarios surface correctly
- Group Photo Optimizer generates a usable sequence from questionnaire participants

---

## Two Actions Required Before Phase 1

In this order:

**1. Founder (Google Drive merge)**
Open both Master Google Docs. Copy confirmed architecture content from `docs/architecture/mvp-ux-architecture.md` into `OnCue Master Document V2.gdoc` and `OnCue Founder Decisions Log.gdoc`. This is a founder-only action.

**2. Claude Code (TypeScript interfaces)**
Before Lovable builds a single screen, Claude Code writes the TypeScript data interfaces that every Lovable component will use. These are pasted directly into the Phase 1 Lovable prompt. This prevents Lovable from inventing data shapes that later require a full rewrite.

---

## Git Status

| Hash | Message | Location |
|---|---|---|
| `3e81cc0` | Confirm repo migration commit hash in live handoff | KevTrowbridge/oncue |
| `aeb5c2e` | Record OnCue repo migration to KevTrowbridge/oncue | KevTrowbridge/oncue |
| `63cb88a` | Apply v3.0 red-team additions to MVP UX Architecture | KevTrowbridge/oncue |

No application code. No Lovable project. No Supabase.

## Review Status
Visible to founder: Yes — this handoff and `docs/architecture/mvp-ux-architecture.md` in VS Code
Founder review recommended: Yes — review the 10-phase plan before proceeding
Next step: Complete Google Drive merge, then use the prompt below

---

## Exact Next Prompt (after Google Drive merge is confirmed)

```
Google Drive merge is complete. All founder decisions are confirmed.

Before Phase 1 (Lovable scaffold) begins, write the TypeScript data
interfaces that Lovable will use in every component. These will be
pasted directly into the Phase 1 Lovable prompt so components are
built with the correct data shapes from the start — preventing the
BeHive-style rewiring problem.

Based on docs/architecture/mvp-ux-architecture.md, write interfaces for:

- Event, EventStatus (Draft / Active / DayOf / Archived)
- Activity, ActivitySection
- AnchorType enum (Locked / Preferred / Flexible / MovableWithApproval)
- Priority enum (Critical / Important / Flexible / Optional / Buffer)
- VisibilityTarget enum (Owner / Planner / Couple / vendor role names)
- QuestionnaireSection (all 8 sections with their fields)
- GroupPhotoGroup, GroupParticipant
- VendorRole, VendorLink
- VendorStatus enum (Invited / Viewed / Confirmed)
- PlannerRole enum (Collaborator / CoOwner)
- ChangeProposal, ChangeProposalStatus (Pending / Approved / Declined)
- ChangeLogEntry
- TimelineSnapshot
- EmergencyContact
- UserEventRole (Owner / Collaborator / CoOwner / Couple / Vendor)
- EventReadinessChecklist (7 boolean items)

Write these to:
  docs/architecture/data-interfaces.ts

Do not write any application components.
Do not create any Supabase migrations.
Do not start Lovable.
These interfaces will be reviewed, then pasted into the Phase 1 prompt.

Work only in: /Users/kevintrowbridge/SaaS Development/OnCue
```
