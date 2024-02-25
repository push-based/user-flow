export const SETUP_CONFIRM_MESSAGE = 'user-flow CLI is set up now! 🎉';
export const FlowExampleMap = {
  'basic-navigation': 'basic-navigation.uf.ts'
} as const;
export const GhWorkflowExampleMap = {
  'basic-workflow': 'user-flow-ci.yml'
} as const;
export const BudgetsExampleMap = {
  'budgets': 'lh-budgets.json'
} as const;
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
export const PROMPT_INIT_GENERATE_FLOW = 'Setup user flow';
