import { Options } from 'yargs';
import { Modify } from '../../../core/types.js';

export type Param = {
  ufPath: Modify<Options, {
    type: 'string';
  }>
};
