import { ProjectConfig } from 'cli-testing-lib';
import { CLI_MODES } from '../src/lib/global/cli-mode/types';
import { RcJson } from '../src/lib';

type UserFlowOnlyProjectConfig = {
  cliMode?: CLI_MODES,
  serveCommandPort?: number
}
export type UserFlowProjectConfig = ProjectConfig<RcJson> & UserFlowOnlyProjectConfig;
