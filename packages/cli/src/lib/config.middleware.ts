import { Options } from 'yargs';
import yargs from '../lib/core/yargs/instance.js';
import { GlobalOptionsArgv } from './global/options/types.js';
import { logVerbose } from './core/loggin/index.js';
import { detectCliMode } from './global/cli-mode/index.js';

export function applyConfigMiddleware(handler: (...args: any) => void, configParser: Options['configParser']) {
  return () => {
    yargs.config((configParser as any)());
    const { interactive, verbose, rcPath } = yargs.argv as unknown as GlobalOptionsArgv;
    logVerbose('CLI Mode: ', detectCliMode());
    logVerbose('Global options: ', { interactive, verbose, rcPath });
    return handler(yargs.argv as any);
  };
}
