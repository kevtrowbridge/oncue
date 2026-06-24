# Claude Handoff — Current

**Last updated:** June 23, 2026
**Current phase:** Phase 2.7 complete — Founder Review Polish Pass

---

## 1. Thirty-Second Summary

Phase 2.7 is done. All founder-identified polish items have been addressed across Timeline, Status, People, and Print & Share. Zero TypeScript errors. Committed as `b8db357` and pushed to `origin/main`.

---

## 2. What Changed in Phase 2.7

### People tab order (`events.$eventId.people.tsx`)
- Default tab changed from `"groups"` to `"roster"`
- Tab order reordered: People Roster → Vendors → Photo Groups (was: Photo Groups → People Roster → Vendors)

### Language standardization (Timeline + Status)
- "Needs Adjustment" legend label → "Needs Attention"
- Attention banner: "issues need attention" → "activities need attention"
- Intelligence Strip header: "Issues — X activities" → "Needs Attention — X activities"
- Status page: "Conflicts" section is now a compact "Needs Attention" row
- "Conflict" is reserved exclusively for true scheduling conflicts (overlap, impossible travel, double-booked)

### Timeline interaction discoverability (`events.$eventId.timeline.tsx`)
- Added "Click to select · Double-click to edit" hint in the toolbar legend area
- Selected Gantt row: `border-l-2 border-l-gold bg-secondary/60` (gold left border on selection)
- Unselected rows: `border-l-2 border-l-transparent` (consistent spacing)
- "Open & Edit Activity" link → `bg-gradient-gold text-primary-foreground shadow-gold` (primary gold button)
- "Update Remaining Timeline" button → `border border-border` outline style (secondary)

### Status page (`events.$eventId.status.tsx`) — complete rewrite
- New `CollapsiblePanel` and `StatCard` components
- "Schedule Conflicts" stat card links to Timeline when conflicts > 0
- Compact "Needs Attention" row: count + "Review in Timeline →" gold button + issue pills
- Issue pills link directly to Timeline, not to Status sections
- No issue list duplicated from Timeline — "Use Timeline to view and resolve issues" is the instruction
- Side-by-side collapsible panels: Vendor Acknowledgements | Recent Changes
- Master Checklist in collapsible panel with All / Open / Done filter controls
- All panels open by default

### Print & Share — full rewrite (`events.$eventId.print.tsx`)

**Task 5 — Permissions model:**
- Replaced `invited: Set<string>` / Invite/Uninvite toggle with `permissions: Record<string, PermissionLevel>` state
- `PermissionLevel`: `"view-only" | "acknowledge" | "suggest-changes" | "request-changes" | "full-edit" | "co-owner"`
- Defaults by role: Planner → full-edit, DJ → acknowledge, Couple → suggest-changes, Catering → view-only, Videographer → view-only
- Each participant row shows a `<Select>` dropdown for their permission level
- Permission level descriptions shown below the participant list
- Clearly marked: Prototype — not active in Phase 2

**Task 6 — Branding:**
- Footer changed from "Elegant. Refined. Intelligent." / "OnCue is Timeline Intelligence."
- → "Generated with OnCue" / "oncue.day"

**Task 7 — Offline backup strategy:**
- Added "What to include in this print / export" collapsible section (above the print article)
- Six section checkboxes with defaults:
  - Day-of Timeline ✓ ON
  - Master Checklist ✓ ON
  - Family / Photo Groups ☐ OFF
  - People List ☐ OFF
  - Vendor Contacts ✓ ON
  - Emergency Contacts ☐ OFF
- Print article conditionally renders each section based on checkbox state
- Sections implemented: Day-of Timeline, Master Checklist, Photo Groups (from `generatePhotoGroups`), People List (demo), Vendor Contacts (demo), Emergency Contacts (demo)
- `getMasterChecklist` and `generatePhotoGroups` imported from `oncue-data`
- Consistent section headers and offline-backup-quality table formatting
- Demo data rows labeled ⚠️ DEMO ONLY

### FOUNDER_DECISIONS.md — Task 8
- Added brief note under §8 that Event Setup is professional-facing and that Couple Intake is a separate future surface (see §28)
- §28 Couple Intake View formally documented as a dedicated section (see §6 of this handoff for all five new decisions)

---

## 3. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` after all Phase 2.7 changes | **0 TypeScript errors** |
| `npm run dev` state | App was running at http://localhost:8082/ as of Phase 2.6 — not re-launched in this session (no code changes require restart for hot reload) |

---

## 4. Visible and Testable?

**Yes — after `npm run dev`.**

Open:
```
http://localhost:8082/
```

Navigate to any event, then inspect:

1. **Timeline** — Toolbar shows "Click to select · Double-click to edit". Click any row to see gold left border on the selected row. "Open & Edit Activity" is now a gold primary button. "Update Remaining Timeline" is an outline button.

2. **People** — Opens to "People Roster" tab by default. Tabs are ordered: People Roster → Vendors → Photo Groups.

3. **Status** — Compact command center. "Needs Attention" row with count + "Review in Timeline →" button. Vendor Acks and Recent Changes side by side (collapsible). Master Checklist with filter controls.

4. **Print & Share** — "With People" tab now has per-participant permission level dropdowns (View Only through Co-Owner). "What to include" section has six checkboxes — toggle them and the print document updates immediately. Footer now shows "Generated with OnCue · oncue.day".

---

## 5. Repository Status

| File | Status |
|---|---|
| `src/routes/events.$eventId.timeline.tsx` | Updated — Phase 2.7 polish |
| `src/routes/events.$eventId.people.tsx` | Updated — Phase 2.7 tab order |
| `src/routes/events.$eventId.status.tsx` | Updated — Phase 2.7 full rewrite (compact command center) |
| `src/routes/events.$eventId.print.tsx` | Updated — Phase 2.7 full rewrite (permissions, branding, offline backup) |
| `docs/FOUNDER_DECISIONS.md` | Updated — §25–§29 new architectural decisions added; Last updated date corrected |
| `docs/claude-handoff/current.md` | This file |
| `docs/claude-handoff/archive/2026-06-23-2000-phase-2-6-ui-refinement-complete.md` | Archived before this update |

**Git status:** Phase 2.7 committed as `b8db357` and pushed to `origin/main`.

---

## 6. Founder Decisions Logged (June 23, 2026)

### Architectural decisions — `docs/FOUNDER_DECISIONS.md`

Five new architectural decisions were formally recorded following founder review. Documentation-only — no application code was changed.

| Section | Decision |
|---|---|
| §25 Timeline Architecture | Timeline defaults to Event Timeline. Users switch between Event Timeline, My Timeline, and Role Timelines. Event Timeline is always the source of truth. Individual timelines are filtered views — not separate schedules. |
| §26 Role-Based Visibility | Event types define terminology and templates only — not architecture. Wedding and corporate roles are templates. Visibility and notifications derive from role and activity involvement. |
| §27 Notification Intelligence | Recalculation and notifications are separate systems. Timeline Intelligence recalculates aggressively. Notification Intelligence must be conservative. Family and guests receive only information directly relevant to them. |
| §28 Couple Intake View | Formally documented as roadmap — not for MVP or Phase 2. Separate surface from professional Event Setup. Must be designed independently. |
| §29 Export Strategy | PDF primary → CSV first universal format → XLSX multi-sheet workbook → Google Sheets deferred. Build in this order. |

### Workflow rule — `CLAUDE.md`

The **Low-Risk Approval Standard** was added to `CLAUDE.md`. Effective immediately for all OnCue sessions.

- **Proceed without asking:** reading files, editing project files, creating source/docs files, `npm install`, `npm run dev`, `npx tsc --noEmit`, `git status/diff/log`, local commits, archiving `current.md`
- **Always ask first:** `git push`, deleting files, destructive git commands, database migrations, Supabase production changes, secrets/auth/billing/env changes, anything outside the OnCue folder
- **Decision rule:** local + reversible via Git + inside OnCue folder → proceed. Destructive, external, production-facing, or hard to reverse → ask first.

---

## 7. Known Issues

### Phase 3 work (Supabase — do not start yet)
- All event data is still demo/mock arrays in `oncue-data.ts` — lost on reload
- `questionnaire.ts` is still a stub — Setup screen saves nothing
- Sharing, permissions, and acknowledgements are prototype-only; require real auth

### Phase 4 work (intelligence engine — deferred)
- Coverage Policy and Portrait Preferences fields captured but not wired to constraint engine
- Person and vendor constraint fields captured but not evaluated
- `IntelligencePanel` shape mismatch with EFM `StatusExplanation` — deferred to Phase 4
- `ActivityStatus` casing reconciliation (kebab-case vs PascalCase) — deferred to Phase 4

### Future architecture risks (from §25–§27 decisions)
- Multi-timeline mode switching (Event Timeline / My Timeline / Role Timelines) is not yet reflected in the UI — the current Timeline screen only shows one view. This is expected for Phase 2; design for mode switching in Phase 3 or Phase 4.
- Notification Intelligence requires a separate system distinct from Timeline recalculation — this separation must be enforced when the notification layer is built. No notification code exists yet; do not conflate with timeline update logic.
- Role-based visibility is currently approximated via demo filter arrays (e.g., `ownerRole` filtering in Print). Real role-derived visibility requires Supabase activity relationships in Phase 3.

---

## 8. Merge Sequence

| Phase | Description | Status |
|---|---|---|
| Phase 0 | Interface reconciliation | Complete — `a5fdf43` |
| Phase 1 | Design system + brand components | Complete — `f8aba29` |
| Phase 2 | App scaffold + routes + UI components | Complete — `3f57a91`, `cd77567` |
| Phase 2.5 | data-interfaces.ts v3.0 | Complete — `14e1dc1` |
| Phase 2.6 | UI refinement pass — all 7 screens | Complete — `23016da` |
| **Phase 2.7** | Founder review polish pass | **Complete — `b8db357` — pushed** |
| Phase 3 | Supabase schema and real persistence | Next (requires founder Supabase project) |
| Phase 4 | Real intelligence engine | After Phase 3 |

---

## 9. Next Step

Phase 2.7 is pushed. Phase 3 is next.

**Phase 3 cannot begin until the founder provides:**
- Supabase project URL
- Supabase anon key

Create the project at supabase.com, then share both values to start Phase 3.

**Before beginning Phase 3, confirm:**
- Supabase project created at supabase.com
- Project URL and anon key ready

**Phase 3 prompt (after push confirmed):**
```
Work only in: /Users/kevintrowbridge/SaaS Development/OnCue

Task: Phase 3 — Supabase schema and real data persistence.

Read first:
- docs/claude-handoff/current.md
- docs/FOUNDER_DECISIONS.md
- src/lib/data-interfaces.ts

Phase 3 scope:
1. Design the SQL schema based on data-interfaces.ts v3.0
2. Write and apply Supabase migrations
3. Replace src/lib/oncue-data.ts demo layer with real Supabase queries
4. Replace src/lib/questionnaire.ts stub with Supabase-backed event setup
5. Wire the Setup screen to save/load real event data

Do not:
- Modify event-flow-master
- Change the route structure or core UI components
- Implement the real intelligence engine (Phase 4)
- Begin without the founder's Supabase project URL and anon key
```
