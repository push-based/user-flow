import { YargsArgvOptionFromParamsOptions } from '../../../internal/utils/types';
import { AssertOptions } from '../../assert/options/types';
import { CollectYargsOptions } from '../../collect/options/types';


export type InitOptions = CollectYargsOptions & AssertOptions;
export type InitOptionsArgv = YargsArgvOptionFromParamsOptions<InitOptions>;


