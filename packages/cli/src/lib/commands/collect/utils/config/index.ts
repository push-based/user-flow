import { readFile, writeFile } from '../../../../core/file';
import { logVerbose } from '../../../../core/loggin';
import { DEFAULT_COLLECT_CONFIG_PATH } from '../../options/configPath.constant';
import { ConfigSettings } from 'lighthouse/types/lhr/settings';


export function readConfig(configPath: string = DEFAULT_COLLECT_CONFIG_PATH): ConfigSettings {
  const configJson = JSON.parse(readFile(configPath) || '{}');
  return configJson;
}

export function writeConfig(config: ConfigSettings, configPath: string = DEFAULT_COLLECT_CONFIG_PATH): void {
  logVerbose(`Update config under ${configPath}`);

  if (JSON.stringify(readConfig()) !== JSON.stringify(config)) {
    writeFile(configPath, JSON.stringify(config));
    logVerbose(`New config ${JSON.stringify(config)}`);
  } else {
    logVerbose(`No updates for ${configPath} to save.`);
  }
}
