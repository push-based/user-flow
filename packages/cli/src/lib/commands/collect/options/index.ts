import { CollectYargsOptions, PersistYargsOptions } from './types';
import { AssertYargsOptions } from '../../assert/options/types';
import { param as openReport } from './openReport';
import { param as ufPath } from './ufPath';
import { param as outPath } from './outPath';
import { param as url } from './url';
import { param as format } from './format';
import { param as serveCommand } from './serveCommand';
import { param as awaitServeStdout } from './awaitServeStdout';
import { param as dryRun } from './dryRun';
import { ASSERT_OPTIONS } from '../../assert/options';

export const PERSIST_OPTIONS: PersistYargsOptions = {
  ...outPath,
  ...format,
  ...openReport
};

export const COLLECT_OPTIONS: CollectYargsOptions & AssertYargsOptions = {
  ...url,
  ...ufPath,
  ...serveCommand,
  ...awaitServeStdout,
  ...dryRun,
  ...PERSIST_OPTIONS,
  ...ASSERT_OPTIONS
};
