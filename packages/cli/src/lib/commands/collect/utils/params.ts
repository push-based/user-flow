import {
  CollectArgvOptions,
  CollectCommandCfg,
  PersistArgvOptions
} from '../options/types.js';
import { CollectOptions } from '../options/index.js';


export function getCollectCommandOptionsFromArgv(argv: CollectOptions): CollectCommandCfg {

  const {
    url, ufPath, serveCommand, awaitServeStdout, dryRun, openReport,
    outPath, format, configPath, config
  } = (argv || {}) as Partial<CollectArgvOptions & PersistArgvOptions>;

  const collect = {} as CollectArgvOptions;
  if (url) collect.url = url;
  if (ufPath) collect.ufPath = ufPath;
  // optional
  if (serveCommand) collect.serveCommand = serveCommand;
  if (awaitServeStdout) collect.awaitServeStdout = awaitServeStdout;
  if (configPath) collect.configPath = configPath;
  if (config) collect.config = config;
  // cli only
  if (dryRun !== undefined) collect.dryRun = Boolean(dryRun);

  const persist = {} as PersistArgvOptions;
  if (outPath) persist.outPath = outPath;
  if (format) persist.format = format;
  // cli only
  if (openReport !== undefined) persist.openReport = Boolean(openReport);

  return { collect, persist };
}
