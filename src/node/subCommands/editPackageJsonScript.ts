import {editString} from '../../common/index.ts';
import {
  selectScript,
  updatePackageJson,
  validateScript,
} from '../utils/index.ts';

export async function editPackageJsonScript(
  workingDirectory: string,
  packageJson: NcliNode.IPackageJson,
): Promise<void> {
  const selectedScript = await selectScript(packageJson.scripts);
  const script = packageJson.scripts[selectedScript];

  let newScript = await editString('Edit script:', script, validateScript);
  newScript = newScript.replaceAll('\n', ' ').trim();

  packageJson.scripts[selectedScript] = newScript;

  await updatePackageJson(workingDirectory, packageJson);
}
