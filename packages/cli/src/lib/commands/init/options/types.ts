import { YargsArgvOptionFromParamsOptions } from '../../../internal/utils/types';
import { AssertOptions } from '../../assert/options/types';
import { CollectOptions } from '../../collect/options/types';


export type InitOptions = CollectOptions & AssertOptions;
export type InitOptionsArgv = YargsArgvOptionFromParamsOptions<InitOptions>;


