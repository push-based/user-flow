import { afterAll, beforeAll, beforeEach, afterEach } from 'vitest';

import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, normalize, sep } from 'node:path';

import { CliTest, E2E_DIR, normalizePath } from './utils/setup';
import { spawn } from 'node:child_process';

const ANSI_ESCAPE_REGEX = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

function filePath(p: string): string {
  const paths = normalizePath(p).split(sep);
  return paths.splice(0, paths.length - 1).join();
}

beforeAll((ctx) => {
  mkdirSync(join(E2E_DIR, filePath(ctx.name)), { recursive: true });
});

beforeEach<CliTest>((ctx) => {
  ctx.root = join(E2E_DIR, filePath(ctx.task.file.name), normalizePath(join(ctx.task.suite.name, ctx.task.name)));

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


  ctx.cli.run = (command: string, args: string[] = [], waitForClose = true) => new Promise<CliProcessResult>((resolve) => {
    ctx.cli.process = spawn(command, args, { stdio: 'pipe', shell: true, cwd: ctx.root });

    ctx.cli.process.stdout.on('data', (data) => {
      const stdout = String(data).replace(ANSI_ESCAPE_REGEX, '');

      if (ctx.cli.verbose) {
        console.log(stdout);
      }

      ctx.cli.stdout += stdout;
    });


    ctx.cli.process.stderr.on('data', (data) => {
      const stderr = String(data).replace(ANSI_ESCAPE_REGEX, '');

      if (ctx.cli.verbose) {
        console.log(stderr);
      }

      ctx.cli.stderr += stderr;
    });


    ctx.cli.process.on('close', code => {
      ctx.cli.code = code;

      if (ctx.cli.verbose) {
        console.log(code);
      }

      resolve({
        stdout: ctx.cli.stdout,
        stderr: ctx.cli.stderr,
        code: ctx.cli.code
      });
    });

    if (!waitForClose) {
      resolve({
        stdout: ctx.cli.stdout,
        stderr: ctx.cli.stderr,
        code: ctx.cli.code
      });
    }
  });

  ctx.cli.waitForStdout = (expectedStdout: string) => {
    return new Promise((resolve) => {
      ctx.cli.process.stdout.on('data', (data) => {
        const stdout = String(data).replace(ANSI_ESCAPE_REGEX, '');
        if (stdout.includes(expectedStdout)) {
          resolve();
        }
      });
    });
  };

  ctx.cli.waitForClose = () => {
    return new Promise((resolve) => {
      ctx.cli.process.on('close', (code) => {
        ctx.cli.code = code;
        resolve({
          stdout: ctx.cli.stdout,
          stderr: ctx.cli.stderr,
          code: ctx.cli.code
        });
      });
    });
  };

  ctx.cli.type = (inputs: string) => {
    ctx.cli.process.stdin.write(inputs);
  };
});

afterEach<CliTest>((ctx) => {
  rmSync(ctx.root, { recursive: true });
});

afterAll((ctx) => {
  rmSync(join(E2E_DIR, filePath(ctx.name)), { recursive: true });
});
