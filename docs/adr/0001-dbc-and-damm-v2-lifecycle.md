# ADR 0001: Model launches as a DBC-to-DAMM-v2 lifecycle

## Status

Accepted

## Context

PairForge launches need a clear lifecycle that reflects the Meteora primitives they
use. A launch begins as a Dynamic Bonding Curve (DBC) virtual pool and graduates
to a DAMM v2 pool once its configured threshold is reached.

## Decision

PairForge will treat the DBC virtual pool and its DAMM v2 successor as the
canonical source of launch state. The product will model three distinct phases:

1. **Draft**: an off-chain, versioned configuration selected by the creator.
2. **Curve**: the DBC virtual-pool phase, including curve parameters and trading
   fee distribution.
3. **Graduated**: the DAMM v2 liquidity phase, including liquidity ownership and
   locking policy.

The interface may show an indexed lifecycle timeline, but every displayed state
must remain traceable to a canonical account address, transaction signature, and
observed slot.

## Consequences

- A configuration manifest records the SDK version and the complete policy used
  to create each launch.
- Curve-phase fee sharing and post-graduation liquidity allocation are separate
  policies. They must never be represented as one percentage field.
- No product-specific curve math or transaction builders will be implemented.
  Integration code will use the official SDKs.
- The first implementation is devnet-only and begins with simulation before any
  transaction is offered for signing.
