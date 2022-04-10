import { Options } from 'yargs';
import { Modify } from '../../../internal/utils/types';

export type Param = {
  budgetPath: Modify<Options, {
    type: 'string';
  }>
};
