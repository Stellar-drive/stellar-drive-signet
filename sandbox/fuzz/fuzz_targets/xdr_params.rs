//! `cargo +nightly fuzz run xdr_params`: see sandbox/README.md. The body is
//! `stellar-drive-signet_simulator::fuzzing::xdr_params`, which tests/fuzz_smoke.rs also runs on stable.
#![no_main]

use libfuzzer_sys::fuzz_target;

fuzz_target!(|data: &[u8]| stellar-drive-signet_simulator::fuzzing::xdr_params(data));
