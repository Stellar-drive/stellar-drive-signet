# stellar-drive-signet CLI

The `stellar-drive-signet` command-line companion to the Signet developer identity registry
on Stellar/Soroban. It lives beside the pnpm workspace rather than inside it —
this is a standalone Go module, not a pnpm package — mirroring the split
between orchestration/UX (Go, here) and anything that must execute Soroban
semantics (Rust, `packages/contracts`).

This module is currently a scaffold: the command tree, configuration, and
identity resolution exist, but the actual subcommands (linking a wallet,
managing keys, talking to a deployment) land in follow-up issues.

## Configuration

Every command reads two settings — which Signet deployment to talk to, and
which local identity to sign as — resolved in this order, highest priority
first:

1. A command-line flag: `--url` / `--source`
2. An environment variable: `SIGNET_URL` (for the deployment URL only —
   there is no environment override for the identity)
3. The config file: `$XDG_CONFIG_HOME/stellar-drive-signet/config.json` on Linux,
   `~/Library/Application Support/stellar-drive-signet/config.json` on macOS,
   `%AppData%\stellar-drive-signet\config.json` on Windows (`os.UserConfigDir()`)
4. The built-in default deployment — no config file is required to use it

```json
{
  "baseUrl": "https://my-self-hosted-stellar-drive-signet.example",
  "source": "alice"
}
```

Passing `--source` explicitly updates the config file's `source` so the next
invocation doesn't have to repeat it — that's what makes repeat runs not
re-ask which identity to use. `--url` is read from the config file but never
written back by a flag; edit the file (or keep using `--url`/`SIGNET_URL`) to
change the configured deployment. See `internal/config` for the resolution
logic and its tests.

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
| `internal/config` | Resolves `--url`/`--source`/`SIGNET_URL`/the config file into the settings a run uses |
| `internal/link` | Bind a wallet to a Signet handle (scaffolded, not yet implemented) |
| `internal/keys` | Local signing key management (scaffolded, not yet implemented) |
| `internal/spec` | Typed request/response models for a Signet deployment's HTTP API (scaffolded, not yet implemented) |
