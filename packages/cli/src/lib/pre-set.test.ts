import {
  CI_PRESET,
  DEFAULT_PRESET,
  getEnvPreset,
  SANDBOX_PRESET,
} from './pre-set';
import {
  setupEnvVars,
  teardownEnvVars,
} from '@push-based/user-flow-cli-testing';

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
