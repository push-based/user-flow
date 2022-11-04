import { Options } from 'yargs';
import { Modify } from '../../../core/types';

export type Param = {
  format: Modify<Options, {
    type: 'array';
  }>
};
