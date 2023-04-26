import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'
const yarg = yargs(hideBin(process.argv));
import { GlobalOptionsArgv } from './global/options/types.js';
import { logVerbose } from './core/loggin/index.js';
import { detectCliMode } from './global/cli-mode/cli-mode.js';
import { Options } from 'yargs';

export function applyConfigMiddleware(handler: (...args: any) => void, configParser: Options['configParser']) {
  return (...args: any) => {
    yarg.config((configParser as any)());
    const { interactive, verbose, rcPath } = yarg.argv as unknown as GlobalOptionsArgv;
    logVerbose('CLI Mode: ', detectCliMode());
    logVerbose('Global options: ', { interactive, verbose, rcPath });
    return handler(yarg.argv as any);
  };
}
