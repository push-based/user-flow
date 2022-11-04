import { getCliMode, isEnvCi, isEnvSandbox } from '../../src/lib/global/cli-mode/cli-modes';

describe('isEnvCi', () => {

  // This will only pass run in CI
  it('should return true in the CI', () => {
    expect(isEnvCi()).toBe(true);
  });

  it('should return false if sandbox mode is configured', () => {
    process.env['CI'] = 'SANDBOX';
    expect(isEnvCi()).toBe(false);
  });

});

describe('isEnvSandbox', () => {

  it('should return true in the CI', () => {
    process.env['CI'] = 'SANDBOX';
    expect(isEnvSandbox()).toBe(true);
  });

  it('should return false if sandbox mode is configured', () => {
    expect(isEnvSandbox()).toBe(false);
  });

});
describe('getCliMode', () => {

  it('should return SANDBOX if it is configured', () => {
    process.env['CI'] = 'SANDBOX';
    expect(getCliMode()).toBe('SANDBOX');
  });

  // This will only pass run in CI
  it('should return CI in the CI', () => {
    expect(getCliMode()).toBe('CI');
  });

  it('should return CI in the CI', () => {
    process.env['CI'] = undefined;
    expect(getCliMode()).toBe('DEFAULT');
  });

});
