import { CollectArgvOptions, PersistArgvOptions } from '../../options/types.js';

export type PersistFlowOptions = Pick<PersistArgvOptions, 'outPath' | 'format'> & Pick<CollectArgvOptions, 'url'>;
