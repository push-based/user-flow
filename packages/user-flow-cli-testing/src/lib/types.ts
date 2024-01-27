import { ExecFn, Project, ProjectConfig } from '@push-based/node-cli-testing';
import { CLI_MODES, CollectCommandArgv, GlobalOptionsArgv, InitCommandArgv, RcJson } from '@push-based/user-flow';

export {
  RcJson,
  UserFlowInteractionsFn,
  UserFlowContext,
  UserFlowProvider,
  ReportFormat
} from '@push-based/user-flow';

export type UserFlowProjectConfig = ProjectConfig<RcJson> & UserFlowOnlyProjectConfig;
export type UserFlowOnlyProjectConfig = {
  cliMode?: CLI_MODES,
  serveCommandPort?: number
}
