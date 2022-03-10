import { Options } from 'yargs';
import { Modify } from '../../internal/utils/types';

export type Param = {
  interactive: Modify<Options, {
    type: 'boolean';
  }>
};
