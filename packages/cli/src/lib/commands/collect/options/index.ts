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
import { assertOptions } from '../../assert/options.js';

export const persistOptions = {
  outPath,
  format,
  openReport
} as const satisfies Record<string, Options>;

export const collectOptions = {
  url,
  ufPath,
  configPath,
  serveCommand,
  awaitServeStdout,
  dryRun,
  ...persistOptions,
  ...assertOptions
} satisfies Record<string, Options>;

export type CollectOptions = InferredOptionTypes<typeof collectOptions>;
