import { ExecFn, Project, ProjectConfig } from '@push-based/cli-testing/cli-project';
import { InitCommandArgv } from '@push-based/user-flow';
import { GlobalOptionsArgv } from '@push-based/user-flow';
import { CollectCommandArgv } from '@push-based/user-flow';
import { CLI_MODES } from '@push-based/user-flow';
import { RcJson } from '@push-based/user-flow';

export type UserFlowProject = Project & {
  $init: ExecFn<Partial<InitCommandArgv & GlobalOptionsArgv>>,
  $collect: ExecFn<Partial<CollectCommandArgv & GlobalOptionsArgv>>,
  readRcJson: (name: string) => string
}

export type UserFlowProjectConfig = ProjectConfig<RcJson> & UserFlowOnlyProjectConfig;
export type UserFlowOnlyProjectConfig = {
  cliMode?: CLI_MODES,
  serveCommandPort?: number
}
