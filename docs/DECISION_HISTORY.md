# Decision History

This document records product and architecture decisions made during discovery, including their rationale, trade-offs, and deferred alternatives.

## 14 August 2026

### Product purpose

The primary purpose is to continuously improve the user's own agent workflow. The dashboard is a reading and evidence interface, not the product's primary outcome.

The desired learning loop is: ingest Anthropic material, extract traceable guidance, compare it with the user's workflow, propose small experiments, and support a recurring Workflow Review.

### MVP capabilities

The MVP will provide two user-facing capabilities:

- **Ask Anthropic** answers questions using retrieval over the Anthropic Corpus and cites precise Source locations.
- **Project Audit** reads a user-selected project's agent configuration and presents possible improvements with supporting Evidence.

The Project Audit may read `AGENTS.md`, `CLAUDE.md`, Skills, Hooks, and MCP configuration. It will not modify any project file. Automatic configuration changes are deferred because source interpretation and project applicability require human review.

### Source authority

Every Source will have one Authority Tier:

1. Official Anthropic guides and documentation
2. Official Anthropic research and engineering publications
3. Anthropic-published interviews, talks, and media
4. Public statements from Anthropic employees
5. Third-party material about Anthropic

Employee statements may produce experiment suggestions but cannot independently produce formal configuration recommendations. Third-party material is reference-only unless corroborated by a higher-tier Source.

Authority and extraction confidence are separate concepts. Authority describes the Source; extraction confidence describes how reliably the system interpreted a passage.

### Canonical Claims and Evidence

The system will display one Canonical Claim for a repeated idea rather than exposing every extracted variation by default. Users may open the Canonical Claim to inspect all supporting, qualifying, or contradicting Evidence.

Evidence remains a separate domain concept because a Source can support multiple Canonical Claims and a Canonical Claim can be connected to multiple Sources. Each Evidence record identifies the exact quotation or transcript segment, location or timestamp, relationship type, and extraction confidence.

This design reduces interface noise while preserving traceability and future conflict detection. Storing only a `source_id` on each claim was rejected because it would either duplicate claims or make multi-source support difficult to query and verify.

### Local-first architecture

The MVP will run locally. This allows the Project Audit to read an explicitly selected local project without uploading its configuration to a hosted service.

PostgreSQL will store relational metadata, cleaned text, full-text search indexes, embeddings, Canonical Claims, and Evidence. Vector search will use `pgvector`; a separate vector database is not needed for the MVP.

Local-first deployment is preferred over a hosted application for the MVP because direct project access and privacy are more important than multi-user availability. A hosted public Anthropic Corpus may be reconsidered later.

The MVP will start its frontend and backend locally and expose the dashboard through `localhost`. Desktop packaging and hosted deployment are deferred until the local learning loop is validated.

The frontend will use React with TypeScript. The backend will use FastAPI with Python managed by `uv`. PostgreSQL with `pgvector` will provide relational storage, full-text search, and vector search. Docker Compose will support local infrastructure.

Redis, Celery, a separate vector database, microservices, and desktop packaging are excluded from the initial stack. They may be reconsidered only when a demonstrated requirement justifies them.

### Media retention

The system will not permanently store source audio or video. It will prefer an existing platform transcript. When transcription is required in a later phase, it may temporarily process audio-only media, retain timestamped transcript text, and discard the temporary media after successful validation.

For each media Source, the system will retain the original URL, platform identifier, speaker and publication metadata, retrieval date, transcript method, and timestamped transcript segments. The original URL is a citation pointer rather than a durable archive. If the source becomes unavailable, the retained transcript remains searchable and the Source must be marked unavailable.

This choice minimizes storage cost and avoids maintaining a media archive. The trade-off is that removed media can no longer be independently verified against the original recording.

### Initial ingestion scope

The first ingestion phase will support:

1. Anthropic official documentation, research, and engineering pages
2. Anthropic official papers and PDFs
3. Anthropic interviews and talks on YouTube when a transcript already exists

The following sources are in the parking lot:

- Videos requiring local speech-to-text processing
- X/Twitter posts and threads
- Other social platforms and third-party interviews

These are deferred because transcript generation, thread reconstruction, platform access, and deletion handling add complexity before the core retrieval and Project Audit loop is validated.

### Open-source boundary

The dashboard and ingestion software may be open-sourced later. The software and collected corpus will remain separate concerns; open-sourcing the code will not automatically publish complete third-party transcripts or scraped data.

## Open Decisions

- Whether the local frontend and backend run as one process or separate development processes
- The ingestion and refresh schedule
- How Canonical Claims are created, merged, and revised
- The hybrid retrieval and reranking strategy
- How Project Audit findings are prioritized and evaluated
- The minimum dashboard information architecture
- How the user selects and authorizes a local project
- Corpus licensing, redistribution, and source-specific retention rules
