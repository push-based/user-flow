import { CI_PROPERTY, CLI_MODE_PROPERTY } from '../../src/lib/global/cli-mode/cli-modes';

export function setupEnvVars(ciPropVal: string) {
  process.env[CI_PROPERTY] = ciPropVal;
}

export function teardownEnvVars() {
  delete process.env[CI_PROPERTY];
  delete process.env[CLI_MODE_PROPERTY];
}
