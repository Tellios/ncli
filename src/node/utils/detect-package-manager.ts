import path from 'node:path';
import {pathExists, readJson} from 'fs-extra';

export type PackageManager = 'npm' | 'yarn' | 'pnpm';

const packageManagers: PackageManager[] = ['npm', 'yarn', 'pnpm'];

const lockFiles: Array<[string, PackageManager]> = [
  ['pnpm-lock.yaml', 'pnpm'],
  ['yarn.lock', 'yarn'],
  ['package-lock.json', 'npm'],
];

/**
 Walks from the directory up to the git repository root (or the
 file system root), returning the first value found by the visitor.
 */
async function findUpwards<T>(
  directory: string,
  visit: (directory: string) => Promise<T | undefined>,
): Promise<T | undefined> {
  let currentDirectory = path.resolve(directory);

  for (;;) {
    const result = await visit(currentDirectory);

    if (result !== undefined) {
      return result;
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
 Reads the package manager from the "packageManager" field in
 package.json, e.g. "pnpm@9.0.0+sha512...".
 */
async function readPackageManagerField(
  directory: string,
): Promise<PackageManager | undefined> {
  const packageJsonPath = path.join(directory, 'package.json');

  if (!(await pathExists(packageJsonPath))) {
    return undefined;
  }

  try {
    const {packageManager} = await readJson(packageJsonPath);

    if (typeof packageManager !== 'string') {
      return undefined;
    }

    const name = packageManager.split('@', 1)[0];
    return packageManagers.find((pm) => pm === name);
  } catch {
    return undefined;
  }
}

async function findLockFile(
  directory: string,
): Promise<PackageManager | undefined> {
  for (const [lockFile, packageManager] of lockFiles) {
    if (await pathExists(path.join(directory, lockFile))) {
      return packageManager;
    }
  }

  return undefined;
}

/**
 Finds the package manager of the directory. The "packageManager"
 field in package.json takes precedence, since it is what Corepack
 enforces, and stale lock files would otherwise be picked up. When
 no package.json declares it, the lock file is used instead. Both
 are searched for in the directory and its ancestors, as workspace
 packages share the configuration of the monorepo root. The search
 stops at the git repository root.
 */
export async function detectPackageManager(
  directory: string,
): Promise<PackageManager | undefined> {
  return (
    (await findUpwards(directory, readPackageManagerField)) ??
    (await findUpwards(directory, findLockFile))
  );
}

/**
 Detects the package manager, see detectPackageManager.
 Defaults to npm when nothing is found.
 */
export async function detectPackageManagerOrUseDefault(
  directory: string,
): Promise<PackageManager> {
  return (await detectPackageManager(directory)) ?? 'npm';
}
