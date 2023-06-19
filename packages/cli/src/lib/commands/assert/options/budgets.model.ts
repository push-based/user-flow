import { Options } from 'yargs';
import { Modify } from '../../../core/types';

export type Param = {
  budgets: Modify<
    Options,
    {
      type: 'array';
    }
  >;
};
