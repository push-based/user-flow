import { REPORT_FORMAT_VALUES } from '../constants.js';
import { ReportFormat } from './types.js';

export const PERSIST_FORMAT_HTML: ReportFormat = 'html';
/**
 * @deprecated
 * Use PERSIST_FORMAT_HTML instead and wrap it with an array
 */
export const DEFAULT_PERSIST_FORMAT: ReportFormat[] = [PERSIST_FORMAT_HTML];
export const PROMPT_PERSIST_FORMAT = 'What is the format of user-flow reports? (use ⬇/⬆ to navigate, and SPACE key to select)';
export const ERROR_PERSIST_FORMAT_REQUIRED = 'format is required. Either through the console as `--format` or in the `.user-flow.json`';
export const ERROR_PERSIST_FORMAT_WRONG = (wrongFormat: string) => {
  return `Argument: format, Given: "${wrongFormat}", Choices: ${REPORT_FORMAT_VALUES.map(v => '"' + v + '"').join(', ')}`;
  // @TODO decide for yergs error handling od custom for choices
  // return `Wrong format: "${wrongFormat}". Format has to be one of: ${REPORT_FORMAT_OPTIONS.map(f => f.value ).join(', ')}`;
};

