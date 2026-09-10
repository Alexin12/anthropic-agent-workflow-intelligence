# One-Worker Agent Workflow

This file owns ticket flow, review orchestration, and round-log policy. Pre-work reading lives in `AGENTS.md`. Reviewer instructions and harness model pins live only in the harness files linked from `AGENTS.md`.

Work on one ticket per feature branch created from the latest `master` branch. The parent is the only worker and the only agent allowed to edit code. Do not create a coder agent or an Orchestrator.

## Ticket Flow

1. The parent reads the ticket or specification, writes the implementation and tests, and completes focused validation.
2. After the code is ready, the parent launches exactly two review sub-agents in parallel: Standards and Spec. Reviewer behavior is defined in the active harness files (see `AGENTS.md`).
3. Reviewers inspect the same completed diff. They return findings only and never edit code.
4. The parent evaluates both reviews, applies accepted feedback, and reruns relevant validation. Do not spawn additional reviewers.
5. The parent notifies the user immediately before the commit, stages only the implementation, and commits it.
6. After the commit, the parent writes the ticket round log. The log stays untracked unless the user explicitly asks to commit it.
7. The parent prints the exact `git push` and `gh pr create` commands for the user. The parent runs neither command.

## Round Logs

After each ticket, write `docs/agents/round-logs/YYYY-MM-DD-<slug>.md` with these sections:

- `Context`
- `What Happened`
- `Standards Reviewer Process Note`
- `Spec Reviewer Process Note`
- `What to Change Next Time`

Create the directory when needed. Do not stage or commit a round log unless the user explicitly asks.

When a durable workflow pattern emerges, propose it to the user. After approval, record it in [`docs/agents/lessons-learned.md`](lessons-learned.md) using [`.agents/skills/agent-lessons/SKILL.md`](../../.agents/skills/agent-lessons/SKILL.md).
