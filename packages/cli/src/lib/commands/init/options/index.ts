import { AssertYargsOptions } from '../../assert/options/types';
import { assertOptions } from '../../assert/options';
import { COLLECT_OPTIONS } from '../../collect/options';
import { CollectYargsOptions } from '../../collect/options/types';

export const INIT_OPTIONS: CollectYargsOptions & AssertYargsOptions = {
  ...COLLECT_OPTIONS,
  ...assertOptions
};
