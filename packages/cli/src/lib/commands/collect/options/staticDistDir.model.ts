import { Options } from 'yargs';
import { Modify } from '../../../internal/utils/types';

export type Param = {
  staticDistDir: Modify<Options, {
    type: 'string';
  }>
};
