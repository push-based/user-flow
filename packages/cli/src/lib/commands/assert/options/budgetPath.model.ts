import { Options } from 'yargs';
import { Modify } from '../../../core/types';

export type Param = {
  budgetPath: Modify<Options, {
    type: 'string';
  }>
};
