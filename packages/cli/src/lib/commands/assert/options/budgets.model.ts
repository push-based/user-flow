import { Options } from 'yargs';
import { Modify } from '../../../internal/utils/types';

export type Param = {
  budgets: Modify<Options, {
    type: 'array';
  }>
};
