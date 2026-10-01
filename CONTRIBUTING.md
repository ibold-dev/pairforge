# Contributing to PairForge

## Before you start

Open an issue or discussion for changes that alter product scope, on-chain behavior, data retention, or external APIs. Keep pull requests focused on one reviewable outcome.

## Development workflow

1. Create a focused branch such as `feat/preset-compiler` or `fix/pool-status-reader`.
2. Install dependencies with `pnpm install`.
3. Run the local services only when the change needs them: `docker compose -f infra/docker/compose.yaml up -d`.
4. Add or update tests with behavior changes.
5. Run `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` before opening a pull request.

## Commit messages

Use Conventional Commits:

```text
feat(core): add preset manifest validation
fix(worker): preserve slot ordering during replay
docs: clarify local setup
```

Keep commits small and independently understandable. Avoid unrelated formatting, generated output, or drive-by refactors in a behavior change.

## Solana and Meteora changes

- Use official SDKs and current protocol documentation.
- Make human-unit and base-unit boundaries explicit.
- Use devnet and transaction simulation before a state-changing flow.
- Never add a private key, seed phrase, production RPC credential, or signed transaction payload to a pull request.
- Record verified account addresses, slots, and signatures for lifecycle features.

## Pull requests

Complete the pull-request template. Reviewers should be able to identify the user outcome, validation performed, affected data or on-chain behavior, and rollback path.
