import { ConsoleInterface, runCmdInConsole } from '../../common';
import { selectPackages } from './selectPackages';
import { containsPackageLockFile, containsYarnLockFile } from '../utils';

export async function uninstallPackages(
  workingDirectory: string,
  packageJson: NcliNode.IPackageJson,
  searchString: string | undefined,
  workspace: string | undefined
): Promise<void> {
  const packages = await selectPackages(packageJson, searchString);
  const packageNames = packages.map((p) => p.name);

  if (await containsYarnLockFile(workingDirectory)) {
    await runCmdInConsole('yarn', ['remove', ...packageNames]);
  } else if (await containsPackageLockFile(workingDirectory)) {
    const args = ['uninstall'];
    workspace && args.push('--workspace', workspace);
    args.push(...packageNames);

    await runCmdInConsole('npm', args);
  } else {
    ConsoleInterface.printLine('No yarn or npm lock file found');
  }
}
