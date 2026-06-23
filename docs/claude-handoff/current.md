# Claude Handoff — Current

**Last updated:** June 22, 2026
**Current phase:** Interface reconciliation complete — ready for Phase 1 (design system migration)

---

## 1. Thirty-Second Summary

Two OnCue repositories exist. `KevTrowbridge/oncue` is the canonical repo — it now has fully reconciled TypeScript interfaces (v2.0) that resolve all 7 conflicts with `event-flow-master` and add 11 new types. `kevtrowbridge/event-flow-master` is the Lovable prototype with all 8 screens working and a production-quality design system.

The interface layer is now the single source of truth. Phase 1 (copy design system components) can begin.

---

## 2. What Changed

### This session: interface reconciliation completed

`docs/architecture/data-interfaces.ts` updated from v1.0 to v2.0.

**7 conflicts resolved:**

| # | Conflict | Resolution |
|---|---|---|
| 1 | `EventStatus` values | Kept 7-state PascalCase model; annotated EFM 4-state as subset |
| 2 | `Activity.startTime` type | Kept "HH:MM" string; annotated ISO as Supabase persistence concern |
| 3 | `Activity.anchorType` | Kept 4-value enum; documented `isAnchor` boolean as derived |
| 4 | `Activity.priority` | Kept 5-value enum; documented `isOptional` boolean as derived |
| 5 | Duration field names | Kept `durationMinutes` / `minimumDurationMinutes`; noted EFM rename on migration |
| 6 | Notes fields | Kept `internalNotes` / `vendorFacingNotes` separation; documented role-access reason |
| 7 | Location model | Kept `locationId` foreign key; documented EFM inline as display-only convenience |

**11 new exports added:**

| Export | Kind | Source |
|---|---|---|
| `ActivityStatus` | type | event-flow-master `oncue-data.ts` |
| `PersonSide` | type | event-flow-master `questionnaire.ts` (QPerson) |
| `PersonGroup` | type | event-flow-master `questionnaire.ts` |
| `RelationshipKind` | type | event-flow-master `questionnaire.ts` |
| `RelationalBuffer` | interface | event-flow-master `oncue-data.ts` |
| `StatusExplanation` | interface | event-flow-master `oncue-data.ts` |
| `HealthScore` | interface | event-flow-master `oncue-data.ts` |
| `Person` | interface | new — supersedes `GroupParticipant` |
| `PhotoGroup` | interface | event-flow-master `oncue-data.ts` |
| `MissingPersonOption` | interface | event-flow-master `oncue-data.ts` |
| `MissingPersonImpact` | interface | event-flow-master `oncue-data.ts` |

**Additional v2.0 corrections:**
- `Activity` gained `status: ActivityStatus | null` and `buffers: RelationalBuffer | null`
- `GroupParticipant` marked `@deprecated` with reference to `Person`
- `EventQuestionnaire.groupParticipants` annotated with migration note
- `UserProfile.plan` corrected from `"Free" | "Pro"` to `"Free" | "Professional" | "Studio"` (aligns with §21 approved tiers)
- Section header renamed from `WEDDING DAY MODE` to `DAY-OF MODE` (approved customer-facing language)

### Prior sessions

| Date | Work completed |
|---|---|
| June 22, 2026 | Repository audit completed — 7 conflicts identified, 8 missing types listed |
| June 22, 2026 | Founder decisions log consolidated — 24 sections, 287 lines added |
| June 22, 2026 | Visual design direction confirmed and embedded in Phase 1 Lovable prompt |
| June 21, 2026 | TypeScript data interfaces written — v1.0, 44 exports |
| June 21, 2026 | Architecture v3.0 finalized — all Section 9 decisions approved |
| June 21, 2026 | OnCue migrated from `ktrowbridge/oncue` to `KevTrowbridge/oncue` |

---

## 3. Repository States

### `KevTrowbridge/oncue` — canonical repo

| Asset | Status |
|---|---|
| `CLAUDE.md` | Complete — AI behavior rules |
| `docs/FOUNDER_DECISIONS.md` | Complete — 24 sections, all approved decisions recorded |
| `docs/architecture/mvp-ux-architecture.md` | Complete — v3.0, all 11 screens |
| `docs/architecture/data-interfaces.ts` | **Complete — v2.0, 55 exports, all conflicts resolved** |
| Application code | None |
| Supabase project | None |
| Design system | None — Phase 1 copies from event-flow-master |

### `kevtrowbridge/event-flow-master` — Lovable prototype

| Asset | Status |
|---|---|
| Design system | Production-quality — exact oklch brand tokens, Playfair Display + Inter |
| Logo component | Production-quality — circular blush background, champagne-gold ring, gold OC monogram |
| EditorialHeader | Production-quality — cream header band, dark workspace below |
| IntelligencePanel | Production-quality — 4-part format (Why/Impact/Affected/Recommended Action) |
| All 8 screens | Working — Dashboard, Setup/Questionnaire, Timeline, Day-Of, People, Status, Print & Share, Activity Detail |
| Data models | Demo-only — hardcoded mock arrays, in-memory mutation, localStorage for questionnaire |
| Intelligence engine | Demo-only — frontend heuristics labeled ⚠️ DEMO ONLY throughout |
| Supabase | None |

**Important constraint:** Do not force-push, rebase, or amend pushed commits in event-flow-master. The `AGENTS.md` file records this requirement (Lovable syncs from git history).

---

## 4. Merge Sequence

| Phase | Description | Status |
|---|---|---|
| **Phase 0** | Interface reconciliation — resolve all 7 conflicts in `data-interfaces.ts` | **Complete** |
| **Phase 1** | Design system and brand components — copy `styles.css`, `Logo.tsx`, `EditorialHeader.tsx`, `IntelligencePanel.tsx`, brand-only components to oncue | **Ready to start** |
| Phase 2 | Route structure and UI components — copy all routes and `src/components/ui/` to oncue; oncue becomes the working application repo |  |
| Phase 3 | Supabase schema and real persistence — write schema, migrations, client wiring; remove mock arrays and localStorage |  |
| Phase 4 | Real intelligence engine — real constraint solver replaces heuristic bodies in IntelligencePanel |  |

---

## 5. Risks and Concerns

| Risk | Severity | Notes |
|---|---|---|
| EFM component updates pending | Medium | When Phase 2 migrates components, 5 fields need renaming (`duration` → `durationMinutes`, etc.) and 2 boolean props need expansion to enum (`isAnchor`, `isOptional`). Tracked by conflict comments in `data-interfaces.ts`. |
| Continuing Lovable iteration after merge starts | Medium | If Lovable keeps generating into `event-flow-master` after Phase 2 migration begins, the two repos drift again. Decide the Lovable handoff point before Phase 2. |
| Intelligence engine labeled DEMO ONLY | Low | The `oncue-data.ts` engine is well-structured but uses incorrect logic. Do not treat it as a validated constraint solver. |

---

## Review Status

Visible to founder: Yes — `docs/architecture/data-interfaces.ts` in the oncue repo on GitHub
Founder review recommended: No — this was a technical documentation task; no founder decision required
Next step: Phase 1 — copy design system and brand components from event-flow-master to oncue

---

## 6. Exact Successor Prompt

Use this prompt to begin Phase 1 in the next Claude Code session:

```
Work only in: /Users/kevintrowbridge/SaaS Development/OnCue

Task: Begin Phase 1 of the oncue/event-flow-master merge — copy the
production-quality design system and brand components from event-flow-master
into the oncue repo.

Read first:
- docs/claude-handoff/current.md (operational state)
- docs/FOUNDER_DECISIONS.md §6 (UI and brand visual direction)
- docs/architecture/data-interfaces.ts (v2.0 — confirmed interface layer)

Phase 1 scope (copy only — do not rewrite):
1. src/styles.css — complete oklch design token system and global styles
2. src/components/brand/Logo.tsx — SVG logo, 3 variants (blush/obsidian/alabaster)
3. src/components/EditorialHeader.tsx — cream header band with Logo
4. src/components/IntelligencePanel.tsx — 4-part explanation panel
5. Any additional brand-only components with no data model dependencies
   (HealthCard, InfoTip if present)

Do not copy:
- Route files (Phase 2)
- Data files (oncue-data.ts, questionnaire.ts) — these are being replaced by
  the canonical data-interfaces.ts types and a future real constraint engine
- Supabase client or auth files (Phase 3)

After copying:
- Verify the oncue repo has a working src/ structure to receive these files
- If oncue has no src/ directory, create the minimal scaffold needed to hold
  the design system files (package.json, tsconfig, etc.)
- Commit and push to KevTrowbridge/oncue
- Report the commit hash
```

---

## 7. Git Status

| Hash | Message | Location |
|---|---|---|
| `[this session — see below]` | Reconcile data interfaces v2.0 | KevTrowbridge/oncue ✓ |
| `6952018` | Add Lovable design phase founder decisions to decision log | KevTrowbridge/oncue ✓ |
| `a9b0921` | Consolidate founder decisions log — make Markdown file canonical source of truth | KevTrowbridge/oncue ✓ |
| `ab63fbf` | Add confirmed visual design direction to Phase 1 Lovable prompt | KevTrowbridge/oncue ✓ |
