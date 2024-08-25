export function array(k: string, v: string[]): string {
  let values = (v).map(i => '\'' + i + '\'').join(', ');
  values = values !== '' ? ' ' + values + ' ' : values;
  return `${k}: [${values}]`;
}
