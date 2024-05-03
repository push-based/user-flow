import { logVerbose } from '../../core/loggin/index.js';
import { readBudgets } from './utils/budgets/index.js';

export async function runAssertCommand(): Promise<void> {
  logVerbose(readBudgets());
  return Promise.resolve();
}
