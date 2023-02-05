import { readFile, writeFile } from '../../../../core/file';
import { logVerbose } from '../../../../core/loggin';
import { DEFAULT_COLLECT_CONFIG_PATH } from '../../options/configPath.constant';
import { LhConfigJson } from '../../../../hacky-things/lighthouse';
import { CollectCommandArgv } from '../../options/types';
import { readBudgets } from '../../../assert/utils/budgets';
import Budget from 'lighthouse/types/lhr/budget';


export function readConfig(configPath: string = DEFAULT_COLLECT_CONFIG_PATH): LhConfigJson {
  const configJson = JSON.parse(readFile(configPath, { fail: true }));
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
  let cfg: LhConfigJson = {};
  if (!!rc?.configPath && !!rc?.config) {
    throw new Error('configPath and config can\'t be used together');
  }

  if (rc?.configPath) {
    cfg = readConfig(rc.configPath);
    logVerbose(`Configuration ${rc.configPath} is used instead of a potential configuration in the user-flow.uf.ts`);
  } else if (rc?.config) {
    cfg = rc.config;
    logVerbose(`Collect options budgets is used over CLI param or .user-flowrc.json. Configuration ${rc.config} is used instead of a potential configuration in the user-flow.uf.ts`);
  }
  // Add extends if not given
  // @ts-ignore
  cfg?.extends || (cfg.extends = 'lighthouse:default');


  if (!!rc?.budgetPath && !!rc?.budgets) {
    throw new Error('budgetPath and budgets can\'t be used together');
  }

  let budgets: Budget[] | undefined = undefined;
  if (rc?.budgetPath) {
    budgets = readBudgets(rc.budgetPath);
    logVerbose(`Collect options budgetPath is used over CLI param or .user-flowrc.json. Configuration ${rc.budgetPath} is used instead of a potential configuration in the user-flow.uf.ts`);
  } else if (rc?.budgets) {
    budgets = rc.budgets as Budget[];
    logVerbose(`Collect options budgets is used over CLI param or .user-flowrc.json. Configuration ${rc.budgets} is used instead of a potential configuration in the user-flow.uf.ts`);
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

export function mergeLhConfig(globalCfg: LhConfigJson = {}, localCfg: LhConfigJson = {}): LhConfigJson {

  let cfg = { ...globalCfg };
  // Add extends if not given
  // @ts-ignore
  cfg?.extends || (cfg.extends = 'lighthouse:default');

  if(localCfg) {
    cfg = {
      ...cfg,
      ...localCfg,
      settings: {
        ...cfg.settings,
        ...localCfg?.settings
      }
    };
    if(localCfg?.settings?.budgets) {
      logVerbose('Use budgets from UserFlowProvider objects under the flowOptions.settings.budgets property');
    }
  }
return cfg;
}
