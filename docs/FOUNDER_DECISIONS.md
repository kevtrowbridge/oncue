# OnCue Founder Decisions Log

## Purpose

This document records approved strategic, product, branding, architecture, UX, roadmap, and business decisions for OnCue. It is the canonical decision log for implementation and GitHub-tracked work.

**Last updated:** June 22, 2026

### Governance hierarchy

1. **OnCue Master Document V2** (Google Drive) — strategic product source of truth. Brand, product vision, market positioning, and high-level roadmap direction originate here.
2. **`docs/FOUNDER_DECISIONS.md`** (this file) — canonical founder decision log for implementation and GitHub-tracked decisions. Approved decisions from the Master Document are recorded here before being treated as authoritative for development work.
3. **`docs/claude-handoff/current.md`** — operational project status only. Not a source of strategy.
4. **OnCue Founder Decisions Log** (Google Doc) — historical import source. No longer actively maintained. Decisions have been migrated into this file.

`docs/FOUNDER_DECISIONS.md` does not replace or supersede the OnCue Master Document V2. When the two conflict, the Master Document takes precedence and this file must be updated to reflect it.

### Decision statuses

* **Approved:** Confirmed by the founder and currently authoritative.
* **Pending:** Under consideration but not yet approved.
* **Superseded:** Previously approved but replaced by a later decision. The replacement is referenced inline.

---

## 1. Foundational Decisions

| Decision | Selection | Status | Notes |
| --- | --- | --- | --- |
| Product name | OnCue | Approved | |
| Primary domain | oncue.day | Approved | |
| Product category | Timeline Intelligence | Approved | OnCue understands dependencies, priorities, constraints, and execution conditions rather than merely displaying a timeline. |
| Mission | Clarity and stress reduction | Approved | Reduce surprises; make event execution easier. |
| Core execution questions | What is happening now? What happens next? Who is responsible? What requires attention? | Approved | These four questions guide the execution experience. |
| Hero language | "The timeline that adapts with you." | Approved | Primary customer-facing headline. |
| Supporting anchor | "Recalculate the day. Keep everyone aligned." | Approved | Secondary positioning line beneath the hero. |

---

## 2. Market and Positioning

### Target markets

| Market | Status | Notes |
| --- | --- | --- |
| Wedding photographers | Primary launch market | Initial product and validation focus. |
| Wedding planners | Secondary market | Professional coordination and approval workflow. |
| Couples | Secondary market | Client collaboration and timeline visibility. |
| Corporate events, conferences, productions, festivals, galas, and fundraisers | Future markets | Supported through the generic Event architecture rather than separate core products. |

### Product identity

**OnCue is:**
* A Timeline Intelligence platform.
* An event execution and coordination platform powered by Timeline Intelligence.
* An adaptive execution layer for complex events.
* A system that models dependencies, constraints, priorities, responsibilities, and recovery options.

**OnCue is not:**
* A CRM.
* An invoicing system.
* A general project-management tool.
* A wedding-planning platform.
* A vendor marketplace.
* A full event-management suite.

---

## 3. Customer-Facing Language

Terminology decisions for UI copy, marketing, and communications. Internal/technical names may differ.

| Customer-facing term | Use | Avoid | Notes |
| --- | --- | --- | --- |
| Day-Of Mode | ✓ Approved | "Execution Mode," "Live Mode," "Wedding Day Mode" | The screen and concept are called Day-Of Mode in customer contexts. *Supersedes "Wedding Day Mode" for customer-facing use.* |
| Fixed Timing | ✓ Approved | "Critical path," "Anchor" | Plain-language equivalent for activities that must not move. |
| Alternative Paths / Timeline Recalculation / Adaptive Path Routing / Recalculation Options | ✓ Approved | "Recovery," "Recovery Options" | Recovery is acceptable as an internal/technical term only. It must not appear in UI copy. |
| View in OnCue / Open in OnCue / Confirm in OnCue / Updated in OnCue | ✓ Approved | Aggressive or salesy CTAs | Preferred CTA language for vendor and non-user outreach. |

---

## 4. UX and Design Philosophy

| Decision | Status | Notes |
| --- | --- | --- |
| Design mantra: Edit Rich. Execute Simple. | Approved | Planning Mode (Timeline tab) may be detail-rich. Day-Of Mode must be extremely low cognitive load. |
| Day-Of Mode concept | Approved | Should feel like an interactive folded pocket timeline. |
| Execution experience | Approved | Prioritize readability, speed, one-handed use, quick reference, minimal taps, and low cognitive load. |
| Printability | Approved | Every relevant role-based or filtered view should be printable and exportable as a structured PDF. |
| Role-based views | Approved | Examples include Photographer, Planner, Vendor, DJ, Couple, and Family Group views. |

### Day-Of Mode layout requirements

Day-Of must show only:
* **Now** — current activity
* **Up Next** — next 1–2 activities
* **Attention** — current flags or alerts
* **One primary action** — e.g. "Running Late"

Detailed diagnostics, activity detail panels, and intelligence explanations belong in the Timeline, Activity Detail, or Status screen — not in Day-Of Mode.

---

## 5. Navigation and Screens

The Lovable scaffold established the following top-level navigation structure. This is the approved MVP navigation model.

| Tab / Screen | Purpose |
| --- | --- |
| Setup | Event intake and questionnaire. May be renamed "Questionnaire" or "Event Setup" in a later phase. |
| Timeline | Planning Mode — full detail-rich timeline editor. |
| Day-Of | Execution Mode — minimal, one-handed, low cognitive load. |
| People | Participant roster and photo group management. |
| Status | Event readiness, alerts, vendor status summary. |
| Print & Share | PDF export and role-based sharing. |

---

## 6. UI and Brand Visual Direction

Confirmed June 22, 2026 (initial phase) and refined during Lovable design phase.

### Visual layer model

OnCue uses a two-layer visual system:

* **Editorial brand layer** (header / nav): luxury, light, cream or editorial white. Conveys brand identity and product quality.
* **Operational product layer** (main workspace): dark, focused, low distraction. Supports concentration during event planning and execution.

### Brand identity

| Element | Direction | Status |
| --- | --- | --- |
| Logo mark | Circular OC monogram: circular blush fill background, champagne-gold ring, champagne-gold OC lettering. No inner white outline. | Approved |
| Primary brand accent | Blush (warm rose) — used in the logo mark and sparingly as a brand accent in the UI | Approved |
| Secondary accent | Champagne gold — used in the logo and for premium indicators | Approved |
| Identity guardrail | Do not drift toward a masculine, generic, or black/gold-only identity | Approved |

### Application surfaces

| Surface | Treatment | Status |
| --- | --- | --- |
| Header / nav bar (mobile) | Muted cream band — brand layer. Logo sits here. Not blush, not pink, not white. | Approved |
| Header / nav bar (desktop) | Editorial cream — brand layer. Same principle as mobile. | Approved |
| Main workspace | All-black or near-black (#0A0A0A) — operational layer. All planning and editing occurs here. | Approved |
| Cards / elevated surfaces | Slightly lighter than the workspace (#141414–#1A1A1A) to create depth. | Approved |
| Day-Of workspace | Pure black (#000000) — maximum contrast for outdoor legibility. | Approved |

**Note:** The "not blush, not pink" guidance refers to the *header background*, not the logo. The logo mark uses blush as a fill color. These are not in conflict.

### Mobile execution requirements

* Day-Of Mode and all execution screens must be operable one-handed in portrait orientation.
* Minimum touch target size: 44×44 pt.
* Critical Day-Of actions must be reachable within two taps from the main Day-Of screen.
* Primary actions should sit in the lower half of the mobile screen where practical.

---

## 7. Architecture and Timeline Intelligence

### Core architecture

| Decision | Status | Notes |
| --- | --- | --- |
| Generic Event architecture | Approved | The underlying system must remain event-agnostic. |
| Wedding implementation | Approved | Wedding-specific functionality should primarily exist in templates and intelligence layers, not in core data structures. |
| Templates | Approved | Reusable objects that remain separate from individual Events. |
| Event lifecycle | Approved | Events complete after their event date, count toward applicable usage limits, and cannot be reused as new events. |
| Constraint modeling | Approved | Model constraints and relationships rather than merely storing scheduled times. |

### Timeline Intelligence scope

The system must understand and evaluate: dependencies, priorities, constraints, locations, travel time, setup time, buffers, minimum durations, responsibilities, environmental and weather sensitivity, recovery options, optional activities, and anchored activities.

When the engine detects an issue, it must explain:
1. **Why** — what condition caused the issue.
2. **Impact** — what happens if it is not addressed.
3. **Affected activities** — which activities are at risk.
4. **Recommended action** — what the owner should consider doing.

Recovery options must be proposed and explained — never silently applied. "Fixed Timing" activities must be protected from casual movement.

**Important:** The intelligence logic generated by Lovable in the current scaffold is demo/prototype frontend logic only. It must not be treated as the production domain engine. The real constraint engine will be built by Claude Code in a later phase.

---

## 8. Questionnaire and Event Setup

The questionnaire (Setup tab) is a critical data collection layer. It is currently missing from the Lovable scaffold and must be built.

### What it collects

* Event basics (dates, couple names, contact info)
* Locations (ceremony, reception, getting ready, portraits, etc.)
* People (roster of all participants and their relationships)
* Family structure and relationships
* Photo requests and priorities
* Timeline priorities and constraints
* Vendors and arrival times
* Emergency contacts

### What it generates

From questionnaire data, the system should automatically produce:
* People roster
* Suggested photo groups
* Starter timeline with smart defaults
* Event Readiness Checklist items
* Basic constraint relationships (travel time, fixed-timing activities)

### Smart defaults

Every field must have a sensible default. A photographer who enters only the event date and couple names should receive a usable baseline timeline immediately. Users should not face blank slates.

---

## 9. Strategic Moats

| Priority | Strategic moat | Status |
| --- | --- | --- |
| Primary | Timeline Intelligence | Approved |
| Secondary | People Flow Optimization (Family Group Optimizer) | Approved |
| Tertiary | Execution Intelligence | Approved |

---

## 10. People and Photo Groups

People and Photo Groups are distinct concepts and must not be conflated in the data model or UI.

| Concept | Definition |
| --- | --- |
| **People** | The raw roster of individuals associated with the event. Includes relationships, roles, and contact info. |
| **Photo Groups** | Generated groupings of people for portrait sequences. Derived from the People roster. |

Photo Groups are generated *from* People. They do not replace the People roster. People can belong to multiple Photo Groups. The People screen is the source of truth for who is associated with the event.

---

## 11. Family and Photo Group Optimizer

The deeper strategic moat is **People Flow Optimization** — minimizing waiting and unnecessary movement during the portrait session.

### Goals

* Minimize waiting time for any individual.
* Minimize unnecessary movement between groups.
* Release people (especially grandparents, elderly, children) as early as possible.
* Handle missing people gracefully.
* Support divorced, blended, step, chosen, and culturally complex families.

### Default wedding portrait sequence

| # | Group |
| --- | --- |
| 1 | Couple + Bride Extended Family |
| 2 | Couple + Bride Grandparents |
| 3 | Couple + Bride Siblings |
| 4 | Couple + Bride Immediate Family |
| 5 | Couple + Bride Parents |
| 6 | Couple + Both Sets of Parents |
| 7 | Couple + Groom Parents |
| 8 | Couple + Groom Immediate Family |
| 9 | Couple + Groom Siblings |
| 10 | Couple + Groom Grandparents |
| 11 | Couple + Groom Extended Family |

*Immediate Family = parents + siblings. Bride and groom are included by default in every group.*

### Missing-person flow

When a person is missing, the system should recommend options based on:
* Who is already gathered.
* Who is missing and their estimated arrival.
* Who can be released fastest if the group proceeds without the missing person.
* Whether switching to a different family sub-group would require gathering new people.
* Timeline impact and whether any Fixed Timing activities would be affected.

**Do not limit participants to immediate family.** Anyone who should appear in a group photo — biological, step, blended, chosen, cultural, VIP, or otherwise — must be supported.

---

## 12. Master Checklist

Checklist items are associated with timeline activities but also roll up into a unified Master Checklist visible across the event.

| Decision | Status | Notes |
| --- | --- | --- |
| Checklist item states | Approved | Items may be: pending, completed, deferred, or skipped. |
| Activity association | Approved | Each checklist item belongs to a timeline activity. |
| Master Checklist rollup | Approved | All checklist items across all activities are visible in a unified Master Checklist view. |
| Item portability | Approved | Checklist items can be moved between activities without creating new timeline activities. Example: move "Aunt Linda Portrait" from Family Photos to Cocktail Hour. |

---

## 13. Shared Timeline and Private Workspaces

| Decision | Status | Notes |
| --- | --- | --- |
| Shared timeline | Approved | The event timeline is shared and visible to all participants with access. |
| Private workspaces | Approved | Each participant may have a private workspace and checklist visible only to them. |
| Privacy default | Approved | Private checklists are not automatically visible to all participants. |

Examples of private workspaces: Photographer checklist, Planner checklist, DJ checklist, Hair & Makeup checklist.

---

## 14. Collaboration and Change Control

### Roles and permissions model

| Role | Edit access | How changes are applied |
| --- | --- | --- |
| Owner (photographer) | Full | Applied immediately and authoritatively |
| CoOwner (co-planner) | Full | Applied immediately and authoritatively |
| Collaborator (planner) | Full | Applied immediately; flagged as **Review Required** for owner visibility |
| Couple | Propose only | Changes held as proposals; require explicit owner or CoOwner approval before being applied |
| Participant | Role-based | View assigned timeline; complete own checklist; report delays; submit requests; acknowledge updates |

### Key decisions

| Decision | Status | Notes |
| --- | --- | --- |
| Couple change control | Approved | Couple changes are never applied automatically. They require explicit owner or CoOwner approval. |
| Collaborator Review Required | Approved | Collaborator edits apply immediately but are always flagged as Review Required so the owner can review and optionally revert. |
| Reversibility | Approved | Timeline modifications should be visible, reviewable, and reversible. |
| Role-based visibility | Approved | Participants receive filtered views containing only information relevant to their role. |
| What's Changed summary | Approved | Owners, planners, and couples receive a plain-language "What's Changed Since Last Visit" summary on return. |

---

## 15. Participant Model

*Supersedes §11 "Vendor Access and Vendor Links" from the June 22, 2026 prior version.*

OnCue uses a unified **Participant** model rather than a rigid vendor/team split. All contributors to an event — professional crew, vendors, and helpers — are Participants with role-based permissions.

### Participant types (not exhaustive)

Photographer, second shooter, videographer, planner, coordinator, DJ, florist, hair & makeup, caterer, officiant, and any custom role.

### Participant capabilities

* View their assigned / filtered timeline.
* Complete their own private checklist.
* Report delays.
* Submit requests.
* Acknowledge timeline updates.

### Participant status tracking

Applies to all Participants, including vendors:

**Invited** (link or invite sent) → **Viewed** (timeline accessed) → **Confirmed** (participant acknowledged)

This gives the owner visibility into whether key people have actually seen the timeline before the event.

### Non-user access

Participants who do not have an OnCue account still receive SMS or email updates and can access their filtered timeline via a link without creating an account.

---

## 16. Vendor Communication and Adoption

| Decision | Status | Notes |
| --- | --- | --- |
| OnCue as source of truth | Approved | OnCue should be the authoritative source of timeline information, not necessarily the only communication channel. |
| Non-user updates | Approved | Non-users should still receive SMS or email updates. |
| Preferred CTA language | Approved | "View in OnCue," "Open in OnCue," "Confirm in OnCue," "Updated in OnCue." |
| Structured requests | Approved | Prefer structured Requests over open-ended messaging. Avoid building a full chat platform. |
| Participation is free | Approved | Any participant can receive and view their timeline without a paid account. |

---

## 17. Event Readiness Checklist

Binary Ready / Not Ready status is replaced by a 7-item Event Readiness Checklist. All 7 items should be true before the event is treated as ready for the wedding day.

| # | Checklist item |
| --- | --- |
| 1 | Questionnaire complete |
| 2 | Group photos sequenced |
| 3 | PDF backup downloaded |
| 4 | No critical warnings |
| 5 | Couple proposals resolved |
| 6 | Participant link shared |
| 7 | Emergency contacts entered |

---

## 18. Version History and Rollback

The MVP must include:

| Feature | Status |
| --- | --- |
| Undo / redo in the Timeline Editor | Approved |
| Automatic snapshots at meaningful moments (PDF download, participant invite, publish, first edit after open, hourly) | Approved |
| Full timeline restore from any snapshot | Approved |
| Change log (record of every edit, by any user) | Approved |
| Plain-language version comparison summaries | Approved |

---

## 19. Emergency Contacts

| Decision | Status | Notes |
| --- | --- | --- |
| Collection method | Approved | Emergency contacts are collected through the questionnaire. |
| Day-Of Mode access | Approved | Emergency contacts must be accessible with one tap from the main Day-Of screen. |
| Readiness requirement | Approved | At least one emergency contact is required to complete the Event Readiness Checklist (item 7). |

---

## 20. PDF Backup

| Decision | Status | Notes |
| --- | --- | --- |
| PDF as mandatory backup | Approved | PDF is the required emergency fallback if OnCue is unavailable on the wedding day. |
| Coverage | Approved | All relevant role-based and filtered views should be downloadable and printable as PDF. |
| Formats | Approved | Five formats: Compact Itinerary, Full Timeline, Participant-Filtered, Group Photo Only, Couple's View. |
| Readiness tracking | Approved | PDF download status is tracked as item 3 in the Event Readiness Checklist. |
| Warning behavior | Approved | A persistent warning is shown if no PDF has been downloaded before the event date. |

---

## 21. Business and Monetization

### Growth principle

> Participation is free. Ownership is monetized. AI is experienced before it is sold.

### Pricing tiers

| Tier | Limits | Core features | AI |
| --- | --- | --- | --- |
| **Free** | Up to 3 self-created events; unlimited participation | Core product experience — Timeline Intelligence, shared timelines, checklists | AI available during trial events |
| **Professional** | ~25 self-created events/year | Full business tier: templates, checklists, Timeline Intelligence, shared timelines, exports | Limited AI Assist |
| **Studio** | Unlimited events | Team management, expanded permissions, branding/white-label, advanced exports | Expanded AI |

Do not build billing or paywalls now. Document only.

### Additional roadmap decisions

| Decision | Status | Notes |
| --- | --- | --- |
| Completed Event usage | Approved | Completed Events count toward applicable limits and cannot be reused as new Events. |
| Custom branding and domains | Approved | Add-on capabilities; not restricted to Studio only. |
| Integration compatibility | Approved | Architect for future compatibility with Google Calendar, Outlook, ICS, Zapier, and Make. External calendars are sync targets, not replacements for the OnCue Event model. |
| Integration priority | Approved | Integrations must not take priority over the core Timeline Intelligence engine. |
| MVP strategy | Approved | Build the smallest functional version that demonstrates Timeline Intelligence. |
| Roadmap philosophy | Approved | Prefer working functionality, user testing, and simplicity over feature completeness. |

---

## 22. AI Strategy

| Decision | Status | Notes |
| --- | --- | --- |
| MVP AI requirement | Approved | The MVP does not require AI features. |
| Lovable built-in AI | Approved | Acceptable to use Lovable's built-in AI for the first proof of concept, for implementation efficiency. |
| AI is experienced before it is sold | Approved | AI features should be discoverable on the Free tier to drive upgrade intent. |
| V2 AI candidates | Pending | Timeline generation, timeline critique, Group Photo Optimizer assistance. Not approved for MVP scope. |
| High-volume AI infrastructure | Deferred | Deferred until after MVP validation. |

---

## 23. Repository Boundaries

| Decision | Status | Notes |
| --- | --- | --- |
| Canonical repo | `KevTrowbridge/oncue` | Approved | This is the real architecture and production repository. |
| Lovable scaffold repo | `event-flow-master` (separate Lovable-created repo) | Approved | Keep as a staging/export repo for now. Do not overwrite `oncue`. |
| Merge strategy | Pending | Claude Code will inspect both repositories and propose a safe merge strategy before any code is moved. |
| Old accidental repo | `ktrowbridge/oncue` | Retained | Left in place. Not deleted. Not the active repo. |

---

## 24. Decision-Log Maintenance Rules

* `docs/FOUNDER_DECISIONS.md` is the canonical founder decision log. The Google Doc is archive and brainstorming reference only.
* `docs/FOUNDER_DECISIONS.md` does not replace or supersede the OnCue Master Document V2. When the two conflict, the Master Document takes precedence.
* Record new decisions rather than silently rewriting institutional history.
* Mark replaced decisions as **Superseded** and reference the replacement decision.
* Do not treat proposals, assumptions, or AI recommendations as approved founder decisions.
* Only founder-approved decisions may be marked **Approved**.
* Identify conflicts between implementation work and approved decisions before proceeding.
* Keep this document concise. Avoid duplicating operational progress that belongs in `docs/claude-handoff/current.md`.
