import { Options } from 'yargs';
import { Modify } from '../../../core/types.js';

export type Param = {
  awaitServeStdout: Modify<Options, {
    type: 'string';
  }>
};
