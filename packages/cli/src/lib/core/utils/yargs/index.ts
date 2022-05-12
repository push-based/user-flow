import * as yargs from 'yargs';
import { Options } from 'yargs';
import { YargsCommandObject } from './types';
import { RcArgvOptions, RcJson } from '../../../types';
import { CollectOptions, PersistOptions } from '../../rc-json/types';

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
  config: Record<string, any>
}) {
  // `.argv` to get ars as plain obj available
  setupYargs(cliCfg.commands, cliCfg.options, cliCfg.config).argv;
}

export function getCLIConfigFromArgv(argv: RcArgvOptions): RcJson {
  const { url, ufPath, serveCommand, awaitServeStdout, outPath, format, budgetPath, budgets } = (argv || {}) as any as (keyof CollectOptions & keyof PersistOptions);

  const cfg: RcJson = {
    collect: {
      url,
      ufPath,
      serveCommand,
      awaitServeStdout
    },
    persist: {
      outPath,
      format
    }
  };

  if (budgetPath || budgets) {
    cfg.assert = {
      budgetPath,
      budgets
    };
  }

  return cfg;
}
