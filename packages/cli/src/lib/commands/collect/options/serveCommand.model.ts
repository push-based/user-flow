import { Options } from 'yargs';
import { Modify } from '../../../core/utils/types';

export type Param = {
  serveCommand: Modify<Options, {
    type: 'string';
  }>
};
