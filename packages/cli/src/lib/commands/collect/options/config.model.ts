import { Options } from 'yargs';
import { Modify } from '../../../core/types.js';

export type Param = {
  config: Modify<Options, {
    type: 'object';
  }>
};
