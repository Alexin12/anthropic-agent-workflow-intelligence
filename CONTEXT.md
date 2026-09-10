# Anthropic Agent Workflow Intelligence

This context describes a local-first learning system that turns public Anthropic material into traceable guidance for improving a user's agent workflow.

## Language

**Source**:
A public document, paper, transcript, interview, or post from which the system extracts knowledge.
_Avoid_: Resource, content item

**Source Revision**:
An immutable captured version of a Source's text and metadata at a particular retrieval time; Evidence points to a specific Source Revision.
_Avoid_: Snapshot, duplicate Source

**Source Connector**:
A bounded discovery and ingestion adapter that starts from trusted entry points and accepts only Sources allowed by its policy.
_Avoid_: Crawler, scraper

**Canonical Claim**:
A deduplicated, atomic statement representing one core idea and its applicability, supported, qualified, or contradicted by one or more Sources.
_Avoid_: Summary, insight, raw claim

**Candidate Claim**:
An unapproved interpretation extracted from a Source and proposed for creation, merging, qualification, contradiction, or rejection.
_Avoid_: Draft claim, pending insight

**Evidence**:
A traceable relationship between a Canonical Claim and a precise location in a Source.
_Avoid_: Citation, source link

**Authority Tier**:
A classification of a Source based on how directly it represents Anthropic's official position.
_Avoid_: Confidence score, truth score

**Anthropic Corpus**:
The searchable collection of Sources, Canonical Claims, and Evidence used to answer questions and audit project configuration.
_Avoid_: Knowledge base, dataset, RAG database

**Source Layer**:
The ingested Source text and chunks that remain directly traceable to original locations and may be used for cited question answering.
_Avoid_: Raw layer, document store

**Canonical Layer**:
The human-approved Canonical Claims and Evidence relationships that may drive formal Project Audit recommendations.
_Avoid_: Processed layer, trusted database

**Review Queue**:
A non-blocking dashboard workspace containing proposed Canonical Layer changes grouped into review batches.
_Avoid_: Approval popup, moderation inbox

**Project Audit**:
A read-only comparison between a selected project's agent configuration and relevant Canonical Claims from the Anthropic Corpus.
_Avoid_: Lint, automatic optimization

**Workflow Review**:
A recurring reflection that connects new Anthropic guidance, a user's current agent configuration, and a small set of proposed experiments.
_Avoid_: Weekly summary, news digest
