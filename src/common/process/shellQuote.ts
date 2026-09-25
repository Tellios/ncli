/** Quote a string for POSIX `sh -c` / `script -c` usage. */
export const shellQuote = (value: string): string => {
  if (/^[A-Za-z0-9_@%+=:,./-]+$/.test(value)) {
    return value;
  }

  return `'${value.replace(/'/g, `'\\''`)}'`;
};
