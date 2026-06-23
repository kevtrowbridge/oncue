# Claude Handoff — Current

**Last updated:** June 22, 2026
**Current phase:** Pre-Phase 1 complete — design direction confirmed — Lovable prompt ready

---

## Canonical Repository

**Correct repo:** `https://github.com/KevTrowbridge/oncue`
**Old/accidental repo:** `https://github.com/ktrowbridge/oncue` — left in place, not deleted

---

## Pre-Phase 1 Status

| Item | Status |
|---|---|
| Architecture v3.0 | Confirmed — all Section 9 decisions approved |
| GitHub repo | `KevTrowbridge/oncue` ✓ |
| Lovable account | Connected to `KevTrowbridge` ✓ |
| Google Drive merge | Complete ✓ |
| TypeScript interfaces | Complete ✓ — `docs/architecture/data-interfaces.ts` |
| Visual design direction | **Confirmed ✓ — documented below** |
| Lovable prompt | **Ready — includes screens + design + data shapes** |
| Application code | None |
| Supabase project | None |
| Lovable project | None |

**All pre-Phase 1 prerequisites are complete. Phase 1 may begin.**

---

## Confirmed Visual Design Direction

These decisions were approved in the UI Critique review. They must be reflected in the Phase 1 Lovable prompt and honored in every subsequent phase.

| Decision | Confirmed direction |
|---|---|
| App body background | All-black or near-black dark foundation across all screens |
| Header / nav bar | Light cream or white — NOT blush, NOT pink. Creates visual separation from the black app body. |
| Brand accent colors | Original pink/gold logo direction — used sparingly for key actions, badges, status indicators |
| Logo in header | Include the OnCue wordmark/logo in the header if it stays clean. Light header + pink/gold logo is the intended look. |
| Mobile cognitive load | Minimal. Same visual language as desktop. No decorative noise on mobile. |
| Wedding Day Mode | Maximum contrast, minimum content, large touch targets. All-black with white text is ideal for outdoor use in bright light. |
| What does NOT belong | Blush, pastel pink backgrounds, busy headers, decorative overlays, high-saturation color blocks. |

---

## What Was Completed This Session

Updated `docs/claude-handoff/current.md`:
- Added confirmed visual design direction as a permanent record
- Embedded design requirements into the Phase 1 Lovable prompt

No code changes. No interface changes. No Lovable session started.

---

## Files Created or Modified

| File | Action |
|---|---|
| `docs/claude-handoff/archive/2026-06-22-1000-pre-design-direction.md` | Created (prior handoff archived) |
| `docs/claude-handoff/current.md` | Updated (this file) |

---

## Git Status

| Hash | Message | Location |
|---|---|---|
| `dd5307e` | Record interface commit hash in live handoff | KevTrowbridge/oncue |
| `73e42bc` | Write TypeScript data interfaces for Phase 1 Lovable scaffold | KevTrowbridge/oncue |
| `f99bd21` | Add 10-phase OnCue implementation plan to live handoff | KevTrowbridge/oncue |

---

## Review Status
Visible to founder: Yes — this file in VS Code
Founder review recommended: Review the Lovable prompt below before pasting into Lovable
Next step: Open Lovable, connect to `KevTrowbridge/oncue`, paste the prompt below

---

## Phase 1 Lovable Scaffolding Prompt

**How to use:**
1. Log into Lovable
2. Open or create the OnCue project connected to `KevTrowbridge/oncue`
3. Paste everything inside the code block below as the first message

---

```
Build the static UI scaffold for OnCue — a Timeline Intelligence platform for
wedding photographers. This is Phase 1: static only, no data fetching, no API
calls, no Supabase, no environment variables required.

═══════════════════════════════════════════════════════════
VISUAL DESIGN
═══════════════════════════════════════════════════════════

OnCue has a confirmed visual direction. Follow it precisely.

FOUNDATION
- App body background: #0A0A0A (near-black). Every screen, every panel,
  every bottom sheet, every modal uses this as the base surface color.
- Card / elevated surfaces: #141414 or #1A1A1A — slightly lighter than
  the background to create depth without adding color.
- All body text on dark surfaces: #F5F5F5 (near-white).
- Muted / secondary text on dark: #888888.

HEADER / NAV BAR
- The top app bar and global navigation use a LIGHT CREAM or WHITE
  background: #F9F7F4 (warm cream) or #FFFFFF.
- This is a deliberate design choice — the light header creates clear
  visual separation from the black app body below it.
- Do NOT use blush, pink, lavender, or any tinted color for the header.
  Light cream or white only.
- Text in the header: #1A1A1A (near-black).
- Include the OnCue wordmark or a text logo in the header. Keep it clean.
  No decorative backgrounds, gradients, or image textures on the header.

BRAND ACCENT COLORS (pink / gold)
- Primary brand accent: a warm pink in the range of #D4848E to #E8A4B0
  (rose-pink, not hot pink, not blush pastel). Use for: primary action
  buttons, active nav indicators, key badges, status highlights.
- Secondary accent: a warm gold in the range of #C9922A to #D4A853.
  Use sparingly for: premium or important indicators, logo mark if any.
- These accents appear against the dark background (#0A0A0A). They should
  be vivid enough to read at a glance — not muted or washed out.
- Do NOT use pink or gold as a background color for any screen or panel.

TYPOGRAPHY
- Font: a clean, modern sans-serif. Inter or a similar professional font.
  Not decorative, not script.
- Heading weight: semibold or bold.
- Body weight: regular.
- No decorative or script typography anywhere in the MVP scaffold.

STATUS BADGES AND INDICATORS
- EventStatus badges: pill-shaped, small. Use the brand accent or neutral
  tones — not bright saturated colors.
  - Draft: gray (#444444 bg, #AAAAAA text)
  - InProgress: muted blue-gray (#1E3A4C bg, #7AAECC text)
  - ReviewNeeded: warm amber (#3D2800 bg, #D4A853 text)
  - Ready: muted green (#0D2D1A bg, #4CAF7D text)
  - Live: brand pink (#3D0D15 bg, #E8A4B0 text)
  - Completed: neutral (#2A2A2A bg, #888888 text)
  - Archived: neutral (#1A1A1A bg, #555555 text)
- VendorStatus badges:
  - Invited: gray
  - Viewed: amber
  - Confirmed: green

WEDDING DAY MODE — SPECIFIC RULES
- This screen is used outdoors, in bright sunlight, with one hand.
  Maximum contrast. Minimum visual noise.
- Background: #000000 (pure black — even darker than the rest of the app).
- NOW card: white text on black, large type, generous padding.
- NEXT rows: smaller text, muted (#888888), no borders.
- "Running Late" button: brand pink fill, white text, full-width or
  nearly full-width, large enough for a single tap with a thumb.
- Attention flag: amber or red indicator, not a subtle icon.
- Emergency contacts button: clearly visible secondary button, not buried.
- No decorative elements, gradients, or images on this screen.

═══════════════════════════════════════════════════════════
DATA SHAPES
═══════════════════════════════════════════════════════════

The data shapes for every component are already defined. They live in:
  docs/architecture/data-interfaces.ts

Import types from that file wherever needed. Do not invent your own data
structures. Every prop type must match the interfaces in that file exactly.

═══════════════════════════════════════════════════════════
SCREENS — build all 9
═══════════════════════════════════════════════════════════

Use hardcoded static placeholder data that matches the interface shapes.
Use realistic placeholder values — real wedding names, real times,
real vendor names. No "Lorem ipsum", no "Activity 1", no "Couple Name".

1. DASHBOARD — event list
   - 2–3 hardcoded Event cards (use EventStatus variety: one InProgress,
     one ReviewNeeded, one Ready or Live)
   - Each card: couple names, event date, status badge, days-until chip,
     pending proposals badge, VendorSummary chip (X of Y confirmed),
     EventReadinessChecklist summary card near event date
   - "Create Event" button — prominent
   - Archived events section (collapsed at bottom)

2. CREATE EVENT — form shell
   - Couple name 1, couple name 2, event date, primary location (optional)
   - Template selector: "Wedding" (only option in MVP)
   - "Create" button — no submission logic

3. TIMELINE EDITOR — planning mode
   - Two-panel layout on desktop: activity list left, detail panel right
   - Activity list: section dividers, activity rows with title / start time /
     duration / location label / anchor type indicator / constraint warning badge
   - Travel block rows: visually distinct (slightly indented or muted)
   - Constraint warning: show inline on one activity as a real placeholder
     (e.g. "Ceremony is locked at 4:00pm — portrait block may run long")
   - Activity Detail Panel: all Activity fields from the interface
   - Toolbar: undo / redo / pending proposals count / Review Required badge /
     publish-share button
   - On mobile: activity list full-width; detail panel as bottom sheet

4. QUESTIONNAIRE — all 8 sections
   - Section navigation (sidebar on desktop, tabs or accordion on mobile):
     Core Details / Locations / Family & Wedding Party /
     Group Photo Priorities / Vendors / Preferences / Priorities /
     Emergency Contacts
   - Each section: form fields matching the questionnaire interfaces
   - Progress indicator per section (filled / empty ring or checkmark)
   - "Invite couple to complete their sections" button

5. GROUP PHOTO OPTIMIZER
   - 3–4 placeholder groups with realistic names
     (e.g. "Bride's Immediate Family", "Groom's Side + Grandparents",
     "Full Wedding Party", "Couple Alone")
   - Each group card: label / participant list / estimated duration /
     GroupPhotoStatus badge / cross-group participant indicator
   - Total estimated block time shown at top
   - Drag handle for reordering
   - "Sequence confirmed" toggle

6. VENDOR MANAGEMENT
   - Role list: DJ, Videographer, Florist, Hair/Makeup, Venue, Officiant
   - Each row: role label / contact name / VendorStatus badge
     (show variety: one Invited, one Viewed, one Confirmed)
   - "Copy link" button per row; "Generate link" for roles without one
   - "Preview vendor view" button per row

7. CHANGE REVIEW
   - Two sections: "Needs your decision" (couple proposals — Workflow A)
     and "Review Required" (collaborator changes already applied — Workflow B)
   - Couple proposals: 1–2 placeholder ChangeProposal rows each showing
     original value vs. proposed value / submitter / Approve + Decline buttons
   - Review Required: 1 placeholder ChangeLogEntry row with Revert button
   - "What's Changed Since Last Visit" dismissable banner at top

8. WEDDING DAY MODE
   - Follow the Wedding Day Mode visual rules above exactly
   - NOW card: activity title / location / assigned people / time remaining
   - NEXT rows: 2–3 upcoming activities (title, time — minimal)
   - Attention flag: visible amber indicator (placeholder — not wired)
   - "Running Late" button: full-width or nearly full-width, brand pink,
     accessible in one tap from the main view
     Opens delay panel with:
       — delay amount selector: 5 / 10 / 15 / 20 / 30+ min buttons
       — affected activities list (2–3 placeholder rows)
       — recovery option cards (2 placeholder cards with descriptions)
       — notification candidate list with checkboxes
       — Confirm button
   - "Emergency contacts" button: opens panel with name / role / phone rows;
     one-tap-to-call layout

9. PDF EXPORT
   - 5 format option cards: Compact Itinerary / Full Timeline /
     Vendor-Filtered / Group Photo Only / Couple's View
   - Each card: format name / one-line description / "Download" button
     (placeholder — no actual PDF generation)
   - Last download date shown as hardcoded placeholder
   - Warning banner: "No PDF downloaded yet — download before the wedding day"
     (shown as a placeholder; styled to be noticeable, not alarming)

═══════════════════════════════════════════════════════════
LAYOUT AND INTERACTION REQUIREMENTS
═══════════════════════════════════════════════════════════

- Mobile-first. All screens must work at 390px wide.
- Wedding Day Mode must be fully operable with one thumb in portrait mode.
- Primary actions in the bottom half of the screen on mobile.
- Touch targets: minimum 44×44pt on all interactive elements.
- "Running Late" button and emergency contacts reachable in 2 taps
  from the main Wedding Day screen.
- Planning Mode on mobile: bottom tab bar navigation; detail panel as
  bottom sheet (not a separate page).
- Questionnaire on mobile: single-column scrollable form.
- All placeholder data must use realistic values — real names, real times,
  real wedding-day language.

═══════════════════════════════════════════════════════════
DO NOT BUILD
═══════════════════════════════════════════════════════════

- Supabase client or any data fetching
- Authentication or session management
- Real constraint logic or time calculations
- Real PDF generation
- Role-based routing guards
- Any .env variables or configuration
- Any feature not listed above

═══════════════════════════════════════════════════════════
GOAL
═══════════════════════════════════════════════════════════

Every screen loads without errors. Placeholder data uses the correct
interface shapes. The visual design is established and matches the
confirmed direction above. A Claude Code audit follows before any
real data is wired.
```

---

## Exact Next Step

**Founder action:** Open Lovable, connect to `KevTrowbridge/oncue`, paste the prompt above.

**After Phase 1 is complete:** Return to Claude Code with:
> "Phase 1 Lovable scaffold is complete. Run the Phase 2 code audit."
