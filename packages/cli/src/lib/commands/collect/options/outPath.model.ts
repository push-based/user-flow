import { Options } from 'yargs';
import { Modify, YargsOptionTypesToTsType } from '../../../internal/utils/types';

export type Param = {
  outPath: Modify<Options, {
    type: 'string';
  }>
};
