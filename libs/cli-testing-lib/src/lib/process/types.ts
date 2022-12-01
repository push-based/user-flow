import { ExecaChildProcess, Options as _Options } from 'execa';
import { ProcessParams } from '../cli-project/types';

export type Options = _Options;
export type PromptTestOptions = {
  timeout?: number
}
export type TestResult = ExecaChildProcess;

export type TestProcessE2eFn<T extends ProcessParams = ProcessParams> = (processParams?: T, userInput?: string[], promptOptions?: PromptTestOptions) => Promise<TestResult>;
