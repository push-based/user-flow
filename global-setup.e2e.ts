import { execSync } from 'child_process';
import { mkdirSync, rmSync } from 'node:fs';
import startLocalRegistry from './tools/scripts/start-local-registry';
import { E2E_INSTALL_DIR } from './e2e/cli-e2e/utils/setup';

let stopLocalRegistry: () => void = () => {};

export async function setup() {
  console.log('Setup e2e test');
  stopLocalRegistry = await startLocalRegistry();
  rmSync(E2E_INSTALL_DIR, { recursive: true, force: true });
  mkdirSync(E2E_INSTALL_DIR, { recursive: true });
  execSync(`npm install @push-based/user-flow@1.0.0 --prefix ${E2E_INSTALL_DIR}`);
}

export async function teardown() {
  console.log('Teardown e2e test')
  stopLocalRegistry();
  rmSync(E2E_INSTALL_DIR, { recursive: true, force: true });
}
