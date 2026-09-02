# stellar-drive-signet CLI

The `stellar-drive-signet` command-line companion to the Signet developer identity registry
on Stellar/Soroban. It lives beside the pnpm workspace rather than inside it —
this is a standalone Go module, not a pnpm package — mirroring the split
between orchestration/UX (Go, here) and anything that must execute Soroban
semantics (Rust, `packages/contracts`).

This module is currently a scaffold: the command tree exists (`stellar-drive-signet
--help`, `stellar-drive-signet --version`), but the actual subcommands (linking a wallet,
managing keys, talking to a deployment) land in follow-up issues.

## Build

```bash
cd cli
go build -o bin/stellar-drive-signet ./cmd/stellar-drive-signet
```

To bake a version string and commit hash into the binary:

```bash
go build \
  -ldflags "-X main.version=$(git describe --tags --always) -X main.commit=$(git rev-parse --short HEAD)" \
  -o bin/stellar-drive-signet ./cmd/stellar-drive-signet
```

## Test / lint

```bash
go vet ./...
go test ./...
golangci-lint run ./...
```

No cgo is used anywhere in this module, so it cross-compiles with the
standard `GOOS`/`GOARCH` combinations, e.g.:

```bash
GOOS=darwin GOARCH=arm64 go build -o bin/stellar-drive-signet-darwin-arm64 ./cmd/stellar-drive-signet
GOOS=linux  GOARCH=amd64 go build -o bin/stellar-drive-signet-linux-amd64  ./cmd/stellar-drive-signet
```

## Layout

| Path | Purpose |
|------|---------|
| `cmd/stellar-drive-signet` | `main.go` — the binary's entrypoint |
| `internal/cmd` | Cobra command tree |
| `internal/link` | Bind a wallet to a Signet handle (scaffolded, not yet implemented) |
| `internal/keys` | Local signing key management (scaffolded, not yet implemented) |
| `internal/spec` | Typed request/response models for a Signet deployment's HTTP API (scaffolded, not yet implemented) |
