# OnCue — Claude Code Instructions

## Product Definition

OnCue is a **Timeline Intelligence** platform focused on event execution and coordination. It understands dependencies, priorities, constraints, and execution conditions rather than merely displaying a timeline.

**OnCue's core promise:**
- Reduce stress and eliminate surprises.
- Clarify what is happening now and what happens next.
- Clarify who is responsible.
- Identify what requires attention.

**OnCue is not:**
- A CRM.
- A project-management tool.
- A wedding-planning platform.
- A full event-management suite.

---

## Required Startup Reading

At the start of every session involving substantial work, read these files in order:

1. `CLAUDE.md` (this file)
2. `docs/claude-handoff/current.md` — current operational state
3. `docs/FOUNDER_DECISIONS.md`
4. The authoritative OnCue Master Docs in Google Drive:

   **`~/Library/CloudStorage/GoogleDrive-kevin@bcenergyalliance.org/My Drive/Honeycomb_software/OnCue Timeline Intelligence/_Master DOCS`**

   The folder contains `OnCue Master Document V2.gdoc` and `OnCue Founder Decisions Log.gdoc`. These are Google Docs pointer files and are not readable as plain text. To read them, the founder must open them in a browser via Google Drive. Do not claim to have read a `.gdoc` file unless its actual document content was accessible.

   Archived, readable copies of earlier strategy documents are located at:

   `~/Library/CloudStorage/GoogleDrive-kevin@bcenergyalliance.org/My Drive/Honeycomb_software/OnCue Timeline Intelligence/Archive`

Consult the Master Docs before making strategic, architectural, branding, pricing, roadmap, feature-prioritization, or major UX recommendations.

---

## "Next" Command Protocol

When the founder sends the single word `next` as the entire prompt, Claude must automatically:

1. Read `docs/claude-handoff/current.md` completely.
2. Check the actual repository state when needed to verify whether the handoff is current.
3. Provide a brief high-level summary in plain, non-technical language covering:
   - what has been completed
   - what is still unfinished
   - whether anything is currently visible and testable
   - whether founder review is recommended now
4. Identify the single best next step.
5. Provide the exact next Claude Code prompt when the next step requires Claude Code work.
6. Provide a direct founder action instead when the next step must be performed manually (such as creating an account, reviewing a page, or confirming a setting).
7. Never skip over unfinished work merely because a later task appears more interesting or productive.
8. Never move to a new phase while the current step remains incomplete, unless the founder explicitly chooses to defer it.
9. Do not ask the founder to restate the workflow.
10. Keep the explanation concise, clear, and suitable for a non-technical founder.

**Important:**
- The `next` protocol applies only when `next` is the entire prompt. If the founder uses the word within a longer sentence, interpret the full sentence normally.
- The live handoff is the starting point, but verified repository evidence overrides stale handoff wording.
- If the handoff is stale, update it as part of the next completed meaningful task.

---

## Source of Truth Order

When facts conflict across sources, use this precedence order:

1. Readable authoritative OnCue Master Docs (Google Drive `_Master DOCS` folder)
2. `docs/FOUNDER_DECISIONS.md`
3. `docs/claude-handoff/current.md` — current progress and operational state only; not a source of strategy
4. `README.md` — repository orientation
5. Existing code and verified implementation evidence

`docs/claude-handoff/current.md` records what is built and what is in progress. It must not be used to invent or approve new strategy.

Conflicts with the authoritative documentation must be identified explicitly rather than silently resolved.

---

## Product and Architecture Rules

- Maintain a generic, event-agnostic Event architecture.
- Do not hardcode wedding assumptions into core data structures.
- Wedding functionality should primarily exist through templates and intelligence layers.
- **Timeline Intelligence is the primary strategic moat.**
- **Family Group Optimizer is the secondary strategic moat.**
- **Execution Intelligence is the tertiary strategic moat.**
- Model dependencies, priorities, constraints, locations, travel time, setup time, minimum duration, buffers, recovery options, responsibilities, anchors, and environmental sensitivity.
- Recommend consequential timeline changes rather than silently applying destructive changes. Recommendations must explain the issue, the proposed adjustment, and its likely effect.
- Keep planning mode detail-rich. Keep execution mode extremely simple and low cognitive load.
- Preserve printability for filtered and role-based views.
- Prefer simplicity, speed, clarity, and one-handed usability.
- Avoid enterprise complexity, unnecessary configuration, and premature integrations.
- Build the smallest working version that proves Timeline Intelligence.

---

## Continuity and Unfinished Work

- Read `docs/claude-handoff/current.md` before beginning substantial work in any session.
- Continue the current incomplete task before proposing unrelated work.
- Do not mark a phase complete when required verification is still pending.
- Do not silently defer unresolved blockers — state them explicitly.
- Preserve the exact next step in the live handoff at the end of every meaningful session.
- Verify completion from actual repository or system evidence, not merely from an earlier Claude statement.
- If the handoff is stale or inconsistent with the actual repository state, update it before proceeding.

---

## Planning and Scope Control

- Inspect existing files and repository state before editing.
- State the task scope before making broad changes.
- Keep each task focused on one meaningful outcome.
- Avoid opportunistic refactors unrelated to the requested work.
- Do not add features merely because they might be useful later.
- Prefer the smallest implementation that proves the intended behavior.
- Identify conflicts with the Master Docs or approved founder decisions before proceeding.
- Do not introduce major new product directions without explicit founder approval.

---

## Verification

Never claim success without checking the actual result.

- Read back important files after editing them.
- Run relevant build checks, type checks, or targeted verification when application code exists.
- Clearly distinguish between these states — they are not interchangeable:
  - **written** — code or file exists locally
  - **committed** — change is in a local Git commit
  - **pushed** — commit is on GitHub
  - **deployed** — change is running in a live environment
  - **visible** — the founder can actually see or interact with it
  - **tested** — behavior has been verified by running it
- An implementation is not complete merely because code was generated.
- A migration file does not mean the migration has been applied.
- A feature is not visible merely because source code exists.
- Report failed or skipped verification honestly — do not assume success.

---

## Founder Visibility and Review

After every meaningful unit of work, clearly state:

- What is complete.
- What remains incomplete.
- Which files or systems changed.
- Whether the result is currently visible and testable.
- Exactly where the founder can see or interact with it.
- Whether founder review is recommended now.
- What the founder should specifically inspect.
- Any blockers or unresolved risks.
- The single best next step.

Use plain, non-technical language for all founder-facing explanations.

**Visibility rules:**
- Source code alone does not mean a feature is visible.
- An unapplied database migration is not visible in the working product.
- A change should only be described as visible when the founder can actually open and inspect it in the relevant interface.
- Claude must proactively tell the founder when it is time to review the product. Do not wait for the founder to ask.

After each meaningful task, append a brief structured status:

```
## Review Status
Visible to founder: Yes / No
Where to look: <specific file, page, or "Not applicable yet">
Founder review recommended: Yes / No
Next step: <exact action>
```

---

## Safe Changes

- Recommend consequential changes before applying them automatically.
- Require explicit founder approval before any of the following:
  - pushing to GitHub
  - deploying to any environment
  - changing production data
  - applying database migrations
  - deleting or resetting work
  - replacing major architecture
  - rotating or regenerating secrets
  - any irreversible action
- Never broaden a permission beyond what the current task requires.
- Stop and report unexpected repository state rather than deleting, resetting, or force-fixing it.
- Never delete, reset, or discard unexpected existing work.
- Never commit credentials, secrets, API keys, `.env` contents, private customer information, or sensitive production data.
- When inspecting environment files, report variable names and whether a value exists — never print the value itself.

---

## Low-Risk Approval Standard

During OnCue development sessions, proceed without asking for confirmation on low-risk, reversible local actions.

**Pre-approved — proceed without asking:**
- Reading or searching any file in this repository
- Editing existing project files (source, docs, config)
- Creating normal source or documentation files
- Running `npm install`, `npm run dev`, `npx tsc --noEmit`
- Running `git status`, `git diff`, `git log`
- Creating local commits
- Archiving `docs/claude-handoff/current.md` before updating it

**Always ask first:**
- `git push` — to any remote
- Deleting files or folders
- Destructive git commands (`reset --hard`, `rebase`, `amend`, force push)
- Database migrations (local or remote)
- Any Supabase production changes
- Changing secrets, auth config, billing settings, or environment variables
- Any action outside the OnCue folder

**Decision rule:** If the action is local, reversible through Git, and inside the OnCue folder — proceed. If the action is destructive, external, production-facing, or difficult to reverse — ask first.

---

## Git Workflow

- Run `git status` before staging or committing.
- Stage only the files intended for the current commit.
- Use small, descriptive commit messages.
- Do not include unrelated file changes in a commit.
- Do not push without explicit founder approval.
- Record the actual commit hash in the live handoff after a successful commit.
- Record whether commits are local-only or pushed.
- Do not invent or assume Git identity — stop and ask if name or email is missing.
- Avoid unnecessary dependencies.

---

## Claude Handoff Protocol

1. Read `docs/claude-handoff/current.md` before substantial work.
2. Treat it as the current operational state, not as a source of new strategy.
3. Before replacing it after a meaningful milestone, copy the existing version into `docs/claude-handoff/archive/`.
4. Use archive filenames in this format: `YYYY-MM-DD-HHMM-short-milestone-name.md`.
5. Archive only meaningful milestones, not every minor edit. Milestones include: significant feature implementations, major workflow changes, git commits, pushes to GitHub, deployments, database migrations, and any high-risk work.
6. Keep the live handoff concise and action-oriented.
7. Each archive entry must record:
   - objective or task
   - work completed
   - files or systems changed
   - commands run where relevant
   - verification or test results
   - visible and testable status
   - risks or unresolved issues
   - exact next step
8. Never overwrite or delete prior archive entries.
9. Do not use the handoff archive as a substitute for Git history.
10. Update the live handoff after every meaningful completed unit of work.
11. Include commands, verification evidence, and exact file paths where useful.
12. Preserve historical facts — do not rewrite prior archive entries to reflect later decisions.
13. Never record a push, deployment, migration, or other future action as completed before the command succeeds and the result is verified. Planned work must be labelled pending or in progress.

---

## Documentation Discipline

- Product strategy belongs in the authoritative Master Docs and `docs/FOUNDER_DECISIONS.md`.
- Operational state belongs in `docs/claude-handoff/current.md`.
- Historical operational milestones belong in `docs/claude-handoff/archive/`.
- Repository orientation belongs in `README.md`.
- Durable Claude behavior belongs in `CLAUDE.md`.
- Do not duplicate large sections unnecessarily across documents.
- Do not mark proposals, assumptions, or AI recommendations as founder-approved decisions.
- Keep `CLAUDE.md` concise and durable. Do not place temporary progress notes here.
- Do not edit authoritative Google Drive documents unless the founder explicitly requests it.

---

## Attribution and Ownership

- Do not add `Co-Authored-By` trailers or attribution lines for Claude, Anthropic, or any AI tool.
- Do not attribute commits, files, or generated content to Claude or Anthropic.
- Commit messages must describe the technical change only.
- The software, product concept, architecture direction, and ownership belong to the founder.
- AI tools are implementation assistants only.
