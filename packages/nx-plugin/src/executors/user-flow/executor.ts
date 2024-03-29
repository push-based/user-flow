import {UserFlowExecutorSchema} from './schema';
import {execSync} from 'child_process';
import {ExecutorContext} from "nx/src/config/misc-interfaces";
import * as process from "process";
import {CLI_MODES} from "@push-based/user-flow";
import {logger} from "@nx/devkit";


export default async function runExecutor(
  options: UserFlowExecutorSchema,
  context?: ExecutorContext & UserFlowExecutorSchema
): Promise<{ success: boolean, output: string }> {
  options.interactive = options.interactive !== undefined;
  const verbose = !!options.verbose;

  handleCliMode(options.cliMode, verbose);
  verbose && console.log('Executor ran for user-flow', options);
  const cliArgs = ['npx @push-based/user-flow collect'].concat(processParamsToParamsArray(options as any)).join(' ');

  verbose && console.log('Execute: ', cliArgs);

  let processOutput: Buffer | Error;
  try {
    processOutput = execSync(cliArgs);
  } catch (error: unknown) {
    if (error instanceof Error) {
      processOutput = error;
    } else {
      processOutput = new Error(String(error));
    }
  }
  const success = !(processOutput instanceof Error);
  const output = processOutput.toString();

  verbose && console.log('Result: ', output);

  return {
    success,
    output
  };
}
export function processParamsToParamsArray(params: Record<string, string | boolean | string[]>): string[] {
  return Object.entries(params).flatMap(([key, value]) => {
    if (key === '_') {
      return value.toString();
    } else if (Array.isArray(value)) {
      return value.map(v => `--${key}=${v.toString()}`);
    } else {
      // exception to align with nx options context
      if (key === 'outputPath') {
        key = 'outPath'
      }
      if (typeof value === 'string') {
        return [`--${key}="${value}"`];
      } else if (typeof value === 'boolean') {
        const noPrefix = value ? '' : 'no-';
        return [`--${noPrefix}${key}`];
      }
      return [`--${key}="${value}"`];
    }
  }) as string[];
}

function handleCliMode(cliMode: CLI_MODES = 'DEFAULT', verbose = false): void {
  const CI_PROPERTY = 'CI';
  switch (cliMode) {
    case "DEFAULT":
      // delete process.env[CI_PROPERTY];
      break;
    case "CI":
      process.env[CI_PROPERTY] = 'true';
      break;
    case "SANDBOX":
      process.env[CI_PROPERTY] = 'SANDBOX';
      break;
    default:
      throw new Error(`Wrong cliMode passed: ${cliMode}`);
  }
  verbose && logger.log('Nx executor runs in CLI mode: ', cliMode);
}

