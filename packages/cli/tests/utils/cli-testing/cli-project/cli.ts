import { CliProcess, ProcessParams, ProcessTestOptions, ProjectConfig } from './types';
import { ExecaChildProcess, Options } from 'execa';
import { testProcessE2e } from '../process/test-process-e2e';
import { processParamsToParamsArray } from './utils';
import * as path from 'path';
import * as fs from 'fs';
import { PromptTestOptions } from '../process/types';
import { RcJson } from '../../../../src/lib';

/**
 * A closure for the testProcessE2e function to seperate process configuration and testing config from test data.
 *
 * @param processOptions: passed directly to execa as options
 */
export function getCliProcess(processOptions: Options, promptTestOptions: PromptTestOptions & ProcessTestOptions): CliProcess {
  return {
    exec: (processParams: ProcessParams = {}, userInput: string[] = []): Promise<ExecaChildProcess> => {
      return testProcessE2e([promptTestOptions.bin, ...processParamsToParamsArray(processParams)], userInput, processOptions, promptTestOptions);
    }
  };
}

/**
 * A helper class to manage an project structure for a yargs based CLI
 */
export class CliProject {

  /**
   * The folder in which to execute the process
   */
  protected root: string = '';

  /**
   * The the binary to execute
   */
  protected bin: string = '';

  /**
   * The process executing the CLI bin
   */
  protected process: CliProcess = undefined as unknown as CliProcess;

  /**
   * Filenames to delete e.g. in project teardown
   */
  protected deleteFiles: string[] = [];
  /**
   * Filenames to create e.g. in project setup
   */
  protected createFiles: Record<string, string> = {};
  /**
   * Filenames to create e.g. in project setup
   */
  protected rcFile: Record<string, RcJson> = {};

  constructor() {
  }

  async _setup(cfg: ProjectConfig): Promise<void> {
    // use configurations
    this.root = cfg.root;
    this.bin = cfg.bin;
    cfg.delete && (this.deleteFiles = cfg.delete);
    cfg.create && (this.createFiles = cfg.create);
    cfg.rcFile && (this.rcFile = cfg.rcFile);

    // handle default rcPath
    if (Object.keys(this.rcFile).length > 0) {
      Object.entries(this.rcFile).forEach(([rcName, rcContent]) => {
        this.deleteFiles.push(rcName);
        this.createFiles = { [rcName]: JSON.stringify(rcContent) };
      });
    }

    this.process = getCliProcess({
      cwd: this.root,
      env: cfg.env
    }, { bin: this.bin });

    // console.table(this);
  }

  /**
   * @internal
   * @protected
   *
   * Method to delete files generated during the CLI run
   */
  deleteGeneratedFiles(): void {
    (this.deleteFiles || [])
      .forEach((file) => {
        if (fs.existsSync(file)) {
          // console.info(`Deleted file ${file}`);
          fs.rmSync(file);
        } else {
          // console.error(`File ${file} does not exist`);
        }
      });
  }

  /**
   * @internal
   * @protected
   *
   * Method to create files needed during the CLI run
   */
  createInitialFiles(): void {
    Object.entries(this.createFiles || {})
      .map(entry => {
        entry[0] = path.join(this.root, entry[0]);
        return entry;
      })
      .forEach(([file, content]) => {
        if (fs.existsSync(file)) {
          fs.rmSync(file);
          // console.log(`File ${file} got deleted as it already exists`);
        }
        fs.writeFileSync(file, content, 'utf8');
      });
  }

  /**
   * Set up the project. e.g. create files, start processes
   */
  async setup(): Promise<void> {
    this.createInitialFiles();
  }


  /**
   * Teardown the project. e.g delete files, stop processes
   */
  async teardown(): Promise<void> {
    this.deleteGeneratedFiles();
  }

  /**
   * Executes the CLI with given parameters and user input.
   * See getCliProcess for details
   *
   * @param processParams
   * @param userInput
   */
  exec(processParams?: ProcessParams, userInput?: string[]): Promise<ExecaChildProcess> {
    return this.process.exec(processParams, userInput);
  }

}
