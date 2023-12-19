import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { GlobalOptionsArgv } from './global/options/types.js';
import { logVerbose } from './core/loggin/index.js';
import { detectCliMode } from './global/cli-mode/cli-mode.js';
import { Options } from 'yargs';

const yargs = _yargs(hideBin(process.argv));

export function applyConfigMiddleware(handler: (...args: any) => void, configParser: Options['configParser']) {
  return (...args: any) => {
    yargs.config((configParser as any)());
    const { interactive, verbose, rcPath } = yargs.argv as unknown as GlobalOptionsArgv;
    logVerbose('CLI Mode: ', detectCliMode());
    logVerbose('Global options: ', { interactive, verbose, rcPath });
    return handler(yargs.argv as any);
  };
}
