export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

const objectEntries = <T>(obj: T): Entries<T> =>
  Object.entries(obj) as Entries<T>;
const objectFromEntries = <T>(entries: Entries<T>): T =>
  Object.fromEntries(entries) as T;

export const mapObjectEntries = <T, R>(
  obj: T,
  fn: <K extends number>(entry: Entries<T>[K]) => Entries<R>[K]
): R => objectFromEntries(objectEntries(obj).map(fn));
