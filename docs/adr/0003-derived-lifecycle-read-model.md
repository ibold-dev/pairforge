# ADR 0003: Keep lifecycle views derived and verifiable

## Status

Accepted

## Context

Launch discovery and dashboards require fast queries across DBC and DAMM v2
activity. On-chain accounts are authoritative but not optimized for product
search, filtering, and history.

## Decision

PairForge will use an indexer and API only as a derived read model. Every record
representing a launch, graduation, fee event, or liquidity position retains the
relevant account addresses, transaction signatures, and observed slot. The UI
will surface links and identifiers needed to verify important lifecycle events.

## Consequences

- A delayed or faulty indexer cannot redefine a launch's economic state.
- Re-indexing from canonical accounts remains possible.
- Product APIs can serve launch discovery without becoming a source of truth.
- Storage schemas must preserve provenance alongside normalized fields.
