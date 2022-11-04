import { Param as Verbose } from './verbose.model';
import { Param as Rc} from './rc.model';
import { Param as Interactive} from './interactive.model';
import { YargsArgvOptionFromParamsOptions } from '../../core/yargs/types';

export type CoreOptions = Verbose & Rc & Interactive;
export type CoreOptionsArgv = YargsArgvOptionFromParamsOptions<CoreOptions>;


