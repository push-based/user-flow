import { Options } from 'yargs';
import { Modify } from '../../../core/types.js';

export type Param = {
  serveCommand: Modify<Options, {
    type: 'string';
  }>
};
