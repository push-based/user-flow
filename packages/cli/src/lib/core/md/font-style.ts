const stylesMap = {
  i: '*', // italic
  b: '**', // bold
  s: '~', // strike through
} as const;

export type FontStyle = keyof typeof stylesMap;

export function style(text: string, styles: FontStyle[]): string {
    return styles.reduce((t, s) => `${stylesMap[s]}${t}${stylesMap[s]}`, text);
}
