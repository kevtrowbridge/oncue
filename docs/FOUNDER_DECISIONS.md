# OnCue Founder Decisions Log

## Purpose

This document records approved strategic, product, branding, architecture, UX, roadmap, and business decisions for OnCue. Its purpose is to preserve institutional memory and provide a reliable source of truth for the founder, AI agents, and future collaborators.

**Last updated:** June 20, 2026

### Decision statuses

* **Approved:** Confirmed by the founder and currently authoritative.
* **Pending:** Under consideration but not yet approved.
* **Superseded:** Previously approved but replaced by a later decision.

---

## 1. Foundational Decisions

| Decision                 | Selection                                                                              | Status   | Notes                                                                                                                       |
| ------------------------ | -------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| Product name             | OnCue                                                                                  | Approved | Short, memorable, and professional.                                                                                         |
| Primary domain           | oncue.day                                                                              | Approved | Primary product domain.                                                                                                     |
| Product category         | Timeline Intelligence                                                                  | Approved | OnCue understands dependencies, priorities, constraints, and execution conditions rather than merely displaying a timeline. |
| Mission                  | Clarity and stress reduction                                                           | Approved | Focused on reducing surprises and making event execution easier.                                                            |
| Core execution questions | What is happening now? What happens next? Who is responsible? What requires attention? | Approved | These questions guide the execution experience.                                                                             |

---

## 2. Market and Positioning

### Target markets

| Market                                                                        | Status                | Notes                                                                                |
| ----------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------ |
| Wedding photographers                                                         | Primary launch market | Initial product and validation focus.                                                |
| Wedding planners                                                              | Secondary market      | Professional coordination and approval workflow.                                     |
| Brides and couples                                                            | Secondary market      | Client collaboration and timeline visibility.                                        |
| Corporate events, conferences, productions, festivals, galas, and fundraisers | Future markets        | Supported through the generic Event architecture rather than separate core products. |

### Product identity

#### OnCue is

* A Timeline Intelligence platform.
* An event-execution and coordination platform.
* An adaptive execution layer for complex events.
* A system that models dependencies, constraints, priorities, responsibilities, and recovery options.

#### OnCue is not

* A CRM.
* An invoicing system.
* A general project-management tool.
* A wedding-planning platform.
* A full event-management suite.

---

## 3. UX and Design Philosophy

| Decision                                  | Status   | Notes                                                                                                                 |
| ----------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| Design mantra: Edit Rich. Execute Simple. | Approved | Planning mode may contain substantial detail, while execution mode must remain extremely simple.                      |
| Wedding-day mode                          | Approved | Designed as an interactive folded pocket timeline.                                                                    |
| Execution experience                      | Approved | Prioritize readability, speed, one-handed use, quick reference, minimal taps, and low cognitive load.                 |
| Printability                              | Approved | Every relevant role-based or filtered view should be printable and exportable as a structured PDF.                    |
| Role-based views                          | Approved | Examples include Photographer, Planner, Vendor, DJ, and Family Group views.                                           |

---

## 4. Architecture and Timeline Intelligence

### Core architecture

| Decision                   | Status   | Notes                                                                                                             |
| -------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| Generic Event architecture | Approved | The underlying system must remain event-agnostic.                                                                 |
| Wedding implementation     | Approved | Wedding-specific functionality should primarily exist in templates and intelligence layers.                       |
| Templates                  | Approved | Reusable objects that remain separate from individual Events.                                                     |
| Event lifecycle            | Approved | Events complete after their event date, count toward applicable usage limits, and cannot be reused as new events. |
| Constraint modeling        | Approved | Model constraints and relationships rather than merely storing scheduled times.                                   |

### Timeline Intelligence

The system should understand and evaluate:

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

Anchors protect activities that should not be moved casually.

The system should recommend consequential recovery changes rather than silently applying destructive timeline changes. Recommendations should explain the issue, the proposed adjustment, and its likely effect.

---

## 5. Strategic Moats

| Priority  | Strategic moat         | Status   |
| --------- | ---------------------- | -------- |
| Primary   | Timeline Intelligence  | Approved |
| Secondary | Family Group Optimizer | Approved |
| Tertiary  | Execution Intelligence | Approved |

---

## 6. Family Group Optimizer

The Family Group Optimizer should:

* Suggest efficient family-photo groupings.
* Support simple reordering.
* Help prioritize elderly participants and children.
* Understand which people appear across multiple groups.
* Reduce unnecessary movement and waiting.
* Support a missed-person or deferred-group recovery queue.

The Family Group Optimizer is an important differentiator, but it is not the primary company moat. Timeline Intelligence remains the primary moat.

---

## 7. Collaboration

| Decision              | Status   | Notes                                                                                         |
| --------------------- | -------- | --------------------------------------------------------------------------------------------- |
| Client suggestions    | Approved | Clients may suggest timeline changes.                                                         |
| Professional approval | Approved | Photographers and planners approve final changes.                                             |
| Reviewable changes    | Approved | Timeline modifications should be visible, reviewable, and reversible.                         |
| Role-based visibility | Approved | Vendors and participants receive tailored filtered views containing only relevant information. |

---

## 8. Business and Roadmap

| Decision                    | Status   | Notes                                                                                                                                    |
| --------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Initial free tier           | Approved | Limited to three Events.                                                                                                                 |
| Completed Event usage       | Approved | Completed Events continue to count toward applicable limits and cannot simply be reused.                                                 |
| Custom branding and domains | Approved | May be offered as add-on capabilities rather than being restricted only to enterprise plans.                                             |
| Integration compatibility   | Approved | Architect for future compatibility with Google Calendar, Outlook, ICS, Zapier, and Make.                                                 |
| External calendars          | Approved | External calendars are synchronization targets and do not replace OnCue's Event model.                                                   |
| Integration priority        | Approved | Integrations must not take priority over the core Timeline Intelligence engine.                                                          |
| MVP strategy                | Approved | Build the smallest functional version that demonstrates Timeline Intelligence.                                                           |
| Roadmap philosophy          | Approved | Prefer working functionality, user testing, and simplicity over feature completeness, premature integrations, and enterprise complexity. |

---

## 9. Decision-Log Maintenance Rules

* Record new decisions rather than silently rewriting institutional history.
* Mark replaced decisions as **Superseded** and reference the replacement decision.
* Do not treat proposals, assumptions, or AI recommendations as approved founder decisions.
* Only founder-approved decisions may be marked **Approved**.
* Keep this repository copy synchronized with the authoritative OnCue Master Docs.
* Identify conflicts between implementation work and approved decisions before proceeding.
* Keep the document concise and avoid duplicating operational progress that belongs in `docs/claude-handoff/current.md`.
