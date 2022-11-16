import { CI_PROPERTY, CLI_MODE_PROPERTY } from '../../src/lib/global/cli-mode/cli-mode';

export function setupEnvVars(env: CLI_MODES): void {
  if (env === 'DEFAULT') {
    delete process.env[CI_PROPERTY];
  } else {
    process.env[CI_PROPERTY] = (env === 'CI' ? true : 'SANDBOX') as string;
  }
}

export function teardownEnvVars() {
  delete process.env[CI_PROPERTY];
  delete process.env[CLI_MODE_PROPERTY];
}
