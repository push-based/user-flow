import _yargs, { Options } from 'yargs';
import { hideBin } from 'yargs/helpers';

import { YargsCommandObject } from './types.js';
import { applyConfigMiddleware } from '../../config.middleware.js';
import { initCommand } from '../../commands/init/index.js';
import { GLOBAL_OPTIONS_YARGS_CFG } from '../../global/options/index.js';

export function setupYargs(
  commands: YargsCommandObject[],
  configParser: Options['configParser']
) {
  const yargs = _yargs(hideBin(process.argv));

  yargs
    .options(GLOBAL_OPTIONS_YARGS_CFG)
    .command([initCommand])
    .parserConfiguration({ 'boolean-negation': true })
    .recommendCommands()
    .example([['init', 'Setup user-flows over prompts']])
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
  configParser: Options['configParser'];
}) {
  return setupYargs(cliCfg.commands, cliCfg.configParser).argv;
}

