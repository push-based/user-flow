import { readFile, writeFile } from '../../core/file';
import { logVerbose } from '../../core/loggin';
import { AssertOptions, CollectOptions, PersistOptions, RcArgvOptions, RcJson } from './types';
import { GlobalOptionsArgv } from '../options/types';
import { get as getRcParam, get as getRcPath } from './options/rc';
import { get as getVerbose } from '../options/verbose';
import { get as getInteractive } from '../options/interactive';

export function readRcConfig(rcPath: string = ''): RcJson {
  const configPath = rcPath || getRcPath();
  const repoConfigJson = readFile<RcJson>(configPath, { ext: 'json' }) || {};
  return repoConfigJson;
}

export function updateRcConfig(config: RcJson, rcPath: string = ''): void {
  const configPath = rcPath || getRcPath();
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

export function getCliOptionsFromRcConfig(rcPath?: string): RcArgvOptions {
  const { collect, persist, assert } = readRcConfig(rcPath || getRcParam());
  return { ...collect, ...persist, ...assert };
}

export function getCLIGlobalConfigFromArgv(): GlobalOptionsArgv {
  return {
    verbose: getVerbose(),
    rcPath: getRcPath(),
    interactive: getInteractive()
  };
}

export function getCLIConfigFromArgv(argv: RcArgvOptions): RcJson {
  const {
    url, ufPath, serveCommand, awaitServeStdout, dryRun, openReport,
    outPath, format, budgetPath, budgets } = (argv || {}) as any as (keyof CollectOptions & keyof PersistOptions);

  let collect = {} as CollectOptions;
  url && (collect.url = url);
  ufPath && (collect.ufPath = ufPath);
  serveCommand && (collect.serveCommand = serveCommand);
  awaitServeStdout && (collect.awaitServeStdout = awaitServeStdout);
  dryRun && (collect.dryRun = dryRun);
  openReport && (collect.openReport = openReport);

  let persist = {} as PersistOptions;
  outPath && (persist.outPath = outPath);
  format && (persist.format = format);

  let assert = {} as AssertOptions;
  budgetPath && (assert.budgetPath = budgets);
  budgets && (assert.budgets = budgets);

  return { collect, persist, assert };
}
