import { ExecaChildProcess } from 'execa';

export type PromptTestOptions = {
  bin: string,
  timeout?: number
}


export type ProcessParams = {
  // command placeholder
  _?: string
} & Record<string, boolean | number | string | string[]>

export type ExecFn<T extends ProcessParams = ProcessParams> = (processParams?: T, userInput?: string[], promptOptions?: PromptTestOptions) => Promise<ExecaChildProcess>;
export type CliProcess = {
  exec: ExecFn
}

export type CliCommand = Record<`\$${string}`, ExecFn>;

export type Project = {
  root: string,
  deleteGeneratedFiles: () => void,
  createInitialFiles: () => void,
  exec: ExecFn,
} &
  {
    [value in keyof CliCommand]: ExecFn<any>
  }

export type ProjectConfig = {
  root: string,
  bin: string,
  // the process env of the created process
  env?: Record<string, string>,
  delete?: string[],
  create?: Record<string, string>;
}
