import { afterAll, beforeAll, beforeEach, afterEach } from 'vitest';

import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, normalize, sep } from 'node:path';

import { CliTest, E2E_DIR, normalizePath } from './utils/setup';
import { spawn } from 'node:child_process';

const ANSI_ESCAPE_REGEX = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

beforeAll(({name}) => {
  mkdirSync(join(E2E_DIR, normalizePath(name)), { recursive: true });
});

beforeEach<CliTest>((ctx) => {
  ctx.root = join(E2E_DIR, normalizePath(join(ctx.task.suite.name, ctx.task.name)));

  ctx.setupFns = {
    setupRcJson: (rc: {}, rcName= `.user-flowrc.json`) => {
      writeFileSync(
        join(ctx.root, rcName),
        JSON.stringify(rc, null, 4),
        { encoding: 'utf8' }
      );
    },
    setupUserFlows: (mockUserFlow: string, userFlowDir = 'user-flows') => {
      cpSync(mockUserFlow, join(ctx.root, userFlowDir, normalize(mockUserFlow).split(sep).at(-1)))
    }
  }

  mkdirSync(ctx.root, { recursive: true });
});

export type CliProcessResult = {
  stdout: string;
  stderr: string;
  code: number | null;
}

beforeEach<CliTest>((ctx) => {
  ctx.cli = {} as any;
  ctx.cli.stdout = '';
  ctx.cli.stderr = '';
  ctx.cli.code = null;


  ctx.cli.run = (command: string, args: string[] = []) => new Promise<CliProcessResult>((resolve) => {
    const process = spawn(command, args, { stdio: 'pipe', shell: true, cwd: ctx.root });

    setTimeout(() => {
      process.stdout.on('data', (data) => {
        const stdout = String(data).replace(ANSI_ESCAPE_REGEX, '');

        if (ctx.cli.verbose) {
          console.log(stdout)
        }

        ctx.cli.stdout += String(data).replace(ANSI_ESCAPE_REGEX, '');
      });


      process.stderr.on('data', (data) => {
        const stderr = String(data).replace(ANSI_ESCAPE_REGEX, '');

        if (ctx.cli.verbose) {
          console.log(stderr)
        }

        ctx.cli.stderr += String(data).replace(ANSI_ESCAPE_REGEX, '');

      });


      process.on('close', code => {
        ctx.cli.code = code;
        resolve({
          stdout: ctx.cli.stdout,
          stderr: ctx.cli.stderr,
          code: ctx.cli.code
        });
      });
    }, 0);
  });

  ctx.cli.waitForStdout = (expectedStdout: string) => {
    return new Promise((resolve) => {

      process.stdout.on('data', (data) => {
        const stdout = String(data).replace(ANSI_ESCAPE_REGEX, '');
        if (stdout.includes(expectedStdout)) {
          resolve();
        }
      });
    })
  };
})


afterEach<CliTest>((ctx) => {
  rmSync(ctx.root, { recursive: true });
})

afterAll(({name}) => {
  rmSync(join(E2E_DIR, normalizePath(name)), { recursive: true });
});
