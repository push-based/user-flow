import * as concat from 'concat-stream';
import * as execa from 'execa';
import { ExecaChildProcess, Options } from 'execa';
import { PromptTestOptions } from './types';

/**
 * @param {string[]} args CLI args to pass in
 * @param {string[]} answers answers to be passed to stdout
 * @param {Object} [options] specify the testPath and timeout
 *
 * returns {Promise<Object>}
 */
export function testProcessE2e(args: string[], answers: string[] = [], options: Options, promptOptions: PromptTestOptions): Promise<ExecaChildProcess> {
  // Defaults to process.cwd()

  // Timeout between each keystroke simulation
  const timeout = promptOptions && promptOptions.timeout ? promptOptions.timeout : 500;

  const runner: any = execa('node', args, options) as any;
  runner.stdin.setDefaultEncoding('utf-8');

  const writeToStdin = (answers) => {
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
    let obj: ExecaChildProcess = {} as unknown as ExecaChildProcess;

    runner.stdout.pipe(
      concat((result) => {
        obj.stdout = result.toString();
      })
    );

    runner.stderr.pipe(
      concat((result) => {
        obj.stderr = result.toString();
      })
    );

    runner.on('exit', (exitCode) => {
      (obj as unknown as any).exitCode = exitCode;
      resolve(obj);
    });
  });
};
