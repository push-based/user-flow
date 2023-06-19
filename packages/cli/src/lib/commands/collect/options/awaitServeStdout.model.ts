import { Options } from 'yargs';
import { Modify } from '../../../core/types';

export type Param = {
  awaitServeStdout: Modify<
    Options,
    {
      type: 'string';
    }
  >;
};
