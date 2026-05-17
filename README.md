# Signet

Signet is a verifiable developer career record built on Stellar/Soroban.
Developers link their deployment wallets to a profile, on-chain attestations
bind wallet → identity, and an indexer pulls every contract they've deployed
along with its activity. Public profiles live at `{handle}.stellar-drive-signet.dev`.

> **Status:** scaffolding. Directory structure, tooling, and stubs only —
> business logic, contracts, schema, and UI come in subsequent passes. See
> [`NEXT_STEPS.md`](./NEXT_STEPS.md).

## Prerequisites

- **Node.js 20+** (see [`.nvmrc`](./.nvmrc))
- **pnpm 9+** (`npm i -g pnpm`)
- **Docker** (for the local Postgres container)
- **Rust + `wasm32-unknown-unknown` target** (for the Soroban contracts):

  ```bash
  rustup target add wasm32-unknown-unknown
  ```

## Setup

```bash
git clone <repo> stellar-drive-signet && cd stellar-drive-signet
pnpm install
cp .env.example .env
pnpm db:up          # start local Postgres
pnpm db:migrate     # create the schema
pnpm dev            # run web (and other apps) via Turborepo
```

The web app serves on http://localhost:3000. Subdomains map to surfaces; on
plain `localhost` use the path-based fallback:

| Surface   | Subdomain               | Path fallback (localhost)     |
| --------- | ----------------------- | ----------------------------- |
| Marketing | `stellar-drive-signet.dev`            | `/`                           |
| Dashboard | `app.stellar-drive-signet.dev`        | `/app`                        |
| Docs      | `docs.stellar-drive-signet.dev`       | `/docs`                       |
| Profile   | `{handle}.stellar-drive-signet.dev`   | `/@{handle}` or `/{handle}`   |

See [`apps/web/middleware.ts`](./apps/web/middleware.ts) for routing details.

## Directory structure

| Path              | Purpose                                                       |
| ----------------- | ------------------------------------------------------------- |
| `apps/web`        | Next.js App Router app + tRPC API (all subdomains)            |
| `apps/indexer`    | Long-running TypeScript worker that indexes on-chain activity |
| `packages/contracts` | Soroban Rust contracts (Cargo workspace) — see its README  |
| `packages/db`     | Prisma schema + generated client (`@stellar-drive-signet/db`)              |
| `packages/sdk`    | External SDK for integrators (`@stellar-drive-signet/sdk`)                  |
| `packages/types`  | Shared TypeScript types (`@stellar-drive-signet/types`)                     |
| `packages/ui`     | Shared React components (`@stellar-drive-signet/ui`)                        |
| `infra`           | Local dev infra (Docker Postgres) — see its README           |

## Scripts

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `pnpm dev`          | Run all apps via Turborepo                    |
| `pnpm build`        | Build all workspaces                          |
| `pnpm lint`         | Lint all workspaces                           |
| `pnpm typecheck`    | Typecheck all workspaces                      |
| `pnpm test`         | Run workspace tests                           |
| `pnpm db:up` / `db:down` | Start / stop local Postgres             |
| `pnpm db:migrate`   | Run Prisma migrations                         |
| `pnpm db:generate`  | Regenerate the Prisma client                  |

## Per-package docs

- [`packages/contracts/README.md`](./packages/contracts/README.md)
- [`packages/contracts/identity-registry/README.md`](./packages/contracts/identity-registry/README.md)
- [`infra/README.md`](./infra/README.md)
