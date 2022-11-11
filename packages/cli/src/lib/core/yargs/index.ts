import * as yargs from 'yargs';
import { Options } from 'yargs';
import { YargsCommandObject } from './types';
import {get as getRcParam} from "../../global/options/rc";
import { log, logVerbose } from '../loggin';
import { RcArgvOptions } from '../..';
import { GlobalOptionsArgv } from '../../global/options/types';

export function setupYargs(
  commands: YargsCommandObject[],
  options: { [key: string]: Options },
  config: Options['configParser'],
) {
  yargs.options(options)
    .parserConfiguration({ 'boolean-negation': true })
    .recommendCommands()
    .config(config!(getRcParam()))
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
    command.module.handler
  ));
  return yargs;
}

export function runCli(cliCfg: {
  commands: YargsCommandObject[];
  options: { [key: string]: Options };
  config: Options['configParser']; //RcArgvOptions & GlobalOptionsArgv
}) {
  // apply `.argv` to get args as plain obj available
  setupYargs(cliCfg.commands, cliCfg.options, cliCfg.config).argv;
}

