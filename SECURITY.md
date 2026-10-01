# Security policy

## Reporting a vulnerability

Do not disclose suspected vulnerabilities in public issues, discussions, pull requests, or chat channels. Use the repository's private security advisory feature when it is enabled, or contact the maintainers through the repository owner.

Include a clear description, affected component, reproduction steps, expected and observed behavior, and any proposed mitigation. Do not include secrets, private keys, or live credentials.

## Scope

Security-sensitive areas include:

- wallet connection and transaction composition
- Meteora DBC and DAMM v2 instruction construction
- quote-mint validation and token-program handling
- preset and license authorization
- lifecycle indexing, replay, and data freshness
- environment configuration, secrets, and deployment infrastructure

## Handling approach

Maintainers will acknowledge reports, assess impact, develop a fix, validate it, and coordinate disclosure. Do not rely on the application for custody of user assets or signing material.
