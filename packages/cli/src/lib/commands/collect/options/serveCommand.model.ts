import { Options } from 'yargs';
import { Modify } from '../../../internal/utils/types';

export type Param = {
  serveCommand: Modify<Options, {
    type: 'string';
  }>
};
