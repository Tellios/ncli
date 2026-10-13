import path from 'node:path';

export function resolvePackageJsonFile(directory: string): string {
  return path.join(directory, 'package.json');
}
