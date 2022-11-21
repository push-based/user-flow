import { ExecaChildProcess } from 'execa';

export type PromptTestOptions = {
  timeout?: number
}


export type ProcessParams = {
  // command placeholder
  _: string
} & Record<string, boolean | number | string | string[]>

export type ExecFn = (processParams: ProcessParams, userInput?: string[], promptOptions?: PromptTestOptions) => Promise<ExecaChildProcess>;
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
    [value in keyof CliCommand]: (processParams: any, userInput?: string[]) => Promise<ExecaChildProcess>
  }

export type UserFlowProject = Project & {
  readRcJson: (name: string) => string
}

export type ProjectConfig = {
  root: string,
  bin: string,
  // the process env of the created process
  env?: Record<string, string>,
  delete?: string[],
  create?: Record<string, string>;
}
