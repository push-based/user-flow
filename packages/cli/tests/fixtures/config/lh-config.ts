import { LhConfigJson } from '../../../src/lib/hacky-things/lighthouse';

export const LH_CONFIG_NAME = 'config.json';
export const LH_CONFIG: LhConfigJson = {
  extends: 'lighthouse:default',
  settings: {
    /** If present, the run should only conduct this list of audits. */
    onlyAudits: ['lcp-lazy-loaded']
    /** If present, the run should only conduct this list of categories. */
    //'only-categories': ['performance']
  }
};
