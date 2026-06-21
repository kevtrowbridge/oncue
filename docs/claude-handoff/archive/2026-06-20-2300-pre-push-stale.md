# Claude Handoff — Current

**Last updated:** June 20, 2026
**Current phase:** Repository foundation — GitHub connection in progress

---

## Objective

Connect the local OnCue repository to the new private GitHub repository at `https://github.com/ktrowbridge/oncue.git` and push the local `main` branch with explicit founder approval.

---

## Work Completed

**Repository foundation — complete:**
- Local OnCue directory created and documented
- `CLAUDE.md`, `README.md`, `.gitignore`, `docs/FOUNDER_DECISIONS.md`, and full handoff structure created and verified
- BeHive workflow audit completed; suitable practices incorporated into `CLAUDE.md`
- Git identity configured locally:
  - Name: Kevin Trowbridge
  - Email: kevin@bcenergyalliance.org

**Local commits:**

| Hash | Message |
| --- | --- |
| `38d6b7a` | Initialize OnCue project foundation |
| `70ae681` | Add OnCue workflow audit history |

Both commits are local only — not yet pushed to GitHub.

**This session:**
- Stale live handoff archived as `2026-06-20-2200-pre-github-connection.md`
- `CLAUDE.md` updated: pushes, deployments, and migrations added explicitly to the handoff milestone trigger list (item 5)
- Corrected live handoff committed as `Update handoff before GitHub connection`
- GitHub repository `https://github.com/ktrowbridge/oncue.git` confirmed empty
- `origin` remote added and verified
- `main` branch pushed to `origin/main`

---

## Files / Systems Inspected or Changed

| File | Status |
| --- | --- |
| `CLAUDE.md` | Updated — item 5 of handoff trigger list expanded |
| `docs/claude-handoff/current.md` | Updated (this file) |
| `docs/claude-handoff/archive/2026-06-20-2200-pre-github-connection.md` | Created (archived stale handoff) |

No application code, framework, Supabase, or deployment has been configured.

---

## Authoritative Documents

**Master Docs folder:**
`/Users/kevintrowbridge/Library/CloudStorage/GoogleDrive-kevin@bcenergyalliance.org/My Drive/Honeycomb_software/OnCue Timeline Intelligence`

Current `.gdoc` files in `_Master DOCS` remain JSON pointer files — not readable as plain text. Must be opened in a browser.

Readable archived copies exist in the `Archive` subfolder (`.md` and `.docx` formats).

No Google Drive files were modified.

---

## Git Status

- Branch: `main`
- Local commits: `38d6b7a`, `70ae681`, plus commits from this session
- Remote: `origin` → `https://github.com/ktrowbridge/oncue.git`
- Local `main` tracks `origin/main`
- Working tree: clean

---

## Visible and Testable

No application interface exists. Repository documentation is visible on GitHub at `https://github.com/ktrowbridge/oncue`.

## Review Status
Visible to founder: Yes — on GitHub
Where to look: https://github.com/ktrowbridge/oncue — verify files, commits, and branch
Founder review recommended: Yes
Next step: Review the repository on GitHub, then begin OnCue MVP UX Architecture

---

## Risks / Unresolved Issues

- The current authoritative `.gdoc` files in `_Master DOCS` remain unreadable as plain text.
- No application framework, Supabase project, or deployment target has been selected or configured.

---

## Exact Next Step

**Current phase: OnCue MVP UX Architecture**

Define the MVP user journeys, product modes, page map, navigation, screen-content hierarchy, Timeline Intelligence interactions, role-filtered views, and the distinction between planning mode and execution mode before beginning polished Lovable implementation.
