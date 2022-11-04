import { AssertOptions } from '../../assert/options/types';
import { CollectYargsOptions } from '../../collect/options/types';
import { YargsArgvOptionFromParamsOptions } from '../../../core/yargs/types';


export type InitOptions = CollectYargsOptions & AssertOptions;
export type InitOptionsArgv = YargsArgvOptionFromParamsOptions<InitOptions>;


