# infra

Local development infrastructure.

The indexer worker runs against this Postgres — see
[`docs/INDEXER.md`](../docs/INDEXER.md) for its runbook (workers, cursors, logs,
restart/backfill procedures and troubleshooting).

## Postgres

A single Postgres 16 container for local dev.

```bash
# From repo root
pnpm db:up      # docker compose up -d
pnpm db:down    # docker compose down
```

| Setting  | Value    |
| -------- | -------- |
| Host     | localhost |
| Port     | 5432     |
| User     | stellar-drive-signet   |
| Password | stellar-drive-signet   |
| Database | stellar-drive-signet   |

Connection string (already in `.env.example`):

```
postgresql://stellar-drive-signet:stellar-drive-signet@localhost:5432/stellar-drive-signet
```

Data persists in the named volume `stellar-drive-signet-pgdata`. To wipe it:

```bash
docker compose -f infra/docker/docker-compose.yml down -v
```
