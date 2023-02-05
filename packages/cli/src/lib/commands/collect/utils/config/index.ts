import { readFile, writeFile } from '../../../../core/file';
import { logVerbose } from '../../../../core/loggin';
import { DEFAULT_COLLECT_CONFIG_PATH } from '../../options/configPath.constant';
import { LhConfigJson } from '../../../../hacky-things/lighthouse';
import { CollectCommandArgv } from '../../options/types';
import { readBudgets } from '../../../assert/utils/budgets';
import Budget from 'lighthouse/types/lhr/budget';


export function readConfig(configPath: string = DEFAULT_COLLECT_CONFIG_PATH): LhConfigJson {
  const configJson = JSON.parse(readFile(configPath, {fail: true}));
  return configJson;
}

export function writeConfig(config: LhConfigJson, configPath: string = DEFAULT_COLLECT_CONFIG_PATH): void {
  logVerbose(`Update config under ${configPath}`);

  if (JSON.stringify(readConfig()) !== JSON.stringify(config)) {
    writeFile(configPath, JSON.stringify(config));
    logVerbose(`New config ${JSON.stringify(config)}`);
  } else {
    logVerbose(`No updates for ${configPath} to save.`);
  }
}

export function getLhConfigFromArgv(rc: Partial<Pick<CollectCommandArgv, 'configPath' | 'config' | 'budgets' | 'budgetPath'>>): LhConfigJson {
  let cfg: LhConfigJson = { };
  if(!!rc?.configPath && false /*!!rc?.config*/) {
    throw new Error("configPath and config can't be used together");
  }

  if(rc?.configPath) {
    cfg = readConfig(rc.configPath);
  } else {
    cfg = {} //rc?.config
  }

  if(!!rc?.budgetPath && !!rc?.budgets) {
    throw new Error("budgetPath and budgets can't be used together");
  }

  let budgets: Budget[] | undefined = undefined;
  if(rc?.budgetPath) {
    budgets = readBudgets(rc.budgetPath)
  } else if (rc?.budgets) {
    budgets = rc.budgets as Budget[]
  }
  if(budgets) {
    cfg = {
      ...cfg,
      settings: {
        ...cfg?.settings,
        budgets
      }
    }
  }

  return cfg;
}
