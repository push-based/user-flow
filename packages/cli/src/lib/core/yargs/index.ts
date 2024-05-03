import yargs from './instance.js'
import { Options } from 'yargs';
import { YargsCommandObject } from './types.js';
import { applyConfigMiddleware } from '../../config.middleware.js';

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
    applyConfigMiddleware(command.module.handler, configParser)
  ));
  return yargs;
}

export function runCli(cliCfg: {
  commands: YargsCommandObject[];
  options: { [key: string]: Options };
  configParser: Options['configParser'];
}) {
  // apply `.argv` to get args as plain obj available
  setupYargs(cliCfg.commands, cliCfg.options, cliCfg.configParser).argv;
}

