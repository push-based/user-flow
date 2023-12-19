import { Options } from 'yargs';
import { Modify } from '../../../core/types.js';

export type Param = {
  configPath: Modify<Options, {
    type: 'string';
  }>
};
