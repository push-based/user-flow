import { CoreOptions, GlobalOptionsArgv } from './global/options/types';
import { CollectOptions, PersistOptions, RcArgvOptions } from './global/rc-json/types';
import { YargsArgvOptionFromParamsOptions } from './core/yargs/types';

export type ArgvPreset = YargsArgvOptionFromParamsOptions<CoreOptions> &
  Pick<CollectOptions, 'dryRun'> &
  Pick<PersistOptions, 'format'| 'openReport'>;
