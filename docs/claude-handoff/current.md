# Claude Handoff — Current

**Last updated:** June 23, 2026
**Current phase:** Phase 2.6 complete — UI refinement pass across all 7 screens

---

## 1. Thirty-Second Summary

Phase 2.6 is done. All 7 screens have been refined based on the founder's browser review. Zero TypeScript errors. App compiles and runs.

---

## 2. What Changed This Session

### questionnaire.ts — Updated to v3.0

New types: `QCoverage`, `QPortrait`, `OvertimePolicy`, `PortraitLightingPreference`, `PortraitLightingPriority`

New optional fields on:
- `QPerson`: `departureConstraintTime`, `arrivalUncertain`, `isVip`, `mobilityConcern`
- `QVendor`: `departureTime`, `setupDurationMinutes`
- `QRelationship`: `personAName`, `personBName`, `cannotBeInSamePhoto`, `mustBePhotographedTogether`

New constants: `PORTRAIT_LIGHTING_OPTIONS`

`Questionnaire` interface extended with `coverage: QCoverage` and `portrait: QPortrait` fields.

---

### Screen-by-screen changes

**Timeline (`events.$eventId.timeline.tsx`)**
- Added amber attention banner ABOVE the Gantt when any issues exist — always above the fold
- Banner shows issue count + pill buttons for top 3 issues (click to select)
- Banner has "see all issues below" scroll link to the Intelligence Strip
- HealthCard now receives `onSelectActivity` — clicking an issue card in the right rail selects that activity
- Intelligence Strip anchored with `id="issues-strip"` and scroll ref

**HealthCard (`src/components/HealthCard.tsx`)**
- Fixed layout: removed `md:grid-cols-3` (caused text overflow in 380px rail)
- Now uses `space-y-5` stacked vertical layout — Issues / Protected / Recommended
- Issues section shown first (highest priority)
- Each issue item is now a clickable button (calls `onSelectActivity` prop)
- Shows "+N more — scroll to Issues below" hint when issues exceed 4
- New optional prop: `onSelectActivity?: (id: string) => void`

**Activity Detail (`events.$eventId.activities.$activityId.tsx`)**
- `form.dependencies` changed from comma-joined string to `string[]`
- `save()` now passes the array directly (no more `.split(",").map().filter()`)
- Replaced the "Dependencies (comma-separated activity IDs)" text input with `DependencyPicker` component
- `DependencyPicker`: scrollable checklist of all other activities, shows title + start time, shows selected names summary below

**People (`events.$eventId.people.tsx`)**
- Page renamed from "Photo Groups" to "People & Vendors"
- Three-tab selector: Photo Groups · People Roster · Vendors
- **People Roster tab**: table view of 12 demo people with name, role, side chip, group, departure time, VIP badge
- **Vendors tab**: table view of 6 demo vendors with role chip, name, arrival/departure times, setup duration
- **Photo Groups tab**: all existing optimizer content (reorder, defer, merge, split, missing person) — unchanged
- Demo data labeled ⚠️ DEMO ONLY

**Status (`events.$eventId.status.tsx`)**
- All 4 stat cards are now clickable buttons with `onClick={() => scrollTo(ref)}`
- "Critical complete" renamed to "Key Milestones Done"
- Stat cards highlight in amber when alert condition is true (conflicts > 0, pending acks > 0, critical not done)
- Conflicts alert callout added between stat cards and change log (only shown when conflicts exist)
- Change Log and Vendor Acknowledgements moved ABOVE Master Checklist (now immediately after stat cards)
- Vendor Acknowledgements stat now shows its own count

**Print & Share (`events.$eventId.print.tsx`)**
- Added Share panel between view filters and print sheet
- Share Link tab: read-only link, Copy Link button, Email/SMS/Share… action buttons
- With People tab: participant list with Invite/Uninvite toggle per person
- All share controls labeled ⚠️ Demo — not wired to real auth

**Event Setup (`events.$eventId.setup.tsx`)**
- Header renamed from "Questionnaire" to "Event Setup"
- All sections are now collapsible — click header to expand/collapse
- Basics and Coverage open by default; all others collapsed
- **Coverage Policy section** (NEW): start/end time, billable hours, latest departure, overtime policy, max overtime hours — labeled PROTOTYPE
- **Portrait Preferences section** (NEW): lighting preference dropdown (5 options with descriptions), priority, total minutes — labeled PROTOTYPE
- People section enhanced: each person row has departure constraint time, VIP, arrival uncertain, and mobility concern checkboxes
- Vendors section enhanced: each vendor row has departure time and setup duration fields (labeled NEW)
- Relationships section enhanced: PersonA/PersonB name inputs (with datalist autocomplete from People list), "Never in same photo" and "Must appear together" checkboxes
- Section order: Basics → Coverage → Portrait → Locations → People → Vendors → Relationships → Photo Requests → Priorities → Notes
- `computeCompletion` updated to include coverage fields

---

## 3. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` after all changes | **0 TypeScript errors** |
| `npm run dev` | **Started at http://localhost:8082/** (3000 and 8081 in use) |
| App responds to HTTP | **200 OK** |

---

## 4. Visible and Testable?

**Yes.** The app is running. Open:

```
http://localhost:8082/
```

Navigate to any event → check each tab. All 7 screens have been updated.

**What to inspect specifically:**

1. **Timeline** — Issues amber banner above the Gantt; click any issue pill to select that activity in the right rail; click "see all issues below" to scroll to intelligence strip. Click issues in the HealthCard (right rail).

2. **Activity Detail** — Open any activity from the timeline (double-click a bar or click "Open & Edit"). The Dependencies field is now a scrollable checklist of activity names, not raw IDs.

3. **People** — Tab selector at top. Switch to "People Roster" to see the demo table. Switch to "Vendors" to see the demo vendor table. "Photo Groups" tab has all the existing optimizer.

4. **Status** — All 4 stat cards are clickable and scroll to their section. "Critical complete" is now "Key Milestones Done". Change Log and Vendor Acks appear before the Master Checklist.

5. **Print & Share** — Share panel appears between the view filters and the print sheet. Test Copy Link, Email, SMS buttons. Switch to "With People" tab to see participant invite list.

6. **Event Setup** — All sections are now collapsible. Coverage Policy and Portrait Preferences sections are new (both labeled PROTOTYPE). In the People section, expand any person row to see departure time, VIP, arrival uncertain, mobility fields. Vendors now have departure time and setup duration. Relationships now have Person A / Person B name inputs and constraint checkboxes.

7. **Day-Of** — Unchanged. "View Details" links to activity detail (confirmed working).

---

## 5. Repository Status

| Asset | Status |
|---|---|
| `src/components/HealthCard.tsx` | Updated — v2.6 layout fix + onSelectActivity prop |
| `src/lib/questionnaire.ts` | Updated — v3.0 types, QCoverage, QPortrait, new optional fields |
| `src/routes/events.$eventId.timeline.tsx` | Updated — attention banner, HealthCard integration |
| `src/routes/events.$eventId.activities.$activityId.tsx` | Updated — DependencyPicker replaces raw IDs |
| `src/routes/events.$eventId.people.tsx` | Updated — three-tab layout with Roster and Vendors |
| `src/routes/events.$eventId.status.tsx` | Updated — actionable stat cards, sections restructured |
| `src/routes/events.$eventId.print.tsx` | Updated — Share panel added |
| `src/routes/events.$eventId.setup.tsx` | Updated — collapsible sections, Coverage + Portrait cards |

**Git status:** All 8 files modified, not yet committed. `questionnaire.ts` change is local.

---

## 6. Known Issues — Categorized

### Phase 3 work (Supabase)
- `questionnaire.ts` is still a stub — all event setup data is lost on page reload
- `oncue-data.ts` demo data layer — replace with real Supabase queries
- Setup screen saves nothing — labeled with ⚠️ DEMO ONLY

### Phase 4 work (intelligence engine)
- Coverage Policy fields (CoverageCard) — data captured but not wired to constraint engine
- Portrait Preferences (PortraitCard) — data captured but sunset engine not active
- Person constraint fields (departure, VIP, etc.) — captured, not evaluated
- Vendor departure/setup fields — captured, not evaluated
- `IntelligencePanel` shape mismatch — EFM `StatusExplanation` vs canonical shape (deferred to Phase 4)
- `ActivityStatus` casing — EFM kebab-case vs PascalCase (deferred to Phase 4)
- `PersonRelationship` optimizer — data model defined; Group Photo Optimizer reads it in Phase 4

---

## 7. Merge Sequence

| Phase | Description | Status |
|---|---|---|
| Phase 0 | Interface reconciliation | Complete — `a5fdf43` |
| Phase 1 | Design system + brand components | Complete — `f8aba29` |
| Phase 2 | App scaffold + routes + UI components | Complete — `3f57a91`, `cd77567` |
| Phase 2.5 | data-interfaces.ts v3.0 | Complete — `14e1dc1` |
| **Phase 2.6** | UI refinement pass — all 7 screens | **Complete — commit pending** |
| Phase 3 | Supabase schema and real persistence | Next |
| Phase 4 | Real intelligence engine | After Phase 3 |

---

## 8. Next Step

Commit Phase 2.6 and push, then begin Phase 3.

Before beginning Phase 3, confirm the founder has:
- Created a Supabase project at supabase.com
- Has the project URL and anon key ready

```
Work only in: /Users/kevintrowbridge/SaaS Development/OnCue

Task: Phase 3 of the oncue build — Supabase schema and real data persistence.

Read first:
- docs/claude-handoff/current.md
- docs/FOUNDER_DECISIONS.md
- docs/architecture/data-interfaces.ts (v3.0)

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
```
