/**
Quote a string for POSIX `sh -c` / `script -c` usage.
*/
export const shellQuote = (value: string): string =>
  /^[\w%+,\-.\/:=@]+$/v.test(value)
    ? value
    : `'${value.replaceAll("'", String.raw`'\''`)}'`;
