## Before starting work

Read in this order. Stop when the task does not need the next item.

1. `CONTEXT.md` — domain vocabulary for this repo.
2. `docs/TECH_STACK.md` — only when the task touches frontend, backend, database, or local runtime.
3. `docs/agents/domain.md` — when domain terms or accepted boundaries matter; follow its on-demand decision-history rule.
4. `docs/Git Workflow.md` — when creating branches, commits, or pull requests.
5. `docs/agents/issue-tracker.md` and `docs/agents/triage-labels.md` — when working with GitHub Issues.
6. `.agent/skills/commit-message/SKILL.md` — when writing a commit message.

Do not read `docs/DECISION_HISTORY.md` unless `docs/agents/domain.md` sends you to a specific section through `docs/adr/INDEX.md`.

## Agent skills

Before starting work, read [docs/agents/lessons-learned.md](docs/agents/lessons-learned.md) and apply any relevant project lessons. Use [.agents/skills/agent-lessons/SKILL.md](.agents/skills/agent-lessons/SKILL.md) when recording confirmed workflow mistakes; keep one canonical entry per root cause.

### Issue tracker

Issues and PRDs for this repo live in GitHub Issues; use the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the five canonical labels `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repo. Read `CONTEXT.md` and, when needed, the relevant decision-history section via `docs/adr/INDEX.md`. See `docs/agents/domain.md`.

### Git workflow

Follow [`docs/Git Workflow.md`](docs/Git%20Workflow.md) for all issue branches, commits, pull requests, merges, and pushes.

### Tech stack

Read [`docs/TECH_STACK.md`](docs/TECH_STACK.md) for the project's technology choices.

### Commit message

Use [`.agent/skills/commit-message/SKILL.md`](.agent/skills/commit-message/SKILL.md) when writing commit messages.

# Agent Workflow

Follow [docs/agents/workflow.md](docs/agents/workflow.md).

Harness pins:

- Cursor: [.cursor/rules/subagent-models.mdc](.cursor/rules/subagent-models.mdc)
- Codex: [.codex/config.toml](.codex/config.toml), [.codex/agents/review-standards.toml](.codex/agents/review-standards.toml), and [.codex/agents/review-spec.toml](.codex/agents/review-spec.toml)
