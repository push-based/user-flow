import * as yargs from 'yargs';
import { CommandModule, Options } from 'yargs';
import { YargsCommandObject } from './types';
import { getCliConfig } from '../../boot-cli';

export function setupYargs(
  commands: YargsCommandObject[],
  options: { [key: string]: Options },
  config: Options['configParser']
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
    commandHandlerConfigMiddleWare(command.module.handler)
  ));
  return yargs;
}

function commandHandlerConfigMiddleWare(handler: CommandModule['handler']): CommandModule['handler'] {
  return (args: any): void | Promise<void> => {
    yargs.config(getCliConfig());
    return handler(args);
  };
}

export function runCli(cliCfg: {
  commands: YargsCommandObject[];
  options: { [key: string]: Options };
  config: Options['configParser']; // RcArgvOptions & GlobalOptionsArgv
}) {
  // apply `.argv` to get args as plain obj available
  setupYargs(cliCfg.commands, cliCfg.options, cliCfg.config).argv;
}

