import { describe, expect, it } from 'vitest';
import { mkdirSync } from 'node:fs';

import { CliTest, DEFAULT_RC } from '../../utils/setup';
import { join } from 'node:path';

describe.skip('collect ufPath', () => {

  it<CliTest>('should throw if no user-flows directory does not exist', async ({ cli, setupFns }) => {
    setupFns.setupRcJson(DEFAULT_RC)

    const { code, stderr} = await cli.run('user-flow', ['collect']);

    expect(code).toBe(1);
    expect(stderr).toContain('Error: ufPath: user-flows is neither a file nor a directory');
  });

  it<CliTest>('should throw if no user-flow is found in ufPath', async ({ root, cli, setupFns }) => {
    setupFns.setupRcJson(DEFAULT_RC)
    mkdirSync(join(root, DEFAULT_RC.collect.ufPath), { recursive: true });

    const { code, stderr, stdout } = await cli.run('user-flow', ['collect']);

    expect(code).toBe(1);
    expect(stderr).toContain(`No user flows found in ${DEFAULT_RC.collect.ufPath}`);
  });
})
