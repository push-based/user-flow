// @ts-ignore
import * as concat from 'concat-stream';
import * as fs from 'fs';
import * as execa from 'execa';
import { PromptTestOptions, TestResult, ProcessOptions } from './types';

/**
 * A function to control a process and its in and outputs.
 * Starts a node process with a given configuration Takes parameters
 *
 * @param args
 * parameters passed to the process
 * @param answers
 * values to be passed to process
 * @param options
 * specify the process configuration
 * @param promptOptions
 * specify the process configuration
 */
export function testProcessE2e(args: string[] = [], answers: string[] = [], options: ProcessOptions = {}, promptOptions: PromptTestOptions = {}): Promise<TestResult> {
  // Defaults to process.cwd()

  // validate input
  if (!fs.existsSync(options.cwd + '')) {
    throw new Error(`cwd ${options.cwd} does not exist.`);
  }

  if (!fs.existsSync(args[0] as unknown as string)) {
    throw new Error(`bin file ${args[0]} does not exist.`);
  }

  // Timeout between each keystroke simulation
  const timeout = promptOptions && promptOptions.timeout ? promptOptions.timeout : 500;

  const runner: any = execa('node', args, options) as any;
  runner.stdin.setDefaultEncoding('utf-8');

  const writeToStdin = (answers: any[]) => {
    if (answers.length > 0) {
      setTimeout(() => {
        runner.stdin.write(answers[0]);
        writeToStdin(answers.slice(1));
      }, timeout);
    } else {
      runner.stdin.end();
    }
  };

  // Simulate user input (keystrokes)
  writeToStdin(answers);

  return new Promise((resolve) => {
    let obj: TestResult = {} as unknown as TestResult;

    runner.stdout.pipe(
      concat((result: any) => {
        obj.stdout = result.toString();
      })
    );

    runner.stderr.pipe(
      concat((result: any) => {
        obj.stderr = result.toString();
      })
    );

    runner.on('exit', (exitCode: number) => {
      (obj as unknown as any).exitCode = exitCode;
      resolve(obj);
    });
  });
};
