import { GlobalOptionsArgv } from './global/options/types';
import { RcArgvOptions } from './global/rc-json/types';

export type ArgvPreset = Partial<GlobalOptionsArgv & RcArgvOptions>
