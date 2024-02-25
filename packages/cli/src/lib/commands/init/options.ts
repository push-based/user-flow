import { CollectYargsOptions } from '../collect/options/types';
import { AssertYargsOptions } from '../assert/options/types';
import { collectOptions } from '../collect/options';
import { assertOptions } from '../assert/options';
import { InferredOptionTypes } from 'yargs';

export const initOptions: CollectYargsOptions & AssertYargsOptions = {
  ...collectOptions,
  ...assertOptions
};

export type InitOptions = InferredOptionTypes<typeof initOptions>;
