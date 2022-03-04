import { UserFlowCliConfig } from '@user-flow/cli';
import { readFile } from '../utils/file';
import { writeFileSync } from "fs";
import { formatCode, getConfigPath, logVerbose } from '../yargs/utils';
import { outPath, ufPath } from './constants';

export function readRepoConfig(): UserFlowCliConfig {
  const crawlerConfigPath = getConfigPath();
  const repoConfigFile = readFile(crawlerConfigPath) || '{}';
  return JSON.parse(repoConfigFile);
}

export function updateRepoConfig(config: UserFlowCliConfig): void {
  const configPath = getConfigPath();
  logVerbose(`update config under ${configPath}`);
  writeFileSync(configPath, formatCode(JSON.stringify(config), 'json'));
}


export function ensureConfigDefaults(
  userConfig: UserFlowCliConfig
): UserFlowCliConfig {
  return {
    ufPath,
    outPath,
    // override defaults with user settings
    ...userConfig,
  };
}
