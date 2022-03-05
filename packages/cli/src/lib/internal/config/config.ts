import { UserFlowCliConfig } from '@user-flow/cli';
import { readFile, writeFile } from '../utils/file';
import { getConfigPath, logVerbose } from '../yargs/utils';
import { formatCode } from '../utils/format-code';

export function readRepoConfig(cfgPath: string = ''): UserFlowCliConfig {
  const configPath = cfgPath || getConfigPath();
  const repoConfigFile = readFile(configPath) || '{}';
  return JSON.parse(repoConfigFile);
}

export function updateRepoConfig(config: UserFlowCliConfig, cfgPath: string = ''): void {
  const configPath = cfgPath || getConfigPath();
  logVerbose(`Update config under ${configPath}`);

  // NOTICE: this is needed for better git flow.
  // Touch a file only if needed
  if (JSON.stringify(readRepoConfig()) !== JSON.stringify(config)) {
    writeFile(configPath, formatCode(JSON.stringify(config), 'json'));
  } else {
    logVerbose(`No updates for ${configPath} to save.`);
  }
}

