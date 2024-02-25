import { logVerbose } from '../../core/loggin';
import { readBudgets } from './utils/budgets';

export async function runAssertCommand() {
  logVerbose(readBudgets());
  return Promise.resolve();
}
