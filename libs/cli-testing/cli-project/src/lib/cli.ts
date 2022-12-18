import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { CliProcess, FileOrFolderMap, ProcessParams, ProcessTestOptions, ProjectConfig } from './types';
import { ProcessOptions, PromptTestOptions, testProcessE2e, TestResult } from '@push-based/cli-testing/process';
import { deleteFileOrFolder, processParamsToParamsArray } from './utils';

/**
 * A closure for the testProcessE2e function to seperate process configuration and testing config from test data.
 *
 * @param processOptions: passed directly to execa as options
 */
export function getCliProcess(processOptions: ProcessOptions, promptTestOptions: PromptTestOptions & ProcessTestOptions): CliProcess {
  return {
    exec: (processParams: ProcessParams = {}, userInput: string[] = []): Promise<TestResult> => {
      const processOpts = [promptTestOptions.bin, ...processParamsToParamsArray(processParams)];
      return testProcessE2e(processOpts, userInput, processOptions, promptTestOptions);
    }
  };
}

/**
 * A helper class to manage an project structure for a yargs based CLI
 */
export class CliProject<RcConfig extends {}> {

  /**
   * A flag to add more detailed information as logs
   */
  protected verbose: boolean = false;

  /**
   * The folder in which to execute the process
   */
  public root: string = '';

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
   * All files are located from root
   */
  protected deleteFiles: string[] = [];
  /**
   * Filenames to create e.g. in project setup
   * All files are located from root
   */
  protected createFiles: FileOrFolderMap = {};
  /**
   * Filenames to create e.g. in project setup
   */
  protected rcFile: Record<string, RcConfig> = {};

  constructor() {
  }

  /**
   * freezes jest so we can read logs :)
   * @param ms
   */
  async wait(ms: number = 30000) {
    await new Promise(r => setTimeout(r, ms));
  }

  logVerbose(...args: any): void {
    this.verbose && console.log(...args);
  }

  tableVerbose(...args: any): void {
    this.verbose && console.table(...args);
  }

  async _setup(cfg: ProjectConfig<RcConfig>): Promise<void> {
    // global settings
    this.verbose = Boolean(cfg.verbose);

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
        this.createFiles[rcName] = rcContent;
      });
    }

    // remove duplicated paths
    this.deleteFiles = Array.from(new Set(this.deleteFiles));

    this.process = getCliProcess({
      cwd: this.root,
      env: cfg.env
    }, { bin: this.bin });
  }

  /**
   * @internal
   * @protected
   *
   * Method to delete files generated during the CLI run
   * Notice all files will get located from the project root
   */
  deleteGeneratedFiles(): void {
    deleteFileOrFolder((this.deleteFiles || [])
      .map(file => join(this.root, file))
    );
  }

  /**
   * @internal
   * @protected
   *
   * Method to create files needed during the CLI run
   * Notice all files will get located from the project root
   */
  createInitialFiles(): void {
    const preparedPaths = Object.entries(this?.createFiles || {})
      .map(entry => {
        entry[0] = join(this.root, entry[0]);
        return entry;
      });
    preparedPaths
      .forEach(([file, content]) => {
        const exists = existsSync(file);
        if (exists) {
          if (content !== undefined) {
            rmSync(file);
            this.logVerbose(`File ${file} got deleted as it already exists`);
          }
        }
        if (content === undefined) {
          !exists && mkdirSync(file, { recursive: true });
        } else {
          const dir = dirname(file);
          if (!existsSync(dir)) {
            this.logVerbose(`Created dir ${dir} to save ${file}`);
            mkdirSync(dir);
          }

          function base64_encode(file: string) {
            // read binary data
            var bitmap = readFileSync(file);
            // convert binary data to base64 encoded string
            return new Buffer(bitmap).toString('base64');
          }

          switch (true) {
            case file.endsWith('.png'):
            case file.endsWith('.ico'):
              content = Buffer.from(content + '', 'base64') as any;
              break;
            case file.endsWith('.json'):
              content = JSON.stringify(content) as any;
              break;
          }

          writeFileSync(file, content as any, 'utf8');
        }
        this.logVerbose(`File ${file} created`);
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
  exec(processParams?: ProcessParams, userInput?: string[]): Promise<TestResult> {
    return this.process.exec(processParams, userInput);
  }

}
