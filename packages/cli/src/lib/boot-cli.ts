import { commands } from './commands';
import { runCli } from './core/yargs';
import { getCLIGlobalConfigFromArgv, getCliOptionsFromRcConfig } from './global/rc-json';
import { GLOBAL_OPTIONS_YARGS_CFG } from './global/options';
import { getEnvPreset } from './global/rc-json/pre-set';
import { GlobalOptionsArgv } from './global/options/types';
import * as yargs from 'yargs';
import { detectCliMode } from './global/cli-mode/cli-mode';
import { RcArgvOptions } from './global/rc-json/types';

export function configParser(rcPath?: string): Partial<GlobalOptionsArgv & RcArgvOptions> {
  console.log('cfgParser rcPath: ', rcPath, '!!!!')
  let rcConfig: any = getCliOptionsFromRcConfig(rcPath);
  const preset = getEnvPreset();
  //console.log('rcConfig from file: ', rcConfig);
  // by default the CLI has:
  // - verbose to true
  //  If a .rc file is provided it:
  //    - over rights values // dryRun: false -> true
  //  If the CLI is used with the `--verbose` or `-v` param:
  //    - over rights verbose // true -> false
  //  If the CLI runs under test it has:
  //    - verbose to false // true -> false
  console.log('detectCliMode: ', detectCliMode());
  console.log('detectCliCFG:',  { ...rcConfig });

  // pre < rc  < param
  // verbose:
  //  D: false, S: true
  return { ...rcConfig };
}

(async () => runCli({
  commands: commands,
  options: { ...GLOBAL_OPTIONS_YARGS_CFG },
  config: configParser
}))();
