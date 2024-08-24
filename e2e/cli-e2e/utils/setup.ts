import { normalize } from 'node:path';
import { ChildProcessWithoutNullStreams } from 'node:child_process';

export const E2E_DIR = 'tmp/e2e';

export const USER_FLOW_MOCKS = {
  MINIMAL: 'e2e/cli-e2e/mocks/user-flows/minimal.uf.ts'
} as const;

export const DEFAULT_RC = {
  collect: {
    url: "https://coffee-cart.netlify.app/",
    ufPath: "user-flows",
  },
  persist: {
    outPath: "measures",
    format: ["md"]
  }
};

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
    run: (command: string, args?: string[]) => Promise<CliProcessResult>;
    waitForStdout: (stdOut: string) => Promise<void>;
    process?: ChildProcessWithoutNullStreams;
    verbose: boolean;
    stdout: string;
    stderr: string;
    code: number | null;
  }
};
