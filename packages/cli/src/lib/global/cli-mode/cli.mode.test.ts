import { afterEach, describe, expect, it } from 'vitest';
import { CI_PROPERTY, CLI_MODE_PROPERTY, detectCliMode, isEnvCi, isEnvSandbox } from './cli-mode.js';
import { CLI_MODES } from './types.js';

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

describe('isEnvCi', () => {

  afterEach(teardownEnvVars);
  // This will only pass run in CI
  it('should return true in the CI', () => {
    setupEnvVars('CI');
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
    setupEnvVars('CI');
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
    setupEnvVars('CI');
    expect(isEnvSandbox()).toBe(false);
  });

  it('should return DEFAULT by default', () => {
    setupEnvVars('CI');
    expect(isEnvSandbox()).toBe(false);
  });

});

describe('detectCliMode', () => {
  afterEach(teardownEnvVars);

  it('should return SANDBOX if it is configured', () => {
    setupEnvVars('SANDBOX');
    expect(detectCliMode()).toBe('SANDBOX');
  });

  // This will only pass run in CI
  it('should return CI in the CI', () => {
    expect(process.env[CLI_MODE_PROPERTY]).toBe(undefined);
    setupEnvVars('CI');
    expect(detectCliMode()).toBe('CI');

  });

  it('should return DEFAULT if it is no CI or sandbox environment', () => {
    teardownEnvVars();
    expect(detectCliMode()).toBe('DEFAULT');
  });
});
