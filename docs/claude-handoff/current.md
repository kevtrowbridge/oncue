# Claude Handoff — Current

**Last updated:** June 21, 2026
**Current phase:** MVP UX Architecture v2.0 — revised with 11 founder decisions; awaiting founder review before Lovable

---

## Objective

Founder reviews the revised MVP UX Architecture document, answers four open questions (Section 9 items A–D), and gives approval to begin Lovable implementation. No implementation has started.

---

## What Was Completed This Session

**Architecture document revised (v2.0):**

File: `docs/architecture/mvp-ux-architecture.md`

Eleven founder decisions incorporated:

1. One shared questionnaire (not separate photographer/bride versions); non-owner edits are proposed changes requiring approval
2. Group photo participants expanded to all relationships (extended family, chosen family, VIPs — not just parents/siblings)
3. Couple sign-in is lightweight (magic link + Google); not a professional account setup
4. Vendor access is link-based (no account); vendor link landing includes a low-friction marketing prompt
5. Wedding Day Mode is delay-first; "Running Late" is the primary feature; mark complete is secondary and not relied upon
6. Planner has two levels: Collaborator (edits; sensitive changes may need approval) and Co-owner (can approve changes)
7. Couple can download their own PDF copy of the timeline
8. QR codes are V2 unless trivially easy
9. Questionnaire pre-fill from past events is deferred; section-level guidance is a later feature
10. Custom branding and custom domain are paid V2 features
11. Location sharing is a documented planned feature for V2; defined in its own section (Section 7) with full opt-in, privacy, and notification rules

**Document also includes:**
- Clear MVP / V2 / Later separation (three distinct tiers, not just two)
- Document status section confirming this is repo-only and not yet in Google Drive
- Google Drive cross-reference recommendation
- Revision history table
- Confirmed vs. open items in Section 9 founder review

---

## Files Created or Modified

| File | Action |
|---|---|
| `docs/architecture/mvp-ux-architecture.md` | Revised — v2.0 |
| `docs/claude-handoff/archive/2026-06-21-1100-pre-architecture-v2.md` | Created (prior handoff archived) |
| `docs/claude-handoff/current.md` | Updated (this file) |

No application code. No Lovable project. No Supabase. No deployment.

---

## Git Status

| Hash | Message | Status |
|---|---|---|
| `2c40d52` | Confirm UX architecture commit hash in live handoff | On GitHub |
| *(pending)* | Revise MVP UX Architecture with founder decisions | Local only — not yet committed |

---

## Visible and Testable

The architecture document is readable in VS Code at:
`docs/architecture/mvp-ux-architecture.md`

No application interface exists. No Lovable project has been started.

## Review Status
Visible to founder: Yes — `docs/architecture/mvp-ux-architecture.md` in VS Code
Where to look: Read the full document; focus on Section 9 (items A–D still need answers)
Founder review recommended: Yes — required before any Lovable work begins
Next step: Founder reviews revised architecture, answers items A–D in Section 9, then approves to proceed

---

## Open Items (must be resolved before Lovable)

From Section 9 of the architecture document:

**A — Collaborator approval rules:** Which specific actions by a Collaborator-level planner require owner approval? Suggested default: all edits apply directly; only delete-event requires approval. Couple changes always require approval. Confirm or define exceptions.

**B — Event readiness definition:** What constitutes a "ready" event? Suggested: questionnaire complete, group photos sequenced, one PDF downloaded, no critical constraint warnings. Confirm or modify.

**C — Rollback scope:** Does "roll back one version" mean the full timeline, or individual activities?

**D — Google Drive:** Should the confirmed architecture content be copied into the Master Google Docs before implementation begins? (Recommended: yes.)

---

## Risks

- The architecture document was written from the three readable archive copies of the Master Docs. If the current Google Docs contain updates not in those archives, those updates are not reflected here.
- Items A–D remain open. If any of these change the scope significantly (especially C — rollback scope), implementation timelines for those features could shift.

---

## Exact Next Step

**Founder action:** Open `docs/architecture/mvp-ux-architecture.md` in VS Code. Read the full document. Pay close attention to:

- Section 1 — User journeys (especially the couple's proposed-change model)
- Section 2 — Wedding Day Mode delay-adjustment flow
- Section 7 — Location sharing (V2 planned feature)
- Section 8 — MVP / V2 / Later feature tiers
- Section 9 — Answer items A, B, C, and D

Return with corrections or confirmation. After founder approval, proceed to commit and push the architecture file, then begin Lovable scaffolding.

---

## Successor Prompt (after founder review and approval)

```
The MVP UX Architecture is approved. Apply any corrections from founder review to:
docs/architecture/mvp-ux-architecture.md

Then:
1. Commit and push the revised architecture document with message:
   Revise MVP UX Architecture with founder decisions
2. Verify the push succeeded
3. Update the live handoff with the confirmed commit hash and push state
4. Then provide the exact Lovable scaffolding prompt as the next step

Work only in: /Users/kevintrowbridge/SaaS Development/OnCue
Do not begin Lovable until architecture is committed and founder has approved.
```
