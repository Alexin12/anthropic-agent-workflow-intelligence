# MVP Plan

Status: planned; implementation has not started.

## Goal and scope

Deliver a private, single-user, local application that answers questions about Anthropic guidance with precise Source locations and audits an explicitly selected project's agent configuration without changing its files.

Use [CONTEXT.md](CONTEXT.md) for domain terminology and [Decision History](docs/DECISION_HISTORY.md) for accepted behavior and architecture. All work outside this MVP belongs in the [project Parking Lot](docs/DECISION_HISTORY.md#parking-lot).

The MVP includes:

- Four dashboard surfaces: Ask Anthropic, Project Audit, Review Queue, and Sources.
- Exactly three Source Connectors: `anthropic_web`, `anthropic_papers`, and `anthropic_youtube`, plus single-URL ingestion for supported formats.
- Manual ingestion and refresh, immutable Source Revisions, traceable Evidence, and human-approved Canonical Claims.
- Task-routed vector search: Source chunks for Ask Anthropic; approved Canonical Claims with relational Evidence loading for Project Audit.
- React and TypeScript, FastAPI managed with `uv`, and PostgreSQL with `pgvector` in Docker Compose. Frontend and backend run on the host.

## Delivery sequence

Work through these increments in order. Complete and validate each increment before starting the next. During implementation, create a separate `codex/` branch for each feature; do not combine multiple features in one branch. Resolve exact package versions and APIs against current official documentation when each increment begins.

### 1. Establish the local application

- [ ] Start React, FastAPI, and PostgreSQL with `pgvector`; verify the frontend can reach the backend and the backend can reach the database.
- [ ] Add the initial schema and migrations for Sources, immutable Source Revisions, and location-preserving chunks.
- [ ] Configure local model and embedding execution that satisfies the accepted local-storage and no-upload boundaries; verify this before processing real corpus text or project configuration.
- [ ] Exclude corpus data and generated local state from version control. Add minimal startup instructions.

Acceptance: a clean local setup starts successfully, a database write survives restart, and the configured processing path keeps corpus and project data local.

### 2. Complete one web Source ingestion path

- [ ] Add manual HTML URL ingestion to Sources with provenance, Authority Tier, attribution, retrieval time, and available license or terms metadata.
- [ ] Preserve headings, paragraphs, and exact Source locations; generate embeddings for chunks using the initial 600-token maximum and 100-token overlap with one configured tokenizer.
- [ ] Treat an unchanged refresh as a duplicate; create a new immutable revision for changed normalized text. Default retrieval uses the active revision while historical Evidence retains its original revision.
- [ ] Show ingestion status and revision history. A failed refresh creates no revision and marks the Source unavailable.

Acceptance: ingest, repeat, change, and fail a refresh of a controlled HTML fixture; verify Source identity, revision immutability, status, and location traceability.

### 3. Deliver Ask Anthropic

- [ ] Add question input, answers, and expandable Source Evidence details.
- [ ] Run one vector search over Source chunks and ground answers in the retrieved text, including the relevant revision and precise location.
- [ ] Make successfully ingested text available before Canonical Claim review. Clearly indicate when the corpus does not support an answer.

Acceptance: a supported question opens the correct Source passage; an unsupported question produces no invented answer or location. Verify that default retrieval stops returning superseded chunks after a successful refresh.

### 4. Complete the supported ingestion scope

- [ ] Add PDF ingestion with page-level locations and YouTube ingestion with existing supported platform transcripts and timestamped segments; do not retain audio or video.
- [ ] Implement source-specific chunking: structural document boundaries, deterministic Q&A grouping only with stable speaker labels and known roles, and chronological sliding windows otherwise. Preserve question context when splitting long answers.
- [ ] Add the three named Source Connectors and manual connector runs to Sources. Use parsed links or configured channel/playlist listings rather than open web search.
- [ ] Store trusted entry points, allowlists, exclusions, and discovery limits in version-controlled YAML. Require schema validation and a discovery dry-run for policy changes; record connector identifiers and configuration hashes.
- [ ] Tag deliberate single-URL additions as manual Sources without changing connector policy. Classify third-party material as reference-only unless corroborated by eligible higher-tier Evidence.

Acceptance: each connector ingests an allowed fixture and rejects an out-of-policy fixture; limits are enforced. PDF answers open the correct page, transcript answers open the correct timestamp, and videos without supported transcripts are skipped with a visible reason. Removing an allowlist rule leaves existing Sources intact.

### 5. Deliver the Canonical Layer and Review Queue

- [ ] Extend storage for Candidate Claims, Canonical Claims, Evidence relationships, and source-batched review decisions.
- [ ] Extract atomic Candidate Claims after successful ingestion and propose operations against similar existing Canonical Claims without blocking Source Layer availability.
- [ ] Build the source-batched table and detail view showing the candidate, existing claim when relevant, exact Evidence, Authority Tier, extraction confidence, and proposed operation.
- [ ] Support approve create, approve merge, approve qualify, approve contradict, ignore, and defer. Publish Canonical Layer changes only after approval.
- [ ] Permit a merge only when subject, atomic proposition, applicability, and claim type match; attach Evidence without silently rewriting the claim.
- [ ] Add explicit Source deletion that removes its revisions, chunks, and Evidence links, retaining a Canonical Claim only when other Evidence still supports it.

Acceptance: ingestion creates a review batch immediately; unapproved or deferred candidates cannot affect formal audits. Verify each review action, rejection of a scope-changing merge, Evidence links to historical revisions, and deletion with both sole-source and multi-source support.

### 6. Deliver Project Audit and validate the MVP

- [ ] Register a local project path with explicit confirmation of a read-only scan. Read supported `AGENTS.md`, `CLAUDE.md`, Skills, Hooks, and MCP configuration within that directory only.
- [ ] Keep registrations and the last scan local; require manual refresh for another scan. Do not modify files, upload configuration, follow symlinks outside the project, or read global configuration by default.
- [ ] Run one vector search over approved Canonical Claims and load their underlying Evidence through relational joins.
- [ ] Show High, Medium, and Experiment findings using the accepted applicability and Authority Tier rules. Include the rationale and underlying Evidence for every finding; omit unsupported suggestions.
- [ ] Add version-controlled golden project fixtures covering absent, partial, present, and conflicting configurations. Verify priority ordering, no independent T5 findings, and T4 findings restricted to experiments.
- [ ] Validate the complete local loop across all four surfaces: ingest, ask, review, select a project, and inspect a traceable audit finding.

Acceptance: all golden fixture findings have the expected applicability, priority, and precise Evidence. No unapproved claim drives a formal recommendation; scans leave project files unchanged and respect the selected directory boundary.

## MVP completion

The MVP is complete when all increments pass their acceptance checks, all three connectors and four surfaces work together, and the user can trace answers and audit findings to retained Source locations. Precision and traceability take priority over exhaustive recall.

Basic correctness checks belong in this plan. Broader retrieval evaluation, ranking changes, scheduling, distribution, and other extensions remain in the project Parking Lot until the local loop is validated.
