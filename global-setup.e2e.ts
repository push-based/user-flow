import { execSync } from 'child_process';
import startLocalRegistry from './tools/scripts/start-local-registry';
import stopLocalRegistry from './tools/scripts/stop-local-registry';

export async function setup() {
  console.log('Starting local registry...');
  await startLocalRegistry();
  execSync('npm install -D @push-based/user-flow@1.0.0');
}

export async function teardown() {
  console.log('Teardown registry')
  stopLocalRegistry();
  execSync('npm uninstall @push-based/user-flow');
}
