# ADR 0002: Make launch presets versioned, immutable manifests

## Status

Accepted

## Context

Launch policies need to be understandable, repeatable, and comparable after a
token is live. Mutable presets make a historical launch impossible to reproduce.

## Decision

PairForge will represent a preset as an immutable, versioned policy manifest.
Each manifest has a deterministic digest produced from canonical JSON. A launch
draft stores the exact preset identifier, version, and digest it was composed
from.

A change to economic behavior, validation rules, or defaults creates a new preset
version rather than changing an existing one.

## Consequences

- Creators can review a concrete policy before composing a transaction.
- Indexers and UIs can identify the policy that produced a launch without relying
  on a mutable database record.
- A future configuration marketplace can attach authorship, pricing, and
  reputation to a stable version.
- The first release keeps manifest publication off-chain. An optional registry
  program is deferred until the lifecycle and marketplace requirements justify
  its on-chain cost.
