// @NOTICE the first value in the array is pre-selected as a default value
import { ReportFormat } from './options/types.js';

export const REPORT_FORMAT_OPTIONS: { name: string; value: ReportFormat; hint?: string }[] = [
  { name: 'HTML', value: 'html', hint: 'default' },
  { name: 'JSON', value: 'json' },
  { name: 'Markdown', value: 'md' },
  { name: 'Stdout', value: 'stdout' }
];
export const REPORT_FORMAT_NAMES: string[] = REPORT_FORMAT_OPTIONS.map(v => v.name);
export const REPORT_FORMAT_VALUES: ReportFormat[] = REPORT_FORMAT_OPTIONS.map(v => v.value);
