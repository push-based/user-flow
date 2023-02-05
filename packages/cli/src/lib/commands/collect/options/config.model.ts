import { Options } from 'yargs';
import { Modify } from '../../../core/types';

export type Param = {
  config: Modify<Options, {
    type: 'object';
  }>
};
