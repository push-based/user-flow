import { normalize } from 'node:path';
import { ChildProcessWithoutNullStreams } from 'node:child_process';

export const E2E_DIR = 'tmp/e2e';

export const USER_FLOW_MOCKS = {
  BASIC: 'e2e/cli-e2e/mocks/user-flows/basic-navigation.uf.mts',
} as const;

export const DEFAULT_RC = {
  collect: {
    url: "https://coffee-cart.netlify.app/",
    ufPath: "./user-flows",
  },
  persist: {
    outPath: "./measures",
    format: ["html"]
  },
};

export const KEYBOARD = {
  ENTER: '\r',
  DOWN: '\u001B[B',
  SPACE: ' ',
  DECLINE_BOOLEAN: 'n',
  ACCEPT_BOOLEAN: 'y'
}

export function normalizePath(path: string) {
  return normalize(path.replaceAll(' ', '_'))
}

export type CliProcessResult = {
  stdout: string;
  stderr: string;
  code: number | null;
}

export type CliTest = {
  root: string;
  setupFns: {
    setupRcJson: (rc: {}, rcName?: string) => void;
    setupUserFlows: (mockUserFlow: string, userFlowDir?: string) => void;
  }
  cli: {
    run: (command: string, args?: string[], waitForClose?: boolean) => Promise<CliProcessResult>;
    waitForStdout: (stdOut: string) => Promise<void>;
    waitForClose: () => Promise<CliProcessResult>;
    type: (inputs: string) => void;
    process?: ChildProcessWithoutNullStreams;
    verbose: boolean;
    stdout: string;
    stderr: string;
    code: number | null;
  }
};

/**
 * Node writes its own diagnostics to the CLI's stderr - deprecation and
 * experimental warnings that come from the runtime, not from user-flow. They
 * vary by Node version, so asserting on raw stderr makes the suite pass or fail
 * on which Node happens to be installed rather than on the CLI's behaviour.
 *
 * Strips those lines so a test can still assert the CLI itself stayed quiet.
 */
export function stripNodeWarnings(stderr: string): string {
  return stderr
    // `(node:123) [DEP0205] DeprecationWarning: ...`
    .replace(/^\(node:\d+\) .*(?:\r?\n|$)/gm, '')
    // the follow-up hint Node prints under a warning
    .replace(
      /^\(Use `node --trace-\S+ \.\.\.` to show where the warning was created\)(?:\r?\n|$)/gm,
      ''
    )
    .trim();
}
