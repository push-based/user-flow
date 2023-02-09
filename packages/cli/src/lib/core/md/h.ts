export function headline(text: string, hierarchy: number): string {
      return `${new Array(hierarchy).fill('#').join('')} ${text}`;
}
