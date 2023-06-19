/* @TODO add description => explain functionality*/
export type Modify<T, R> = Omit<T, keyof R> & R;

/**
 * Type to pluck out a key value pain of an existing type
 *
 * @example
 *
 * type Example = {
 * key1: number;
 * key2: string;
 * }
 *
 * type Example2 = PickOne<Example>;
 *
 * const a: Example2 = { key1: 1 } // correct
 * const b: Example2 = { key1: "1" } // incorrect - string cannot be assigned to number
 * const c: Example2 = { key2: 'a' } // correct
 * const d: Example2 = { key3: 'a' } // incorrect - unknown property
 *
 */
export type PickOne<T> = {
  [P in keyof T]?: Record<P, T[P]>;
}[keyof T];
