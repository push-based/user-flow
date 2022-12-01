import { TestProcessE2eFn } from '../process/types';
import { FileOrFolderMap } from './cli-project';

export type ProcessTestOptions = {
  bin: string
}

export type ProcessParams = {
  // command placeholder
  _?: string
} & Record<string, any>

export type CliProcess = {
  exec: TestProcessE2eFn
}

export type CliCommand = Record<`\$${string}`, TestProcessE2eFn>;

export type ProjectConfig<RcJson extends {}> = {
  verbose?: boolean,
  root: string,
  bin: string,
  // the process env of the created process
  env?: Record<string, string>,
  // files
  rcFile?: Record<string, RcJson>,
  delete?: string[],
  create?: FileOrFolderMap;
}
