import { Options } from 'yargs';
import { Modify } from '../../../core/utils/types';

export type Param = {
  format: Modify<Options, {
    type: 'array';
  }>
};
