import { Options } from 'yargs';
import { openReport } from './openReport';
import { ufPath } from './ufPath';
import { configPath } from './configPath';
import { outPath } from './outPath';
import { url } from './url';
import { format } from './format';
import { serveCommand } from './serveCommand';
import { awaitServeStdout } from './awaitServeStdout';
import { dryRun } from './dryRun';
import { assertOptions } from '../../assert/options';

export const persistOptions = {
  outPath,
  format,
  openReport
} satisfies Record<string, Options>;

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
