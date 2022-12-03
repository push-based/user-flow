import { Options } from 'execa';

export type ProcessOptions = Options;

export type PromptTestOptions = {
  timeout?: number
}

export type TestResult = {
  stdout: string;
  stderr: string;
  exitCode: number
}
