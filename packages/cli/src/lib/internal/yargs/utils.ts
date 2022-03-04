import * as yargs from 'yargs';
import { Options } from 'yargs';
import { YargsCommandObject } from './model';
import { getVerboseFlag } from './options';
import { format as prettier, Options as PrettierOptions, resolveConfig } from 'prettier';

export function setupYargs(
  commands: YargsCommandObject[],
  options: { [key: string]: Options }
) {
  commands.forEach((command) => {
    yargs.command(
      command.command,
      command.description,
      () => {},
      command.module.handler
    );
  });
  yargs.options(options).recommendCommands();

  return yargs;
}

export function runCli(cliCfg: {
  commands: YargsCommandObject[];
  options: { [key: string]: Options };
}) {
  setupYargs(cliCfg.commands, cliCfg.options).argv;
}


export function getCliParam(names: string[]): string | false {
  // @TODO move  cli stuff into separate task
  // Check for tag params from cli command
  const params = Object.keys(yargs.argv)
    .filter((k) => names.includes(k))
    .map((k) => (yargs as any).argv[k].toString().trim())
    .filter((p) => !!p);
  return params.length ? params.pop() : false;
}


export function getBooleanParam(paramValue: string | boolean): boolean {
  if (paramValue === false) {
    return false;
  }
  return paramValue !== 'false';
}

export function getStringParam(paramValue: string | false, fallBack = ''): string {
  return paramValue !== false ? paramValue : fallBack;
}

export function getConfigPath(): string {
  const argPath = getCliParam(['cfgPath', 'p']);
  return getStringParam(argPath, './.user-flowrc.json');
}

export function logVerbose(message: string, enforceLog = false): void {
  if (getVerboseFlag() || enforceLog) {
    return console.log(message);
  }
}

