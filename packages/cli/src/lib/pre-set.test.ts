import {describe, afterEach, it, expect} from 'vitest';

import { CI_PRESET, DEFAULT_PRESET, getEnvPreset, SANDBOX_PRESET } from './pre-set.js';
import { CI_PROPERTY, CLI_MODE_PROPERTY, CLI_MODES } from './global/cli-mode/index.js';


function setupEnvVars(env: CLI_MODES): void {
  if (env === 'DEFAULT') {
    delete process.env[CI_PROPERTY];
  } else {
    process.env[CI_PROPERTY] = (env === 'CI' ? true : 'SANDBOX') as string;
  }
}

function teardownEnvVars() {
  delete process.env[CI_PROPERTY];
  delete process.env[CLI_MODE_PROPERTY];
}

describe('getEnvPreset', () => {

  afterEach(() => setupEnvVars('SANDBOX'));
  afterEach(teardownEnvVars);

  it('should return default preset', () => {
    teardownEnvVars();
    expect(getEnvPreset()).toEqual(DEFAULT_PRESET);
  });

  // This will only pass run in CI
  it('should return CI preset in CI', () => {
    setupEnvVars('CI');
    expect(getEnvPreset()).toEqual(CI_PRESET);
  });

  it('should return sandbox preset if mode is configured', () => {
    setupEnvVars('SANDBOX');
    expect(getEnvPreset()).toEqual(SANDBOX_PRESET);
  });

});
