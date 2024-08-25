import { describe, expect, it } from 'vitest';

import { CliTest, DEFAULT_RC, USER_FLOW_MOCKS } from '../../utils/setup';

describe('collect --dry-run', () => {

  it<CliTest>('should run user-flow', async ({ cli, setupFns }) => {
    setupFns.setupRcJson(DEFAULT_RC);
    setupFns.setupUserFlows(USER_FLOW_MOCKS.BASIC);

    const { code, stdout, stderr } = await cli.run('user-flow', ['collect', '--dry-run']);

    expect(stderr).toBe('');
    expect(stdout).toBe('');
    expect(code).toBe(0);
  });
});

describe('collect --dry-run --verbose', () => {

  it<CliTest>('should run user-flow and log', async ({ cli, setupFns }) => {
    setupFns.setupRcJson(DEFAULT_RC);
    setupFns.setupUserFlows(USER_FLOW_MOCKS.BASIC);

    const { code, stdout, stderr } = await cli.run('user-flow', ['collect', '--dry-run', '--verbose']);

    expect(stderr).toBe('');
    expect(stdout).not.toBe('');
    expect(code).toBe(0);
  });
});
