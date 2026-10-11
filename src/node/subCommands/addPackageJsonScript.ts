import {inputString} from '../../common/index.ts';
import {
  updatePackageJson,
  validateScript,
  validateScriptName,
} from '../utils/index.ts';

export async function addPackageJsonScript(
  workingDirectory: string,
  packageJson: NcliNode.IPackageJson,
): Promise<void> {
  const name = await inputString(
    'Script name:',
    validateScriptName(packageJson.scripts),
  );
  const script = await inputString('Script:', validateScript);

  packageJson.scripts[name] = script;

  await updatePackageJson(workingDirectory, packageJson);
}
