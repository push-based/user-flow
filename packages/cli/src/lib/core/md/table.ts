import { formatCode } from '../prettier';

export type Alignment = 'l' | 'c' | 'r';
const alignString = new Map<Alignment, string>([['l', ':--'],['c', ':--:'],['r', '--:']]);

export function table(data: string[][], align: Alignment[]): string {
  const _data = data.map((arr) => arr.join('|'));
  const secondRow = align.map((s) => alignString.get(s)).join('|');
  return formatCode(_data.shift() + '\n' + secondRow + '\n' + _data.join('\n'), 'markdown');
}
