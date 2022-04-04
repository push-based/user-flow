import { Options } from 'yargs';
import { Modify } from '../../../internal/utils/types';

export type Param = {
  awaitServeStdout: Modify<Options, {
    type: 'string';
  }>
};
