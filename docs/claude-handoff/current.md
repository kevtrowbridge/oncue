# Claude Handoff — Current

**Last updated:** June 21, 2026
**Current phase:** MVP UX Architecture v3.0 complete — GitHub repo migrated to KevTrowbridge/oncue — awaiting Google Drive merge before Lovable

---

## Canonical GitHub Repository

**Correct repo:** `https://github.com/KevTrowbridge/oncue`
**Old/accidental repo:** `https://github.com/ktrowbridge/oncue` — not deleted, not transferred; left in place

The local remote has been updated. All future pushes go to `KevTrowbridge/oncue`.

---

## Objective

Founder confirms Lovable can see `KevTrowbridge/oncue`, then merges the confirmed architecture into the Master Google Docs, then approves to begin Lovable scaffolding. No implementation has started.

---

## What Was Completed (Repo Migration Session)

**OnCue GitHub repository migrated to correct account:**

| Step | Result |
|---|---|
| Active GitHub identity verified | `kevtrowbridge` ✓ |
| Target repo verified to exist | `KevTrowbridge/oncue` ✓ |
| Local origin updated | `ktrowbridge/oncue` → `KevTrowbridge/oncue` ✓ |
| `main` pushed to new repo | ✓ |
| Remote HEAD | `1c8db3a` |
| Local HEAD | `1c8db3a` |
| Hashes match | ✓ |
| Working tree after push | Clean ✓ |
| Old repo modified | No — left untouched ✓ |

---

## Prior Work Summary (Architecture Session)

**Architecture document v3.0:** `docs/architecture/mvp-ux-architecture.md`

Ten red-team additions confirmed by founder:
1. Review Required workflow (not formal approval queue)
2. Event Readiness Checklist (7 items)
3. Comprehensive MVP rollback (undo/redo + snapshots + restore + change log + version comparison)
4. Google Drive merge confirmed as prerequisite
5. What's Changed Since Last Visit
6. Vendor status tracking (Invited / Viewed / Confirmed)
7. Emergency contact layer
8. Mobile-first one-handed design rule
9. PDF backup required
10. Smart defaults required for every field

**All Section 9 items confirmed. No open architecture questions remain.**

---

## Files Created or Modified (This Session)

| File | Action |
|---|---|
| `docs/claude-handoff/archive/2026-06-21-1500-pre-repo-migration.md` | Created (prior handoff archived) |
| `docs/claude-handoff/current.md` | Updated (this file) |

No architecture changes. No application code. No Lovable project. No Supabase.

---

## Git Status

| Hash | Message | Location |
|---|---|---|
| *(pending — this handoff commit)* | Record OnCue repo migration to KevTrowbridge/oncue | pending |
| `1c8db3a` | Record v3.0 commit hash in live handoff | KevTrowbridge/oncue |
| `63cb88a` | Apply v3.0 red-team additions to MVP UX Architecture | KevTrowbridge/oncue |

---

## Visible and Testable

The architecture document is readable in VS Code at:
`docs/architecture/mvp-ux-architecture.md`

No application interface exists. No Lovable project has been started.

## Review Status
Visible to founder: Yes — `docs/architecture/mvp-ux-architecture.md` in VS Code; `KevTrowbridge/oncue` on GitHub
Founder review recommended: No — repo migration is complete; no new architecture content
Next step: Founder verifies Lovable can see KevTrowbridge/oncue, then merges architecture into Master Google Docs

---

## Required Before Lovable Begins

**Two actions required from the founder (in order):**

**1. Verify Lovable can see KevTrowbridge/oncue**
Log into Lovable → New Project → GitHub → confirm `KevTrowbridge/oncue` appears in the repo list. Do not start the project yet — just confirm it is visible.

**2. Merge architecture into Master Google Docs**
Open both Master Google Docs in Google Drive. Copy the confirmed decisions and architecture content from `docs/architecture/mvp-ux-architecture.md` into:
- `OnCue Master Document V2.gdoc`
- `OnCue Founder Decisions Log.gdoc`

These are founder-only actions. Once both are confirmed, Claude will provide the exact Lovable scaffolding prompt.

---

## Exact Next Step

**Founder action:** Complete the two steps above, then return with:

> "Lovable can see KevTrowbridge/oncue. Master Google Docs updated. Proceed with Lovable scaffolding prompt."

---

## Successor Prompt (after both prerequisites are confirmed)

```
Lovable can see KevTrowbridge/oncue.
Master Google Docs have been updated with the v3.0 architecture content.
All founder decisions are confirmed. No open questions remain.

Provide the exact Lovable scaffolding prompt as the next step.
Do not begin building — provide the prompt only, so the founder
can review before initiating the Lovable session.

Work only in: /Users/kevintrowbridge/SaaS Development/OnCue
```
