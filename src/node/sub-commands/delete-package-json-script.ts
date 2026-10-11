import {confirm} from '../../common/index.ts';
import {selectScript, updatePackageJson} from '../utils/index.ts';

export async function deletePackageJsonScript(
  workingDirectory: string,
  packageJson: NcliNode.PackageJson,
): Promise<void> {
  const selectedScript = await selectScript(packageJson.scripts);

  if (
    !(await confirm(`Are you sure you want to delete '${selectedScript}'?`))
  ) {
    return;
  }

  delete packageJson.scripts[selectedScript];
  await updatePackageJson(workingDirectory, packageJson);
}
