import * as yargs from 'yargs';
import { GlobalOptionsArgv } from './global/options/types';
import { logVerbose } from './core/loggin';
import { detectCliMode } from './global/cli-mode/cli-mode';
import { RcJson, RcJsonAsArgv } from './types';
import { Options } from 'yargs';

export function applyConfigMiddleware(
  handler: (...args: any) => void,
  configParser: Options['configParser']
) {
  return (...args: any) => {
    yargs.config((configParser as any)());
    const {interactive, verbose, rcPath} =
      yargs.argv as unknown as GlobalOptionsArgv;
    logVerbose('CLI Mode: ', detectCliMode());
    logVerbose('Global options: ', {interactive, verbose, rcPath});
    return handler(yargs.argv as any);
  };
}
