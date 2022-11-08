// @NOTICE the first value in the array is pre-selected as a default value
export const REPORT_FORMAT_OPTIONS = [
  { name: 'HTML', value: 'html', hint: 'default' },
  { name: 'JSON', value: 'json' },
  { name: 'Markdown', value: 'md' },
  { name: 'Stdout', value: 'stdout' }
];
export const REPORT_FORMAT_VALUES: string[] = REPORT_FORMAT_OPTIONS.map(v => v.value) as any as string[];
