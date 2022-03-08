import * as yargs from 'yargs';
import { Options } from 'yargs';
import { YargsCommandObject } from './model';
import { getVerboseFlag } from './options';
import { readRepoConfig } from '../config/config';

export function setupYargs(
  commands: YargsCommandObject[],
  options: { [key: string]: Options }
) {
  yargs.options(options)
    .parserConfiguration({'boolean-negation': true})
    .recommendCommands()
    .example([
      ['init', 'Setup user-flows over prompts']
    ]);

  commands.forEach((command) => yargs.command(
      command.command,
      command.description,
      () => {},
      command.module.handler
    ));

  return yargs;
}

export function runCli(cliCfg: {
  commands: YargsCommandObject[];
  options: { [key: string]: Options };
}) {
  // `.argv` to get ars as plain obj
  setupYargs(cliCfg.commands, cliCfg.options).argv;
}


export function getCliParam(names: string[]): string | undefined {
  // @TODO move  cli stuff into separate task
  // Check for tag params from cli command
  const params = Object.keys(yargs.argv)
    .filter((k) => names.includes(k))
    .map((k) => (yargs as any).argv[k].toString().trim())
    .filter((p) => !!p);
  return params.length ? params.pop() : undefined;
}


export function getBooleanParam(paramValue: string | undefined): boolean {
  if (paramValue === undefined) {
    return false;
  }
  return paramValue !== 'false';
}

export function getStringParam(paramValue: string | undefined, fallBack = ''): string {
  return paramValue !== undefined ? paramValue : fallBack;
}

export function getConfigPath(): string {
  const argPath = getCliParam(['cfgPath', 'p']);
  return getStringParam(argPath, './.user-flowrc.json');
}

export function logVerbose(message: string | number | Symbol | Object | Array<any>, enforceLog = false): void {
  if (getVerboseFlag() || enforceLog) {
    return console.log(message);
  }
}
export function log(message: string | number | Symbol | Object | Array<any>): void {
    return console.log(message);
}

