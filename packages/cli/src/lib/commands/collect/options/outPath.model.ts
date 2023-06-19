import { Options } from 'yargs';
import { Modify } from '../../../core/types';

export type Param = {
  outPath: Modify<
    Options,
    {
      type: 'string';
    }
  >;
};
