export function toIsoLikeString(date: Date): string {
  return date.toISOString().replace(/[\-\:]/gm, '').split('.').shift() as string;
}
