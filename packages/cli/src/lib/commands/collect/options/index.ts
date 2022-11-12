import { CollectYargsOptions } from './types';
import { AssertOptions } from '../../assert/options/types';
import { param as openReport } from './openReport';
import { param as ufPath } from './ufPath';
import { param as outPath } from './outPath';
import { param as url } from './url.param';
import { param as serveCommand } from './serveCommand';
import { param as awaitServeStdout } from './awaitServeStdout';
import { ASSERT_OPTIONS } from '../../assert/options';

export const COLLECT_OPTIONS: CollectYargsOptions & AssertOptions = {
  ...url,
  ...ufPath,
  ...outPath,
  ...openReport,
  ...serveCommand,
  ...awaitServeStdout,
  ...ASSERT_OPTIONS
};
