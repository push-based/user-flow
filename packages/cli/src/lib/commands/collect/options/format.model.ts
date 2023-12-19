import { Options } from 'yargs';
import { Modify } from '../../../core/types.js';

export type Param = {
  format: Modify<Options, {
    type: 'array';
  }>
};
