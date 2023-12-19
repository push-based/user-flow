import type { Budget, FlowResult} from 'lighthouse';

import { RequestCountResourceTypeBudgets, TransferSizeResourceTypeBudgets } from './constants.js';
import { logVerbose } from '../../core/loggin/index.js';

export function deriveBudgetsFromLhr(flow: FlowResult): Budget[] {
  const budgetObject: Budget = {};
  if (flow?.steps[0].lhr?.audits) {
    if (flow.steps[0].lhr.audits['resource-summary']) {
      const resourceSummary = flow.steps[0].lhr.audits['resource-summary'];
      // TODO fix typing Error
      // @ts-ignore
      budgetObject.resourceSizes = (resourceSummary.details.items as any)
        .filter(({ resourceType }: any) => TransferSizeResourceTypeBudgets.includes(resourceType))
        .map(({ resourceType, transferSize }: any) => ({
            resourceType,
            budget: transferSize
          })
        );
      // TODO fix typing Error
      // @ts-ignore
      budgetObject.resourceCounts = (resourceSummary.details.items as any)
        .filter(({ resourceType }: any) => RequestCountResourceTypeBudgets.includes(resourceType))
        .map(({ resourceType, requestCount }: any) => ({
            resourceType,
            budget: requestCount
          })
        );
    }
    else {
      logVerbose(`The lighthouse report does not contain a "resource-summary" audit`);
    }
    budgetObject.timings = [];
    if (flow.steps[0].lhr.audits['cumulative-layout-shift']) {
      budgetObject.timings.push({
        'metric': 'cumulative-layout-shift',
        // TODO fix typing Error
        // @ts-ignore
        'budget': flow.steps[0].lhr.audits['cumulative-layout-shift'].details.items[0].totalCumulativeLayoutShift
      });
    } else {
      logVerbose(`The lighthouse report does not contain a "cumulative-layout-shift" audit`);
    }

    if (flow.steps[0].lhr.audits['largest-contentful-paint']) {
      budgetObject.timings.push({
        'metric': 'largest-contentful-paint',
        // TODO fix typing Error
        // @ts-ignore
        'budget': parseInt(flow.steps[0].lhr.audits['largest-contentful-paint'].numericValue)
      });
    } else {
      logVerbose(`The lighthouse report does not contain a "largest-contentful-paint" audit`);
    }

  }
  return [budgetObject];
}

