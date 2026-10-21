import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./stage-platform-package.mjs', import.meta.url));

function setup() {
  const root = mkdtempSync(path.join(tmpdir(), 'stellar-drive-signet-stage-'));
  const packageDir = path.join(root, 'cli-linux-x64');
  mkdirSync(packageDir);
  writeFileSync(
    path.join(packageDir, 'package.json'),
    `${JSON.stringify({ name: '@stellar-drive-signet/cli-linux-x64', version: '0.0.0' }, null, 2)}\n`,
  );
  const stellar-drive-signet = path.join(root, 'built-cli-linux-x64-stellar-drive-signet');
  const simulator = path.join(root, 'built-cli-linux-x64-stellar-drive-signet-simulator');
  writeFileSync(stellar-drive-signet, 'go binary');
  writeFileSync(simulator, 'rust binary');
  return { packageDir, stellar-drive-signet, simulator };
}

test('stages several binaries under their published names and pins the version', () => {
  const { packageDir, stellar-drive-signet, simulator } = setup();

  execFileSync(
    process.execPath,
    [
      script,
      packageDir,
      '1.2.3',
      `${stellar-drive-signet}=stellar-drive-signet`,
      `${simulator}=stellar-drive-signet-simulator`,
    ],
    { stdio: 'pipe' },
  );

  assert.equal(readFileSync(path.join(packageDir, 'bin', 'stellar-drive-signet'), 'utf8'), 'go binary');
  assert.equal(
    readFileSync(path.join(packageDir, 'bin', 'stellar-drive-signet-simulator'), 'utf8'),
    'rust binary',
  );
  assert.equal(
    JSON.parse(readFileSync(path.join(packageDir, 'package.json'), 'utf8')).version,
    '1.2.3',
  );
  if (process.platform !== 'win32') {
    assert.equal(statSync(path.join(packageDir, 'bin', 'stellar-drive-signet')).mode & 0o111, 0o111);
    assert.equal(statSync(path.join(packageDir, 'bin', 'stellar-drive-signet-simulator')).mode & 0o111, 0o111);
  }
});

test('rejects a destination name that is not a bare file name', () => {
  const { packageDir, stellar-drive-signet } = setup();

  const result = spawnSync(
    process.execPath,
    [script, packageDir, '1.2.3', `${stellar-drive-signet}=../stellar-drive-signet`],
    { encoding: 'utf8' },
  );

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /expected <source>=<file name>/);
});
