import { YargsArgvOptionFromParamsOptions } from '../../../internal/utils/types';
import { Param as Open } from './open.model';
import { Param as UfPath } from './ufPath.model';
import { Param as OutPath } from './outPath.model';
import { Param as Url } from './url.model';
import { Param as ServeCommand } from './serveCommand.model';
import { Param as AwaitServeStdout } from './awaitServeStdout.model';
import { AssertOptions } from '../../assert/options/types';

export type CollectOptions = Open & UfPath & OutPath & Url & ServeCommand & AwaitServeStdout & AssertOptions;
export type CollectOptionsArgv = YargsArgvOptionFromParamsOptions<CollectOptions>;
