import { ProjectConfig } from '@push-based/node-cli-testing';
import { CLI_MODES, RcJson } from '@push-based/user-flow';

export type UserFlowProjectConfig = ProjectConfig<RcJson> & UserFlowOnlyProjectConfig;
export type UserFlowOnlyProjectConfig = {
  cliMode?: CLI_MODES,
  serveCommandPort?: number
}
