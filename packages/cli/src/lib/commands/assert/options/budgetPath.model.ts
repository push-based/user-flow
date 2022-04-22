import { Options } from 'yargs';
import { Modify } from '../../../core/utils/types';

export type Param = {
  budgetPath: Modify<Options, {
    type: 'string';
  }>
};
