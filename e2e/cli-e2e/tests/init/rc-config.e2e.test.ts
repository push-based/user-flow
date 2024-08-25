import { describe, expect, it } from 'vitest';
import { CliTest, DEFAULT_RC, KEYBOARD } from '../../utils/setup';
import { existsSync, readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

describe('.rc.json in empty sandbox', () => {
  it.concurrent<CliTest>('should take default params from prompt with flow', async ({ root, cli }) => {
    await cli.run('user-flow', ['init'], false);

    await respondToPrompts(cli, [
      ['What is the URL to run the user flows for?', KEYBOARD.ENTER],
      ['Folder of the user flows?', KEYBOARD.ENTER],
      ['What is the format of user-flow reports?', KEYBOARD.ENTER],
      ['What is the directory to store results in?', KEYBOARD.ENTER],
      ['Setup user flow', KEYBOARD.ACCEPT_BOOLEAN]
    ]);

    const { code, stdout, stderr } = await cli.waitForClose();
    expect(stderr).toBe('');
    expect(code).toBe(0);

    const rc = JSON.parse(readFileSync(join(root, '.user-flowrc.json'), { encoding: 'utf8' }));
    expect(rc).toEqual(DEFAULT_RC);

    expect(existsSync(join(root, DEFAULT_RC.collect.ufPath, 'basic-navigation.uf.mts'))).toBeTruthy();
  });

  it.concurrent<CliTest>('should take params from prompt without flow', async ({ root, cli }) => {
    await cli.run('user-flow', ['init'], false);

    await respondToPrompts(cli, [
      ['What is the URL to run the user flows for?', KEYBOARD.ENTER],
      ['Folder of the user flows?', KEYBOARD.ENTER],
      ['What is the format of user-flow reports?', KEYBOARD.ENTER],
      ['What is the directory to store results in?', KEYBOARD.ENTER],
      ['Setup user flow', KEYBOARD.DECLINE_BOOLEAN]
    ]);

    const { code, stdout, stderr } = await cli.waitForClose();
    expect(stderr).toBe('');
    expect(code).toBe(0);

    const rc = JSON.parse(readFileSync(join(root, '.user-flowrc.json'), { encoding: 'utf8' }));
    expect(rc).toEqual(DEFAULT_RC);

    expect(existsSync(join(root, DEFAULT_RC.collect.ufPath, 'basic-navigation.uf.mts'))).toBeFalsy();
  });

  it.concurrent<CliTest>('should take custom params from prompt', async ({ root, cli }) => {
    await cli.run('user-flow', ['init'], false);

    await respondToPrompts(cli, [
      ['What is the URL to run the user flows for?', 'https://example.com' + KEYBOARD.ENTER],
      ['Folder of the user flows?', 'dummy-uf-path' + KEYBOARD.ENTER],
      ['What is the format of user-flow reports?', KEYBOARD.ENTER],
      ['What is the directory to store results in?', 'dummy-out-path' + KEYBOARD.ENTER],
      ['Setup user flow', KEYBOARD.DECLINE_BOOLEAN]
    ]);

    const { code, stdout, stderr } = await cli.waitForClose();
    expect(stderr).toBe('');
    expect(code).toBe(0);

    const rc = JSON.parse(readFileSync(join(root, '.user-flowrc.json'), { encoding: 'utf8' }));
    expect(rc).not.toEqual(DEFAULT_RC);
    expect(rc['collect']['url']).toBe('https://example.com');
    expect(rc['collect']['ufPath']).toBe('dummy-uf-path');
    expect(rc['persist']['format']).toEqual(DEFAULT_RC.persist.format);
    expect(rc['persist']['outPath']).toBe( 'dummy-out-path');

    expect(existsSync(join(root, DEFAULT_RC.collect.ufPath, 'basic-navigation.uf.mts'))).toBeFalsy();
  });
});

describe('.rc.json in initialized sandbox', () => {

  it.concurrent<CliTest>('should validate params from rc', async ({ cli, setupFns }) => {
    const { code, stderr } = await cli.run('user-flow', ['init', '--format wrong']);

    expect(code).toBe(1);
    expect(stderr).toContain('Invalid values:');
    expect(stderr).toContain('Argument: format, Given: "wrong", Choices: "html", "json", "md", "stdout"');
  });

  it.concurrent<CliTest>('should log and ask if specified rc file param -p does not exist', async ({ cli, setupFns }) => {
    await cli.run('user-flow', ['init', '--rcPath wrong/path/to/file.json'], false);

    await cli.waitForStdout('What is the URL to run the user flows for?');
    cli.type('\x03');

    const { code } = await cli.waitForClose();

    expect(code).toBe(1);
  });

  it.concurrent<CliTest>('should take params from cli', async ({ root, cli }) => {
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
    expect(rc['collect']['ufPath']).toBe('dummy-uf-path');
    expect(rc['collect']['serveCommand']).toBe('npm run dummy-script');
    expect(rc['collect']['awaitServeStdout']).toBe('dummy serve log');
    expect(rc['persist']['format']).toEqual(['md']);
    expect(rc['persist']['outPath']).toBe( 'dummy-out-path');

    expect(rc).not.toEqual(DEFAULT_RC);

    expect(cli.code).toBe(0);
  });
});

describe('.rc.json in remote sandbox', () => {
  it<CliTest>('should load configuration if specified rc file param -p is given', async ({ root, cli, setupFns}) => {
    mkdirSync(join(root, 'remote'));
    setupFns.setupRcJson(DEFAULT_RC, './remote/.rc.json');

    const {code, stdout, stderr} = await cli.run('user-flow', [
      'init',
      '--verbose',
      '-p ./remote/.rc.json',
      '--generateFlow false'
    ]);

    expect(stdout).toContain(`url: '${DEFAULT_RC.collect.url}'`);
    expect(stdout).toContain(`ufPath: '${DEFAULT_RC.collect.ufPath}'`);
    expect(stdout).toContain(`outPath: '${DEFAULT_RC.persist.outPath}'`);
    expect(stdout).toContain(`format: [ '${DEFAULT_RC.persist.format}' ]`);

    expect(stderr).toBe('');
    expect(code).toBe(0);
  })
})

async function respondToPrompts(cli: CliTest['cli'], promptResponses: [prompt: string, respone: string][]) {
  for (const [prompt, response] of promptResponses) {
    await cli.waitForStdout(prompt)
    cli.type(response);
  }
}
