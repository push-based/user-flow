import { readFile, writeFile } from '../../../../core/file/index.js';
import { logVerbose } from '../../../../core/loggin/index.js';
import { DEFAULT_COLLECT_CONFIG_PATH } from '../../options/configPath.constant.js';
import { CollectCommandArgv } from '../../options/types.js';
import { readBudgets } from '../../../assert/utils/budgets/index.js';
import Config from 'lighthouse/types/config.js'
import Budget from "lighthouse/types/lhr/budget.js";


export function readConfig(configPath: string = DEFAULT_COLLECT_CONFIG_PATH): Config {
  return JSON.parse(readFile(configPath, {fail: true}));
}

export function writeConfig(config: Config, configPath: string = DEFAULT_COLLECT_CONFIG_PATH): void {
  logVerbose(`Update config under ${configPath}`);

  if (JSON.stringify(readConfig()) !== JSON.stringify(config)) {
    writeFile(configPath, JSON.stringify(config));
    logVerbose(`New config ${JSON.stringify(config)}`);
  } else {
    logVerbose(`No updates for ${configPath} to save.`);
  }
}

export function getLhConfigFromArgv(rc: Partial<Pick<CollectCommandArgv, 'configPath' | 'config' | 'budgets' | 'budgetPath'>>): Config {
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

  if (!!rc?.budgetPath && !!rc?.budgets) {
    throw new Error('budgetPath and budgets can\'t be used together');
  }

  let budgets: Budget[] | undefined = undefined;
  if (rc?.budgetPath) {
    budgets = readBudgets(rc.budgetPath);
    logVerbose(`LH Performance Budget ${rc.budgetPath} is used from CLI param or .user-flowrc.json`);
  } else if (rc?.budgets) {
    budgets = rc.budgets as Budget[];
    logVerbose(`LH Performance Budget is used from config property .user-flowrc.json`);
  }
  if (budgets) {
    cfg = {
      ...cfg,
      settings: {
        ...cfg?.settings,
        budgets
      }
    };
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
    if (localCfg?.settings?.budgets) {
      logVerbose(`LH Performance Budget is used in a flows UserFlowProvider#flowOptions.settings.budgets`);
    }
  }

  if (Object.keys(cfg).length) {
    // Add extends if not given
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    cfg?.extends || (cfg.extends = 'lighthouse:default');
  }
  return cfg;
}
