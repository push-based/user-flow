import { param as open } from './open';
import { param as ufPath } from './ufPath';
import { param as outPath } from './outPath';
import { param as url } from './url';
import { param as serveCommand } from './serveCommand';
import { param as awaitServeStdout } from './awaitServeStdout';
import { param as budgetPath } from '../../assert/options/budgetPath';
import { param as budgets } from '../../assert/options/budgets';

export const COLLECT_OPTIONS = {
  ...url,
  ...ufPath,
  ...outPath,
  ...open,
  ...serveCommand,
  ...awaitServeStdout,
  ...budgetPath,
  ...budgets
};
