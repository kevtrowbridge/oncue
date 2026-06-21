# Claude Handoff — Current

**Last updated:** June 20, 2026
**Current phase:** Repository foundation — workflow audit complete

---

## Objective

Audit proven development-workflow rules from BeHive and selectively incorporate the suitable ones into OnCue's CLAUDE.md, without importing any BeHive product-specific domain content.

---

## Work Completed

- BeHive repository inspected read-only: `CLAUDE.md`, `docs/claude-handoff/current.md`, and representative archive entries
- BeHive rules classified into: suitable for OnCue, suitable with adaptation, and not suitable
- `CLAUDE.md` substantially updated with new and strengthened sections
- Previous live handoff archived before replacement
- All six staged foundation files remain staged; two new archive files added

**Sections added to CLAUDE.md:**
- `"Next" Command Protocol` — full protocol for responding when founder sends `next` as entire prompt
- `Continuity and Unfinished Work` — rules for resuming sessions without losing context
- `Planning and Scope Control` — rules for staying focused on the approved task
- `Verification` — rules for distinguishing written / committed / pushed / deployed / visible / tested
- `Safe Changes` — tiered approval requirements; secret handling; unexpected-state protocol
- `Git Workflow` — staging discipline, commit hash recording, identity rules
- `Attribution and Ownership` — no AI co-author lines; founder owns the work
- `Review Status` block template added to Founder Visibility and Review
- `Documentation Discipline` — expanded from prior Documentation Maintenance section

**Sections strengthened in CLAUDE.md:**
- `Claude Handoff Protocol` — added archive trigger list, evidence and file-path requirements, history-preservation rule
- `Founder Visibility and Review` — expanded from Completion and Review Reporting with more explicit visibility rules and proactive-review requirement

**BeHive rules deliberately excluded:**
- LEDGER CONTRACT, MUTATION SAFETY, FORENSIC LOGGING (BC compliance)
- Supabase migration, RLS, RPC, correction_event, EPP, rent, ledger, receipt, allocation rules
- ChatGPT review gate
- Tenant/financial-data-specific pass-2 checklist items
- "Me First, Market Next" philosophy and TanStack/Supabase stack rules

---

## Files / Systems Inspected or Changed

| File | Status |
| --- | --- |
| `CLAUDE.md` | Substantially updated (workflow audit) |
| `docs/claude-handoff/current.md` | Updated (this file) |
| `docs/claude-handoff/archive/2026-06-20-2100-pre-workflow-audit.md` | Created (archived prior live handoff) |
| `docs/claude-handoff/archive/2026-06-20-workflow-audit-complete.md` | Created (see below for archive entry) |
| BeHive `CLAUDE.md` | Inspected read-only — not modified |
| BeHive `docs/claude-handoff/current.md` | Inspected read-only — not modified |
| BeHive archive entries | Inspected read-only — not modified |

`README.md`, `.gitignore`, `docs/FOUNDER_DECISIONS.md` — no changes needed.

---

## Authoritative Documents

**Master Docs folder:**
`/Users/kevintrowbridge/Library/CloudStorage/GoogleDrive-kevin@bcenergyalliance.org/My Drive/Honeycomb_software/OnCue Timeline Intelligence`

**`_Master DOCS` subfolder — current authoritative versions:**

| File | Readable? |
| --- | --- |
| `OnCue Master Document V2.gdoc` | No — JSON pointer file. Must be opened in a browser. |
| `OnCue Founder Decisions Log.gdoc` | No — JSON pointer file. Must be opened in a browser. |

**`Archive` subfolder — older readable copies:**
- `OnCue_Master_Strategy_and_Brand_Guardrails.md` — readable, read in full in prior sessions
- `OnCue_Product_Architecture_and_Technical_Guardrails.docx` — readable via Python extraction
- `OnCue_MVP_Specification_and_Roadmap.docx` — readable via Python extraction

No Google Drive files were modified.

---

## Git Status

- Repository initialized on `main`
- No commits created yet
- Git identity not configured (local or global) — commit cannot be created until founder confirms name and email
- No GitHub remote added; nothing pushed

**Staged files:**
- `.gitignore`
- `CLAUDE.md`
- `README.md`
- `docs/FOUNDER_DECISIONS.md`
- `docs/claude-handoff/archive/2026-06-20-repository-foundation.md`
- `docs/claude-handoff/current.md`

**Not yet staged (will need to be staged before commit):**
- `docs/claude-handoff/archive/2026-06-20-2100-pre-workflow-audit.md`
- `docs/claude-handoff/archive/2026-06-20-workflow-audit-complete.md`

---

## Visible and Testable

All documentation is visible and reviewable in VS Code. There is no application interface at this stage.

## Review Status
Visible to founder: No (documentation only — no app interface yet)
Where to look: Open the OnCue folder in VS Code; review CLAUDE.md especially the new sections
Founder review recommended: Yes
Next step: Review CLAUDE.md, then confirm Git identity so the first commit can be created

---

## Founder Review

Review recommended now. Open the OnCue folder in VS Code and review:

- `CLAUDE.md` — all new and updated sections, particularly the `"Next" Command Protocol`, `Verification`, and `Safe Changes` sections
- `docs/claude-handoff/current.md` — this file
- `docs/claude-handoff/archive/2026-06-20-2100-pre-workflow-audit.md` — snapshot of handoff before this session

---

## Risks / Unresolved Issues

- Git identity (user.name and user.email) is not configured. The first commit cannot proceed until the founder confirms the preferred name and email address for GitHub commits.
- The current authoritative `.gdoc` files in `_Master DOCS` remain unreadable as plain text. Must be opened in a browser.

---

## Exact Next Step

Confirm your Git user name and email address for commits. Once confirmed, stage the two new archive files, then create the first local commit with message `Initialize OnCue project foundation`. After that, create an empty private GitHub repository named `oncue` (no README, .gitignore, or licence) and connect the local `main` branch after explicit founder approval.
