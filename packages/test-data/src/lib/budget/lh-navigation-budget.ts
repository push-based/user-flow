import Budget from 'lighthouse/types/lhr/budget';
import { LH_NAVIGATION_BUDGETS_NAME_DEFAULT } from './constants';

export const LH_NAVIGATION_BUDGETS_NAME = LH_NAVIGATION_BUDGETS_NAME_DEFAULT;
export const LH_NAVIGATION_BUDGETS: Budget[] = [
  {
    resourceSizes: [
      {
        resourceType: 'total',
        budget: 26,
      },
      {
        resourceType: 'script',
        budget: 150,
      },
    ],
    resourceCounts: [
      {
        resourceType: 'third-party',
        budget: 100,
      },
    ],
    timings: [
      {
        metric: 'interactive',
        budget: 5000,
      },
      {
        metric: 'first-meaningful-paint',
        budget: 2000,
      },
    ],
  },
];
