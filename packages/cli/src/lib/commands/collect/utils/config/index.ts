import { readFile } from '../../../../core/file/index.js';
import { logVerbose } from '../../../../core/loggin/index.js';
import { DEFAULT_COLLECT_CONFIG_PATH } from '../../options/configPath.constant.js';
import { Config } from 'lighthouse';
import { CollectCommandArgv } from '../../options/types.js';

export function readConfig(configPath: string = DEFAULT_COLLECT_CONFIG_PATH): Config {
  return JSON.parse(readFile(configPath, { fail: true }));
}

export function getLhConfigFromArgv(rc: Partial<Pick<CollectCommandArgv, 'configPath' | 'config'>>): Config {
  let cfg: Config = {};
  if (!!rc?.configPath && !!rc?.config) {
    throw new Error('configPath and config can\'t be used together');
  }

  if (rc?.configPath) {
    cfg = readConfig(rc.configPath);
    logVerbose(`LH Configuration ${rc.configPath} is used from CLI param or .user-flowrc.json`);
  } else if (rc?.config) {
    cfg = rc.config;
    logVerbose(`LH Configuration is used from config property .user-flowrc.json`);
  }

  return cfg;
}

export function mergeLhConfig(globalCfg: Config = {}, localCfg: Config = {}): Config {
  let cfg = { ...globalCfg };

  if (localCfg) {
    cfg = {
      ...cfg,
      ...localCfg,
      settings: {
        ...cfg.settings,
        ...localCfg?.settings
      }
    };
    logVerbose(`LH Configuration is used from a user flow file`);
  }

  if (Object.keys(cfg).length) {
    // Add extends if not given
    // @ts-ignore
    cfg?.extends || (cfg.extends = 'lighthouse:default');
  }
  return cfg;
}
