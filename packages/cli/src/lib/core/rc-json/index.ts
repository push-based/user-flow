import { RcArgvOptions, RcJson } from '../../types';
import { readFile, writeFile } from '../utils/file';

import { logVerbose } from '../utils/loggin';
import { get as getRcPath } from '../options/rc';

export function readRcConfig(cfgPath: string = ''): RcJson {
  const configPath = cfgPath || getRcPath();
  const repoConfigFile = readFile(configPath) || '{}';
  logVerbose('readRcConfig:', configPath, JSON.parse(repoConfigFile))
  return JSON.parse(repoConfigFile);
}

export function updateRcConfig(config: RcJson, cfgPath: string = ''): void {
  const configPath = cfgPath || getRcPath();
  logVerbose(`Update config under ${configPath}`);
  // NOTICE: this is needed for better git flow.
  // Touch a file only if needed

  if (JSON.stringify(readRcConfig()) !== JSON.stringify(config)) {
    writeFile(configPath, JSON.stringify(config));
    logVerbose(`New config ${JSON.stringify(config)}`);
  } else {
    logVerbose(`No updates for ${configPath} to save.`);
  }
}

export function getCliOptionsFromRcConfig(config: RcJson): RcArgvOptions {
  const {collect, persist, assert} = config;
  return {...collect, ...persist, ...assert};
}

