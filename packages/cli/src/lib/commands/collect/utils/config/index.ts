import { readFile, writeFile } from '../../../../core/file';
import { logVerbose } from '../../../../core/loggin';
import { DEFAULT_COLLECT_CONFIG_PATH } from '../../options/configPath.constant';
import { LhConfigJson } from '../../../../hacky-things/lighthouse';
import { CollectCommandArgv, RcJson } from '../../../../../../../../dist/packages/cli/src/lib';
import { readBudgets } from '../../../../../../../../dist/packages/cli/src/lib/commands/assert/utils/budgets';
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

/**
 * merges [N] configurations into 1 and handles fallbacks
 * The
 */
export function mergeConfig(argvCfg: RcJson, flowLh: any) {
  // Steps before entering the command
  // this happens on CLI bootstrap in `configParser`
  // 1. get cfg from rc file
  // 2. get CLI params
  // 3. merged CLI into cfg from rc into argv => CLI overwrites RC
  // Steps in the command
  // 1. get config object for argv
  // 2.
}
