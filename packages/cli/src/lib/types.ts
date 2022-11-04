import { CoreOptionsArgv } from './global/options/types';
import { CollectOptions, RcArgvOptions } from './global/rc-json/types';

export type ArgvPreset = Partial<CoreOptionsArgv & RcArgvOptions & CollectOptions>
