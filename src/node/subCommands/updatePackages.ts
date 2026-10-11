import {type Workspace} from '../utils/index.ts';
import {selectPackages} from './selectPackages.ts';
import {installPackages} from './installPackages.ts';

export async function updatePackages(
  workingDirectory: string,
  packageJson: NcliNode.IPackageJson,
  saveExact: boolean,
  searchString: string | undefined,
  workspace: Workspace | undefined,
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
    workspace,
  );
}
