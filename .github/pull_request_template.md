## Summary

Describe the user-facing outcome and the reason for the change.

## Validation

- [ ] `pnpm format:check`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] Added or updated tests where behavior changed

## Risk review

- [ ] No secrets, private keys, or production credentials are included
- [ ] No unexpected signing, asset movement, or custody behavior is introduced
- [ ] RPC, indexer, and data freshness implications are documented where relevant
- [ ] Rollback or mitigation is clear for user-visible changes

## Documentation

- [ ] README, architecture, API, or runbook updates are included where needed
- [ ] No documentation changes are required
