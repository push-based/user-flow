import { CI_PRESET, DEFAULT_PRESET, getEnvPreset, SANDBOX_PRESET } from '../../src/lib/global/rc-json/pre-sets';
import { setupEnvVars, teardownEnvVars } from '../utils/cli-mode-helpers';

describe('getEnvPreset', () => {
  afterEach(teardownEnvVars);

  it('should return default preset', () => {
    teardownEnvVars();
    expect(getEnvPreset()).toEqual(DEFAULT_PRESET);
  });

  // This will only pass run in CI
  it('should return CI preset in CI', () => {
    setupEnvVars('true');
    expect(getEnvPreset()).toEqual(CI_PRESET);
  });

  it('should return sandbox preset if mode is configured', () => {
    setupEnvVars('SANDBOX');
    expect(getEnvPreset()).toEqual(SANDBOX_PRESET);
  });

});
