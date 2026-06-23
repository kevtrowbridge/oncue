# OnCue Founder Decisions Log

## Purpose

This document records approved strategic, product, branding, architecture, UX, roadmap, and business decisions for OnCue. It is the canonical source of truth for the founder, AI agents, and future collaborators.

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
| Product name | OnCue | Approved | Short, memorable, and professional. |
| Primary domain | oncue.day | Approved | Primary product domain. |
| Product category | Timeline Intelligence | Approved | OnCue understands dependencies, priorities, constraints, and execution conditions rather than merely displaying a timeline. |
| Mission | Clarity and stress reduction | Approved | Focused on reducing surprises and making event execution easier. |
| Core execution questions | What is happening now? What happens next? Who is responsible? What requires attention? | Approved | These questions guide the execution experience. |

---

## 2. Market and Positioning

### Target markets

| Market | Status | Notes |
| --- | --- | --- |
| Wedding photographers | Primary launch market | Initial product and validation focus. |
| Wedding planners | Secondary market | Professional coordination and approval workflow. |
| Brides and couples | Secondary market | Client collaboration and timeline visibility. |
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
* A full event-management suite.

---

## 3. UX and Design Philosophy

| Decision | Status | Notes |
| --- | --- | --- |
| Design mantra: Edit Rich. Execute Simple. | Approved | Planning Mode may contain substantial detail. Wedding Day Mode must remain extremely low cognitive load. |
| Wedding Day Mode concept | Approved | Should feel like an interactive folded pocket timeline. |
| Execution experience | Approved | Prioritize readability, speed, one-handed use, quick reference, minimal taps, and low cognitive load. |
| Printability | Approved | Every relevant role-based or filtered view should be printable and exportable as a structured PDF. |
| Role-based views | Approved | Examples include Photographer, Planner, Vendor, DJ, Couple, and Family Group views. |

---

## 4. UI and Brand Visual Direction

These decisions were confirmed during Phase 1 preparation (June 22, 2026).

| Decision | Direction | Status |
| --- | --- | --- |
| App foundation | All-black or near-black background across all screens and panels | Approved |
| Header / nav bar | Light cream or white — creates visual separation from the black app body. Not blush, not pink. | Approved |
| Brand accent colors | Original pink/gold logo direction — warm rose-pink and warm gold, used sparingly | Approved |
| Logo in mobile header | Include the OnCue wordmark if it stays clean and does not create visual noise | Approved |
| Mobile visual direction | Align with desktop visual language while remaining simpler and lower cognitive load | Approved |
| Identity guardrail | Do not drift toward a masculine, generic, or black/gold-only identity | Approved |

### Mobile execution requirements

* Wedding Day Mode and all mobile execution screens must be operable one-handed in portrait orientation.
* Minimum touch target size: 44×44 pt.
* Critical wedding-day actions (Running Late, Emergency Contacts) must be reachable within two taps from the main Wedding Day screen.
* Primary actions should sit in the lower half of the mobile screen where practical.

---

## 5. Architecture and Timeline Intelligence

### Core architecture

| Decision | Status | Notes |
| --- | --- | --- |
| Generic Event architecture | Approved | The underlying system must remain event-agnostic. |
| Wedding implementation | Approved | Wedding-specific functionality should primarily exist in templates and intelligence layers, not in core data structures. |
| Templates | Approved | Reusable objects that remain separate from individual Events. |
| Event lifecycle | Approved | Events complete after their event date, count toward applicable usage limits, and cannot be reused as new events. |
| Constraint modeling | Approved | Model constraints and relationships rather than merely storing scheduled times. |

### Timeline Intelligence scope

The system must understand and evaluate:

* Dependencies.
* Priorities.
* Constraints.
* Locations.
* Travel time.
* Setup time.
* Buffers.
* Minimum durations.
* Responsibilities.
* Environmental and weather sensitivity.
* Recovery options.
* Optional activities.
* Anchored activities.

Anchors protect activities that should not be moved casually. The system should recommend consequential recovery changes rather than silently applying destructive timeline changes. Recommendations must explain the issue, the proposed adjustment, and its likely effect.

---

## 6. Strategic Moats

| Priority | Strategic moat | Status |
| --- | --- | --- |
| Primary | Timeline Intelligence | Approved |
| Secondary | Family Group Optimizer | Approved |
| Tertiary | Execution Intelligence | Approved |

---

## 7. Family Group Optimizer

Timeline Intelligence remains the primary moat. The Family Group Optimizer is an important secondary differentiator.

The Family Group Optimizer should:

* Suggest efficient photo groupings.
* Support simple reordering.
* Help prioritize elderly participants and children.
* Understand which people appear across multiple groups (cross-group awareness).
* Reduce unnecessary movement and waiting.
* Support a missed-person and deferred-group recovery queue.
* Include extended family, chosen family, VIPs, and participants from any cultural family structure.
* Support printable group lists as a wedding-day reference.

**Do not limit participants to immediate family.** Anyone who should appear in a group photo — biological, step, blended, chosen, cultural, or otherwise — must be supported.

---

## 8. Collaboration and Change Control

### Roles and permissions model

| Role | Edit access | How changes are applied |
| --- | --- | --- |
| Owner (photographer) | Full | Applied immediately and authoritatively |
| CoOwner (co-planner) | Full | Applied immediately and authoritatively |
| Collaborator (planner) | Full | Applied immediately; flagged as **Review Required** for owner visibility |
| Couple | Propose only | Changes held as proposals; require explicit owner or CoOwner approval before being applied |
| Vendor | View only | No edit access |

### Key decisions

| Decision | Status | Notes |
| --- | --- | --- |
| Couple change control | Approved | Couple changes are never applied automatically. They require explicit owner or CoOwner approval. |
| Collaborator Review Required | Approved | Collaborator edits apply immediately but are always flagged as Review Required so the owner can review and optionally revert. |
| Reversibility | Approved | Timeline modifications should be visible, reviewable, and reversible. |
| Role-based visibility | Approved | Vendors and participants receive filtered views containing only information relevant to their role. |
| What's Changed summary | Approved | Owners, planners, and couples receive a plain-language "What's Changed Since Last Visit" summary on return to any event view. |

---

## 9. Event Readiness Checklist

Binary Ready / Not Ready status is replaced by a 7-item Event Readiness Checklist. All 7 items should be true before the event is treated as ready for the wedding day.

| # | Checklist item |
| --- | --- |
| 1 | Questionnaire complete |
| 2 | Group photos sequenced |
| 3 | PDF backup downloaded |
| 4 | No critical warnings |
| 5 | Couple proposals resolved |
| 6 | Vendor link shared |
| 7 | Emergency contacts entered |

---

## 10. Version History and Rollback

The MVP must include:

| Feature | Status |
| --- | --- |
| Undo / redo in the Timeline Editor | Approved |
| Automatic snapshots at meaningful moments (PDF download, collaborator invite, publish, first edit after open, hourly during active editing) | Approved |
| Full timeline restore from any snapshot | Approved |
| Change log (record of every edit, by any user) | Approved |
| Plain-language version comparison summaries | Approved |

---

## 11. Vendor Access and Vendor Links

| Decision | Status | Notes |
| --- | --- | --- |
| Vendor visibility as a core feature | Approved | Not an optional add-on; part of the base platform. |
| Filtered vendor views | Approved | Vendors receive a filtered timeline containing only activities relevant to their role. No OnCue account required. |
| Vendor status tracking | Approved | Three states: **Invited** (link generated) → **Viewed** (link opened) → **Confirmed** (vendor acknowledged). |
| Vendor link purpose | Approved | Gives the owner visibility into whether vendors have actually seen the timeline before the event. |

---

## 12. Emergency Contacts

| Decision | Status | Notes |
| --- | --- | --- |
| Collection method | Approved | Emergency contacts are collected through Questionnaire Section 8. |
| Wedding Day Mode access | Approved | Emergency contacts must be accessible with one tap from the main Wedding Day Mode screen. |
| Readiness requirement | Approved | Entering at least one emergency contact is required to complete the Event Readiness Checklist (item 7). |
| Rationale | — | Wedding-day safety requirement. Contacts must be accessible even when internet is unreliable. |

---

## 13. PDF Backup

| Decision | Status | Notes |
| --- | --- | --- |
| PDF as mandatory backup | Approved | PDF is the required emergency fallback if OnCue is unavailable on the wedding day. |
| Coverage | Approved | All relevant role-based and filtered views should be downloadable and printable as PDF. |
| Formats | Approved | Five formats: Compact Itinerary, Full Timeline, Vendor-Filtered, Group Photo Only, Couple's View. |
| Readiness tracking | Approved | PDF download status is tracked as item 3 in the Event Readiness Checklist. |
| Warning behavior | Approved | A persistent warning is shown if no PDF has been downloaded before the event date. |

---

## 14. Smart Defaults

| Decision | Status | Notes |
| --- | --- | --- |
| Smart defaults required | Approved | Every field must have a sensible default. A photographer who enters only the event date and couple names should receive a usable baseline timeline immediately. |
| Rationale | — | Reduces onboarding friction and supports first-event success. Users should not face blank slates. |

---

## 15. Business and Roadmap

| Decision | Status | Notes |
| --- | --- | --- |
| Free tier | Approved | Limited to three Events. |
| Completed Event usage | Approved | Completed Events count toward applicable limits and cannot simply be reused as new Events. |
| Custom branding and domains | Approved | May be offered as add-on capabilities rather than being restricted to enterprise plans only. |
| Integration compatibility | Approved | Architect for future compatibility with Google Calendar, Outlook, ICS, Zapier, and Make. External calendars are sync targets, not replacements for the OnCue Event model. |
| Integration priority | Approved | Integrations must not take priority over the core Timeline Intelligence engine. |
| MVP strategy | Approved | Build the smallest functional version that demonstrates Timeline Intelligence. |
| Roadmap philosophy | Approved | Prefer working functionality, user testing, and simplicity over feature completeness, premature integrations, and enterprise complexity. |

---

## 16. AI Strategy

| Decision | Status | Notes |
| --- | --- | --- |
| MVP AI requirement | Approved | The MVP does not require AI features. |
| Lovable built-in AI | Approved | Acceptable to use Lovable's built-in AI for the first proof of concept, for implementation efficiency. |
| V2 AI candidates | Pending | Potential V2 features include timeline generation, timeline critique, and Group Photo Optimizer assistance. Not approved for MVP scope. |
| High-volume AI infrastructure | Deferred | Decisions about high-volume AI infrastructure are deferred until after MVP validation. |

---

## 17. Decision-Log Maintenance Rules

* `docs/FOUNDER_DECISIONS.md` is the canonical founder decision log. The Google Doc is archive and brainstorming reference only.
* Record new decisions rather than silently rewriting institutional history.
* Mark replaced decisions as **Superseded** and reference the replacement decision.
* Do not treat proposals, assumptions, or AI recommendations as approved founder decisions.
* Only founder-approved decisions may be marked **Approved**.
* Identify conflicts between implementation work and approved decisions before proceeding.
* Keep this document concise. Avoid duplicating operational progress that belongs in `docs/claude-handoff/current.md`.
