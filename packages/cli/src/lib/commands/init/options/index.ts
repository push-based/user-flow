import { AssertYargsOptions } from '../../assert/options/types';
import { ASSERT_OPTIONS } from '../../assert/options';
import { COLLECT_OPTIONS } from '../../collect/options';
import { CollectYargsOptions } from '../../collect/options/types';
import { Project } from '../../../../../tests/utils/cli-testing/types';

export const INIT_OPTIONS: CollectYargsOptions & AssertYargsOptions = {
  ...COLLECT_OPTIONS,
  ...ASSERT_OPTIONS
};
