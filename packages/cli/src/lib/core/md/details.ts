import { NEW_LINE } from './constants';

export function details(title: string, content: string): string {
  return `<details>${NEW_LINE}
<summary>${title}</summary>${NEW_LINE}
${content}${NEW_LINE}
</details>${NEW_LINE}`;
}
