
/**
 * Upper or camelCase to lowercase hyphenated
 */
export function toFileName(s: string): string {
  return s
    // if url
    .replace(/((http)s*:\/\/)/g, '')
    // if url port
    .replace(/:/, '-')
    // if camelcase split with "_"
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    // make all letters lowercase
    .toLowerCase()
    // replace " ", "/"  and "_"
    .replace(/[ _\/]/g, '-')
}
