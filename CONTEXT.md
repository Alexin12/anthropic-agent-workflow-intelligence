# Anthropic Agent Workflow Intelligence

This context describes a local-first learning system that turns public Anthropic material into traceable guidance for improving a user's agent workflow.

## Language

**Source**:
A public document, paper, transcript, interview, or post from which the system extracts knowledge.
_Avoid_: Resource, content item

**Canonical Claim**:
A deduplicated statement representing one core idea supported, qualified, or contradicted by one or more Sources.
_Avoid_: Summary, insight, raw claim

**Evidence**:
A traceable relationship between a Canonical Claim and a precise location in a Source.
_Avoid_: Citation, source link

**Authority Tier**:
A classification of a Source based on how directly it represents Anthropic's official position.
_Avoid_: Confidence score, truth score

**Anthropic Corpus**:
The searchable collection of Sources, Canonical Claims, and Evidence used to answer questions and audit project configuration.
_Avoid_: Knowledge base, dataset, RAG database

**Project Audit**:
A read-only comparison between a selected project's agent configuration and relevant Canonical Claims from the Anthropic Corpus.
_Avoid_: Lint, automatic optimization

**Workflow Review**:
A recurring reflection that connects new Anthropic guidance, a user's current agent configuration, and a small set of proposed experiments.
_Avoid_: Weekly summary, news digest
