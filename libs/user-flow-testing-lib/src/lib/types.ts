import { ProjectConfig } from '../../../cli-testing-lib/src/lib/cli-project/types';
import { CLI_MODES } from '../../../../packages/cli/src/lib/global/cli-mode/types';
import { RcJson } from '../../../../packages/cli/src/lib';

type UserFlowOnlyProjectConfig = {
  cliMode?: CLI_MODES,
  serveCommandPort?: number
}
export type UserFlowProjectConfig = ProjectConfig<RcJson> & UserFlowOnlyProjectConfig;
