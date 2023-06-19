import {CLI_MODES, CollectCommandCfg, GlobalOptionsArgv} from "@push-based/user-flow";

export type UserFlowExecutorSchema = {
  cliMode?: CLI_MODES
} & CollectCommandCfg & GlobalOptionsArgv; // eslint-disable-line
