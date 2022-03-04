import { UserFlowCliConfig } from '@user-flow/cli';
import { readFile } from '../utils/file';
import { writeFileSync } from "fs";
import { getConfigPath, logVerbose } from '../yargs/utils';
import { formatCode } from '../utils/format-code';

export function readRepoConfig(cfgPath: string = ''): UserFlowCliConfig {
  const configPath = cfgPath || getConfigPath();
  const repoConfigFile = readFile(configPath) || '{}';
  return JSON.parse(repoConfigFile);
}

export function updateRepoConfig(config: UserFlowCliConfig, cfgPath: string = ''): void {
  const configPath = cfgPath || getConfigPath();
  logVerbose(`update config under ${configPath}`);

  // NOTICE: this is needed for better git flow.
  // Touch a file only if needed
  if (JSON.stringify(readRepoConfig()) !== JSON.stringify(config)) {
    writeFileSync(configPath, formatCode(JSON.stringify(config), 'json'));
  } else {
    logVerbose(`No updates for ${configPath} to save.`);
  }
}

