type Hierarchy = 1 | 2 | 3 | 4 | 5 | 6;
export function headline(text: string, hierarchy: Hierarchy = 1): string {
      return `${new Array(hierarchy).fill('#').join('')} ${text}`;
}
