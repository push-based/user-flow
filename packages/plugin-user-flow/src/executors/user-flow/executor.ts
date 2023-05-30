import {UserFlowExecutorSchema} from './schema';
import {execSync} from 'child_process';
import {ExecutorContext} from "nx/src/config/misc-interfaces";

export default async function runExecutor(options: UserFlowExecutorSchema, context?: ExecutorContext & { projectName: string }) {
  options.interactive = options.interactive !== undefined;

  const verbose = !!options.verbose;
  verbose && console.log('Executor ran for user-flow', options);
  const cliArgs = ['npx @push-based/user-flow collect -v'].concat(processParamsToParamsArray(options as any)).join(' ');

  verbose && console.log('Execute: ', cliArgs);
  const output = execSync(cliArgs).toString();
  return {
    success: true,
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
        return [`--${key}=${value + ''}`];
      } else if (typeof value === 'boolean') {
        return [`--${value ? '' : 'no-'}${key}`];
      }
      return [`--${key}=${value + ''}`];
    }
  }) as string[];
}

