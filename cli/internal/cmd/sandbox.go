package cmd

import (
	"github.com/spf13/cobra"

	"github.com/Stellar-drive/stellar-drive-signet/cli/internal/rpc"
)

func init() {
	register(groupContracts, newSandboxCmd)
}

// newSandboxCmd is the parent of the commands that run a deployed contract
// locally (docs/CONTRACT_SANDBOX_DESIGN.md). It never needs the contract
// simulator itself: only a subcommand that executes contract code locates
// it, so `stellar-drive-signet sandbox --help` works on a machine without one.
func newSandboxCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "sandbox",
		Short: "Run a deployed contract's functions locally against forked state",
		Long: `Run a deployed contract's functions locally, against a fork of the real
ledger pinned at one ledger sequence. Nothing is submitted to the network:
calls execute in the contract simulator (stellar-drive-signet-simulator) that ships with
stellar-drive-signet, and every result says which ledger it ran against.

The network comes from --network (testnet by default). Its RPC is --rpc-url,
then the context's rpc-url (stellar-drive-signet config set rpc-url <url>), then, for
testnet only, https://soroban-testnet.stellar.org. Mainnet has no default.
Before forking, stellar-drive-signet checks the RPC serves the selected network's
passphrase.

The simulator is found through SIGNET_SIMULATOR_PATH, then next to the stellar-drive-signet
binary, then on PATH.`,
		Args: cobra.NoArgs,
		RunE: func(cmd *cobra.Command, _ []string) error {
			return cmd.Help()
		},
	}
	addRPCFlags(cmd)
	return cmd
}

// addRPCFlags adds the RPC flags `sandbox` and `dev` share. --network itself
// is the root's persistent flag; these complete it for internal/rpc.Select.
func addRPCFlags(cmd *cobra.Command) {
	cmd.PersistentFlags().String("rpc-url", "", "Stellar RPC to fork from (overrides the context's rpc-url; testnet defaults to "+rpc.DefaultTestnetURL+")")
	cmd.PersistentFlags().String("network-passphrase", "", "passphrase of a custom --network (checked against the RPC's getNetwork)")
}
