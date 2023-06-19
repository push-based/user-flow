import {Options} from 'yargs';
import {Modify} from '../../../core/types';
import {YargsOptionTypeToTsType} from '../../../core/yargs/types';

export type Param = {
  outPath: Modify<
    Options,
    {
      type: 'string';
    }
  >;
};
