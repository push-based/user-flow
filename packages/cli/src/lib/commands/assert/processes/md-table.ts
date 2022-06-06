import {default as LHR} from 'lighthouse/types/lhr/lhr';

const SCREENSHOT_PREFIX = 'data:image/jpeg;base64,';
const DISPLAYED_CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
const THUMBNAIL_WIDTH = 40;


/**
 *
 * | Steps           | Performance | Accessibility | BestPractices | Seo |
 * | --------------- | ----------- | ------------- | ------------- | --- |
 * |  Nav1           |  99         | 50            | 100           | 98  |
 * |  Snap   1       |  3/2        | 100           | 100           | 100 |
 * |  TimeSpan 1     |  100        | 100           | 100           | 100 |
 */
export function userFlowReportToMdTable(
  result: {steps: {lhr: LHR, name: string}[]}
): string {

  return summaryFlowStep({
    lhr: result.steps[0].lhr,
    label:  result.steps[0].name,
    hashIndex: 0
  }) as any as string;
}

function prepareReportResult(result: LHR): LHR {
  // If any mutations happen to the report within the renderers, we want the original object untouched
  // @TODO use structured clone
  const clone = /** @type {LH.ReportResult} */ (JSON.parse(JSON.stringify(result)));

  if (!clone.configSettings.formFactor) {
    clone.configSettings.formFactor = clone.configSettings.emulatedFormFactor;
  }

  // For convenience, smoosh all AuditResults into their auditRef (which has just weight & group)
  if (typeof clone.categories !== 'object') throw new Error('No categories provided.');

  const relevantAuditToMetricsMap = new Map();

  for (const category of Object.values(clone.categories)) {
    // Make basic lookup table for relevantAudits
    (category as any).auditRefs.forEach((metricRef: any) => {
      if (!metricRef.relevantAudits) return;
      metricRef.relevantAudits.forEach((auditId: any) => {
        const arr = relevantAuditToMetricsMap.get(auditId) || [];
        arr.push(metricRef);
        relevantAuditToMetricsMap.set(auditId, arr);
      });
    });

    (category as any).auditRefs.forEach((auditRef: any) => {
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


function getModeDescription(mode: LHR.GatherMode/*LH.Result.GatherMode*/, strings: any) {
  switch (mode) {
    case 'navigation': return strings.navigationDescription;
    case 'timespan': return strings.timespanDescription;
    case 'snapshot': return strings.snapshotDescription;
  }
}

// @ts-ignore
const summaryNavigationHeader = (lhr: LHR): string =>
  `| ${lhr.finalUrl} | ${'categoriePerformance'} | categoryAccessibility | categoryBestPractices | categorySeo |` +
  `| --------------- | ------------------------- | --------------------- | --------------------- | ----------- |`;


const summaryFlowStep = (cfg: {
  // @ts-ignore
  lhr: LHR,
  label: string,
  hashIndex: number
}) => {
  const { lhr, label, hashIndex } = cfg;

  const reportResult = prepareReportResult(lhr);
  const modeDescription = getModeDescription(lhr.gatherMode, ['strings']);

  const t = lhr.gatherMode === 'navigation' && summaryNavigationHeader(lhr);
  const flowStepThumbnail = THUMBNAIL_WIDTH;
  const mode = lhr.gatherMode;

  return DISPLAYED_CATEGORIES.map(c => ({
    key: c,
    category: reportResult.categories[c],
    href: `anchor=${c}`,
    gatherMode: lhr.gatherMode,
    finalUrl: lhr.finalUrl
  }));


};

/*
const SummaryFlow: FunctionComponent = () => {
  const flowResult = useFlowResult();
  return (
    <div className="SummaryFlow">
      {
        flowResult.steps.map((step, index) =>
          <SummaryFlowStep
            key={step.lhr.fetchTime}
        lhr={step.lhr}
        label={step.name}
        hashIndex={index}
  />
)
}
  </div>
);
};

const SummaryHeader: FunctionComponent = () => {
  const flowResult = useFlowResult();
  const strings = useLocalizedStrings();
  const str_ = useStringFormatter();

  let numNavigation = 0;
  let numTimespan = 0;
  let numSnapshot = 0;
  for (const step of flowResult.steps) {
    switch (step.lhr.gatherMode) {
      case 'navigation':
        numNavigation++;
        break;
      case 'timespan':
        numTimespan++;
        break;
      case 'snapshot':
        numSnapshot++;
        break;
    }
  }

  const subtitleCounts = [];
  if (numNavigation) subtitleCounts.push(str_(strings.navigationReportCount, {numNavigation}));
  if (numTimespan) subtitleCounts.push(str_(strings.timespanReportCount, {numTimespan}));
  if (numSnapshot) subtitleCounts.push(str_(strings.snapshotReportCount, {numSnapshot}));
  const subtitle = subtitleCounts.join(' · ');

  return (
    <div className="SummaryHeader">
    <div className="SummaryHeader__title">{strings.summary}</div>
      <div className="SummaryHeader__subtitle">{subtitle}</div>
    </div>
);
};

const SummarySectionHeader: FunctionComponent = ({children}) => {
  return (
    <div className="SummarySectionHeader">
    <div className="SummarySectionHeader__content">{children}</div>
      <Separator/>
      </div>
  );
};

const Summary: FunctionComponent = () => {
  const strings = useLocalizedStrings();

  return (
    <div className="Summary" data-testid="Summary">
    <SummaryHeader/>
    <Separator/>
    <SummarySectionHeader>{strings.allReports}</SummarySectionHeader>
    <SummaryFlow/>
    </div>
);
};
*/
