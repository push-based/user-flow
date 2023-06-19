import { CollectArgvOptions, PersistArgvOptions } from '../../options/types';

export type PersistFlowOptions = Pick<
  PersistArgvOptions,
  'outPath' | 'format'
> &
  Pick<CollectArgvOptions, 'url'>;
