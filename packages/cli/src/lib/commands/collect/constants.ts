export const REPORT_FORMAT_OPTIONS = [
  { name: 'HTML', value: 'html' },
  { name: 'JSON', value: 'json' },
  { name: 'Markdown', value: 'md' },
  { name: 'Stdout', value: 'stdout'}
];
export const REPORT_FORMAT_VALUES: string[] = REPORT_FORMAT_OPTIONS.map(v => v.value) as any as string[];
