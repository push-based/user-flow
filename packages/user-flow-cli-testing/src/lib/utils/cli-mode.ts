import {
  CLI_MODES,
  CI_PROPERTY,
  CLI_MODE_PROPERTY,
} from '@push-based/user-flow';

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

// @TODO: move into cli-project as it deals with env vars
export function getEnvVarsByCliModeAndDeleteOld(
  cliMode: CLI_MODES
): Record<string, string | undefined> {
  if (cliMode === 'DEFAULT') {
    delete process.env[CI_PROPERTY];
    return {};
  }

  // CI mode value
  let ciValue = 'true';
  if (cliMode === 'SANDBOX') {
    // emulate sandbox env by setting CI to SANDBOX
    ciValue = 'SANDBOX';
  }
  return { [CI_PROPERTY]: ciValue };
}
