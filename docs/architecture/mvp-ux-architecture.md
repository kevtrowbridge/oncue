# OnCue MVP UX Architecture

**Version:** 2.0
**Date:** June 21, 2026
**Phase:** Pre-implementation — architecture only. No Lovable build has begun.
**Scope:** MVP required for initial validation on real weddings.

---

## Document Status

**Where this document lives:** Repository only — `docs/architecture/mvp-ux-architecture.md`

**Google Drive integration:** This document has not been merged into the authoritative Master Google Docs (`OnCue Master Document V2.gdoc` or `OnCue Founder Decisions Log.gdoc`). Before Lovable implementation begins, the founder should review this document against the current Google Docs and either copy the confirmed content into those docs or confirm they will be updated separately. This document is the working implementation specification; the Master Docs remain the authoritative source of product strategy.

**Source documents used to write this:**
- `OnCue_Master_Strategy_and_Brand_Guardrails.md`
- `OnCue_Product_Architecture_and_Technical_Guardrails.docx`
- `OnCue_MVP_Specification_and_Roadmap.docx`
- `docs/FOUNDER_DECISIONS.md`
- Eleven explicit founder decisions applied in Version 2.0 (June 21, 2026)

**Items still requiring founder review before implementation begins are collected in Section 9.**

---

## Revision History

| Version | Date | What changed |
|---|---|---|
| 1.0 | June 21, 2026 | Initial draft from Master Docs |
| 2.0 | June 21, 2026 | Applied 11 founder decisions: questionnaire model, family group scope, couple auth, vendor marketing, Wedding Day Mode delay-first design, planner roles, couple PDF, QR codes, pre-fill deferral, custom branding deferral, location sharing plan |

---

## 1. Core User Journeys

### Role Mapping

| Role | Who | Access model |
|---|---|---|
| **Owner** | Photographer (Phase 1 primary user). Creates the OnCue account and owns the event. | Full account |
| **Planner** | Wedding planner invited as a collaborator or co-owner. | Full account (invited) |
| **Vendor** | DJ, videographer, florist, hair/makeup, officiant, and other service providers. | No account — shareable link only |
| **Client / Couple** | The couple being married. | Lightweight account (magic link or Google sign-in) |

---

### Journey 1: Owner (Photographer)

**Who:** The photographer who created the OnCue account.

#### A. Create and set up a new event

**Trigger:** Photographer books a wedding.

**Desired outcome:** A dependency-aware draft timeline is populated from the wedding template. The questionnaire has been started. The couple has been invited.

**Key screens:**
1. Dashboard → Create Event
2. Template selection (Wedding)
3. Event details (date, couple names, primary location)
4. Timeline Editor — template pre-populated
5. Questionnaire — owner begins filling during or after the booking consultation
6. Invite couple — sends a magic link or Google sign-in invitation

---

#### B. Build and refine the timeline

**Trigger:** Questionnaire data is sufficient to translate into a working timeline.

**Desired outcome:** A constraint-aware timeline with anchors, travel blocks, family groups, and durations that can survive change.

**Key screens:**
1. Timeline Editor — add, reorder, and time activities
2. Activity Detail Panel — set duration, anchor type, location, priority, visibility, dependencies
3. Group Photo Optimizer — generate and sequence family and wedding party groups
4. Vendor Role view preview — confirm what each vendor will see

---

#### C. Collaborate and publish

**Trigger:** Timeline is ready for planner or couple review.

**Desired outcome:** Couple and planner have viewed and approved the timeline. PDF backup is downloaded. Event is ready to execute.

**Key screens:**
1. Timeline Editor — publish / share
2. Change Review — review all proposed changes (from couple or collaborator)
3. PDF Export — download compact and filtered versions
4. Event Readiness check — confirm print backup exists

---

#### D. Execute on wedding day

**Trigger:** Wedding day.

**Desired outcome:** Photographer navigates the day with complete clarity. When anything runs late, the system shows the impact and offers recovery options immediately.

**Key screens:**
1. Wedding Day Mode — compact execution view
2. Delay adjustment panel — enter delay, see impact, select recovery, choose who to notify

---

### Journey 2: Planner (Collaborator or Co-owner)

**Who:** A wedding planner invited to the event.

**Trigger:** Photographer invites the planner as a collaborator or co-owner.

**Desired outcome:** Planner can co-manage the timeline and coordinate vendors without owning the photographer's account.

**Key screens:**
1. Invitation email → account sign-in or creation
2. Timeline Editor — full editing access
3. Questionnaire — can view and edit (edits from a collaborator-level planner become proposed changes if event settings require owner approval; co-owner edits apply directly)
4. Change Review — co-owner can approve client or collaborator suggestions; collaborator cannot
5. Vendor Role management — configure visibility and generate vendor links
6. Wedding Day Mode — execution view identical to owner's
7. PDF Export — all formats

**Distinction from Owner:**
- Cannot delete the event
- Cannot manage account billing
- Collaborator: edits may require owner approval for sensitive changes
- Co-owner: can approve client and collaborator changes; cannot access account settings

---

### Journey 3: Vendor (Team Member)

**Who:** A DJ, videographer, florist, hair/makeup artist, officiant, or any other service provider.

**Trigger:** Owner or planner generates and shares a vendor-specific link. No OnCue account required.

**Desired outcome:** Vendor sees only the activities relevant to their role and can print a one-page reference for the day.

**Key screens:**
1. Vendor link landing — no login required. Lightweight marketing prompt: "Running your own events? Try OnCue free." Vendor can dismiss or claim their free vendor profile.
2. Vendor-Filtered Timeline — read-only view of only their relevant activities
3. PDF Export — one-page filtered view for their role

**Vendor sees:**
- Activity title, start time, duration
- Location
- Notes flagged for vendor visibility
- Their relevant setup and capture checklist items

**Vendor does not see:**
- Other vendors' activities (unless they overlap in a shared section)
- Family group detail or questionnaire data
- Internal photographer notes
- Full timeline

**Restrictions:** Read-only. No edits of any kind.

---

### Journey 4: Client / Couple (Individual User)

**Who:** The couple being married.

**Trigger:** Photographer invites the couple after booking. Couple receives a magic link or can sign in with Google.

**Authentication:** Magic email link or Google sign-in. The sign-in flow must feel lightweight and welcoming — not a professional account setup. Couple does not choose a plan, enter a credit card, or configure settings.

**Desired outcome:** Couple has completed the questionnaire, reviewed the timeline, and submitted any suggestions — all without needing to understand constraint logic.

**Key screens:**
1. Welcome / sign-in — magic link from email or Google sign-in; lands directly in their event
2. Questionnaire — their sections of the shared questionnaire; can complete and return to update
3. Timeline Review — simplified read-only view of the timeline
4. Suggest a Change — inline on any activity; does not modify the live timeline; goes to Change Review
5. Suggestion status — couple can see whether their suggestions are pending, approved, or declined

**What the couple can edit:**
- The questionnaire (their sections) — changes are proposed, not automatic
- Suggest timeline changes — proposed changes only
- Family/group photo participants — proposed changes only

**What the couple cannot do:**
- Directly edit or reorder any timeline activity
- View internal photographer notes
- See other vendors' contact information
- Access the full constraint/optimization editor

**Note on couple edits:** Any change made by the couple — to questionnaire answers, suggested timeline edits, family group members, vendor contacts, or key event details — becomes a proposed change that requires owner (or co-owner) approval before it is applied to the live event. This is the universal rule for all non-owner edits.

---

## 2. Product Modes

### Planning Mode

**Purpose:** Build, refine, and collaborate on the timeline before the wedding day. Detail-rich. Full editor.

**Available actions:**
- Create and configure the event
- Complete or update any part of the questionnaire
- Edit timeline activities: title, duration, location, anchor type, priority, visibility, dependencies, notes
- Drag and reorder activities (dependency chain updates accordingly)
- Run the Group Photo Optimizer (family and wedding party groups)
- Invite planner, couple, and generate vendor links
- Review and approve proposed changes (from couple, from collaborators)
- View change history and roll back to a prior version
- Export PDF in any available format
- Preview any role-filtered view

**Data displayed:**
- Full timeline with all activities and sections
- Durations, calculated start/end times, buffers, anchor indicators
- Location assignments and travel blocks
- Constraint warnings and dependency chain impacts
- Group photo list with estimated durations and total block time
- Pending proposed changes (badge count)
- Change log and publish state
- Event readiness checklist

**Success criteria:**
- Timeline accurately reflects the planned day
- All anchor points are confirmed
- Group photo sequence is complete and estimated
- Couple has completed their questionnaire sections
- At least one PDF backup has been downloaded
- No critical constraint warnings are unresolved

**When Planning Mode is unavailable:**
After the event date passes, the event is archived and becomes read-only. Planning Mode is locked. The timeline and questionnaire can be viewed and exported but not edited.

---

### Execution Mode (Wedding Day Mode)

**Purpose:** Navigate the wedding day with maximum clarity and minimum cognitive load. Execute, not plan.

**Primary feature: Running late / delay adjustment.**
The central day-of action is not marking activities complete. It is handling delays. The system must make it fast and easy to say "we are running X minutes behind" and immediately understand the impact and recovery options.

**Available actions:**
- View the current activity and what is coming next
- See who is responsible for the current activity
- Tap "Running Late" — enter delay in minutes, see which activities are impacted, select a recovery option, choose who to notify
- Accept or reject a suggested recovery change (change only applies after approval)
- Mark an activity complete (available, but the system does not rely on this — wedding days are too busy)
- Open the full timeline reference (read-only)
- Access the pre-downloaded PDF backup (offline-safe)

**Delay adjustment flow:**
1. Tap "Running Late"
2. Enter delay amount (quick options: 5, 10, 15, 20, 30+ minutes)
3. System shows: which upcoming activities are affected, which anchors are threatened, what the cascade looks like
4. System presents recovery options with the likely impact of each
5. Owner or co-owner selects a recovery option
6. System asks: who should be notified? (suggests only people whose activities are meaningfully affected)
7. Owner confirms notifications
8. Timeline updates; notifications sent to confirmed recipients only

**The system does not automatically notify anyone.** Notifications require explicit human approval, and only affected parties are ever suggested.

**Data displayed:**
- NOW: current activity title, location, assigned people, elapsed and remaining time
- NEXT: 2–3 upcoming activities (title, time, location)
- Attention flag: visible when a delay, constraint warning, or missing-person issue exists
- Recovery options panel (opens when delay is flagged)

**What Execution Mode is not:**
- Not a drag-and-drop editor
- Not a place to restructure the timeline
- Not a group photo optimizer
- Not a full questionnaire

---

### Mode Transitions

| Transition | Trigger | Who |
|---|---|---|
| Planning → Execution | Manual switch, or system prompt on event date | Owner, Co-owner planner |
| Execution → full timeline reference | "View full timeline" link inside Wedding Day Mode | Owner, Co-owner planner |
| Execution → Planning edit | Not available on event day | — |
| Event → Archived | Automatic when event date passes | System |

---

## 3. Page Map / Navigation

### Global Navigation (Signed-in Professional)

```
Dashboard             ← event list; primary landing page after sign-in
  └── Create Event
Account / Settings    ← plan, profile
```

### Per-Event Navigation

```
Event: [Name]
  ├── Timeline          ← Planning Mode editor (default)
  ├── Questionnaire     ← shared event questionnaire
  ├── Group Photos      ← Group Photo Optimizer (family + wedding party)
  ├── Vendors           ← role assignments, visibility config, link generation
  ├── Wedding Day       ← Execution Mode (becomes prominent near event date)
  └── Export            ← PDF: compact, full, vendor-filtered, group-photo-only
```

### Change Review (global, not per-tab)

Proposed changes from couple or collaborators appear as a persistent badge across the event. Change Review is accessible from any tab, not buried in one section.

### Client / Couple Navigation (after sign-in)

```
[Event Name] — Your Timeline
  ├── Questionnaire     ← their sections of the shared questionnaire
  ├── Timeline          ← simplified read-only view with suggest-a-change per activity
  └── Suggestions       ← status of submitted suggestions (pending / approved / declined)
```

### Vendor View (no sign-in)

```
Vendor Link Landing
  ├── [Role]-Filtered Timeline   ← read-only, their activities only
  ├── PDF Download               ← their filtered view
  └── Marketing prompt           ← "Running your own events? Try OnCue free." (dismissable)
```

### Mobile Considerations

- Wedding Day Mode is the primary mobile interface. Must work one-handed, in bright outdoor light, in portrait or landscape.
- The delay adjustment panel must be reachable in two taps maximum from the main Wedding Day screen.
- Planning Mode on mobile collapses to a bottom tab bar. Timeline list is scrollable; detail panel opens as a bottom sheet.
- All PDF exports must be portrait-oriented and legible when printed from a phone browser.
- Couple's interface must feel native on a smartphone — they will not use a laptop.

### Desktop Considerations

- Planning Mode uses a two-panel layout: timeline list left, detail/edit panel right.
- Group Photo Optimizer benefits from a two-panel layout: group list left, people picker right.
- Questionnaire is a single-column scrollable form on all screen sizes.
- Wedding Day Mode on desktop mirrors the mobile card layout. It is used at events, not at desks.

---

## 4. Key Screens and Content Hierarchy

### Screen 1: Dashboard — Event List

**Purpose:** Entry point for the professional user. Show all events and their status.

**Primary action:** Create a new event.

**Secondary actions:** Open an existing event; view archived events.

**Information hierarchy:**
1. Upcoming events sorted by date (ascending)
2. Each card: wedding name, date, couple names, status badge (Draft / Active / Day-of / Archived), days-until indicator, pending changes badge
3. Archived events (collapsed)
4. Plan status (events remaining on free tier, or current plan)

**Success metric:** Owner finds and opens any event in one tap.

---

### Screen 2: Create Event

**Purpose:** Start a new event record.

**Primary action:** Confirm details and open the Timeline Editor.

**Secondary actions:** Change template.

**Information hierarchy:**
1. Template selector (Wedding is the only MVP template)
2. Event date
3. Couple names
4. Primary location (optional; can be set later)
5. Create

**Success metric:** Event opens in Timeline Editor with the wedding template pre-populated within 3 seconds.

---

### Screen 3: Questionnaire

**Purpose:** One shared event questionnaire. The owner may begin during a consultation. The couple completes and updates it over time. Any edits made by a non-owner become proposed changes requiring approval.

**Primary action:** Complete or update a section.

**Secondary actions:** Invite couple to complete their sections; mark questionnaire complete; view pending questionnaire change proposals.

**Questionnaire sections:**

1. **Core event details** — couple names, preferred surname, date, phone numbers, email addresses
2. **Locations** — getting ready (bride side), getting ready (groom side), first look, ceremony, portraits, reception, sunset portrait location
3. **Group photo participants** — all people needed for family or wedding party photos. Not limited to immediate family. Includes: parents, step-parents, grandparents, siblings, children, extended family, chosen family, VIPs, close relatives, anyone the couple wants in a group photo. Each person: name, relationship, notes (elderly, mobility needs, arriving late, etc.)
4. **Wedding party** — best man, MOH, bridesmaids, groomsmen, flower girl, ring bearer, MC, officiant; people who may appear across multiple group configurations
5. **Vendors** — planner, venue, florist, catering, DJ, hair/makeup, videographer, cake, decor; each with name, contact, and arrival time
6. **Preferences** — ideal portrait location, dream space, important people and moments, emotional priorities
7. **Priorities** — which moments matter most; which moments are most flexible if time or weather changes

**Approval behavior:** If the couple or a collaborator edits a questionnaire field, that change is submitted as a proposal. The owner sees a "Questionnaire changes pending" indicator. Approved changes are applied; declined changes are preserved in the log.

**Success metric:** Enough data is collected from the questionnaire to auto-populate location inheritance, travel blocks, and group photo suggestions without manual entry.

---

### Screen 4: Timeline Editor (Planning Mode)

**Purpose:** The primary working canvas. Build, sequence, and configure the dependency-aware timeline.

**Primary action:** Add, edit, or reorder activities.

**Secondary actions:** Set anchor type; override location; adjust buffer or minimum duration; preview a role-filtered view; publish or share.

**Information hierarchy:**
1. Timeline list — ordered with inline start times, durations, location labels, anchor indicators
2. Section dividers (Getting Ready, First Look, Ceremony, Portraits, Reception, etc.)
3. Travel blocks — inserted automatically between location changes
4. Constraint warnings — shown inline when an anchor is threatened, a duration is compressed, or a dependency chain is affected
5. Activity detail panel — opens on selection; shows all fields
6. Toolbar — add activity, undo, preview view, pending changes count, publish/share

**Success metric:** Owner can move an activity and immediately see which downstream activities shifted, which anchors held, and whether any minimum durations were violated — without leaving this screen.

---

### Screen 5: Activity Detail / Edit Panel

**Purpose:** View and configure all fields for one activity.

**Primary action:** Save changes.

**Secondary actions:** Delete activity; duplicate activity; set dependency.

**Information hierarchy:**
1. Title
2. Duration / minimum duration
3. Location (inherited or overridden; shows parent location when inherited)
4. Anchor type: Locked / Preferred / Flexible / Movable with approval
5. Priority: Critical / Important / Flexible / Optional / Buffer
6. Visibility: which roles can see this activity (Owner, Planner, Couple, specific vendor roles)
7. Dependencies: before/after relationships
8. Requires people: names or roles who must be present
9. Weather sensitive: toggle + outdoor/indoor note
10. Internal notes (owner-only; not visible to couple or vendors)
11. Vendor-facing notes (visible to vendors with access to this activity)
12. Checklist items: setup, capture, recovery

**Success metric:** All constraint fields reachable without scrolling past the fold on a tablet.

---

### Screen 6: Group Photo Optimizer

**Purpose:** Generate, sequence, and configure group photo combinations for both family photos and wedding party photos, based on questionnaire participants.

**Primary action:** Accept or adjust the auto-generated sequence.

**Secondary actions:** Add a group; remove a group; reorder groups; add or remove people from a group; set estimated duration per group; export to timeline.

**Information hierarchy:**
1. Auto-generated group list — default sequencing prioritizes getting through largest groups first, then prioritizing elderly and children early (so they can be released)
2. Each group card: group name, required people, estimated duration, status (scheduled / completed / deferred / missed)
3. Cross-group people indicator: shows when a person appears in multiple groups (prevents releasing them too early)
4. Missed person workflow: move group to end, defer to recovery queue, or note for later
5. Total estimated block duration — updates live as groups are adjusted
6. Export to timeline block or as separate family-photo PDF

**Note:** This optimizer covers both family group photos and wedding party combinations. Anyone added in Section 3 of the questionnaire (group photo participants) and Section 4 (wedding party) can appear here.

**Success metric:** Photographer reviews and confirms the group sequence in under five minutes from questionnaire data.

---

### Screen 7: Vendor Role Management

**Purpose:** Configure what each vendor role can see. Generate and share vendor access links.

**Primary action:** Generate a vendor access link for a specific role.

**Secondary actions:** Configure role visibility settings; revoke or regenerate a link; preview the vendor's view; copy link.

**Information hierarchy:**
1. Role list (Planner, DJ, Videographer, Florist, Hair/Makeup, Venue, Officiant, Custom)
2. Per role: assigned activities, visibility scope, link status (not sent / sent / viewed)
3. Copy link button (QR code is optional and lower priority)
4. Preview vendor view

**Vendor link landing behavior:** When a vendor opens their link, they see their filtered timeline. Below the timeline (or on a dismissable card) is a lightweight marketing prompt: "Planning your own events? Try OnCue free." The vendor can claim a free vendor profile or dismiss. No account is required to view their timeline.

**Success metric:** Owner generates a DJ-specific link in under 30 seconds.

---

### Screen 8: Change Review / Approval

**Purpose:** Review all proposed changes — from the couple, from collaborators — in one place. Approve or reject.

**Primary action:** Approve or reject a proposed change.

**Secondary actions:** Edit a proposed change before approving; leave an internal note; batch-approve multiple proposals.

**Change types that flow through here:**
- Couple: suggested timeline edits
- Couple: questionnaire field updates
- Couple: group photo participant additions or changes
- Couple: vendor contact updates
- Collaborator (if at Collaborator level): changes flagged for approval by event settings

**Information hierarchy:**
1. Pending proposals — most recent first
2. Each proposal: change type, what changed, original value vs. proposed value, submitted by, submitted at
3. Approve / Decline / Edit and Approve
4. Resolved history (collapsed)

**Success metric:** Owner resolves all pending proposals in one session and returns to a clean, approved timeline.

---

### Screen 9: Wedding Day Mode (Execution Mode)

**Purpose:** Navigate the wedding day with maximum clarity. The hero action is delay handling, not task completion.

**Primary action:** Handle a delay — enter how many minutes behind, see the impact, choose recovery.

**Secondary actions:** View current and upcoming activities; mark an activity complete (optional, not relied upon); open full timeline reference; access PDF backup.

**Information hierarchy (compact card layout):**
1. **NOW** — activity title, location, assigned people, time remaining
2. **NEXT** — 2–3 upcoming activities (title, time, location — minimal)
3. **Attention flag** — appears when delay, constraint warning, or missing person is detected
4. **Running Late button** — prominent, accessible from the main view; one tap to open the delay panel
5. Full timeline reference link — secondary prominence

**Delay panel hierarchy:**
1. "How many minutes behind are you?" — quick options: 5 / 10 / 15 / 20 / 30+ / custom
2. Impact summary: list of affected upcoming activities
3. Recovery options: 2–4 option cards, each showing what changes and the expected outcome
4. After selecting recovery: "Who should we notify?" — suggested list of only affected parties; owner can add, remove, or dismiss
5. Confirm — applies timeline change, sends notifications

**Mark complete behavior:** Exists as a secondary tap action on the current activity. The system does not prompt for it, does not require it, and does not calculate event progress from it. If an activity is marked complete, it is noted in the log. The timeline advances by time, not by completion taps.

**Success metric:** On a phone, in outdoor light, with one hand, the owner can handle a 15-minute delay — see the impact, pick a recovery option, notify affected parties — in under 60 seconds.

---

### Screen 10: PDF Export

**Purpose:** Generate printable backup views of the timeline.

**Primary action:** Download the selected view as a PDF.

**Secondary actions:** Choose export format; preview before download.

**Export formats:**
1. Compact itinerary — one-page pocketable format; day-of reference
2. Full timeline — all activities, all fields, all notes
3. Vendor-filtered — one role's relevant activities only
4. Group-photo-only — group sequence with required people and estimated durations
5. Couple's view — activities visible to couple role; available for couple to download from their interface

**Event readiness indicator:** If no PDF backup has been downloaded before the event date, the system shows a warning in Planning Mode. The export screen displays the last download date.

**Success metric:** Photographer downloads and prints a compact itinerary in one tap. Vendor could follow it without opening a screen.

---

### Screen 11: Client / Couple View

**Purpose:** Let the couple complete the questionnaire, review the timeline, and submit suggestions — in a welcoming, simple interface that does not feel like a professional tool.

**Primary action:** Complete the questionnaire.

**Secondary actions:** Review the timeline; suggest a change; view suggestion status.

**Sign-in experience:** Magic email link (tap link in email, lands directly in the event) or Google sign-in. No plan selection, no settings, no onboarding steps. Couple lands directly in their event view.

**Information hierarchy:**
1. Welcome card — couple's names, event date, photographer's name
2. Questionnaire — their sections only; progress indicator; returns to this screen
3. Timeline review — simplified display (time, activity, location; no internal notes, no constraint data)
4. "Suggest a change" per activity — opens a simple form; submits to Change Review
5. My suggestions — list of submitted suggestions and their current status

**Success metric:** Couple completes their questionnaire sections and reviews the full timeline without contacting the photographer for help.

---

## 5. Timeline Intelligence

### Creation Flow

1. Owner creates the event, selects the Wedding template.
2. Template pre-populates a baseline sequence with estimated durations, priorities, anchor types, and location placeholders.
3. As questionnaire sections are completed, the engine fills in:
   - Location IDs from questionnaire locations
   - Travel blocks auto-inserted when the location changes between activities
   - Group Photo Optimizer seeded from questionnaire participants
   - Weather-sensitive flags applied to outdoor activities
   - Setup/service activities surfaced from selected vendors (e.g., audio setup if videographer is selected)
4. Owner reviews, adjusts, and finalizes the timeline.
5. Constraint engine evaluates the chain and surfaces warnings before the timeline is published or shared.

### Interaction Patterns

- **Drag to reorder:** Moving a flexible activity recalculates all downstream start times. Anchored activities do not move.
- **Extend a duration:** Downstream activities shift. If a downstream anchor is threatened, a warning appears before the change is saved.
- **Anchor types:**
  - Locked — never moves under any condition
  - Preferred — moves only with explicit owner approval
  - Flexible — moves silently within limits
  - Movable with approval — moves but requires a notification to affected parties
- **Flag a delay (Execution Mode):** Owner enters delay in minutes. Engine evaluates cascade impact and presents recovery options. Nothing changes until the owner approves.

### Constraint Warnings

| Scenario | System response |
|---|---|
| Activity extended past a downstream anchor | Warning: "Ceremony is locked at 4:00pm. Extending cocktail hour by 20 minutes will leave a 20-minute gap. Accept, compress, or adjust?" |
| Location changes without a travel block | Suggestion: "Getting ready is at Hotel A; first look is at Location B. Add a travel block? Estimated 15 minutes." |
| Group photo block shorter than estimated group total | Warning: "Your family photo groups are estimated at 45 minutes. Current block is 30 minutes. Extend the block or reduce groups?" |
| Sunset portrait scheduled after actual sunset | Suggestion: "Sunset on [date] is at 8:12pm. Sunset portraits are scheduled for 8:30pm. Move to 8:00pm?" |
| Required person has no confirmed arrival time | Warning: "Officiant is required at the ceremony but their arrival time is not set." |
| Minimum duration violated by a proposed move | Warning: "Moving this activity compresses it below its minimum duration of 10 minutes." |

### Rule-Based Intelligence (no AI required)

- Dependency chain calculations and cascading time shifts
- Anchor protection and violation detection
- Location inheritance down a section until overridden
- Travel block insertion when location changes
- Duration compression logic
- Sunset and sunrise time calculation from event date and location
- Constraint warning evaluation
- Recovery option generation from constraint rules

### AI-Assisted or Heuristic Intelligence

- **Group photo sequencing (V1 heuristic):** Default sort by group size; prioritize elderly and small children early. This is a rule in V1; AI ranking improves in later versions.
- **Recovery option ranking (V1 heuristic):** Options ranked by least disruption and fewest downstream changes. AI-improved in later versions from usage patterns.
- **Questionnaire pre-fill from past events:** Deferred. Later versions may offer section-level defaults or guidance templates, but names, contacts, and specific data from past events will not be pre-filled.

### Planning vs. Execution Behavior

| Behavior | Planning Mode | Execution Mode |
|---|---|---|
| Activity editing | Full drag-and-drop editor | Not available |
| Constraint warnings | Proactive on every edit | On-demand when delay is flagged |
| Recovery options | "What if" exploration available | Presented immediately on delay entry |
| Dependency chain view | Full visualization | Collapsed; immediate next only |
| Location configuration | Full edit | Read-only display |
| Group Photo Optimizer | Full editor | View only |
| Delay handling | Not applicable | Primary feature |
| Mark complete | Not applicable | Available but not relied upon |

---

## 6. Role-Filtered Views

### Owner (Photographer)

| Category | Access |
|---|---|
| Data visibility | Full — all activities, all notes, all people, all vendors |
| Editing permissions | Full — create, edit, delete, reorder, configure anchors and visibility |
| Change approval | Full — approves or rejects all proposed changes |
| Reporting / export | All PDF formats |
| Account / billing | Full |

---

### Planner — Collaborator

| Category | Access |
|---|---|
| Data visibility | Full timeline, all vendors, all people |
| Editing permissions | Can edit all timeline content; sensitive changes (delete, anchor changes) may be flagged for owner approval depending on event settings |
| Change approval | Cannot approve client changes; own changes may require owner review |
| Reporting / export | All PDF formats |
| Account / billing | None |

### Planner — Co-owner

| Category | Access |
|---|---|
| Data visibility | Full timeline, all vendors, all people |
| Editing permissions | Full — same as owner for event content |
| Change approval | Can approve client and collaborator proposed changes |
| Reporting / export | All PDF formats |
| Account / billing | None (account management stays with owner) |

**Simple rule for MVP:** When inviting a planner, the owner chooses one: Collaborator or Co-owner. If unsure, default to Collaborator.

---

### Vendor (Team Member)

| Category | Access |
|---|---|
| Data visibility | Only activities where their role appears in the activity's visibility settings. No internal notes. No other vendor contacts. |
| Editing permissions | None — read-only |
| Reporting / export | Their filtered view as PDF |
| Account | None required — link-based |

Vendor sees: activity title, start time, duration, location, vendor-facing notes, their checklist items.

Vendor does not see: full timeline, other vendors' activities, questionnaire data, internal notes, family group detail.

---

### Client / Couple

| Category | Access |
|---|---|
| Data visibility | Full timeline in simplified display (time, activity, location — no constraint metadata, no internal notes). Their questionnaire sections. |
| Editing permissions | None direct — all changes are proposals requiring owner approval |
| Reporting / export | Couple's filtered PDF view |
| Account | Lightweight (magic link or Google sign-in) |

Couple sees: activity title, time, location; activities with couple-level visibility; their submitted suggestions and status.

Couple does not see: internal photographer notes, vendor contact details, constraint metadata, Group Photo Optimizer editor.

---

## 7. Location Sharing — Planned Future Feature

Location sharing is a planned feature for a post-MVP release. It is documented here so that MVP design and data model decisions do not close the door on it.

### Purpose

Help vendors and team members on wedding day know where key people are. Detect when someone may be running late and prompt them privately before automatically alerting the team.

### Behavior

- Opt-in only. Each user individually controls whether their location is shared and can turn it off at any time.
- During Wedding Day Mode, participants who have opted in share their live location with the event team.
- The system estimates whether someone is on track to arrive at their next required location on time, based on travel distance and time.
- If someone appears to be running late, the system privately prompts only them first: "It looks like you may be running about 10 minutes behind. Do you want to update the team?"
- The user chooses:
  - Notify affected team members (sends delay alert only to people whose activities are impacted)
  - Update the timeline only (adjusts the internal timeline without notifying others)
  - Dismiss (no action taken)
- The event owner and co-owner can see delay-risk indicators for the event as a whole, but cannot see individual location data unless the person has shared it.
- The system does not automatically send notifications to anyone. Human approval is required before any message goes out.
- Location sharing automatically expires when the event date ends.

### Privacy Rules

- Never share location data with vendors unless the person has explicitly opted in.
- Never display raw location coordinates — only contextual delay risk ("appears to be running about 10 minutes behind").
- Location data is used only for delay detection during the event. It is not stored persistently after the event ends.

### MVP Decision

Treat as a post-MVP feature. Do not build location sharing infrastructure in V1 unless it can be implemented simply without delaying core MVP validation. Design the data model and event-participant architecture so that adding location sharing in V2 does not require restructuring.

---

## 8. MVP / V2 / Later

### MVP — Required for initial validation on real weddings

| Feature | Why it is MVP |
|---|---|
| Account creation and sign-in for professionals | Entry requirement |
| Lightweight couple sign-in (magic link + Google) | Couples need account access for questionnaire and proposals |
| Vendor link access (no account) | Required for every wedding — photographers share links with DJs and venues |
| Vendor link marketing prompt | Low-effort growth mechanism; builds vendor awareness |
| Event creation with wedding template | Starting point for every event |
| One shared questionnaire (owner fills, couple completes and updates) | Drives group photo optimizer and location intelligence |
| Expanded group photo participants (all relationships, not just immediate family) | Required for accurate optimizer output |
| Timeline editor: add, edit, reorder activities | Primary product surface |
| Dependency-aware activity movement | Proves Timeline Intelligence — the primary strategic moat |
| Anchor types: locked, preferred, flexible | Required for constraint engine to work |
| Location inheritance and auto travel blocks | Required for realistic wedding timelines |
| Activity fields: duration, minimum duration, priority, notes, visibility | Required for constraint evaluation |
| Constraint warnings (anchor, chain, duration, travel) | Without warnings, it is just a list editor |
| Group Photo Optimizer: auto-suggest, reorder, duration estimate, cross-group tracking | Secondary strategic moat; required for photographer validation |
| Proposed change workflow (couple and collaborator proposals → owner review) | Fundamental to the collaboration model |
| Wedding Day Mode with delay adjustment as primary feature | Core day-of experience; must be validated on real weddings |
| Recovery options presented after delay entry | Required for Timeline Intelligence to be meaningful on the day |
| Selective notifications (only affected parties, owner approves) | Delay handling is not useful if it spams everyone |
| Mark activity complete (secondary, not relied upon) | Available for photographers who want it; not a core behavior |
| Planner roles: Collaborator and Co-owner | Professional collaboration is required for planner market |
| PDF export: compact, full, vendor-filtered, group-photo-only, couple's view | Print backup is a safety requirement; compact itinerary is core |
| Couple PDF download from their interface | Confirmed by founder |
| Event readiness check (backup downloaded?) | Print safety requirement |
| Version history and basic rollback | Required before photographers trust the system with live events |
| Change log for proposed and approved changes | Visibility and reversibility are core collaboration principles |
| Free tier — 3 lifetime events | Required to control costs during validation |

---

### V2 — High Value, Post-Validation

| Feature | Notes |
|---|---|
| SMS / email notifications to vendors | Manually sharing links works for V1; notifications improve reliability in V2 |
| Venue profile database | Requires a separate venue-facing surface; useful for travel block pre-population |
| Offline PWA cache | Print backup covers offline safety for MVP; offline editing is V2 |
| Google Calendar one-way sync | Useful for couples and planners; not needed to prove Timeline Intelligence |
| Vendor location sharing (opt-in, delay detection, private prompts) | Planned feature per architect decision; add when core MVP is validated |
| QR codes for vendor links | Convenient; not blocking; add alongside location sharing or independently |
| Improved recovery option ranking (usage-informed heuristics) | V1 heuristics are sufficient; improves with real usage data |
| Custom branding add-on (paid) | Confirmed as post-MVP paid feature; requires billing infrastructure |
| Custom domain (paid add-on) | Same as above |

---

### Later (V3+)

| Feature | Deferred reason |
|---|---|
| Two-way Google Calendar sync | Requires careful conflict resolution; V3 |
| Outlook / Microsoft 365 sync | Corporate market; V3+ |
| Corporate event / conference templates | Phase 4 market |
| Production / call-sheet modules | Phase 5 |
| Advanced AI recovery engine (pattern-trained) | Requires real usage data across many events |
| AI-improved group photo sequencing | Heuristics are sufficient for validation; AI improves later |
| Questionnaire defaults / section-level guidance from past events | Deferred; names and contacts from past events will not be pre-filled |
| HoneyBook / Studio Ninja CRM import | Phase 3 |
| Zapier / Make connector | Phase 3+ |
| Enterprise permissions / team accounts / API | Phase 4 |
| Multi-photographer team accounts | Phase 2/3 when planner market is active |

---

## 9. Founder Review Required Before Implementation

The following items require explicit founder confirmation before any Lovable build begins.

Items marked **Confirmed** reflect decisions already made in this session. Items marked **Needs answer** are still open.

| # | Question | Status | Notes |
|---|---|---|---|
| 1 | Vendor access is link-based (no account required) | **Confirmed** | Confirmed. Marketing prompt included. |
| 2 | Couple sign-in is magic link + Google (lightweight, not professional) | **Confirmed** | Confirmed. |
| 3 | All couple/collaborator changes are proposed changes requiring owner approval | **Confirmed** | Applies to questionnaire, timeline, family groups, vendors, key details. |
| 4 | Delay adjustment is the primary Wedding Day Mode feature; mark complete is secondary | **Confirmed** | Confirmed. System does not rely on mark complete. |
| 5 | Planner has two levels: Collaborator and Co-owner | **Confirmed** | Keep simple for MVP. Default to Collaborator when inviting. |
| 6 | Couple can download their own PDF | **Confirmed** | Confirmed. |
| 7 | QR codes are V2, not MVP | **Confirmed** | Unless trivially easy; share links are sufficient for MVP. |
| 8 | Questionnaire pre-fill from past events is deferred | **Confirmed** | No names or contacts from past events. Section-level guidance is a later feature. |
| 9 | Custom branding and custom domain are paid V2 features | **Confirmed** | Does not block MVP. |
| 10 | Location sharing is V2, not MVP | **Confirmed** | Unless implementable without delaying core MVP. Data model should accommodate it. |
| 11 | Group Photo Optimizer covers both family and wedding party groupings | **Confirmed** | Questionnaire collects all participants, not just immediate family. |
| A | **Collaborator approval rules:** For MVP, which specific actions by a Collaborator-level planner require owner approval, and which apply directly? | **Needs answer** | Suggested default: all edits apply directly except delete-event. Owner can see changes in the log. Couple's changes always require approval. Confirm this or define exceptions. |
| B | **Event readiness definition:** What constitutes a "ready" event? Suggested: questionnaire complete, group photos sequenced, at least one PDF downloaded, no critical constraint warnings. Confirm or modify. | **Needs answer** | This drives the readiness checklist and the warning shown before event date. |
| C | **Rollback scope:** Does "roll back one version" mean restoring the entire timeline to a prior state, or rolling back individual activities? | **Needs answer** | Full-timeline rollback is simpler to implement but more aggressive. Activity-level rollback is more surgical but more complex. |
| D | **Google Drive:** Should this architecture document be copied into the Master Google Docs before implementation begins? | **Needs answer** | Recommended: yes. Copy confirmed content into the Master Docs so they remain the authoritative source. The architecture document then becomes the implementation spec, not a competing source of truth. |

---

*This document is architecture and definition only. No application code, framework, database schema, or Lovable implementation has been started. Items in Section 9 marked "Needs answer" must be resolved before implementation begins.*
