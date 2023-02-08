/**
 * THIS CODE IS MOSTLY COPIED FORM:
 * https://github.com/GoogleChrome/lighthouse
 */
import { default as LHR } from 'lighthouse/types/lhr/lhr';
import { ReducedFlowStepResult } from '../user-flow/types';
import FlowResult from 'lighthouse/types/lhr/flow';

export function parseSteps(steps: FlowResult.Step[]): ReducedFlowStepResult[]  {
  return steps.map((step) => {
    const stepReport = prepareReportResult(step.lhr);
    const { gatherMode } = stepReport;
    const categoriesEntries: [string, LHR.Category][] = Object.entries(stepReport.categories) as unknown as [string, LHR.Category][];
    const results: ReducedFlowStepResult = categoriesEntries.reduce((res, [categoryName, category]) => {
      res[categoryName] = (shouldDisplayAsFraction(stepReport.gatherMode) ?
        calculateCategoryFraction(category) : (category).score) as any;
      return res;
    }, {} as ReducedFlowStepResult);
    return { name: step.name, gatherMode, results };
  });
}


/**
 * This type is the result of `calculateCategoryFraction` https://github.com/GoogleChrome/lighthouse/blob/master/core/util.cjs#L540.
 * As there is no typing present ATM we maintain our own.
 */
export type FractionResults = {
  numPassed: number;
  numPassableAudits: number;
  numInformative: number;
  totalWeight: number;
}

const SCREENSHOT_PREFIX = 'data:image/jpeg;base64,';
const PASS_THRESHOLD = 0.9;
const RATINGS = {
  PASS: { label: 'pass', minScore: PASS_THRESHOLD },
  AVERAGE: { label: 'average', minScore: 0.5 },
  FAIL: { label: 'fail' },
  ERROR: { label: 'error' }
};

function shouldDisplayAsFraction(gatherMode: LHR.GatherMode) {
  return gatherMode === 'timespan' || gatherMode === 'snapshot';
}

/**
 * @param {LH.ReportResult.Category} category
 */
function calculateCategoryFraction(category: LHR.Category) {
  let numPassableAudits = 0;
  let numPassed = 0;
  let numInformative = 0;
  let totalWeight = 0;
  for (const auditR of category.auditRefs) {
    const auditRef = auditR as any;
    const auditPassed = showAsPassed(auditRef.result);

    // Don't count the audit if it's manual, N/A, or isn't displayed.
    if (auditRef.group === 'hidden' ||
      auditRef.result.scoreDisplayMode === 'manual' ||
      auditRef.result.scoreDisplayMode === 'notApplicable') {
      continue;
    } else if (auditRef.result.scoreDisplayMode === 'informative') {
      if (!auditPassed) {
        ++numInformative;
      }
      continue;
    }

    ++numPassableAudits;
    totalWeight += auditRef.weight;
    if (auditPassed) numPassed++;
  }
  return { numPassed, numPassableAudits, numInformative, totalWeight };
}

function showAsPassed(audit: any) {
  switch (audit.scoreDisplayMode) {
    case 'manual':
    case 'notApplicable':
      return true;
    case 'error':
    case 'informative':
      return false;
    case 'numeric':
    case 'binary':
    default:
      return Number(audit.score) >= RATINGS.PASS.minScore;
  }
}

function prepareReportResult(result: any) {
  // If any mutations happen to the report within the renderers, we want the original object untouched
  const clone = /** @type {LH.ReportResult} */ (JSON.parse(JSON.stringify(result)));

  // If LHR is older (≤3.0.3), it has no locale setting. Set default.
  if (!clone.configSettings.locale) {
    clone.configSettings.locale = 'en';
  }
  if (!clone.configSettings.formFactor) {
    clone.configSettings.formFactor = clone.configSettings.emulatedFormFactor;
  }

  for (const audit of Object.values(clone.audits) as any[]) {
    // Turn 'not-applicable' (LHR <4.0) and 'not_applicable' (older proto versions)
    // into 'notApplicable' (LHR ≥4.0).
    // eslint-disable-next-line max-len
    if (audit.scoreDisplayMode === 'not_applicable' || audit.scoreDisplayMode === 'not-applicable') {
      audit.scoreDisplayMode = 'notApplicable';
    }

    if (audit.details) {
      // Turn `auditDetails.type` of undefined (LHR <4.2) and 'diagnostic' (LHR <5.0)
      // into 'debugdata' (LHR ≥5.0).
      if (audit.details.type === undefined || audit.details.type === 'diagnostic') {
        audit.details.type = 'debugdata';
      }

      // Add the jpg data URL prefix to filmstrip screenshots without them (LHR <5.0).
      if (audit.details.type === 'filmstrip') {
        for (const screenshot of audit.details.items) {
          if (!screenshot.data.startsWith(SCREENSHOT_PREFIX)) {
            screenshot.data = SCREENSHOT_PREFIX + screenshot.data;
          }
        }
      }
    }
  }

  // For convenience, smoosh all AuditResults into their auditRef (which has just weight & group)
  if (typeof clone.categories !== 'object') throw new Error('No categories provided.');

  /** @type {Map<string, Array<LH.ReportResult.AuditRef>>} */
  const relevantAuditToMetricsMap = new Map();

  // This backcompat converts old LHRs (<9.0.0) to use the new "hidden" group.
  // Old LHRs used "no group" to identify audits that should be hidden in performance instead of the "hidden" group.
  // Newer LHRs use "no group" to identify opportunities and diagnostics whose groups are assigned by details type.
  const [majorVersion] = clone.lighthouseVersion.split('.').map(Number);
  const perfCategory = clone.categories['performance'];
  if (majorVersion < 9 && perfCategory) {
    if (!clone.categoryGroups) clone.categoryGroups = {};
    clone.categoryGroups['hidden'] = { title: '' };
    for (const auditRef of perfCategory.auditRefs) {
      if (!auditRef.group) {
        auditRef.group = 'hidden';
      } else if (['load-opportunities', 'diagnostics'].includes(auditRef.group)) {
        delete auditRef.group;
      }
    }
  }

  for (const category of Object.values(clone.categories) as any[]) {
    // Make basic lookup table for relevantAudits
    category.auditRefs.forEach((metricRef: any) => {
      if (!metricRef.relevantAudits) return;
      metricRef.relevantAudits.forEach((auditId: any) => {
        const arr = relevantAuditToMetricsMap.get(auditId) || [];
        arr.push(metricRef);
        relevantAuditToMetricsMap.set((auditId as any), arr);
      });
    });

    category.auditRefs.forEach((auditRef: any) => {
      const result = clone.audits[auditRef.id];
      auditRef.result = result;

      // Attach any relevantMetric auditRefs
      if (relevantAuditToMetricsMap.has(auditRef.id)) {
        auditRef.relevantMetrics = relevantAuditToMetricsMap.get(auditRef.id);
      }

      // attach the stackpacks to the auditRef object
      if (clone.stackPacks) {
        clone.stackPacks.forEach((pack: any) => {
          if (pack.descriptions[auditRef.id]) {
            auditRef.stackPacks = auditRef.stackPacks || [];
            auditRef.stackPacks.push({
              title: pack.title,
              iconDataURL: pack.iconDataURL,
              description: pack.descriptions[auditRef.id]
            });
          }
        });
      }
    });
  }

  return clone;
}
