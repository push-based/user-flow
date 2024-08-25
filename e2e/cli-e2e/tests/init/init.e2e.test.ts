import { describe, expect } from 'vitest';
import { CliTest, DEFAULT_RC, KEYBOARD, USER_FLOW_MOCKS } from '../../utils/setup';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('init command', () => {

  it.concurrent<CliTest>('should generate a user-flow for basic navigation after the CLI is setup', async ({ cli }) => {
    await cli.run('user-flow', ['init'], false);

    await cli.waitForStdout('What is the URL to run the user flows for?');
    cli.type(KEYBOARD.ENTER);

    await cli.waitForStdout('Folder of the user flows?');
    cli.type(KEYBOARD.ENTER);

    await cli.waitForStdout('What is the format of user-flow reports?');
    cli.type(KEYBOARD.ENTER);

    await cli.waitForStdout('What is the directory to store results in?');
    cli.type(KEYBOARD.ENTER);

    await cli.waitForStdout('Setup user flow');
    cli.type(KEYBOARD.ENTER);

    const { code, stdout, stderr} = await cli.waitForClose();

    expect(stdout).toContain('user-flow CLI is set up now! 🎉');
    expect(stderr).toBe('');
    expect(code).toBe(0);
  });

  it.concurrent<CliTest>('should not prompt if user-flow is already setup', async ({ setupFns, cli }) => {
    setupFns.setupRcJson(DEFAULT_RC);
    setupFns.setupUserFlows(USER_FLOW_MOCKS.BASIC);

    const { code, stdout, stderr} = await cli.run('user-flow', ['init']);

    expect(stdout).toContain('user-flow CLI is set up now! 🎉');
    expect(stderr).toBe('');
    expect(code).toBe(0);
  });

  it.concurrent<CliTest>('should create a workflow if `--generateGhWorkflow is used` ', async ({ root, setupFns, cli }) => {
    setupFns.setupRcJson(DEFAULT_RC);
    setupFns.setupUserFlows(USER_FLOW_MOCKS.BASIC);

    const { code, stdout, stderr} = await cli.run('user-flow', ['init', '--generateGhWorkflow']);

    expect(stdout).toContain('user-flow CLI is set up now! 🎉');
    expect(stderr).toBe('');
    expect(code).toBe(0);
    expect(existsSync(join(root, '.github', 'workflows', 'user-flow-ci.yml'))).toBeTruthy();
  });

  it.concurrent<CliTest>('should override rc with cli params', async ({ root, setupFns, cli }) => {
    setupFns.setupRcJson(DEFAULT_RC);
    setupFns.setupUserFlows(USER_FLOW_MOCKS.BASIC);

    await cli.run('user-flow', [
      'init',
      '--url https://example.com',
      '--ufPath dummy-uf-path',
      '--outPath dummy-out-path',
      '--format md',
      '--generateFlow false',
      '--serveCommand "npm run dummy-script"',
      '--awaitServeStdout "dummy serve log"'
    ]);

    const rc = JSON.parse(readFileSync(join(root, '.user-flowrc.json'), { encoding: 'utf8' }));

    expect(rc['collect']['url']).toBe('https://example.com');
    expect(rc['collect']['serveCommand']).toBe('npm run dummy-script');
    expect(rc['collect']['ufPath']).toBe('dummy-uf-path');
    expect(rc['persist']['format']).toEqual(['md']);
    expect(rc['collect']['awaitServeStdout']).toBe('dummy serve log');
    expect(rc['persist']['outPath']).toBe( 'dummy-out-path');

    expect(rc).not.toEqual(DEFAULT_RC);
  });
});
