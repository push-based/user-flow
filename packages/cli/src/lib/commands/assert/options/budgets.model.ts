import { Options } from 'yargs';
import { Modify } from '../../../core/utils/types';

export type Param = {
  budgets: Modify<Options, {
    type: 'array';
  }>
};
