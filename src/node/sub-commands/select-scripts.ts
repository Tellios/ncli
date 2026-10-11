import {selectItems} from '../../common/index.ts';
import {executeParallellPackageJsonScripts} from '../utils/index.ts';

export async function selectScripts(
  packageJson: NcliNode.PackageJson,
  directory: string,
): Promise<void> {
  const scripts = Object.keys(packageJson.scripts);
  const selectedIndexes = await selectItems({
    items: scripts,
    message: 'Select the scripts to run in parallell',
  });
  const selectedScripts = selectedIndexes.map((index) => scripts[index]);

  await executeParallellPackageJsonScripts(
    selectedScripts,
    packageJson.scripts,
    directory,
  );
}
