import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { CliTest, DEFAULT_RC, USER_FLOW_MOCKS } from '../../utils/setup';

const DUMMY_USER_FLOW_NAME = 'Basic Navigation Example';

describe('collect format', () => {
  ['html', 'json', 'md'].forEach((format) => {
    it<CliTest>(`should save the results as a ${format} file`, async ({root, setupFns, cli}) => {

      setupFns.setupRcJson(getRcWithFormat([format]));
      setupFns.setupUserFlows(USER_FLOW_MOCKS.BASIC);

      const { code, stderr } = await cli.run('user-flow', ['collect']);

      expect(stderr).toBe('');
      expect(code).toBe(0);

      const resultFileNames = getResultFile(root);
      expect(resultFileNames).toHaveLength(1);
      expect(resultFileNames[0].endsWith(`.${format}`)).toBeTruthy();

      const content = getResultContent(root, resultFileNames[0]);
      expect(isValidFormatedResult(format, content));
    });
  });

  it<CliTest>('should print results to stdout', async ({ setupFns, cli }) => {
    setupFns.setupRcJson(getRcWithFormat(['stdout']));
    setupFns.setupUserFlows(USER_FLOW_MOCKS.BASIC);

    const { code, stdout, stderr } = await cli.run('user-flow', ['collect']);

    expect(stdout).toContain(`| Gather Mode | Performance | Accessibility | Best Practices | Seo |`)
    expect(stdout).toContain(DUMMY_USER_FLOW_NAME);
    expect(stderr).toBe('');
    expect(code).toBe(0);
  });

  it<CliTest>('should save the results as a HTML, JSON and Markdown files and print to stdout', async ({ root, setupFns, cli }) => {
    setupFns.setupRcJson(getRcWithFormat(['html', 'json', 'md', 'stdout']));
    setupFns.setupUserFlows(USER_FLOW_MOCKS.BASIC);

    const { code, stdout, stderr } = await cli.run('user-flow', ['collect']);

    const resultFileNames = getResultFile(root);
    expect(resultFileNames).toHaveLength(3);

    resultFileNames.forEach((fileName) => {
      const content = getResultContent(root, fileName);
      const format = fileName.split('.').at(-1)!;
      expect(isValidFormatedResult(format, content)).toBeTruthy();
    });

    expect(stdout).toContain(`| Gather Mode | Performance | Accessibility | Best Practices | Seo | Pwa |`)
    expect(stdout).toContain(DUMMY_USER_FLOW_NAME);
    expect(stderr).toBe('');
    expect(code).toBe(0);
  })
});


function isValidFormatedResult(format: string, result: string) {
  const isValidFile = {
    'html': (report: string) => report.includes(DUMMY_USER_FLOW_NAME),
    'json': (report: string) => !!(JSON.parse(report)?.name || '').includes(DUMMY_USER_FLOW_NAME),
    'md': (report: string) => report.includes(`| Gather Mode | Performance | Accessibility | Best Practices | Seo | Pwa |`)
  };
  // @ts-ignore
  return isValidFile[format](result);
}

function getRcWithFormat(format: string[]) {
  const RC = structuredClone(DEFAULT_RC);
  RC.persist.format = format;
  return RC;
}

function getResultFile(dir: string): string[] {
  return readdirSync(join(dir, DEFAULT_RC.persist.outPath))
}

function getResultContent(dir: string, name: string): string {
  return readFileSync(join(dir, DEFAULT_RC.persist.outPath, name), { encoding: 'utf8' });
}
