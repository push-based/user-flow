import {RcJsonAsArgv} from "../../types.js";

import {logVerbose} from "../../core/loggin/index.js";
import {readBudgets} from "./utils/budgets/index.js";

export async function runAssertCommand(argv: RcJsonAsArgv) {
  logVerbose(readBudgets());
  return Promise.resolve();
}
