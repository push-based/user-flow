import { Options } from 'yargs';
import { Modify } from '../../../core/utils/types';

export type Param = {
  awaitServeStdout: Modify<Options, {
    type: 'string';
  }>
};
