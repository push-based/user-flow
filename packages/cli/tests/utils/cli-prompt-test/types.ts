import { ExecaChildProcess } from 'execa';
import { PromptTestOptions } from './raw';
import { CLI_MODES } from '../../../src/lib/global/cli-mode/types';

export type ProcessParams = {
  // command placeholder
  _: string
} & Record<string, boolean | number | string | string[]>

export type ExecFn = (processParams: ProcessParams, userInput?: string[], promptOptions?: PromptTestOptions) => Promise<ExecaChildProcess>;
export type CliProcess = {
  exec: ExecFn
}


export type Project = {
  root: string,
  readFile: () => string,
  exec: ExecFn
}

export type ProjectConfig = {
  root: string,
  cliMode?: CLI_MODES,
  bin: string,
  // the process env of the created process
  env?: Record<string, string>,
}
