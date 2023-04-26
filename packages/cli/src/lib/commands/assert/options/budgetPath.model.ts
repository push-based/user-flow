import { Options } from 'yargs';
import { Modify } from '../../../core/types.js';

export type Param = {
  budgetPath: Modify<Options, {
    type: 'string';
  }>
};
