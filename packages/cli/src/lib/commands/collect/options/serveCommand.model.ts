import { Options } from 'yargs';
import { Modify } from '../../../core/types';

export type Param = {
  serveCommand: Modify<Options, {
    type: 'string';
  }>
};
