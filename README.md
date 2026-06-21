# OnCue

**Category: Timeline Intelligence**

OnCue answers four questions at every moment of an event:

- What is happening now?
- What happens next?
- Who is responsible?
- What requires attention?

It is built for event professionals who need to coordinate complex, time-sensitive experiences without surprises.

---

## What OnCue Is

OnCue is an event-execution and coordination platform powered by Timeline Intelligence. It understands dependencies, priorities, constraints, locations, travel time, and recovery options — not merely a list of scheduled times.

OnCue models what can move, what cannot, and what needs approval before a change affects other people. When a delay occurs, OnCue recommends recovery options rather than silently rewriting the timeline.

---

## What OnCue Is Not

- A CRM.
- An invoicing system.
- A general project-management platform.
- A wedding-planning platform.
- A full event-management suite.

---

## Markets

**Primary launch market:** Wedding photographers — the initial validation focus.

**Secondary markets:** Wedding planners and brides/couples — professional coordination, client collaboration, and timeline visibility.

**Future markets:** Conferences, corporate events, productions, festivals, galas, and fundraisers — served through the generic Event architecture, not separate core products.

---

## Product Principles

**Edit Rich. Execute Simple.**
Planning mode may contain substantial detail. Execution mode must remain extremely low cognitive load — fast, readable, one-handed, minimal taps.

**Generic Event architecture.**
The underlying system is event-agnostic. Wedding-specific functionality lives in templates and intelligence layers, not in core data structures.

**Constraint modeling.**
OnCue models dependencies, anchors, priorities, minimum durations, buffers, location inheritance, travel time, weather sensitivity, and recovery options — not just start and end times.

**Recommendation-first recovery.**
Consequential timeline changes are recommended with an explanation before they are applied. Destructive changes are never silent.

**Printability.**
Every role-based and filtered view is printable and exportable as a structured PDF.

**Smallest working implementation that proves Timeline Intelligence.**
Build what validates the core engine. Avoid enterprise complexity, premature integrations, and feature completeness before product-market fit.

---

## Strategic Moats

| Priority  | Moat                   |
| --------- | ---------------------- |
| Primary   | Timeline Intelligence  |
| Secondary | Family Group Optimizer |
| Tertiary  | Execution Intelligence |

---

## Current Repository Status

This repository currently contains foundational product and development documentation only.

- No application framework has been selected or initialized.
- There is no usable product interface yet.
- GitHub is not yet connected.
- Supabase is not yet configured.
- Deployment is not yet configured.

---

## Documentation Map

| File / Location | Purpose |
| --- | --- |
| `CLAUDE.md` | Permanent Claude Code working instructions |
| `docs/claude-handoff/current.md` | Current operational state and next step |
| `docs/claude-handoff/archive/` | Chronological milestone history |
| `docs/FOUNDER_DECISIONS.md` | Approved founder decisions log |
| OnCue Master Docs (Google Drive) | Authoritative source of truth |

**Authoritative OnCue Master Docs:**

`~/Library/CloudStorage/GoogleDrive-kevin@bcenergyalliance.org/My Drive/Honeycomb_software/OnCue Timeline Intelligence/_Master DOCS`

---

## Local Workflow

1. Open the OnCue folder in VS Code.
2. Open a terminal in the repository root.
3. Run `claude`.
4. Claude reads the required documentation before substantial work.
5. Review the completion report after each meaningful task.

---

## Next Infrastructure Step

Create an empty private GitHub repository named `oncue`. Do not initialize it with a README, .gitignore, or licence. Connect the existing local repository only after founder approval.
