import { readFile, writeFile } from '../../core/file';

import { logVerbose } from '../../core/loggin';
import { get as getRcPath } from '../options/rc';
import { CollectOptions, PersistOptions, RcArgvOptions, RcJson } from './types';

export function readRcConfig(cfgPath: string = ''): RcJson {
  const configPath = cfgPath || getRcPath();
  const repoConfigFile = readFile(configPath) || '{}';
  logVerbose('readRcConfig:', configPath, JSON.parse(repoConfigFile))
  return JSON.parse(repoConfigFile);
}

export function updateRcConfig(config: RcJson, cfgPath: string = ''): void {
  const configPath = cfgPath || getRcPath();
  logVerbose(`Update config under ${configPath}`);
  // NOTICE: this is needed for better git flow.
  // Touch a file only if needed

  if (JSON.stringify(readRcConfig()) !== JSON.stringify(config)) {
    writeFile(configPath, JSON.stringify(config));
    logVerbose(`New config ${JSON.stringify(config)}`);
  } else {
    logVerbose(`No updates for ${configPath} to save.`);
  }
}

export function getCliOptionsFromRcConfig(config: RcJson): RcArgvOptions {
  const {collect, persist, assert} = config;
  return {...collect, ...persist, ...assert};
}

export function getCLIConfigFromArgv(argv: RcArgvOptions): RcJson {
  const { url, ufPath, serveCommand, awaitServeStdout, outPath, format, budgetPath, budgets } = (argv || {}) as any as (keyof CollectOptions & keyof PersistOptions);

  const cfg: RcJson = {
    collect: {
      url,
      ufPath,
      serveCommand,
      awaitServeStdout
    },
    persist: {
      outPath,
      format
    }
  };

  if (budgetPath || budgets) {
    cfg.assert = {
      budgetPath,
      budgets
    };
  }

  return cfg;
}
