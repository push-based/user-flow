import * as yargs from 'yargs';
import { Options } from 'yargs';
import { YargsCommandObject } from './types';
import { log, logVerbose } from '../loggin';
import { RcArgvOptions } from '../..';
import { GlobalOptionsArgv } from '../../global/options/types';

export function setupYargs(
  commands: YargsCommandObject[],
  options: { [key: string]: Options },
  config: Record<string, any> = {}
) {
  yargs.options(options)
    .parserConfiguration({ 'boolean-negation': true })
    .recommendCommands()
    .config(config)
    .example([
      ['init', 'Setup user-flows over prompts']
    ])
    .help();

  commands.forEach((command) => yargs.command(
    command.command,
    command.description,
    command?.builder || (() => {
    }),
    command.module.handler
  ));

  return yargs;
}

export function runCli(cliCfg: {
  commands: YargsCommandObject[];
  options: { [key: string]: Options };
  config: RcArgvOptions & GlobalOptionsArgv
}) {
  // apply `.argv` to get args as plain obj available
  setupYargs(cliCfg.commands, cliCfg.options, cliCfg.config).argv;
}

