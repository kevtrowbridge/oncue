# OnCue Handoff Archive — Repository Foundation

**Date:** June 20, 2026
**Milestone:** Repository foundation

---

## Objective

Establish the local OnCue repository, foundational documentation, authoritative-document workflow, and safe Claude Code operating rules before application development begins.

---

## Work Completed

- Local OnCue directory created at `/Users/kevintrowbridge/SaaS Development/OnCue`
- `docs/FOUNDER_DECISIONS.md` created from approved founder content; stray citation numbers cleaned
- `CLAUDE.md` created with permanent Claude Code working instructions, product rules, and development workflow
- `README.md` created with product overview, principles, markets, and repository orientation
- `.gitignore` created with standard exclusions for macOS, environment files, dependencies, build output, and editor temporaries
- Locally synchronized Google Drive Master Docs location identified and confirmed at `/Users/kevintrowbridge/Library/CloudStorage/GoogleDrive-kevin@bcenergyalliance.org/My Drive/Honeycomb_software/OnCue Timeline Intelligence`
- Available Master Docs inspected (see Authoritative Documents section below)
- Git repository initialized (`git init`) on branch `main`
- All foundational files staged for first commit
- Handoff structure migrated from root-level `CURRENT.md` to `docs/claude-handoff/current.md` and `docs/claude-handoff/archive/`

---

## Files Created or Updated

| File | Action |
| --- | --- |
| `CLAUDE.md` | Created |
| `README.md` | Created |
| `.gitignore` | Created |
| `docs/FOUNDER_DECISIONS.md` | Created |
| `docs/claude-handoff/current.md` | Created (replaces root-level `CURRENT.md`) |
| `docs/claude-handoff/archive/2026-06-20-repository-foundation.md` | Created (this file) |

Root-level `CURRENT.md` removed after content was preserved in `docs/claude-handoff/current.md`.

---

## Authoritative Master Docs Reviewed

**Master Docs folder:**
`/Users/kevintrowbridge/Library/CloudStorage/GoogleDrive-kevin@bcenergyalliance.org/My Drive/Honeycomb_software/OnCue Timeline Intelligence`

**`_Master DOCS` subfolder (authoritative — current versions):**

| File | Readable? |
| --- | --- |
| `OnCue Master Document V2.gdoc` | No — Google Docs pointer file. Must be opened in a browser. |
| `OnCue Founder Decisions Log.gdoc` | No — Google Docs pointer file. Must be opened in a browser. |

**`Archive` subfolder (older readable copies):**

| File | Readable? |
| --- | --- |
| `OnCue_Master_Strategy_and_Brand_Guardrails.md` | Yes — plain text, read in full |
| `OnCue_Product_Architecture_and_Technical_Guardrails.docx` | Yes — text extracted via Python zipfile |
| `OnCue_MVP_Specification_and_Roadmap.docx` | Yes — text extracted via Python zipfile |

No Google Drive files were modified.

---

## Git Status at Time of Archiving

- Repository initialized on `main`
- No commits created yet
- Files staged: `CLAUDE.md`, `README.md`, `.gitignore`, `docs/FOUNDER_DECISIONS.md`, `docs/claude-handoff/current.md`, `docs/claude-handoff/archive/2026-06-20-repository-foundation.md`
- No GitHub remote added
- Nothing pushed

Git identity (user.name / user.email) was not configured locally or globally at the end of this session. Commit pending founder confirmation of preferred Git email.

---

## Visible and Testable

All documentation files are visible and reviewable in VS Code. There is no application interface at this stage. No browser testing is required.

---

## Founder Review Status

Founder review recommended for all foundational files before proceeding to GitHub setup or application development:

- `CLAUDE.md`
- `README.md`
- `docs/FOUNDER_DECISIONS.md`
- `docs/claude-handoff/current.md`

---

## Remaining Work

- First local Git commit (pending Git identity confirmation)
- Private GitHub repository creation (`oncue`) and connection
- First GitHub push (requires explicit founder approval)
- Application framework selection
- Application scaffolding
- Supabase setup
- Deployment setup
- Timeline Intelligence prototype

---

## Next Recommended Step

Confirm the Git email address to use for commits, then create the first local commit with message `Initialize OnCue project foundation`. After that, create an empty private GitHub repository named `oncue` (no README, .gitignore, or licence) and connect the local `main` branch after explicit founder approval.
