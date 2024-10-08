import {
  CollectArgvOptions,
  CollectCommandCfg,
  CollectRcOptions,
  PersistArgvOptions,
  PersistRcOptions
} from '../options/types.js';
import { CollectOptions } from '../options/index.js';


export function getCollectCommandOptionsFromArgv(argv: CollectOptions): CollectCommandCfg {

  const {
    url, ufPath, serveCommand, awaitServeStdout, dryRun, openReport,
    outPath, format, configPath, config
  } = (argv || {}) as any as (keyof CollectRcOptions & keyof PersistRcOptions);

  let collect = {} as CollectArgvOptions;
  url && (collect.url = url);
  ufPath && (collect.ufPath = ufPath);
  // optional
  serveCommand && (collect.serveCommand = serveCommand);
  awaitServeStdout && (collect.awaitServeStdout = awaitServeStdout);
  configPath && (collect.configPath = configPath);
  config && (collect.config = config);
  // cli only
  dryRun !== undefined && (collect.dryRun = Boolean(dryRun));

  let persist = {} as PersistArgvOptions;
  outPath && (persist.outPath = outPath);
  format && (persist.format = format);
  // cli only
  openReport !== undefined && (persist.openReport = Boolean(openReport));

  return { collect, persist };
}
