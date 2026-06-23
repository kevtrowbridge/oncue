# Claude Handoff — Current

**Last updated:** June 22, 2026
**Current phase:** Repository audit complete — interface reconciliation is the gating next step before any code migration

---

## 1. Thirty-Second Summary

Two OnCue repositories exist. `KevTrowbridge/oncue` is the canonical repo — it has the full architecture, strategy docs, and TypeScript interfaces, but zero application code. `kevtrowbridge/event-flow-master` is the Lovable-generated prototype — it has all 8 screens built and working, a production-quality design system, and a complete demo intelligence engine, but no backend, no Supabase, and no production data models.

The two repos are complementary, not competing. The path forward is to merge `event-flow-master` into `oncue` — but seven data model conflicts must be resolved in `data-interfaces.ts` first. No merge has started. No code has been touched. The audit is the completed work.

---

## 2. What Changed

### This session: repository audit completed

Both repositories were fully inspected via `gh api` and local file reads. A 9-section founder review report was produced. Nothing was modified in either repository.

### Prior sessions: documentation and architecture

| Date | Work completed |
|---|---|
| June 22, 2026 | Visual design direction confirmed and embedded in Phase 1 Lovable prompt |
| June 22, 2026 | Founder decisions log consolidated — 24 sections, 287 lines added |
| June 22, 2026 | TypeScript data interfaces written — `docs/architecture/data-interfaces.ts`, 44 exports |
| June 21, 2026 | Architecture v3.0 finalized — all Section 9 decisions approved |
| June 21, 2026 | OnCue migrated from `ktrowbridge/oncue` to `KevTrowbridge/oncue` |

---

## 3. Repository States

### `KevTrowbridge/oncue` — canonical repo

| Asset | Status |
|---|---|
| `CLAUDE.md` | Complete — AI behavior rules |
| `docs/FOUNDER_DECISIONS.md` | Complete — 24 sections, all approved decisions recorded |
| `docs/architecture/mvp-ux-architecture.md` | Complete — v3.0, all 11 screens, all Section 9 decisions |
| `docs/architecture/data-interfaces.ts` | Complete draft — 44 exports; **7 conflicts with event-flow-master** (see §5) |
| Application code | **None** |
| Supabase project | None |
| Design system | None |

Last commit: `6952018` — "Add Lovable design phase founder decisions to decision log"

### `kevtrowbridge/event-flow-master` — Lovable prototype

| Asset | Status |
|---|---|
| Template | `tanstack_start_ts_2026-06-17` (Lovable scaffold) |
| Design system | **Production-quality** — exact oklch brand tokens, Playfair Display + Inter |
| Logo component | **Production-quality** — circular blush background, champagne-gold ring, gold OC monogram |
| EditorialHeader | **Production-quality** — cream header band, dark workspace below |
| IntelligencePanel | **Production-quality** — 4-part format (Why/Impact/Affected/Recommended Action) |
| All 8 screens | **Working** — Dashboard, Setup/Questionnaire, Timeline, Day-Of, People, Status, Print & Share, Activity Detail |
| Data models | **Demo-only** — hardcoded mock arrays, in-memory mutation, localStorage for questionnaire |
| Intelligence engine | **Demo-only** — frontend heuristics labeled ⚠️ DEMO ONLY throughout |
| Supabase | None |
| Auth | None |
| Collaboration model | None |

Last commit: June 23, 2026 UTC — "Added demo-only comments"

**Important constraint:** `event-flow-master` is actively connected to Lovable. Do not force-push, rebase, or amend pushed commits in this repo. The `AGENTS.md` file records this requirement.

---

## 4. Audit Findings — What event-flow-master Built Correctly

These items match founder decisions exactly and are worth preserving:

- **Design system** — obsidian black workspace, cream header, blush + champagne gold, exact oklch values
- **Intelligence explanation format** — Why / Impact / Affected Activities / Recommended Action (matches the approved 4-part spec)
- **Photo group sequence** — `generatePhotoGroupsFromPeople` implements the approved 11-step portrait order (Bride Extended → Bride Grandparents → ... → Shared → ... → Groom Extended)
- **Missing-person flow** — options model with reason, affected activities, estimated delay, and recommended choice
- **Day-Of layout** — Now card / Up Next list / Attention section / one primary action per approved spec
- **Tab navigation** — Setup / Timeline / Day-Of / People / Status / Print & Share (6 tabs, correct)
- **Hero language** — "The timeline that adapts with you." already live on the Dashboard
- **Questionnaire** — 7 sections built with People model that handles side-a/side-b, step-parents, extended family, VIPs

---

## 5. Interface Conflicts — Must Resolve Before Merge

These conflicts exist between `docs/architecture/data-interfaces.ts` and `event-flow-master`'s actual types. All 7 must be resolved in `data-interfaces.ts` before any code migrates to `oncue`. Merging without resolving these causes the BeHive rewiring problem in reverse.

| # | Conflict | `data-interfaces.ts` | `event-flow-master` | Severity |
|---|---|---|---|---|
| 1 | `EventStatus` values | 7 PascalCase states: `Draft \| InProgress \| ReviewNeeded \| Ready \| Live \| Completed \| Archived` | 4 lowercase states: `planning \| on-track \| draft \| complete` | **High** |
| 2 | `Activity.startTime` type | `"HH:MM"` string | ISO datetime string | **High** |
| 3 | `Activity.anchorType` | 4-value enum (`Locked / Preferred / Flexible / MovableWithApproval`) | `isAnchor: boolean` | **Medium** |
| 4 | `Activity.priority` | 5-value enum (`Critical / Important / Flexible / Optional / Buffer`) | `isOptional: boolean` | **Medium** |
| 5 | Duration field names | `durationMinutes`, `minimumDurationMinutes` | `duration`, `minDuration` | **Medium** |
| 6 | Notes fields | `internalNotes` (owner-only) + `vendorFacingNotes` (separate) | Single `notes: string` field | **Medium** |
| 7 | Location model | `locationId: string` reference to `EventLocation` table | Inline `location: string` + `locationInfo` object | **Medium** |

### Types in event-flow-master not yet in data-interfaces.ts (need to add)

| Type | Where | Value |
|---|---|---|
| `ActivityStatus` | `oncue-data.ts` | 7 execution states: `on-track / needs-adjustment / delayed / recalculating / conflict / at-risk / complete` |
| `StatusExplanation` | `oncue-data.ts` | The 4-part explanation object (why/impact/affected/recommendation) — this is what the real solver will output |
| `HealthScore` | `oncue-data.ts` | Event-level health summary with attention list and conflict count |
| `PhotoGroup` | `oncue-data.ts` | kind (bride-side/shared/groom-side/custom), deferred flag, missing persons |
| `MissingPersonImpact` | `oncue-data.ts` | Options with reason/affected/delay estimate for missing-person flow |
| `RelationalBuffer` | `oncue-data.ts` | Before/after/travel buffer per activity |
| `QPerson` model | `questionnaire.ts` | `side: "side-a" \| "side-b" \| "shared"` + `group: PersonGroup` — richer than current `GroupParticipant` |
| `QRelationship` | `questionnaire.ts` | Family relationship kind (married/divorced/remarried/step/single) |

---

## 6. Recommended Merge Sequence (no merge started)

**Phase 0 — Interface reconciliation** ← **current gating step**
Update `docs/architecture/data-interfaces.ts` to resolve all 7 conflicts and add the 8 missing types. No application code changes. This is a documentation/interface task only.

**Phase 1 — Design system and brand components**
Copy to `oncue`: `styles.css`, `Logo.tsx`, `EditorialHeader.tsx`, `IntelligencePanel.tsx`, `HealthCard.tsx`, `InfoTip.tsx`. These have no data model dependencies and no logic. Production-quality; do not rebuild from scratch.

**Phase 2 — Route structure and UI components**
Copy all routes and `src/components/ui/` to `oncue`. At this point `oncue` becomes the working application repo and `event-flow-master` becomes the backup/staging repo.

**Phase 3 — Supabase schema and real persistence**
Write schema, migrations, and client wiring. Remove or quarantine the hardcoded mock arrays and `localStorage` persistence.

**Phase 4 — Real intelligence engine**
`IntelligencePanel` already has the right shape. `StatusExplanation` already has the right fields. The real constraint solver replaces the heuristic bodies in `computeHealth` and `explainStatus`.

---

## 7. Founder Review Required

**Recommended founder action before interface reconciliation begins:**

Review the 7 conflict table in §5 and confirm one resolution for each. The most consequential is conflict #1 (`EventStatus` values) because it affects every screen. The two options are:

- **Adopt event-flow-master's 4 states** (simpler, but loses ReviewNeeded, Ready, Live distinctions)
- **Adopt data-interfaces.ts's 7 states** (recommended — preserves full lifecycle; event-flow-master components need updating)

The other 6 conflicts are technical naming decisions. Claude Code will resolve them in `data-interfaces.ts` once the EventStatus direction is confirmed.

---

## Review Status

Visible to founder: Yes — this handoff file + the audit report produced in chat
Founder review recommended: Yes — confirm EventStatus resolution direction before interface reconciliation begins
Next step: See §8 below

---

## 8. Risks and Concerns

| Risk | Severity | Notes |
|---|---|---|
| Merging before interface reconciliation | High | Will recreate the BeHive rewiring problem. Every component would need immediate rework. Do not skip Phase 0. |
| Continuing Lovable iteration after merge starts | Medium | If Lovable keeps generating into `event-flow-master` after migration to `oncue` begins, the two repos drift again. Decide the Lovable handoff point before Phase 2. |
| `event-flow-master` AGENTS.md rule | Medium | Lovable requires no force-push/rebase on connected branches. If `oncue` becomes the Lovable-connected repo in a future step, this rule must follow it. |
| EventStatus conflict | Medium | The 4-state model in event-flow-master has already been used to build the Dashboard and event cards. Changing to 7 states requires updating those components. Acceptable cost, but must be planned. |
| Intelligence engine labeled DEMO ONLY | Low | The `oncue-data.ts` intelligence engine is well-structured but explicitly a placeholder. It produces correct-looking output from incorrect logic. Do not treat it as a validated constraint solver. |

---

## 9. Exact Successor Prompt

Use this prompt to begin the interface reconciliation work in the next Claude Code session:

```
Work only in: /Users/kevintrowbridge/SaaS Development/OnCue

Task: Reconcile docs/architecture/data-interfaces.ts with the actual types
used in event-flow-master, based on the completed repository audit.

Read first:
- docs/claude-handoff/current.md (the full audit summary)
- docs/architecture/data-interfaces.ts (current state)
- docs/FOUNDER_DECISIONS.md (approved decisions)

Then update docs/architecture/data-interfaces.ts to:

1. Resolve all 7 interface conflicts (see §5 of current.md):
   - EventStatus: adopt the 7-state PascalCase model from data-interfaces.ts;
     note that event-flow-master components will need updating when code migrates
   - Activity.startTime: keep "HH:MM" string (simpler; ISO datetimes are a
     Supabase concern, not a UI interface concern)
   - Activity.anchorType: keep the 4-value enum; add a derived boolean helper note
   - Activity.priority: keep the 5-value enum; add isOptional as a derived value note
   - Duration fields: keep durationMinutes / minimumDurationMinutes
   - Notes fields: keep the two-field separation (internalNotes / vendorFacingNotes)
   - Location model: keep locationId reference; document the event-flow-master
     inline approach as a display-only convenience

2. Add the 8 types that exist in event-flow-master but not yet in data-interfaces.ts:
   - ActivityStatus (7 execution states)
   - StatusExplanation (4-part explanation: why/impact/affected/recommendation)
   - HealthScore (event health summary)
   - PhotoGroup (kind/deferred/missing — richer than current GroupPhotoGroup)
   - MissingPersonImpact (options with reason/affected/delay)
   - RelationalBuffer (before/after/travel buffers per activity)
   - Person (adopting QPerson's side/group model, renamed to align with
     Participant model decision in FOUNDER_DECISIONS.md)
   - RelationshipKind (married/divorced/remarried/step/single)

3. Keep all existing types that have no conflict.
4. Add clear comments noting which types supersede earlier versions.
5. Do not create React components.
6. Do not create Supabase migrations.
7. Do not touch any other file in this session.

After updating: commit and push to KevTrowbridge/oncue. Report the final
commit hash and confirm which conflicts remain unresolved if any.
```

---

## Git Status

| Hash | Message | Location |
|---|---|---|
| `6952018` | Add Lovable design phase founder decisions to decision log | KevTrowbridge/oncue ✓ |
| `a9b0921` | Consolidate founder decisions log — make Markdown file canonical source of truth | KevTrowbridge/oncue ✓ |
| `ab63fbf` | Add confirmed visual design direction to Phase 1 Lovable prompt | KevTrowbridge/oncue ✓ |

No commits made this session. All changes are documentation only.
`event-flow-master` last commit: June 23, 2026 UTC — Lovable-generated, do not rebase.
