import { CI_PRESET, DEFAULT_PRESET, getEnvPreset, SANDBOX_PRESET } from '../../src/lib/global/rc-json/pre-sets';

describe('getEnvPreset', () => {

  it('should return default preset', () => {
    process.env['CI'] = '';
    expect(getEnvPreset()).toEqual(DEFAULT_PRESET);
  });

  // This will only pass run in CI
  it('should return CI preset in CI', () => {
    expect(getEnvPreset()).toEqual(CI_PRESET);
  });

  it('should return sandbox preset if mode is configured', () => {
    process.env['CI'] = 'SANDBOX';
    expect(getEnvPreset()).toEqual(SANDBOX_PRESET);
  });

});
