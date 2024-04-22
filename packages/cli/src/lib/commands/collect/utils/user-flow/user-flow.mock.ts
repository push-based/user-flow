import { Page } from 'puppeteer';
import { logVerbose } from '../../../../core/loggin';
import { FlowResult } from 'lighthouse';
import { StepOptions, UserFlowOptions } from './types';

const dummyFlowResult: (cfg: UserFlowOptions) => FlowResult = (cfg: UserFlowOptions): FlowResult => {
  const config = cfg?.config || {};
  logVerbose('dummy config used:', config);
  const report = {
    name: cfg.name,
    steps: [
      {
        name: 'Navigation report (127.0.0.1/)',
        lhr: {
          mock: true, // Notice: This is off standard and only here to check for mock data
          configSettings: config,
          lighthouseVersion: '9.5.0',
          requestedUrl: 'http://127.0.0.1:5032/',
          finalUrl: 'http://127.0.0.1:5032/',
          fetchTime: new Date().toISOString(),
          gatherMode: 'navigation',
          runtimeError: {
            'code': 'PROTOCOL_TIMEOUT',
            'message': 'Waiting for DevTools protocol response has exceeded the allotted time. (Method: Page.captureScreenshot)'
          },
          runWarnings: [],
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4889.0 Safari/537.36',
          environment: {
            'networkUserAgent': '',
            'hostUserAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4889.0 Safari/537.36',
            'benchmarkIndex': 601.5,
            'credits': { 'axe-core': '4.3.5' }
          },
          audits: {
            // "performance-budget": {},
            // "timing-budget": {},
            'is-on-https': {
              'id': 'is-on-https',
              'title': 'Uses HTTPS',
              'description': 'All sites should be protected with HTTPS, even ones that don\'t handle sensitive data. This includes avoiding [mixed content](https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content), where some resources are loaded over HTTP despite the initial request being served over HTTPS. HTTPS prevents intruders from tampering with or passively listening in on the communications between your app and your users, and is a prerequisite for HTTP/2 and many new web platform APIs. [Learn more](https://web.dev/is-on-https/).',
              'score': 1,
              'scoreDisplayMode': 'binary',
              'details': { 'type': 'table', 'headings': [], 'items': [] }
            },
            'service-worker': {
              'id': 'service-worker',
              'title': 'Does not register a service worker that controls page and `start_url`',
              'description': 'The service worker is the technology that enables your app to use many Progressive Web App features, such as offline, add to homescreen, and push notifications. [Learn more](https://web.dev/service-worker/).',
              'score': 0,
              'scoreDisplayMode': 'binary'
            },
            'viewport': {
              'id': 'viewport',
              'title': 'Has a `<meta name="viewport">` tag with `width` or `initial-scale`',
              'description': 'A `<meta name="viewport">` not only optimizes your app for mobile screen sizes, but also prevents [a 300 millisecond delay to user input](https://developers.google.com/web/updates/2013/12/300ms-tap-delay-gone-away). [Learn more](https://web.dev/viewport/).',
              'score': 1,
              'scoreDisplayMode': 'binary',
              'warnings': []
            },
            'first-contentful-paint': {
              'id': 'first-contentful-paint',
              'title': 'First Contentful Paint',
              'description': 'First Contentful Paint marks the time at which the first text or image is painted. [Learn more](https://web.dev/first-contentful-paint/).',
              'score': 1,
              'scoreDisplayMode': 'numeric',
              'numericValue': 724.2656,
              'numericUnit': 'millisecond',
              'displayValue': '0.7 s'
            },
            'largest-contentful-paint': {
              'id': 'largest-contentful-paint',
              'title': 'Largest Contentful Paint',
              'description': 'Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more](https://web.dev/lighthouse-largest-contentful-paint/)',
              'score': 1,
              'scoreDisplayMode': 'numeric',
              'numericValue': 724.2656,
              'numericUnit': 'millisecond',
              'displayValue': '0.7 s'
            }
          },
          categories: {
            "performance": {
              "title": "Performance",
              "supportedModes": ["navigation", "timespan", "snapshot"],
              "auditRefs": [
                {
                  "id": "first-contentful-paint",
                  "weight": 10,
                  "group": "metrics",
                  "acronym": "FCP",
                  "relevantAudits": [
                    "server-response-time",
                    "render-blocking-resources",
                    "redirects",
                    "critical-request-chains",
                    "uses-text-compression",
                    "uses-rel-preconnect",
                    "uses-rel-preload",
                    "font-display",
                    "unminified-javascript",
                    "unminified-css",
                    "unused-css-rules"
                  ]
                },
                {
                  "id": "interactive",
                  "weight": 10,
                  "group": "metrics",
                  "acronym": "TTI"
                },
                {
                  "id": "speed-index",
                  "weight": 10,
                  "group": "metrics",
                  "acronym": "SI"
                },
                {
                  "id": "total-blocking-time",
                  "weight": 30,
                  "group": "metrics",
                  "acronym": "TBT",
                  "relevantAudits": [
                    "long-tasks",
                    "third-party-summary",
                    "third-party-facades",
                    "bootup-time",
                    "mainthread-work-breakdown",
                    "dom-size",
                    "duplicated-javascript",
                    "legacy-javascript",
                    "viewport"
                  ]
                },
                {
                  "id": "largest-contentful-paint",
                  "weight": 25,
                  "group": "metrics",
                  "acronym": "LCP",
                  "relevantAudits": [
                    "server-response-time",
                    "render-blocking-resources",
                    "redirects",
                    "critical-request-chains",
                    "uses-text-compression",
                    "uses-rel-preconnect",
                    "uses-rel-preload",
                    "font-display",
                    "unminified-javascript",
                    "unminified-css",
                    "unused-css-rules",
                    "largest-contentful-paint-element",
                    "preload-lcp-image",
                    "unused-javascript",
                    "efficient-animated-content",
                    "total-byte-weight"
                  ]
                },
                {
                  "id": "cumulative-layout-shift",
                  "weight": 15,
                  "group": "metrics",
                  "acronym": "CLS",
                  "relevantAudits": [
                    "layout-shift-elements",
                    "non-composited-animations",
                    "unsized-images"
                  ]
                },
                { "id": "max-potential-fid", "weight": 0, "group": "hidden" },
                {
                  "id": "first-meaningful-paint",
                  "weight": 0,
                  "acronym": "FMP",
                  "group": "hidden"
                },
                { "id": "render-blocking-resources", "weight": 0 },
                { "id": "uses-responsive-images", "weight": 0 },
                { "id": "offscreen-images", "weight": 0 },
                { "id": "unminified-css", "weight": 0 },
                { "id": "unminified-javascript", "weight": 0 },
                { "id": "unused-css-rules", "weight": 0 },
                { "id": "unused-javascript", "weight": 0 },
                { "id": "uses-optimized-images", "weight": 0 },
                { "id": "modern-image-formats", "weight": 0 },
                { "id": "uses-text-compression", "weight": 0 },
                { "id": "uses-rel-preconnect", "weight": 0 },
                { "id": "server-response-time", "weight": 0 },
                { "id": "redirects", "weight": 0 },
                { "id": "uses-rel-preload", "weight": 0 },
                { "id": "uses-http2", "weight": 0 },
                { "id": "efficient-animated-content", "weight": 0 },
                { "id": "duplicated-javascript", "weight": 0 },
                { "id": "legacy-javascript", "weight": 0 },
                { "id": "preload-lcp-image", "weight": 0 },
                { "id": "total-byte-weight", "weight": 0 },
                { "id": "uses-long-cache-ttl", "weight": 0 },
                { "id": "dom-size", "weight": 0 },
                { "id": "critical-request-chains", "weight": 0 },
                { "id": "user-timings", "weight": 0 },
                { "id": "bootup-time", "weight": 0 },
                { "id": "mainthread-work-breakdown", "weight": 0 },
                { "id": "font-display", "weight": 0 },
                { "id": "resource-summary", "weight": 0 },
                { "id": "third-party-summary", "weight": 0 },
                { "id": "third-party-facades", "weight": 0 },
                { "id": "largest-contentful-paint-element", "weight": 0 },
                { "id": "lcp-lazy-loaded", "weight": 0 },
                { "id": "layout-shift-elements", "weight": 0 },
                { "id": "uses-passive-event-listeners", "weight": 0 },
                { "id": "no-document-write", "weight": 0 },
                { "id": "long-tasks", "weight": 0 },
                { "id": "non-composited-animations", "weight": 0 },
                { "id": "unsized-images", "weight": 0 },
                { "id": "viewport", "weight": 0 },
                { "id": "no-unload-listeners", "weight": 0 },
                { "id": "performance-budget", "weight": 0, "group": "budgets" },
                { "id": "timing-budget", "weight": 0, "group": "budgets" },
                { "id": "network-requests", "weight": 0, "group": "hidden" },
                { "id": "network-rtt", "weight": 0, "group": "hidden" },
                {
                  "id": "network-server-latency",
                  "weight": 0,
                  "group": "hidden"
                },
                { "id": "main-thread-tasks", "weight": 0, "group": "hidden" },
                { "id": "diagnostics", "weight": 0, "group": "hidden" },
                { "id": "metrics", "weight": 0, "group": "hidden" },
                { "id": "screenshot-thumbnails", "weight": 0, "group": "hidden" },
                { "id": "final-screenshot", "weight": 0, "group": "hidden" },
                { "id": "script-treemap-data", "weight": 0, "group": "hidden" }
              ],
              "id": "performance",
              "score": null
            }
          }
        } as any
      }
    ]
  };
  if (config) {
    report.steps[0].lhr.configSettings = config;
  }

  const budgets = config?.settings?.budgets;
  if (budgets) {
    report.steps[0].lhr.configSettings.budgets = budgets;
    report.steps[0].lhr.audits['performance-budget'] = {};
    report.steps[0].lhr.audits['timing-budget'] = {};
  }

  return report;
};

const dummyFlowReport: (cfg: UserFlowOptions) => string = (cfg: UserFlowOptions) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, minimum-scale=1"
/>
<title>Lighthouse Flow Report</title>
<style></style>
<script>
${JSON.stringify(dummyFlowResult(cfg))}
</script>
</head>
<body></body>
`;

/**
 * @TODO this is very flakey ATM and needs investigation
 */
export class UserFlowMock {

  protected cfg: UserFlowOptions = {} as any;
  protected name: string = '';
  protected page: Page;

  /**
   * @param {LH.NavigationRequestor} requestor
   * @param {StepOptions=} stepOptions
   */
  async navigate(requestor: any, { stepName }: StepOptions = {} as StepOptions): Promise<any> {
    logVerbose(`flow#navigate: ${stepName || requestor}`);
    return this.page.goto(requestor);
  }

  constructor(page: Page, cfg: UserFlowOptions) {
    this.page = page;
    this.cfg = cfg;
    this.name = cfg.name;
  }

  /**
   * @param {StepOptions=} stepOptions
   */
  async startTimespan({ stepName }: StepOptions = {} as StepOptions): Promise<void> {
    logVerbose(`flow#startTimespan: ${stepName}`);
    return Promise.resolve();
  }

  async endTimespan({ stepName }: StepOptions = {} as StepOptions): Promise<void> {
    logVerbose(`flow#endTimespan: ${stepName}`);
    return Promise.resolve();
  }

  /**
   * @param {StepOptions=} stepOptions
   */
  async snapshot({ stepName }: StepOptions = {} as StepOptions): Promise<void> {
    logVerbose(`flow#snapshot: ${stepName}`);
    return Promise.resolve();
  }

  /**
   * @return {LH.FlowResult}
   */
  getFlowResult(): FlowResult {
    logVerbose(`flow#getFlowResult`);
    return dummyFlowResult(this.cfg);
  }

  createFlowResult(): FlowResult {
    logVerbose(`flow#getFlowResult`);
    return dummyFlowResult(this.cfg);
  }

  /**
   * @return {Promise<string>}
   */
  generateReport(): Promise<string> {
    logVerbose(`flow#generateReport`);
    return Promise.resolve(dummyFlowReport(this.cfg));
  }

}

export class UserFlowReportMock {
  protected cfg: UserFlowOptions = {} as any;

  /**
   * @param {LH.NavigationRequestor} requestor
   * @param {StepOptions=} stepOptions
   */
  async navigate(requestor: any, { stepName }: StepOptions = {} as StepOptions): Promise<any> {
    logVerbose(`flow#navigate: ${stepName || requestor}`);
    return Promise.resolve();
  }

  constructor(cfg: UserFlowOptions) {
    this.cfg = cfg;
  }

  /**
   * @param {StepOptions=} stepOptions
   */
  async startTimespan({ stepName }: StepOptions = {} as StepOptions): Promise<void> {
    logVerbose(`flow#startTimespan: ${stepName}`);
    return Promise.resolve();
  }

  async endTimespan({ stepName }: StepOptions = {} as StepOptions): Promise<void> {
    logVerbose(`flow#endTimespan: ${stepName}`);
    return Promise.resolve();
  }

  /**
   * @param {StepOptions=} stepOptions
   */
  async snapshot({ stepName }: StepOptions = {} as StepOptions): Promise<void> {
    logVerbose(`flow#snapshot: ${stepName}`);
    return Promise.resolve();
  }

  /**
   * @return {LH.FlowResult}
   */
  getFlowResult(): FlowResult {
    logVerbose(`flow#getFlowResult`);
    return dummyFlowResult(this.cfg);
  }

  createFlowResult(): FlowResult {
    logVerbose(`flow#getFlowResult`);
    return dummyFlowResult(this.cfg);
  }

  /**
   * @return {Promise<string>}
   */
  generateReport(): Promise<string> {
    logVerbose(`flow#generateReport`);
    return Promise.resolve(dummyFlowReport(this.cfg));
  }

}
