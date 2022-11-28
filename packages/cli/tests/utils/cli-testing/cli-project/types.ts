import { ExecaChildProcess } from 'execa';
import { PromptTestOptions } from '../process/types';
import { RcJson } from '../../../../src/lib';

export type ProcessTestOptions = {
  bin: string
}

export type ProcessParams = {
  // command placeholder
  _?: string
} & Record<string, any>

export type ExecFn<T extends ProcessParams = ProcessParams> = (processParams?: T, userInput?: string[], promptOptions?: PromptTestOptions) => Promise<ExecaChildProcess>;

export type CliProcess = {
  exec: ExecFn
}

export type CliCommand = Record<`\$${string}`, ExecFn>;

export type Project = {
  deleteGeneratedFiles: () => void,
  createInitialFiles: () => void,
  setup: () => void,
  teardown: () => void,
  exec: ExecFn,
} &
  {
    [value in keyof CliCommand]: ExecFn<any>
  }

export type ProjectConfig = {
  verbose?: boolean,
  root: string,
  bin: string,
  // the process env of the created process
  env?: Record<string, string>,
  // files
  rcFile?: Record<string, RcJson>,
  delete?: string[],
  create?: Record<string, string>;
}
