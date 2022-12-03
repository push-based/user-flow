import { ExecaChildProcess, Options as _Options } from 'execa';

export type Options = _Options;
export type PromptTestOptions = {
  timeout?: number
}
export type TestResult = ExecaChildProcess;

export type ProcessParams = {
  // command placeholder
  _?: string
} & Record<string, any>
export type TestProcessE2eFn<T extends ProcessParams = ProcessParams> = (processParams?: T, userInput?: string[], promptOptions?: PromptTestOptions) => Promise<TestResult>;
