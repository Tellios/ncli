import * as path from 'path';
import { pathExists } from 'fs-extra';

export type PackageManager = 'npm' | 'yarn' | 'pnpm';

const lockFiles: [string, PackageManager][] = [
  ['pnpm-lock.yaml', 'pnpm'],
  ['yarn.lock', 'yarn'],
  ['package-lock.json', 'npm']
];

/**
 * Finds the package manager by looking for a lock file in the
 * directory and its ancestors. Walking upwards is required for
 * workspace packages, which share the lock file of the monorepo root.
 * The search stops at the git repository root.
 */
export async function detectPackageManager(
  directory: string
): Promise<PackageManager | undefined> {
  let currentDirectory = path.resolve(directory);

  for (;;) {
    for (const [lockFile, packageManager] of lockFiles) {
      if (await pathExists(path.join(currentDirectory, lockFile))) {
        return packageManager;
      }
    }

    const parentDirectory = path.dirname(currentDirectory);

    if (
      parentDirectory === currentDirectory ||
      (await pathExists(path.join(currentDirectory, '.git')))
    ) {
      return undefined;
    }

    currentDirectory = parentDirectory;
  }
}

/**
 * Detects the package manager from the lock file, see
 * detectPackageManager. Defaults to npm when no lock file is found.
 */
export async function detectPackageManagerOrUseDefault(
  directory: string
): Promise<PackageManager> {
  return (await detectPackageManager(directory)) ?? 'npm';
}
