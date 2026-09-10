# One-Worker Agent Workflow

This file owns the repository's implementation, review, and round-log policy. Harness-specific model pins live only in the harness files linked from `AGENTS.md`.

## Before Work

1. Read `CONTEXT.md`.
2. Read `docs/TECH_STACK.md` when the ticket touches the frontend, backend, database, or local runtime.
3. Read `docs/agents/domain.md` when domain terms or accepted boundaries matter. Follow its on-demand decision-history rule.
4. Read `docs/Git Workflow.md` for branch, commit, and pull-request rules.
5. Read `docs/agents/issue-tracker.md` and `docs/agents/triage-labels.md` when working with GitHub Issues.
6. Read `.agent/skills/commit-message/SKILL.md` before writing a commit message.

Do not read `docs/DECISION_HISTORY.md` unless `docs/agents/domain.md` routes the task to a specific section through `docs/adr/INDEX.md`.

Work on one ticket per feature branch created from the latest `master` branch. The parent is the only worker and the only agent allowed to edit code. Do not create a coder agent or an Orchestrator.

## Ticket Flow

1. The parent reads the ticket or specification, writes the implementation and tests, and completes focused validation.
2. After the code is ready, the parent launches exactly two review sub-agents in parallel: Standards and Spec.
3. Reviewers inspect the same completed diff. They return findings only and never edit code.
4. The parent evaluates both reviews, applies accepted feedback, and reruns relevant validation. Do not spawn additional reviewers.
5. The parent notifies the user immediately before the commit, stages only the implementation, and commits it.
6. After the commit, the parent writes the ticket round log. The log stays untracked unless the user explicitly asks to commit it.
7. The parent prints the exact `git push` and `gh pr create` commands for the user. The parent runs neither command.

## Review Contract

The hierarchy depth is one: only the parent may spawn sub-agents. Each reviewer prompt must say:

> Do not spawn further agents. If you attempt to spawn one, stop and return exactly: depth limit reached

The Standards reviewer checks the completed diff against repository instructions, documented coding standards, architecture boundaries, and required validation. The reviewer reports actionable findings with file and line evidence.

The Spec reviewer checks the completed diff against the originating ticket, specification, acceptance criteria, and requested scope. The reviewer reports missing, incorrect, or out-of-scope behavior with file and line evidence.

Each reviewer ends its return with exactly one final line:

`Process note: <one sentence>`

Use `Process note: (none)` when there is no useful process observation.

## Round Logs

After each ticket, write `docs/agents/round-logs/YYYY-MM-DD-<slug>.md` with these sections:

- `Context`
- `What Happened`
- `Standards Reviewer Process Note`
- `Spec Reviewer Process Note`
- `What to Change Next Time`

Create the directory when needed. Do not stage or commit a round log unless the user explicitly asks.

Propose durable workflow patterns to the user. Add an approved pattern to `.claude/agents/lessons-learned.md` only after the user approves it; do not write unapproved patterns there.
