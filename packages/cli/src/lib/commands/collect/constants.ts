// @NOTICE the first value in the array is pre-selected as a default value
import { ReportFormat } from './options/types.js';
import { REPORT_FORMAT } from '../init/constants.js';

export const REPORT_FORMAT_OPTIONS = [
  { name: 'HTML', value: REPORT_FORMAT.HTML, hint: 'default' },
  { name: 'JSON', value: REPORT_FORMAT.JSON },
  { name: 'Markdown', value: REPORT_FORMAT.Markdown },
  { name: 'Stdout', value: REPORT_FORMAT.Stdout }
];

export const REPORT_FORMAT_NAMES: string[] = REPORT_FORMAT_OPTIONS.map(v => v.name) as any as string[];
export const REPORT_FORMAT_VALUES: ReportFormat[] = REPORT_FORMAT_OPTIONS.map(v => v.value) as any as ReportFormat[];
