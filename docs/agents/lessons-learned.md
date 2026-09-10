# Agent Lessons

This note records confirmed project workflow mistakes and the checks that prevent them from recurring.

## L-001 — Fetch issue metadata before issue bodies

- Date: 2026-09-10
- Failure: The first pass fetched the bodies of all 20 issues.
- Evidence: The issue listing response contained every issue body before an issue had been selected.
- Prevention: List only issue number, title, state, and labels first. Fetch the body and comments only for the selected issue with `gh issue view <number>`.
- Validation: The initial listing output contains no issue bodies for unrelated issues.

## L-002 — Check host database ports before starting containers

- Date: 2026-09-10
- Failure: A container and the existing PostgreSQL server listened on conflicting database ports, so the backend connected to the wrong database.
- Evidence: The project now publishes the container on host port `55432` and the backend uses that port.
- Prevention: Inspect host listeners before starting PostgreSQL. If the default host port is occupied, choose an unused port such as `55432` and update the backend connection, Compose mapping, migrations, and documentation together.
- Validation: Run a backend database health check and verify that it reaches the container published on `55432`.
