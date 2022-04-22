import { Options } from 'yargs';
import { Modify} from '../../../core/utils/types';
import { YargsOptionTypeToTsType } from '../../../core/utils/yargs/types';

export type Param = {
  outPath: Modify<Options, {
    type: 'string';
  }>
};
