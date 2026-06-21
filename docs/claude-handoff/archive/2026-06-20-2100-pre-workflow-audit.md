# Claude Handoff — Current

**Last updated:** June 20, 2026
**Current phase:** Repository foundation — verification complete

---

## Objective

Verify the handoff-folder migration, confirm the repository-foundation documents are correct and internally consistent, and prepare the staged set for the first local commit.

---

## Work Completed

- All six repository-foundation files read and verified in full
- Handoff migration confirmed complete: `docs/claude-handoff/current.md` and `docs/claude-handoff/archive/` are correctly in place; root-level `CURRENT.md` is gone
- Google Drive `_Master DOCS` `.gdoc` files re-inspected — still JSON pointer files; "available offline" did not expose document text to local command-line tools
- Two genuine issues found and corrected:
  1. `CLAUDE.md` Handoff Protocol item 7 — added "work completed" as a distinct archive field; corrected "tests or verification steps" to "verification or test results" and "task performed" to "objective or task"
  2. `docs/FOUNDER_DECISIONS.md` — last line in Section 9 still referenced root-level `CURRENT.md`; updated to `docs/claude-handoff/current.md`
- All six files re-staged; Git status confirmed clean

---

## Files / Systems Inspected or Changed

| File | Status |
| --- | --- |
| `CLAUDE.md` | Verified; Handoff Protocol item 7 corrected |
| `README.md` | Verified; no changes needed |
| `.gitignore` | Verified; no changes needed |
| `docs/FOUNDER_DECISIONS.md` | Verified; Section 9 last line updated |
| `docs/claude-handoff/current.md` | Updated (this file) |
| `docs/claude-handoff/archive/2026-06-20-repository-foundation.md` | Verified; no changes needed |

No application code, framework, or external service has been configured. No Google Drive files were modified.

---

## Authoritative Documents

**Master Docs folder:**
`/Users/kevintrowbridge/Library/CloudStorage/GoogleDrive-kevin@bcenergyalliance.org/My Drive/Honeycomb_software/OnCue Timeline Intelligence`

**`_Master DOCS` subfolder — current authoritative versions:**

| File | Readable? |
| --- | --- |
| `OnCue Master Document V2.gdoc` | No — JSON pointer file (181 bytes). "Available offline" does not expose text to command-line tools. Must be opened in a browser. |
| `OnCue Founder Decisions Log.gdoc` | No — JSON pointer file (181 bytes). Same limitation. |

**`Archive` subfolder — older readable copies:**

| File | Readable? |
| --- | --- |
| `OnCue_Master_Strategy_and_Brand_Guardrails.md` | Yes — plain text, read in full in prior sessions |
| `OnCue_Product_Architecture_and_Technical_Guardrails.docx` | Yes — text extracted via Python in prior sessions |
| `OnCue_MVP_Specification_and_Roadmap.docx` | Yes — text extracted via Python in prior sessions |

No Google Drive files were modified.

---

## Git Status

- Repository initialized on `main`
- No commits created yet
- Staged: `CLAUDE.md`, `README.md`, `.gitignore`, `docs/FOUNDER_DECISIONS.md`, `docs/claude-handoff/current.md`, `docs/claude-handoff/archive/2026-06-20-repository-foundation.md`
- No GitHub remote added; nothing pushed
- Git identity not configured (local or global) — commit cannot be created until founder confirms preferred name and email

---

## Visible and Testable

All documentation files are visible and reviewable in VS Code. There is no application interface at this stage. No browser testing is required.

---

## Founder Review

Founder review is recommended now for all six repository-foundation files before proceeding. Open the OnCue folder in VS Code and review:

- `CLAUDE.md` — permanent Claude Code working instructions (Handoff Protocol item 7 was corrected)
- `README.md` — product overview and repository orientation
- `docs/FOUNDER_DECISIONS.md` — approved founder decisions log (Section 9 last line was corrected)
- `docs/claude-handoff/current.md` — this file
- `docs/claude-handoff/archive/2026-06-20-repository-foundation.md` — repository-foundation milestone archive

---

## Risks / Unresolved Issues

- Git identity (user.name and user.email) is not configured locally or globally. The commit message `Initialize OnCue project foundation` is ready but the commit cannot be created until the founder confirms which name and email address to associate with GitHub commits.
- The current authoritative `.gdoc` files in `_Master DOCS` are not readable as plain text by any local tool. Their content is only accessible by opening them in a browser. The archived `.md` and `.docx` files in the `Archive` subfolder remain the only locally readable versions.

---

## Exact Next Step

Confirm the Git user name and email address to use for commits. Once confirmed, create the first local commit with message `Initialize OnCue project foundation`. Then create an empty private GitHub repository named `oncue` (without a README, .gitignore, or licence) and connect the local `main` branch after explicit founder approval.
