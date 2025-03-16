export type Entry<T, K extends keyof T> = [K, T[K]];

export type Entries<T> = {
  [K in keyof T]: Entry<T, K>;
}[keyof T][];

export const objectEntries = <T extends object>(obj: T): Entries<T> =>
  Object.entries(obj) as Entries<T>;
export const objectFromEntries = <T>(entries: Entries<T>): T =>
  Object.fromEntries(entries) as T;

export const mapObjectEntries = <
  T extends object,
  R extends {
    [K in keyof T]: R[K];
  }
>(
  obj: T,
  fn: <K extends keyof T>(entry: Entry<T, K>) => Entry<R, K>
): R => objectFromEntries(objectEntries(obj).map(fn));
