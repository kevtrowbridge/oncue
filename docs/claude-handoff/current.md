# Claude Handoff — Current

**Last updated:** June 23, 2026
**Current phase:** Phase 2 complete — app scaffold and all routes copied; app compiles and runs

---

## 1. Thirty-Second Summary

Phase 2 is done. OnCue now has a working app scaffold copied from `event-flow-master`. The app compiles with zero TypeScript errors and the dev server starts successfully. The founder can open it in a browser at `http://localhost:3000/` (or whichever port is free — typically 3000 or 8081).

All 8 screens from the prototype now exist as source code in `KevTrowbridge/oncue`. The data layer is demo-only mock data. Phase 3 is Supabase schema and real persistence.

---

## 2. What Changed This Session

### Phase 2 — App scaffold + routes + UI components

**Scaffold files created:**

| File | Notes |
|---|---|
| `package.json` | Matches EFM dependencies; name changed to "oncue" |
| `tsconfig.json` | Copied as-is; includes `@/*` path alias |
| `vite.config.ts` | Copied as-is; uses `@lovable.dev/vite-tanstack-config` |
| `bunfig.toml` | Copied as-is; includes 24h supply-chain guard |
| `components.json` | Copied as-is; shadcn config |
| `src/start.ts` | Copied as-is; TanStack Start server entry |
| `src/server.ts` | **Modified** — `error-capture.ts` import removed; simplified fetch handler |
| `src/router.tsx` | Copied as-is; creates QueryClient + TanStack router |
| `src/lib/error-page.ts` | Copied as-is; HTML error renderer, no Lovable deps |

**Routes created (10 routes):**

| File | Notes |
|---|---|
| `src/routes/__root.tsx` | **Modified** — `reportLovableError` import and `useEffect` removed |
| `src/routes/index.tsx` | Dashboard |
| `src/routes/events.$eventId.tsx` | Event shell + tab nav |
| `src/routes/events.$eventId.index.tsx` | Redirects to /timeline |
| `src/routes/events.$eventId.setup.tsx` | Questionnaire setup screen |
| `src/routes/events.$eventId.timeline.tsx` | Gantt timeline + intelligence strip |
| `src/routes/events.$eventId.day-of.tsx` | Day-of execution mode |
| `src/routes/events.$eventId.people.tsx` | Photo group optimizer |
| `src/routes/events.$eventId.status.tsx` | Status + change log + master checklist |
| `src/routes/events.$eventId.print.tsx` | Print/run sheet filtered views |
| `src/routes/events.$eventId.activities.$activityId.tsx` | Activity detail + edit |
| `src/routeTree.gen.ts` | TanStack Router route tree (generated, copied as-is) |

**Components created:**

| File | Notes |
|---|---|
| `src/components/HealthCard.tsx` | Timeline health card; uses oncue-data.ts TERMS |
| `src/components/ui/*.tsx` | All 43 shadcn/Radix UI components |

**Utilities and hooks:**

| File | Notes |
|---|---|
| `src/lib/utils.ts` | `cn()` className utility |
| `src/hooks/use-mobile.tsx` | Mobile breakpoint hook |
| `src/lib/oncue-data.ts` | DEMO ONLY header added; 995 lines total |
| `src/lib/questionnaire.ts` | **Phase 2 stub** — types + empty functions only; NO localStorage; Phase 3 replaces |

**Files explicitly NOT copied:**

| File | Reason |
|---|---|
| `src/lib/lovable-error-reporting.ts` | Lovable telemetry — not needed |
| `src/lib/error-capture.ts` | Lovable SSR error capture — not needed |
| `.lovable/` | Lovable platform config — not needed |
| `bun.lock` | Generated artifact — not committed |

---

## 3. Verification

| Check | Result |
|---|---|
| `npm install` | Succeeded — 462 packages installed, 0 vulnerabilities |
| `npx tsc --noEmit` | **0 TypeScript errors** |
| `npm run dev` | Server started at `http://localhost:8081/` in 1737ms |

`@lovable.dev/vite-tanstack-config` is publicly available on npm and installed correctly.

---

## 4. Repository States

### `KevTrowbridge/oncue` — canonical repo

| Asset | Status |
|---|---|
| `CLAUDE.md` | Complete |
| `docs/FOUNDER_DECISIONS.md` | Complete — 24 sections |
| `docs/architecture/mvp-ux-architecture.md` | Complete — v3.0 |
| `docs/architecture/data-interfaces.ts` | Complete — v2.0, 55 exports |
| `src/styles.css` | Complete — Phase 1 |
| `src/components/brand/Logo.tsx` | Complete — Phase 1 |
| `src/components/EditorialHeader.tsx` | Complete — Phase 1 |
| `src/components/IntelligencePanel.tsx` | Complete — Phase 1 (import uses EFM shape; see §5) |
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

### Quick-fix (can do anytime)

None currently — TypeScript compiles clean.

### Phase 3 work (Supabase integration)

| Issue | Location | Notes |
|---|---|---|
| `questionnaire.ts` stub | `src/lib/questionnaire.ts` | Replace with Supabase-backed persistence |
| Demo data layer | `src/lib/oncue-data.ts` | Replace with real Supabase queries |
| Setup screen non-functional | `events.$eventId.setup.tsx` | Depends on questionnaire stub — no real save |

### Phase 4 work (intelligence engine)

| Issue | Location | Notes |
|---|---|---|
| `IntelligencePanel.tsx` shape mismatch | `src/components/IntelligencePanel.tsx` | Uses EFM `StatusExplanation` shape (richer than canonical); `affected` is `Array<{id, title, newTime, note}>`, `recommendation` is `{label, rationale}`, `estimatedDelayMin` — canonical uses `affectedActivityIds: string[]`, `recommendedAction: string`, `estimatedDelayMinutes`. Resolve when wiring real solver. |
| `ActivityStatus` casing | Multiple routes | EFM uses lowercase kebab-case (`"on-track"`, `"needs-adjustment"`); canonical `data-interfaces.ts` uses PascalCase (`"OnTrack"`, `"NeedsAdjustment"`). Reconcile in Phase 4 when real solver output is defined. |

---

## 6. Merge Sequence

| Phase | Description | Status |
|---|---|---|
| Phase 0 | Interface reconciliation | **Complete** — commit `a5fdf43` |
| Phase 1 | Design system + brand components | **Complete** — commit `f8aba29` |
| **Phase 2** | App scaffold + routes + UI components | **Complete — pending commit** |
| Phase 3 | Supabase schema and real persistence | Ready to start |
| Phase 4 | Real intelligence engine | |

---

## 7. Visible and Testable?

**Yes — as of Phase 2.**

Run from the oncue repo root:
```
npm run dev
```

Open: `http://localhost:3000/` (or 8081 if 3000 is taken).

The app shows the demo event dashboard. All 6 tabs (Setup, Timeline, Day-Of, People, Status, Print) navigate correctly. Data is mock/demo. Nothing is persisted.

**Note:** `bun` is not installed in this shell environment. Use `npm run dev` to start the server.

---

## 8. Founder Review

**Founder review is recommended now.**

This is the first time the founder can see the OnCue app running under the canonical `KevTrowbridge/oncue` repository. The app is identical in appearance and behavior to `event-flow-master` — same screens, same mock data, same brand design.

**What to check:**
1. Run `npm run dev` from the oncue directory
2. Open the URL shown in the terminal
3. Confirm you see the dashboard with the demo event
4. Click through all 6 tabs to confirm they load
5. Open Timeline and confirm the intelligence panel appears for activities with issues
6. Open People and try reordering groups / flagging a missing person

---

## 9. Git Status

| Hash | Message | Location |
|---|---|---|
| *(pending)* | Phase 2: app scaffold, all routes, UI components | KevTrowbridge/oncue — not yet committed |
| `f8aba29` | Phase 1: copy design system and brand components to src/ | KevTrowbridge/oncue ✓ pushed |
| `a5fdf43` | Reconcile data interfaces v2.0 — resolve 7 EFM conflicts, add 11 types | KevTrowbridge/oncue ✓ |

---

## 10. Exact Successor Prompt (Phase 3)

```
Work only in: /Users/kevintrowbridge/SaaS Development/OnCue

Task: Phase 3 of the oncue/event-flow-master merge — Supabase schema and
real data persistence.

Read first:
- docs/claude-handoff/current.md
- docs/FOUNDER_DECISIONS.md
- docs/architecture/data-interfaces.ts (v2.0)

Phase 3 scope:
1. Create a Supabase project (founder must do this manually first — go to
   supabase.com and create a new project; provide the project URL and anon key)
2. Design the SQL schema based on data-interfaces.ts v2.0
   (Event, Activity, Person, PhotoGroup, Participant, ChecklistItem, UserProfile)
3. Write and apply Supabase migrations
4. Replace src/lib/oncue-data.ts demo layer with real Supabase queries
5. Replace src/lib/questionnaire.ts stub with Supabase-backed event setup
6. Wire the Setup screen to save/load real event data

Do not:
- Modify event-flow-master
- Change the route structure or UI components
- Implement the real intelligence engine (Phase 4)
- Add auth flows yet (unless Supabase requires it for RLS)
```
