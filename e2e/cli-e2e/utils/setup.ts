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
  assert: {}
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
