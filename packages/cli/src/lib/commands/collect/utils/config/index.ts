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

/**
 * A config that lists its own `artifacts` and has no `extends` is complete:
 * Lighthouse runs it as it is. Extending the default config merges its
 * artifacts with the default ones by id, which fails when the two describe the
 * same gatherer differently.
 */
export function isCompleteLhConfig(cfg: Config = {}): boolean {
  return !!cfg.artifacts && !cfg.extends;
}

export function mergeLhConfig(globalCfg: Config = {}, localCfg: Config = {}): Config {
  if (isCompleteLhConfig(localCfg)) {
    logVerbose(`LH Configuration is used from a user flow file`);
    // Only the global settings apply, a global `extends` would turn the
    // complete config into an extension of another config.
    const settings = { ...globalCfg?.settings, ...localCfg.settings };
    return Object.keys(settings).length ? { ...localCfg, settings } : { ...localCfg };
  }

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
    cfg.extends ||= 'lighthouse:default';
  }
  return cfg;
}
