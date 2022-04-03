import { Options } from 'yargs';
import { Modify } from '../../../internal/utils/types';

export type Param = {
  isSinglePageApplication: Modify<Options, {
    type: 'string';
  }>
};
