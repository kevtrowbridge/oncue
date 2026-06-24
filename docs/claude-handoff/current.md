# Claude Handoff — Current

**Last updated:** June 23, 2026
**Current phase:** Phase 2 complete — data-interfaces.ts updated to v3.0 for Event Setup architecture

---

## 1. Thirty-Second Summary

Phase 2 is done and the data model has been updated. OnCue now has:
- A working app scaffold (all 8 screens compilable, zero TypeScript errors, `npm run dev` starts at localhost:3000)
- `data-interfaces.ts` v3.0 — extended with 10 additions from the Event Setup architecture review

The data model is now complete enough to author the Phase 3 Supabase schema directly against these types without structural rewrites.

---

## 2. What Changed This Session

### data-interfaces.ts — Updated to v3.0

**New enum types added:**

| Type | Purpose |
|---|---|
| `PortraitLightingPreference` | 5-mode enum: Flexible / WarmLightBeforeSunset / SunsetGlow / ColorfulSkyAfterSunset / BlueHour |
| `PortraitLightingPriority` | NiceToHave / Important / Critical — governs how engine weights the lighting constraint |
| `OveragePolicy` | None / ApprovalRequired / PreApproved — governs coverage overage handling |

**New entities added:**

| Entity | Purpose |
|---|---|
| `ServiceCoverage` | Coverage window for any service role; billable minutes, hard departure, overage policy. NOT invoicing. |
| `CoverageImpact` | Computed output: how the current timeline maps against contracted coverage. Surfaced as a warning. |
| `PersonRelationship` | Connection between two Person records; `cannotBeInSamePhoto`, `mustBePhotographedTogether`. Blended family logic. |

**Fields added to existing entities:**

| Entity | New Fields |
|---|---|
| `Person` | `departureConstraintTime`, `arrivalUncertain`, `isVip`, `mobilityConcern` |
| `QuestionnairePreferences` | `portraitLightingPreference`, `portraitLightingPriority`, `totalPortraitMinutesDesired` |
| `QuestionnaireVendor` | `departureTime`, `setupDurationMinutes` |

**Separation rules codified in file header:**
- People: portrait/group photo roster
- Vendors: service providers, contact details, role visibility
- Participants: OnCue users/invitees (UserEventRole)
- These three concepts must not be collapsed.

### Phase 2 App Scaffold — Unchanged (still complete)

All 8 screens from the Lovable prototype exist as source code in `KevTrowbridge/oncue`. Zero TypeScript errors. The data layer is demo-only mock data. Phase 3 replaces it with Supabase.

---

## 3. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` after data-interfaces.ts v3.0 changes | **0 TypeScript errors** |
| `npm run dev` (Phase 2 app scaffold) | Server started at `http://localhost:8081/` in 1737ms (verified previously) |

---

## 4. Repository States

### `KevTrowbridge/oncue` — canonical repo

| Asset | Status |
|---|---|
| `CLAUDE.md` | Complete |
| `docs/FOUNDER_DECISIONS.md` | Complete — 24 sections |
| `docs/architecture/mvp-ux-architecture.md` | Complete — v3.0 |
| `docs/architecture/data-interfaces.ts` | **Complete — v3.0** (updated this session) |
| `src/styles.css` | Complete — Phase 1 |
| `src/components/brand/Logo.tsx` | Complete — Phase 1 |
| `src/components/EditorialHeader.tsx` | Complete — Phase 1 |
| `src/components/IntelligencePanel.tsx` | Complete — Phase 1 (shape mismatch deferred to Phase 4) |
| `src/components/InfoTip.tsx` | Complete — Phase 1 |
| App scaffold | **Phase 2 complete** |
| Routes (all 10) | **Phase 2 complete** |
| UI components (43) | **Phase 2 complete** |
| `src/lib/oncue-data.ts` | **Phase 2 complete** — demo data layer |
| `src/lib/questionnaire.ts` | **Phase 2 stub** — Phase 3 replaces |
| Supabase | Phase 3 |

### `kevtrowbridge/event-flow-master` — Lovable prototype

Unchanged. All 8 screens still working. Still the reference implementation.

**Constraint:** Do not force-push, rebase, or amend pushed commits. `AGENTS.md` in that repo records this requirement.

---

## 5. Known Issues — Categorized

### Phase 3 work (Supabase integration)

| Issue | Location | Notes |
|---|---|---|
| `questionnaire.ts` stub | `src/lib/questionnaire.ts` | Replace with Supabase-backed persistence |
| Demo data layer | `src/lib/oncue-data.ts` | Replace with real Supabase queries |
| Setup screen non-functional | `events.$eventId.setup.tsx` | Depends on questionnaire stub — no real save |

### Phase 4 work (intelligence engine)

| Issue | Location | Notes |
|---|---|---|
| `IntelligencePanel.tsx` shape mismatch | `src/components/IntelligencePanel.tsx` | Uses EFM `StatusExplanation` shape; canonical shape now in `data-interfaces.ts`. Resolve in Phase 4. |
| `ActivityStatus` casing | Multiple routes | EFM uses kebab-case; canonical uses PascalCase. Reconcile in Phase 4. |
| `ServiceCoverage` not wired | — | Entity defined in data-interfaces.ts; constraint engine evaluates it in Phase 4 |
| `PersonRelationship` not wired | — | Entity defined; Group Photo Optimizer reads it in Phase 4 |
| `CoverageImpact` not produced | — | Output type defined; constraint solver produces it in Phase 4 |

---

## 6. Merge Sequence

| Phase | Description | Status |
|---|---|---|
| Phase 0 | Interface reconciliation | **Complete** — commit `a5fdf43` |
| Phase 1 | Design system + brand components | **Complete** — commit `f8aba29` |
| Phase 2 | App scaffold + routes + UI components | **Complete** — commits `3f57a91`, `cd77567` |
| **Phase 2.5** | data-interfaces.ts v3.0 — Event Setup additions | **Complete — this session** |
| Phase 3 | Supabase schema and real persistence | Ready to start |
| Phase 4 | Real intelligence engine | |

---

## 7. Visible and Testable?

**App scaffold: Yes.**

Run from the oncue repo root:
```
npm run dev
```

Open: `http://localhost:3000/` (or 8081 if 3000 is taken).

The app shows the demo event dashboard. All 6 tabs (Setup, Timeline, Day-Of, People, Status, Print) navigate correctly. Data is mock/demo. Nothing is persisted.

**data-interfaces.ts changes: Not visually testable (types only).**

TypeScript check passes with zero errors. The new types and entities have no application surface until Phase 3/4 wires them to Supabase and the constraint engine.

**Note:** `bun` is not installed in this shell environment. Use `npm run dev` to start the server.

---

## 8. Founder Review

**Founder review is recommended now.**

The data model is at its most complete pre-Supabase state. Before Phase 3 schema work begins, the founder should confirm:

1. `ServiceCoverage` — does the field list (especially `excludeTravelTime`, `excludeBreaksLongerThanMinutes`, `excludeDowntimeLongerThanMinutes`) match the real coverage agreement structures they expect?
2. `PersonRelationship` — does `cannotBeInSamePhoto` / `preferredNotSamePhoto` / `mustBePhotographedTogether` cover all the blended family scenarios encountered in real weddings?
3. `PortraitLightingPreference` — are the 5 modes (Flexible, WarmLightBeforeSunset, SunsetGlow, ColorfulSkyAfterSunset, BlueHour) the right named options for the questionnaire UI?

If any of these need adjustment, now is the time — before the Phase 3 Supabase migrations are written.

---

## 9. Git Status

| Hash | Message | Location |
|---|---|---|
| `14e1dc1` | Update data-interfaces.ts to v3.0 — Event Setup architecture additions | KevTrowbridge/oncue ✓ pushed |
| `3f57a91` | Phase 2: app scaffold, all routes, UI components | KevTrowbridge/oncue ✓ pushed |
| `f8aba29` | Phase 1: copy design system and brand components to src/ | KevTrowbridge/oncue ✓ pushed |
| `a5fdf43` | Reconcile data interfaces v2.0 — resolve 7 EFM conflicts, add 11 types | KevTrowbridge/oncue ✓ |

---

## 10. Exact Successor Prompt (Phase 3)

Before beginning Phase 3, confirm the founder has:
- Created a Supabase project at supabase.com
- Has the project URL and anon key ready

```
Work only in: /Users/kevintrowbridge/SaaS Development/OnCue

Task: Phase 3 of the oncue/event-flow-master merge — Supabase schema and
real data persistence.

Read first:
- docs/claude-handoff/current.md
- docs/FOUNDER_DECISIONS.md
- docs/architecture/data-interfaces.ts (v3.0)

Phase 3 scope:
1. Design the SQL schema based on data-interfaces.ts v3.0
   (Event, Activity, Person, PersonRelationship, PhotoGroup, ServiceCoverage,
   QuestionnaireVendor, EmergencyContact, UserProfile)
2. Write and apply Supabase migrations
3. Replace src/lib/oncue-data.ts demo layer with real Supabase queries
4. Replace src/lib/questionnaire.ts stub with Supabase-backed event setup
5. Wire the Setup screen to save/load real event data

Do not:
- Modify event-flow-master
- Change the route structure or UI components
- Implement the real intelligence engine (Phase 4)
- Add auth flows yet (unless Supabase requires it for RLS)
```
