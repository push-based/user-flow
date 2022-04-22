import { Options } from 'yargs';
import { Modify } from '../utils/types';

export type Param = {
  rcPath: Modify<Options, {
    alias: 'p';
    type: 'string';
  }>
};
