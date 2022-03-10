import { Options } from 'yargs';
import { Modify } from '../../../internal/utils/types';

export type Param = {
  outPath: Modify<Options, {
    type: 'string';
  }>
};
