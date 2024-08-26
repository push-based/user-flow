import { InferredOptionTypes, Options } from 'yargs';
import { openReport } from './openReport.js';
import { ufPath } from './ufPath.js';
import { configPath } from './configPath.js';
import { outPath } from './outPath.js';
import { url } from './url.js';
import { format } from './format.js';
import { serveCommand } from './serveCommand.js';
import { awaitServeStdout } from './awaitServeStdout.js';
import { dryRun } from './dryRun.js';
import { config } from './config.js';
import { GlobalCliOptions } from '../../../global/options/index.js';

export const persistOptions = {
  outPath,
  format,
  openReport
} satisfies Record<string, Options>;

export const collectOptions = {
  url,
  ufPath,
  config,
  configPath,
  serveCommand,
  awaitServeStdout,
  dryRun,
  ...persistOptions,
} satisfies Record<string, Options>;
export type CollectOptions = InferredOptionTypes<typeof collectOptions>;
export type CollectCommandOptions = CollectOptions & GlobalCliOptions;
