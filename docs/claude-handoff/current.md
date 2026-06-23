# Claude Handoff — Current

**Last updated:** June 22, 2026
**Current phase:** Phase 1 complete — design system and brand components copied to oncue

---

## 1. Thirty-Second Summary

Phase 1 is done. The production-quality design system from `event-flow-master` — the brand token CSS, the SVG logo, the editorial cream header, the intelligence panel, and the tooltip component — now live in `KevTrowbridge/oncue` under `src/`.

The components are **written and committed** but **not yet visible or testable**. Oncue still has no app scaffold (no `package.json`, no router, no HTML entry point). Phase 2 will create that scaffold and copy the route files, at which point the app can run.

---

## 2. What Changed

### This session: Phase 1 complete

**5 files created in `src/`:**

| File | Description |
|---|---|
| `src/styles.css` | Complete OnCue brand system — oklch color tokens, Playfair Display + Inter fonts, dark workspace defaults, editorial cream header class, status utilities |
| `src/components/brand/Logo.tsx` | SVG logo mark — circular blush fill, champagne-gold ring, gold OC monogram. Three variants: blush (default), obsidian, alabaster. Includes `Wordmark` export. |
| `src/components/EditorialHeader.tsx` | Cream header band — compact and full modes, slots for center content and right actions. Imports `@tanstack/react-router` Link (router dep; resolved in Phase 2). |
| `src/components/IntelligencePanel.tsx` | 4-part intelligence explanation panel — Why / Impact / Affected Activities / Recommended Action. Collapsible. Status-toned styling. |
| `src/components/InfoTip.tsx` | Accessible tooltip for plain-language intelligence term explanations. No data dependencies. |

**1 file excluded:**

| File | Reason |
|---|---|
| `src/components/HealthCard.tsx` | Imports `TERMS` (a runtime constant) from `@/lib/oncue-data`. Data dependency; cannot copy without oncue-data.ts which is excluded by rule. |

**No files modified** in existing oncue structure.

### Prior sessions

| Date | Work completed |
|---|---|
| June 22, 2026 | Phase 0: data-interfaces.ts v2.0 — all 7 EFM conflicts resolved, 11 types added |
| June 22, 2026 | Repository audit completed — 7 conflicts identified, 8 missing types listed |
| June 22, 2026 | Founder decisions log consolidated — 24 sections, 287 lines added |
| June 21, 2026 | TypeScript data interfaces written — v1.0, 44 exports |
| June 21, 2026 | Architecture v3.0 finalized — all Section 9 decisions approved |

---

## 3. Repository States

### `KevTrowbridge/oncue` — canonical repo

| Asset | Status |
|---|---|
| `CLAUDE.md` | Complete |
| `docs/FOUNDER_DECISIONS.md` | Complete — 24 sections |
| `docs/architecture/mvp-ux-architecture.md` | Complete — v3.0 |
| `docs/architecture/data-interfaces.ts` | Complete — v2.0, 55 exports |
| `src/styles.css` | **Phase 1 complete** — brand token system |
| `src/components/brand/Logo.tsx` | **Phase 1 complete** — locked brand mark |
| `src/components/EditorialHeader.tsx` | **Phase 1 complete** — cream header |
| `src/components/IntelligencePanel.tsx` | **Phase 1 complete** — pending import fix (see §5) |
| `src/components/InfoTip.tsx` | **Phase 1 complete** — no pending issues |
| App scaffold (`package.json`, router, HTML) | **None — Phase 2** |
| Route files | **None — Phase 2** |
| Supabase | **None — Phase 3** |

### `kevtrowbridge/event-flow-master` — Lovable prototype

Unchanged. All 8 screens still working. Still the reference implementation.

**Constraint:** Do not force-push, rebase, or amend pushed commits. `AGENTS.md` in that repo records this requirement.

---

## 4. Merge Sequence

| Phase | Description | Status |
|---|---|---|
| Phase 0 | Interface reconciliation | **Complete** — commit `a5fdf43` |
| Phase 1 | Design system + brand components | **Complete** — commit `[this session]` |
| **Phase 2** | App scaffold + routes + UI components | **Ready to start** |
| Phase 3 | Supabase schema and real persistence | |
| Phase 4 | Real intelligence engine | |

---

## 5. Unresolved Dependencies (Phase 2 work)

| Component | Pending issue |
|---|---|
| `IntelligencePanel.tsx` | Imports `StatusExplanation` from `@/lib/oncue-data` (path won't resolve without app scaffold). In Phase 2: update import to canonical `data-interfaces.ts`. **Also:** the EFM `StatusExplanation` shape is richer than the canonical definition — `affected` is `Array<{id, title, newTime, note}>` (not `string[]`) and `recommendation` is `{label, rationale}` (not `string`). Resolve the shape mismatch before wiring. |
| `EditorialHeader.tsx` | Imports `Link` from `@tanstack/react-router`. Requires `@tanstack/react-router` in `package.json`. Resolved when Phase 2 creates the app scaffold using the same TanStack Start template. |
| `HealthCard.tsx` | **Excluded from Phase 1.** Imports `TERMS` runtime constant from `oncue-data.ts`. Copy in Phase 2 after the real constraint engine data layer is established and `HealthCard` is refactored to use canonical types. |

---

## 6. Visible and Testable?

**Not yet.** The components exist as source files in `src/`. There is no `package.json`, no bundler, no HTML entry point, and no router in oncue. The files cannot be run or previewed until Phase 2 creates the app scaffold.

The founder **cannot** open a browser and see the design system yet.

---

## 7. Founder Review

**Founder review is not required now.** Phase 1 is a source-file copy, not a product change. The design system is unchanged from what already works in `event-flow-master`.

**Recommended founder action:** Confirm Phase 2 should proceed. Phase 2 involves creating a real app scaffold in oncue (package.json, router, entry point) and copying all route files from event-flow-master. At that point oncue will run as a real app and the founder will be able to open it in a browser.

---

## 8. Exact Successor Prompt

Use this prompt to begin Phase 2:

```
Work only in: /Users/kevintrowbridge/SaaS Development/OnCue

Task: Phase 2 of the oncue/event-flow-master merge — create the app scaffold
and copy all route and UI component files from event-flow-master to oncue.

Read first:
- docs/claude-handoff/current.md
- docs/FOUNDER_DECISIONS.md
- docs/architecture/data-interfaces.ts (v2.0)

Phase 2 scope:
1. Create the minimal app scaffold in oncue so it can run:
   - package.json (matching event-flow-master's dependencies — TanStack Start,
     React 19, Tailwind 4, Radix UI, Vite 8)
   - tsconfig.json
   - vite.config.ts
   - src/start.ts / src/server.ts / src/router.tsx (entry points)
   - src/routes/__root.tsx (includes font loading)

2. Copy all route files from event-flow-master:
   - src/routes/index.tsx (Dashboard)
   - src/routes/events.$eventId.tsx (event shell)
   - src/routes/events.$eventId.index.tsx
   - src/routes/events.$eventId.setup.tsx
   - src/routes/events.$eventId.timeline.tsx
   - src/routes/events.$eventId.day-of.tsx
   - src/routes/events.$eventId.people.tsx
   - src/routes/events.$eventId.status.tsx
   - src/routes/events.$eventId.print.tsx
   - src/routes/events.$eventId.activities.$activityId.tsx
   - src/routeTree.gen.ts

3. Copy src/components/ui/ (all Radix/shadcn components)

4. Copy src/lib/utils.ts (className utility only — NOT oncue-data.ts or questionnaire.ts)

5. Copy src/hooks/use-mobile.tsx

6. Copy src/lib/oncue-data.ts WITH a clear header comment:
   ⚠️ DEMO ONLY — all data is hardcoded mock arrays and frontend heuristics.
   This file is the placeholder intelligence engine. It will be replaced in
   Phase 4 by a real constraint solver. Do not treat this as production logic.

   Rationale: the routes depend on oncue-data.ts to render at all. We need
   the app to run before we can replace the data layer.

After Phase 2:
- Run `bun install` and `bun dev` to verify the app starts
- Confirm the founder can open the app in a browser
- Note any TypeScript errors that need resolving (expected: IntelligencePanel
  import path, status value casing mismatches)
- Commit and push to KevTrowbridge/oncue
- Report the commit hash

Do not:
- Copy questionnaire.ts (localStorage placeholder — replace in Phase 3)
- Copy .lovable/ directory
- Copy Lovable error reporting files (lovable-error-reporting.ts, error-capture.ts)
- Force-push, rebase, or amend any commits in event-flow-master
```

---

## 9. Git Status

| Hash | Message | Location |
|---|---|---|
| `[this session]` | Phase 1: copy design system and brand components to src/ | KevTrowbridge/oncue ✓ pushed |
| `a5fdf43` | Reconcile data interfaces v2.0 — resolve 7 EFM conflicts, add 11 types | KevTrowbridge/oncue ✓ |
| `6952018` | Add Lovable design phase founder decisions to decision log | KevTrowbridge/oncue ✓ |
| `a9b0921` | Consolidate founder decisions log — make Markdown file canonical source of truth | KevTrowbridge/oncue ✓ |
