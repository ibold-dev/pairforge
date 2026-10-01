# PairForge engineering instructions

## Meteora integration

- Use the official Meteora SDKs for DBC, DAMM v2, and DLMM interactions. Do not reproduce curve math or transaction builders.
- Treat DBC and DAMM v2 accounts as canonical. Derived read models must retain the source account addresses, slots, and transaction signatures.
- Confirm SDK compatibility against the current official protocol documentation before adding or upgrading an integration.
- Keep transaction construction client-side and return unsigned transactions until the connected wallet signs.
- Start every state-changing flow on devnet with an explicit simulation or dry-run. Mainnet execution requires explicit owner confirmation.

## Security and data handling

- Never commit private keys, seed phrases, signing material, production RPC credentials, or API secrets.
- Make human-unit and base-unit boundaries explicit in types, validation, and user-facing transaction previews.
- Reject unexpected program IDs, unsupported token-mint configurations, and incomplete signer sets before a transaction is presented.

## Repository conventions

- Keep changes focused and covered by tests appropriate to their risk.
- Run formatting, linting, typechecking, tests, and builds before creating a pull request.
- Keep `apps/`, `packages/`, and `programs/` boundaries clear; cross-package dependencies must be intentional and typed.
