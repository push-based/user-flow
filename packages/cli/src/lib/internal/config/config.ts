import { UserFlowRcConfig } from '../../types/model';
import { readFile, writeFile } from '../utils/file';
import { index } from '../utils/prettier/format-code';
import { logVerbose } from '../../core/loggin';
import { get as getRcPath } from '../../core/options/rc';

export function readRcConfig(cfgPath: string = ''): UserFlowRcConfig {
  const configPath = cfgPath || getRcPath();
  const repoConfigFile = readFile(configPath) || '{}';
  logVerbose('readRcConfig:', configPath, JSON.parse(repoConfigFile))
  return JSON.parse(repoConfigFile);
}

export function updateRepoConfig(config: UserFlowRcConfig, cfgPath: string = ''): void {
  const configPath = cfgPath || getRcPath();
  logVerbose(`Update config under ${configPath}`);
  // NOTICE: this is needed for better git flow.
  // Touch a file only if needed

  if (JSON.stringify(readRcConfig()) !== JSON.stringify(config)) {
    writeFile(configPath, index(JSON.stringify(config), 'json'));
    logVerbose(`New config ${JSON.stringify(config)}`);
  } else {
    logVerbose(`No updates for ${configPath} to save.`);
  }
}

