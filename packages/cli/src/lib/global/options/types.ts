import { Param as Verbose } from './verbose.model.js';
import { Param as Rc} from '../rc-json/options/rc.model.js';
import { Param as Interactive} from './interactive.model.js';
import { YargsArgvOptionFromParamsOptions } from '../../core/yargs/types.js';

export type CoreOptions = Verbose & Rc & Interactive;
export type GlobalOptionsArgv = YargsArgvOptionFromParamsOptions<CoreOptions>;


