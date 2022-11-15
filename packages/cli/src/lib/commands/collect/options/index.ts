import { CollectYargsOptions, PersistYargsOptions } from './types';
import { AssertOptions } from '../../assert/options/types';
import { param as url } from './url.param';
import { param as ufPath } from './ufPath';
import { param as outPath } from './outPath';
import { param as serveCommand } from './serveCommand';
import { param as awaitServeStdout } from './awaitServeStdout';
import { param as openReport } from './openReport';
import { param as dryRun } from './dryRun';
import { param as format } from './format';
import { ASSERT_OPTIONS } from '../../assert/options';

export const PERSIST_OPTIONS: PersistYargsOptions = {
  ...outPath,
  ...format,
  ...openReport
};


export const COLLECT_OPTIONS: CollectYargsOptions & AssertOptions & PersistYargsOptions = {
  ...url,
  ...ufPath,
  ...serveCommand,
  ...awaitServeStdout,
  ...dryRun,
  ...PERSIST_OPTIONS,
  ...ASSERT_OPTIONS
};
