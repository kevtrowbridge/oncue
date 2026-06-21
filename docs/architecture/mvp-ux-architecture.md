# OnCue MVP UX Architecture

**Version:** 1.0
**Date:** June 21, 2026
**Phase:** Pre-implementation — architecture only. No Lovable build has begun.
**Scope:** MVP required for initial validation on real weddings.

---

## Preface

This document grounds every section in the three authoritative product documents:
- `OnCue_Master_Strategy_and_Brand_Guardrails.md`
- `OnCue_Product_Architecture_and_Technical_Guardrails.docx`
- `OnCue_MVP_Specification_and_Roadmap.docx`

Decisions not yet covered by those documents are marked **[ASSUMPTION]** and require founder confirmation before implementation begins.

---

## 1. Core User Journeys

### Role Mapping

The four roles in OnCue's MVP correspond to the following users:

| Architecture Role | OnCue Role | Who |
|---|---|---|
| Owner | **Owner / Photographer** | The professional who creates the OnCue account and owns the event. Primary Phase 1 user. |
| Manager | **Planner** | A second professional collaborator (wedding planner). Co-manages the timeline. |
| Team Member | **Vendor** | External service providers: DJ, videographer, florist, hair/makeup, officiant. Read-only filtered access. |
| Individual User | **Client / Couple** | The couple being married. Completes the questionnaire, views their timeline, and can suggest changes. |

---

### Journey 1: Owner (Photographer)

**Who:** The photographer who created the OnCue account and owns the event.

#### A. Create and set up a new event

**Trigger:** Photographer books a wedding and wants to build a working timeline.

**Desired outcome:** A dependency-aware, populated draft timeline is ready for refinement, with the questionnaire started and the couple invited.

**Key screens:**
1. Dashboard → Create Event
2. Template Selection (Wedding template)
3. Event Details (date, name, couple names, location)
4. Timeline Editor — populated from template
5. Questionnaire — photographer-facing fields completed
6. Questionnaire — client link sent to couple

---

#### B. Build and refine the timeline

**Trigger:** Questionnaire data is available; photographer wants to translate it into a working timeline.

**Desired outcome:** A dependency-aware timeline with anchors, locations, family groups, and durations that can survive change.

**Key screens:**
1. Timeline Editor — add, reorder, and time activities
2. Activity Detail Panel — set duration, anchor type, location, priority, visibility, dependencies
3. Family Group Optimizer — generate and sequence family photo groups
4. Vendor Role view preview — confirm what each vendor will see

---

#### C. Collaborate and publish

**Trigger:** Timeline is ready for planner or couple review.

**Desired outcome:** Couple and planner have viewed and approved the timeline; PDF backup is ready.

**Key screens:**
1. Timeline Editor — publish / share
2. Change Review screen — review client suggestions
3. PDF Export — download compact and filtered versions
4. Event Readiness check — print backup confirmed

---

#### D. Execute on wedding day

**Trigger:** It is the wedding day.

**Desired outcome:** Photographer navigates the day with complete clarity: what is happening now, what is next, who is responsible, and what needs attention.

**Key screens:**
1. Wedding Day Mode — compact execution view
2. Recovery options panel (when a delay is flagged)

---

### Journey 2: Planner (Manager)

**Who:** A wedding planner added to the event as a collaborator.

**Trigger:** Photographer invites the planner to collaborate on a timeline.

**Desired outcome:** Planner can view, co-edit the timeline, and coordinate vendors — without taking ownership of the photographer's account.

**Key screens:**
1. Invitation acceptance / onboarding
2. Timeline Editor — full view with co-edit permissions
3. Vendor Role management (can configure which activities vendors see)
4. Change Review — can approve client suggestions on behalf of the team
5. Wedding Day Mode — execution view (identical to owner's view)
6. PDF Export — can download all views

**Distinction from Owner:** Planner cannot manage billing, delete the event, or modify account settings.

---

### Journey 3: Vendor (Team Member)

**Who:** A DJ, videographer, florist, hair/makeup artist, or other service provider.

**Trigger:** Owner or Planner shares a vendor access link or sends an invitation.

**Desired outcome:** Vendor sees only the activities relevant to their role, can print a one-page reference, and does not need an OnCue account.

**Key screens:**
1. Shared link landing — no login required **[ASSUMPTION: vendor access is link-based, not account-based for MVP]**
2. Vendor-Filtered Timeline — read-only, only their relevant activities shown
3. PDF Export — one-page filtered view for their role

**Restrictions:**
- Cannot edit any activity
- Cannot see the full timeline (only their visibility scope)
- Cannot access questionnaire or family groups
- Cannot see other vendors' contact details

---

### Journey 4: Client / Couple (Individual User)

**Who:** The couple being married.

**Trigger:** Photographer sends the questionnaire link after booking.

**Desired outcome:** Couple has filled in their preferences, family information, vendor contacts, and reviewed the timeline — without needing to understand the constraint engine.

**Key screens:**
1. Questionnaire (link-based, client-facing view — only their portion of the form)
2. Timeline Review — read-only view of the full timeline, presented simply
3. Suggest a Change — inline comment or suggestion (does not modify the live timeline)
4. **[ASSUMPTION]** Confirmation screen showing their suggestions have been submitted

**Restrictions:**
- Cannot directly edit any activity
- Cannot see vendor contact details
- Cannot see internal photographer notes or preference notes
- Cannot access the Family Group Optimizer detail view

---

## 2. Product Modes

### Planning Mode

**Purpose:** Build, refine, collaborate on, and approve the timeline before the wedding day.

**Available actions:**
- Create and configure the event
- Edit timeline activities: title, duration, location, anchor type, priority, visibility, dependencies, notes
- Drag and reorder activities (dependency chain updates accordingly)
- Run the Family Group Optimizer
- Complete or update the questionnaire
- Invite planner and clients
- Share vendor access links
- Review and approve client suggestions
- View change history and roll back to a prior version
- Export PDF in any available view
- Preview any role-filtered view

**Data displayed:**
- Full timeline with all activities
- Durations, start/end times, buffers, anchors
- Location assignments and travel blocks
- Constraint warnings and dependency chain state
- Family group list and estimated durations
- Change log and current publish state
- Event readiness checklist

**Success criteria:**
- Timeline accurately reflects the day's intended flow
- All anchor points are set correctly
- Family groups are sequenced and estimated
- Couple has completed the questionnaire
- At least one PDF backup has been downloaded

**When Planning Mode is unavailable:**
After the event date passes, the event becomes read-only. Planning Mode is locked. The timeline can still be viewed and exported but not edited.

---

### Execution Mode (Wedding Day Mode)

**Purpose:** Navigate the wedding day in real time. Maximum clarity, minimum cognitive load.

**Available actions:**
- View current and next activity
- See who is responsible for the current activity
- Flag a delay and view recovery options
- Accept or reject a suggested recovery change (approval required before the live timeline updates)
- Mark activities complete **[ASSUMPTION: this requires founder confirmation — not yet in Master Docs]**
- Access the compact PDF backup (offline-safe)
- Switch to a full timeline view (read-only reference)

**Data displayed:**
- Current activity: title, duration, location, notes
- Next 2–3 activities
- Attention flags (delays, missing people, constraint warnings)
- Recovery options when a delay is flagged
- Assigned vendor or person responsible
- Elapsed and remaining time for the current activity

**Success criteria:**
- Photographer and planner can answer the four core OnCue questions without switching screens:
  - What is happening now?
  - What happens next?
  - Who is responsible?
  - What requires attention?
- Recovery options are visible and actionable in under three taps

**What Execution Mode is not:**
- Not a full editor
- Not a drag-and-drop interface
- Not the place to restructure the timeline or adjust family groups

---

### Mode Transition

| Transition | Trigger | Who can trigger |
|---|---|---|
| Planning → Execution | Manual switch on event day, or automatic prompt when event date arrives | Owner, Planner |
| Execution → Planning reference | Tapping a "View full timeline" affordance inside Execution Mode | Owner, Planner |
| Execution → Planning edit | Not allowed on event day. Return after event date has passed and event is archived | — |
| Event → Archived (read-only) | Automatic when event date passes | System |

---

## 3. Page Map / Navigation

### Global Navigation (Signed In)

```
Dashboard          ← event list; primary landing page
  └── Create Event
Account / Settings ← plan, branding, profile
```

### Per-Event Navigation (inside an event)

```
Event: [Wedding Name]
  ├── Timeline        ← default view; Planning Mode editor
  ├── Questionnaire   ← event intelligence collection
  ├── Family Groups   ← Family Group Optimizer
  ├── Vendors         ← role assignments, shared links, visibility config
  ├── Wedding Day     ← Execution Mode (visible/prominent as event date approaches)
  └── Export          ← PDF views: compact, full, filtered
```

### Access for Shared / External Users (No Login Required)

```
Vendor Link         ← role-filtered read-only view + PDF export
Client Link         ← questionnaire + timeline review + suggest changes
```

### Mobile Considerations

- **Wedding Day Mode is the primary mobile experience.** It must work one-handed on a phone screen, in bright outdoor light, in landscape or portrait.
- Planning Mode can be used on mobile for quick edits, but the full timeline editor is optimized for tablet and desktop.
- All printed PDF views must be portrait-oriented and legible when printed from a phone browser.
- Navigation in Planning Mode collapses to a bottom tab bar on mobile, not a sidebar.

### Desktop Considerations

- Planning Mode editor uses a sidebar panel layout: timeline list on the left, detail/edit panel on the right.
- Family Group Optimizer benefits from two-panel layout (group list + people picker side by side).
- Questionnaire sections displayed in a scrollable single-column form — same as mobile.
- Wedding Day Mode on desktop mirrors mobile layout (centered card), because it is used at events, not at desks.

---

## 4. Key Screens and Content Hierarchy

### Screen 1: Dashboard — Event List

**Purpose:** Show all events at a glance; provide the primary entry point to active and upcoming events.

**Primary action:** Create a new event.

**Secondary actions:** Open an existing event; view archived events.

**Information hierarchy:**
1. Upcoming events (sorted by event date, ascending)
2. Each event card: wedding name, date, couple names, status badge (Draft / Active / Day-of / Archived), days-until indicator
3. Archived events (collapsed section)
4. Account/plan status (free tier events remaining, or plan indicator)

**Success metric:** Photographer can find and open any event in one tap.

---

### Screen 2: Create Event

**Purpose:** Create a new event record and select the starting template.

**Primary action:** Confirm event details and enter the timeline editor.

**Secondary actions:** Change template selection.

**Information hierarchy:**
1. Template selector (Wedding is default and only MVP template)
2. Event date
3. Couple names (First name + Partner first name, merged surname optional)
4. Primary location (optional at creation — can be set later)
5. Create button

**Success metric:** Event is created with correct date; timeline editor opens with the wedding template pre-populated.

---

### Screen 3: Questionnaire

**Purpose:** Collect event intelligence: people, locations, preferences, vendors, and family data that powers the constraint engine and Family Group Optimizer.

**Primary action:** Photographer completes their sections; sends client link for couple's sections.

**Secondary actions:** Update a field; re-send client link; mark questionnaire complete.

**Information hierarchy (sections):**
1. Core event details (couple names, surnames, date, phone, email)
2. Locations (getting ready — bride, getting ready — groom, first look, ceremony, portraits, reception, sunset portraits)
3. Family data (parents, grandparents, step-parents status, siblings, children, family herder — powers Family Group Optimizer)
4. Wedding party (best man, MOH, bridesmaids, groomsmen, flower girl, ring bearer, MC, officiant)
5. Vendors (planner, venue, florist, catering, DJ, hair/makeup, videographer, cake, decor)
6. Preferences (ideal portrait location, dream space, important people and moments, emotional priorities)
7. Priorities (most important moments, most flexible moments — used in recovery planning)

**Client-facing subset:** Sections 1 (partial), 2 (partial), 3, 6, 7.
**Photographer-facing:** All sections.

**Success metric:** Timeline Intelligence engine has enough data to populate location inheritance, travel blocks, and family group suggestions without additional manual input.

---

### Screen 4: Timeline Editor (Planning Mode)

**Purpose:** The primary working canvas. Build, sequence, and refine the dependency-aware timeline.

**Primary action:** Add, edit, reorder, or delete timeline activities.

**Secondary actions:**
- Set anchor type on an activity
- Override location
- Adjust buffer or minimum duration
- Preview constraint warnings
- Switch to a role-filtered view preview
- Publish / share

**Information hierarchy:**
1. Timeline list (ordered, with start times, durations, and location labels visible inline)
2. Section separators (Getting Ready, Ceremony, Portraits, Reception, etc.)
3. Travel blocks (auto-inserted between location changes)
4. Constraint warnings inline (anchor violations, duration compressions, dependency chain impacts)
5. Detail/edit panel (opens on selection): full activity fields
6. Toolbar: Add activity, undo, preview view, publish/share

**Success metric:** Photographer can move an activity and immediately see which other activities shifted, which anchors protected, and whether any minimum durations were violated — without leaving this screen.

---

### Screen 5: Activity Detail / Edit Panel

**Purpose:** View and configure all fields for a single timeline activity.

**Primary action:** Save changes to the activity.

**Secondary actions:** Delete activity; duplicate activity; set dependency.

**Information hierarchy:**
1. Title
2. Duration / minimum duration
3. Location (inherited or overridden)
4. Anchor type: Locked / Preferred / Flexible / Movable with approval
5. Priority: Critical / Important / Flexible / Optional / Buffer
6. Visibility: which roles can see this activity
7. Dependencies: before/after relationships to other activities
8. Requires people: names or roles who must be present
9. Weather sensitive: toggle + outdoor/indoor note
10. Notes (internal, photographer-only)
11. Checklist items (setup, capture, recovery types)

**Success metric:** All constraint fields are reachable without scrolling past the fold on a tablet.

---

### Screen 6: Family Group Optimizer

**Purpose:** Generate, sequence, and configure the family photo groups based on questionnaire data.

**Primary action:** Accept or adjust the auto-generated group sequence.

**Secondary actions:** Add a group; remove a group; reorder groups; add/remove people from a group; set group estimated duration.

**Information hierarchy:**
1. Auto-generated group list (sorted by default strategy: largest-to-smallest, prioritizing elderly and children early)
2. Each group card: group name, required people list, estimated duration, status (scheduled / completed / deferred)
3. Missed person workflow: move to end, defer to recovery queue, or add reminder
4. Total estimated family photo block duration (inline, updates as groups change)
5. Export family groups to timeline or separately

**Success metric:** Photographer reviews and accepts family groups in under five minutes from questionnaire data, rather than building the list from scratch.

---

### Screen 7: Vendor Role Management

**Purpose:** Configure which activities each vendor role can see; generate and manage shared links.

**Primary action:** Generate a vendor access link for a specific role.

**Secondary actions:** Configure role visibility settings; revoke or regenerate a link; preview the vendor's view.

**Information hierarchy:**
1. Role list (Planner, DJ, Videographer, Florist, Hair/Makeup, Venue, Officiant, Custom)
2. Per-role: assigned activities, visibility scope, link status
3. Link generator: copy link button, QR code **[ASSUMPTION: QR code is useful but not required for MVP]**
4. Preview vendor view button

**Success metric:** Photographer can generate a DJ-specific link in under 30 seconds showing only the DJ's relevant activities.

---

### Screen 8: Change Review / Approval

**Purpose:** Review changes suggested by the client couple; approve or reject them.

**Primary action:** Approve or reject a suggested change.

**Secondary actions:** Edit and then approve (photographer modifies the suggestion before accepting); leave an internal note.

**Information hierarchy:**
1. Pending suggestions list (client-submitted)
2. Each suggestion: what changed, original vs. proposed value, submitted by, submitted at
3. Approve / Reject / Edit and Approve actions
4. Approved change log (collapsed section)

**Success metric:** Photographer can resolve all pending client suggestions in one focused review session and return to the timeline with the approved changes applied.

---

### Screen 9: Wedding Day Mode (Execution Mode)

**Purpose:** Navigate the wedding day with maximum clarity and minimum cognitive load.

**Primary action:** See what is happening now and what comes next.

**Secondary actions:** Flag a delay; view recovery options; accept or reject a recovery suggestion; open the full timeline reference.

**Information hierarchy (compact card layout):**
1. **NOW** — current activity title, elapsed/remaining time, location, assigned people
2. **NEXT** — next 2 activities (title + time + location, minimal)
3. Attention indicator: if anything requires action (delay flag, missing person, constraint warning)
4. Recovery options panel (appears on delay flag): option cards, each showing what changes and the likely impact
5. Full timeline link (secondary, low prominence)

**Success metric:** On a phone screen, in outdoor light, with one hand, photographer answers the four core questions without unlocking an edit panel.

---

### Screen 10: PDF Export

**Purpose:** Generate a printable backup of the current timeline in the required format.

**Primary action:** Download the selected view as a PDF.

**Secondary actions:** Choose export format; preview before download.

**Available export formats:**
1. Compact itinerary — one-page pocketable format for day-of reference
2. Full timeline — expanded view with all fields and notes
3. Vendor-filtered — only activities visible to a specific role
4. Family-photo-only — family group sequence with required people and durations

**Information hierarchy:**
1. Format selector
2. Role/filter selector (for vendor-filtered and family views)
3. Preview pane
4. Download button
5. Event readiness indicator: warns if no backup has been downloaded before the event date

**Success metric:** Photographer downloads and prints a compact itinerary that a vendor could read and follow without opening a screen.

---

### Screen 11: Client Review View

**Purpose:** Let the couple view their timeline in a clean, non-technical interface and submit suggestions.

**Primary action:** Read the timeline.

**Secondary actions:** Suggest a change to an activity; complete the questionnaire.

**Information hierarchy:**
1. Welcome message with couple's names and event date
2. Timeline in simplified read-only display (time, activity, location only — no internal notes, no constraint metadata)
3. "Suggest a change" affordance per activity
4. Questionnaire section (if not yet fully completed)

**Success metric:** Couple can review the full day's flow and submit any suggestions without needing to contact the photographer by text or email.

---

## 5. Timeline Intelligence

### Creation Flow

1. Photographer creates the event and selects the Wedding template.
2. Template pre-populates a baseline sequence of activities with estimated durations, priorities, anchor types, and location placeholders.
3. As the questionnaire is completed, intelligence data fills in:
   - Location IDs from questionnaire locations
   - Travel blocks inserted automatically between location changes
   - Family Group Optimizer seeded from family questionnaire data
   - Weather-sensitive activities flagged from outdoor locations
   - Vendor-required activities surfaced from selected services
4. Photographer reviews the auto-populated timeline and makes manual adjustments.
5. Constraint engine evaluates the chain and surfaces warnings before publish.

### Interaction Patterns

- **Drag to reorder:** Moving a flexible activity recalculates start times for all downstream activities in its chain. Anchored activities do not move.
- **Extend a duration:** Extending an activity automatically compresses or shifts downstream activities. If a downstream anchor is threatened, a warning appears before the change is saved.
- **Set anchor type:** Locking an activity prevents it from moving automatically. Setting it to "Preferred" allows movement only with explicit approval. "Flexible" allows silent movement within limits.
- **Flag a delay:** In Execution Mode, photographer flags that an activity is running late. The engine calculates cascade impact and presents recovery options.

### Suggested Actions (Constraint Warnings)

| Scenario | System response |
|---|---|
| Activity extended past an anchor | Warning: "Ceremony is locked at 4:00pm. Extending cocktail hour by 20 min will create a 20-minute gap. Accept or adjust?" |
| Travel block missing between locations | Suggestion: "Getting ready is at Hotel A; first look is at Location B. Add a 15-minute travel block?" |
| Family photo block shorter than estimated group duration | Warning: "Family photos are estimated at 45 minutes. Current block is 30 minutes. Compress or extend?" |
| Sunset portrait activity on a date-specific event | Suggestion: "Sunset is at 8:12pm on this date. Sunset portraits are scheduled for 8:30pm. Adjust to 8:00pm?" |
| Person required by an activity is not in the venue at that time | Warning: "Officiant is required for the ceremony but no arrival time is set for them." |

### AI Assistance Points

**Rule-based (no AI required):**
- Dependency chain calculations
- Anchor protection
- Location inheritance and travel block insertion
- Duration compression logic
- Constraint warning evaluation
- Sunset/sunrise time calculation from event date and location

**AI-assisted (V1 may use simple heuristics; AI improves over time):**
- Family group default sequencing (heuristic in V1: sort by group size, prioritize elderly + children; AI-improved in later versions)
- Questionnaire pre-fill suggestions from past events **[ASSUMPTION: may not be needed for MVP]**
- Recovery option ranking (heuristic in V1; improves with usage data)

### Planning vs. Execution Behavior

| Behavior | Planning Mode | Execution Mode |
|---|---|---|
| Activity movement | Drag-and-drop, full editor | Not available |
| Constraint warnings | Proactive, on every edit | On-demand, triggered by delay flag |
| Recovery options | Available via "what if" exploration | Presented immediately on delay flag |
| Dependency chain view | Full visualization | Collapsed; only immediate next shown |
| Location intelligence | Full configuration | Read-only display |
| Family groups | Full optimizer | View only |

---

## 6. Role-Filtered Views

### Owner (Photographer)

| Category | Access |
|---|---|
| Data visibility | Full — all activities, all notes, all people, all vendors |
| Editing permissions | Full — create, edit, delete, reorder, anchor, configure visibility |
| Reporting / export | Full — all PDF formats |
| Account / billing | Full |
| Change approval | Full — approves or rejects all suggestions |

---

### Planner (Manager)

| Category | Access |
|---|---|
| Data visibility | Full timeline — all activities, all vendors, all people |
| Editing permissions | Full timeline editing; cannot delete the event; cannot manage account or billing |
| Reporting / export | All PDF formats |
| Change approval | Can approve or reject client suggestions |
| Account / billing | None |

**Note:** If both a photographer and a planner are managing the same event, the photographer (Owner) created the event and has final authority. The planner is a collaborator. Conflict resolution is manual — there is no merge or locking mechanism in MVP.

---

### Vendor (Team Member)

| Category | Access |
|---|---|
| Data visibility | Only activities where their role is listed in visibility_rules. No internal notes. No other vendor contact details. |
| Editing permissions | None — read-only |
| Reporting / export | Their filtered view as PDF only |
| Change approval | None |
| Account required | No — link-based access **[ASSUMPTION]** |

**Vendor sees:**
- Activity title
- Start time and duration
- Location
- Any notes specifically flagged for vendor visibility
- Their relevant checklist items (setup, capture)

**Vendor does not see:**
- Other vendors' activities (unless they share a section)
- Family group detail
- Questionnaire data
- Internal notes or preference notes
- Full timeline

---

### Client / Couple (Individual User)

| Category | Access |
|---|---|
| Data visibility | Full timeline in simplified display (no internal notes, no constraint metadata). Their questionnaire sections. |
| Editing permissions | None — read-only, with suggestions only |
| Reporting / export | Their filtered view as PDF **[ASSUMPTION: client can download a couple's copy]** |
| Change approval | None — can suggest only; photographer or planner approves |
| Account required | No — link-based access for questionnaire and review **[ASSUMPTION]** |

**Client sees:**
- Activity title, time, location
- Activities visible to "couple" role (visibility_rules)
- Suggestions they have submitted and their status (pending / approved / rejected)

**Client does not see:**
- Internal notes
- Vendor contact details
- Constraint metadata (anchor types, dependencies)
- Family group optimizer interface

---

## 7. MVP vs. Later

### MVP — Required for Initial Validation

These features must exist before OnCue is used on a real wedding.

| Feature | Reason it is MVP |
|---|---|
| Event creation with wedding template | Core starting point |
| Timeline editor with add/edit/reorder | Primary product interface |
| Dependency-aware activity movement | Proves Timeline Intelligence — the primary moat |
| Anchor types (locked, preferred, flexible) | Required for constraint engine to be meaningful |
| Location inheritance and travel block insertion | Required for realistic wedding timelines |
| Activity fields: duration, minimum duration, priority, notes, visibility | Required for constraint evaluation |
| Constraint warnings (anchor violations, chain impact) | Without this, it is just a list editor |
| Questionnaire (all sections) | Powers the constraint engine and Family Group Optimizer |
| Family Group Optimizer (basic: auto-suggest, reorder, duration estimate) | Secondary strategic moat; needed for photographer validation |
| Wedding Day Mode (Execution Mode) | Core day-of experience; must be validated on real weddings |
| Vendor role views via shared link | Photographers share links with DJs and venues on every wedding |
| Client review + questionnaire link | Couple interaction is required for product validation |
| Change suggestion workflow (client suggests, photographer approves) | Fundamental collaboration model |
| PDF export: compact itinerary, full timeline, vendor-filtered | Print backup is a safety requirement on wedding days |
| Event readiness check (backup downloaded?) | Print safety requirement |
| Version history (view past states, roll back one version) | Required before photographers trust the system with live data |
| Free tier with 3-event limit | Required to control costs during validation |

---

### Later Releases — Intentionally Deferred

| Feature | Deferred reason |
|---|---|
| Offline PWA cache | Requires significant service worker engineering; print backup covers the offline safety need for MVP |
| Google Calendar one-way sync | Integration work before product-market fit; not needed for photographer validation |
| Outlook / Microsoft 365 sync | Lower priority for Phase 1 (wedding photographers) |
| SMS/email notifications to vendors | Useful but non-blocking; vendors can receive the PDF and the link manually in V1 |
| Venue profiles (claimable, database) | Requires a separate venue-facing product surface; V2+ |
| Custom branding add-on | Paid feature that requires billing infrastructure; V2 |
| Custom domain | Same as above |
| Multiple simultaneous event editors (conflict resolution) | Adds complexity; single-photographer events dominate Phase 1 |
| Advanced recovery engine (AI-ranked options) | Heuristic rules are sufficient for MVP validation |
| Corporate event / conference templates | Phase 4 market; not needed for Phase 1 validation |
| Production / call-sheet modules | Phase 5; entirely different surface |
| Two-way calendar sync | Requires careful sync conflict logic; V3 |
| Integration with HoneyBook / Studio Ninja | CRM import; useful but not blocking for Timeline Intelligence validation |
| Enterprise permissions / API | Phase 4 |
| Zapier / Make connector | Phase 3+ |
| QR codes for vendor links | Convenient but not required — URL sharing works |
| Mark activity as complete in Execution Mode | Simple but touches timeline state model; needs careful design to avoid race conditions — confirmed or deferred by founder |
| AI-assisted questionnaire pre-fill | Requires data from past events; not available at launch |

---

## 8. Assumptions Requiring Founder Confirmation

Before implementation begins, the following assumptions embedded in this document need explicit founder sign-off:

| # | Assumption | Impact if wrong |
|---|---|---|
| 1 | Vendor access is link-based (no vendor account required for MVP) | If accounts are required, onboarding and auth scope changes significantly |
| 2 | Client/couple access is link-based (no couple account required for MVP) | Same — adds onboarding flow for couples |
| 3 | "Mark activity complete" in Execution Mode is deferred | If it is MVP, adds state management to Execution Mode |
| 4 | QR codes for vendor links are deferred | Low impact — easy to add if needed |
| 5 | Couple can download a PDF of their view | Requires PDF export scoped to couple visibility rules |
| 6 | AI-assisted questionnaire pre-fill is deferred | Low impact for MVP |
| 7 | Custom branding add-on is V2 (not MVP) | If needed at launch, requires billing configuration |

---

*This document is architecture and definition only. No application code, framework, database schema, or Lovable implementation has been started. All items above are subject to founder review and revision before implementation begins.*
