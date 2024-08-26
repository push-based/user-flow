import { describe, expect } from 'vitest';
import { CliTest, DEFAULT_RC, USER_FLOW_MOCKS } from '../../utils/setup';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

describe('collect config', () => {

  it<CliTest>('should log LH config from a user flow', async ({ setupFns, cli }) => {
    setupFns.setupRcJson(DEFAULT_RC);
    setupFns.setupUserFlows(USER_FLOW_MOCKS.BASIC);

    const { code, stdout, stderr } = await cli.run('user-flow', ['collect', '--verbose', '--dry-run'])

    expect(stdout).toContain('LH Configuration is used from a user flow file');
    expect(stderr).toBe('');
    expect(code).toBe(0);
  });

  it<CliTest>('should throw is invalid path to LH config', async ({ setupFns, cli }) => {
    setupFns.setupRcJson(DEFAULT_RC);
    setupFns.setupUserFlows(USER_FLOW_MOCKS.BASIC);

    const { code, stdout, stderr } = await cli.run('user-flow', [
      'collect',
      '--configPath ./invalid/path/to/config.json',
      '--verbose',
      '--dry-run'
    ]);

    expect(stderr).toContain('Error: ./invalid/path/to/config.json does not exist.');
    expect(code).toBe(1);
  });

  it<CliTest>('should load configPath from RC file', async ({ root, setupFns, cli }) => {
    const rc = structuredClone(DEFAULT_RC);
    // @ts-ignore
    rc.collect['configPath'] = './lh-config.json';
    setupFns.setupRcJson(rc);
    setupFns.setupUserFlows(USER_FLOW_MOCKS.BASIC);

    writeFileSync(join(root, './lh-config.json'), JSON.stringify({
      extends: 'lighthouse:default',
      settings: { onlyAudits: ['lcp-lazy-loaded'] }
    }));

    const { code, stdout, stderr } = await cli.run('user-flow', ['collect', '--verbose']);

    expect(stdout).toContain('LH Configuration ./lh-config.json is used from CLI param or .user-flowrc.json');
    expect(stderr).toBe('');
    expect(code).toBe(0);
  });
});
