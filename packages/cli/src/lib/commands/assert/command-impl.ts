import {RcJsonAsArgv} from "../../types";

import {logVerbose} from "../../core/loggin";
import {readBudgets} from "./utils/budgets";

export async function runAssertCommand(argv: RcJsonAsArgv) {
  logVerbose(readBudgets());
  return Promise.resolve();
}
