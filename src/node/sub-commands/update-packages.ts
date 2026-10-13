import { type Workspace } from '../utils/index.ts';
import type { PackageJson } from '../types.ts';
import { selectPackages } from './select-packages.ts';
import { installPackages } from './install-packages.ts';

export async function updatePackages(
  workingDirectory: string,
  packageJson: PackageJson,
  saveExact: boolean,
  searchString: string | undefined,
  workspace: Workspace | undefined
): Promise<void> {
  const packages = await selectPackages(packageJson, searchString);
  const addLatestSuffix = (name: string): string => `${name}@latest`;

  const packagesToUpdate = packages
    .filter((p) => !p.dev)
    .map((p) => p.name)
    .map(addLatestSuffix);
  const devPackagesToUpdate = packages
    .filter((p) => p.dev)
    .map((p) => p.name)
    .map(addLatestSuffix);

  await installPackages(
    workingDirectory,
    packagesToUpdate,
    devPackagesToUpdate,
    'ignore',
    saveExact,
    workspace
  );
}
