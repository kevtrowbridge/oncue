# OnCue Handoff Archive — Workflow Audit Complete

**Date:** June 20, 2026
**Milestone:** BeHive workflow audit — suitable practices incorporated into CLAUDE.md

---

## Objective

Audit proven development-workflow rules from the BeHive repository and selectively incorporate suitable generic principles into OnCue's CLAUDE.md. Exclude all BeHive product-specific content (leases, tenants, accounting, compliance, migrations, Supabase/RLS specifics).

---

## Work Completed

- BeHive `CLAUDE.md`, `docs/claude-handoff/current.md`, and representative archive files inspected read-only
- Rules classified into three categories: suitable for OnCue, suitable with adaptation, not suitable
- Previous live handoff (`docs/claude-handoff/current.md`) archived before replacement as `2026-06-20-2100-pre-workflow-audit.md`
- `CLAUDE.md` rewritten with all new sections incorporated

**Sections added:**
- `"Next" Command Protocol` — full 10-rule protocol for the `next` prompt
- `Continuity and Unfinished Work` — 7 rules for context-safe resumption
- `Planning and Scope Control` — 8 rules for scope discipline
- `Verification` — clear distinction between written/committed/pushed/deployed/visible/tested
- `Safe Changes` — tiered approval list, secret handling, unexpected-state protocol
- `Git Workflow` — staging discipline, commit hash recording, identity rules, no auto co-author
- `Attribution and Ownership` — no AI attribution in commits or files
- `Review Status` block template in Founder Visibility and Review

**Sections strengthened:**
- `Claude Handoff Protocol` — added archive trigger guidance, evidence/file-path requirements, history-preservation rule, item 11 and 12
- `Founder Visibility and Review` — expanded with proactive review requirement and Review Status block

**BeHive rules incorporated (with adaptation):**
- Two-pass scope discipline (stay in approved scope, no unrelated edits, verify before claiming success)
- Tiered approval requirements for irreversible/risky actions
- Structured Review Status block after every response
- Secret handling rules (adapted from Supabase-specific to generic)
- "Exact next step" pattern carried forward from "Exact next approval question"
- Attribution/ownership rule (no AI co-author lines)
- Verify completion from actual evidence, not prior Claude statements
- Stage only intended files; record actual commit hash in handoff

**BeHive rules deliberately excluded:**
- LEDGER CONTRACT, MUTATION SAFETY, FORENSIC LOGGING
- BC compliance standards (deemed_served_at, delivery_proof_hash, etc.)
- Supabase migration, RLS, RPC, correction_event rules
- EPP, rent allocation, tenant ledger, payment ingestion specifics
- ChatGPT review gate
- "Me First, Market Next" philosophy
- TanStack/Supabase/Tailwind stack rules

---

## Files / Systems Changed

| File | Action |
| --- | --- |
| `CLAUDE.md` | Substantially rewritten with new sections |
| `docs/claude-handoff/current.md` | Updated to reflect workflow audit completion |
| `docs/claude-handoff/archive/2026-06-20-2100-pre-workflow-audit.md` | Created (snapshot of prior live handoff) |
| `docs/claude-handoff/archive/2026-06-20-workflow-audit-complete.md` | Created (this file) |

No changes to `README.md`, `.gitignore`, or `docs/FOUNDER_DECISIONS.md`.
No changes to BeHive repository.
No Google Drive files modified.

---

## Commands Run

```bash
git status   # confirmed staged set before changes
cp docs/claude-handoff/current.md docs/claude-handoff/archive/2026-06-20-2100-pre-workflow-audit.md
```

---

## Verification or Test Results

- `CLAUDE.md` read back in full — all new sections present, all OnCue-specific product rules preserved
- Strategic moat order confirmed: Timeline Intelligence (primary), Family Group Optimizer (secondary), Execution Intelligence (tertiary)
- No root-level `CURRENT.md` present
- No BeHive domain content in OnCue files

---

## Visible and Testable

All files are documentation only. Visible and reviewable in VS Code. No application interface exists at this stage.

---

## Risks / Unresolved Issues

- Git identity (user.name and user.email) not configured. First commit blocked until founder confirms.
- Authoritative `.gdoc` files in Google Drive `_Master DOCS` remain unreadable as plain text.

---

## Exact Next Step

Founder confirms Git user name and email. Then: stage the two new archive files, create the first local commit with message `Initialize OnCue project foundation`, then create an empty private GitHub repository named `oncue` and connect after explicit founder approval.
