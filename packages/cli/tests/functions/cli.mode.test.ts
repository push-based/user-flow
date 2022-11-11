import {
  CLI_MODE_PROPERTY,
  detectCliMode,
  getCliMode,
  isEnvCi,
  isEnvSandbox
} from '../../src/lib/global/cli-mode/cli-mode';
import { setupEnvVars, teardownEnvVars } from '../utils/cli-mode';

describe('isEnvCi', () => {

  afterEach(teardownEnvVars);
  // This will only pass run in CI
  it('should return true in the CI', () => {
    setupEnvVars('true');
    expect(isEnvCi()).toBe(true);
  });

  it('should return false if sandbox mode is configured', () => {
    setupEnvVars('SANDBOX');
    expect(isEnvCi()).toBe(false);
  });

  it('should return false on a local machine', () => {
    teardownEnvVars();
    expect(isEnvCi()).toBe(false);
  });

});

describe('isEnvSandbox', () => {

  afterEach(teardownEnvVars);

  it('should return true if sandbox is configured', () => {
    setupEnvVars('SANDBOX');
    expect(isEnvSandbox()).toBe(true);
  });

  it('should return false if sandbox mode is NOT configured', () => {
    setupEnvVars('true');
    expect(isEnvSandbox()).toBe(false);
  });

});

describe('detectCliMode', () => {
  afterEach(teardownEnvVars);

  it('should return SANDBOX if sandbox is configured', () => {
    setupEnvVars('SANDBOX');
    expect(isEnvSandbox()).toBe(true);
  });

  it('should return CI if CI', () => {
    setupEnvVars('true');
    expect(isEnvSandbox()).toBe(false);
  });

  it('should return DEFAULT by default', () => {
    setupEnvVars('true');
    expect(isEnvSandbox()).toBe(false);
  });

});

describe('getCliMode', () => {
  afterEach(teardownEnvVars);

  it('should return SANDBOX if it is configured', () => {
    setupEnvVars('SANDBOX');
    expect(getCliMode()).toBe('SANDBOX');
  });

  // This will only pass run in CI
  it('should return CI in the CI', () => {
    expect(process.env[CLI_MODE_PROPERTY]).toBe(undefined);
    setupEnvVars('true');
    expect(getCliMode()).toBe('CI');

  });

  it('should return DEFAULT if it is no CI or sandbox environment', () => {
    teardownEnvVars();
    expect(getCliMode()).toBe('DEFAULT');
  });

});
