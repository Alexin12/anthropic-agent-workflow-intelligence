# Domain Docs

This is a single-context repository.

## Before exploring

- Always read `CONTEXT.md` at the repository root for vocabulary and domain terms.
- Do **not** read `docs/DECISION_HISTORY.md` by default. It is a human archive and on-demand reference, not a startup checklist.
- When a task may change product scope, architecture, ingestion, retrieval, audit behavior, or connector policy, open [`docs/adr/INDEX.md`](../adr/INDEX.md) and read only the linked section(s) in decision history.
- If a referenced file does not exist, proceed without creating it upfront.

## Vocabulary

Use the terms defined in `CONTEXT.md` for issue titles, plans, implementation, and tests. Avoid synonyms explicitly marked as terms to avoid.

## Decision conflicts

If a proposed change conflicts with an accepted decision in the relevant decision-history section, identify that conflict explicitly instead of silently overriding it.
