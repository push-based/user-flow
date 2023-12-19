import { Options } from 'yargs';
import { Modify } from '../../../core/types.js';

export type Param = {
  budgets: Modify<Options, {
    type: 'array';
  }>
};
