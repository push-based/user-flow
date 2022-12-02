import { ExecFn, Project, ProjectConfig } from '../../../../../cli-testing-lib/src/lib/cli-project/types';
import { InitCommandArgv } from '../../../../src/lib/commands/init/options/types';
import { GlobalOptionsArgv } from '../../../../src/lib/global/options/types';
import { CollectCommandArgv } from '../../../../src/lib/commands/collect/options/types';
import { CLI_MODES } from '../../../../src/lib/global/cli-mode/types';

export type UserFlowProject = Project & {
  $init: ExecFn<Partial<InitCommandArgv & GlobalOptionsArgv>>,
  $collect: ExecFn<Partial<CollectCommandArgv & GlobalOptionsArgv>>,
  readRcJson: (name: string) => string
}

export type UserFlowProjectConfig = ProjectConfig & UserFlowOnlyProjectConfig;
export type UserFlowOnlyProjectConfig = {
  cliMode?: CLI_MODES,
  serveCommandPort?: number
}
