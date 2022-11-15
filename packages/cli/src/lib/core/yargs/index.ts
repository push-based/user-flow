import * as yargs from 'yargs';
import { Options } from 'yargs';
import { YargsCommandObject } from './types';
import { logVerbose } from '../loggin';
import { GlobalOptionsArgv } from '../../global/options/types';

export function setupYargs(
  commands: YargsCommandObject[],
  options: { [key: string]: Options },
  configParser: Options['configParser']
) {
  yargs.options(options)
    .parserConfiguration({ 'boolean-negation': true })
    .recommendCommands()
    .example([
      ['init', 'Setup user-flows over prompts']
    ])
    .help()
    .alias('h', 'help');

  commands.forEach((command) => yargs.command(
    command.command,
    command.description,
    command?.builder || (() => {
    }),
    (...args: any) => {
      yargs.config((configParser as any)());
      const {interactive, verbose, rcPath } = yargs.argv as unknown as GlobalOptionsArgv;
      logVerbose('Global options: ', {interactive, verbose, rcPath });
      return command.module.handler(yargs.argv as any);
    }
  ));
  return yargs;
}

export function runCli(cliCfg: {
  commands: YargsCommandObject[];
  options: { [key: string]: Options };
  configParser: Options['configParser']; //RcArgvOptions & GlobalOptionsArgv
}) {
  // apply `.argv` to get args as plain obj available
  setupYargs(cliCfg.commands, cliCfg.options, cliCfg.configParser).argv;
}

