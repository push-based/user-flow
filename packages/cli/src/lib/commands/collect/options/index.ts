import { CollectYargsOptions, PersistYargsOptions } from './types.js';
import { AssertYargsOptions } from '../../assert/options/types.js';
import { param as openReport } from './openReport.js';
import { param as ufPath } from './ufPath.js';
import { param as configPath } from './configPath.js';
import { param as outPath } from './outPath.js';
import { param as url } from './url.js';
import { param as format } from './format.js';
import { param as serveCommand } from './serveCommand.js';
import { param as awaitServeStdout } from './awaitServeStdout.js';
import { param as dryRun } from './dryRun.js';
import { ASSERT_OPTIONS } from '../../assert/options/index.js';

export const PERSIST_OPTIONS: PersistYargsOptions = {
  ...outPath,
  ...format,
  ...openReport
};

export const COLLECT_OPTIONS: CollectYargsOptions & AssertYargsOptions = {
  ...url,
  ...ufPath,
  ...configPath,
  ...serveCommand,
  ...awaitServeStdout,
  ...dryRun,
  ...PERSIST_OPTIONS,
  ...ASSERT_OPTIONS
};
