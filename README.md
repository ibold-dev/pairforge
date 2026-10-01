# PairForge

PairForge is pair-native launch infrastructure for Solana. It helps creators select a transparent launch policy, compile it into a Meteora Dynamic Bonding Curve configuration, and follow the market through DAMM v2 graduation.

## What is in this repository

- `apps/web` - creator, trader, and market-lifecycle experience
- `apps/worker` - lifecycle indexing and verification jobs
- `packages/core` - preset schemas, manifest compiler, units, and invariants
- `packages/meteora` - official Meteora SDK adapter boundary
- `packages/database` - database schema and repositories
- `packages/ui` - shared interface components
- `programs/config-registry` - reserved Anchor program boundary for the preset registry

## Prerequisites

- Node.js 24 or later
- pnpm 10.27 or later
- Docker Desktop for local PostgreSQL and Redis

## Local setup

```sh
corepack enable
pnpm install
cp .env.example .env
docker compose -f infra/docker/compose.yaml up -d
pnpm dev
```

## Quality checks

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Development approach

PairForge uses Meteora's official SDKs for all DBC and DAMM v2 interactions. Market accounts and transaction records are canonical; application data is a derived read model with recorded account addresses, slots, and signatures.

All state-changing work begins with a devnet simulation or dry-run. No wallet material, signing secrets, private RPC credentials, or production keys belong in this repository.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Security concerns belong in [SECURITY.md](SECURITY.md), not public issues.

## License

Distributed under the [MIT License](LICENSE).
