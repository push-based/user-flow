import { Options } from 'yargs';
import { Modify} from '../../../core/types.js';

export type Param = {
  outPath: Modify<Options, {
    type: 'string';
  }>
};
