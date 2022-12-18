import { ExecFn, Project, ProjectConfig } from '@push-based/cli-testing/cli-project';
import { InitCommandArgv } from '../../src/lib/commands/init/options/types';
import { GlobalOptionsArgv } from '../../src/lib/global/options/types';
import { CollectCommandArgv } from '../../src/lib/commands/collect/options/types';
import { CLI_MODES } from '../../src/lib/global/cli-mode/types';
import { RcJson } from '../../src/lib';

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
