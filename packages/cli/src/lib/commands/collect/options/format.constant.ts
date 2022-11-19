import { REPORT_FORMAT_OPTIONS } from '../constants';
import { ReportFormat } from './types';

export const DEFAULT_PERSIST_FORMAT: ReportFormat[] = ['html'];
export const PROMPT_PERSIST_FORMAT = 'What is the format of user-flow reports? (use ⬇/⬆ to navigate, and SPACE key to select)';
export const ERROR_PERSIST_FORMAT_REQUIRED = 'format is required. Either through the console as `--format` or in the `.user-flow.json`';
export const ERROR_PERSIST_FORMAT_WRONG = (wrongFormat: string) => {
  return `Wrong format: "${wrongFormat}". Format has to be one of: ${REPORT_FORMAT_OPTIONS.map(f => f.value).join(', ')}`;
}

