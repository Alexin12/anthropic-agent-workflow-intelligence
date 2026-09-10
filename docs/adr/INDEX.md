# Architecture decision index

This index routes agents to the relevant section in [`docs/DECISION_HISTORY.md`](../DECISION_HISTORY.md).
Do not read the full decision history up front. Open only the section that matches the task.

| Topic | Read when | Section in decision history |
| --- | --- | --- |
| Product purpose and MVP scope | Changing MVP boundaries or user-facing capabilities | 14 August 2026 — Product purpose, MVP capabilities |
| Source authority and Canonical Claims | Changing ingestion, claims, evidence, or review workflow | 14 August 2026 — Source authority, Canonical Claims and Evidence |
| Local-first stack and process boundary | Changing frontend, backend, database, or deployment shape | 14 August 2026 — Local-first architecture, Application process boundary |
| Media and connector scope | Adding sources, connectors, chunking, or discovery rules | 14 August 2026 — Media retention, Initial ingestion scope; 9 September 2026 — MVP Source Connectors |
| Retrieval and Project Audit rules | Changing search, audit priorities, or dashboard surfaces | 14 August 2026 — Retrieval targets; 9 September 2026 — Project Audit prioritization, Minimum dashboard information architecture |
| Corpus review and scheduling | Changing review queue behavior or deferred automation | 17 August 2026 — Corpus review workflow; Parking Lot — Scheduling |
| Deferred work | Checking whether an idea is already out of MVP scope | Parking Lot |

If no row matches, proceed with `CONTEXT.md` and the code. Do not read decision history speculatively.
