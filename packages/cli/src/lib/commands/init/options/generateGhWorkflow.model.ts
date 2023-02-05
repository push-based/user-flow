import { Options } from 'yargs';
import { Modify } from '../../../core/types';

export type Param = {
  generateGhWorkflow: Modify<Options, {
    type: 'boolean';
    default?: boolean;
  }>
};
