import { CoreOptions} from './global/options/types';
import { CollectOptions, PersistOptions } from './global/rc-json/types';
import { YargsArgvOptionFromParamsOptions } from './core/yargs/types';

export type ArgvPreset = YargsArgvOptionFromParamsOptions<CoreOptions> &
  Pick<CollectOptions, 'dryRun'> &
  Pick<PersistOptions, 'format'| 'openReport'>;
