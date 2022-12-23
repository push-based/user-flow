import { LhConfigJson } from '@push-based/user-flow';
import { LH_CONFIG_NAME_DEFAULT } from '@push-based/user-flow-cli-testing';

export const LH_CONFIG_NAME = LH_CONFIG_NAME_DEFAULT;
export const LH_CONFIG: LhConfigJson = {
  extends: 'lighthouse:default',
  settings: {
    /** If present, the run should only conduct this list of audits. */
    onlyAudits: ['lcp-lazy-loaded']
    /** If present, the run should only conduct this list of categories. */
    //'only-categories': ['performance']
  }
};
