import { FlowExamples, GhWorkflowExamples, BudgetsExamples } from './types.js';

export const REPORT_FORMAT = {
  Stdout: 'stdout',
  HTML: 'html',
  Markdown: 'md',
  JSON: 'json',
} as const;


export const SETUP_CONFIRM_MESSAGE = 'user-flow CLI is set up now! 🎉';
export const FlowExampleMap: Record<FlowExamples, string> = {
  'basic-navigation': 'basic-navigation.uf.ts'
};
export const GhWorkflowExampleMap: Record<GhWorkflowExamples, string> = {
  'basic-workflow': 'user-flow-ci.yml'
};
export const BudgetsExampleMap: Record<BudgetsExamples, string> = {
  'budgets': 'lh-budgets.json'
};
export const TransferSizeResourceTypeBudgets: string[] = [
  'xhr',
  'script',
  'stylesheet',
  'font',
  'document',
  'third-party'
];
export const RequestCountResourceTypeBudgets: string[] = [
  'xhr',
  'script',
  'stylesheet'
];
