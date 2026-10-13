import { confirm } from '../../common/index.ts';
import { selectScript, updatePackageJson } from '../utils/index.ts';
import type { PackageJson } from '../types.ts';

export async function deletePackageJsonScript(
  workingDirectory: string,
  packageJson: PackageJson
): Promise<void> {
  const selectedScript = await selectScript(packageJson.scripts);

  if (
    !(await confirm(`Are you sure you want to delete '${selectedScript}'?`))
  ) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete packageJson.scripts[selectedScript];
  await updatePackageJson(workingDirectory, packageJson);
}
