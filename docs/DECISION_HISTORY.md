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

Canonical Corpus changes will use a review gate. Ingestion may automatically extract Candidate Claims, retrieve similar Canonical Claims, and propose creating, merging, qualifying, or contradicting a claim. A user must approve any operation that creates or changes a Canonical Claim or records a substantive conflict.

The review gate applies to Corpus changes rather than every raw transcript segment. High-confidence Evidence attachment may become automatic after the extraction pipeline is validated, but automatic creation or rewriting of Canonical Claims is not part of the MVP.

Each Canonical Claim will contain one atomic judgment rather than a compound summary. It will record a statement, claim type, applicability, and lifecycle status. Initial claim types are principle, workflow, prompt pattern, harness pattern, limitation, and prediction.

Atomic claims are required so retrieval and Project Audit can evaluate applicability independently. A Source passage containing several recommendations will therefore produce several Candidate Claims rather than one broad claim.

### Local-first architecture

The MVP will run locally. This allows the Project Audit to read an explicitly selected local project without uploading its configuration to a hosted service.

PostgreSQL will store relational metadata, cleaned text, full-text search indexes, embeddings, Canonical Claims, and Evidence. Vector search will use `pgvector`; a separate vector database is not needed for the MVP.

Local-first deployment is preferred over a hosted application for the MVP because direct project access and privacy are more important than multi-user availability. A hosted public Anthropic Corpus may be reconsidered later.

The MVP will start its frontend and backend locally and expose the dashboard through `localhost`. Desktop packaging and hosted deployment are deferred until the local learning loop is validated.

The frontend will use React with TypeScript. The backend will use FastAPI with Python managed by `uv`. PostgreSQL with `pgvector` will provide relational storage, full-text search, and vector search. Docker Compose will support local infrastructure.

Redis, Celery, a separate vector database, microservices, and desktop packaging are excluded from the initial stack. They may be reconsidered only when a demonstrated requirement justifies them.

### Application process boundary

The MVP will use one repository with separate frontend and backend processes. React will run through its local development server, communicate with FastAPI through an HTTP REST API, and use PostgreSQL through the backend only. PostgreSQL will run through Docker Compose; the frontend and backend will run directly on the host during development.

This structure was selected because it keeps the interactive UI independent from the Python ingestion and RAG pipeline, provides clear API boundaries, and preserves straightforward hot reload and debugging.

Two alternatives were considered:

- A FastAPI monolith using server-rendered templates would reduce the number of processes and eliminate most frontend API coordination, but it would make a growing interactive research dashboard harder to develop and test.
- A Tauri desktop application with a packaged backend sidecar would provide native file selection and easier end-user distribution, but it would introduce desktop packaging, inter-process communication, platform testing, signing, and permission management before the local workflow is validated.

A TypeScript full-stack framework with a separate Python ingestion worker was also considered but not selected. It would retain two runtimes while adding a second backend boundary; the framework's backend-for-frontend layer would not replace the Python processing service.

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

### Ingestion scheduling

The first ingestion pipeline will be triggered manually. This allows source parsing, deduplication, Evidence extraction, and failure recovery to be validated one increment at a time before unattended execution is introduced.

After the pipeline is reliable, the system will add daily incremental source refreshes and a weekly Workflow Review. Scheduling is therefore a later delivery step rather than a dependency of the first working retrieval loop.

### Manual ingestion interface

Manual ingestion will support two inputs:

- Configured Source connectors ingest known Anthropic source collections.
- Single-URL ingestion processes a user-provided page, PDF, or supported YouTube URL.

The MVP will not perform open-ended internet discovery. This boundary keeps provenance, Authority Tier assignment, parser behavior, and ingestion failures observable while still supporting both corpus construction and focused testing.

### Source discovery boundary

Source Connectors will combine curated trusted entry points with automatic discovery inside strict allowlists. The Anthropic website connector may discover matching official documentation and research links; the paper connector may discover linked paper pages and PDFs; the YouTube connector may discover videos only from configured official channels or playlists and accept only videos with supported transcripts.

Connectors will not follow arbitrary external links or infer that a third-party page is official. Single-URL ingestion remains available for deliberate additions outside configured collections.

### Allowlist policy management

Source Connector allowlists will be stored as version-controlled YAML configuration rather than embedded in Connector code or edited through the MVP dashboard. Configuration will define trusted entry points, allowed hosts or platform identifiers, included and excluded paths, and discovery limits.

Every configuration change must pass schema validation and a discovery dry-run before ingestion. Discovery runs will record the Connector identifier and configuration hash so inclusion decisions remain traceable. Removing an allowlist rule stops future discovery but does not delete previously ingested Sources; deletion and scope reclassification remain explicit operations.

Configuration-only changes such as adding an official path, playlist, or discovery limit should not require code changes. Supporting a new platform or incompatible page structure may still require a new Connector or parser.

### Retrieval targets

RAG will retrieve both Canonical Claims and raw Source chunks. Canonical Claims provide deduplicated judgments and are the primary retrieval target for Project Audit. Source chunks preserve original context, conditions, quotations, and speaker-specific language.

Retrieval will be routed by task rather than blending both targets in every request. Ask Anthropic will perform one vector search over Source chunks. Project Audit will perform one vector search over Canonical Claims and then load supporting Evidence through relational joins. Opening Canonical Claim details requires relational queries rather than another search.

A final answer cannot cite a Canonical Claim alone. It must cite the underlying Evidence and Source location.

The MVP will not include full-text retrieval, Reciprocal Rank Fusion, a reranker model, or dynamic metadata score multipliers. Authority Tier will initially act as a transparent eligibility rule: formal audit recommendations require T1–T3 support, T4 may produce experiment suggestions, and T5 cannot independently produce an audit recommendation.

This simpler design makes retrieval failures attributable to corpus quality, chunking, embeddings, or query formulation before fusion and ranking policies are introduced.

### Open-source boundary

The dashboard and ingestion software may be open-sourced later. The software and collected corpus will remain separate concerns; open-sourcing the code will not automatically publish complete third-party transcripts or scraped data.

## 17 August 2026

### Source-specific chunking

Chunking will follow the structure available in each Source type rather than applying one universal splitter. Web pages and PDFs will use headings and paragraphs as primary boundaries, with a token limit as a fallback for oversized sections.

Transcript speaker turns are timestamped storage units, not retrieval chunks. When dialogue structure is available, a retrieval chunk will group an interviewer question with its related answer turns. Brief acknowledgements and interruptions will not create standalone chunks. A long answer may be divided, but each resulting chunk must retain the preceding question as retrieval context while citations continue to point to the original timestamped text.

Dialogue structure is considered available without model inference only when the parser provides stable speaker labels for substantive turns and an interviewer or host role is known through connector metadata or human confirmation. Missing or unstable speaker labels, unidentified roles, plain caption streams, and monologues do not qualify for deterministic Q&A grouping.

When deterministic dialogue structure is unavailable, the system will use a fixed sliding window over chronological transcript segments. It will accumulate complete timestamped segments until a token limit is reached, then begin the next window with a small overlap from the previous window. This fallback does not claim to understand the conversation; it preserves nearby context predictably and reduces boundary loss through overlap.

### Corpus review workflow

Source ingestion and Canonical Layer publication are separate events. After a successful ingestion, the Source and its chunks enter the Source Layer and may be retrieved by Ask Anthropic with direct citations. Candidate Claims are extracted immediately but cannot influence formal Project Audit recommendations until approved into the Canonical Layer.

Proposed Canonical Layer operations will enter a non-blocking dashboard Review Queue rather than interrupt ingestion with modal prompts. Review items will be grouped into batches by Source and may propose creating, merging, qualifying, contradicting, ignoring, or deferring a Candidate Claim. The review interface must show the candidate, the existing Canonical Claim when applicable, exact Evidence, Authority Tier, and available actions.

Exact duplicate Sources identified by stable platform identifiers or content hashes may be skipped automatically. Semantic Claim duplicates still require review because similar wording may hide different applicability or qualifications.

During the MVP, manual ingestion will immediately create a review batch. After daily scheduling is introduced, the scheduled task may discover Sources, ingest them, extract Candidate Claims, and create review batches, but it may not approve or publish Canonical Layer changes. Canonical Claims change only when a user approves a proposed operation.

## 9 September 2026

### Source revision policy

The system will keep one logical Source with immutable Source Revisions. A successful refresh that changes normalized content creates a new Source Revision under the existing Source; the newest revision is active for default retrieval, while historical Evidence continues to point to the revision from which it was derived. A failed refresh creates no revision and marks the Source unavailable. A new Source is created only when the external identity represents a genuinely different work.

This preserves citation validity, change history, and conflict detection without duplicating one work as several Sources. The trade-off is additional storage and revision-aware deduplication.

### MVP Source Connectors

The MVP will ship exactly three Source Connectors:

1. `anthropic_web` discovers HTML pages from configured Anthropic documentation, research, news, and engineering entry points by following same-host links within YAML path allowlists.
2. `anthropic_papers` discovers official paper landing pages and linked PDFs from configured Anthropic entry points and allowed hosts.
3. `anthropic_youtube` discovers videos only from configured official channel or playlist identifiers and accepts only videos with a supported platform transcript.

Web and paper discovery will use parsed links rather than open web search. YouTube discovery will use configured channel or playlist listings rather than keyword search. All connectors will enforce discovery limits and will not follow arbitrary external links. Single-URL ingestion remains the deliberate escape hatch and is tagged as a manual Source; it does not change connector policy.

This closes the MVP scope while keeping exact entry points and path rules in version-controlled YAML. New platforms, transcript generation, and broader discovery remain later work.

### Canonical Claim review interface and merge criteria

The Review Queue will be a source-batched table with a detail view. Each review item will show the Candidate Claim, the relevant existing Canonical Claim when applicable, exact Evidence, Authority Tier, extraction confidence, and the proposed operation. MVP actions are approve create, approve merge, approve qualify, approve contradict, ignore, and defer.

A merge is allowed only when the candidate and existing claim have the same subject, atomic proposition, applicability scope, and claim type. A merge attaches the new Evidence without silently rewriting the existing claim. A material wording or scope difference must become a qualification, contradiction, or separate Canonical Claim. No semantic duplicate will be auto-merged.

The strict merge rule favors precision and explainability over queue reduction. It leaves more items for review but prevents different conditions from being collapsed into one recommendation.

### Initial retrieval chunk parameters

The initial retrieval parameters will be a 600-token maximum and 100-token overlap, measured with one backend-configured tokenizer. Structural boundaries remain preferred; oversized web sections, PDF sections, long answers, and fallback transcript windows are split to those limits. Transcript Q&A chunks retain the interviewer question as context, including when a long answer must be divided.

These values are intentionally simple starting points that fit both document and transcript retrieval. They are provisional and may change only after the planned retrieval evaluation records a measurable boundary or recall problem.

### Project Audit prioritization and evaluation

Project Audit findings will be grouped into three user-facing priorities:

- **High**: directly applicable claim, clear absent or contradictory project configuration, and T1–T2 Evidence.
- **Medium**: directly or partially applicable claim with a clear gap, or a finding supported by T3 Evidence.
- **Experiment**: T4 Evidence, uncertain applicability, or a recommendation that requires a user test before adoption.

Within a priority, findings will sort by applicability, Authority Tier, and extraction confidence. T5 material will not independently produce an Audit finding. Every displayed finding must include its applicability rationale and underlying Evidence; unsupported or untraceable suggestions are omitted.

Evaluation will use a version-controlled golden fixture set of representative project configurations covering absent, partial, present, and conflicting configuration cases. The MVP success criterion is precision and traceability of displayed findings, not automatic configuration changes or exhaustive recall.

### Minimum dashboard information architecture

The MVP dashboard will have four primary surfaces:

1. **Ask Anthropic** — question input, cited answer, and expandable Evidence details.
2. **Project Audit** — project selection, prioritized findings, and Evidence details.
3. **Review Queue** — batched Candidate Claim review and decisions.
4. **Sources** — manual URL ingestion, connector runs, Source status, and Source Revision history.

There will be no separate settings, analytics, notification, or home-summary surface in the MVP. Connector YAML remains the configuration interface, and each primary surface may expose only the status or detail controls required for its job.

### Local project selection and authorization

The local user will register a project by entering its local path and explicitly confirming a read-only scan. The backend will validate the selected directory and read only supported project configuration files within that directory. It will not upload files, modify files, follow symlinks outside the project, or read global user configuration by default.

Project registrations and the last scan result remain local. No account, login, or hosted authorization service is required for the single-user MVP. Explicit project confirmation is the authorization boundary; a later scan requires a manual refresh action.

This keeps privacy behavior understandable and avoids building desktop permissions or multi-user identity before the local workflow is validated.

### Corpus licensing and retention policy

The MVP is private, local-only, and non-redistributable. Source text, chunks, transcript text, embeddings, and review data must stay in local application storage and must not be committed to the software repository, bundled into releases, exported, or hosted publicly. The system will retain the original URL, attribution metadata, retrieval time, and any available license or terms metadata for each Source.

Official web pages, research pages, and PDFs may be retained as cleaned text and chunks for the user's local workflow. Media handling follows the existing policy: retain timestamped transcript text and metadata, never permanently retain audio or video. Manually added third-party Sources are local reference material and cannot independently support formal Project Audit recommendations.

Source deletion remains explicit. Deleting a Source removes its revisions, chunks, and Evidence links; a Canonical Claim remains only when other Evidence still supports it. Before any hosted or public release, licensing and source-specific retention must be reviewed as a separate decision.

## Open Decisions

No discovery decisions remain open for the MVP. Implementation may revisit these choices only when retrieval evaluation, privacy findings, or a concrete product requirement provides evidence that the current boundary is insufficient.

## Parking Lot

This section is the project-wide backlog for work outside the [MVP plan](../plan.md). Items here are deferred, not implementation commitments. Revisit them only after the local MVP loop is validated and a concrete need justifies expanding scope.

### Scheduling and recurring learning

- Daily incremental Source discovery and refresh, including automatic creation of review batches without approval or publication of Canonical Layer changes.
- Weekly Workflow Review connecting new guidance, current configuration, and proposed experiments.

Keep ingestion and project scans manual in the MVP.

### Additional Sources and media processing

- Videos without supported platform transcripts, including temporary audio-only processing and local speech-to-text generation.
- X/Twitter posts and threads, other social platforms, and third-party interview connectors.
- Additional platforms and broader discovery beyond the three configured MVP Source Connectors. Any open-ended discovery proposal requires a new provenance and inclusion-policy decision.

The MVP's single-URL input remains available for deliberate additions in supported formats. Permanent audio or video archival is not planned.

### Review automation and project changes

- Automatic attachment of high-confidence Evidence after extraction quality is validated.
- Automatic project configuration changes, subject to a separate human-review and authorization design.

Automatic Canonical Claim creation, rewriting, or semantic merging is not an approved follow-up; any proposal must explicitly revisit the human review gate.

### Dashboard expansion

- Separate settings, analytics, notification, and home-summary surfaces.
- Dashboard editing of Source Connector policies instead of version-controlled YAML.

Add these only when the four MVP surfaces and YAML configuration no longer support a demonstrated workflow need.

### Packaging, hosting, and distribution

- Desktop packaging, including Tauri and a backend sidecar, native file selection, signing, permissions, and platform testing.
- Hosted deployment, a public Anthropic Corpus, multi-user access, accounts, and authentication.
- Open-sourcing the software, separately from any decision to redistribute corpus data.
- Corpus export or public distribution, gated on a separate licensing and source-specific retention review.

The MVP remains private, local-only, and non-redistributable. These items do not authorize publishing Source text, transcripts, embeddings, or review data.

### Infrastructure alternatives

- Redis, Celery, a separate vector database, or microservices only if observed workload or reliability requirements justify them.
- Alternative application structures, including server-rendered FastAPI or a TypeScript backend-for-frontend, only if a concrete requirement warrants revisiting the accepted React/FastAPI boundary.

### Retrieval evaluation and evolution

After the MVP is complete, create `docs/RETRIEVAL_EVALUATION.md` to record real retrieval tests across distinct topics. The document must preserve each test query, expected evidence, returned results, relevance judgments, failure analysis, and scores so retrieval changes are based on observed quality rather than intuition.

The planned retrieval stages are:

1. **MVP — task-routed vector search:** Ask Anthropic searches Source chunks; Project Audit searches Canonical Claims.
2. **Recall improvement — task-routed hybrid search:** Add full-text search and Reciprocal Rank Fusion only when evaluation demonstrates missed exact terms, names, identifiers, quotations, or other recall failures.
3. **Mature corpus — advanced ranking:** Consider cross-target retrieval, metadata ranking, query rewriting, or a reranker model only after simpler retrieval has measurable limitations.

Advancement between stages requires recorded evaluation evidence. A later architecture preference alone is not sufficient.
