import { CollectYargsOptions } from '../collect/options/types';
import { AssertYargsOptions } from '../assert/options/types';
import { collectOptions } from '../collect/options';
import { assertOptions } from '../assert/options';

export const initOptions: CollectYargsOptions & AssertYargsOptions = {
  ...collectOptions,
  ...assertOptions
};
